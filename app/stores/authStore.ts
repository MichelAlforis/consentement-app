'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../types';
import { ThemeMode } from '../types/theme';
import { useNavigationStore } from './navigationStore';
import { isAdultApp } from '../lib/appVariant';

interface AuthStore {
  isAuthenticated: boolean;
  isAdult: boolean | null;
  userName: string;
  isHydrated: boolean;
  handleAgeSelect: (adult: boolean, selectTheme: (mode: ThemeMode) => void) => void;
  handleAuth: (name: string) => void;
  _setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdult: isAdultApp ? true : null,
      userName: '',
      isHydrated: false,

      handleAgeSelect: (adult, selectTheme) => {
        set({ isAdult: adult });
        const { navigateTo } = useNavigationStore.getState();
        if (adult) {
          navigateTo('auth');
        } else {
          selectTheme('youth');
          navigateTo('home');
        }
      },

      handleAuth: (name) => {
        set({ isAuthenticated: true, userName: name });
        useNavigationStore.getState().navigateTo('home');
      },

      _setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'consentement-auth',
      partialize: (state) => ({
        isAdult: state.isAdult,
        userName: state.userName,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._setHydrated();
          const { navigateTo } = useNavigationStore.getState();
          if (isAdultApp) {
            state.isAdult = true;
            navigateTo(state.userName ? 'home' : 'auth');
            return;
          }
          if ((state.isAdult && state.userName) || state.isAdult === false) {
            navigateTo('home');
          }
        }
      },
    }
  )
);

// Unused import kept for type inference
export type { Language };
