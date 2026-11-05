import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Audio', 'Electronics', 'Wearables', 'Accessories', 'Home Office'];

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEdit = false
}) {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: 10,
    thumbnail: '',
    description: '',
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        tagline: initialData.tagline || '',
        category: initialData.category || 'Electronics',
        price: initialData.price || '',
        originalPrice: initialData.originalPrice || '',
        stock: initialData.stock !== undefined ? initialData.stock : 10,
        thumbnail: initialData.thumbnail || '',
        description: initialData.description || '',
        isFeatured: !!initialData.isFeatured,
      });
    } else {
      setFormData({
        title: '',
        tagline: '',
        category: 'Electronics',
        price: '',
        originalPrice: '',
        stock: 15,
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        description: '',
        isFeatured: false,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errs.price = 'Price must be a positive number.';
    }
    if (formData.stock < 0) {
      errs.stock = 'Stock cannot be negative.';
    }
    if (!formData.category) {
      errs.category = 'Please choose a category.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save product' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-gray-500">
              {isEdit ? 'Update product information and catalog details' : 'Fill in the information to list a new item in the store'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {errors.form && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. SonicBoom Pro Noise Cancelling Headphones"
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                errors.title ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Short Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. 40mm titanium drivers with spatial audio"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="199.99"
                className={`w-full px-3.5 py-2 text-sm bg-gray-50 border rounded-xl focus:bg-white focus:outline-none ${
                  errors.price ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'
                }`}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Original Price ($) (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="249.99"
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Detailed Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide key features, performance details, and compatibility..."
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor="isFeatured" className="text-xs font-medium text-gray-700 cursor-pointer">
              Mark as Featured Product (Highlights on Home Page)
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
