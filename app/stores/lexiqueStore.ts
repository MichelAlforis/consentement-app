'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    { name: 'consentement-lexique', version: 1 }
  )
);
