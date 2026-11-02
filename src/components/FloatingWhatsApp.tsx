import { MessageCircle } from "lucide-react";
import { quickWhatsAppInfoUrl } from "@/lib/whatsapp";

interface FloatingWhatsAppProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function FloatingWhatsApp({ cartCount, onOpenCart }: FloatingWhatsAppProps) {
  return (
    <aside aria-label="Acciones rápidas de pedido" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {cartCount > 0 && (
        <button
          type="button"
          onClick={onOpenCart}
          className="flex items-center gap-2 bg-[#d92d20] hover:bg-[#b42318] text-white px-4 py-2.5 rounded-full text-xs font-black shadow-2xl transition-all hover:scale-105 border-2 border-white animate-bounce cursor-pointer"
        >
          <span>Ir a pagar {cartCount} libro{cartCount !== 1 ? "s" : ""}</span>
        </button>
      )}

      <a
        href={quickWhatsAppInfoUrl()}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp a Editorial Luchito"
        className="group relative flex h-15 w-15 items-center justify-center rounded-full bg-[#25d366] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 border-2 border-white"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
        </span>
        <MessageCircle className="h-8 w-8" />
        
        {/* Hover Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          ¿Dudas? Escríbenos al WhatsApp
        </span>
      </a>
    </aside>
  );
}
