import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from './storageKeys';
import { createCoreStorage } from '../storage';
import { lexiqueConsentEntries } from '../data/lexiqueConsent';
import { useUnlockStore } from './unlockStore';

interface LexiqueStore {
  unlockedIds: string[];
  unlock: (id: string) => void;
  reset: () => void;
}

export const useLexiqueStore = create<LexiqueStore>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      unlock: (id) => {
        if (get().unlockedIds.includes(id)) return;
        set((s) => ({ unlockedIds: [...s.unlockedIds, id] }));
        const entry = lexiqueConsentEntries.find((e) => e.id === id);
        if (entry) {
          useUnlockStore.getState().addToPool({ rarity: entry.rarity, sourceTermId: id });
        }
      },
      reset: () => set({ unlockedIds: [] }),
    }),
    {
      name: STORAGE_KEYS.LEXIQUE,
      version: 1,
      storage: createCoreStorage(),
      migrate: (s) => s,
    }
  )
);
