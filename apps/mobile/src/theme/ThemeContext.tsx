import { createContext, useContext, type ReactNode } from 'react';
import { type Theme, warmTheme, themes } from '@ouiclair/core';
import { useSettingsStore } from '@ouiclair/core';

const ThemeContext = createContext<Theme>(warmTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, themeMode } = useSettingsStore();
  const activeTheme = theme ?? (themeMode ? themes[themeMode] : warmTheme);

  return <ThemeContext.Provider value={activeTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
