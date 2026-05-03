'use client';

import { useRenderModeStore } from '../stores/renderModeStore';

/**
 * Retourne le tier GPU détecté : 0 (low/unknown), 1 (bas), 2 (mid), 3 (high-end).
 * null tant que la détection n'est pas terminée.
 *
 * Usage :
 *   const gpuTier = useGpuTier();
 *   const enableFoilPBR = gpuTier === 3;
 *
 * Test en dev :
 *   ?renderTier=3  → simule high-end (foil PBR actif)
 *   ?renderTier=2  → simule mid-range (fallback shimmer CSS)
 */
export function useGpuTier(): number | null {
  return useRenderModeStore((s) => s.gpuTier);
}
