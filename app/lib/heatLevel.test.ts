import { describe, it, expect } from 'vitest';
import {
  computeHeatPoints,
  computeHeatBreakdown,
  getHeatLevel,
  getHeatLevelFromInput,
  heatLevelProgress,
  pointsToNextLevel,
  HEAT_THRESHOLDS,
  MODULE_POINTS,
  CARD_POINTS,
  SESSION_POINT_VALUE,
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

describe('SESSION_POINT_VALUE', () => {
  it('vaut exactement 1', () => expect(SESSION_POINT_VALUE).toBe(1));
  it('est utilisé par computeHeatBreakdown (sessions = count × valeur)', () => {
    const { sessions } = computeHeatBreakdown({ completedModules: [], ownedCards: [], sessionCount: 7 });
    expect(sessions).toBe(7 * SESSION_POINT_VALUE);
  });
});

describe('CARD_POINTS — cohérence rareté', () => {
  it('common < rare < unique', () => {
    expect(CARD_POINTS.common).toBeLessThan(CARD_POINTS.rare);
    expect(CARD_POINTS.rare).toBeLessThan(CARD_POINTS.unique);
  });
});

describe('MODULE_POINTS — couverture complète', () => {
  const expectedModules = [
    'module-de-base', 'module-de-base-mineur',
    'porno-vs-realite', 'porno-vs-realite-mineur',
    'quiz-consentement', 'quiz-consentement-mineur',
    'loi-consentement', 'loi-consentement-mineur',
    'duo-flow', 'module-pratiques-adultes', 'accompagnement-mineur',
    'quiz-d1', 'quiz-d2', 'quiz-d3',
    'quiz-i1', 'quiz-i2', 'quiz-i3',
    'quiz-e1', 'quiz-e2', 'quiz-e3',
  ];

  it('tous les modules attendus ont des points définis', () => {
    for (const id of expectedModules) {
      expect(MODULE_POINTS[id as keyof typeof MODULE_POINTS], `MODULE_POINTS['${id}'] manquant`).toBeGreaterThan(0);
    }
  });

  it('tous les points sont positifs', () => {
    for (const [id, pts] of Object.entries(MODULE_POINTS)) {
      expect(pts, `MODULE_POINTS['${id}'] doit être > 0`).toBeGreaterThan(0);
    }
  });
});

describe('dual-reward : module-de-base — progression complète', () => {
  // module-de-base donne :
  //   MODULE_POINTS = 3 pts (apprentissage)
  //   + 24 cartes common × 1pt = 24 pts (collection starter)
  //   = 27 pts total → dépasse directement le palier 2 (seuil 12)
  const starterCards: OwnedCard[] = Array.from({ length: 24 }, (_, i) => ({
    id: `ca-${i.toString().padStart(2, '0')}`,
    rarity: 'common' as const,
    gainedOn: '2026-01-01',
    unlockedBy: 'module-de-base',
  }));

  it('3 pts module + 24 cartes common = 27 pts total', () => {
    const input: HeatInput = {
      completedModules: ['module-de-base'],
      ownedCards: starterCards,
      sessionCount: 0,
    };
    expect(computeHeatPoints(input)).toBe(27);
  });

  it('atteint directement le palier 2 (12 pts requis)', () => {
    const input: HeatInput = {
      completedModules: ['module-de-base'],
      ownedCards: starterCards,
      sessionCount: 0,
    };
    expect(getHeatLevelFromInput(input)).toBe(2);
  });

  it('breakdown : modules=3, cards=24, sessions=0, profile=0', () => {
    const input: HeatInput = {
      completedModules: ['module-de-base'],
      ownedCards: starterCards,
      sessionCount: 0,
    };
    expect(computeHeatBreakdown(input)).toEqual({ modules: 3, cards: 24, sessions: 0, profile: 0, lexique: 0 });
  });
});

describe('dual-reward : module-pratiques-adultes (max reward)', () => {
  it('10 pts module + 1 unique (5pts) = 15 pts', () => {
    const input: HeatInput = {
      completedModules: ['module-pratiques-adultes'],
      ownedCards: [{ id: 'u-01', rarity: 'unique', gainedOn: '2026-01-01', unlockedBy: 'module-pratiques-adultes' }],
      sessionCount: 0,
    };
    expect(computeHeatPoints(input)).toBe(15);
  });
});

describe('HEAT_THRESHOLDS — cohérence des seuils', () => {
  it('palier 1 commence à 0', () => expect(HEAT_THRESHOLDS[1]).toBe(0));
  it('les seuils sont strictement croissants', () => {
    expect(HEAT_THRESHOLDS[1]).toBeLessThan(HEAT_THRESHOLDS[2]);
    expect(HEAT_THRESHOLDS[2]).toBeLessThan(HEAT_THRESHOLDS[3]);
    expect(HEAT_THRESHOLDS[3]).toBeLessThan(HEAT_THRESHOLDS[4]);
    expect(HEAT_THRESHOLDS[4]).toBeLessThan(HEAT_THRESHOLDS[5]);
  });
});
