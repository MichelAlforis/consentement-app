import { describe, it, expect } from 'vitest';
import {
  isHeatUnlocked,
  requiredLevel,
  GATE_THRESHOLDS,
  type HeatGatedFeature,
} from './heatGate';
import { HEAT_THRESHOLDS } from './heatLevel';
import type { HeatLevel } from './heatLevel';

const ALL_FEATURES = Object.keys(GATE_THRESHOLDS) as HeatGatedFeature[];
const ALL_LEVELS: HeatLevel[] = [1, 2, 3, 4, 5];

describe('GATE_THRESHOLDS — cohérence avec HEAT_THRESHOLDS', () => {
  it('chaque gate requiert un palier valide (1–5)', () => {
    for (const feature of ALL_FEATURES) {
      const level = GATE_THRESHOLDS[feature];
      expect(ALL_LEVELS, `${feature} a un palier invalide: ${level}`).toContain(level);
    }
  });

  it('chaque palier requis correspond à un seuil défini dans HEAT_THRESHOLDS', () => {
    for (const feature of ALL_FEATURES) {
      const level = GATE_THRESHOLDS[feature];
      expect(HEAT_THRESHOLDS[level], `HEAT_THRESHOLDS[${level}] manquant pour '${feature}'`).toBeDefined();
    }
  });

  it('aucune gate ne requiert le palier 1 (tout est accessible par défaut)', () => {
    for (const feature of ALL_FEATURES) {
      expect(GATE_THRESHOLDS[feature], `'${feature}' ne devrait pas requérir palier 1`).toBeGreaterThan(1);
    }
  });
});

describe('isHeatUnlocked', () => {
  describe('explicit — palier 2', () => {
    it('verrouillé au palier 1', () => expect(isHeatUnlocked('explicit', 1)).toBe(false));
    it('débloqué exactement au palier 2', () => expect(isHeatUnlocked('explicit', 2)).toBe(true));
    it('débloqué aux paliers supérieurs', () => {
      expect(isHeatUnlocked('explicit', 3)).toBe(true);
      expect(isHeatUnlocked('explicit', 4)).toBe(true);
      expect(isHeatUnlocked('explicit', 5)).toBe(true);
    });
  });

  describe('quiz-intermediaire — palier 2', () => {
    it('verrouillé au palier 1', () => expect(isHeatUnlocked('quiz-intermediaire', 1)).toBe(false));
    it('débloqué exactement au palier 2', () => expect(isHeatUnlocked('quiz-intermediaire', 2)).toBe(true));
  });

  describe('scenarios — palier 3', () => {
    it('verrouillé aux paliers 1 et 2', () => {
      expect(isHeatUnlocked('scenarios', 1)).toBe(false);
      expect(isHeatUnlocked('scenarios', 2)).toBe(false);
    });
    it('débloqué exactement au palier 3', () => expect(isHeatUnlocked('scenarios', 3)).toBe(true));
    it('débloqué aux paliers supérieurs', () => {
      expect(isHeatUnlocked('scenarios', 4)).toBe(true);
      expect(isHeatUnlocked('scenarios', 5)).toBe(true);
    });
  });

  describe('kamasutra — palier 4', () => {
    it('verrouillé aux paliers 1–3', () => {
      for (const level of [1, 2, 3] as HeatLevel[]) {
        expect(isHeatUnlocked('kamasutra', level), `palier ${level}`).toBe(false);
      }
    });
    it('débloqué exactement au palier 4', () => expect(isHeatUnlocked('kamasutra', 4)).toBe(true));
    it('débloqué au palier 5', () => expect(isHeatUnlocked('kamasutra', 5)).toBe(true));
  });

  describe('quiz-expert — palier 4', () => {
    it('verrouillé aux paliers 1–3', () => {
      for (const level of [1, 2, 3] as HeatLevel[]) {
        expect(isHeatUnlocked('quiz-expert', level), `palier ${level}`).toBe(false);
      }
    });
    it('débloqué exactement au palier 4', () => expect(isHeatUnlocked('quiz-expert', 4)).toBe(true));
  });

  describe('expert-cards — palier 5', () => {
    it('verrouillé aux paliers 1–4', () => {
      for (const level of [1, 2, 3, 4] as HeatLevel[]) {
        expect(isHeatUnlocked('expert-cards', level), `palier ${level}`).toBe(false);
      }
    });
    it('débloqué uniquement au palier 5', () => expect(isHeatUnlocked('expert-cards', 5)).toBe(true));
  });
});

describe('requiredLevel', () => {
  it('retourne le bon palier pour chaque feature', () => {
    expect(requiredLevel('explicit')).toBe(2);
    expect(requiredLevel('quiz-intermediaire')).toBe(2);
    expect(requiredLevel('scenarios')).toBe(3);
    expect(requiredLevel('kamasutra')).toBe(4);
    expect(requiredLevel('quiz-expert')).toBe(4);
    expect(requiredLevel('expert-cards')).toBe(5);
  });

  it('retourne la même valeur que GATE_THRESHOLDS directement', () => {
    for (const feature of ALL_FEATURES) {
      expect(requiredLevel(feature)).toBe(GATE_THRESHOLDS[feature]);
    }
  });
});

describe('isHeatUnlocked — propriété générale', () => {
  it('toujours faux en dessous du palier requis', () => {
    for (const feature of ALL_FEATURES) {
      const required = requiredLevel(feature);
      for (const level of ALL_LEVELS.filter((l) => l < required)) {
        expect(isHeatUnlocked(feature, level), `${feature} @ palier ${level}`).toBe(false);
      }
    }
  });

  it('toujours vrai au palier requis et au-dessus', () => {
    for (const feature of ALL_FEATURES) {
      const required = requiredLevel(feature);
      for (const level of ALL_LEVELS.filter((l) => l >= required)) {
        expect(isHeatUnlocked(feature, level), `${feature} @ palier ${level}`).toBe(true);
      }
    }
  });
});
