import type { ReactNode } from 'react';
import { ThemeProvider } from '../theme/ThemeContext';
import { ToastProvider } from '../context/ToastContext';

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
