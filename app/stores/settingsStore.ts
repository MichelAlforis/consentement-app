'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode, Theme, themes } from '../types/theme';
import { Language } from '../types';

interface SettingsStore {
  themeMode: ThemeMode | null;
  theme: Theme | null;
  language: Language;
  selectTheme: (mode: ThemeMode) => void;
  changeLanguage: (lang: Language) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      themeMode: null,
      theme: null,
      language: 'fr',

      selectTheme: (mode) =>
        set({ themeMode: mode, theme: themes[mode] }),

      changeLanguage: (lang) =>
        set({ language: lang }),
    }),
    {
      name: 'consentement-settings',
      partialize: (state) => ({
        themeMode: state.themeMode,
        language: state.language,
      }),
      onRehydrateStorage: () => (state) => {
        // Rehydrate derived theme from stored themeMode
        if (state?.themeMode) {
          state.theme = themes[state.themeMode];
        }
      },
    }
  )
);
