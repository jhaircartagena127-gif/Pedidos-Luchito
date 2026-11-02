import { BUSINESS_INFO } from "@/data/products";
import { MapPin, Phone, Clock, MessageCircle, Heart } from "lucide-react";
import { quickWhatsAppInfoUrl } from "@/lib/whatsapp";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-[#1e0705] text-white pt-16 pb-8 border-t-4 border-[#d92d20]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-12 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={BUSINESS_INFO.logo}
                alt="Logo Editorial Luchito"
                className="h-16 w-16 rounded-full border-2 border-red-500 shadow-md object-cover"
              />
              <div>
                <p className="font-display text-2xl tracking-tight text-white">
                  EDITORIAL LUCHITO
                </p>
                <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  {BUSINESS_INFO.slogan}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
              Editorial líder en textos escolares para Nivel Inicial y Primaria en Santa Cruz de la Sierra y toda Bolivia. Comprometidos con una educación práctica, ética y de excelencia.
            </p>

            <div className="pt-1">
              <a
                href={quickWhatsAppInfoUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebd5a] text-white text-xs font-extrabold px-4 py-2 rounded-full transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar por WhatsApp (+591 62185931)</span>
              </a>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display text-lg text-amber-300 tracking-wide uppercase">
              Ubicación y Contacto
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-neutral-300 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <b>Dirección central:</b> {BUSINESS_INFO.address}.
                  <br />
                  <span className="text-neutral-400 text-xs">Santa Cruz de la Sierra, Bolivia</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  <b>Llamadas y WhatsApp:</b>{" "}
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:underline text-white font-bold">
                    {BUSINESS_INFO.phone}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <b>Atención directa:</b> Lunes a Sábado
                </span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display text-lg text-amber-300 tracking-wide uppercase">
              Horarios de Atención
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-neutral-300 font-medium">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white">Lunes a Viernes:</p>
                  <p className="text-neutral-300">Mañana: 07:00 – 12:30</p>
                  <p className="text-neutral-300">Tarde: 14:00 – 18:30</p>
                  <p className="font-bold text-white pt-1">Sábados:</p>
                  <p className="text-neutral-300">08:00 – 13:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer credit */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          <p>© {currentYear} Editorial Luchito · Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5 font-medium">
            <span>Santa Cruz de la Sierra · Bolivia</span>
            <span>•</span>
            <span className="text-amber-300">"El arte de aprender"</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
