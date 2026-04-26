'use client';

import { useCallback } from 'react';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { useUnlockStore } from '../stores/unlockStore';
import { useRevealStore } from '../stores/revealStore';
import { useAuthStore } from '../stores/authStore';
import { computeModuleGain } from './computeModuleGain';
import { collectorCards } from '../data/cards-collector';

// Modules communs aux deux publics — redirection vers la variante mineur si isAdult=false
const MINEUR_VARIANTS: Record<string, string> = {
  'module-de-base':    'module-de-base-mineur',
  'quiz-consentement': 'quiz-consentement-mineur',
  'porno-vs-realite':  'porno-vs-realite-mineur',
  'loi-consentement':  'loi-consentement-mineur',
};

function resolveModuleId(moduleId: string, isAdult: boolean | null): string {
  if (isAdult === false && MINEUR_VARIANTS[moduleId]) {
    return MINEUR_VARIANTS[moduleId];
  }
  return moduleId;
}

export function useModuleComplete() {
  const markModuleComplete = useModuleProgressStore((s) => s.markModuleComplete);
  const unlockCards = useUnlockStore((s) => s.unlockCards);
  const setPending = useRevealStore((s) => s.setPending);
  const isAdult = useAuthStore((s) => s.isAdult);

  return useCallback(
    (moduleId: string): number => {
      const effectiveId = resolveModuleId(moduleId, isAdult);
      const { completedModules } = useModuleProgressStore.getState();
      if (completedModules.includes(effectiveId)) return 0;

      markModuleComplete(effectiveId);

      const { ownedCards } = useUnlockStore.getState();
      const ownedIds = new Set(ownedCards.map((c) => c.id));
      const newCards = computeModuleGain(effectiveId, ownedIds, collectorCards);
      if (newCards.length > 0) {
        unlockCards(newCards);
        setPending(newCards.map((c) => c.id));
      }
      return newCards.length;
    },
    [isAdult, markModuleComplete, unlockCards, setPending]
  );
}
