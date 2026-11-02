import { useState } from "react";
import { BUSINESS_INFO } from "@/data/products";
import { ShoppingBag, MessageCircle, Menu, X, Phone, MapPin, Search, ShieldCheck } from "lucide-react";
import { quickWhatsAppInfoUrl } from "@/lib/whatsapp";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
}

export function Navbar({
  cartCount,
  onOpenCart,
  onOpenTracker,
  onOpenAdmin,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top micro-banner */}
      <div className="bg-[#7a1610] text-white text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              Santa Cruz de la Sierra · Calle Germán Herraes #125
            </span>
            <span className="hidden sm:inline-block opacity-60">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 font-medium">
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              +591 62185931
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTracker}
              className="text-amber-200 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
            >
              <Search className="w-3 h-3" />
              <span>Rastrear mi pedido</span>
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-amber-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
              title="Acceso panel de administración"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header className="sticky top-0 z-40 border-b border-red-100 bg-white/95 backdrop-blur shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#" className="flex items-center gap-3 group">
            <img
              src={BUSINESS_INFO.logo}
              alt="Editorial Luchito Santa Cruz"
              className="h-12 w-12 rounded-full border-2 border-red-600 shadow-sm object-cover group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-display text-xl sm:text-2xl tracking-tight text-[#d92d20] block leading-none">
                EDITORIAL LUCHITO
              </span>
              <span className="text-xs font-bold text-neutral-500 tracking-wide uppercase">
                Santa Cruz · El arte de aprender
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-neutral-700">
            <a href="#inicial" className="hover:text-[#d92d20] transition-colors">
              Nivel Inicial
            </a>
            <a href="#primaria" className="hover:text-[#d92d20] transition-colors">
              Primaria (1° a 6°)
            </a>
            <a href="#metodologia" className="hover:text-[#d92d20] transition-colors">
              Manos a la Obra
            </a>
            <a href="#preguntas" className="hover:text-[#d92d20] transition-colors">
              Preguntas
            </a>
            <a href="#contacto-local" className="hover:text-[#d92d20] transition-colors">
              Ubicación
            </a>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenTracker}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-[#d92d20] px-3 py-2 rounded-full border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Seguimiento</span>
            </button>

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-red-50 hover:bg-red-100 text-[#d92d20] border border-red-200 font-extrabold px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              title="Ver mi pedido"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Pedido</span>
              {cartCount > 0 && (
                <span className="bg-[#d92d20] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <a
              href={quickWhatsAppInfoUrl()}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#25d366] hover:bg-[#1ebd5a] text-white px-3.5 py-2 rounded-full text-xs sm:text-sm font-black shadow-xs transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 bg-white px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 text-sm">
            <a
              href="#inicial"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-neutral-800 hover:text-red-600 py-1.5"
            >
              🎒 Nivel Inicial (Prekínder y Kínder)
            </a>
            <a
              href="#primaria"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-neutral-800 hover:text-red-600 py-1.5"
            >
              📚 Primaria (1ro a 6to)
            </a>
            <a
              href="#metodologia"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-neutral-800 hover:text-red-600 py-1.5"
            >
              🎨 Áreas & Manos a la Obra
            </a>
            <a
              href="#pedido"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-neutral-800 hover:text-red-600 py-1.5"
            >
              📝 Hacer Pedido en Línea
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="w-full text-left font-bold text-neutral-800 hover:text-red-600 py-1.5 flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#d92d20]" />
              <span>Seguimiento de mi pedido</span>
            </button>
            <a
              href="#preguntas"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-neutral-800 hover:text-red-600 py-1.5"
            >
              ❓ Preguntas Frecuentes
            </a>
            <a
              href="#contacto-local"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-neutral-800 hover:text-red-600 py-1.5"
            >
              📍 Cómo llegar (Sede Santa Cruz)
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-left font-bold text-amber-700 hover:text-red-600 py-1.5 flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Panel de Administrador</span>
            </button>
            <div className="pt-2">
              <a
                href={quickWhatsAppInfoUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25d366] text-white py-2.5 rounded-xl font-bold"
              >
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
