import { describe, it, expect } from 'vitest';
import { computeModuleGain } from './computeModuleGain';
import type { CollectorCard } from '../data/cards-collector';

// ── Fixture ───────────────────────────────────────────────────────────────────

function makeCard(id: string, deck: 'A' | 'B' | 'M', rarity: CollectorCard['rarity']): CollectorCard {
  return {
    id,
    deck,
    theme: 'osez',
    text: id,
    depth: 1,
    tags: [],
    rarity,
    unlockedBy: 'test',
    visual: { gradient: '', iconName: 'Heart', border: '' },
  };
}

const COMMON_A = Array.from({ length: 6 }, (_, i) => makeCard(`ca${i}`, 'A', 'common'));
const RARE_A   = [makeCard('ra1', 'A', 'rare')];
const UNIQUE_A = [makeCard('ua1', 'A', 'unique')];
const COMMON_M = [makeCard('cm1', 'M', 'common')];
const RARE_M   = [makeCard('rm1', 'M', 'rare')];

const ALL = [...COMMON_A, ...RARE_A, ...UNIQUE_A, ...COMMON_M, ...RARE_M];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('computeModuleGain', () => {
  it('returns [] for unknown moduleId', () => {
    expect(computeModuleGain('unknown-module', new Set(), ALL)).toEqual([]);
  });

  it('easy module → 1 common Deck A card', () => {
    const result = computeModuleGain('quiz-consentement', new Set(), ALL);
    expect(result).toHaveLength(1);
    expect(result[0].rarity).toBe('common');
    expect(result[0].unlockedBy).toBe('quiz-consentement');
    expect(COMMON_A.map((c) => c.id)).toContain(result[0].id);
  });

  it('medium module → 1 rare Deck A card', () => {
    const result = computeModuleGain('loi-consentement', new Set(), ALL);
    expect(result).toHaveLength(1);
    expect(result[0].rarity).toBe('rare');
    expect(result[0].id).toBe('ra1');
    expect(result[0].unlockedBy).toBe('loi-consentement');
  });

  it('hard module → 1 unique Deck A card', () => {
    const result = computeModuleGain('module-pratiques-adultes', new Set(), ALL);
    expect(result).toHaveLength(1);
    expect(result[0].rarity).toBe('unique');
    expect(result[0].id).toBe('ua1');
  });

  it('module-de-base → count capped to pool size (6 common A, not 24)', () => {
    const result = computeModuleGain('module-de-base', new Set(), ALL);
    expect(result).toHaveLength(6);
    const ids = result.map((c) => c.id);
    expect(COMMON_A.map((c) => c.id)).toEqual(expect.arrayContaining(ids));
  });

  it('pool fully owned → []', () => {
    const owned = new Set(RARE_A.map((c) => c.id));
    expect(computeModuleGain('loi-consentement', owned, ALL)).toEqual([]);
  });

  it('already owned cards are excluded from pick', () => {
    const owned = new Set(['ca0', 'ca1', 'ca2', 'ca3', 'ca4']);
    const result = computeModuleGain('quiz-consentement', owned, ALL);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ca5');
  });

  it('Deck M module → picks from Deck M only', () => {
    const result = computeModuleGain('accompagnement-mineur', new Set(), ALL);
    expect(result).toHaveLength(1);
    expect(result[0].rarity).toBe('rare');
    expect(result[0].id).toBe('rm1');
  });

  it('Deck A module does not return Deck M cards', () => {
    const result = computeModuleGain('quiz-consentement', new Set(), ALL);
    expect(result.every((c) => COMMON_A.map((x) => x.id).includes(c.id))).toBe(true);
  });

  it('OwnedCard has required shape', () => {
    const result = computeModuleGain('loi-consentement', new Set(), ALL);
    expect(result[0]).toMatchObject({
      id: expect.any(String),
      rarity: expect.stringMatching(/^(common|rare|unique)$/),
      gainedOn: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      unlockedBy: 'loi-consentement',
    });
  });

  it('duo-flow → rare Deck A', () => {
    const result = computeModuleGain('duo-flow', new Set(), ALL);
    expect(result).toHaveLength(1);
    expect(result[0].rarity).toBe('rare');
  });

  it('mineur common module picks from Deck M not Deck A', () => {
    const result = computeModuleGain('quiz-consentement-mineur', new Set(), ALL);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('cm1');
  });
});
