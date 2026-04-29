'use client';

import { useRenderModeStore } from '../stores/renderModeStore';
import type { RenderMode } from '../stores/renderModeStore';

/**
 * Retourne le mode de rendu courant.
 * 'css' tant que la détection GPU n'est pas terminée (mode sûr par défaut).
 */
export function useRenderMode(): RenderMode {
  const renderMode = useRenderModeStore((s) => s.renderMode);
  return renderMode ?? 'css';
}
