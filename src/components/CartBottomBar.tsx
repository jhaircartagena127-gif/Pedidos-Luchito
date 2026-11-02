import { ShoppingBag, ArrowRight, X } from "lucide-react";
import { lineTotals, orderTotal, totalBooksCount } from "@/lib/whatsapp";
import { OrderQuantities } from "@/types";

interface CartBottomBarProps {
  quantities: OrderQuantities;
  onOpenOrderForm: () => void;
  onClear: () => void;
}

export function CartBottomBar({
  quantities,
  onOpenOrderForm,
  onClear,
}: CartBottomBarProps) {
  const totalBooks = totalBooksCount(quantities);
  const total = orderTotal(quantities);
  const lines = lineTotals(quantities);

  if (totalBooks === 0) return null;

  return (
    <aside aria-label="Resumen de compra flotante" className="fixed bottom-0 inset-x-0 z-40 bg-neutral-900/95 backdrop-blur-md text-white border-t border-white/15 shadow-2xl py-3 px-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Cart items preview */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-[#d92d20] flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-neutral-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow">
              {totalBooks}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                {totalBooks} ejemplar{totalBooks !== 1 ? "es" : ""} en tu carrito
              </span>
              <button
                type="button"
                onClick={onClear}
                className="text-[11px] text-neutral-400 hover:text-red-400 underline font-semibold cursor-pointer"
              >
                Vaciar
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-amber-300 leading-none">
                {total} Bs
              </span>
              <span className="text-xs text-neutral-400 font-semibold hidden sm:inline">
                ({lines.map((l) => `${l.name} × ${l.qty}`).slice(0, 2).join(", ")}
                {lines.length > 2 ? ` +${lines.length - 2} más` : ""})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Proceed button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenOrderForm}
            className="flex items-center gap-2 bg-[#d92d20] hover:bg-[#b42318] active:scale-95 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-extrabold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <span>Completar Pedido</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
