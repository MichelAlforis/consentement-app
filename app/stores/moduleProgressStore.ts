'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModuleProgressStore {
  completedModules: string[];
  markModuleComplete: (id: string) => void;
  reset: () => void;
}

export const useModuleProgressStore = create<ModuleProgressStore>()(
  persist(
    (set, get) => ({
      completedModules: [],

      markModuleComplete: (id) => {
        if (get().completedModules.includes(id)) return;
        set((s) => ({ completedModules: [...s.completedModules, id] }));
      },

      reset: () => set({ completedModules: [] }),
    }),
    { name: 'consentement-modules' }
  )
);
