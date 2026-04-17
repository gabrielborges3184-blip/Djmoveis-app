import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from "lucide-react";

export default function AdminSetup() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { data: setupData } = trpc.admin.needsSetup.useQuery();

  useEffect(() => {
    if (setupData && !setupData.needsSetup) navigate("/admin");
  }, [setupData]);

  const setupMutation = trpc.admin.setup.useMutation({
    onSuccess: () => {
      toast.success("Conta criada! Faça login para continuar.");
      navigate("/admin");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao criar conta");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setupMutation.mutate({ name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#0D1B3E" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/manus-storage/djmoveis-logo_3bfa6783.png" alt="DJ Móveis" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
            DJ MÓVEIS
          </h1>
          <p className="text-white/60">Configuração inicial do painel</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
              <ShieldCheck size={20} style={{ color: "#D4A017" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>Criar conta de administrador</h2>
              <p className="text-sm text-gray-500">Primeiro acesso ao painel</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nome</Label>
              <div className="relative mt-1.5">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10"
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

            <div>
              <Label htmlFor="confirm" className="text-sm font-semibold text-gray-700">Confirmar senha</Label>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 font-bold text-base rounded-xl mt-2"
              style={{ backgroundColor: "#0D1B3E", color: "#fff" }}
              disabled={setupMutation.isPending}
            >
              {setupMutation.isPending ? "Criando conta..." : "Criar conta de administrador"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
