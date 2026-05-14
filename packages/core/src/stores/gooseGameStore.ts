import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from './storageKeys';
import { createCoreStorage } from '../storage';
import type { IconName } from '../types';

export interface SavedGooseGame {
  players: [{ name: string; pawn: IconName }, { name: string; pawn: IconName }];
  positions: [number, number];
  currentPlayer: 0 | 1;
  accordsCount: number;
}

interface GooseGameStore {
  currentGame: SavedGooseGame | null;
  savedAt: number | null;

  saveGame: (state: SavedGooseGame) => void;
  loadSavedGame: () => SavedGooseGame | null;
  clearSavedGame: () => void;
  hasSave: () => boolean;
}

export const useGooseGameStore = create<GooseGameStore>()(
  persist(
    (set, get) => ({
      currentGame: null,
      savedAt: null,

      saveGame: (state) =>
        set({ currentGame: state, savedAt: Date.now() }),

      loadSavedGame: () => get().currentGame,

      clearSavedGame: () => set({ currentGame: null, savedAt: null }),

      hasSave: () => get().currentGame !== null,
    }),
    {
      name: STORAGE_KEYS.GOOSE_GAME,
      storage: createCoreStorage(),
    }
  )
);
