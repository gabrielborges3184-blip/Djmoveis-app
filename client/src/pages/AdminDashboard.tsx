import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, Package, Upload, X, ImageIcon, Search, LayoutGrid, List, Eye, EyeOff } from "lucide-react";

type ProductForm = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
  imageKey: string;
  featured: boolean;
  active: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  imageUrl: "",
  imageKey: "",
  featured: false,
  active: true,
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const { data: meData, isLoading: meLoading } = trpc.admin.me.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products, isLoading: productsLoading } = trpc.productsAdmin.list.useQuery();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!meLoading && !meData) navigate("/admin");
  }, [meData, meLoading]);

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => { navigate("/admin"); },
  });

  const createMutation = trpc.productsAdmin.create.useMutation({
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      utils.productsAdmin.list.invalidate();
      utils.products.list.invalidate();
      closeForm();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.productsAdmin.update.useMutation({
    onSuccess: () => {
      toast.success("Produto atualizado!");
      utils.productsAdmin.list.invalidate();
      utils.products.list.invalidate();
      closeForm();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.productsAdmin.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto removido!");
      utils.productsAdmin.list.invalidate();
      utils.products.list.invalidate();
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const uploadMutation = trpc.productsAdmin.uploadImage.useMutation({
    onSuccess: (data) => {
      setForm(f => ({ ...f, imageUrl: data.url, imageKey: data.key }));
      setImagePreview(data.url);
      toast.success("Imagem enviada!");
    },
    onError: (err) => toast.error("Erro ao enviar imagem: " + err.message),
  });

  const toggleActiveMutation = trpc.productsAdmin.update.useMutation({
    onSuccess: () => {
      utils.productsAdmin.list.invalidate();
      utils.products.list.invalidate();
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (p: NonNullable<typeof products>[0]) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price ? String(p.price) : "",
      categoryId: String(p.categoryId),
      imageUrl: p.imageUrl || "",
      imageKey: p.imageKey || "",
      featured: p.featured,
      active: p.active,
    });
    setImagePreview(p.imageUrl || "");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview("");
  };

  const handleImageFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 5MB.");
      return;
    }
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      uploadMutation.mutate({ fileName: file.name, fileType: file.type, fileData: base64 });
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.categoryId) {
      toast.error("Nome e categoria são obrigatórios");
      return;
    }
    const data = {
      name: form.name,
      description: form.description || undefined,
      price: form.price || undefined,
      categoryId: parseInt(form.categoryId),
      imageUrl: form.imageUrl || undefined,
      imageKey: form.imageKey || undefined,
      featured: form.featured,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data, active: form.active });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredProducts = (products || []).filter(p => {
    const matchSearch = searchTerm
      ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchCat = filterCat !== "all" ? p.categoryId === parseInt(filterCat) : true;
    return matchSearch && matchCat;
  });

  const getCategoryName = (id: number) => categories?.find(c => c.id === id)?.name || "—";

  if (meLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: "#0D1B3E" }}>
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/djmoveis-logo_3bfa6783.png" alt="DJ Móveis" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <span className="font-bold text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>DJ MÓVEIS</span>
              <span className="text-white/50 text-xs ml-2">Painel Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {meData && (
              <span className="hidden md:block text-white/70 text-sm">
                Olá, <span className="text-white font-semibold">{meData.name}</span>
              </span>
            )}
            <a href="/" target="_blank" className="text-white/60 hover:text-white text-sm transition-colors hidden md:block">
              Ver site
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <LogOut size={16} className="mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de Produtos", value: products?.length || 0, color: "#0D1B3E" },
            { label: "Ativos", value: products?.filter(p => p.active).length || 0, color: "#16a34a" },
            { label: "Em Destaque", value: products?.filter(p => p.featured).length || 0, color: "#D4A017" },
            { label: "Categorias", value: categories?.length || 0, color: "#7c3aed" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-3xl font-extrabold mb-1" style={{ color: stat.color, fontFamily: "Montserrat, sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Select value={filterCat} onValueChange={setFilterCat}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {(categories || []).map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "text-white" : "text-gray-400 hover:bg-gray-100"}`} style={viewMode === "grid" ? { backgroundColor: "#0D1B3E" } : {}}>
                  <LayoutGrid size={18} />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "text-white" : "text-gray-400 hover:bg-gray-100"}`} style={viewMode === "list" ? { backgroundColor: "#0D1B3E" } : {}}>
                  <List size={18} />
                </button>
              </div>
            </div>
            <Button
              onClick={openCreate}
              className="font-bold shrink-0"
              style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}
            >
              <Plus size={18} className="mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        {/* Products */}
        {productsLoading ? (
          <div className="text-center py-16 text-gray-400">Carregando produtos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#0D1B3E" }}>
              <Package size={28} style={{ color: "#D4A017" }} />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-400 mb-6">Adicione seu primeiro produto clicando em "Novo Produto"</p>
            <Button onClick={openCreate} style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }} className="font-bold">
              <Plus size={18} className="mr-2" /> Adicionar Produto
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(p => (
              <div key={p.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${!p.active ? "opacity-60" : "hover:shadow-md"}`}>
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
                      <ImageIcon size={40} style={{ color: "#D4A017" }} />
                    </div>
                  )}
                  {p.featured && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}>
                      Destaque
                    </div>
                  )}
                  {!p.active && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-500 text-white">
                      Inativo
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs font-medium text-gray-500 mb-1">{getCategoryName(p.categoryId)}</div>
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{p.name}</h3>
                  {p.price && (
                    <p className="font-bold text-sm mb-3" style={{ color: "#D4A017" }}>
                      R$ {Number(p.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="flex-1 text-xs">
                      <Pencil size={14} className="mr-1" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActiveMutation.mutate({ id: p.id, active: !p.active })}
                      className="px-2"
                      title={p.active ? "Desativar" : "Ativar"}
                    >
                      {p.active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteId(p.id)} className="px-2 text-red-500 hover:text-red-600 hover:border-red-300">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: "#0D1B3E" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Produto</th>
                  <th className="text-left px-4 py-3 text-white font-semibold hidden md:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 text-white font-semibold hidden lg:table-cell">Preço</th>
                  <th className="text-left px-4 py-3 text-white font-semibold">Status</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, i) => (
                  <tr key={p.id} className={`border-b last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
                              <ImageIcon size={16} style={{ color: "#D4A017" }} />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{getCategoryName(p.categoryId)}</td>
                    <td className="px-4 py-3 font-semibold hidden lg:table-cell" style={{ color: p.price ? "#D4A017" : "#9ca3af" }}>
                      {p.price ? `R$ ${Number(p.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.active ? "default" : "secondary"} className={p.active ? "bg-green-100 text-green-700" : ""}>
                        {p.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                          <Pencil size={14} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleActiveMutation.mutate({ id: p.id, active: !p.active })}>
                          {p.active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteId(p.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={open => { if (!open) closeForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Montserrat, sans-serif" }}>
              {editingId ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Upload de Imagem */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">Foto do Produto</Label>
              <div
                className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-[#D4A017] transition-colors"
                style={{ borderColor: imagePreview ? "#D4A017" : "#e5e7eb" }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleImageFile(file);
                }}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setImagePreview(""); setForm(f => ({ ...f, imageUrl: "", imageKey: "" })); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="py-6">
                    {uploadingImage || uploadMutation.isPending ? (
                      <div className="text-gray-500">Enviando imagem...</div>
                    ) : (
                      <>
                        <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Clique ou arraste uma imagem aqui</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — máx. 5MB</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700">Nome do Produto *</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Rack para TV 65 polegadas"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Categoria *</Label>
                <Select value={form.categoryId} onValueChange={v => setForm(f => ({ ...f, categoryId: v }))}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories || []).map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Preço (R$)</Label>
                <Input
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="Ex: 1299.90"
                  type="number"
                  step="0.01"
                  min="0"
                  className="mt-1.5"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700">Descrição</Label>
                <Textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descreva o produto, dimensões, materiais, etc."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Produto em destaque</span>
                </label>
                {editingId && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Produto ativo</span>
                  </label>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>Cancelar</Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                style={{ backgroundColor: "#0D1B3E", color: "#fff" }}
                className="font-bold"
              >
                {(createMutation.isPending || updateMutation.isPending) ? "Salvando..." : editingId ? "Salvar alterações" : "Criar produto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={open => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será removido permanentemente do catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
