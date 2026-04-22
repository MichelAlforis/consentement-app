'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';

export type ToastType = 'default' | 'success' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: ToastItem[];
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toasts: [], show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, type: ToastType = 'default') => {
    const id = ++idRef.current;
    setToasts(prev => [...prev.slice(-1), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, show }}>
      {children}
    </ToastContext.Provider>
  );
}
