import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sofa, Bed, UtensilsCrossed, Layers, Sparkles, Table2, Search, Filter, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "sala-de-estar": <Sofa size={18} />,
  "quarto": <Bed size={18} />,
  "cozinha": <UtensilsCrossed size={18} />,
  "sala-de-jantar": <Table2 size={18} />,
  "colchoes": <Layers size={18} />,
  "decoracao": <Sparkles size={18} />,
};

export default function Catalog() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialSlug = params.get("categoria") || "";

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: allProducts, isLoading } = trpc.products.list.useQuery({});

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (initialSlug && categories) {
      const cat = categories.find(c => c.slug === initialSlug);
      if (cat) setSelectedCategoryId(cat.id);
    }
  }, [initialSlug, categories]);

  const filteredProducts = (allProducts || []).filter(p => {
    const matchCat = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
    const matchSearch = searchTerm
      ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });

  const getCategoryName = (id: number) => categories?.find(c => c.id === id)?.name || "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="py-10" style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #1a2d5a 100%)" }}>
        <div className="container">
          <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Catálogo de Produtos
          </h1>
          <p className="text-white/70">Encontre o móvel ideal para o seu lar</p>
        </div>
      </div>

      <div className="container py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtros */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={18} style={{ color: "#D4A017" }} />
                <h2 className="font-bold text-gray-800" style={{ fontFamily: "Montserrat, sans-serif" }}>Filtrar por</h2>
              </div>

              {/* Busca */}
              <div className="relative mb-5">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>

              {/* Categorias */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categorias</p>
                <button
                  onClick={() => setSelectedCategoryId(undefined)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                    !selectedCategoryId
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={!selectedCategoryId ? { backgroundColor: "#0D1B3E" } : {}}
                >
                  <Sofa size={16} />
                  Todos os produtos
                </button>
                {(categories || []).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id === selectedCategoryId ? undefined : cat.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                      selectedCategoryId === cat.id
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    style={selectedCategoryId === cat.id ? { backgroundColor: "#0D1B3E" } : {}}
                  >
                    <span style={selectedCategoryId === cat.id ? { color: "#D4A017" } : {}}>
                      {CATEGORY_ICONS[cat.slug] || <Sofa size={16} />}
                    </span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{filteredProducts.length}</span> produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#0D1B3E" }}>
                  <Sofa size={36} style={{ color: "#D4A017" }} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500 mb-6">Tente outro filtro ou entre em contato conosco.</p>
                <a
                  href="https://api.whatsapp.com/send?phone=5534991818080&text=Olá! Estou procurando um produto específico."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
                  style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}
                >
                  <Phone size={16} />
                  Consultar pelo WhatsApp
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Link key={product.id} href={`/produto/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-[#D4A017] transition-all">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
                          <Sofa size={56} style={{ color: "#D4A017" }} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-2" style={{ backgroundColor: "#0D1B3E", color: "#D4A017" }}>
                        {CATEGORY_ICONS[categories?.find(c => c.id === product.categoryId)?.slug || ""] || <Sofa size={12} />}
                        {getCategoryName(product.categoryId)}
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
                      )}
                      {product.price && (
                        <p className="font-bold text-lg" style={{ color: "#D4A017" }}>
                          R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
