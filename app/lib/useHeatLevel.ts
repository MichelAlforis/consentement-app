'use client';

import { useMemo } from 'react';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { useUnlockStore } from '../stores/unlockStore';
import {
  computeHeatPoints,
  getHeatLevel,
  heatLevelProgress,
  pointsToNextLevel,
} from './heatLevel';
import type { HeatLevel } from './heatLevel';

export interface HeatState {
  points: number;
  level: HeatLevel;
  /** Progression 0–1 dans le palier actuel */
  progress: number;
  /** Points manquants pour le prochain palier, null si max */
  toNext: number | null;
}

export function useHeatLevel(): HeatState {
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  const ownedCards = useUnlockStore((s) => s.ownedCards);
  const sessionCount = useUnlockStore((s) => s.sessionCount);

  const points = useMemo(
    () => computeHeatPoints({ completedModules, ownedCards, sessionCount }),
    [completedModules, ownedCards, sessionCount]
  );

  return useMemo(() => ({
    points,
    level: getHeatLevel(points),
    progress: heatLevelProgress(points),
    toNext: pointsToNextLevel(points),
  }), [points]);
}
