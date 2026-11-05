import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Zap,
  Star,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Monitor,
  Watch
} from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getFeaturedProducts(4);
        if (res.success) {
          setFeaturedProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const categories = [
    {
      name: 'Audio & Acoustics',
      slug: 'Audio',
      count: 'Studio Monitors, Headphones & Earbuds',
      icon: Headphones,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Electronics & Displays',
      slug: 'Electronics',
      count: '4K Monitors, Webcams & Docks',
      icon: Monitor,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      name: 'Wearables & Health',
      slug: 'Wearables',
      count: 'Smartwatches & VR Accessories',
      icon: Watch,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      color: 'from-emerald-600 to-teal-500',
    },
    {
      name: 'Desk & Accessories',
      slug: 'Accessories',
      count: 'Custom Keyboards & Precision Mice',
      icon: Cpu,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      color: 'from-purple-600 to-pink-500',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-gray-50 pt-12 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Gen Hardware & Audio Engineering</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Elevate your setup with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">cutting-edge</span> tech gear.
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover precision-crafted peripherals, studio acoustics, 4K curved displays, and ergonomic essentials designed to maximize your everyday workflow.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                >
                  <span>Explore Full Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/products?category=Audio"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Headphones className="w-4 h-4 text-emerald-600" />
                  <span>Explore Audio Gear</span>
                </Link>
              </div>

              {/* Social Proof metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">4.9/5</div>
                  <div className="text-xs text-gray-500">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">2-Year</div>
                  <div className="text-xs text-gray-500">Hardware Warranty</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">24/7</div>
                  <div className="text-xs text-gray-500">Dedicated Support</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 rounded-3xl blur-2xl -z-10" />
                <div className="relative rounded-3xl overflow-hidden border border-gray-200/80 shadow-2xl bg-white p-3">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                    alt="Aura Pro Headphones"
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                  />
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Featured Drop
                        </span>
                        <h4 className="font-bold text-gray-900 text-base mt-1">Aura Pro Wireless ANC</h4>
                      </div>
                      <span className="text-lg font-extrabold text-gray-900">$249.99</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              Catalog Navigation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-64 bg-gray-900"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative mt-auto p-5 z-10">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2.5 group-hover:bg-emerald-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-1">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Staff Picks & Trending
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Featured Tech Gear
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 group"
          >
            <span>See Entire Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Discount Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
              Limited Time Promo
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Get 10% Off Your Next Workspace Upgrade
            </h3>
            <p className="text-sm sm:text-base text-gray-300">
              Apply code <code className="bg-emerald-600 px-2 py-0.5 rounded text-white font-mono font-bold">SAVE10</code> during checkout to receive an instant discount across our entire catalog.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 rounded-xl font-bold text-sm transition-colors"
              >
                <span>Shop Deals Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Real Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Loved by Developers & Creators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Evelyn Reed',
              role: 'Hardware Systems Architect',
              quote: 'The UltraVision curved 4K monitor revolutionized my multi-terminal coding workflow. The USB-C power delivery keeps my desk cable-free.',
              rating: 5,
            },
            {
              name: 'Julian Hayes',
              role: 'Senior Frontend Engineer',
              quote: 'Apex Mechanical Keyboard tactile switches feel incredible for 10-hour coding sessions. Fast shipping and the build quality is undeniable.',
              rating: 5,
            },
            {
              name: 'Sophia Laurent',
              role: 'Creative Director',
              quote: 'The Aura Pro headphones block out bustling coffee shop noise completely. Audio clarity on video production previews is second to none.',
              rating: 5,
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="font-bold text-sm text-gray-900">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
