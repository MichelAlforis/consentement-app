import type { CollectorCard, Rarity } from '../data/cards-collector';
import type { OwnedCard } from '../stores/unlockStore';

// ---------------------------------------------------------------------------
// Types publics
// ---------------------------------------------------------------------------

export interface GainedCard {
  id: string;
  text: string;
  rarity: Rarity;
  gradient: string;
  iconName: string;
  border: string;
}

export interface SessionGainInput {
  sessionDecks: number[];  // ex: [2, 5] — decks explorés dans la session
  favorites: string[];     // ids des cartes mises en favori pendant la session
  seanceSize: 5 | 10;
  isPremium: boolean;
  sessionsPlayed: number;  // avant cette session (avant increment)
}

// ---------------------------------------------------------------------------
// Helpers internes
// ---------------------------------------------------------------------------

function toGainedCard(card: CollectorCard): GainedCard {
  return {
    id: card.id,
    text: card.text,
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

function excludeOwned(cards: CollectorCard[], alreadyOwned: string[]): CollectorCard[] {
  const owned = new Set(alreadyOwned);
  return cards.filter((c) => !owned.has(c.id));
}

function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

// Pondère les cartes dont le sourceDeck est présent dans les decks favoris.
// Les cartes d'un deck représenté dans les favoris ont un poids × 2.
function pickWeightedByFavoriteDecks(
  candidates: CollectorCard[],
  sessionDecks: number[],
  favorites: string[],
  allCards: CollectorCard[]
): CollectorCard | null {
  if (candidates.length === 0) return null;

  // Identifie les decks dont au moins 1 favori fait partie
  const favoriteCardIds = new Set(favorites);
  const favoriteDeckSet = new Set<number>();
  for (const card of allCards) {
    if (favoriteCardIds.has(card.id) && card.sourceDeck !== undefined) {
      favoriteDeckSet.add(card.sourceDeck);
    }
  }

  // Pondère chaque candidat : × 2 si son sourceDeck est dans les favoris
  const weighted: CollectorCard[] = [];
  for (const card of candidates) {
    const weight = card.sourceDeck && favoriteDeckSet.has(card.sourceDeck) ? 2 : 1;
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
 *   1. 1 carte common garantie (depth 1, decks explorés)
 *   2. Si (sessionsPlayed + 1) % 3 === 0 → +1 carte rare
 *   3. Si isPremium && deck 5 ou 6 exploré → 20% chance d'une unique
 *   4. Pondération favoris × 2 sur les decks représentés
 *   5. Déduplication sur alreadyOwned — pas de carte déjà possédée
 *   6. Maximum 3 cartes retournées
 */
export function computeGainedCards(
  input: SessionGainInput,
  collectorCards: CollectorCard[],
  alreadyOwned: string[]
): { gained: GainedCard[]; ownedCards: OwnedCard[] } {
  const { sessionDecks, favorites, isPremium, sessionsPlayed } = input;
  const available = excludeOwned(collectorCards, alreadyOwned);
  const gained: GainedCard[] = [];
  const ownedCards: OwnedCard[] = [];

  const add = (card: CollectorCard, source: string) => {
    gained.push(toGainedCard(card));
    ownedCards.push(toOwnedCard(card, source));
  };

  // Règle 1 — 1 common garantie
  const commonPool = available.filter(
    (c) => c.rarity === 'common' && c.depth === 1
  );
  // Préférer les decks explorés pendant la séance
  const commonInSession = commonPool.filter(
    (c) => c.sourceDeck && sessionDecks.includes(c.sourceDeck)
  );
  const commonPick =
    pickWeightedByFavoriteDecks(
      commonInSession.length > 0 ? commonInSession : commonPool,
      sessionDecks,
      favorites,
      collectorCards
    );
  if (commonPick) add(commonPick, 'card-session');

  // Règle 2 — bonus multiple de 3
  if ((sessionsPlayed + 1) % 3 === 0 && gained.length < 3) {
    const ownedAfterCommon = alreadyOwned.concat(gained.map((g) => g.id));
    const rarePool = excludeOwned(
      collectorCards.filter((c) => c.rarity === 'rare' && c.depth === 2),
      ownedAfterCommon
    );
    const rarePick = pickWeightedByFavoriteDecks(
      rarePool,
      sessionDecks,
      favorites,
      collectorCards
    );
    if (rarePick) add(rarePick, 'card-session-milestone');
  }

  // Règle 3 — chance unique premium
  if (isPremium && sessionDecks.some((d) => d === 5 || d === 6) && gained.length < 3) {
    if (Math.random() < 0.2) {
      const ownedSoFar = alreadyOwned.concat(gained.map((g) => g.id));
      const uniquePool = excludeOwned(
        collectorCards.filter((c) => c.rarity === 'unique' && c.depth === 3),
        ownedSoFar
      );
      const uniquePick = pickRandom(uniquePool);
      if (uniquePick) add(uniquePick, 'card-session-premium');
    }
  }

  return { gained, ownedCards };
}

// ---------------------------------------------------------------------------
// Helpers pour les triggers déterministes (GooseGame)
// ---------------------------------------------------------------------------

export function pickOneRare(
  collectorCards: CollectorCard[],
  alreadyOwned: string[]
): CollectorCard | null {
  const pool = excludeOwned(
    collectorCards.filter((c) => c.rarity === 'rare'),
    alreadyOwned
  );
  return pickRandom(pool);
}

export function pickOneUnique(
  collectorCards: CollectorCard[],
  alreadyOwned: string[]
): CollectorCard | null {
  const pool = excludeOwned(
    collectorCards.filter((c) => c.rarity === 'unique'),
    alreadyOwned
  );
  return pickRandom(pool);
}
