import { describe, it, expect, beforeEach } from 'vitest';
import { useUnlockStore } from './unlockStore';
import type { OwnedCard } from './unlockStore';

const store = () => useUnlockStore.getState();

function makeCard(id: string, rarity: OwnedCard['rarity'] = 'common'): OwnedCard {
  return { id, rarity, gainedOn: '2026-01-01', unlockedBy: 'test' };
}

beforeEach(() => {
  store().reset();
});

describe('unlockStore — état initial', () => {
  it('ownedCards vide', () => {
    expect(store().ownedCards).toEqual([]);
  });

  it('sessionCount à 0', () => {
    expect(store().sessionCount).toBe(0);
  });
});

describe('unlockStore — unlockCards', () => {
  it('ajoute une carte', () => {
    store().unlockCards([makeCard('ca-01')]);
    expect(store().ownedCards).toHaveLength(1);
    expect(store().ownedCards[0].id).toBe('ca-01');
  });

  it('ajoute plusieurs cartes en une fois', () => {
    store().unlockCards([makeCard('ca-01'), makeCard('ca-02')]);
    expect(store().ownedCards).toHaveLength(2);
  });

  it('ne duplique pas une carte déjà possédée', () => {
    store().unlockCards([makeCard('ca-01')]);
    store().unlockCards([makeCard('ca-01')]);
    expect(store().ownedCards).toHaveLength(1);
  });

  it('ajoute uniquement les nouvelles parmi un lot mixte', () => {
    store().unlockCards([makeCard('ca-01')]);
    store().unlockCards([makeCard('ca-01'), makeCard('ca-02'), makeCard('ca-03')]);
    expect(store().ownedCards).toHaveLength(3);
    expect(store().ownedCards.map(c => c.id)).toContain('ca-02');
  });

  it('unlockCards([]) ne modifie pas ownedCards', () => {
    store().unlockCards([makeCard('ca-01')]);
    store().unlockCards([]);
    expect(store().ownedCards).toHaveLength(1);
  });

  it('préserve toutes les métadonnées (rarity, gainedOn, unlockedBy)', () => {
    const card: OwnedCard = { id: 'ca-10', rarity: 'rare', gainedOn: '2026-04-26', unlockedBy: 'loi-consentement' };
    store().unlockCards([card]);
    expect(store().ownedCards[0]).toEqual(card);
  });
});

describe('unlockStore — sessionCount', () => {
  it('incrementSessionCount incrémente de 1', () => {
    store().incrementSessionCount();
    expect(store().sessionCount).toBe(1);
  });

  it('plusieurs incréments s\'accumulent', () => {
    store().incrementSessionCount();
    store().incrementSessionCount();
    store().incrementSessionCount();
    expect(store().sessionCount).toBe(3);
  });
});

describe('unlockStore — reset', () => {
  it('reset vide ownedCards et sessionCount', () => {
    store().unlockCards([makeCard('ca-01')]);
    store().incrementSessionCount();
    store().reset();
    expect(store().ownedCards).toEqual([]);
    expect(store().sessionCount).toBe(0);
  });
});
