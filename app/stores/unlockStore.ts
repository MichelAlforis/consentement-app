'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Rarity = 'common' | 'rare' | 'unique';

export interface OwnedCard {
  id: string;
  rarity: Rarity;
  gainedOn: string; // ISO date
  unlockedBy: string; // 'card-session' | 'slow-session' | module id
}

interface UnlockStore {
  ownedCards: OwnedCard[];
  sessionCount: number; // nombre total de séances complètes
  unlockCards: (cards: OwnedCard[]) => void;
  incrementSessionCount: () => void;
  reset: () => void;
}

export const useUnlockStore = create<UnlockStore>()(
  persist(
    (set, get) => ({
      ownedCards: [],
      sessionCount: 0,

      unlockCards: (newCards) => {
        const existing = new Set(get().ownedCards.map((c) => c.id));
        const toAdd = newCards.filter((c) => !existing.has(c.id));
        if (toAdd.length === 0) return;
        set((s) => ({ ownedCards: [...s.ownedCards, ...toAdd] }));
      },

      incrementSessionCount: () =>
        set((s) => ({ sessionCount: s.sessionCount + 1 })),

      reset: () => set({ ownedCards: [], sessionCount: 0 }),
    }),
    {
      name: 'consentement-unlocks',
    }
  )
);
