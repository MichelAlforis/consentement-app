'use client';

import { useCallback } from 'react';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { useUnlockStore } from '../stores/unlockStore';
import { useRevealStore } from '../stores/revealStore';
import { useAuthStore } from '../stores/authStore';
import { computeModuleGain } from './computeModuleGain';
import { collectorCards } from '../data/cards-collector';
import { resolveModuleId } from './moduleIds';

export function useModuleComplete() {
  const markModuleComplete = useModuleProgressStore((s) => s.markModuleComplete);
  const markOnboardingCompleted = useModuleProgressStore((s) => s.markOnboardingCompleted);
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  const ownedCards = useUnlockStore((s) => s.ownedCards);
  const unlockCards = useUnlockStore((s) => s.unlockCards);
  const setPending = useRevealStore((s) => s.setPending);
  const isAdult = useAuthStore((s) => s.isAdult);

  return useCallback(
    (moduleId: string): number => {
      const effectiveId = resolveModuleId(moduleId, isAdult);
      if (completedModules.includes(effectiveId)) return 0;

      if (effectiveId === 'module-de-base' || effectiveId === 'module-de-base-mineur') {
        markOnboardingCompleted(effectiveId);
      } else {
        markModuleComplete(effectiveId);
      }

      const ownedIds = new Set(ownedCards.map((c) => c.id));
      const newCards = computeModuleGain(effectiveId, ownedIds, collectorCards);
      if (newCards.length > 0) {
        unlockCards(newCards);
        setPending(newCards.map((c) => c.id));
      }
      return newCards.length;
    },
    [isAdult, completedModules, ownedCards, markModuleComplete, markOnboardingCompleted, unlockCards, setPending]
  );
}
