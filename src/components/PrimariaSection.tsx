import { useState } from "react";
import { Eye, Plus, ShoppingBag, BookOpen, Hand, Search } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { Product, OrderQuantities } from "@/types";

interface PrimariaSectionProps {
  onSelectProduct: (p: Product) => void;
  onAddToCart: (id: string) => void;
  quantities: OrderQuantities;
}

export function PrimariaSection({ onSelectProduct, onAddToCart, quantities }: PrimariaSectionProps) {
  const [filterCycle, setFilterCycle] = useState<"todos" | "1-3" | "4-6">("todos");
  const primariaBooks = PRODUCTS.filter((p) => p.level === "primaria");

  const filtered = primariaBooks.filter((b) => {
    if (filterCycle === "1-3") return ["p1", "p2", "p3"].includes(b.id);
    if (filterCycle === "4-6") return ["p4", "p5", "p6"].includes(b.id);
    return true;
  });

  return (
    <section id="primaria" className="py-16 md:py-24 bg-neutral-50/80 border-t border-b border-neutral-200/70">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-block text-xs font-black uppercase tracking-wider text-[#d92d20] bg-red-100/70 border border-red-200 px-3.5 py-1 rounded-full">
            Educación Primaria Comunitaria Vocacional
          </span>
          <h2 className="font-display text-3xl sm:text-5xl text-neutral-900 tracking-tight">
            Nivel Primaria · <span className="text-[#d92d20]">1ro a 6to Grado</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
            Cada multitexto de primaria integra las <b>4 áreas fundamentales</b> de aprendizaje (Comunicación y Lenguajes, Matemática, Ciencias Naturales y Ciencias Sociales) más el cuaderno especial de actividades prácticas <b>"Manos a la Obra"</b>.
          </p>
        </div>

        {/* Value Prop Banners (Multitextos + Manos a la Obra) */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="flex gap-4 rounded-3xl bg-white p-6 shadow-sm border border-neutral-200/80 items-start">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#d92d20] flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">4 Áreas del Saber Integradas</h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                Contenidos pedagógicos actualizados según la malla oficial boliviana para un aprendizaje significativo y continuo sin necesidad de comprar múltiples libros sueltos.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-3xl bg-white p-6 shadow-sm border border-neutral-200/80 items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Hand className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">Módulo "Manos a la Obra"</h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                Sección complementaria orientada a la práctica vivencial: proyectos de aula, talleres de arte, experimentos científicos, cancionero escolar y valores comunitarios.
              </p>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 uppercase mr-1">Filtrar por ciclo:</span>
            <button
              onClick={() => setFilterCycle("todos")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterCycle === "todos"
                  ? "bg-[#d92d20] text-white shadow-xs"
                  : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              Todos (1° a 6°)
            </button>
            <button
              onClick={() => setFilterCycle("1-3")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterCycle === "1-3"
                  ? "bg-[#d92d20] text-white shadow-xs"
                  : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              1° a 3° Primaria
            </button>
            <button
              onClick={() => setFilterCycle("4-6")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterCycle === "4-6"
                  ? "bg-[#d92d20] text-white shadow-xs"
                  : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              4° a 6° Primaria
            </button>
          </div>

          <div className="text-xs font-bold text-neutral-500">
            Mostrando <b>{filtered.length}</b> libros · <b>230 Bs</b> c/u
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((book) => {
            const count = quantities[book.id] ?? 0;
            return (
              <article
                key={book.id}
                className="group rounded-3xl bg-white border border-neutral-200/90 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
              >
                {/* Book Cover */}
                <div
                  className="bg-neutral-100/70 p-5 flex items-center justify-center relative cursor-pointer overflow-hidden border-b border-neutral-100"
                  onClick={() => onSelectProduct(book)}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-md group-hover:scale-104 transition-transform duration-300 w-full max-w-[210px] aspect-3/4 bg-white flex items-center justify-center">
                    <img
                      src={book.image}
                      alt={`Multitexto ${book.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-neutral-900 px-3.5 py-1.5 rounded-full text-xs font-black shadow-md flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#d92d20]" />
                        Ver detalles
                      </span>
                    </div>
                  </div>

                  <span className="absolute top-3 right-3 bg-[#d92d20] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                    {book.price} Bs
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-extrabold text-[#d92d20] uppercase tracking-wider block">
                      {book.tag}
                    </span>
                    <h3 className="font-display text-xl text-neutral-900 mt-1 group-hover:text-[#d92d20] transition-colors">
                      {book.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-neutral-600 font-medium line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(book)}
                      className="py-2 px-3 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddToCart(book.id)}
                      className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                        count > 0
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-[#d92d20] hover:bg-[#b42318] text-white"
                      }`}
                    >
                      {count > 0 ? (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{count} en lista (+)</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir ({book.price} Bs)</span>
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
