import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-24 px-4">
      <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 mb-6">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
        Error 404
      </span>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3 mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        The page you are looking for doesn't exist, has been relocated, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
