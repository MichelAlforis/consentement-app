'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RenderMode = 'css' | 'r3f';

interface RenderModeStore {
  renderMode: RenderMode | null; // null = pas encore détecté (1ère visite)
  isHydrated: boolean;
  detectAndSet: () => Promise<void>;
  _setHydrated: () => void;
}

export const useRenderModeStore = create<RenderModeStore>()(
  persist(
    (set, get) => ({
      renderMode: null,
      isHydrated: false,

      detectAndSet: async () => {
        if (get().renderMode !== null) return; // déjà détecté → ne pas relancer
        try {
          const { getGPUTier } = await import('detect-gpu');
          const tier = await getGPUTier();
          // tier 0 = inconnu/blocklist, 1 = bas, 2 = moyen, 3 = haut
          set({ renderMode: tier.tier >= 2 ? 'r3f' : 'css' });
        } catch {
          // En cas d'erreur (SSR, WebView sans GPU), CSS est le mode sûr
          set({ renderMode: 'css' });
        }
      },

      _setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'consentement-render-mode',
      partialize: (state) => ({ renderMode: state.renderMode }),
      onRehydrateStorage: () => (state) => {
        if (state) state._setHydrated();
      },
    },
  ),
);
