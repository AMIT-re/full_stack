import React from 'react';
import {
  Code,
  Layers,
  Cpu,
  Database,
  CheckCircle2,
  Sparkles,
  Server,
  Zap,
  Globe,
  Lock,
  GitBranch
} from 'lucide-react';

export default function About() {
  const techStack = [
    {
      category: 'Frontend Architecture',
      tech: 'React 18 + Vite',
      desc: 'Blazing fast HMR, functional components, hooks, custom context, and optimized tree-shaking.',
      badge: 'Client'
    },
    {
      category: 'Styling & UI',
      tech: 'Tailwind CSS + Lucide Icons',
      desc: 'Mobile-first responsive design, modern utility system, glassmorphism, and clean iconography.',
      badge: 'Design System'
    },
    {
      category: 'Client-Side Routing',
      tech: 'React Router v6',
      desc: 'Dynamic URL query sync for search, multi-faceted filtering, sorting, pagination, and parameterized routes.',
      badge: 'Navigation'
    },
    {
      category: 'State Management',
      tech: 'React Context API + LocalStorage',
      desc: 'Persistent shopping cart state, coupon discount handling, and toast notification dispatching.',
      badge: 'State'
    },
    {
      category: 'Backend REST API',
      tech: 'Node.js + Express',
      desc: 'RESTful architecture with request validation middleware, standard status codes, and JSON error handling.',
      badge: 'Server'
    },
    {
      category: 'Persistence & Data Layer',
      tech: 'Atomic File Database Service',
      desc: 'Zero-config JSON storage engine with ACID-like atomic operations, indexing, and seed catalog reset capability.',
      badge: 'Database'
    }
  ];

  const features = [
    'Comprehensive e-commerce product catalog with realistic multi-category tech gear',
    'Live search with debouncing for high responsiveness',
    'Multi-facet filtering: Category counts, min/max price bounds, and in-stock toggling',
    'Multi-criteria sorting: Newest, price ascending/descending, highest rating, and name A-Z',
    'Interactive client-side pagination with dynamic page calculations',
    'Full Product Details view with image switcher, technical specs table, and related items',
    'User review submission with dynamic star rating calculations',
    'Persistent cart with localStorage, coupon code engine (SAVE10, SUPER20), tax and shipping rules',
    'Simulated checkout flow with address validation and instant inventory stock deduction',
    'Admin product dashboard with full CRUD (Create, Read, Update, Delete) capabilities'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Capstone Project Architecture</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          About NovaStore & The Engineering Behind It
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          NovaStore is a full-stack e-commerce web application engineered to demonstrate clean architecture, robust modular components, RESTful API development, and responsive performance.
        </p>
      </div>

      {/* Architecture Overview */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-8 sm:p-10 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>Full-Stack Architecture & Design Principles</span>
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            The application follows a decoupled client-server pattern. The frontend is built as a single-page application (SPA) with React and Vite, communicating via asynchronous JSON HTTP requests to an Express.js backend.
          </p>
        </div>

        {/* System Diagram Representation */}
        <div className="bg-gray-900 text-gray-200 p-6 rounded-2xl font-mono text-xs overflow-x-auto border border-gray-800">
          <div className="text-emerald-400 font-bold mb-2">// System Architecture Flow</div>
          <div className="space-y-1 text-gray-300">
            <div>[Client: React + Vite + Tailwind CSS]</div>
            <div>   │</div>
            <div>   ├── Pages: Home, Catalog, Details, Cart, Admin, About, Success</div>
            <div>   ├── Context: CartContext (LocalStorage) + ToastContext</div>
            <div>   └── Service: api.js (Fetch API wrapper with error boundary)</div>
            <div>   │</div>
            <div>   ▼ (HTTP JSON REST Requests /api/...)</div>
            <div>[Vite Dev Proxy: localhost:5173 ──► localhost:5000]</div>
            <div>   │</div>
            <div>   ▼</div>
            <div>[Server: Express.js REST API]</div>
            <div>   ├── Middlewares: CORS, JSON parser, Validator, Logger, Error Handler</div>
            <div>   ├── Routes: /api/products, /api/orders, /api/health</div>
            <div>   └── Data Layer: Atomic Storage Engine (products.json, orders.json)</div>
          </div>
        </div>
      </div>

      {/* Tech Stack Cards */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <span>Technologies & Tools Employed</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Built using industry-standard libraries prioritizing developer velocity and runtime performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-md transition-all"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {tech.badge}
                </span>
                <h3 className="font-bold text-gray-900 text-base mt-2">{tech.tech}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Implemented Features List */}
      <div className="bg-emerald-50/50 rounded-3xl border border-emerald-100 p-8 sm:p-10 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Key Implemented Capabilities</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-gray-700 leading-normal">{feat}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
