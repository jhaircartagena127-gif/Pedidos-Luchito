import { MessageCircle, ArrowDown, Award, Truck, CheckCircle2, Sparkles } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { quickWhatsAppInfoUrl } from "@/lib/whatsapp";
import { Product } from "@/types";

interface HeroProps {
  onSelectProduct: (p: Product) => void;
  onScrollToOrder: () => void;
}

export function Hero({ onSelectProduct, onScrollToOrder }: HeroProps) {
  const p2 = PRODUCTS.find((p) => p.id === "p2")!;
  const p3 = PRODUCTS.find((p) => p.id === "p3")!;
  const p5 = PRODUCTS.find((p) => p.id === "p5")!;
  const kinder = PRODUCTS.find((p) => p.id === "kinder")!;

  return (
    <section className="relative overflow-hidden bg-hero text-white pt-10 pb-16 md:py-20">
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs sm:text-sm font-extrabold text-white border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Editorial Luchito · Gestión Educativa 2026</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight text-white drop-shadow-sm">
              Multitextos <span className="text-amber-300">Luchito</span>
            </h1>

            <p className="font-display text-lg sm:text-xl text-red-100 font-normal tracking-wide">
              "El arte de aprender" · Santa Cruz de la Sierra, Bolivia
            </p>

            <p className="max-w-xl text-base sm:text-lg text-white/90 leading-relaxed font-medium">
              Textos educativos integrales para <b>Nivel Inicial</b> (Prekínder y Kínder) y <b>Primaria</b> (1ro a 6to). Cuatro áreas fundamentales articuladas junto al cuaderno taller <b>"Manos a la Obra"</b> para el desarrollo pleno de niñas y niños.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScrollToOrder}
                className="rounded-full bg-white text-[#b42318] hover:bg-amber-100 px-6 py-3.5 font-extrabold text-sm sm:text-base shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <span>Hacer Pedido en Línea</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href={quickWhatsAppInfoUrl()}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#25d366] hover:bg-[#1ebd5a] text-white border-2 border-transparent px-6 py-3.5 font-extrabold text-sm sm:text-base shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Pedir por WhatsApp</span>
              </a>
            </div>

            {/* Quick Guarantees / Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/20 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Currícula Oficial de Bolivia</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Envíos locales y nacionales</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Award className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Calidad pedagógica comprobada</span>
              </div>
            </div>
          </div>

          {/* Right Visual Book Showcase */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[360px] sm:h-[420px]">
              {/* Glow backdrop */}
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl transform scale-90" />

              {/* Book 1 - Left rotated (2do de Primaria) */}
              <button
                type="button"
                onClick={() => onSelectProduct(p2)}
                className="absolute left-2 top-8 w-36 sm:w-44 -rotate-8 rounded-xl overflow-hidden shadow-2xl border-2 border-white/50 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:z-30 cursor-pointer group text-left"
                title="Ver 2do de Primaria"
              >
                <img
                  src={p2.image}
                  alt="Multitexto 2do de Primaria"
                  className="w-full h-auto aspect-3/4 object-cover"
                />
                <div className="bg-black/80 text-white text-[10px] font-bold py-1 px-2 text-center group-hover:bg-[#d92d20] transition-colors">
                  2do Primaria · 230 Bs
                </div>
              </button>

              {/* Book 2 - Right rotated (5to de Primaria) */}
              <button
                type="button"
                onClick={() => onSelectProduct(p5)}
                className="absolute right-2 top-4 w-36 sm:w-44 rotate-8 rounded-xl overflow-hidden shadow-2xl border-2 border-white/50 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:z-30 cursor-pointer group text-left"
                title="Ver 5to de Primaria"
              >
                <img
                  src={p5.image}
                  alt="Multitexto 5to de Primaria"
                  className="w-full h-auto aspect-3/4 object-cover"
                />
                <div className="bg-black/80 text-white text-[10px] font-bold py-1 px-2 text-center group-hover:bg-[#d92d20] transition-colors">
                  5to Primaria · 230 Bs
                </div>
              </button>

              {/* Book 3 - Centerpiece (3ro de Primaria) */}
              <button
                type="button"
                onClick={() => onSelectProduct(p3)}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-42 sm:w-52 z-20 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-300 hover:scale-108 hover:z-40 cursor-pointer group text-left"
                title="Ver 3ro de Primaria"
              >
                <img
                  src={p3.image}
                  alt="Multitexto 3ro de Primaria"
                  className="w-full h-auto aspect-3/4 object-cover"
                />
                <div className="bg-[#b42318] text-white text-xs font-black py-1.5 px-3 flex items-center justify-between">
                  <span>3ro Primaria</span>
                  <span className="bg-amber-300 text-amber-950 px-2 py-0.5 rounded text-[10px]">230 Bs</span>
                </div>
              </button>

              {/* Small floating tag badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                Haz clic en un libro para verlo
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
