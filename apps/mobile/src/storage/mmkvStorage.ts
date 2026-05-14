import { MMKV } from 'react-native-mmkv';
import type { IStorage } from '@ouiclair/core';

const mmkv = new MMKV({ id: 'ouiclair-store' });

export const mmkvStorage: IStorage = {
  getItem: (key) => mmkv.getString(key) ?? null,
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: (key) => mmkv.delete(key),
};
