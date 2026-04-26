import { collectorCards as defaultCards } from '../data/cards-collector';
import type { CollectorCard, CardTheme } from '../data/cards-collector';
import type { OwnedCard } from '../stores/unlockStore';
import type { GainedCard } from './computeGainedCards';

export const FACE_TO_THEME: Record<number, CardTheme> = {
  1: 'osez',
  2: 'parlez',
  3: 'et-si',
  4: 'defi',
  5: 'verite',
  6: 'douceur',
};

function toGainedCard(cc: CollectorCard): GainedCard {
  return {
    id: cc.id,
    text: cc.text,
    rarity: cc.rarity,
    gradient: cc.visual.gradient,
    iconName: cc.visual.iconName,
    border: cc.visual.border,
  };
}

/** Tire une carte aléatoire parmi celles dont le thème correspond à la face du dé.
 *  Fallback sur le pool complet si aucune carte ne correspond au thème. */
export function sampleCardByFace(
  faceId: number,
  ownedCards: OwnedCard[],
  cards: CollectorCard[] = defaultCards,
): GainedCard | null {
  if (ownedCards.length === 0) return null;
  const targetTheme = FACE_TO_THEME[faceId];
  const themed = targetTheme
    ? ownedCards.filter((oc) => cards.find((c) => c.id === oc.id)?.theme === targetTheme)
    : [];
  const pool = themed.length > 0 ? themed : ownedCards;
  const owned = pool[Math.floor(Math.random() * pool.length)];
  const cc = cards.find((c) => c.id === owned.id);
  return cc ? toGainedCard(cc) : null;
}

/** Tire une carte aléatoire sans filtre de thème. */
export function sampleRandomCard(
  ownedCards: OwnedCard[],
  cards: CollectorCard[] = defaultCards,
): GainedCard | null {
  if (ownedCards.length === 0) return null;
  const owned = ownedCards[Math.floor(Math.random() * ownedCards.length)];
  const cc = cards.find((c) => c.id === owned.id);
  return cc ? toGainedCard(cc) : null;
}
