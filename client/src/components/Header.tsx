import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingBag, Phone, Home, Info } from "lucide-react";

const LOGO_URL = "/manus-storage/djmoveis-logo_3bfa6783.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Início", icon: <Home size={16} /> },
    { href: "/catalogo", label: "Catálogo", icon: <ShoppingBag size={16} /> },
    { href: "/loja", label: "Nossa Loja", icon: <Info size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: "#0D1B3E" }}>
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img src={LOGO_URL} alt="DJ Móveis" className="w-12 h-12 rounded-full object-cover" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg tracking-wide" style={{ color: "#D4A017", fontFamily: "Montserrat, sans-serif" }}>
                DJ MÓVEIS
              </span>
              <span className="text-xs text-white/70" style={{ fontFamily: "Open Sans, sans-serif" }}>
                Uberlândia - MG
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location === link.href
                    ? "text-[#0D1B3E] font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                style={location === link.href ? { backgroundColor: "#D4A017" } : {}}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* WhatsApp CTA */}
          <a
            href="https://api.whatsapp.com/send?phone=5534991818080&text=Olá! Vi o catálogo da DJ Móveis e gostaria de mais informações."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}
          >
            <Phone size={16} />
            WhatsApp
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1 ${
                  location === link.href
                    ? "text-[#0D1B3E] font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                style={location === link.href ? { backgroundColor: "#D4A017" } : {}}
                onClick={() => setMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <a
              href="https://api.whatsapp.com/send?phone=5534991818080&text=Olá! Vi o catálogo da DJ Móveis e gostaria de mais informações."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold mt-2"
              style={{ backgroundColor: "#D4A017", color: "#0D1B3E" }}
            >
              <Phone size={16} />
              Falar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
