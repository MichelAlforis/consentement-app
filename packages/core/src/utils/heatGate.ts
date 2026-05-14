import type { HeatLevel } from './heatLevel';

export type HeatGatedFeature =
  | 'explicit'           // Contenu explicite — palier 2
  | 'quiz-intermediaire' // Quiz niveau Intermédiaire — palier 2
  | 'scenarios'          // Mode Scénario — palier 3 (à venir)
  | 'kamasutra'          // Gamme Kamasutra — palier 4 (à venir)
  | 'quiz-expert'        // Quiz niveau Expert — palier 4
  | 'expert-cards';      // Cartes Expert — palier 5 (à venir)

export const GATE_THRESHOLDS: Record<HeatGatedFeature, HeatLevel> = {
  'explicit': 2,
  'quiz-intermediaire': 2,
  'scenarios': 3,
  'kamasutra': 4,
  'quiz-expert': 4,
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
