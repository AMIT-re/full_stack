import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, total, limit } = pagination;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200 mt-8">
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-800">{start}</span> to{' '}
        <span className="font-semibold text-gray-800">{end}</span> of{' '}
        <span className="font-semibold text-gray-800">{total}</span> products
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className={`p-2 rounded-xl border border-gray-200 flex items-center justify-center transition-all ${
            !pagination.hasPrevPage
              ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400'
              : 'hover:bg-gray-100 text-gray-700 shadow-sm'
          }`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className={`p-2 rounded-xl border border-gray-200 flex items-center justify-center transition-all ${
            !pagination.hasNextPage
              ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400'
              : 'hover:bg-gray-100 text-gray-700 shadow-sm'
          }`}
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
