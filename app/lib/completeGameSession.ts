import { useUnlockStore } from '../stores/unlockStore';
import type { OwnedCard } from '../stores/unlockStore';

export type GameSessionSource = 'dice' | 'goose' | 'card';

/**
 * Complète une séance de jeu :
 *   1. Incrémente le compteur de séances (+ heat point)
 *   2. Tente un tirage depuis le pool lexique
 *
 * Retourne la carte tirée depuis le pool, ou null si pool vide / aucune
 * carte disponible.
 */
export function completeGameSession(_source: GameSessionSource): OwnedCard | null {
  const { incrementSessionCount, drawFromPool } = useUnlockStore.getState();
  incrementSessionCount();
  return drawFromPool();
}
