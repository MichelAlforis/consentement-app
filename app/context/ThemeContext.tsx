'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { Theme, warmTheme, themes } from '../types/theme';
import { useSettingsStore } from '../stores/settingsStore';

const ThemeContext = createContext<Theme>(warmTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, themeMode } = useSettingsStore();

  // Inject CSS custom properties so components can use var(--color-*)
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    const c = theme.colors;
    root.style.setProperty('--color-bg-primary', c.bgPrimary);
    root.style.setProperty('--color-bg-secondary', c.bgSecondary);
    root.style.setProperty('--color-bg-card', c.bgCard);
    root.style.setProperty('--color-accent', c.accent);
    root.style.setProperty('--color-accent-light', c.accentLight);
    root.style.setProperty('--color-secondary', c.secondary);
    root.style.setProperty('--color-text-primary', c.textPrimary);
    root.style.setProperty('--color-text-secondary', c.textSecondary);
    root.style.setProperty('--color-text-muted', c.textMuted);
    root.style.setProperty('--color-border', c.border);
    root.style.setProperty('--color-divider', c.divider);
    root.style.setProperty('--color-comfort-no', c.comfortNo);
    root.style.setProperty('--color-comfort-wait', c.comfortWait);
    root.style.setProperty('--color-comfort-curious', c.comfortCurious);
    root.style.setProperty('--color-comfort-ok', c.comfortOk);
    root.style.setProperty('--color-comfort-love', c.comfortLove);
  }, [theme]);

  const activeTheme = theme ?? (themeMode ? themes[themeMode] : warmTheme);

  return (
    <ThemeContext.Provider value={activeTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
