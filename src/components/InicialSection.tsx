import { Eye, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { Product, OrderQuantities } from "@/types";

interface InicialSectionProps {
  onSelectProduct: (p: Product) => void;
  onAddToCart: (id: string) => void;
  quantities: OrderQuantities;
}

export function InicialSection({ onSelectProduct, onAddToCart, quantities }: InicialSectionProps) {
  const inicialBooks = PRODUCTS.filter((p) => p.level === "inicial");

  return (
    <section id="inicial" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#d92d20] bg-red-50 border border-red-200/80 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Primeros Pasos Escolares (3 a 5 años)
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-neutral-900 tracking-tight">
              Nivel Inicial · <span className="text-[#d92d20]">Prekínder y Kínder</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-2xl font-medium">
              Diseñados con enfoque lúdico, vivencial y secuencial. Fomentan la estimulación temprana, la motricidad fina, el aprestamiento para la lectura y los valores comunitarios.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-center shrink-0">
            <span className="text-xs font-bold block uppercase tracking-wider text-amber-800">Precio Oficial</span>
            <span className="font-display text-2xl text-[#d92d20]">240 Bs</span>
            <span className="text-[11px] block font-semibold text-neutral-500">por ejemplar</span>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {inicialBooks.map((book) => {
            const count = quantities[book.id] ?? 0;
            return (
              <article
                key={book.id}
                className="group rounded-3xl border border-neutral-200/90 bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col sm:flex-row"
              >
                {/* Book Cover Image */}
                <div
                  className="sm:w-5/12 bg-neutral-50 p-4 sm:p-6 flex items-center justify-center cursor-pointer relative overflow-hidden"
                  onClick={() => onSelectProduct(book)}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300 w-full max-w-[190px]">
                    <img
                      src={book.image}
                      alt={`Multitexto ${book.name}`}
                      loading="lazy"
                      className="w-full h-auto aspect-3/4 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/95 text-neutral-900 px-3 py-1.5 rounded-full text-xs font-black shadow flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#d92d20]" />
                        Ver detalles
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="sm:w-7/12 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#d92d20] bg-red-50 px-2.5 py-0.5 rounded-full">
                        {book.tag}
                      </span>
                      <span className="font-display text-xl text-[#d92d20]">
                        {book.price} Bs
                      </span>
                    </div>

                    <h3 className="font-display text-2xl text-neutral-900 mt-2 group-hover:text-[#d92d20] transition-colors">
                      {book.name}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                      {book.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-neutral-100">
                      <p className="text-[11px] font-black uppercase text-neutral-400 tracking-wider mb-1.5">
                        Áreas principales:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {book.modules.slice(0, 3).map((m, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md"
                          >
                            {m.split(":")[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(book)}
                      className="flex-1 py-2.5 px-3 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Ver temario</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddToCart(book.id)}
                      className={`flex-1 py-2.5 px-3 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                        count > 0
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-[#d92d20] hover:bg-[#b42318] text-white"
                      }`}
                    >
                      {count > 0 ? (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{count} en pedido (+)</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir al pedido</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
