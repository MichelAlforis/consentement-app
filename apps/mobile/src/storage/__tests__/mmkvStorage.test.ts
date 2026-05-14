/**
 * Tests unitaires pour mmkvStorage (apps/mobile/src/storage/mmkvStorage.ts)
 *
 * Stratégie de mock :
 * - mmkvStorage.ts fait un require('react-native-mmkv') dynamique dans un try/catch.
 * - Vitest intercepte ce require via vi.mock().
 * - On expose une instance MMKV en mémoire pour vérifier roundtrip, removeItem et
 *   le retour null sur clé absente.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// ─── Mock react-native-mmkv ────────────────────────────────────────────────────
// Doit être déclaré avant tout import du module testé (Vitest hoiste les vi.mock)

const mmkvInternalStore = new Map<string, string>();

vi.mock('react-native-mmkv', () => {
  return {
    MMKV: class MockMMKV {
      constructor(_config: { id: string }) {}

      getString(key: string): string | undefined {
        return mmkvInternalStore.get(key);
      }

      set(key: string, value: string): void {
        mmkvInternalStore.set(key, value);
      }

      delete(key: string): void {
        mmkvInternalStore.delete(key);
      }
    },
  };
});

// ─── Import du module testé ────────────────────────────────────────────────────
// L'import doit être APRÈS vi.mock() — Vitest hoiste les mocks automatiquement.
import { mmkvStorage } from '../mmkvStorage';

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mmkvInternalStore.clear();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('mmkvStorage', () => {
  it('roundtrip : setItem puis getItem retourne la valeur stockée', () => {
    mmkvStorage.setItem('test-key', 'hello-world');
    const result = mmkvStorage.getItem('test-key');
    expect(result).toBe('hello-world');
  });

  it('removeItem : getItem retourne null après suppression', () => {
    mmkvStorage.setItem('to-delete', 'some-value');
    mmkvStorage.removeItem('to-delete');
    const result = mmkvStorage.getItem('to-delete');
    expect(result).toBeNull();
  });

  it('getItem sur clé absente retourne null', () => {
    const result = mmkvStorage.getItem('key-that-never-existed');
    expect(result).toBeNull();
  });
});
