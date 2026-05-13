import type { HeatLevel } from './heatLevel';

export type HeatGatedFeature =
  | 'explicit'       // Contenu explicite — palier 2
  | 'scenarios'      // Mode Scénario — palier 3 (à venir)
  | 'kamasutra'      // Gamme Kamasutra — palier 4 (à venir)
  | 'expert-cards';  // Cartes Expert — palier 5 (à venir)

const GATE_THRESHOLDS: Record<HeatGatedFeature, HeatLevel> = {
  'explicit': 2,
  'scenarios': 3,
  'kamasutra': 4,
  'expert-cards': 5,
};

/** Retourne true si la fonctionnalité est accessible au niveau de chaleur donné */
export function isHeatUnlocked(feature: HeatGatedFeature, level: HeatLevel): boolean {
  return level >= GATE_THRESHOLDS[feature];
}

/** Retourne le palier requis pour débloquer la fonctionnalité */
export function requiredLevel(feature: HeatGatedFeature): HeatLevel {
  return GATE_THRESHOLDS[feature];
}
