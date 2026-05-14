/**
 * Tests d'intégration : chaîne complète computeModuleGain → heat points
 * Vérifie le design dual-reward avec les données réelles de cards-collector.
 */
import { describe, it, expect } from 'vitest';
import { computeModuleGain } from './computeModuleGain';
import { collectorCards } from '../data/cards-collector';
import {
  computeHeatPoints,
  computeHeatBreakdown,
  getHeatLevelFromInput,
  MODULE_POINTS,
  CARD_POINTS,
} from './heatLevel';
import type { OwnedCard } from '../stores/unlockStore';

function toOwned(cards: OwnedCard[]): OwnedCard[] {
  return cards;
}

// ─── computeModuleGain — comportement de base ─────────────────────────────────

describe('computeModuleGain — module-de-base (deck starter)', () => {
  it('retourne exactement 24 cartes pour un utilisateur sans cartes', () => {
    const result = computeModuleGain('module-de-base', new Set(), collectorCards);
    expect(result).toHaveLength(24);
  });

  it('toutes les cartes sont de rareté common', () => {
    const result = computeModuleGain('module-de-base', new Set(), collectorCards);
    expect(result.every((c) => c.rarity === 'common')).toBe(true);
  });

  it('pas de doublons dans le gain', () => {
    const result = computeModuleGain('module-de-base', new Set(), collectorCards);
    const ids = result.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('respecte ownedIds — ne redistribue pas les cartes déjà possédées', () => {
    const first = computeModuleGain('module-de-base', new Set(), collectorCards);
    const ownedIds = new Set(first.map((c) => c.id));
    const second = computeModuleGain('module-de-base', ownedIds, collectorCards);
    // Si toutes les cartes du pool sont déjà possédées, résultat vide
    if (second.length > 0) {
      // Il reste des cartes non possédées dans le deck
      expect(second.every((c) => !ownedIds.has(c.id))).toBe(true);
    }
  });
});

describe('computeModuleGain — modules avec rare (loi-consentement)', () => {
  it('retourne 1 carte rare', () => {
    const result = computeModuleGain('loi-consentement', new Set(), collectorCards);
    expect(result).toHaveLength(1);
    expect(result[0].rarity).toBe('rare');
  });
});

describe('computeModuleGain — modules avec unique (module-pratiques-adultes)', () => {
  it('retourne 1 carte unique', () => {
    const result = computeModuleGain('module-pratiques-adultes', new Set(), collectorCards);
    expect(result).toHaveLength(1);
    expect(result[0].rarity).toBe('unique');
  });
});

describe('computeModuleGain — module inconnu', () => {
  it('retourne [] pour un module sans reward configuré', () => {
    const result = computeModuleGain('module-inexistant', new Set(), collectorCards);
    expect(result).toEqual([]);
  });
});

// ─── Dual-reward : chain complète avec données réelles ───────────────────────

describe('dual-reward intégration — module-de-base', () => {
  const gainedCards = computeModuleGain('module-de-base', new Set(), collectorCards);
  const ownedCards = toOwned(gainedCards);

  it('total heat = MODULE_POINTS + CARD_POINTS × cartes réelles', () => {
    const expectedModulePts = MODULE_POINTS['module-de-base']!;
    const expectedCardPts = gainedCards.reduce((sum, c) => sum + CARD_POINTS[c.rarity], 0);

    const total = computeHeatPoints({
      completedModules: ['module-de-base'],
      ownedCards,
      sessionCount: 0,
    });

    expect(total).toBe(expectedModulePts + expectedCardPts);
  });

  it('atteint le palier 2 (seuil 12 pts) dès la première complétion', () => {
    expect(getHeatLevelFromInput({
      completedModules: ['module-de-base'],
      ownedCards,
      sessionCount: 0,
    })).toBe(2);
  });

  it('breakdown.modules = MODULE_POINTS[module-de-base]', () => {
    const { modules } = computeHeatBreakdown({
      completedModules: ['module-de-base'],
      ownedCards,
      sessionCount: 0,
    });
    expect(modules).toBe(MODULE_POINTS['module-de-base']);
  });

  it('breakdown.cards = nombre de cartes gagnées (toutes common = 1pt chacune)', () => {
    const { cards } = computeHeatBreakdown({
      completedModules: ['module-de-base'],
      ownedCards,
      sessionCount: 0,
    });
    expect(cards).toBe(gainedCards.length * CARD_POINTS.common);
  });
});

describe('dual-reward intégration — module-pratiques-adultes (max module)', () => {
  const gainedCards = computeModuleGain('module-pratiques-adultes', new Set(), collectorCards);

  it('1 unique × 5pts + 10pts module = 15pts si carte gagnée', () => {
    if (gainedCards.length === 0) return; // pool épuisé, skip
    const total = computeHeatPoints({
      completedModules: ['module-pratiques-adultes'],
      ownedCards: toOwned(gainedCards),
      sessionCount: 0,
    });
    expect(total).toBe(MODULE_POINTS['module-pratiques-adultes']! + CARD_POINTS.unique);
  });
});

describe('dual-reward intégration — plusieurs modules cumulés', () => {
  it("les points de modules distincts s'additionnent sans plafond", () => {
    const cards1 = computeModuleGain('module-de-base', new Set(), collectorCards);
    const owned1 = new Set(cards1.map((c) => c.id));
    const cards2 = computeModuleGain('loi-consentement', owned1, collectorCards);

    const total = computeHeatPoints({
      completedModules: ['module-de-base', 'loi-consentement'],
      ownedCards: toOwned([...cards1, ...cards2]),
      sessionCount: 0,
    });

    const expected =
      MODULE_POINTS['module-de-base']! +
      cards1.reduce((s, c) => s + CARD_POINTS[c.rarity], 0) +
      MODULE_POINTS['loi-consentement']! +
      cards2.reduce((s, c) => s + CARD_POINTS[c.rarity], 0);

    expect(total).toBe(expected);
  });
});
