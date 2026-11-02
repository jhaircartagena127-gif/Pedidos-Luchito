import { useState } from "react";
import { FAQS } from "@/data/products";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="preguntas" className="py-16 md:py-24 bg-neutral-50/70 border-t border-neutral-200/80">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#d92d20] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5" />
            Resolvemos tus dudas
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-sm text-neutral-600 font-medium max-w-xl mx-auto">
            Información clara sobre pedidos, envíos a toda Bolivia y condiciones de compra para padres de familia, profesores y directores.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-neutral-900 hover:text-[#d92d20] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-neutral-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#d92d20]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed border-t border-neutral-100 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
