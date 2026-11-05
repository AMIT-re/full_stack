import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-gray-900 text-white';
        let Icon = Info;
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          bg = 'bg-white border border-emerald-200 text-gray-900 shadow-xl';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'error') {
          bg = 'bg-white border border-rose-200 text-gray-900 shadow-xl';
          Icon = AlertCircle;
          iconColor = 'text-rose-500';
        } else if (toast.type === 'info') {
          bg = 'bg-white border border-blue-200 text-gray-900 shadow-xl';
          Icon = Info;
          iconColor = 'text-blue-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg transition-all duration-300 transform translate-y-0 ${bg}`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
