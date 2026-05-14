import type { IStorage } from '@ouiclair/core';

type MMKVStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

function createFallbackStorage(): IStorage {
  const storage = new Map<string, string>();

  return {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => {
      storage.set(key, value);
    },
    removeItem: (key) => {
      storage.delete(key);
    },
  };
}

function createMMKVStorage(): IStorage {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MMKV } = require('react-native-mmkv') as {
      MMKV: new (config: { id: string }) => MMKVStorage;
    };
    const mmkv = new MMKV({ id: 'ouiclair-store' });

    return {
      getItem: (key) => mmkv.getString(key) ?? null,
      setItem: (key, value) => {
        mmkv.set(key, value);
      },
      removeItem: (key) => {
        mmkv.delete(key);
      },
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('MMKV unavailable, using in-memory storage fallback.', error);
    }

    return createFallbackStorage();
  }
}

export const mmkvStorage: IStorage = createMMKVStorage();
