import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  Store,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CartDrawer({ onOrderCreated }) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    setActiveOrderCode,
  } = useCart();

  // Checkout states
  const [orderType, setOrderType] = useState('In-Store Walk-in'); // 'Remote Pre-Order' | 'In-Store Walk-in'
  const [paymentMethod, setPaymentMethod] = useState('Pay at Counter'); // 'Pay at Counter' | 'Online Payment'
  const [onlineProvider, setOnlineProvider] = useState('GCash'); // 'GCash' | 'Maya'
  const [paymentReference, setPaymentReference] = useState('');
  const [pickupTime, setPickupTime] = useState('ASAP (10-15 mins)');
  const [customerName, setCustomerName] = useState('Jusselle Surio');
  const [customerPhone, setCustomerPhone] = useState('0917-888-2468');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Order Type Switch changes
  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    if (type === 'Remote Pre-Order') {
      // Remote Pre-Order strictly requires Online Payment
      setPaymentMethod('Online Payment');
    }
  };

  const discount = 0.00;
  const serviceFee = 0.00;
  const grandTotal = Math.max(0, subtotal - discount + serviceFee);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cartItems.length === 0) {
      setErrorMsg('Your cart is empty. Add drinks or pastries before checking out!');
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    if (paymentMethod === 'Online Payment' && !paymentReference.trim()) {
      setErrorMsg(`Please enter your ${onlineProvider} reference number (or mock receipt number e.g. 98421034).`);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        branch_name: 'Kape Muna — Main Branch',
        order_type: orderType,
        payment_method: paymentMethod,
        payment_reference: paymentMethod === 'Online Payment' ? `${onlineProvider}: ${paymentReference}` : null,
        pickup_time: pickupTime,
        notes: notes.trim(),
        applied_discount: discount,
        items: cartItems.map((it) => ({
          menu_item_id: it.menu_item_id,
          item_name: it.item_name,
          item_price: it.item_price,
          quantity: it.quantity,
          selected_size: it.selected_size,
          selected_sweetness: it.selected_sweetness,
          selected_milk: it.selected_milk,
          selected_shots: it.selected_shots,
          customization_total: it.customization_total,
          line_total: it.line_total,
          special_notes: it.special_notes,
        })),
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Server rejected order creation');
      }

      // Success! Set active order and notify parent
      clearCart();
      setActiveOrderCode(data.order.order_code);
      setIsCartOpen(false);

      if (onOrderCreated) {
        onOrderCreated(data.order.order_code);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'Unable to place order. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div
        className="w-full sm:max-w-md h-full bg-[#FAF7F2] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-[#EDE3D5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#FDFBF7] border-b border-[#EDE3D5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#221610] text-[#FAF6F0] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#221610]">Your Order Cart</h2>
              <p className="text-[11px] text-[#221610]/60">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F4ECE1] text-[#221610] flex items-center justify-center hover:bg-[#EAE1D3] transition-all"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Cart Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-[#F3EDE2] text-caramel flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-[#221610]">Your cart is currently empty</p>
              <p className="text-xs text-[#221610]/60 mt-1 max-w-[220px] mx-auto">
                Explore our signature coffees and freshly baked pastries to start an order.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#221610]/80">
                <span>Selected Items</span>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-semibold text-[11px]"
                >
                  Clear all
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#ECE2D3] shadow-cafe-sm flex gap-3 items-center"
                >
                  <img
                    src={item.image_url}
                    alt={item.item_name}
                    className="w-16 h-16 rounded-xl object-cover bg-cream-chip flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#221610] truncate">
                        {item.item_name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Customization Tags */}
                    <div className="text-[10px] text-[#221610]/60 space-y-0.5 mt-1">
                      {item.selected_size !== 'Standard' && (
                        <p>Size: <span className="font-semibold">{item.selected_size}</span></p>
                      )}
                      {item.selected_milk !== 'None' && item.selected_milk !== 'Whole Milk' && (
                        <p>Milk: <span className="font-semibold text-caramel">{item.selected_milk}</span></p>
                      )}
                      {item.selected_shots !== 'None' && item.selected_shots !== 'Single Shot' && (
                        <p>Shots: <span className="font-semibold text-caramel">{item.selected_shots}</span></p>
                      )}
                      {item.special_notes && (
                        <p className="italic text-gray-500 truncate">"{item.special_notes}"</p>
                      )}
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-cream-chip">
                      <div className="flex items-center border border-[#EDE3D5] rounded-xl bg-white px-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-5 h-5 flex items-center justify-center text-roast hover:text-caramel"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#221610]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-5 h-5 flex items-center justify-center text-roast hover:text-caramel"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-roast">
                        ₱{item.line_total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checkout Controls (shown when items exist) */}
          {cartItems.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* 1. Order Type Switch */}
              <div>
                <label className="block text-xs font-bold text-[#221610] uppercase tracking-wider mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#F3EDE2] p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleOrderTypeChange('In-Store Walk-in')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      orderType === 'In-Store Walk-in'
                        ? 'bg-[#221610] text-[#FAF6F0] shadow-sm'
                        : 'text-[#221610]/70 hover:text-[#221610]'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>In-Store Walk-in</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOrderTypeChange('Remote Pre-Order')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      orderType === 'Remote Pre-Order'
                        ? 'bg-[#221610] text-[#FAF6F0] shadow-sm'
                        : 'text-[#221610]/70 hover:text-[#221610]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Remote Pre-Order</span>
                  </button>
                </div>
              </div>

              {/* 2. Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-[#221610] uppercase tracking-wider mb-2">
                  Payment Method
                </label>

                {orderType === 'Remote Pre-Order' ? (
                  /* Strictly Online Payment for Remote Pre-Order */
                  <div className="p-3 bg-cream-card border border-caramel/40 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-roast flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-caramel" />
                        Online E-Wallet Payment
                      </span>
                      <span className="text-[10px] font-bold text-caramel uppercase bg-caramel/10 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {['GCash', 'Maya'].map((wallet) => (
                        <button
                          key={wallet}
                          type="button"
                          onClick={() => setOnlineProvider(wallet)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                            onlineProvider === wallet
                              ? 'bg-[#221610] text-white border-[#221610]'
                              : 'bg-white text-roast border-[#EDE3D5]'
                          }`}
                        >
                          {wallet}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-roast/70 mb-1">
                        {onlineProvider} Reference Number / Mock Txn ID
                      </label>
                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="e.g. 9812-3049-1102"
                        className="w-full bg-white border border-[#EDE3D5] p-2 rounded-xl text-xs text-roast focus:ring-1 focus:ring-caramel outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  /* In-Store Walk-in: Pay at Counter or Full Online Payment */
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Pay at Counter')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'Pay at Counter'
                          ? 'bg-[#221610] text-white border-[#221610] shadow-sm'
                          : 'bg-white text-[#221610] border-[#EDE3D5]'
                      }`}
                    >
                      <Store className="w-4 h-4 mb-1 text-caramel-gold" />
                      <span className="block text-xs font-bold">Pay at Counter</span>
                      <span className={`block text-[10px] ${paymentMethod === 'Pay at Counter' ? 'text-white/70' : 'text-roast/50'}`}>
                        Cash or Card at register
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Online Payment')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'Online Payment'
                          ? 'bg-[#221610] text-white border-[#221610] shadow-sm'
                          : 'bg-white text-[#221610] border-[#EDE3D5]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1 text-caramel-gold" />
                      <span className="block text-xs font-bold">Online Payment</span>
                      <span className={`block text-[10px] ${paymentMethod === 'Online Payment' ? 'text-white/70' : 'text-roast/50'}`}>
                        GCash or Maya scan
                      </span>
                    </button>
                  </div>
                )}

                {/* If In-Store chosen Online Payment, show reference input */}
                {orderType === 'In-Store Walk-in' && paymentMethod === 'Online Payment' && (
                  <div className="mt-2 p-3 bg-white border border-[#EDE3D5] rounded-xl space-y-2">
                    <div className="flex gap-2">
                      {['GCash', 'Maya'].map((wallet) => (
                        <button
                          key={wallet}
                          type="button"
                          onClick={() => setOnlineProvider(wallet)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                            onlineProvider === wallet ? 'bg-caramel text-white' : 'bg-gray-100 text-roast'
                          }`}
                        >
                          {wallet}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Transaction Reference Number"
                      className="w-full bg-[#FAF7F2] border border-[#EDE3D5] p-2 rounded-lg text-xs outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 3. Pickup Time Slot Selector */}
              <div>
                <label className="block text-xs font-bold text-[#221610] uppercase tracking-wider mb-2">
                  Pickup Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'ASAP (10-15 mins)',
                    'In 30 mins',
                    'In 45 mins',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPickupTime(slot)}
                      className={`py-2 px-1 rounded-xl border text-center text-xs font-semibold transition-all ${
                        pickupTime === slot
                          ? 'bg-caramel text-white border-caramel shadow-sm'
                          : 'bg-white text-roast border-[#EDE3D5] hover:border-caramel/40'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Customer Details */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#221610] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-[#EDE3D5] p-2 rounded-xl text-xs text-roast outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#221610] mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-[#EDE3D5] p-2 rounded-xl text-xs text-roast outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Order Summary & Place Order CTA */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-[#FDFBF7] border-t border-[#EDE3D5] space-y-3 shadow-lg">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-roast/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-roast">₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-caramel">
                <span>Packaging & Counter Pickup</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-roast pt-2 border-t border-[#EDE3D5]">
                <span>Total Amount</span>
                <span className="text-base text-caramel">₱{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#221610] to-caramel hover:from-[#160E0A] hover:to-caramel-hover text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-cafe-md active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Order to Kitchen...</span>
                </div>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'Pay at Counter'
                      ? 'Submit Order (Pay at Counter)'
                      : `Pay ₱${grandTotal.toFixed(2)} with ${onlineProvider}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
