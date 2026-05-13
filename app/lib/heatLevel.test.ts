import { describe, it, expect } from 'vitest';
import {
  computeHeatPoints,
  getHeatLevel,
  getHeatLevelFromInput,
  heatLevelProgress,
  pointsToNextLevel,
  HEAT_THRESHOLDS,
} from './heatLevel';
import type { HeatInput } from './heatLevel';
import type { OwnedCard } from '../stores/unlockStore';

function card(rarity: OwnedCard['rarity']): OwnedCard {
  return { id: `c-${Math.random()}`, rarity, gainedOn: '2026-01-01', unlockedBy: 'test' };
}

describe('computeHeatPoints', () => {
  it('retourne 0 pour un état vide', () => {
    expect(computeHeatPoints({ completedModules: [], ownedCards: [], sessionCount: 0 })).toBe(0);
  });

  it('compte les points de module de base (intro=3)', () => {
    const input: HeatInput = { completedModules: ['module-de-base'], ownedCards: [], sessionCount: 0 };
    expect(computeHeatPoints(input)).toBe(3);
  });

  it('compte les points des modules easy (2pts chacun)', () => {
    const input: HeatInput = {
      completedModules: ['porno-vs-realite', 'quiz-consentement'],
      ownedCards: [],
      sessionCount: 0,
    };
    expect(computeHeatPoints(input)).toBe(4);
  });

  it('compte les points des modules medium (5pts chacun)', () => {
    const input: HeatInput = {
      completedModules: ['loi-consentement', 'duo-flow'],
      ownedCards: [],
      sessionCount: 0,
    };
    expect(computeHeatPoints(input)).toBe(10);
  });

  it('compte les points du module hard (10pts)', () => {
    const input: HeatInput = {
      completedModules: ['module-pratiques-adultes'],
      ownedCards: [],
      sessionCount: 0,
    };
    expect(computeHeatPoints(input)).toBe(10);
  });

  it('ignore les modules inconnus (pas de crash)', () => {
    const input: HeatInput = {
      completedModules: ['unknown-module'],
      ownedCards: [],
      sessionCount: 0,
    };
    expect(computeHeatPoints(input)).toBe(0);
  });

  it('compte les cartes common (1pt), rare (2pts), unique (5pts)', () => {
    const input: HeatInput = {
      completedModules: [],
      ownedCards: [card('common'), card('rare'), card('unique')],
      sessionCount: 0,
    };
    expect(computeHeatPoints(input)).toBe(8); // 1+2+5
  });

  it('compte les séances de jeu (1pt chacune)', () => {
    const input: HeatInput = { completedModules: [], ownedCards: [], sessionCount: 5 };
    expect(computeHeatPoints(input)).toBe(5);
  });

  it('compte 1pt par catégorie confort renseignée (max 3)', () => {
    expect(computeHeatPoints({ completedModules: [], ownedCards: [], sessionCount: 0, profileComfortCategories: 0 })).toBe(0);
    expect(computeHeatPoints({ completedModules: [], ownedCards: [], sessionCount: 0, profileComfortCategories: 1 })).toBe(1);
    expect(computeHeatPoints({ completedModules: [], ownedCards: [], sessionCount: 0, profileComfortCategories: 3 })).toBe(3);
  });

  it('ajoute 3pts si mot de sécurité défini', () => {
    expect(computeHeatPoints({ completedModules: [], ownedCards: [], sessionCount: 0, safewordDefined: true })).toBe(3);
    expect(computeHeatPoints({ completedModules: [], ownedCards: [], sessionCount: 0, safewordDefined: false })).toBe(0);
  });

  it('ajoute 2pts si pronoms renseignés', () => {
    expect(computeHeatPoints({ completedModules: [], ownedCards: [], sessionCount: 0, pronounsDefined: true })).toBe(2);
    expect(computeHeatPoints({ completedModules: [], ownedCards: [], sessionCount: 0, pronounsDefined: false })).toBe(0);
  });

  it('combine tous les triggers', () => {
    const input: HeatInput = {
      completedModules: ['module-de-base', 'quiz-consentement'],
      ownedCards: [card('common'), card('common'), card('rare')],
      sessionCount: 3,
    };
    // modules: 3+2=5, cards: 1+1+2=4, sessions: 3 → total 12
    expect(computeHeatPoints(input)).toBe(12);
  });

  it('combine profil complet (max bonus profil = 8pts)', () => {
    const input: HeatInput = {
      completedModules: [],
      ownedCards: [],
      sessionCount: 0,
      profileComfortCategories: 3,
      safewordDefined: true,
      pronounsDefined: true,
    };
    // 3 + 3 + 2 = 8
    expect(computeHeatPoints(input)).toBe(8);
  });

  it('prend en compte les variantes mineures', () => {
    const input: HeatInput = {
      completedModules: ['module-de-base-mineur', 'loi-consentement-mineur'],
      ownedCards: [],
      sessionCount: 0,
    };
    expect(computeHeatPoints(input)).toBe(8); // 3+5
  });
});

describe('getHeatLevel', () => {
  it('retourne 1 à 0 points', () => expect(getHeatLevel(0)).toBe(1));
  it('retourne 1 à 11 points', () => expect(getHeatLevel(11)).toBe(1));
  it('retourne 2 à 12 points (seuil exact)', () => expect(getHeatLevel(12)).toBe(2));
  it('retourne 2 à 39 points', () => expect(getHeatLevel(39)).toBe(2));
  it('retourne 3 à 40 points (seuil exact)', () => expect(getHeatLevel(40)).toBe(3));
  it('retourne 4 à 80 points (seuil exact)', () => expect(getHeatLevel(80)).toBe(4));
  it('retourne 5 à 130 points (seuil exact)', () => expect(getHeatLevel(130)).toBe(5));
  it('retourne 5 au-delà de 130 points', () => expect(getHeatLevel(999)).toBe(5));
});

describe('getHeatLevelFromInput', () => {
  it('atteint palier 2 avec module-de-base + 9 cartes common', () => {
    const input: HeatInput = {
      completedModules: ['module-de-base'],
      ownedCards: Array.from({ length: 9 }, () => card('common')),
      sessionCount: 0,
    };
    // 3 + 9 = 12 → palier 2
    expect(getHeatLevelFromInput(input)).toBe(2);
  });
});

describe('pointsToNextLevel', () => {
  it('retourne le delta au seuil suivant', () => {
    expect(pointsToNextLevel(0)).toBe(HEAT_THRESHOLDS[2]); // 12
    expect(pointsToNextLevel(5)).toBe(7); // 12-5
    expect(pointsToNextLevel(12)).toBe(HEAT_THRESHOLDS[3] - 12); // 28
  });

  it('retourne null au palier max', () => {
    expect(pointsToNextLevel(130)).toBeNull();
    expect(pointsToNextLevel(200)).toBeNull();
  });
});

describe('heatLevelProgress', () => {
  it('retourne 0 au début du palier', () => expect(heatLevelProgress(0)).toBe(0));
  it('retourne 0.5 au milieu du palier 1→2', () => expect(heatLevelProgress(6)).toBe(0.5));
  it('retourne 1 au palier max', () => expect(heatLevelProgress(130)).toBe(1));
  it('retourne 1 au-delà du palier max', () => expect(heatLevelProgress(200)).toBe(1));
});
