'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Theme } from '../types/theme';
import { warmTheme } from '../types/theme';

const ThemeContext = createContext<Theme>(warmTheme);

export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
