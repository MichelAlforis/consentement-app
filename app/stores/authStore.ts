'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../types';
import { isAdultApp } from '../lib/appVariant';

interface AuthStore {
  isAuthenticated: boolean;
  isAdult: boolean | null;
  userName: string;
  pronouns: string | null;
  isHydrated: boolean;
  setAgeGroup: (adult: boolean) => void;
  authenticate: (name: string) => void;
  setName: (name: string) => void;
  setPronouns: (pronouns: string | null) => void;
  _setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdult: isAdultApp ? true : null,
      userName: '',
      pronouns: null,
      isHydrated: false,

      setAgeGroup: (adult) => set({ isAdult: adult }),
      authenticate: (name) => set({ isAuthenticated: true, userName: name }),
      setName: (name) => set({ userName: name }),
      setPronouns: (pronouns) => set({ pronouns }),

      _setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'consentement-auth',
      partialize: (state) => ({
        isAdult: state.isAdult,
        userName: state.userName,
        pronouns: state.pronouns,
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
