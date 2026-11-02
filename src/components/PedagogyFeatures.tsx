import {
  BookOpen,
  Brain,
  Palette,
  Cpu,
  Music,
  Heart,
  Globe,
  Leaf,
  Sparkles,
} from "lucide-react";

export function PedagogyFeatures() {
  const areas = [
    {
      icon: BookOpen,
      title: "Comprensión Lectora",
      subtitle: "Comunicación y Lenguajes",
      desc: "Lectura comprensiva, vocabulario enriquecido, ortografía y redacción creativa.",
      color: "bg-red-50 text-[#d92d20] border-red-200",
    },
    {
      icon: Brain,
      title: "Razonamiento Lógico",
      subtitle: "Matemática Aplicada",
      desc: "Cálculo mental, geometría, problemas prácticos y desarrollo del pensamiento analítico.",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      icon: Leaf,
      title: "Naturaleza y Salud",
      subtitle: "Ciencias Naturales",
      desc: "Ecosistemas bolivianos, cuidado del medio ambiente, cuerpo humano y nutrición.",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      icon: Globe,
      title: "Historia y Civismo",
      subtitle: "Ciencias Sociales",
      desc: "Identidad cultural, geografía de Bolivia, símbolos patrios y vida en comunidad.",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      icon: Palette,
      title: "Talleres y Arte",
      subtitle: "Manos a la Obra",
      desc: "Pintura, modelado, origami, manualidades y estimulación de la creatividad.",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      icon: Cpu,
      title: "Tecnología Escolar",
      subtitle: "Innovación Práctica",
      desc: "Iniciación a las herramientas digitales, pensamiento computacional y robótica lúdica.",
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    {
      icon: Music,
      title: "Educación Musical",
      subtitle: "Cancionero Escolar",
      desc: "Himnos patrios, marchas cívicas bolivianas, ritmos autóctonos y flauta dulce.",
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      icon: Heart,
      title: "Valores Comunitarios",
      subtitle: "Convivencia Armónica",
      desc: "Respeto, solidaridad, empatía y valores éticos para la vida en familia y sociedad.",
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
  ];

  return (
    <section id="metodologia" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#d92d20] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Propuesta Pedagógica Integral
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            ¿Por qué elegir <span className="text-[#d92d20]">Multitextos Luchito</span>?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
            Nuestros libros unen la rigurosidad académica con actividades prácticas y formativas diseñadas específicamente para el contexto educativo de Bolivia.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl p-6 border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 ${area.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block">
                    {area.subtitle}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mt-1 mb-2">
                    {area.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                    {area.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
