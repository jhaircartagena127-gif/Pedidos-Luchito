export type DeliveryType = "colegio" | "recojo";
export type PaymentMethod = "efectivo" | "qr";
export type OrderStatus = "pendiente" | "pagado" | "en_camino" | "entregado" | "cancelado";
export type DeliverySlot = "07:00-09:30" | "09:30-12:30" | "14:00-16:30" | "16:30-18:30";

export interface Product {
  id: string;
  name: string;
  level: "inicial" | "primaria";
  tag: string;
  price: number;
  stock: number;
  inStock: boolean;
  image: string;
  description: string;
  modules: string[];
  features: string[];
  color: string;
}

export type OrderQuantities = Record<string, number>;

export interface CustomerData {
  nombre: string;
  celular: string;
  correo?: string;
  unidad: string;
  ciudad: string;
  notas?: string;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
  addressText?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
  subtotal: number;
  image?: string;
}

export interface Order {
  id: string;
  customer: CustomerData;
  items: OrderItem[];
  total: number;
  totalBooks: number;
  deliveryType: DeliveryType;
  deliveryDate: string; // YYYY-MM-DD
  deliverySlot: DeliverySlot;
  deliveryLocation?: LocationCoordinates;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string; // ISO string
  notes?: string;
}

export interface ClientMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  school?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "nuevo" | "respondido" | "archivado";
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  connected: boolean;
}
