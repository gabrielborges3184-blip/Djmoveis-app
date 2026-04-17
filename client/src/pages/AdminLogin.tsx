import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { data: meData } = trpc.admin.me.useQuery();
  const { data: setupData } = trpc.admin.needsSetup.useQuery();

  useEffect(() => {
    if (meData) navigate("/admin/dashboard");
    if (setupData?.needsSetup) navigate("/admin/setup");
  }, [meData, setupData]);

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
      navigate("/admin/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao fazer login");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0D1B3E" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12" style={{ background: "linear-gradient(135deg, #08122a 0%, #0D1B3E 100%)" }}>
        <div className="text-center max-w-sm">
          <img src="/manus-storage/djmoveis-logo_3bfa6783.png" alt="DJ Móveis" className="w-20 h-20 rounded-full object-cover mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            DJ MÓVEIS
          </h1>
          <p className="text-white/60 text-lg">Painel Administrativo</p>
          <div className="mt-8 space-y-3 text-left">
            {["Gerencie seu catálogo de produtos", "Adicione fotos e descrições", "Organize por categorias", "Controle total da sua vitrine"].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/70 text-sm">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#D4A017" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="#0D1B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <img src="/manus-storage/djmoveis-logo_3bfa6783.png" alt="DJ Móveis" className="w-14 h-14 rounded-full object-cover mx-auto mb-3" />
              <p className="text-sm text-gray-500">Painel Administrativo</p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
                <ShieldCheck size={20} style={{ color: "#D4A017" }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>Acesso Restrito</h2>
                <p className="text-sm text-gray-500">Entre com suas credenciais</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail</Label>
                <div className="relative mt-1.5">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Senha</Label>
                <div className="relative mt-1.5">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 font-bold text-base rounded-xl"
                style={{ backgroundColor: "#0D1B3E", color: "#fff" }}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Entrando..." : "Entrar no Painel"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-gray-500 hover:text-[#D4A017] transition-colors">
                ← Voltar ao site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
