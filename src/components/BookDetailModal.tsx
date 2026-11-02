import { X, Check, Plus, MessageCircle, BookOpen, Layers } from "lucide-react";
import { Product } from "@/types";
import { quickWhatsAppInfoUrl } from "@/lib/whatsapp";

interface BookDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
  currentQty: number;
}

export function BookDetailModal({
  product,
  onClose,
  onAddToCart,
  currentQty,
}: BookDetailModalProps) {
  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/80">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#d92d20]">
              {product.level === "inicial" ? "Nivel Inicial" : "Nivel Primario"}
            </span>
            <h3 className="font-display text-2xl text-neutral-900 leading-tight">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid sm:grid-cols-12 gap-6 items-start">
            {/* Book Image */}
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-neutral-100 w-full max-w-[220px]">
                <img
                  src={product.image}
                  alt={`Multitexto ${product.name}`}
                  className="w-full h-auto aspect-3/4 object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#d92d20] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                  {product.price} Bs
                </div>
              </div>
              <p className="text-xs text-neutral-500 text-center mt-2 font-medium">
                Edición oficial Editorial Luchito
              </p>
            </div>

            {/* Info details */}
            <div className="sm:col-span-7 space-y-4">
              <div>
                <span className="inline-block bg-red-100 text-[#b42318] text-xs font-extrabold px-3 py-1 rounded-full mb-2">
                  {product.tag}
                </span>
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Price and Cart Action */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-500 font-bold block uppercase">Precio oficial</span>
                  <span className="font-display text-2xl text-[#d92d20]">{product.price} Bs</span>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToCart(product.id)}
                  className="flex items-center gap-2 bg-[#d92d20] hover:bg-[#b42318] text-white px-4 py-2.5 rounded-full font-extrabold text-sm shadow-md transition-transform hover:scale-105 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir al pedido {currentQty > 0 ? `(${currentQty} ya en lista)` : ""}</span>
                </button>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Características principales
                </h4>
                <ul className="text-xs text-neutral-600 space-y-1">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Module / Chapter Breakdown */}
          <div className="border-t border-neutral-100 pt-5">
            <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-[#d92d20]" />
              Contenido curricular incluido
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {product.modules.map((mod, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-800"
                >
                  <span className="w-5 h-5 rounded-full bg-red-100 text-[#d92d20] flex items-center justify-center font-black text-[10px] shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{mod}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex flex-wrap items-center justify-between gap-3">
          <a
            href={quickWhatsAppInfoUrl(product.name)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-emerald-700"
          >
            <MessageCircle className="w-4 h-4 text-[#25d366]" />
            <span>Consultar disponibilidad por WhatsApp</span>
          </a>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onAddToCart(product.id);
                onClose();
              }}
              className="px-5 py-2 rounded-full bg-[#d92d20] text-white text-xs font-extrabold hover:bg-[#b42318] shadow-sm cursor-pointer"
            >
              Añadir y cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
