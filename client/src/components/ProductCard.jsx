import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Eye, Check } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const discount = calculateDiscount(product.originalPrice, product.price);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const added = addToCart(product, 1);
    if (added) {
      addToast(`Added "${product.title}" to cart!`, 'success');
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Thumbnail Area */}
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isFeatured && (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
              Featured
            </span>
          )}
          {discount > 0 && (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-red-100/95 backdrop-blur-sm text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200 shadow-sm">
              Out of Stock
            </span>
          ) : (
            <span className="bg-emerald-100/95 backdrop-blur-sm text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 shadow-sm">
              {product.stock} in stock
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <Link
          to={`/products/${product.id}`}
          className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs"
        >
          <span className="bg-white/90 text-gray-900 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-200 font-semibold">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            View Details
          </span>
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {product.category}
          </span>
          <StarRating rating={product.rating || 5} totalReviews={product.reviewsCount} size="w-3.5 h-3.5" />
        </div>

        {/* Title */}
        <Link to={`/products/${product.id}`} className="block group-hover:text-emerald-600 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Tagline / Brief Description */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
          {product.tagline || product.description}
        </p>

        {/* Price and Cart Action */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-sm hover:shadow'
            }`}
            title={isOutOfStock ? 'Currently out of stock' : 'Add to cart'}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
