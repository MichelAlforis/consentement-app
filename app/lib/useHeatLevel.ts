'use client';

import { useMemo } from 'react';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { useUnlockStore } from '../stores/unlockStore';
import { useProfileStore } from '../stores/profileStore';
import { useAuthStore } from '../stores/authStore';
import {
  computeHeatBreakdown,
  computeHeatPoints,
  getHeatLevel,
  heatLevelProgress,
  pointsToNextLevel,
} from './heatLevel';
import type { HeatBreakdown, HeatLevel } from './heatLevel';

export interface HeatState {
  points: number;
  level: HeatLevel;
  /** Progression 0–1 dans le palier actuel */
  progress: number;
  /** Points manquants pour le prochain palier, null si max */
  toNext: number | null;
  /** Détail des sources de points */
  breakdown: HeatBreakdown;
}

export function useHeatLevel(): HeatState {
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  const ownedCards = useUnlockStore((s) => s.ownedCards);
  const sessionCount = useUnlockStore((s) => s.sessionCount);
  const personalProfile = useProfileStore((s) => s.personalProfile);
  const pronouns = useAuthStore((s) => s.pronouns);

  const profileComfortCategories = useMemo(() => {
    const { tenderness, intensity, trust } = personalProfile;
    return [tenderness, intensity, trust].filter((cat) => Object.keys(cat).length > 0).length;
  }, [personalProfile]);

  const safewordDefined = personalProfile.safeword.trim() !== '';
  const pronounsDefined = pronouns !== null && pronouns.trim() !== '';

  const input = useMemo(
    () => ({ completedModules, ownedCards, sessionCount, profileComfortCategories, safewordDefined, pronounsDefined }),
    [completedModules, ownedCards, sessionCount, profileComfortCategories, safewordDefined, pronounsDefined]
  );

  const breakdown = useMemo(() => computeHeatBreakdown(input), [input]);
  const points = breakdown.modules + breakdown.cards + breakdown.sessions + breakdown.profile;

  return useMemo(() => ({
    points,
    level: getHeatLevel(points),
    progress: heatLevelProgress(points),
    toNext: pointsToNextLevel(points),
    breakdown,
  }), [points, breakdown]);
}
