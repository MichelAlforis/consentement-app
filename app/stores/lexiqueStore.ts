'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from './storageKeys';

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
      },
      reset: () => set({ unlockedIds: [] }),
    }),
    { name: STORAGE_KEYS.LEXIQUE, version: 1, migrate: (s) => s }
  )
);
