import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Coffee,
  Store,
  CreditCard,
  Ban,
  ChevronRight,
  Sparkles,
  RefreshCw,
  BellRing,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useOrderTracker } from '../hooks/useOrderTracker';

const STATUS_STEPS = [
  { id: 'Pending Payment', label: 'Payment', desc: 'Awaiting register or verification' },
  { id: 'Queued', label: 'Queued', desc: 'Order sent to coffee bar' },
  { id: 'Preparing', label: 'Preparing', desc: 'Espresso extraction & steaming' },
  { id: 'Ready for Pickup', label: 'Ready', desc: 'Fresh at pickup counter' },
  { id: 'Completed', label: 'Completed', desc: 'Claimed by customer' },
];

export default function LiveOrderTracker({ orderCode, onBackToMenu }) {
  const {
    order,
    loading,
    error,
    refreshOrder,
    cancelOrder,
    updateStatusSimulation,
  } = useOrderTracker(orderCode);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [showSimControls, setShowSimControls] = useState(true);

  // Trigger confetti celebration when order switches to 'Ready for Pickup'
  useEffect(() => {
    if (order?.status === 'Ready for Pickup') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#9A5B2D', '#B5743D', '#C48A45', '#FAF6F0'],
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [order?.status]);

  if (loading && !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-12 h-12 border-3 border-caramel border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-sm font-bold text-roast">Connecting to Live Kitchen Feed...</h3>
        <p className="text-xs text-roast/60 mt-1">Retrieving order #{orderCode}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 text-center max-w-sm mx-auto my-12 bg-cream-card rounded-3xl border border-cream-border shadow-cafe-md">
        <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-roast">Order Not Found</h3>
        <p className="text-xs text-roast/60 mt-1 mb-4">
          {error || `Unable to locate order #${orderCode}.`}
        </p>
        <button
          onClick={onBackToMenu}
          className="bg-roast text-white text-xs font-bold py-2.5 px-5 rounded-full hover:bg-caramel transition-all"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.id === order.status);
  const isCancelled = order.status === 'Cancelled';

  // Strict cancellation rule:
  // Active and clickable ONLY when status is 'Pending Payment' or 'Queued'.
  // Strictly disabled/hidden once status switches to 'Preparing' or later.
  const canCancel = order.status === 'Pending Payment' || order.status === 'Queued';

  const handleConfirmCancel = async () => {
    setCancelling(true);
    setCancelError('');
    const res = await cancelOrder();
    setCancelling(false);
    if (!res.success) {
      setCancelError(res.error || 'Failed to cancel order.');
    } else {
      setCancelModalOpen(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-4 space-y-4 max-w-2xl mx-auto pb-24">
      {/* Top Header Card */}
      <div className="bg-[#FDFBF7] border border-[#ECE2D3] rounded-3xl p-5 shadow-cafe-md relative overflow-hidden">
        {/* Ambient background accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-caramel/5 rounded-bl-full pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-caramel uppercase tracking-widest bg-caramel/10 px-2.5 py-0.5 rounded-full">
                Live Kitchen Ticket
              </span>
              <button
                onClick={refreshOrder}
                className="text-roast/50 hover:text-caramel transition-colors"
                title="Refresh Status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#221610] tracking-tight mt-1">
              Order #{order.order_code}
            </h1>
            <p className="text-xs text-roast/60 mt-0.5">
              {order.branch_name} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="p-2 bg-white rounded-2xl border border-[#EDE3D5] shadow-cafe-sm flex flex-col items-center">
            <QRCodeSVG
              value={`https://kapemuna.local/orders/${order.order_code}`}
              size={64}
              level="M"
              fgColor="#221610"
            />
            <span className="text-[8px] font-bold text-roast/60 tracking-wider mt-1 uppercase">
              Scan Counter
            </span>
          </div>
        </div>

        {/* Dynamic Contextual Banner Alerts */}
        <div className="mt-4">
          {order.status === 'Pending Payment' && order.payment_method === 'Pay at Counter' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-start gap-2.5 shadow-sm">
              <Store className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Payment Required at Counter</p>
                <p className="text-xs font-normal text-amber-800 mt-0.5">
                  Please proceed to the cashier counter to pay and release your order to the kitchen.
                </p>
              </div>
            </div>
          )}

          {order.status === 'Queued' && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm font-semibold flex items-start gap-2.5 shadow-sm">
              <Clock className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Order Received & Queued</p>
                <p className="text-xs font-normal text-blue-800 mt-0.5">
                  Your ticket is in the barista queue. Brewing will begin shortly!
                </p>
              </div>
            </div>
          )}

          {order.status === 'Preparing' && (
            <div className="p-3.5 rounded-2xl bg-[#F6EFE7] border border-caramel/30 text-roast text-xs sm:text-sm font-semibold flex items-start gap-2.5 shadow-sm animate-pulse">
              <Coffee className="w-5 h-5 text-caramel flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-caramel">Baristas Crafting Your Order</p>
                <p className="text-xs font-normal text-roast/70 mt-0.5">
                  Fresh espresso extraction, milk steaming, and pastry preparation in progress.
                </p>
              </div>
            </div>
          )}

          {order.status === 'Ready for Pickup' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-semibold flex items-start gap-2.5 shadow-sm ring-2 ring-emerald-400/30">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5 animate-bounce" />
              <div>
                <p className="font-bold text-emerald-800">Your order is ready!</p>
                <p className="text-xs font-normal text-emerald-700 mt-0.5">
                  Please claim your drink and fresh bakery picks at the pickup counter.
                </p>
              </div>
            </div>
          )}

          {order.status === 'Completed' && (
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <span>Order fulfilled. Thank you for visiting Kape Muna!</span>
            </div>
          )}

          {isCancelled && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center gap-2.5">
              <Ban className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>This order was cancelled.</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Order Step Progress Indicator */}
      {!isCancelled && (
        <div className="bg-[#FDFBF7] border border-[#ECE2D3] rounded-3xl p-5 shadow-cafe-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-roast uppercase tracking-wider">
              Preparation Progress
            </h3>
            <span className="text-xs font-bold text-caramel">
              {order.status}
            </span>
          </div>

          {/* Stepper Line & Nodes */}
          <div className="relative flex justify-between items-center py-2">
            {/* Connecting Bar */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-[#ECE2D3] rounded-full z-0" />
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-caramel to-caramel-gold rounded-full transition-all duration-700 z-0"
              style={{
                width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 92)}%`,
              }}
            />

            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isPast
                        ? 'bg-caramel text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#221610] text-[#FAF6F0] ring-4 ring-caramel/30 scale-110 shadow-cafe-md'
                        : 'bg-white text-roast/40 border-2 border-[#ECE2D3]'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-2 tracking-tight transition-colors text-center max-w-[60px] leading-tight ${
                      isCurrent
                        ? 'text-caramel font-extrabold'
                        : isPast
                        ? 'text-roast'
                        : 'text-roast/40'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Itemized Order Details & Receipt */}
      <div className="bg-[#FDFBF7] border border-[#ECE2D3] rounded-3xl p-5 shadow-cafe-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#ECE2D3] pb-3">
          <h3 className="text-xs font-bold text-roast uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-caramel" />
            Itemized Receipt
          </h3>
          <span className="text-[11px] font-semibold text-roast/60">
            {order.items?.length || 0} items
          </span>
        </div>

        <div className="space-y-3">
          {(order.items || []).map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex justify-between items-start text-xs text-roast py-1 border-b border-cream-chip/60 last:border-b-0"
            >
              <div className="flex-1 pr-3">
                <p className="font-bold text-sm text-[#221610]">
                  {item.quantity}x {item.item_name}
                </p>
                <div className="text-[11px] text-roast/60 space-x-1 mt-0.5">
                  {item.selected_size && <span>{item.selected_size}</span>}
                  {item.selected_sweetness && <span>• {item.selected_sweetness}</span>}
                  {item.selected_milk && item.selected_milk !== 'None' && item.selected_milk !== 'Whole Milk' && (
                    <span>• {item.selected_milk}</span>
                  )}
                  {item.selected_shots && item.selected_shots !== 'None' && item.selected_shots !== 'Single Shot' && (
                    <span>• {item.selected_shots}</span>
                  )}
                </div>
                {item.special_notes && (
                  <p className="text-[10px] italic text-gray-500 mt-0.5">
                    "{item.special_notes}"
                  </p>
                )}
              </div>
              <span className="font-bold text-sm text-roast">
                ₱{Number(item.line_total).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-[#ECE2D3] pt-3 space-y-1.5 text-xs text-roast/70">
          <div className="flex justify-between">
            <span>Customer</span>
            <span className="font-semibold text-roast">{order.customer_name} ({order.customer_phone})</span>
          </div>
          <div className="flex justify-between">
            <span>Order Type</span>
            <span className="font-semibold text-roast">{order.order_type}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="font-semibold text-roast">{order.payment_method} ({order.payment_status})</span>
          </div>
          <div className="flex justify-between">
            <span>Pickup Time</span>
            <span className="font-semibold text-roast">{order.pickup_time}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-roast pt-2 border-t border-[#ECE2D3]">
            <span>Total Paid</span>
            <span className="text-base text-caramel">₱{Number(order.total_price).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Cancel Order Action */}
      {/* "Cancel Order" Button: Active and clickable ONLY when status is 'Pending Payment' or 'Queued'. */}
      {/* Strictly disabled/hidden once status switches to 'Preparing' or later. */}
      {canCancel && (
        <div className="pt-1">
          <button
            onClick={() => setCancelModalOpen(true)}
            className="w-full py-3 px-4 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Ban className="w-4 h-4" />
            <span>Cancel This Order</span>
          </button>
        </div>
      )}

      {/* Interactive Barista & Supabase Event Simulator (For Testing and Demonstration) */}
      <div className="p-4 rounded-3xl bg-[#FAF6F0] border border-[#ECE2D3] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h4 className="text-xs font-bold text-roast uppercase tracking-wider">
              Supabase Realtime Simulator
            </h4>
          </div>
          <button
            onClick={() => setShowSimControls((s) => !s)}
            className="text-[11px] text-caramel font-bold hover:underline"
          >
            {showSimControls ? 'Hide Barista Controls' : 'Show Barista Controls'}
          </button>
        </div>

        {showSimControls && (
          <div className="space-y-2 pt-1 border-t border-[#ECE2D3]">
            <p className="text-[11px] text-roast/70">
              Simulate barista updates to verify realtime WebSocket/SSE events in the UI:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => updateStatusSimulation('Queued', 'paid')}
                disabled={order.status === 'Cancelled'}
                className="py-1.5 px-2 bg-white border border-[#EDE3D5] rounded-xl text-[11px] font-semibold text-roast hover:bg-cream-chip disabled:opacity-40"
              >
                ➔ Mark: Queued
              </button>
              <button
                onClick={() => updateStatusSimulation('Preparing', 'paid')}
                disabled={order.status === 'Cancelled'}
                className="py-1.5 px-2 bg-white border border-[#EDE3D5] rounded-xl text-[11px] font-semibold text-caramel hover:bg-cream-chip disabled:opacity-40"
              >
                ➔ Mark: Preparing
              </button>
              <button
                onClick={() => updateStatusSimulation('Ready for Pickup', 'paid')}
                disabled={order.status === 'Cancelled'}
                className="py-1.5 px-2 bg-white border border-emerald-200 rounded-xl text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-40"
              >
                ➔ Mark: Ready 🎉
              </button>
              <button
                onClick={() => updateStatusSimulation('Completed', 'paid')}
                disabled={order.status === 'Cancelled'}
                className="py-1.5 px-2 bg-white border border-gray-300 rounded-xl text-[11px] font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              >
                ➔ Mark: Completed
              </button>
              <button
                onClick={() => updateStatusSimulation('Pending Payment', 'pending')}
                disabled={order.status === 'Cancelled'}
                className="py-1.5 px-2 bg-white border border-amber-200 rounded-xl text-[11px] font-semibold text-amber-800 hover:bg-amber-50 disabled:opacity-40"
              >
                ➔ Mark: Pay Counter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Order Cancellation */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Ban className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-gray-900">
              Cancel Order #{order.order_code}?
            </h3>
            <p className="text-xs text-center text-gray-600 mt-1 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone once confirmed.
            </p>

            {cancelError && (
              <p className="text-xs text-red-600 text-center mb-3 bg-red-50 p-2 rounded-xl">
                {cancelError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
