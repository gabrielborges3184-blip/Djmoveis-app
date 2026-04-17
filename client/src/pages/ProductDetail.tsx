import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Phone, Sofa, Tag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");

  const { data: product, isLoading, error } = trpc.products.byId.useQuery({ id: productId });
  const { data: categories } = trpc.categories.list.useQuery();

  const category = categories?.find(c => c.id === product?.categoryId);

  const whatsappMsg = product
    ? `Olá! Vi o produto *${product.name}* no catálogo da DJ Móveis e gostaria de mais informações.`
    : "Olá! Gostaria de mais informações sobre os produtos da DJ Móveis.";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container py-16 flex-1">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container py-16 flex-1 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
          <Link href="/catalogo" className="inline-flex items-center gap-2 font-semibold" style={{ color: "#D4A017" }}>
            <ArrowLeft size={18} /> Voltar ao catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container py-8 flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#D4A017] transition-colors">Início</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-[#D4A017] transition-colors">Catálogo</Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/catalogo?categoria=${category.slug}`} className="hover:text-[#D4A017] transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Imagem */}
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm aspect-square">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
                <Sofa size={80} style={{ color: "#D4A017" }} />
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="flex flex-col">
            {/* Categoria */}
            {category && (
              <Link
                href={`/catalogo?categoria=${category.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 w-fit hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#0D1B3E", color: "#D4A017" }}
              >
                <Tag size={14} />
                {category.name}
              </Link>
            )}

            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {product.name}
            </h1>

            {product.price && (
              <div className="mb-4">
                <span className="text-3xl font-extrabold" style={{ color: "#D4A017" }}>
                  R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
                <p className="text-sm text-gray-500 mt-1">Parcelamento em até 10x no boleto ou cartão</p>
              </div>
            )}

            {product.description && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Descrição</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Diferenciais */}
            <div className="rounded-xl p-4 mb-6 border" style={{ borderColor: "#D4A017", backgroundColor: "#fffbf0" }}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span>🚚</span> Entrega grátis até 70 km
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span>🔧</span> Montagem grátis
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span>💳</span> Até 10x no cartão
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span>✅</span> Qualidade garantida
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <a
                href={`https://api.whatsapp.com/send?phone=5534991133526&text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
                style={{ backgroundColor: "#25D366", color: "#fff" }}
              >
                <MessageCircle size={20} />
                Pedir pelo WhatsApp
              </a>
              <a
                href="tel:+5534991133526"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base border-2 transition-all hover:opacity-80"
                style={{ borderColor: "#0D1B3E", color: "#0D1B3E" }}
              >
                <Phone size={20} />
                Ligar
              </a>
            </div>

            <Link href="/catalogo" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4A017] transition-colors mt-6">
              <ArrowLeft size={16} />
              Voltar ao catálogo
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
