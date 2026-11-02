import { useState } from "react";
import { X, Search, Clock, CheckCircle2, Truck, Package, MapPin, Calendar, ExternalLink, MessageCircle } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { BUSINESS_INFO } from "@/data/products";

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialSearchQuery?: string;
}

export function OrderTrackerModal({
  isOpen,
  onClose,
  orders,
  initialSearchQuery = "",
}: OrderTrackerModalProps) {
  const [query, setQuery] = useState(initialSearchQuery);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialSearchQuery) {
      return orders.find(
        (o) =>
          o.id.toLowerCase() === initialSearchQuery.toLowerCase() ||
          o.customer.celular.includes(initialSearchQuery)
      ) || null;
    }
    return null;
  });

  const [hasSearched, setHasSearched] = useState(Boolean(initialSearchQuery));

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    setHasSearched(true);
    const found = orders.find(
      (o) =>
        o.id.toLowerCase().includes(clean) ||
        o.customer.celular.replace(/\D/g, "").includes(clean.replace(/\D/g, ""))
    );
    setSearchedOrder(found || null);
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "pendiente":
        return 1;
      case "pagado":
        return 2;
      case "en_camino":
        return 3;
      case "entregado":
        return 4;
      case "cancelado":
        return -1;
      default:
        return 1;
    }
  };

  const stepIndex = searchedOrder ? getStatusStepIndex(searchedOrder.status) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1e0705] text-white p-5 flex items-center justify-between border-b border-red-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600 rounded-xl">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-xl text-white">Seguimiento de Pedido</h3>
              <p className="text-xs text-neutral-300 font-medium">Consulta el estado de entrega en tiempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/20 cursor-pointer"
            aria-label="Cerrar rastreador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 bg-neutral-50 border-b border-neutral-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ingresa tu N° de Pedido (Ej. LUCHITO-2026-1042) o Celular"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:border-[#d92d20] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#d92d20] hover:bg-[#b42318] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!hasSearched && (
            <div className="text-center py-8 space-y-3">
              <Package className="w-12 h-12 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-700">Rastrea tu pedido al instante</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Ingresa el código que recibiste al completar tu pedido o el número de celular que registraste.
              </p>
              {orders.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] text-neutral-400 block mb-1">Pedidos de prueba recientes:</span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {orders.slice(0, 3).map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => {
                          setQuery(o.id);
                          setSearchedOrder(o);
                          setHasSearched(true);
                        }}
                        className="text-[11px] font-mono bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-200 cursor-pointer"
                      >
                        {o.id}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasSearched && !searchedOrder && (
            <div className="text-center py-8 space-y-3 bg-red-50/50 rounded-2xl border border-red-100 p-6">
              <p className="text-sm font-bold text-red-900">No encontramos ningún pedido con ese código o número</p>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Verifica que el número de pedido esté bien escrito o comunícate con atención al cliente por WhatsApp.
              </p>
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                  `Hola Editorial Luchito, deseo consultar por el estado de mi pedido: ${query}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25d366] text-white text-xs font-bold px-4 py-2 rounded-full"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          )}

          {searchedOrder && (
            <div className="space-y-6">
              {/* Order Metadata summary card */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                    ID de Pedido
                  </span>
                  <span className="font-mono font-black text-lg text-neutral-900">
                    {searchedOrder.id}
                  </span>
                  <p className="text-xs text-neutral-600 font-semibold mt-0.5">
                    Cliente: <b>{searchedOrder.customer.nombre}</b> · {searchedOrder.customer.unidad}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                    Total
                  </span>
                  <span className="font-display text-2xl text-[#d92d20]">
                    {searchedOrder.total} Bs
                  </span>
                  <span className="text-[11px] block font-bold text-neutral-500 uppercase">
                    Pago: {searchedOrder.paymentMethod === "qr" ? "QR Simple" : "Efectivo"}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">
                  Progreso de Entrega
                </h4>

                <div className="relative flex items-center justify-between px-2 py-4">
                  {/* Connecting track line */}
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0" />
                  <div
                    className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, ((stepIndex - 1) / 3) * 100))}%`,
                    }}
                  />

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                        stepIndex >= 1 ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-700 mt-1.5 text-center">
                      Recibido
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                        stepIndex >= 2 ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-700 mt-1.5 text-center">
                      Confirmado
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                        stepIndex >= 3 ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-700 mt-1.5 text-center">
                      En camino
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                        stepIndex >= 4 ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-700 mt-1.5 text-center">
                      Entregado
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                <div className="space-y-1">
                  <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[10px]">
                    Modalidad y Fecha
                  </span>
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#d92d20]" />
                    {searchedOrder.deliveryDate} · Turno {searchedOrder.deliverySlot}
                  </p>
                  <p className="text-neutral-600">
                    Tipo: <b>{searchedOrder.deliveryType === "recojo" ? "Recojo en tienda central" : "Entrega en colegio / domicilio"}</b>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[10px]">
                    Ubicación de Destino
                  </span>
                  {searchedOrder.deliveryLocation ? (
                    <div>
                      <p className="text-neutral-700 font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#d92d20] shrink-0" />
                        <span>{searchedOrder.deliveryLocation.addressText || "Santa Cruz de la Sierra"}</span>
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${searchedOrder.deliveryLocation.lat},${searchedOrder.deliveryLocation.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#d92d20] hover:underline flex items-center gap-1 font-bold mt-1"
                      >
                        <span>Abrir coordenadas en Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-neutral-600">
                      Recojo en central: Calle Germán Herraes #125, Santa Cruz
                    </p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider">
                  Libros del Pedido ({searchedOrder.totalBooks} ejemplares)
                </h4>
                <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 overflow-hidden text-xs">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-white">
                      <span className="font-bold text-neutral-800">
                        {item.name} <span className="text-neutral-400 font-normal">({item.qty} × {item.unitPrice} Bs)</span>
                      </span>
                      <span className="font-mono font-bold text-neutral-900">{item.subtotal} Bs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center">
          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-[#25d366]" />
            <span>Consultar por WhatsApp directo</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-neutral-300 hover:bg-neutral-200 text-neutral-700 text-xs font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
