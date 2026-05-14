'use client';

import { createJSONStorage, type PersistStorage, type StateStorage } from 'zustand/middleware';

// Adaptateur localStorage → Zustand PersistStorage.
// À swapper pour @capacitor/preferences quand le package sera installé.
const _baseStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try { return localStorage.getItem(name); } catch { return null; }
  },
  setItem: (name: string, value: string): void => {
    try { localStorage.setItem(name, value); } catch {}
  },
  removeItem: (name: string): void => {
    try { localStorage.removeItem(name); } catch {}
  },
};

export function createAppStorage<T>(): PersistStorage<T> {
  return createJSONStorage<T>(() => _baseStorage) as PersistStorage<T>;
}
