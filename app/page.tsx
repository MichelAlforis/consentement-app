'use client';

import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { HeatProvider } from './context/HeatContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AppShell } from './components/app/AppShell';
import { useAuthStore } from './stores';

export default function ConsentementApp() {
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) {
    return <div className="min-h-dvh" style={{ background: '#0a0a0f' }} />;
  }

  return (
    <ErrorBoundary label="root">
      <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <ThemeProvider>
            <ToastProvider>
              <HeatProvider>
                <AppShell />
              </HeatProvider>
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
