import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sampleCardByFace, sampleRandomCard, FACE_TO_THEME } from './sampleCard';
import type { OwnedCard } from '../stores/unlockStore';
import type { CollectorCard } from '../data/cards-collector';

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makeCard(id: string, theme: CollectorCard['theme'], rarity: CollectorCard['rarity'] = 'common'): CollectorCard {
  return {
    id, deck: 'A', theme, text: `text-${id}`, depth: 1, tags: [],
    rarity, unlockedBy: 'test',
    visual: { gradient: `grad-${id}`, iconName: 'Heart', border: `brd-${id}` },
  };
}

function makeOwned(id: string): OwnedCard {
  return { id, rarity: 'common', gainedOn: '2026-01-01', unlockedBy: 'test' };
}

const CARDS: CollectorCard[] = [
  makeCard('c-osez-1', 'osez'),
  makeCard('c-osez-2', 'osez'),
  makeCard('c-parlez-1', 'parlez'),
  makeCard('c-verite-1', 'verite', 'rare'),
  makeCard('c-douceur-1', 'douceur', 'unique'),
];

// ─── FACE_TO_THEME ────────────────────────────────────────────────────────────

describe('FACE_TO_THEME', () => {
  it('couvre les 6 faces du dé', () => {
    expect(Object.keys(FACE_TO_THEME)).toHaveLength(6);
  });

  it.each([
    [1, 'osez'], [2, 'parlez'], [3, 'et-si'],
    [4, 'defi'], [5, 'verite'], [6, 'douceur'],
  ] as const)('face %d → thème %s', (face, theme) => {
    expect(FACE_TO_THEME[face]).toBe(theme);
  });
});

// ─── sampleCardByFace ─────────────────────────────────────────────────────────

describe('sampleCardByFace', () => {
  beforeEach(() => { vi.spyOn(Math, 'random').mockReturnValue(0); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('retourne null si ownedCards est vide', () => {
    expect(sampleCardByFace(1, [], CARDS)).toBeNull();
  });

  it('sample dans le thème correspondant à la face', () => {
    const owned = [makeOwned('c-osez-1'), makeOwned('c-osez-2'), makeOwned('c-parlez-1')];
    const card = sampleCardByFace(1, owned, CARDS); // face 1 = osez
    expect(card?.id).toMatch(/^c-osez-/);
  });

  it('sélectionne la deuxième carte thématique quand random → 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const owned = [makeOwned('c-osez-1'), makeOwned('c-osez-2')];
    const card = sampleCardByFace(1, owned, CARDS);
    expect(card?.id).toBe('c-osez-2');
  });

  it('fallback sur le pool complet si aucune carte dans le thème', () => {
    const owned = [makeOwned('c-parlez-1')]; // pas d'osez
    const card = sampleCardByFace(1, owned, CARDS); // face 1 = osez → aucun match
    expect(card?.id).toBe('c-parlez-1');
  });

  it('face 0 (inconnue) → pas de thème → fallback pool complet', () => {
    const owned = [makeOwned('c-parlez-1')];
    const card = sampleCardByFace(0, owned, CARDS);
    expect(card?.id).toBe('c-parlez-1');
  });

  it('retourne la bonne forme GainedCard', () => {
    const owned = [makeOwned('c-verite-1')];
    const card = sampleCardByFace(5, owned, CARDS); // face 5 = verite
    expect(card).toMatchObject({
      id: 'c-verite-1',
      text: 'text-c-verite-1',
      rarity: 'rare',
      gradient: 'grad-c-verite-1',
      iconName: 'Heart',
      border: 'brd-c-verite-1',
    });
  });

  it('retourne null si l\'id possédé est absent du catalogue', () => {
    const owned = [makeOwned('inconnu')];
    expect(sampleCardByFace(1, owned, CARDS)).toBeNull();
  });
});

// ─── sampleRandomCard ────────────────────────────────────────────────────────

describe('sampleRandomCard', () => {
  beforeEach(() => { vi.spyOn(Math, 'random').mockReturnValue(0); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('retourne null si ownedCards est vide', () => {
    expect(sampleRandomCard([], CARDS)).toBeNull();
  });

  it('retourne une carte du pool (index 0 quand random=0)', () => {
    const owned = [makeOwned('c-osez-1'), makeOwned('c-parlez-1')];
    expect(sampleRandomCard(owned, CARDS)?.id).toBe('c-osez-1');
  });

  it('retourne la dernière carte quand random → 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const owned = [makeOwned('c-osez-1'), makeOwned('c-parlez-1')];
    expect(sampleRandomCard(owned, CARDS)?.id).toBe('c-parlez-1');
  });

  it('retourne la bonne forme GainedCard', () => {
    const owned = [makeOwned('c-douceur-1')];
    const card = sampleRandomCard(owned, CARDS);
    expect(card).toMatchObject({ id: 'c-douceur-1', rarity: 'unique', iconName: 'Heart' });
  });

  it('retourne null si l\'id possédé est absent du catalogue', () => {
    expect(sampleRandomCard([makeOwned('fantome')], CARDS)).toBeNull();
  });
});
