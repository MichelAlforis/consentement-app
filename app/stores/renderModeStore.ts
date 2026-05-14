'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from './storageKeys';

export type RenderMode = 'css' | 'r3f';

interface RenderModeStore {
  renderMode: RenderMode | null; // null = pas encore détecté (1ère visite)
  gpuTier: number | null;        // 0 | 1 | 2 | 3 — null avant détection
  isHydrated: boolean;
  _isOverrideActive: boolean;   // true = override dev actif, ne pas persister
  detectAndSet: () => Promise<void>;
  _setHydrated: () => void;
}

// Helpers console dev (non exposés en prod)
declare global {
  interface Window {
    __setRenderMode?: (mode: RenderMode) => void;
    __clearRenderMode?: () => void;
  }
}

// Lit ?renderMode=css|r3f et ?renderTier=0-3 depuis l'URL (dev uniquement)
function readDevOverride(): { mode?: RenderMode; tier?: number } | null {
  if (typeof window === 'undefined') return null;
  if (process.env.NODE_ENV === 'production') return null;
  const p = new URLSearchParams(window.location.search);
  const mode = p.get('renderMode');
  const tierStr = p.get('renderTier');
  const result: { mode?: RenderMode; tier?: number } = {};
  if (mode === 'css' || mode === 'r3f') result.mode = mode;
  if (tierStr !== null) {
    const t = parseInt(tierStr, 10);
    if (Number.isInteger(t) && t >= 0 && t <= 3) result.tier = t;
  }
  return Object.keys(result).length > 0 ? result : null;
}

export const useRenderModeStore = create<RenderModeStore>()(
  persist(
    (set, get) => ({
      renderMode: null,
      gpuTier: null,
      isHydrated: false,
      _isOverrideActive: false,

      detectAndSet: async () => {
        // Override prioritaire — vérifié AVANT l'early return localStorage
        const override = readDevOverride();
        if (override) {
          const tier = override.tier ?? null;
          const mode: RenderMode =
            override.mode ?? (tier !== null ? (tier >= 2 ? 'r3f' : 'css') : 'css');
          set({ renderMode: mode, gpuTier: tier, _isOverrideActive: true });
          return;
        }

        if (get().renderMode !== null) return; // déjà détecté → ne pas relancer
        try {
          const { getGPUTier } = await import('detect-gpu');
          const result = await getGPUTier();
          // tier 0 = inconnu/blocklist, 1 = bas, 2 = moyen, 3 = haut
          set({ renderMode: result.tier >= 2 ? 'r3f' : 'css', gpuTier: result.tier });
        } catch {
          // En cas d'erreur (SSR, WebView sans GPU), CSS est le mode sûr
          set({ renderMode: 'css', gpuTier: null });
        }
      },

      _setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.RENDER_MODE,
      // Quand un override est actif on écrit {} → localStorage reste vierge
      // → la prochaine visite sans param repart en détection normale
      partialize: (state) =>
        state._isOverrideActive ? {} : { renderMode: state.renderMode, gpuTier: state.gpuTier },
      onRehydrateStorage: () => (state) => {
        if (state) state._setHydrated();
      },
    },
  ),
);

// Console helpers — disponibles uniquement en dev
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.__setRenderMode = (mode: RenderMode) => {
    useRenderModeStore.setState({ renderMode: mode, _isOverrideActive: false });
    console.info(`[renderMode] forcé → ${mode}`);
  };
  window.__clearRenderMode = () => {
    localStorage.removeItem(STORAGE_KEYS.RENDER_MODE);
    location.reload();
  };
}
