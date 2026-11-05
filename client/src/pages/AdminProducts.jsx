import React, { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';
import ProductFormModal from '../components/ProductFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function AdminProducts() {
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load products and stats
  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, statRes] = await Promise.all([
        api.getProducts({ limit: 100 }), // retrieve all for management
        api.getStats()
      ]);

      if (prodRes.success) {
        setProducts(prodRes.data);
      }
      if (statRes.success) {
        setStats(statRes.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Create or Update
  const handleFormSubmit = async (formData) => {
    if (isEditMode && selectedProduct) {
      const res = await api.updateProduct(selectedProduct.id, formData);
      if (res.success) {
        addToast(`Product "${formData.title}" updated successfully!`, 'success');
        loadData();
      }
    } else {
      const res = await api.createProduct(formData);
      if (res.success) {
        addToast(`New product "${formData.title}" added to catalog!`, 'success');
        loadData();
      }
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await api.deleteProduct(productToDelete.id);
      if (res.success) {
        addToast(`Product "${productToDelete.title}" deleted`, 'info');
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        loadData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Database Reset
  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to reset the product catalog to the default seed dataset?')) {
      try {
        const res = await api.resetDatabase();
        if (res.success) {
          addToast('Catalog reset to initial sample products', 'success');
          loadData();
        }
      } catch (err) {
        addToast(err.message || 'Failed to reset catalog', 'error');
      }
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      !filterCategory || p.category.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const categoriesList = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Perform CRUD operations, manage inventory levels, and configure catalog listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetData}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            title="Reset database to seed products"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsEditMode(false);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Products</p>
              <h4 className="text-xl font-bold text-gray-900">{stats.totalProducts}</h4>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Active Categories</p>
              <h4 className="text-xl font-bold text-gray-900">{stats.categoriesCount}</h4>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Inventory Value</p>
              <h4 className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalInventoryValue)}</h4>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Out of Stock</p>
              <h4 className="text-xl font-bold text-gray-900">{stats.outOfStockCount}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Table Control Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search catalog by title, SKU, category..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-white border border-gray-200 text-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">Loading catalog items...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No products matching the search query or filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail || p.images?.[0]}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover bg-gray-100 border border-gray-200 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">{p.title}</span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {formatCurrency(p.price)}
                      </td>

                      <td className="py-3.5 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            {p.stock} units
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-gray-700">
                        ⭐ {p.rating ? p.rating.toFixed(1) : '5.0'} ({p.reviewsCount || 0})
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(p);
                              setIsEditMode(true);
                              setIsFormModalOpen(true);
                            }}
                            className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setProductToDelete(p);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedProduct}
        isEdit={isEditMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        productTitle={productToDelete?.title}
        loading={deleteLoading}
      />

    </div>
  );
}
