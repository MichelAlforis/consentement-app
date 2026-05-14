import { createJSONStorage, type PersistStorage } from 'zustand/middleware';
import type { IStorage } from './IStorage';

export type { IStorage };

// Implémentation par défaut : no-op (remplacée avant usage via initStorage)
let _storage: IStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

/** À appeler au démarrage de l'app avant tout accès aux stores. */
export function initStorage(impl: IStorage): void {
  _storage = impl;
}

export function getCoreStorage(): IStorage {
  return _storage;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCoreStorage<T = any>(): PersistStorage<T> {
  return createJSONStorage(() => getCoreStorage()) as unknown as PersistStorage<T>;
}
