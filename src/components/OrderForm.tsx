import { useState } from "react";
import { PRODUCTS, BUSINESS_INFO, SANTA_CRUZ_COORDS } from "@/data/products";
import {
  OrderQuantities,
  CustomerData,
  DeliveryType,
  PaymentMethod,
  DeliverySlot,
  LocationCoordinates,
  Order,
  Product,
} from "@/types";
import { lineTotals, orderTotal, totalBooksCount, generateWhatsAppUrl } from "@/lib/whatsapp";
import { MapPicker } from "@/components/MapPicker";
import { PaymentQrModal } from "@/components/PaymentQrModal";
import {
  Plus,
  Minus,
  MessageCircle,
  Check,
  AlertCircle,
  Sparkles,
  RotateCcw,
  ShoppingBag,
  MapPin,
  Calendar,
  Clock,
  QrCode,
  Banknote,
  Building,
  CheckCircle2,
  ExternalLink,
  CalendarPlus,
  Truck,
} from "lucide-react";

interface OrderFormProps {
  products: Product[];
  quantities: OrderQuantities;
  onUpdateQty: (productId: string, qty: number) => void;
  onClearQty: () => void;
  onSetPreset: (preset: "inicial" | "primaria-baja" | "primaria-alta" | "completo") => void;
  onOrderCreated: (newOrder: Order) => void;
  onOpenTracker: (orderId: string) => void;
}

export function OrderForm({
  products,
  quantities,
  onUpdateQty,
  onClearQty,
  onSetPreset,
  onOrderCreated,
  onOpenTracker,
}: OrderFormProps) {
  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const [customer, setCustomer] = useState<CustomerData>({
    nombre: "",
    celular: "",
    correo: "",
    unidad: "",
    ciudad: "Santa Cruz de la Sierra",
    notas: "",
  });

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("colegio");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [deliveryDate, setDeliveryDate] = useState<string>(minDateStr);
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot>("09:30-12:30");
  const [deliveryLocation, setDeliveryLocation] = useState<LocationCoordinates>({
    lat: SANTA_CRUZ_COORDS.lat,
    lng: SANTA_CRUZ_COORDS.lng,
    addressText: "Santa Cruz de la Sierra",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const lines = lineTotals(quantities);
  const total = orderTotal(quantities);
  const totalBooks = totalBooksCount(quantities);

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleIncrement = (id: string) => {
    const current = quantities[id] ?? 0;
    onUpdateQty(id, current + 1);
  };

  const handleDecrement = (id: string) => {
    const current = quantities[id] ?? 0;
    if (current > 0) {
      onUpdateQty(id, current - 1);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.nombre.trim()) {
      setErrorMsg("Por favor, ingresa tu nombre completo.");
      return;
    }
    if (!customer.celular.trim() || customer.celular.replace(/\D/g, "").length < 7) {
      setErrorMsg("Por favor, ingresa un número de celular o WhatsApp válido (mínimo 7-8 dígitos).");
      return;
    }
    if (!customer.unidad.trim()) {
      setErrorMsg("Por favor, ingresa el nombre de la Unidad Educativa o Colegio.");
      return;
    }
    if (lines.length === 0) {
      setErrorMsg("Selecciona al menos un multitexto en la lista de productos.");
      return;
    }
    if (!deliveryDate) {
      setErrorMsg("Selecciona una fecha de entrega.");
      return;
    }

    setErrorMsg("");

    // Generate unique order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `LUCHITO-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: newOrderId,
      customer,
      items: lines.map((l) => ({
        productId: l.id,
        name: l.name,
        unitPrice: l.price,
        qty: l.qty,
        subtotal: l.subtotal,
        image: l.image,
      })),
      total,
      totalBooks,
      deliveryType,
      deliveryDate,
      deliverySlot,
      deliveryLocation: deliveryType === "colegio" ? deliveryLocation : undefined,
      paymentMethod,
      status: paymentMethod === "qr" ? "pendiente" : "pendiente",
      createdAt: new Date().toISOString(),
      notes: customer.notas,
    };

    onOrderCreated(newOrder);
    setCreatedOrder(newOrder);

    if (paymentMethod === "qr") {
      setShowQrModal(true);
    }
  };

  const googleCalendarUrl = createdOrder
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        `Entrega Multitextos Luchito: Pedido ${createdOrder.id}`
      )}&dates=${createdOrder.deliveryDate.replace(/-/g, "")}T080000Z/${createdOrder.deliveryDate.replace(
        /-/g,
        ""
      )}T120000Z&details=${encodeURIComponent(
        `Pedido ${createdOrder.id} para ${createdOrder.customer.nombre} en ${createdOrder.customer.unidad}. Total: ${createdOrder.total} Bs.`
      )}&location=${encodeURIComponent(
        createdOrder.deliveryLocation
          ? `https://www.google.com/maps?q=${createdOrder.deliveryLocation.lat},${createdOrder.deliveryLocation.lng}`
          : BUSINESS_INFO.address
      )}`
    : "#";

  return (
    <div id="pedido" className="scroll-mt-24">
      {/* If Order is already created, show confirmation card */}
      {createdOrder ? (
        <div className="rounded-3xl bg-white border border-neutral-200 shadow-2xl p-6 sm:p-10 max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ¡Pedido Registrado con Éxito!
            </span>
            <h3 className="font-display text-3xl sm:text-4xl text-neutral-900">
              Gracias, {createdOrder.customer.nombre}
            </h3>
            <p className="text-sm text-neutral-600 font-medium max-w-md mx-auto">
              Tu pedido ha sido guardado en nuestro sistema. A continuación tienes todos los datos y el enlace directo para confirmar por WhatsApp.
            </p>
          </div>

          {/* Reference Card */}
          <div className="rounded-2xl bg-neutral-50 p-5 border border-neutral-200 space-y-3">
            <div className="flex flex-wrap justify-between items-center pb-3 border-b border-neutral-200 gap-2">
              <div>
                <span className="text-xs text-neutral-500 font-bold block uppercase">Código de Pedido</span>
                <span className="font-mono font-black text-xl text-[#d92d20]">{createdOrder.id}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 font-bold block uppercase">Total a Pagar</span>
                <span className="font-display text-2xl text-neutral-900">{createdOrder.total} Bs</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs text-neutral-700 font-medium">
              <div>
                <p><b>Colegio / U.E.:</b> {createdOrder.customer.unidad}</p>
                <p><b>Celular:</b> {createdOrder.customer.celular}</p>
                <p><b>Modalidad:</b> {createdOrder.deliveryType === "colegio" ? "Entrega en colegio / domicilio" : "Recojo en local central"}</p>
              </div>
              <div>
                <p><b>Fecha de entrega:</b> {createdOrder.deliveryDate}</p>
                <p><b>Turno / Franja:</b> {createdOrder.deliverySlot}</p>
                <p><b>Método de Pago:</b> {createdOrder.paymentMethod === "qr" ? "QR Simple (Transferencia)" : "Efectivo contra entrega"}</p>
              </div>
            </div>

            {createdOrder.deliveryLocation && (
              <div className="pt-2 text-xs flex items-center justify-between border-t border-neutral-200">
                <span className="text-neutral-600 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#d92d20]" />
                  Ubicación fijada en mapa: [{createdOrder.deliveryLocation.lat}, {createdOrder.deliveryLocation.lng}]
                </span>
                <a
                  href={`https://www.google.com/maps?q=${createdOrder.deliveryLocation.lat},${createdOrder.deliveryLocation.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#d92d20] hover:underline font-bold flex items-center gap-1"
                >
                  <span>Ver en Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={generateWhatsAppUrl(createdOrder.customer, quantities)}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2.5 rounded-full bg-[#25d366] hover:bg-[#1ebd5a] text-white py-4 px-6 font-display text-lg tracking-wide shadow-lg transition-transform hover:scale-102"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Enviar Confirmación a WhatsApp</span>
            </a>

            <div className="grid sm:grid-cols-2 gap-3">
              {createdOrder.paymentMethod === "qr" && (
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 py-3 px-4 font-bold text-xs cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-amber-600" />
                  <span>Ver Código QR de Pago</span>
                </button>
              )}

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-3 px-4 font-bold text-xs cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-blue-600" />
                <span>Agregar a Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenTracker(createdOrder.id)}
                className="flex items-center justify-center gap-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-3 px-4 font-bold text-xs cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#d92d20]" />
                <span>Rastrear Estado en Línea</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedOrder(null);
                  onClearQty();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-100 py-3 px-4 font-bold text-xs cursor-pointer"
              >
                <span>Hacer otro pedido</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Interactive Form */
        <div className="rounded-3xl bg-white border border-neutral-200 shadow-card p-6 sm:p-10">
          {/* Quick Presets Bar */}
          <div className="mb-8 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Selección rápida:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSetPreset("inicial")}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-neutral-300 hover:border-[#d92d20] hover:text-[#d92d20] transition-colors cursor-pointer"
              >
                Pack Inicial (Prekínder + Kínder)
              </button>
              <button
                type="button"
                onClick={() => onSetPreset("primaria-baja")}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-neutral-300 hover:border-[#d92d20] hover:text-[#d92d20] transition-colors cursor-pointer"
              >
                1° a 3° Primaria
              </button>
              <button
                type="button"
                onClick={() => onSetPreset("primaria-alta")}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-neutral-300 hover:border-[#d92d20] hover:text-[#d92d20] transition-colors cursor-pointer"
              >
                4° a 6° Primaria
              </button>
              <button
                type="button"
                onClick={() => onSetPreset("completo")}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-[#d92d20] border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
              >
                Todos (1 ejemplar c/u)
              </button>
              {totalBooks > 0 && (
                <button
                  type="button"
                  onClick={onClearQty}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-neutral-400 hover:text-red-600 hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmitOrder} className="grid gap-10 lg:grid-cols-12">
            {/* Column 1: Customer Data, Map & Delivery Mode */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h3 className="font-display text-2xl text-neutral-900">
                  1. Tus Datos y Ubicación de Entrega
                </h3>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Los datos exactos para coordinar y hacer llegar los libros sin demoras.
                </p>
              </div>

              {/* Mode: Delivery to School vs Pickup */}
              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 tracking-wider mb-2">
                  Modalidad de Entrega
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("colegio")}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      deliveryType === "colegio"
                        ? "border-[#d92d20] bg-red-50/60 text-[#d92d20]"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <Building className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs sm:text-sm">Entrega en Colegio / Domicilio</p>
                      <p className="text-[11px] text-neutral-500 font-medium">Llevamos los libros hasta el punto fijado</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType("recojo")}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      deliveryType === "recojo"
                        ? "border-[#d92d20] bg-red-50/60 text-[#d92d20]"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <Building className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs sm:text-sm">Recojo en Editorial</p>
                      <p className="text-[11px] text-neutral-500 font-medium">Calle Germán Herraes 125, Santa Cruz</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Fields */}
              <div className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-700 tracking-wider mb-1.5">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. María René Suárez"
                      value={customer.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                      className="w-full rounded-xl border-2 border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-700 tracking-wider mb-1.5">
                      Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 78045612"
                      value={customer.celular}
                      onChange={(e) => handleInputChange("celular", e.target.value)}
                      className="w-full rounded-xl border-2 border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-700 tracking-wider mb-1.5">
                      Colegio / Unidad Educativa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. U.E. Gabriel René Moreno"
                      value={customer.unidad}
                      onChange={(e) => handleInputChange("unidad", e.target.value)}
                      className="w-full rounded-xl border-2 border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-700 tracking-wider mb-1.5">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={customer.correo}
                      onChange={(e) => handleInputChange("correo", e.target.value)}
                      className="w-full rounded-xl border-2 border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#d92d20] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Date & Time Slot Selector */}
                <div className="grid sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-700 tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Fecha de Entrega *</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={minDateStr}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full rounded-xl border-2 border-neutral-200 bg-white px-3 py-2 text-xs font-bold focus:border-[#d92d20] focus:outline-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-700 tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Franja Horaria *</span>
                    </label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value as DeliverySlot)}
                      className="w-full rounded-xl border-2 border-neutral-200 bg-white px-3 py-2 text-xs font-bold focus:border-[#d92d20] focus:outline-none cursor-pointer"
                    >
                      <option value="07:00-09:30">Mañana: 07:00 – 09:30 (Entrada escolar)</option>
                      <option value="09:30-12:30">Mañana: 09:30 – 12:30 (Recreo / Salida)</option>
                      <option value="14:00-16:30">Tarde: 14:00 – 16:30 (Turno tarde)</option>
                      <option value="16:30-18:30">Tarde: 16:30 – 18:30 (Cierre jornada)</option>
                    </select>
                  </div>
                </div>

                {/* Leaflet Map Picker (Only if school delivery is selected) */}
                {deliveryType === "colegio" && (
                  <div className="pt-2">
                    <MapPicker
                      location={deliveryLocation}
                      onChangeLocation={setDeliveryLocation}
                    />
                  </div>
                )}

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-black uppercase text-neutral-700 tracking-wider mb-2">
                    Forma de Pago
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("efectivo")}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod === "efectivo"
                          ? "border-[#d92d20] bg-red-50 text-[#d92d20]"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <Banknote className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="font-bold text-xs sm:text-sm">Efectivo</p>
                        <p className="text-[10px] text-neutral-500 font-medium">Contra entrega en mano</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qr")}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod === "qr"
                          ? "border-[#d92d20] bg-red-50 text-[#d92d20]"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <QrCode className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="font-bold text-xs sm:text-sm">QR Simple Bolivia</p>
                        <p className="text-[10px] text-neutral-500 font-medium">Transferencia bancaria</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-black uppercase text-neutral-700 tracking-wider mb-1">
                    Indicaciones para el repartidor (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Dejar con la portera Sra. Gladis / Casa de rejas blancas al lado del colegio"
                    value={customer.notas}
                    onChange={(e) => handleInputChange("notas", e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-medium focus:border-[#d92d20] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Quantities, Price & Checkout */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-2xl text-neutral-900">
                    2. Selección de Libros
                  </h3>
                  <span className="text-xs font-bold text-neutral-500">
                    {totalBooks} libro{totalBooks !== 1 ? "s" : ""} seleccionado{totalBooks !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Product Rows */}
                <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-50/50">
                  {products.map((p) => {
                    const qty = quantities[p.id] ?? 0;
                    const isSelected = qty > 0;
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between p-3 transition-colors ${
                          isSelected ? "bg-amber-50/50" : "hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-13 object-cover rounded-md shadow-xs border border-neutral-200"
                          />
                          <div>
                            <p className="font-bold text-sm text-neutral-900 leading-tight">
                              {p.name}
                            </p>
                            <p className="text-xs text-neutral-500 font-semibold">
                              {p.price} Bs{" "}
                              <span className="text-[11px] text-neutral-400 font-normal">
                                · {p.inStock ? `Stock: ${p.stock}` : "Agotado"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {qty > 0 && (
                            <span className="text-xs font-black text-[#d92d20] mr-1 hidden sm:inline">
                              {p.price * qty} Bs
                            </span>
                          )}

                          <div className="flex items-center border border-neutral-300 rounded-xl bg-white shadow-xs overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleDecrement(p.id)}
                              className="p-1.5 sm:p-2 text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer"
                              aria-label={`Reducir ${p.name}`}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <input
                              type="number"
                              min={0}
                              max={p.stock || 999}
                              value={qty}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(p.stock || 999, parseInt(e.target.value) || 0));
                                onUpdateQty(p.id, val);
                              }}
                              className="w-11 text-center font-black text-sm py-1 focus:outline-none"
                              aria-label={`Cantidad ${p.name}`}
                            />

                            <button
                              type="button"
                              onClick={() => handleIncrement(p.id)}
                              className="p-1.5 sm:p-2 text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer"
                              aria-label={`Aumentar ${p.name}`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="rounded-3xl bg-neutral-900 text-white p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    Resumen de Compra
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    {totalBooks} libro{totalBooks !== 1 ? "s" : ""}
                  </span>
                </div>

                {lines.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic py-2 text-center">
                    Selecciona tus libros con los botones (+) o los accesos rápidos.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs text-neutral-300">
                    {lines.map((l) => (
                      <div key={l.id} className="flex justify-between items-center py-0.5">
                        <span>
                          {l.name} <span className="text-neutral-400">({l.qty} × {l.price} Bs)</span>
                        </span>
                        <span className="font-bold text-white">{l.subtotal} Bs</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/15 pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                      Total a Pagar
                    </span>
                    <span className="text-[11px] text-neutral-400">Moneda nacional (Bolivia)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-3xl sm:text-4xl text-amber-300">
                      {total} Bs
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2.5 rounded-full bg-[#d92d20] hover:bg-[#b42318] active:scale-98 text-white py-4 px-6 font-display text-lg tracking-wide shadow-lg transition-all cursor-pointer"
                >
                  <Check className="w-6 h-6 shrink-0" />
                  <span>REGISTRAR Y CONFIRMAR PEDIDO</span>
                </button>

                <p className="text-[11px] text-neutral-400 text-center font-medium">
                  Al confirmar, se guardará tu pedido y podrás enviarlo directamente a nuestro WhatsApp oficial (+591 62185931).
                </p>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* QR Modal if requested */}
      <PaymentQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        orderId={createdOrder?.id || "LUCHITO-2026"}
        totalAmount={createdOrder?.total || total}
        customerName={createdOrder?.customer.nombre || customer.nombre}
      />
    </div>
  );
}
