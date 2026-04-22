'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../types';
import { useNavigationStore } from './navigationStore';

interface AuthStore {
  isAuthenticated: boolean;
  isAdult: boolean | null;
  userName: string;
  isHydrated: boolean;
  handleAgeSelect: (adult: boolean, selectTheme: (mode: string) => void) => void;
  handleAuth: (name: string) => void;
  _setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdult: null,
      userName: '',
      isHydrated: false,

      handleAgeSelect: (adult, selectTheme) => {
        set({ isAdult: adult });
        const { navigateTo } = useNavigationStore.getState();
        if (adult) {
          navigateTo('auth');
        } else {
          selectTheme('youth');
          navigateTo('home-minor');
        }
      },

      handleAuth: (name) => {
        set({ isAuthenticated: true, userName: name });
        useNavigationStore.getState().navigateTo('home-adult');
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
          // Restore navigation after rehydration
          const { navigateTo } = useNavigationStore.getState();
          if (state.isAdult && state.userName) {
            navigateTo('home-adult');
          } else if (state.isAdult === false) {
            navigateTo('home-minor');
          }
        }
      },
    }
  )
);

// Unused import kept for type inference
export type { Language };
