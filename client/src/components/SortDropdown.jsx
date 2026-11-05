import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500 hidden sm:block" />
      <span className="text-xs font-medium text-gray-500 hidden sm:inline">Sort by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs sm:text-sm font-medium bg-white border border-gray-200 text-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-sm"
      >
        <option value="newest">Newest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating_desc">Highest Rated</option>
        <option value="name_asc">Name: A to Z</option>
      </select>
    </div>
  );
}
