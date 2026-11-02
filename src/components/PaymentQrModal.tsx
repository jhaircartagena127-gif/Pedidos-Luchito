import { useState } from "react";
import { X, QrCode, Copy, Check, Download, ExternalLink, ShieldCheck, MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/data/products";

interface PaymentQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  totalAmount: number;
  customerName: string;
}

export function PaymentQrModal({
  isOpen,
  onClose,
  orderId,
  totalAmount,
  customerName,
}: PaymentQrModalProps) {
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!isOpen) return null;

  const handleCopyAccount = () => {
    const text = `Editorial Luchito - Cuenta Corriente / Caja de Ahorro: 10000045892134 (Banco Unión / BCP). Titular: Editorial Luchito Santa Cruz. Referencia: ${orderId} - ${totalAmount} Bs`;
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const whatsappNotifyUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
    `Hola Editorial Luchito, adjunto comprobante de pago para mi pedido *${orderId}* por el monto de *${totalAmount} Bs* a nombre de *${customerName}*.`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#7a1610] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <QrCode className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-display text-xl text-white">Pago con QR Simple</h3>
              <p className="text-xs text-red-200 font-medium">Banca Móvil de cualquier banco de Bolivia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 cursor-pointer"
            aria-label="Cerrar modal de pago"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-center">
          {/* Order Reference Box */}
          <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200 flex justify-between items-center text-xs">
            <div>
              <span className="text-neutral-500 block font-bold">N° de Pedido</span>
              <span className="font-mono font-black text-neutral-900 text-sm">{orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 block font-bold">Monto a Transferir</span>
              <span className="font-display text-xl text-[#d92d20]">{totalAmount} Bs</span>
            </div>
          </div>

          {/* Styled QR Code Box */}
          <div className="flex flex-col items-center justify-center p-4 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-300">
            {/* SVG QR Code Illustration */}
            <div className="p-3 bg-white rounded-xl shadow-md border border-neutral-200 w-52 h-52 flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900 fill-current">
                {/* Simulated high quality QR geometry for QR Simple */}
                <rect x="0" y="0" width="30" height="30" rx="3" fill="#1e1e1e" />
                <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                <rect x="10" y="10" width="10" height="10" fill="#d92d20" />

                <rect x="70" y="0" width="30" height="30" rx="3" fill="#1e1e1e" />
                <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                <rect x="80" y="10" width="10" height="10" fill="#d92d20" />

                <rect x="0" y="70" width="30" height="30" rx="3" fill="#1e1e1e" />
                <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                <rect x="10" y="80" width="10" height="10" fill="#d92d20" />

                {/* Inner Data Pattern */}
                <rect x="36" y="8" width="6" height="6" />
                <rect x="48" y="12" width="6" height="6" />
                <rect x="40" y="24" width="8" height="6" />
                <rect x="54" y="28" width="6" height="6" />

                <rect x="8" y="40" width="6" height="6" />
                <rect x="20" y="44" width="6" height="6" />
                <rect x="12" y="56" width="6" height="6" />

                <rect x="36" y="38" width="28" height="28" rx="4" fill="#d92d20" />
                <circle cx="50" cy="52" r="8" fill="#ffffff" />
                <circle cx="50" cy="52" r="4" fill="#d92d20" />

                <rect x="72" y="40" width="6" height="6" />
                <rect x="84" y="48" width="6" height="6" />
                <rect x="76" y="58" width="6" height="6" />

                <rect x="40" y="72" width="8" height="6" />
                <rect x="56" y="76" width="6" height="6" />
                <rect x="44" y="86" width="6" height="6" />
                <rect x="70" y="84" width="8" height="6" />
                <rect x="84" y="76" width="6" height="6" />
              </svg>

              <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider mt-1 block">
                QR SIMPLE · BOLIVIA
              </span>
            </div>

            <p className="text-xs text-neutral-600 font-semibold mt-3">
              Escanea desde tu app bancaria (Banco Unión, BCP, BNB, Banco Mercantil, etc.)
            </p>
          </div>

          {/* Bank Transfer Details */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left space-y-1.5 text-xs">
            <p className="font-bold text-neutral-900 flex items-center justify-between">
              <span>Datos para transferencia directa:</span>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="text-[#d92d20] hover:underline flex items-center gap-1 font-black cursor-pointer"
              >
                {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount ? "Copiado" : "Copiar datos"}</span>
              </button>
            </p>
            <p className="text-neutral-600 font-medium"><b>Titular:</b> Editorial Luchito Santa Cruz</p>
            <p className="text-neutral-600 font-medium"><b>Banco:</b> Banco Unión / BCP Bolivia</p>
            <p className="text-neutral-600 font-medium"><b>Caja de Ahorro:</b> 10000045892134 (Bs.)</p>
            <p className="text-neutral-600 font-medium"><b>Glosa / Motivo:</b> {orderId}</p>
          </div>

          {/* Trust indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 py-2 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Pago seguro y verificado directamente con la editorial</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex flex-col sm:flex-row gap-2">
          <a
            href={whatsappNotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#25d366] hover:bg-[#1ebd5a] text-white py-3 px-4 font-black text-xs shadow-md transition-transform hover:scale-102"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar comprobante por WhatsApp</span>
          </a>
          <button
            onClick={onClose}
            className="rounded-full border border-neutral-300 hover:bg-neutral-200 text-neutral-700 py-2.5 px-4 font-bold text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
