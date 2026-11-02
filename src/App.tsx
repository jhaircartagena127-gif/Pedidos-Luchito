/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { InicialSection } from "@/components/InicialSection";
import { PrimariaSection } from "@/components/PrimariaSection";
import { PedagogyFeatures } from "@/components/PedagogyFeatures";
import { OrderForm } from "@/components/OrderForm";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { BookDetailModal } from "@/components/BookDetailModal";
import { CartBottomBar } from "@/components/CartBottomBar";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { OrderTrackerModal } from "@/components/OrderTrackerModal";
import { AdminPanel } from "@/components/AdminPanel";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_MESSAGES } from "@/data/products";
import { Product, Order, ClientMessage, OrderQuantities, OrderStatus } from "@/types";
import { totalBooksCount } from "@/lib/whatsapp";

export default function App() {
  // Products state (synchronized with localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("luchito_products_v1");
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Orders state (synchronized with localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("luchito_orders_v1");
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Messages state (synchronized with localStorage)
  const [messages, setMessages] = useState<ClientMessage[]>(() => {
    try {
      const saved = localStorage.getItem("luchito_messages_v1");
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("luchito_products_v1", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("luchito_orders_v1", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("luchito_messages_v1", JSON.stringify(messages));
  }, [messages]);

  // Cart state
  const [quantities, setQuantities] = useState<OrderQuantities>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals state
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerSearchId, setTrackerSearchId] = useState("");
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const cartCount = totalBooksCount(quantities);

  const handleAddToCart = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) + 1,
    }));
  };

  const handleUpdateQty = (productId: string, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: qty,
    }));
  };

  const handleClearQty = () => {
    setQuantities({});
  };

  const handleSetPreset = (preset: "inicial" | "primaria-baja" | "primaria-alta" | "completo") => {
    if (preset === "inicial") {
      setQuantities({ prekinder: 1, kinder: 1 });
    } else if (preset === "primaria-baja") {
      setQuantities({ p1: 1, p2: 1, p3: 1 });
    } else if (preset === "primaria-alta") {
      setQuantities({ p4: 1, p5: 1, p6: 1 });
    } else if (preset === "completo") {
      const full: OrderQuantities = {};
      products.forEach((p) => {
        full[p.id] = 1;
      });
      setQuantities(full);
    }
  };

  const scrollToOrder = () => {
    const el = document.getElementById("pedido");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = newOrder.items.find((i) => i.productId === p.id);
        if (item) {
          const remaining = Math.max(0, p.stock - item.qty);
          return {
            ...p,
            stock: remaining,
            inStock: remaining > 0,
          };
        }
        return p;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleSendMessage = (msgData: Omit<ClientMessage, "id" | "createdAt" | "status">) => {
    const newMsg: ClientMessage = {
      ...msgData,
      id: `MSG-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: "nuevo",
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const handleOpenTrackerWithId = (orderId: string) => {
    setTrackerSearchId(orderId);
    setIsTrackerOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-[#d92d20] selection:text-white pb-16">
      {/* Navigation */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={scrollToOrder}
        onOpenTracker={() => {
          setTrackerSearchId("");
          setIsTrackerOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        {/* Hero Banner with Interactive 3D Showcase */}
        <Hero
          onSelectProduct={(p) => setSelectedProduct(p)}
          onScrollToOrder={scrollToOrder}
        />

        {/* Nivel Inicial (Prekínder y Kínder) */}
        <InicialSection
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
          quantities={quantities}
        />

        {/* Nivel Primario (1ro a 6to) */}
        <PrimariaSection
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
          quantities={quantities}
        />

        {/* Pedagogy Architecture: 4 Áreas + Manos a la Obra */}
        <PedagogyFeatures />

        {/* Complete Order Form with Leaflet Map, Date/Slots, QR & Presets */}
        <section className="py-16 md:py-24 bg-neutral-100/70 border-t border-neutral-200/80">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#d92d20] bg-red-100 border border-red-200 px-3.5 py-1 rounded-full">
                Cotización y Pedido en Línea
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                Calcula tu Pedido con Ubicación en Mapa y QR
              </h2>
              <p className="text-sm text-neutral-600 font-medium">
                Selecciona tus libros, fija el punto en el mapa de Santa Cruz, elige fecha y franja horaria, y confirma directamente a nuestro WhatsApp oficial.
              </p>
            </div>

            <OrderForm
              products={products}
              quantities={quantities}
              onUpdateQty={handleUpdateQty}
              onClearQty={handleClearQty}
              onSetPreset={handleSetPreset}
              onOrderCreated={handleOrderCreated}
              onOpenTracker={handleOpenTrackerWithId}
            />
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Contact, Location Map & Client Messages */}
        <ContactSection onSendMessage={handleSendMessage} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Bottom Cart Bar (visible while choosing books) */}
      <CartBottomBar
        quantities={quantities}
        onOpenOrderForm={scrollToOrder}
        onClear={handleClearQty}
      />

      {/* Book Detail Modal */}
      <BookDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        currentQty={selectedProduct ? quantities[selectedProduct.id] ?? 0 : 0}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        initialSearchQuery={trackerSearchId}
      />

      {/* Admin Dashboard */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        products={products}
        messages={messages}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateProduct={handleUpdateProduct}
        onUpdateMessageStatus={(msgId, status) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, status } : m))
          );
        }}
      />

      {/* Persistent Floating WhatsApp Button */}
      <FloatingWhatsApp cartCount={cartCount} onOpenCart={scrollToOrder} />
    </div>
  );
}
