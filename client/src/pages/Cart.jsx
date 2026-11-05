import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';
import CheckoutModal from '../components/CheckoutModal';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    promoCode,
    applyPromo,
    removePromo,
    tax,
    shipping,
    grandTotal,
  } = useCart();

  const { addToast } = useToast();
  const [promoInput, setPromoInput] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyPromo(promoInput);
    if (res.success) {
      addToast(res.message, 'success');
      setPromoInput('');
    } else {
      addToast(res.message, 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Looks like you haven't added any products to your cart yet. Explore our high-performance hardware and audio gear catalog.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review your selected items and configure shipping before proceeding.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Entire Cart
        </button>
      </div>

      {/* Main Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <Link to={`/products/${item.id}`} className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={item.thumbnail || item.images?.[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <Link to={`/products/${item.id}`} className="block mt-1 font-bold text-gray-900 hover:text-emerald-600 transition-colors text-sm line-clamp-1">
                      {item.title}
                    </Link>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-lg hover:bg-white text-gray-600 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock || 99)}
                      className="p-1 rounded-lg hover:bg-white text-gray-600 disabled:opacity-30 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      addToast(`Removed "${item.title}" from cart`, 'info');
                    }}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping in Catalog</span>
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

            {/* Promo Code Form */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Coupon (e.g. SAVE10)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoCode && (
                <div className="mt-2.5 flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Coupon {promoCode} Active</span>
                  </div>
                  <button onClick={removePromo} className="text-emerald-700 hover:text-emerald-900">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promotional Savings</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Standard Delivery</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      FREE
                    </span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>

              {subtotal < 100 && shipping > 0 && (
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl text-[11px] leading-tight">
                  Add <strong>{formatCurrency(100 - subtotal)}</strong> more of eligible items to unlock free shipping!
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Estimated Total</span>
              <span className="text-2xl font-extrabold text-emerald-600">
                {formatCurrency(grandTotal)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted 256-bit SSL Checkout</span>
            </div>

          </div>
        </div>

      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

    </div>
  );
}
