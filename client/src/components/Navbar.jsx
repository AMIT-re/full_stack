import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export default function Navbar() {
  const { totalItems, subtotal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setMobileMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-emerald-600 bg-emerald-50 font-semibold'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
                  Nova<span className="text-emerald-600">Store</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block -mt-0.5">Premium Tech Catalog</p>
            </div>
          </Link>

          {/* Desktop Nav Search */}
          <form onSubmit={handleNavSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search products, headphones, monitors..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100/80 border border-transparent rounded-full focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Catalog
            </NavLink>
            <NavLink to="/admin" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Manage Products
              </span>
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </nav>

          {/* Cart & Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-emerald-600 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center ring-2 ring-white animate-fade-in">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">
                {formatCurrency(subtotal)}
              </span>
            </Link>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 space-y-3 animate-fade-in">
            <form onSubmit={handleNavSearch} className="relative mb-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search catalog..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </form>

            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                Catalog
              </NavLink>
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                Manage Products (Admin)
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                About
              </NavLink>
              <NavLink
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                Cart ({totalItems} items)
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
