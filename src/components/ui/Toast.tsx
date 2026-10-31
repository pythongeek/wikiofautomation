import React, { createContext, useContext, useState, useCallback, forwardRef } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ToastContextType {
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(({ toast, onDismiss }, ref) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const typeStyles = {
    success: 'bg-[#131317] border-[#c0f500]/50 text-white shadow-[0_0_20px_rgba(192,245,0,0.2)]',
    error: 'bg-[#131317] border-[#ef4444]/50 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    warning: 'bg-[#131317] border-[#ffb703]/50 text-white shadow-[0_0_20px_rgba(255,183,3,0.2)]',
    info: 'bg-[#131317] border-[#00e3fd]/50 text-white shadow-[0_0_20px_rgba(0,227,253,0.2)]',
  };

  const iconColors = {
    success: 'text-[#c0f500]',
    error: 'text-[#ef4444]',
    warning: 'text-[#ffb703]',
    info: 'text-[#00e3fd]',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl w-80 max-w-full transition-all duration-300 animate-slideInRight ${typeStyles[toast.type]}`}
    >
      <div className={`mt-0.5 shrink-0 ${iconColors[toast.type]}`}>{icons[toast.type]}</div>
      <div className="flex-1 font-sans">
        {toast.title && <h4 className="text-xs font-mono font-bold uppercase tracking-wider mb-0.5">{toast.title}</h4>}
        <p className="text-xs text-[#e5e1e7] leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#9ca3af] hover:text-white transition-colors p-0.5"
        aria-label="Dismiss toast"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
});

Toast.displayName = 'Toast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
