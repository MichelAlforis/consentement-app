import type { OwnedCard } from '../stores/unlockStore';
import type { EffectiveModuleId } from '../modules';

export type HeatLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Système de points DUAL-REWARD intentionnel :
 *
 * Compléter un module donne des points DE DEUX SOURCES DISTINCTES :
 *   1. MODULE_POINTS[moduleId]  — récompense l'apprentissage lui-même
 *   2. CARD_POINTS × cartes gagnées — récompense la collection débloquée
 *
 * Ce n'est PAS du double-comptage : les deux stores (moduleProgressStore
 * et unlockStore) sont indépendants et mesurent des choses différentes.
 * Le deck starter de module-de-base (24 cartes common) donne donc 3 + 24 = 27 pts,
 * ce qui propulse immédiatement l'utilisateur au palier 2 lors de sa première session.
 */
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
  lexiqueWords?: number;
  /** Nombre de réponses préférences données dans MoiScreen (+1 pt chacune) */
  preferencesAnswered?: number;
}

// Points par module (récompense l'apprentissage — indépendant des cartes gagnées)
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

// Points par rareté de carte (s'accumulent séparément des MODULE_POINTS)
export const CARD_POINTS: Record<OwnedCard['rarity'], number> = {
  common: 1,
  rare: 2,
  unique: 5,
};

// 1 point par séance de jeu complète
export const SESSION_POINT_VALUE = 1;

// Seuils des 5 paliers (pts minimum pour atteindre le palier)
export const HEAT_THRESHOLDS: Record<HeatLevel, number> = {
  1: 0,
  2: 12,
  3: 40,
  4: 80,
  5: 130,
};

/**
 * Tableau de référence : total de points maximum qu'un module peut rapporter
 * (MODULE_POINTS + CARD_POINTS × cartes données par ce module selon modules.ts).
 *
 * module-de-base      : 3 + 24×1 = 27 pts  (deck starter 24 common)
 * porno-vs-realite    : 2 +  1×1 =  3 pts
 * quiz-consentement   : 2 +  1×1 =  3 pts
 * loi-consentement    : 5 +  1×2 =  7 pts  (1 rare)
 * duo-flow            : 5 +  1×2 =  7 pts  (1 rare)
 * accompagnement-mineur: 5 + 1×2 =  7 pts  (1 rare)
 * module-pratiques-adultes: 10 + 1×5 = 15 pts (1 unique)
 * quiz-d1/d2/d3       : 2 +  1×1 =  3 pts  chacun
 * quiz-i1/i2/i3       : 4 +  1×2 =  6 pts  chacun
 * quiz-e1/e2/e3       : 8 +  1×5 = 13 pts  chacun
 *
 * Bonus profil max    : 3 (confort) + 3 (safeword) + 2 (pronoms) = 8 pts
 */

export interface HeatBreakdown {
  modules: number;
  cards: number;
  sessions: number;
  profile: number;      // safeword + pronoms + confort (max 8 pts)
  lexique: number;      // mots de lexique débloqués (+1 pt / mot)
  preferences: number;  // réponses préférences données (+1 pt / réponse)
}

export function computeHeatBreakdown(input: HeatInput): HeatBreakdown {
  const modules = input.completedModules.reduce((sum, id) => {
    return sum + (MODULE_POINTS[id as EffectiveModuleId] ?? 0);
  }, 0);

  const cards = input.ownedCards.reduce((sum, card) => {
    return sum + (CARD_POINTS[card.rarity] ?? 0);
  }, 0);

  const sessions = input.sessionCount * SESSION_POINT_VALUE;

  const profile =
    (input.profileComfortCategories ?? 0) +
    (input.safewordDefined ? 3 : 0) +
    (input.pronounsDefined ? 2 : 0);

  const lexique = input.lexiqueWords ?? 0;
  const preferences = input.preferencesAnswered ?? 0;

  return { modules, cards, sessions, profile, lexique, preferences };
}

export function computeHeatPoints(input: HeatInput): number {
  const { modules, cards, sessions, profile, lexique, preferences } = computeHeatBreakdown(input);
  return modules + cards + sessions + profile + lexique + preferences;
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
