import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from './storageKeys';
import { createCoreStorage } from '../storage';
import { collectorCards } from '../data/cards-collector';
import type { Rarity, OwnedCard } from '../types';

export type { Rarity, OwnedCard };

export interface PoolEntry {
  rarity: Rarity;
  sourceTermId: string; // lex-xxx — traçabilité
  addedOn: string;      // ISO date
}

interface UnlockStore {
  ownedCards: OwnedCard[];
  sessionCount: number;
  unlockablePool: PoolEntry[];

  unlockCards: (cards: OwnedCard[]) => void;
  incrementSessionCount: () => void;
  /** Ajoute au pool — ignore si sourceTermId déjà présent */
  addToPool: (entry: Omit<PoolEntry, 'addedOn'>) => void;
  /**
   * Tirage aléatoire dans le pool :
   * - Choisit une entrée aléatoire
   * - Trouve une carte Deck B non possédée avec la bonne rarity
   * - L'ajoute à ownedCards et retire l'entrée du pool
   * - Retourne la carte gagnée, ou null si pool vide / aucune carte dispo
   */
  drawFromPool: () => OwnedCard | null;
  reset: () => void;
}

export const useUnlockStore = create<UnlockStore>()(
  persist(
    (set, get) => ({
      ownedCards: [],
      sessionCount: 0,
      unlockablePool: [],

      unlockCards: (newCards) => {
        const existing = new Set(get().ownedCards.map((c) => c.id));
        const toAdd = newCards.filter((c) => !existing.has(c.id));
        if (toAdd.length === 0) return;
        set((s) => ({ ownedCards: [...s.ownedCards, ...toAdd] }));
      },

      incrementSessionCount: () =>
        set((s) => ({ sessionCount: s.sessionCount + 1 })),

      addToPool: (entry) => {
        const pool = get().unlockablePool;
        if (pool.some((p) => p.sourceTermId === entry.sourceTermId)) return;
        set((s) => ({
          unlockablePool: [
            ...s.unlockablePool,
            { ...entry, addedOn: new Date().toISOString() },
          ],
        }));
      },

      drawFromPool: () => {
        const { unlockablePool, ownedCards } = get();
        if (unlockablePool.length === 0) return null;

        const idx = Math.floor(Math.random() * unlockablePool.length);
        const entry = unlockablePool[idx];

        const ownedIds = new Set(ownedCards.map((c) => c.id));
        const candidate = collectorCards.find(
          (c) => c.rarity === entry.rarity && !ownedIds.has(c.id)
        );

        set((s) => ({
          unlockablePool: s.unlockablePool.filter((_, i) => i !== idx),
          ownedCards: candidate
            ? [
                ...s.ownedCards,
                {
                  id: candidate.id,
                  rarity: candidate.rarity,
                  gainedOn: new Date().toISOString(),
                  unlockedBy: entry.sourceTermId,
                },
              ]
            : s.ownedCards,
        }));

        return candidate
          ? {
              id: candidate.id,
              rarity: candidate.rarity,
              gainedOn: new Date().toISOString(),
              unlockedBy: entry.sourceTermId,
            }
          : null;
      },

      reset: () => set({ ownedCards: [], sessionCount: 0, unlockablePool: [] }),
    }),
    {
      name: STORAGE_KEYS.UNLOCKS,
      version: 2,
      storage: createCoreStorage(),
      migrate: (state: unknown): UnlockStore => {
        const persisted = state as Partial<UnlockStore> | undefined;
        return {
          ...(persisted as UnlockStore),
          ownedCards: persisted?.ownedCards ?? [],
          sessionCount: persisted?.sessionCount ?? 0,
          unlockablePool: persisted?.unlockablePool ?? [],
        };
      },
    }
  )
);
