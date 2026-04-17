import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock DB helpers
vi.mock("./db", () => ({
  getAdminByEmail: vi.fn(),
  getAdminById: vi.fn(),
  createAdminUser: vi.fn(),
  countAdminUsers: vi.fn(),
  getAllCategories: vi.fn(),
  getAllProducts: vi.fn(),
  getAllProductsAdmin: vi.fn(),
  getProductById: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

import {
  countAdminUsers,
  createAdminUser,
  getAllCategories,
  getAllProducts,
  getProductById,
  getAdminByEmail,
  createProduct,
  getAdminById,
} from "./db";

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("admin.needsSetup", () => {
  it("returns needsSetup=true when no admin exists", async () => {
    vi.mocked(countAdminUsers).mockResolvedValue(0);
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.admin.needsSetup();
    expect(result.needsSetup).toBe(true);
  });

  it("returns needsSetup=false when admin exists", async () => {
    vi.mocked(countAdminUsers).mockResolvedValue(1);
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.admin.needsSetup();
    expect(result.needsSetup).toBe(false);
  });
});

describe("admin.setup", () => {
  it("creates admin when no admin exists", async () => {
    vi.mocked(countAdminUsers).mockResolvedValue(0);
    vi.mocked(createAdminUser).mockResolvedValue(undefined);
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.admin.setup({
      name: "Admin",
      email: "admin@djmoveis.com",
      password: "senha123",
    });
    expect(result.success).toBe(true);
    expect(createAdminUser).toHaveBeenCalledOnce();
  });

  it("throws FORBIDDEN when admin already exists", async () => {
    vi.mocked(countAdminUsers).mockResolvedValue(1);
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(
      caller.admin.setup({ name: "Admin", email: "admin@djmoveis.com", password: "senha123" })
    ).rejects.toThrow("Setup já realizado");
  });
});

describe("categories.list", () => {
  it("returns list of categories", async () => {
    const mockCategories = [
      { id: 1, name: "Sala de Estar", slug: "sala-de-estar", icon: "sofa", sortOrder: 1, createdAt: new Date() },
      { id: 2, name: "Quarto", slug: "quarto", icon: "bed", sortOrder: 2, createdAt: new Date() },
    ];
    vi.mocked(getAllCategories).mockResolvedValue(mockCategories);
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.categories.list();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Sala de Estar");
    expect(result[1].name).toBe("Quarto");
  });
});

describe("products.list", () => {
  it("returns active products", async () => {
    const mockProducts = [
      { id: 1, name: "Sofá 3 Lugares", categoryId: 1, active: true, featured: false, imageUrl: null, imageKey: null, description: null, price: null, createdAt: new Date(), updatedAt: new Date() },
    ];
    vi.mocked(getAllProducts).mockResolvedValue(mockProducts);
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.list({});
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Sofá 3 Lugares");
  });
});

describe("admin.login", () => {
  it("returns success and sets cookie for valid credentials", async () => {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("senha123", 10);
    vi.mocked(getAdminByEmail).mockResolvedValue({
      id: 1, name: "Admin", email: "admin@djmoveis.com",
      passwordHash: hash, createdAt: new Date(), updatedAt: new Date()
    });
    const ctx = createPublicCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.login({ email: "admin@djmoveis.com", password: "senha123" });
    expect(result.success).toBe(true);
    expect(result.email).toBe("admin@djmoveis.com");
  });

  it("throws UNAUTHORIZED for invalid password", async () => {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("senha123", 10);
    vi.mocked(getAdminByEmail).mockResolvedValue({
      id: 1, name: "Admin", email: "admin@djmoveis.com",
      passwordHash: hash, createdAt: new Date(), updatedAt: new Date()
    });
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(
      caller.admin.login({ email: "admin@djmoveis.com", password: "errada" })
    ).rejects.toThrow("Email ou senha inválidos");
  });

  it("throws UNAUTHORIZED for non-existent email", async () => {
    vi.mocked(getAdminByEmail).mockResolvedValue(undefined);
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(
      caller.admin.login({ email: "naoexiste@djmoveis.com", password: "senha123" })
    ).rejects.toThrow("Email ou senha inválidos");
  });
});

describe("products.byId", () => {
  it("returns product by id", async () => {
    const mockProduct = {
      id: 1, name: "Sofá 3 Lugares", categoryId: 1, active: true, featured: false,
      imageUrl: null, imageKey: null, description: "Sofá confortável", price: "1299.90",
      createdAt: new Date(), updatedAt: new Date()
    };
    vi.mocked(getProductById).mockResolvedValue(mockProduct);
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.byId({ id: 1 });
    expect(result.name).toBe("Sofá 3 Lugares");
    expect(result.price).toBe("1299.90");
  });

  it("throws NOT_FOUND for non-existent product", async () => {
    vi.mocked(getProductById).mockResolvedValue(undefined);
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.products.byId({ id: 999 })).rejects.toThrow("Produto não encontrado");
  });
});
