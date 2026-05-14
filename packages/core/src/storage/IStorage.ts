import type { StateStorage } from 'zustand/middleware';

/** Interface de stockage injectable — impl localStorage (web) ou MMKV (mobile). */
export type IStorage = StateStorage;
