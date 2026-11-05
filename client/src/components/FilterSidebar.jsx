import React, { useState } from 'react';
import { Filter, X, RotateCcw, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function FilterSidebar({
  categories = [],
  selectedCategory = '',
  onSelectCategory,
  minPrice = '',
  maxPrice = '',
  onPriceChange,
  inStockOnly = false,
  onToggleInStock,
  onResetFilters,
  isOpen = false,
  onClose = null
}) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const handlePriceApply = (e) => {
    e.preventDefault();
    onPriceChange(localMin, localMax);
  };

  const content = (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-gray-900 text-base">Filter Catalog</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Categories
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
              !selectedCategory
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-emerald-200/60 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Price Range ($)
        </h4>
        <form onSubmit={handlePriceApply} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">Min Price</label>
              <input
                type="number"
                min="0"
                step="5"
                placeholder="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 block mb-1">Max Price</label>
              <input
                type="number"
                min="0"
                step="10"
                placeholder="1000"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Stock Availability */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Availability
        </h4>
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700 select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
          />
          <span>In Stock Only</span>
        </label>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col overflow-y-auto animate-fade-in z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-900">Filter Products</span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
