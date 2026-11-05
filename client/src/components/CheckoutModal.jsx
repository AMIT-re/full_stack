import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, subtotal, discountAmount, tax, shipping, grandTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'Alex Mercer',
    email: 'alex.mercer@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    zip: '94107',
    paymentMethod: 'Credit Card',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      setError('Please provide required shipping details.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const orderPayload = {
        customer: formData,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail
        })),
        subtotal,
        discountAmount,
        tax,
        shipping,
        total: grandTotal,
        paymentMethod: formData.paymentMethod
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.data) {
        clearCart();
        onClose();
        addToast(`Order placed successfully! Order #${res.data.id}`, 'success');
        navigate('/order-success', { state: { order: res.data } });
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Secure Express Checkout</h3>
              <p className="text-xs text-gray-500">256-bit SSL encrypted transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-6">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Customer & Shipping Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              1. Shipping Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Postal / ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              2. Payment Method
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              {['Credit Card', 'PayPal', 'Apple Pay'].map((method) => {
                const isSelected = formData.paymentMethod === method;
                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>{method}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal ({cart.length} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promotional Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax (8%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-200">
              <span>Grand Total</span>
              <span className="text-emerald-600">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Processing Transaction...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Place Order & Pay {formatCurrency(grandTotal)}</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
