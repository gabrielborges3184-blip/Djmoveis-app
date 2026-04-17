import { Link } from "wouter";
import { Phone, MapPin, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#08122a" }} className="text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/manus-storage/djmoveis-logo_3bfa6783.png" alt="DJ Móveis" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-bold text-lg" style={{ color: "#D4A017", fontFamily: "Montserrat, sans-serif" }}>DJ MÓVEIS</div>
                <div className="text-xs text-white/60">Uberlândia - MG</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Design, qualidade e preço justo em um só lugar. Móveis que transformam sua casa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: "#D4A017", fontFamily: "Montserrat, sans-serif" }}>Navegação</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-[#D4A017] transition-colors">Início</Link></li>
              <li><Link href="/catalogo" className="hover:text-[#D4A017] transition-colors">Catálogo</Link></li>
              <li><Link href="/loja" className="hover:text-[#D4A017] transition-colors">Nossa Loja</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: "#D4A017", fontFamily: "Montserrat, sans-serif" }}>Contato</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "#D4A017" }} />
                <span>R. 7 de Setembro, 05 — Bairro Pacaembu, Uberlândia/MG</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} style={{ color: "#D4A017" }} />
                <a href="tel:+5534991818080" className="hover:text-[#D4A017] transition-colors">(34) 9181-8080</a>
              </li>
              <li className="flex items-center gap-3 mt-4">
                <a
                  href="https://www.instagram.com/djmoveis.udi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://www.facebook.com/djmoveisudi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=5534991818080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#25D366", color: "#fff" }}
                  aria-label="WhatsApp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} DJ Móveis — Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
