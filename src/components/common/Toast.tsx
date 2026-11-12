import React from 'react';
import { useProperty } from '../../context/PropertyContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  variant?: 'mobile' | 'desktop';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ variant = 'desktop' }) => {
  const { toasts, removeToast } = useProperty();

  if (toasts.length === 0) return null;

  const positionClass =
    variant === 'mobile'
      ? 'absolute inset-x-3 top-12 z-50 flex flex-col gap-2.5 pointer-events-none'
      : 'fixed top-16 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none';

  return (
    <div className={positionClass}>
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
        let borderClass = 'border-emerald-200 bg-white';
        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
          borderClass = 'border-red-200 bg-white';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-200 bg-white';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
          borderClass = 'border-blue-200 bg-white';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg shadow-slate-200/50 ${borderClass} transition-all duration-200 animate-in fade-in slide-in-from-top-2`}
          >
            {icon}
            <div className="flex-1 text-sm leading-snug">
              {toast.title && <div className="font-semibold text-slate-900 mb-0.5">{toast.title}</div>}
              <div className="text-slate-700">{toast.content}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
