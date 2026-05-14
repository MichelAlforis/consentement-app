import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from './storageKeys';
import { createCoreStorage } from '../storage';

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
      name: STORAGE_KEYS.PREMIUM,
      storage: createCoreStorage(),
    }
  )
);
