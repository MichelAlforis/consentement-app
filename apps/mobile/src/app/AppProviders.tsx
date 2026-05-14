import type { ReactNode } from 'react';
import { ThemeProvider } from '../theme/ThemeContext';

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
