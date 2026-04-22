'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode, Theme, themes } from '../types/theme';
import { Language } from '../types';
import { isAdultApp } from '../lib/appVariant';

interface SettingsStore {
  themeMode: ThemeMode | null;
  theme: Theme | null;
  language: Language;
  explicitMode: boolean;
  selectTheme: (mode: ThemeMode) => void;
  changeLanguage: (lang: Language) => void;
  toggleExplicitMode: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      themeMode: null,
      theme: null,
      language: 'fr',
      explicitMode: isAdultApp,

      selectTheme: (mode) =>
        set({ themeMode: mode, theme: themes[mode] }),

      changeLanguage: (lang) =>
        set({ language: lang }),

      toggleExplicitMode: () =>
        set({ explicitMode: !get().explicitMode }),
    }),
    {
      name: 'consentement-settings',
      partialize: (state) => ({
        themeMode: state.themeMode,
        language: state.language,
        explicitMode: state.explicitMode,
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
