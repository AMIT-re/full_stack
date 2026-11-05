import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, LayoutGrid, ListFilter, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';
import { useDebounce } from '../hooks/useDebounce';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const sortByParam = searchParams.get('sortBy') || 'newest';
  const pageParam = parseInt(searchParams.get('page'), 10) || 1;

  // Local state
  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      updateQuery({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  // Keep search input in sync if URL changes externally
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Update URL helper
  const updateQuery = useCallback((newParams) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      Object.entries(newParams).forEach(([key, val]) => {
        if (val === '' || val === null || val === undefined) {
          updated.delete(key);
        } else {
          updated.set(key, val);
        }
      });
      return updated;
    });
  }, [setSearchParams]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await api.getProducts({
          category: categoryParam,
          search: searchParam,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          inStock: inStockParam ? 'true' : '',
          sortBy: sortByParam,
          page: pageParam,
          limit: 8,
        });

        if (res.success) {
          setProducts(res.data);
          setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [categoryParam, searchParam, minPriceParam, maxPriceParam, inStockParam, sortByParam, pageParam]);

  // Filter actions
  const handleSelectCategory = (cat) => {
    updateQuery({ category: cat, page: 1 });
  };

  const handlePriceChange = (min, max) => {
    updateQuery({ minPrice: min, maxPrice: max, page: 1 });
  };

  const handleToggleInStock = (checked) => {
    updateQuery({ inStock: checked ? 'true' : '', page: 1 });
  };

  const handleSortChange = (newSort) => {
    updateQuery({ sortBy: newSort, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateQuery({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const activeFiltersCount = [
    categoryParam,
    searchParam,
    minPriceParam,
    maxPriceParam,
    inStockParam,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header / Breadcrumb */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Product Catalog
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore our collection of high-performance peripherals, studio acoustics, and workplace technology.
        </p>
      </div>

      {/* Control Bar: Search, Mobile Filters Toggle, Sort */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search catalog by title, brand, or specs..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                updateQuery({ search: '', page: 1 });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter buttons & Sort */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          <SortDropdown value={sortByParam} onChange={handleSortChange} />
        </div>

      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-gray-500">Active Filters:</span>

          {categoryParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200">
              Category: {categoryParam}
              <button onClick={() => updateQuery({ category: '', page: 1 })}>
                <X className="w-3.5 h-3.5 text-emerald-600 hover:text-emerald-900" />
              </button>
            </span>
          )}

          {searchParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200">
              Query: "{searchParam}"
              <button onClick={() => updateQuery({ search: '', page: 1 })}>
                <X className="w-3.5 h-3.5 text-emerald-600 hover:text-emerald-900" />
              </button>
            </span>
          )}

          {(minPriceParam || maxPriceParam) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200">
              Price: ${minPriceParam || '0'} - ${maxPriceParam || '∞'}
              <button onClick={() => updateQuery({ minPrice: '', maxPrice: '', page: 1 })}>
                <X className="w-3.5 h-3.5 text-emerald-600 hover:text-emerald-900" />
              </button>
            </span>
          )}

          {inStockParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200">
              In Stock Only
              <button onClick={() => updateQuery({ inStock: '', page: 1 })}>
                <X className="w-3.5 h-3.5 text-emerald-600 hover:text-emerald-900" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex gap-8 items-start">
        
        {/* Filter Sidebar */}
        <FilterSidebar
          categories={categories}
          selectedCategory={categoryParam}
          onSelectCategory={handleSelectCategory}
          minPrice={minPriceParam}
          maxPrice={maxPriceParam}
          onPriceChange={handlePriceChange}
          inStockOnly={inStockParam}
          onToggleInStock={handleToggleInStock}
          onResetFilters={handleResetFilters}
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        />

        {/* Catalog Grid Area */}
        <div className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            loading={loading}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination */}
          {!loading && pagination && (
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </div>

      </div>

    </div>
  );
}
