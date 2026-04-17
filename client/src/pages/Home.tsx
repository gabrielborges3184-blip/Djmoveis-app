import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sofa, Bed, UtensilsCrossed, Layers, Sparkles, Table2, ArrowRight, Phone, MapPin, Star } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "sala-de-estar": <Sofa size={32} />,
  "quarto": <Bed size={32} />,
  "cozinha": <UtensilsCrossed size={32} />,
  "sala-de-jantar": <Table2 size={32} />,
  "colchoes": <Layers size={32} />,
  "decoracao": <Sparkles size={32} />,
};

export default function Home() {
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products } = trpc.products.list.useQuery({});

  const featuredProducts = products?.filter(p => p.featured).slice(0, 4) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #1a2d5a 60%, #0D1B3E 100%)" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-4 border-white"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border-4 border-white"></div>
        </div>
        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}>
              <Star size={12} fill="currentColor" />
              Qualidade e Elegância
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Transforme sua casa com{" "}
              <span style={{ color: "#D4A017" }}>móveis de qualidade</span>
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Design, qualidade e preço justo em um só lugar. Entrega e montagem grátis em Uberlândia e região.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all hover:opacity-90"
                style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}
              >
                Ver Catálogo <ArrowRight size={18} />
              </Link>
              <a
                href="https://api.whatsapp.com/send?phone=5534991818080&text=Olá! Gostaria de mais informações sobre os móveis."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              >
                <Phone size={18} />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-8 border-b" style={{ backgroundColor: "#D4A017" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              { icon: "🚚", title: "Entrega Grátis", desc: "Em até 70 km" },
              { icon: "🔧", title: "Montagem Grátis", desc: "Equipe especializada" },
              { icon: "💳", title: "Até 10x", desc: "No boleto ou cartão" },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 justify-center">
                <span className="text-2xl">{item.icon}</span>
                <div className="text-left">
                  <div className="font-bold text-[#0D1B3E]" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.title}</div>
                  <div className="text-[#0D1B3E]/70 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2" style={{ color: "#0D1B3E", fontFamily: "Montserrat, sans-serif" }}>
              Nossas Categorias
            </h2>
            <p className="text-gray-500">Encontre o móvel perfeito para cada ambiente</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories || []).map(cat => (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border-2 border-transparent hover:border-[#D4A017] hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: "#0D1B3E", color: "#D4A017" }}>
                  {CATEGORY_ICONS[cat.slug] || <Sofa size={28} />}
                </div>
                <span className="text-sm font-semibold text-center text-gray-700 group-hover:text-[#0D1B3E]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-extrabold" style={{ color: "#0D1B3E", fontFamily: "Montserrat, sans-serif" }}>
                  Destaques
                </h2>
                <p className="text-gray-500 mt-1">Produtos selecionados especialmente para você</p>
              </div>
              <Link href="/catalogo" className="flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: "#D4A017" }}>
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <Link key={product.id} href={`/produto/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
                        <Sofa size={48} color="#D4A017" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1 line-clamp-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{product.name}</h3>
                    {product.price && (
                      <p className="font-bold text-lg" style={{ color: "#D4A017" }}>
                        R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Contato */}
      <section className="py-16" style={{ backgroundColor: "#0D1B3E" }}>
        <div className="container text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Pronto para transformar sua casa?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Entre em contato pelo WhatsApp ou visite nossa loja. Estamos prontos para te ajudar!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://api.whatsapp.com/send?phone=5534991818080&text=Olá! Gostaria de mais informações sobre os móveis."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
              style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}
            >
              <Phone size={20} />
              Falar no WhatsApp
            </a>
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base border-2 border-white/30 text-white hover:bg-white/10 transition-all"
            >
              <MapPin size={20} />
              Ver Endereço
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
