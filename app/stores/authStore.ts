'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../types';
import { isAdultApp } from '../lib/appVariant';

interface AuthStore {
  isAuthenticated: boolean;
  isAdult: boolean | null;
  userName: string;
  isHydrated: boolean;
  setAgeGroup: (adult: boolean) => void;
  authenticate: (name: string) => void;
  _setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdult: isAdultApp ? true : null,
      userName: '',
      isHydrated: false,

      setAgeGroup: (adult) => set({ isAdult: adult }),
      authenticate: (name) => set({ isAuthenticated: true, userName: name }),

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
          if (isAdultApp) state.isAdult = true;
          state._setHydrated();
        }
      },
    }
  )
);

// Unused import kept for type inference
export type { Language };
