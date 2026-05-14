'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode, Theme, themes } from '../types/theme';
import { Language } from '../types';
import { isAdultApp } from '../lib/appVariant';
import { STORAGE_KEYS } from './storageKeys';

interface SettingsStore {
  themeMode: ThemeMode | null;
  theme: Theme | null;
  language: Language;
  explicitMode: boolean;
  selectTheme: (mode: ThemeMode) => void;
  changeLanguage: (lang: Language) => void;
  toggleExplicitMode: () => void;
  /** Appelé quand le palier de chaleur change — force explicitMode=false si palier < 2 */
  syncExplicitWithHeat: (heatLevel: number) => void;
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

      syncExplicitWithHeat: (heatLevel) => {
        if (heatLevel < 2 && get().explicitMode) set({ explicitMode: false });
      },
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
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
