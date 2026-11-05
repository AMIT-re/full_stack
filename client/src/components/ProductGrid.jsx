import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen, RotateCcw } from 'lucide-react';

export default function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 8,
  onResetFilters = null
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse"
          >
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-4/5" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="pt-3 flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-9 w-9 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
        <p className="text-sm text-gray-500 mb-6">
          We couldn't find any products matching your selected search query or active filters. Try adjusting your criteria.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
