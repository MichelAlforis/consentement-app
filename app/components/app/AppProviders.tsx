'use client';

import { type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from '../../context/LanguageContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import { HeatProvider } from '../../context/HeatContext';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Wrapper de tous les providers globaux de l'app.
 * À utiliser dans page.tsx (production) et dans les pages de test qui
 * ont besoin du contexte complet (thème, langue, toasts, baromètre du hot).
 *
 * Ordre : ErrorBoundary > MotionConfig > Langue > Thème > Toasts > Heat
 * Aucune dépendance inter-providers — l'ordre est conventionnel.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary label="root">
      <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <ThemeProvider>
            <ToastProvider>
              <HeatProvider>
                {children}
              </HeatProvider>
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
