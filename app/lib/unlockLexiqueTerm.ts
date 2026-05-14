import { useLexiqueStore } from '../stores/lexiqueStore';
import { useUnlockStore } from '../stores/unlockStore';
import { lexiqueConsentEntries } from '../data/lexiqueConsent';
import { getTopicByLexiqueTermId } from '../data/topicRegistry';
import type { HeatLevel } from './heatLevel';

/**
 * Fonction métier atomique — les stores ne se connaissent pas entre eux.
 *
 * 1. Vérifie que le heat palier est suffisant (entry.palier <= currentHeatLevel)
 * 2. Débloque le terme dans lexiqueStore
 * 3. Si le topic associé a des cartes, les ajoute au pool dans unlockStore
 *
 * Retourne true si le terme a été effectivement débloqué, false sinon.
 */
export function unlockLexiqueTerm(termId: string, currentHeatLevel: HeatLevel): boolean {
  const entry = lexiqueConsentEntries.find((e) => e.id === termId);
  if (!entry) return false;

  if ((currentHeatLevel as number) < entry.palier) return false;

  const lexiqueState = useLexiqueStore.getState();
  if (lexiqueState.unlockedIds.includes(termId)) return false;

  lexiqueState.unlock(termId);

  const topic = getTopicByLexiqueTermId(termId);
  if (topic) {
    useUnlockStore.getState().addToPool({
      rarity: entry.rarity,
      sourceTermId: termId,
    });
  }

  return true;
}
