import type { OwnedCard } from '../stores/unlockStore';
import type { EffectiveModuleId } from '../modules';

export type HeatLevel = 1 | 2 | 3 | 4 | 5;

export interface HeatInput {
  completedModules: string[];
  ownedCards: OwnedCard[];
  sessionCount: number;
  /** Nombre de catégories confort renseignées (0-3 : tendresse, intensité, confiance) */
  profileComfortCategories?: number;
  /** Mot de sécurité défini par l'utilisateur */
  safewordDefined?: boolean;
  /** Pronoms renseignés dans le profil */
  pronounsDefined?: boolean;
  /** Réservé V2 — lexique non implémenté */
  lexiqueWords?: number;
}

// Points par module (basés sur la rareté de la récompense)
export const MODULE_POINTS: Partial<Record<EffectiveModuleId, number>> = {
  'module-de-base': 3,
  'module-de-base-mineur': 3,
  'porno-vs-realite': 2,
  'porno-vs-realite-mineur': 2,
  'quiz-consentement': 2,
  'quiz-consentement-mineur': 2,
  'loi-consentement': 5,
  'loi-consentement-mineur': 5,
  'duo-flow': 5,
  'module-pratiques-adultes': 10,
  'accompagnement-mineur': 5,
  'quiz-d1': 2, 'quiz-d2': 2, 'quiz-d3': 2,
  'quiz-i1': 4, 'quiz-i2': 4, 'quiz-i3': 4,
  'quiz-e1': 8, 'quiz-e2': 8, 'quiz-e3': 8,
};

// Points par rareté de carte
export const CARD_POINTS: Record<OwnedCard['rarity'], number> = {
  common: 1,
  rare: 2,
  unique: 5,
};

// Seuils des 5 paliers (pts minimum pour atteindre le palier)
export const HEAT_THRESHOLDS: Record<HeatLevel, number> = {
  1: 0,
  2: 12,
  3: 40,
  4: 80,
  5: 130,
};

export function computeHeatPoints(input: HeatInput): number {
  const modulePoints = input.completedModules.reduce((sum, id) => {
    return sum + (MODULE_POINTS[id as EffectiveModuleId] ?? 0);
  }, 0);

  const cardPoints = input.ownedCards.reduce((sum, card) => {
    return sum + (CARD_POINTS[card.rarity] ?? 0);
  }, 0);

  const sessionPoints = input.sessionCount;
  const profilePoints = (input.profileComfortCategories ?? 0); // 1pt par catégorie renseignée
  const safewordPoints = input.safewordDefined ? 3 : 0;
  const pronounsPoints = input.pronounsDefined ? 2 : 0;

  return modulePoints + cardPoints + sessionPoints + profilePoints + safewordPoints + pronounsPoints;
}

export function getHeatLevel(points: number): HeatLevel {
  if (points >= HEAT_THRESHOLDS[5]) return 5;
  if (points >= HEAT_THRESHOLDS[4]) return 4;
  if (points >= HEAT_THRESHOLDS[3]) return 3;
  if (points >= HEAT_THRESHOLDS[2]) return 2;
  return 1;
}

export function getHeatLevelFromInput(input: HeatInput): HeatLevel {
  return getHeatLevel(computeHeatPoints(input));
}

/** Points nécessaires pour atteindre le palier suivant (null si au max) */
export function pointsToNextLevel(points: number): number | null {
  const level = getHeatLevel(points);
  if (level === 5) return null;
  const nextLevel = (level + 1) as HeatLevel;
  return HEAT_THRESHOLDS[nextLevel] - points;
}

/** Progression en % dans le palier actuel (0–1) */
export function heatLevelProgress(points: number): number {
  const level = getHeatLevel(points);
  if (level === 5) return 1;
  const nextLevel = (level + 1) as HeatLevel;
  const from = HEAT_THRESHOLDS[level];
  const to = HEAT_THRESHOLDS[nextLevel];
  return Math.min(1, (points - from) / (to - from));
}
