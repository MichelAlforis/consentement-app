'use client';

import { useCallback } from 'react';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { useUnlockStore } from '../stores/unlockStore';
import { computeModuleGain } from './computeModuleGain';
import { collectorCards } from '../data/cards-collector';

/**
 * Retourne une fonction stable qui marque un module comme complété et déverrouille
 * les cartes associées. Idempotente : n'agit pas si le module est déjà complété.
 * Retourne le nombre de nouvelles cartes déverrouillées (0 si déjà fait).
 */
export function useModuleComplete() {
  const markModuleComplete = useModuleProgressStore((s) => s.markModuleComplete);
  const unlockCards = useUnlockStore((s) => s.unlockCards);

  return useCallback(
    (moduleId: string): number => {
      const { completedModules } = useModuleProgressStore.getState();
      if (completedModules.includes(moduleId)) return 0;

      markModuleComplete(moduleId);

      const { ownedCards } = useUnlockStore.getState();
      const ownedIds = new Set(ownedCards.map((c) => c.id));
      const newCards = computeModuleGain(moduleId, ownedIds, collectorCards);
      if (newCards.length > 0) unlockCards(newCards);
      return newCards.length;
    },
    [markModuleComplete, unlockCards]
  );
}
