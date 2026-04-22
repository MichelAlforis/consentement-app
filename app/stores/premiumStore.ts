'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PremiumStore {
  isPremium: boolean;
  activatePremium: () => void;
  deactivatePremium: () => void;
}

export const usePremiumStore = create<PremiumStore>()(
  persist(
    (set) => ({
      isPremium: false,
      activatePremium: () => set({ isPremium: true }),
      deactivatePremium: () => set({ isPremium: false }),
    }),
    {
      name: 'consentement-premium',
    }
  )
);
