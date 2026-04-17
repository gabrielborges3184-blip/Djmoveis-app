import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";

export default function StoreInfo() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="py-10" style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #1a2d5a 100%)" }}>
        <div className="container">
          <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Nossa Loja
          </h1>
          <p className="text-white/70">Venha nos visitar em Uberlândia!</p>
        </div>
      </div>

      <div className="container py-12 flex-1">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Informações */}
          <div className="space-y-6">
            {/* Endereço */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
                  <MapPin size={20} style={{ color: "#D4A017" }} />
                </div>
                <h2 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>Endereços</h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 pl-4" style={{ borderColor: "#D4A017" }}>
                  <p className="font-semibold text-gray-800">Loja de Móveis</p>
                  <p className="text-gray-600 text-sm">R. 7 de Setembro, 05</p>
                  <p className="text-gray-600 text-sm">Bairro Pacaembu — Uberlândia/MG</p>
                </div>
                <div className="border-l-4 pl-4" style={{ borderColor: "#D4A017" }}>
                  <p className="font-semibold text-gray-800">Loja de Colchões</p>
                  <p className="text-gray-600 text-sm">R. 7 de Setembro, 38</p>
                  <p className="text-gray-600 text-sm">Bairro Pacaembu — Uberlândia/MG</p>
                </div>
              </div>
            </div>

            {/* Telefones */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
                  <Phone size={20} style={{ color: "#D4A017" }} />
                </div>
                <h2 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>Contato</h2>
              </div>
              <div className="space-y-3">
                <a href="tel:+5534991133526" className="flex items-center gap-3 text-gray-700 hover:text-[#D4A017] transition-colors">
                  <Phone size={16} className="text-gray-400" />
                  (34) 9911-3526
                </a>
                <a href="tel:+5534996807663" className="flex items-center gap-3 text-gray-700 hover:text-[#D4A017] transition-colors">
                  <Phone size={16} className="text-gray-400" />
                  (34) 9968-0766
                </a>
                <a href="tel:+5534321612117" className="flex items-center gap-3 text-gray-700 hover:text-[#D4A017] transition-colors">
                  <Phone size={16} className="text-gray-400" />
                  (34) 3216-1217
                </a>
              </div>
            </div>

            {/* Horário */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0D1B3E" }}>
                  <Clock size={20} style={{ color: "#D4A017" }} />
                </div>
                <h2 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>Horário de Funcionamento</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Segunda a Sexta</span>
                  <span className="font-semibold">08h - 18h</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Sábado</span>
                  <span className="font-semibold">08h - 13h</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Domingo</span>
                  <span>Fechado</span>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-800 text-lg mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Redes Sociais</h2>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/djmoveis.udi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold flex-1 justify-center transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff" }}
                >
                  <Instagram size={20} />
                  @djmoveis.udi
                </a>
                <a
                  href="https://www.facebook.com/djmoveisudi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold flex-1 justify-center transition-all hover:opacity-90"
                  style={{ backgroundColor: "#1877F2", color: "#fff" }}
                >
                  <Facebook size={20} />
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Mapa + CTA */}
          <div className="space-y-6">
            {/* Mapa embed */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                title="Localização DJ Móveis"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.5!2d-48.2835!3d-18.9186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a445b2e6d4d1e5%3A0x1!2sR.+7+de+Setembro%2C+5+-+Pacaembu%2C+Uberl%C3%A2ndia+-+MG!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* WhatsApp CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#0D1B3E" }}>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Fale conosco agora!
              </h3>
              <p className="text-white/70 text-sm mb-5">
                Tire suas dúvidas, faça seu pedido ou agende uma visita pelo WhatsApp.
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=5534991133526&text=Olá! Gostaria de mais informações sobre os móveis da DJ Móveis."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 w-full justify-center"
                style={{ backgroundColor: "#25D366", color: "#fff" }}
              >
                <MessageCircle size={22} />
                Abrir WhatsApp
              </a>
            </div>

            {/* Diferenciais */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Por que escolher a DJ Móveis?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  { icon: "🚚", text: "Entrega e montagem grátis em até 70 km" },
                  { icon: "💳", text: "Parcelamento em até 10x no boleto ou cartão" },
                  { icon: "✅", text: "Agilidade, credibilidade e compromisso" },
                  { icon: "🏠", text: "Móveis modernos com design e qualidade" },
                  { icon: "👷", text: "Equipe especializada em montagem" },
                ].map(item => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
