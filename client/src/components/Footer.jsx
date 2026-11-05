import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, ArrowRight, Heart } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      addToast('Thank you for subscribing to NovaStore tech drops!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Service Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-800 rounded-xl text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Fast Shipping</h4>
              <p className="text-xs text-gray-400">On all orders over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-800 rounded-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">2-Year Warranty</h4>
              <p className="text-xs text-gray-400">Comprehensive device coverage</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-800 rounded-xl text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Money Back</h4>
              <p className="text-xs text-gray-400">Hassle-free easy returns</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-800 rounded-xl text-emerald-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 Expert Support</h4>
              <p className="text-xs text-gray-400">Dedicated tech specialists</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Nova<span className="text-emerald-500">Store</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Modern full-stack e-commerce catalog featuring cutting-edge electronics, audio gear, productivity accessories, and workspace essentials.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                REST API Enabled
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Single Page App
              </span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=Audio" className="hover:text-emerald-400 transition-colors">
                  Audio & Headphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="hover:text-emerald-400 transition-colors">
                  Electronics & Displays
                </Link>
              </li>
              <li>
                <Link to="/products?category=Wearables" className="hover:text-emerald-400 transition-colors">
                  Smartwatches & Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-emerald-400 transition-colors">
                  Keyboards & Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home%20Office" className="hover:text-emerald-400 transition-colors">
                  Home Office Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Store Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-emerald-400 transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors">
                  Manage Products (Admin)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About & Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Newsletter</h5>
            <p className="text-xs text-gray-400 mb-3">
              Subscribe for new release drops, flash promotions, and technical gear insights.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} NovaStore Inc. All rights reserved. Full-Stack Capstone Project.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for modern web
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
