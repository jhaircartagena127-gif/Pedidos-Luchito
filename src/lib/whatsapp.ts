import { PRODUCTS, BUSINESS_INFO } from "@/data/products";
import { OrderQuantities, CustomerData } from "@/types";

export function lineTotals(qty: OrderQuantities) {
  return PRODUCTS.filter((p) => (qty[p.id] ?? 0) > 0).map((p) => {
    const q = qty[p.id] ?? 0;
    return {
      ...p,
      qty: q,
      subtotal: p.price * q,
    };
  });
}

export function orderTotal(qty: OrderQuantities) {
  return lineTotals(qty).reduce((acc, curr) => acc + curr.subtotal, 0);
}

export function totalBooksCount(qty: OrderQuantities) {
  return Object.values(qty).reduce((acc, count) => acc + (count || 0), 0);
}

export function generateWhatsAppUrl(customer: CustomerData, qty: OrderQuantities) {
  const lines = lineTotals(qty);
  const total = orderTotal(qty);
  const totalBooks = totalBooksCount(qty);

  const messageLines = [
    `📚 *NUEVO PEDIDO - MULTITEXTOS LUCHITO*`,
    `─────────────────────────`,
    `👤 *Cliente:* ${customer.nombre}`,
    `📱 *Celular:* ${customer.celular}`,
    `🏫 *Unidad Educativa:* ${customer.unidad}`,
    customer.ciudad ? `📍 *Ciudad/Localidad:* ${customer.ciudad}` : `📍 *Ciudad:* Santa Cruz`,
    customer.notas ? `📝 *Nota:* ${customer.notas}` : "",
    ``,
    `📖 *DETALLE DEL PEDIDO:*`,
    ...lines.map(
      (line) => `• *${line.name}*: ${line.qty} unid. x ${line.price} Bs = *${line.subtotal} Bs*`
    ),
    ``,
    `─────────────────────────`,
    `📦 *Total de libros:* ${totalBooks} unidad${totalBooks !== 1 ? "es" : ""}`,
    `💰 *TOTAL A PAGAR:* *${total} Bs*`,
    `─────────────────────────`,
    `Por favor, confirmar disponibilidad y datos para el pago (QR / Transferencia) y entrega. ¡Muchas gracias!`,
  ].filter(Boolean);

  const encoded = encodeURIComponent(messageLines.join("\n"));
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encoded}`;
}

export function quickWhatsAppInfoUrl(subjectName?: string) {
  const text = subjectName
    ? `Hola Editorial Luchito, deseo información sobre el libro *${subjectName}*.`
    : `Hola Editorial Luchito, deseo información sobre el catálogo de Multitextos Luchito para Inicial y Primaria.`;
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
