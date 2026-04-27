import { THEME_CATEGORIES } from '../data/cards-collector';
import type { CollectorCard, Rarity, CardTheme } from '../data/cards-collector';
import type { OwnedCard } from '../stores/unlockStore';

// ---------------------------------------------------------------------------
// Types publics
// ---------------------------------------------------------------------------

export interface GainedCard {
  id: string;
  text: string;
  theme?: CardTheme;
  themeName?: string;
  rarity: Rarity;
  gradient: string;
  iconName: string;
  border: string;
}

export interface ComputeParams {
  sessionMode: 'seance' | 'libre';
  cardCount: number;
  seanceSize: number;
  sessionThemes: CardTheme[];
  sessionCount: number;  // APRÈS increment — incrémenté avant l'appel
  ownedIds: Set<string>;
  favorites: string[];   // ids des cartes mises en favori pendant la session
  isPremium: boolean;
}

// ---------------------------------------------------------------------------
// Helpers internes
// ---------------------------------------------------------------------------

function toGainedCard(card: CollectorCard): GainedCard {
  return {
    id: card.id,
    text: card.text,
    theme: card.theme,
    themeName: THEME_CATEGORIES[card.theme].name,
    rarity: card.rarity,
    gradient: card.visual.gradient,
    iconName: card.visual.iconName,
    border: card.visual.border,
  };
}

function toOwnedCard(card: CollectorCard, source: string): OwnedCard {
  return {
    id: card.id,
    rarity: card.rarity,
    gainedOn: new Date().toISOString(),
    unlockedBy: source,
  };
}

function excludeOwned(cards: CollectorCard[], ownedIds: Set<string>): CollectorCard[] {
  return cards.filter((c) => !ownedIds.has(c.id));
}

function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

// Themes représentés dans les favoris ont un poids × 2.
function pickWeighted(
  candidates: CollectorCard[],
  favorites: string[],
  allCards: CollectorCard[]
): CollectorCard | null {
  if (candidates.length === 0) return null;
  if (favorites.length === 0) return pickRandom(candidates);

  const favoriteCardIds = new Set(favorites);
  const favoriteThemeSet = new Set<CardTheme>();
  for (const card of allCards) {
    if (favoriteCardIds.has(card.id)) {
      favoriteThemeSet.add(card.theme);
    }
  }

  const weighted: CollectorCard[] = [];
  for (const card of candidates) {
    const weight = favoriteThemeSet.has(card.theme) ? 2 : 1;
    for (let i = 0; i < weight; i++) weighted.push(card);
  }

  return pickRandom(weighted);
}

// ---------------------------------------------------------------------------
// Fonction principale — pure function, zéro effet de bord
// ---------------------------------------------------------------------------

/**
 * Calcule les cartes gagnées à la fin d'une séance.
 *
 * Règles (dans l'ordre) :
 *   1. Guard — retourne vide si pas une séance complète
 *   2. 1 common garantie (depth 1, decks explorés en priorité)
 *   3. Tous les 3 sessions : rare si decks profonds (3–6) joués, sinon extra common
 *   4. Deck 5|6 + premium → 20% chance d'une unique
 *   5. Pondération favoris × 2 sur tous les picks
 *   6. Maximum 3 cartes — `ownedIds` mis à jour entre chaque règle
 */
export function computeGainedCards(
  p: ComputeParams,
  collectorCards: CollectorCard[]
): { gained: GainedCard[]; ownedCards: OwnedCard[] } {
  if (p.sessionMode !== 'seance' || p.cardCount < p.seanceSize) {
    return { gained: [], ownedCards: [] };
  }

  const gained: GainedCard[] = [];
  const ownedCards: OwnedCard[] = [];
  let live = new Set(p.ownedIds);

  const add = (card: CollectorCard, source: string) => {
    gained.push(toGainedCard(card));
    ownedCards.push(toOwnedCard(card, source));
    live = new Set([...live, card.id]);
  };

  const deepThemes: CardTheme[] = ['et-si', 'defi', 'verite', 'douceur'];
  const premiumThemes: CardTheme[] = ['verite', 'douceur'];

  // Règle 2 — 1 common garantie
  const commonPool = excludeOwned(
    collectorCards.filter((c) => c.rarity === 'common' && c.depth === 1),
    live
  );
  const commonInSession = commonPool.filter((c) => p.sessionThemes.includes(c.theme));
  const commonPick = pickWeighted(
    commonInSession.length > 0 ? commonInSession : commonPool,
    p.favorites,
    collectorCards
  );
  if (commonPick) add(commonPick, 'card-session');

  // Règle 3 — bonus tous les 3 sessions
  if (p.sessionCount % 3 === 0 && gained.length < 3) {
    const playedDeep = p.sessionThemes.some((th) => deepThemes.includes(th));
    if (playedDeep) {
      const rarePool = excludeOwned(
        collectorCards.filter((c) => c.rarity === 'rare' && c.depth === 2),
        live
      );
      const rarePick = pickWeighted(rarePool, p.favorites, collectorCards);
      if (rarePick) add(rarePick, 'card-session-milestone');
    } else {
      const extraPool = excludeOwned(
        collectorCards.filter((c) => c.rarity === 'common' && c.depth === 1),
        live
      );
      const extraPick = pickWeighted(extraPool, p.favorites, collectorCards);
      if (extraPick) add(extraPick, 'card-session-milestone');
    }
  }

  // Règle 4 — unique premium 20%
  if (
    p.isPremium &&
    p.sessionThemes.some((th) => premiumThemes.includes(th)) &&
    gained.length < 3 &&
    Math.random() < 0.2
  ) {
    const uniquePool = excludeOwned(
      collectorCards.filter((c) => c.rarity === 'unique' && c.depth === 3),
      live
    );
    const uniquePick = pickRandom(uniquePool);
    if (uniquePick) add(uniquePick, 'card-session-premium');
  }

  return { gained, ownedCards };
}
