import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import {
  getAdminByEmail,
  getAdminById,
  createAdminUser,
  countAdminUsers,
  getAllCategories,
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./db";
import { storagePut } from "./storage";
import { TRPCError } from "@trpc/server";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "djmoveis-admin-secret-key-2024"
);

async function signAdminToken(adminId: number): Promise<string> {
  return new SignJWT({ adminId, type: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(ADMIN_JWT_SECRET);
}

async function verifyAdminToken(token: string): Promise<{ adminId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    if (payload.type !== "admin" || typeof payload.adminId !== "number") return null;
    return { adminId: payload.adminId as number };
  } catch {
    return null;
  }
}

// Middleware para verificar admin JWT do cookie
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const token = ctx.req.cookies?.["admin_token"];
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autenticado" });
  const payload = await verifyAdminToken(token);
  if (!payload) throw new TRPCError({ code: "UNAUTHORIZED", message: "Token inválido" });
  const admin = await getAdminById(payload.adminId);
  if (!admin) throw new TRPCError({ code: "UNAUTHORIZED", message: "Administrador não encontrado" });
  return next({ ctx: { ...ctx, admin } });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── Admin Auth ─────────────────────────────────────────────
  admin: router({
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const admin = await getAdminByEmail(input.email);
        if (!admin) throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou senha inválidos" });
        const valid = await bcrypt.compare(input.password, admin.passwordHash);
        if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou senha inválidos" });
        const token = await signAdminToken(admin.id);
        const isSecure = ctx.req.protocol === "https" || ctx.req.headers["x-forwarded-proto"] === "https";
        ctx.res.cookie("admin_token", token, {
          httpOnly: true,
          secure: isSecure,
          sameSite: isSecure ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        return { success: true, name: admin.name, email: admin.email };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie("admin_token", { path: "/" });
      return { success: true };
    }),

    me: publicProcedure.query(async ({ ctx }) => {
      const token = ctx.req.cookies?.["admin_token"];
      if (!token) return null;
      const payload = await verifyAdminToken(token);
      if (!payload) return null;
      const admin = await getAdminById(payload.adminId);
      if (!admin) return null;
      return { id: admin.id, name: admin.name, email: admin.email };
    }),

    // Criar primeiro admin (setup inicial)
    setup: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const count = await countAdminUsers();
        if (count > 0) throw new TRPCError({ code: "FORBIDDEN", message: "Setup já realizado" });
        const passwordHash = await bcrypt.hash(input.password, 10);
        await createAdminUser({ email: input.email, passwordHash, name: input.name });
        return { success: true };
      }),

    needsSetup: publicProcedure.query(async () => {
      const count = await countAdminUsers();
      return { needsSetup: count === 0 };
    }),
  }),

  // ── Categories ─────────────────────────────────────────────
  categories: router({
    list: publicProcedure.query(async () => {
      return getAllCategories();
    }),
  }),

  // ── Products (public) ──────────────────────────────────────
  products: router({
    list: publicProcedure
      .input(z.object({ categoryId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getAllProducts(input?.categoryId);
      }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Produto não encontrado" });
        return product;
      }),
  }),

  // ── Products Admin ─────────────────────────────────────────
  productsAdmin: router({
    list: adminProcedure.query(async () => {
      return getAllProductsAdmin();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string().optional(),
        categoryId: z.number(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        await createProduct({
          name: input.name,
          description: input.description ?? null,
          price: input.price ?? null,
          categoryId: input.categoryId,
          imageUrl: input.imageUrl ?? null,
          imageKey: input.imageKey ?? null,
          featured: input.featured ?? false,
          active: true,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        categoryId: z.number().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        featured: z.boolean().optional(),
        active: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateProduct(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteProduct(input.id);
        return { success: true };
      }),

    uploadImage: adminProcedure
      .input(z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileData: z.string(), // base64
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, "base64");
        const key = `products/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(key, buffer, input.fileType);
        return { url, key };
      }),
  }),
});

export type AppRouter = typeof appRouter;
