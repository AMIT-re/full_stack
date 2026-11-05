import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Printer, ShieldCheck, Home } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <Package className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Order Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          You don't have a recent order session active. Start browsing our catalog to place an order.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
          Order Confirmed & Payment Verified
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Thank You For Your Order!
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          We've received your order and our fulfillment team is preparing your package. A confirmation has been dispatched.
        </p>
      </div>

      {/* Order Details Receipt Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Number</span>
            <div className="text-xl font-extrabold text-gray-900 font-mono mt-0.5">{order.id}</div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Date</span>
            <div className="text-sm font-semibold text-gray-900 mt-0.5">{formatDate(order.createdAt)}</div>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100 text-xs">
          <div>
            <h4 className="font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Shipping Destination</h4>
            <p className="font-semibold text-gray-800">{order.customer.name}</p>
            <p className="text-gray-600">{order.customer.address}</p>
            <p className="text-gray-600">{order.customer.city}, {order.customer.zip}</p>
            <p className="text-gray-500 mt-1">{order.customer.email}</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Payment & Status</h4>
            <p className="text-gray-700"><span className="font-semibold">Method:</span> {order.paymentMethod}</p>
            <p className="text-gray-700"><span className="font-semibold">Status:</span> <span className="text-emerald-600 font-bold">{order.status}</span></p>
            <p className="text-gray-700"><span className="font-semibold">Estimated Delivery:</span> 2-4 Business Days</p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Ordered Items</h4>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                  )}
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">{item.title}</h5>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Promotional Discount</span>
              <span>-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Sales Tax</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-100">
            <span>Total Paid</span>
            <span className="text-emerald-600">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print Receipt</span>
          </button>

          <Link
            to="/products"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
