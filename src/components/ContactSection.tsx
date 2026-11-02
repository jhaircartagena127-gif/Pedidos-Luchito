import { useState } from "react";
import { MapPin, Phone, Clock, MessageSquare, Send, CheckCircle2, Navigation, ExternalLink } from "lucide-react";
import { BUSINESS_INFO, EDITORIAL_LOCATION } from "@/data/products";
import { ClientMessage } from "@/types";

interface ContactSectionProps {
  onSendMessage: (msg: Omit<ClientMessage, "id" | "createdAt" | "status">) => void;
}

export function ContactSection({ onSendMessage }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    school: "",
    subject: "Consulta de libros escolares 2026",
    message: "",
  });

  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) return;

    onSendMessage({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      school: formData.school,
      subject: formData.subject,
      message: formData.message,
    });

    setSentSuccess(true);
    setFormData({
      name: "",
      phone: "",
      email: "",
      school: "",
      subject: "Consulta de libros escolares 2026",
      message: "",
    });

    setTimeout(() => setSentSuccess(false), 5000);
  };

  const editorialMapsUrl = `https://www.google.com/maps?q=${EDITORIAL_LOCATION.lat},${EDITORIAL_LOCATION.lng}`;

  return (
    <section id="contacto-local" className="py-16 md:py-24 bg-white border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#d92d20] bg-red-50 border border-red-200 px-3.5 py-1 rounded-full">
            Visítanos o Escríbenos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            Nuestra Editorial en Santa Cruz
          </h2>
          <p className="text-sm text-neutral-600 font-medium">
            Estamos ubicados estratégicamente para atenderte de forma personalizada o coordinar la entrega de tus textos.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Location details and Google Maps preview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-neutral-50 border border-neutral-200 p-6 space-y-5">
              <h3 className="font-display text-2xl text-neutral-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#d92d20]" />
                <span>Cómo Llegar a Nuestra Sede</span>
              </h3>

              <div className="space-y-3 text-sm text-neutral-700 font-medium">
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-[#d92d20] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900">{BUSINESS_INFO.address}</p>
                    <p className="text-xs text-neutral-500">Santa Cruz de la Sierra, Bolivia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900">Horarios de atención continuada:</p>
                    <p className="text-xs text-neutral-600">Lunes a Viernes: 07:00 – 12:30 y 14:00 – 18:30</p>
                    <p className="text-xs text-neutral-600">Sábados: 08:00 – 13:00</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-900">Teléfono y WhatsApp:</p>
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="text-xs text-neutral-600 hover:underline font-bold">
                      {BUSINESS_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Route Action */}
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={editorialMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#d92d20] hover:bg-[#b42318] text-white py-3 px-5 text-xs font-black shadow-sm transition-transform hover:scale-102"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Abrir en Google Maps (Cómo llegar)</span>
                </a>
              </div>
            </div>

            {/* Embedded interactive OpenStreetMap iframe for Santa Cruz store */}
            <div className="rounded-3xl overflow-hidden border-2 border-neutral-200 shadow-sm h-64 relative bg-neutral-100">
              <iframe
                title="Mapa Editorial Luchito Santa Cruz"
                className="w-full h-full border-0"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-63.1950%2C-17.7950%2C-63.1700%2C-17.7750&amp;layer=mapnik&amp;marker=-17.7885%2C-63.1802"
              />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold shadow text-neutral-700">
                Editorial Luchito · Calle Germán Herraes #125
              </div>
            </div>
          </div>

          {/* Right Column: Contact form / message box */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-neutral-50 border border-neutral-200 p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="font-display text-2xl text-neutral-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#d92d20]" />
                  <span>Buzón de Consultas y Colegios</span>
                </h3>
                <p className="text-xs text-neutral-500 font-medium mt-1">
                  Déjanos tu mensaje. Nuestro equipo comercial te responderá a la brevedad.
                </p>
              </div>

              {sentSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>¡Mensaje enviado con éxito! Te contactaremos pronto.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black uppercase text-neutral-700 tracking-wider mb-1">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Prof. Andrea Vaca"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-black uppercase text-neutral-700 tracking-wider mb-1">
                      Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 78045612"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black uppercase text-neutral-700 tracking-wider mb-1">
                      Colegio / Unidad Educativa
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Colegio Británico"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-black uppercase text-neutral-700 tracking-wider mb-1">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="tu.correo@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-neutral-700 tracking-wider mb-1">
                    Motivo de la consulta
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none cursor-pointer"
                  >
                    <option value="Consulta de libros escolares 2026">Consulta de libros escolares 2026</option>
                    <option value="Cotización por mayor para colegio / curso">Cotización por mayor para colegio / curso</option>
                    <option value="Guías y material didáctico para profesores">Guías y material didáctico para profesores</option>
                    <option value="Envíos a provincias o departamentos">Envíos a provincias o departamentos</option>
                    <option value="Otro asunto">Otro asunto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black uppercase text-neutral-700 tracking-wider mb-1">
                    Mensaje o detalle *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escribe aquí tu duda, grados que necesitas o solicitud de muestra..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#1e0705] hover:bg-[#d92d20] text-white py-3.5 px-6 font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar mensaje a la editorial</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
