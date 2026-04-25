import { describe, it, expect, vi, afterEach } from 'vitest';
import { computeGainedCards, pickOneRare, pickOneUnique } from './computeGainedCards';
import type { ComputeParams } from './computeGainedCards';
import type { CollectorCard } from '../data/cards-collector';

// ── Fixture minimale — isolée des vraies données ──────────────────────────────

const CARDS: CollectorCard[] = [
  // common depth 1
  { id: 'c1', deck: 'A', text: 'Common deck 1', depth: 1, tags: [], rarity: 'common', unlockedBy: 'x', sourceDeck: 1, visual: { gradient: '', iconName: 'Heart', border: '' } },
  { id: 'c2', deck: 'A', text: 'Common deck 2', depth: 1, tags: [], rarity: 'common', unlockedBy: 'x', sourceDeck: 2, visual: { gradient: '', iconName: 'Heart', border: '' } },
  { id: 'c3', deck: 'A', text: 'Common deck 3', depth: 1, tags: [], rarity: 'common', unlockedBy: 'x', sourceDeck: 3, visual: { gradient: '', iconName: 'Heart', border: '' } },
  // rare depth 2
  { id: 'r1', deck: 'A', text: 'Rare deck 3',   depth: 2, tags: [], rarity: 'rare',   unlockedBy: 'x', sourceDeck: 3, visual: { gradient: '', iconName: 'Sparkles', border: '' } },
  { id: 'r2', deck: 'A', text: 'Rare deck 4',   depth: 2, tags: [], rarity: 'rare',   unlockedBy: 'x', sourceDeck: 4, visual: { gradient: '', iconName: 'Sparkles', border: '' } },
  // unique depth 3
  { id: 'u1', deck: 'A', text: 'Unique deck 5', depth: 3, tags: [], rarity: 'unique', unlockedBy: 'x', sourceDeck: 5, visual: { gradient: '', iconName: 'Sparkles', border: '' } },
  { id: 'u2', deck: 'A', text: 'Unique deck 6', depth: 3, tags: [], rarity: 'unique', unlockedBy: 'x', sourceDeck: 6, visual: { gradient: '', iconName: 'Sparkles', border: '' } },
];

const BASE: ComputeParams = {
  sessionMode: 'seance',
  cardCount: 5,
  seanceSize: 5,
  sessionDecks: [1, 2],
  sessionCount: 1,
  ownedIds: new Set(),
  favorites: [],
  isPremium: false,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('computeGainedCards', () => {
  afterEach(() => vi.restoreAllMocks());

  it('1 — retourne 1 carte common sur séance complète', () => {
    const { gained } = computeGainedCards(BASE, CARDS);
    expect(gained).toHaveLength(1);
    expect(gained[0].rarity).toBe('common');
  });

  it('2 — retourne gained=[] si mode=libre (guard séance)', () => {
    const { gained } = computeGainedCards({ ...BASE, sessionMode: 'libre' }, CARDS);
    expect(gained).toHaveLength(0);
  });

  it('3 — la common est prise dans les decks explorés (sourceDeck prioritaire)', () => {
    // sessionDecks=[1] → seul c1 (sourceDeck:1) est éligible en priorité
    const { gained } = computeGainedCards({ ...BASE, sessionDecks: [1] }, CARDS);
    expect(gained).toHaveLength(1);
    expect(gained[0].id).toBe('c1');
  });

  it('4 — ajoute 1 rare sur milestone × 3 avec deck profond joué', () => {
    // sessionCount=3 → 3%3===0 ; sessionDecks=[3] → playedDeep=true → rare
    const { gained } = computeGainedCards(
      { ...BASE, sessionCount: 3, sessionDecks: [3] },
      CARDS
    );
    expect(gained).toHaveLength(2);
    expect(gained.some((g) => g.rarity === 'rare')).toBe(true);
  });

  it('5 — pas de rare sans milestone (sessionCount=1)', () => {
    const { gained } = computeGainedCards({ ...BASE, sessionCount: 1 }, CARDS);
    expect(gained).toHaveLength(1);
    expect(gained[0].rarity).toBe('common');
  });

  it('6 — ajoute 1 unique si premium + deck 5|6 + Math.random < 0.2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const { gained } = computeGainedCards(
      { ...BASE, isPremium: true, sessionDecks: [5] },
      CARDS
    );
    expect(gained.some((g) => g.rarity === 'unique')).toBe(true);
  });

  it('7 — pas de unique si Math.random >= 0.2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { gained } = computeGainedCards(
      { ...BASE, isPremium: true, sessionDecks: [5] },
      CARDS
    );
    expect(gained.every((g) => g.rarity !== 'unique')).toBe(true);
  });

  it('8 — ne retourne jamais une carte déjà dans ownedIds', () => {
    const owned = new Set(['c1', 'c2', 'r1']);
    const { gained } = computeGainedCards(
      { ...BASE, sessionCount: 3, sessionDecks: [3], ownedIds: owned },
      CARDS
    );
    for (const g of gained) expect(owned.has(g.id)).toBe(false);
  });

  it('9 — ne dépasse jamais 3 cartes (toutes règles déclenchées)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // déclenche les 20%
    const { gained } = computeGainedCards(
      { ...BASE, sessionCount: 3, sessionDecks: [5], isPremium: true },
      CARDS
    );
    expect(gained.length).toBeLessThanOrEqual(3);
  });

  it('10 — gained et ownedCards synchronisés avec les bons champs', () => {
    const { gained, ownedCards } = computeGainedCards(BASE, CARDS);
    expect(gained.length).toBe(ownedCards.length);
    for (const owned of ownedCards) {
      expect(owned.id).toBeDefined();
      expect(['common', 'rare', 'unique']).toContain(owned.rarity);
      expect(owned.gainedOn).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(owned.unlockedBy).toBeDefined();
    }
    expect(gained.map((g) => g.id).sort()).toEqual(ownedCards.map((o) => o.id).sort());
  });
});

// ── Sprint 5 — Pool épuisé (5.3) ─────────────────────────────────────────────

describe('pool épuisé', () => {
  it('15 — toutes cartes possédées → gained=[] sans erreur', () => {
    const allOwned = new Set(CARDS.map((c) => c.id));
    const { gained, ownedCards } = computeGainedCards({ ...BASE, ownedIds: allOwned }, CARDS);
    expect(gained).toHaveLength(0);
    expect(ownedCards).toHaveLength(0);
  });

  it('16 — pool vide sur milestone × 3 + deck profond → gained=[] sans erreur', () => {
    const allOwned = new Set(CARDS.map((c) => c.id));
    const { gained } = computeGainedCards(
      { ...BASE, sessionCount: 3, sessionDecks: [3], ownedIds: allOwned },
      CARDS
    );
    expect(gained).toHaveLength(0);
  });

  it('17 — pas de substitution de rareté quand la rareté cible est épuisée', () => {
    // Toutes les rares possédées : la règle de milestone ne substitue pas avec une common
    const raresOwned = new Set(['r1', 'r2']);
    const { gained } = computeGainedCards(
      { ...BASE, sessionCount: 3, sessionDecks: [3], ownedIds: raresOwned },
      CARDS
    );
    // Doit avoir la common garantie (règle 1), mais pas de rare (pool vide)
    expect(gained).toHaveLength(1);
    expect(gained[0].rarity).toBe('common');
  });
});

// ── Helpers GooseGame ─────────────────────────────────────────────────────────

describe('pickOneRare', () => {
  it('retourne une rare non possédée', () => {
    const result = pickOneRare(CARDS, new Set(['r1']));
    expect(result).not.toBeNull();
    expect(result!.id).toBe('r2');
  });

  it('retourne null si toutes les rares sont possédées', () => {
    expect(pickOneRare(CARDS, new Set(['r1', 'r2']))).toBeNull();
  });
});

describe('pickOneUnique', () => {
  it('retourne une unique non possédée', () => {
    const result = pickOneUnique(CARDS, new Set(['u1']));
    expect(result).not.toBeNull();
    expect(result!.rarity).toBe('unique');
  });

  it('retourne null si toutes les uniques sont possédées', () => {
    expect(pickOneUnique(CARDS, new Set(['u1', 'u2']))).toBeNull();
  });
});
