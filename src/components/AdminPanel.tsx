import { useState } from "react";
import {
  Order,
  Product,
  ClientMessage,
  OrderStatus,
} from "@/types";
import { BUSINESS_INFO } from "@/data/products";
import {
  Package,
  Calendar,
  Layers,
  MessageSquare,
  TrendingUp,
  Download,
  Search,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Sparkles,
  Bot,
  Database,
  Send,
  Plus,
  RefreshCw,
  LogOut,
  MapPin,
} from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: Product[];
  messages: ClientMessage[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateProduct: (updated: Product) => void;
  onUpdateMessageStatus: (messageId: string, status: "nuevo" | "respondido" | "archivado") => void;
}

export function AdminPanel({
  isOpen,
  onClose,
  orders,
  products,
  messages,
  onUpdateOrderStatus,
  onUpdateProduct,
  onUpdateMessageStatus,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "pedidos" | "calendario" | "productos" | "mensajes" | "metricas" | "ia" | "integraciones"
  >("pedidos");

  // Filters for orders
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [schoolFilter, setSchoolFilter] = useState<string>("todos");

  // AI Assistant states
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiChat, setAiChat] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "¡Hola! Soy el Asistente de Ventas y Pedagogía de Editorial Luchito. Puedo ayudarte a cotizar paquetes por curso, explicar qué contenidos incluye cada grado (Prekínder a 6to) o redactar mensajes para profesores y colegios de Santa Cruz y Bolivia.",
    },
  ]);

  if (!isOpen) return null;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.celular.includes(searchQuery) ||
      o.customer.unidad.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "todos" || o.status === statusFilter;
    const matchesSchool = schoolFilter === "todos" || o.customer.unidad === schoolFilter;

    return matchesSearch && matchesStatus && matchesSchool;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "cancelado" ? o.total : 0), 0);
  const totalBooksSold = orders.reduce((sum, o) => sum + (o.status !== "cancelado" ? o.totalBooks : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "pendiente").length;
  const completedOrdersCount = orders.filter((o) => o.status === "entregado").length;

  // Unique schools list for filter
  const uniqueSchools = Array.from(new Set(orders.map((o) => o.customer.unidad))).filter(Boolean);

  // Export to Excel / CSV
  const handleExportCsv = () => {
    const headers = [
      "ID Pedido",
      "Fecha Creacion",
      "Cliente",
      "Celular",
      "Colegio",
      "Ciudad",
      "Modalidad",
      "Fecha Entrega",
      "Franja Horaria",
      "Metodo Pago",
      "Estado",
      "Total Libros",
      "Total Bs",
      "Detalle Libros",
      "Coordenadas Maps",
    ];

    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString("es-BO"),
      `"${o.customer.nombre.replace(/"/g, '""')}"`,
      `"${o.customer.celular}"`,
      `"${o.customer.unidad.replace(/"/g, '""')}"`,
      `"${o.customer.ciudad}"`,
      o.deliveryType,
      o.deliveryDate,
      `"${o.deliverySlot}"`,
      o.paymentMethod,
      o.status,
      o.totalBooks,
      o.total,
      `"${o.items.map((i) => `${i.name} (${i.qty})`).join(", ")}"`,
      o.deliveryLocation ? `"https://www.google.com/maps?q=${o.deliveryLocation.lat},${o.deliveryLocation.lng}"` : `"${BUSINESS_INFO.address}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Ventas_Multitextos_Luchito_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp generator for specific order status
  const getWhatsAppActionUrl = (order: Order) => {
    let msg = "";
    if (order.status === "pendiente") {
      msg = `Hola ${order.customer.nombre}, te escribimos de *Editorial Luchito Santa Cruz*. Hemos recibido tu pedido *${order.id}* por un total de *${order.total} Bs*. ¿Deseas pagar con código QR Simple o coordinar la entrega en ${order.customer.unidad}?`;
    } else if (order.status === "pagado") {
      msg = `Hola ${order.customer.nombre}, tu pago de *${order.total} Bs* para el pedido *${order.id}* ha sido verificado con éxito. Tus textos están preparados para la entrega del día *${order.deliveryDate}* en la franja *${order.deliverySlot}*. ¡Muchas gracias!`;
    } else if (order.status === "en_camino") {
      msg = `Hola ${order.customer.nombre}, te avisamos que tu pedido *${order.id}* de Multitextos Luchito ya se encuentra *en camino* hacia ${order.customer.unidad}. Nuestro repartidor se comunicará al llegar.`;
    } else if (order.status === "entregado") {
      msg = `Hola ${order.customer.nombre}, confirmamos que tu pedido *${order.id}* fue *entregado con éxito*. ¡Esperamos que los textos sean de gran provecho escolar! Editorial Luchito: El arte de aprender.`;
    } else {
      msg = `Hola ${order.customer.nombre}, te escribimos de Editorial Luchito con relación a tu pedido *${order.id}*.`;
    }
    return `https://wa.me/591${order.customer.celular.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  // AI Assistant logic
  const handleSendAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const userText = aiQuestion;
    setAiQuestion("");
    setAiChat((prev) => [...prev, { sender: "user", text: userText }]);

    // Rule-based high-quality responses tailored to Editorial Luchito
    setTimeout(() => {
      let reply = "";
      const lower = userText.toLowerCase();

      if (lower.includes("precio") || lower.includes("costo") || lower.includes("cuanto")) {
        reply = "Los precios oficiales 2026 de Editorial Luchito son: Nivel Inicial (Prekínder y Kínder) a 240 Bs. Primaria (de 1ro a 6to de Primaria) a 230 Bs cada ejemplar. Para pedidos por lote de curso (más de 15 ejemplares), puedes ofrecer un descuento institucional o libros de guía docente de cortesía.";
      } else if (lower.includes("inicial") || lower.includes("kinder") || lower.includes("prekinder")) {
        reply = "Los libros de Inicial están enfocados en grafomotricidad, fonética, nociones prelógicas, psicomotricidad fina y valores comunitarios. Cada texto de Inicial tiene un costo de 240 Bs y papel resistente apto para recortables y témperas.";
      } else if (lower.includes("primaria") || lower.includes("manos a la obra") || lower.includes("materias")) {
        reply = "En Primaria (1ro a 6to), cada multitexto integra las 4 áreas troncales: Comunicación y Lenguajes, Matemática, Ciencias Naturales y Ciencias Sociales, más el cuaderno anexo 'Manos a la Obra' con talleres artísticos, música y tecnología. Su precio es de 230 Bs.";
      } else if (lower.includes("envio") || lower.includes("entrega") || lower.includes("colegio") || lower.includes("horario")) {
        reply = "Atendemos en Santa Cruz en dos turnos: Mañana (07:00 a 12:30) y Tarde (14:00 a 18:30). Las entregas se coordinan directamente en el colegio o domicilio con el pin de Google Maps, o pueden retirar en Calle Germán Herraes #125.";
      } else {
        reply = `Entendido. Para ${userText}, te recomiendo revisar los libros en stock de la editorial y coordinar la confirmación con el cliente por WhatsApp enviándole el enlace de pago QR o el resumen detallado en Bs.`;
      }

      setAiChat((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col h-[95vh]">
        {/* Top bar */}
        <div className="bg-[#1e0705] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-red-950">
          <div className="flex items-center gap-3">
            <img
              src={BUSINESS_INFO.logo}
              alt="Logo"
              className="w-10 h-10 rounded-full border border-red-500 object-cover"
            />
            <div>
              <span className="font-display text-xl text-white">Panel de Administración</span>
              <p className="text-xs text-neutral-400 font-medium">Editorial Luchito · Santa Cruz de la Sierra</p>
            </div>
          </div>

          {/* Quick Tabs */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab("pedidos")}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "pedidos" ? "bg-[#d92d20] text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Pedidos ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("calendario")}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "calendario" ? "bg-[#d92d20] text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Entregas</span>
            </button>

            <button
              onClick={() => setActiveTab("productos")}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "productos" ? "bg-[#d92d20] text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Productos ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("mensajes")}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "mensajes" ? "bg-[#d92d20] text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mensajes ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("metricas")}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "metricas" ? "bg-[#d92d20] text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Ventas</span>
            </button>

            <button
              onClick={() => setActiveTab("ia")}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "ia" ? "bg-[#d92d20] text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Asistente IA</span>
            </button>

            <button
              onClick={() => setActiveTab("integraciones")}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "integraciones" ? "bg-[#d92d20] text-white shadow" : "text-neutral-300 hover:text-white"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase / Railway</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Cerrar panel admin"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-100">
          {/* TAB 1: PEDIDOS */}
          {activeTab === "pedidos" && (
            <div className="space-y-4">
              {/* Filters & Actions bar */}
              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative min-w-[220px] flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por ID, cliente, cel o colegio..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#d92d20]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none cursor-pointer"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="pagado">Pagados / Confirmados</option>
                    <option value="en_camino">En camino</option>
                    <option value="entregado">Entregados</option>
                    <option value="cancelado">Cancelados</option>
                  </select>

                  <select
                    value={schoolFilter}
                    onChange={(e) => setSchoolFilter(e.target.value)}
                    className="py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none cursor-pointer max-w-[180px]"
                  >
                    <option value="todos">Todos los colegios</option>
                    {uniqueSchools.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar a Excel (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-black uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Pedido / Fecha</th>
                        <th className="py-3 px-4">Cliente & Colegio</th>
                        <th className="py-3 px-4">Entrega / Ubicación</th>
                        <th className="py-3 px-4">Libros & Total</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-neutral-400 font-medium">
                            No se encontraron pedidos con los filtros actuales.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const statusColors: Record<OrderStatus, string> = {
                            pendiente: "bg-amber-100 text-amber-800 border-amber-300",
                            pagado: "bg-blue-100 text-blue-800 border-blue-300",
                            en_camino: "bg-purple-100 text-purple-800 border-purple-300",
                            entregado: "bg-emerald-100 text-emerald-800 border-emerald-300",
                            cancelado: "bg-rose-100 text-rose-800 border-rose-300",
                          };

                          return (
                            <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-mono font-black text-neutral-900 block text-xs">
                                  {order.id}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                  {new Date(order.createdAt).toLocaleDateString("es-BO")}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <span className="font-bold text-neutral-900 block">
                                  {order.customer.nombre}
                                </span>
                                <span className="text-neutral-500 font-semibold block text-[11px]">
                                  {order.customer.unidad}
                                </span>
                                <span className="text-neutral-400 text-[11px]">
                                  Cel: {order.customer.celular}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <span className="font-bold text-neutral-800 block">
                                  {order.deliveryDate} ({order.deliverySlot})
                                </span>
                                <span className="text-[11px] text-neutral-500 block">
                                  {order.deliveryType === "colegio" ? "En colegio" : "Recojo en local"}
                                </span>
                                {order.deliveryLocation && (
                                  <a
                                    href={`https://www.google.com/maps?q=${order.deliveryLocation.lat},${order.deliveryLocation.lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#d92d20] hover:underline flex items-center gap-1 text-[11px] font-bold mt-0.5"
                                  >
                                    <MapPin className="w-3 h-3" />
                                    <span>Google Maps</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                <span className="font-display text-sm text-[#d92d20] block">
                                  {order.total} Bs
                                </span>
                                <span className="text-[11px] text-neutral-500 font-semibold">
                                  {order.totalBooks} libro{order.totalBooks !== 1 ? "s" : ""}
                                </span>
                                <div className="text-[10px] text-neutral-400 max-w-[140px] truncate">
                                  {order.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                                  }
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer uppercase tracking-wider ${statusColors[order.status]}`}
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="pagado">Pagado</option>
                                  <option value="en_camino">En camino</option>
                                  <option value="entregado">Entregado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <a
                                  href={getWhatsAppActionUrl(order)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 bg-[#25d366] hover:bg-[#1ebd5a] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-transform hover:scale-105"
                                  title="Escribir por WhatsApp al cliente"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CALENDARIO DE ENTREGAS */}
          {activeTab === "calendario" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl text-neutral-900">Cronograma Diario de Entregas</h3>
                  <p className="text-xs text-neutral-500 font-medium">Organización de despachos escolares en Santa Cruz</p>
                </div>
                <span className="text-xs font-bold text-neutral-500">
                  Horarios de reparto: 07:00–12:30 y 14:00–18:30
                </span>
              </div>

              {/* Group orders by delivery date */}
              {Array.from(new Set(orders.map((o) => o.deliveryDate)))
                .sort()
                .map((dateStr) => {
                  const dayOrders = orders.filter((o) => o.deliveryDate === dateStr);
                  return (
                    <div key={dateStr} className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
                      <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#d92d20]" />
                          <span className="font-display text-base text-neutral-900">
                            Fecha: {dateStr}
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-neutral-200 text-neutral-800 px-3 py-1 rounded-full">
                          {dayOrders.length} entrega{dayOrders.length !== 1 ? "s" : ""} programada{dayOrders.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dayOrders.map((o) => (
                          <div
                            key={o.id}
                            className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-xs"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-mono font-black text-neutral-900">{o.id}</span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                {o.deliverySlot}
                              </span>
                            </div>
                            <p className="font-bold text-neutral-900">{o.customer.nombre}</p>
                            <p className="text-neutral-600">Colegio: <b>{o.customer.unidad}</b></p>
                            <p className="text-neutral-500">Total: <b>{o.total} Bs</b> ({o.totalBooks} libros)</p>
                            {o.deliveryLocation && (
                              <a
                                href={`https://www.google.com/maps?q=${o.deliveryLocation.lat},${o.deliveryLocation.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#d92d20] hover:underline flex items-center gap-1 font-bold pt-1"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Ver ubicación en Google Maps</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* TAB 3: GESTIÓN DE PRODUCTOS */}
          {activeTab === "productos" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl text-neutral-900">Inventario y Catálogo de Libros</h3>
                  <p className="text-xs text-neutral-500 font-medium">Modifica precios en Bs., stock físico y disponibilidad sin tocar código</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-18 object-cover rounded-lg border border-neutral-200 shadow-xs"
                      />
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#d92d20] block">
                          {prod.level}
                        </span>
                        <h4 className="font-bold text-sm text-neutral-900">{prod.name}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                          prod.inStock ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {prod.inStock ? "Disponible" : "Agotado"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-neutral-500 block">
                          Precio Oficial (Bs.)
                        </label>
                        <input
                          type="number"
                          value={prod.price}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            onUpdateProduct({ ...prod, price: val });
                          }}
                          className="w-full mt-1 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-sm font-black text-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-neutral-500 block">
                          Stock en Bodega
                        </label>
                        <input
                          type="number"
                          value={prod.stock}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            onUpdateProduct({ ...prod, stock: val, inStock: val > 0 });
                          }}
                          className="w-full mt-1 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-sm font-black text-neutral-900"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => onUpdateProduct({ ...prod, inStock: !prod.inStock })}
                          className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            prod.inStock
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          }`}
                        >
                          {prod.inStock ? "Marcar como Agotado" : "Marcar como Disponible"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BANDEJA DE MENSAJES */}
          {activeTab === "mensajes" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl text-neutral-900">Bandeja de Consultas de Clientes</h3>
                  <p className="text-xs text-neutral-500 font-medium">Preguntas enviadas a través del formulario web</p>
                </div>
                <span className="text-xs font-bold text-neutral-500">
                  {messages.length} mensaje{messages.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl text-center text-neutral-400 font-medium">
                    No hay mensajes recibidos aún.
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-neutral-900 text-sm">{m.name}</span>
                          {m.school && <span className="text-neutral-500 text-xs ml-2">({m.school})</span>}
                          <p className="text-xs text-neutral-400 mt-0.5">
                            Celular: <b>{m.phone}</b> {m.email ? `· Correo: ${m.email}` : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={m.status}
                            onChange={(e) =>
                              onUpdateMessageStatus(m.id, e.target.value as "nuevo" | "respondido" | "archivado")
                            }
                            className="text-xs font-bold border border-neutral-300 rounded-lg px-2 py-1 cursor-pointer"
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="respondido">Respondido</option>
                            <option value="archivado">Archivado</option>
                          </select>

                          <a
                            href={`https://wa.me/591${m.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                              `Hola ${m.name}, te escribimos de Editorial Luchito Santa Cruz sobre tu consulta: "${m.subject}".`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#25d366] hover:bg-[#1ebd5a] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Responder por WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-700 font-medium">
                        <p className="font-bold text-neutral-900 mb-1">Asunto: {m.subject}</p>
                        <p className="leading-relaxed">{m.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MÉTRICAS Y ESTADÍSTICAS */}
          {activeTab === "metricas" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Recaudado</span>
                  <span className="font-display text-3xl text-[#d92d20] mt-1 block">{totalRevenue} Bs</span>
                  <span className="text-[11px] text-emerald-600 font-bold">Moneda nacional (BOB)</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Libros Vendidos</span>
                  <span className="font-display text-3xl text-neutral-900 mt-1 block">{totalBooksSold}</span>
                  <span className="text-[11px] text-neutral-500 font-medium">Ejemplares escolares</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Pendientes</span>
                  <span className="font-display text-3xl text-amber-600 mt-1 block">{pendingOrdersCount}</span>
                  <span className="text-[11px] text-neutral-500 font-medium">Por confirmar o despachar</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Entregados</span>
                  <span className="font-display text-3xl text-emerald-600 mt-1 block">{completedOrdersCount}</span>
                  <span className="text-[11px] text-emerald-600 font-bold">Conformes en colegio</span>
                </div>
              </div>

              {/* Sales breakdown by book */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                  <h4 className="font-display text-lg text-neutral-900">Ventas por Grado</h4>
                  <div className="space-y-3">
                    {products.map((p) => {
                      const countSold = orders
                        .filter((o) => o.status !== "cancelado")
                        .reduce((acc, curr) => {
                          const item = curr.items.find((i) => i.productId === p.id);
                          return acc + (item ? item.qty : 0);
                        }, 0);

                      const pct = totalBooksSold > 0 ? Math.round((countSold / totalBooksSold) * 100) : 0;

                      return (
                        <div key={p.id} className="space-y-1 text-xs">
                          <div className="flex justify-between font-bold text-neutral-700">
                            <span>{p.name} ({p.price} Bs)</span>
                            <span>{countSold} unid. ({countSold * p.price} Bs)</span>
                          </div>
                          <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#d92d20] h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display text-lg text-neutral-900">Colegios con más Pedidos</h4>
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="text-xs text-[#d92d20] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Reporte</span>
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-100 text-xs">
                    {uniqueSchools.map((school, i) => {
                      const schoolOrders = orders.filter((o) => o.customer.unidad === school);
                      const schoolTotal = schoolOrders.reduce((sum, o) => sum + o.total, 0);
                      const schoolBooks = schoolOrders.reduce((sum, o) => sum + o.totalBooks, 0);

                      return (
                        <div key={i} className="py-2.5 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-neutral-900">{school}</p>
                            <p className="text-[11px] text-neutral-400">
                              {schoolOrders.length} pedido{schoolOrders.length !== 1 ? "s" : ""} · {schoolBooks} libros
                            </p>
                          </div>
                          <span className="font-mono font-bold text-neutral-900">{schoolTotal} Bs</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ASISTENTE DE IA DE VENTAS */}
          {activeTab === "ia" && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 max-w-3xl mx-auto space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#d92d20] flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-neutral-900">Asistente Pedagógico y de Ventas IA</h3>
                  <p className="text-xs text-neutral-500 font-medium">Asesoramiento para profesores, padres de familia y cotizaciones de cursos</p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="h-80 overflow-y-auto space-y-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs">
                {aiChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed font-medium ${
                        msg.sender === "user"
                          ? "bg-[#d92d20] text-white rounded-br-none"
                          : "bg-white text-neutral-800 shadow-xs border border-neutral-200 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Preset prompt buttons */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-neutral-400 font-bold">Preguntas sugeridas:</span>
                <button
                  type="button"
                  onClick={() => setAiQuestion("¿Cuáles son los precios de los libros para este año?")}
                  className="bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded cursor-pointer"
                >
                  Precios oficiales
                </button>
                <button
                  type="button"
                  onClick={() => setAiQuestion("¿Qué incluye el módulo Manos a la Obra?")}
                  className="bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded cursor-pointer"
                >
                  Manos a la Obra
                </button>
                <button
                  type="button"
                  onClick={() => setAiQuestion("¿Qué materias llevan en 3ro de Primaria?")}
                  className="bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded cursor-pointer"
                >
                  Materias de 3ro
                </button>
              </div>

              <form onSubmit={handleSendAi} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Pregúntale algo sobre los libros o cotizaciones de Editorial Luchito..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-medium focus:border-[#d92d20] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#d92d20] hover:bg-[#b42318] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Preguntar</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: INTEGRACIONES SUPABASE & RAILWAY */}
          {activeTab === "integraciones" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Supabase info */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                    S
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-neutral-900">Base de Datos Supabase (São Paulo)</h3>
                    <p className="text-xs text-neutral-500 font-medium">Tablas para usuarios, productos, pedidos y mensajes</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                  Para persistencia en la nube en tiempo real, puedes copiar este script SQL en el <b>SQL Editor</b> de tu proyecto Supabase (elige la región <b>São Paulo, Brasil</b> que es la más cercana y rápida para Bolivia):
                </p>

                <div className="bg-neutral-900 text-amber-200 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-52">
                  <pre>{`-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INT DEFAULT 100,
  in_stock BOOLEAN DEFAULT true,
  description TEXT,
  image_url TEXT
);

-- Tabla de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id TEXT PRIMARY KEY,
  cliente_nombre TEXT NOT NULL,
  celular TEXT NOT NULL,
  correo TEXT,
  unidad_educativa TEXT NOT NULL,
  ciudad TEXT DEFAULT 'Santa Cruz',
  modalidad_entrega TEXT,
  fecha_entrega DATE,
  franja_horaria TEXT,
  latitud NUMERIC,
  longitud NUMERIC,
  metodo_pago TEXT,
  total NUMERIC NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  items JSONB,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  celular TEXT NOT NULL,
  colegio TEXT,
  asunto TEXT,
  mensaje TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</pre>
                </div>
              </div>

              {/* Railway deployment guide */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
                    R
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-neutral-900">Despliegue en Railway & Tareas Programadas</h3>
                    <p className="text-xs text-neutral-500 font-medium">Configuración de servidor, dominio propio y cron diario</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-neutral-700 font-medium">
                  <p>1. <b>Publicación:</b> Conecta tu repositorio de GitHub a Railway. Railway detecta automáticamente Vite / Node y ejecuta <code>npm run build</code> y <code>npm run start</code>.</p>
                  <p>2. <b>Dominio Propio:</b> En Settings &gt; Networking &gt; Custom Domain, añade tu dominio (ej: <code>editorialluchito.bo</code> o <code>multitextosluchito.com</code>).</p>
                  <p>3. <b>Tarea programada (Cron matutino):</b> Programa un cron a las 07:00 AM que consulte los pedidos de la fecha con estado <code>pagado</code> o <code>en_camino</code> y envíe el resumen a tu WhatsApp vía CallMeBot o API.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
