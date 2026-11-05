import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productTitle = 'this product',
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-800">"{productTitle}"</span>? This action removes the product from the catalog and cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Yes, Delete Product'}
          </button>
        </div>

      </div>
    </div>
  );
}
