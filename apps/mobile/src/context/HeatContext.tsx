import { useMemo } from 'react';
import {
  useModuleProgressStore,
  useUnlockStore,
  useProfileStore,
  useAuthStore,
  useLexiqueStore,
  usePreferencesStore,
  computeHeatBreakdown,
  getHeatLevel,
  heatLevelProgress,
  pointsToNextLevel,
  type HeatLevel,
  type HeatBreakdown,
} from '@ouiclair/core';

export interface HeatState {
  points: number;
  level: HeatLevel;
  progress: number;
  toNext: number | null;
  breakdown: HeatBreakdown;
}

export function useHeat(): HeatState {
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  const ownedCards = useUnlockStore((s) => s.ownedCards);
  const sessionCount = useUnlockStore((s) => s.sessionCount);
  const personalProfile = useProfileStore((s) => s.personalProfile);
  const pronouns = useAuthStore((s) => s.pronouns);
  const lexiqueWords = useLexiqueStore((s) => s.unlockedIds.length);
  const preferencesAnswered = usePreferencesStore((s) => Object.keys(s.answers).length);

  const input = useMemo(() => {
    const { tenderness, intensity, trust, safeword } = personalProfile;
    const comfortFilled = [tenderness, intensity, trust]
      .filter((cat) => Object.keys(cat).length > 0).length;
    return {
      completedModules,
      ownedCards,
      sessionCount,
      lexiqueWords,
      profileComfortCategories: comfortFilled,
      safewordDefined: safeword.trim() !== '',
      pronounsDefined: pronouns !== null && (pronouns ?? '').trim() !== '',
      preferencesAnswered,
    };
  }, [completedModules, ownedCards, sessionCount, personalProfile, pronouns, lexiqueWords, preferencesAnswered]);

  const breakdown = useMemo(() => computeHeatBreakdown(input), [input]);
  const points =
    breakdown.modules + breakdown.cards + breakdown.sessions +
    breakdown.profile + breakdown.lexique + breakdown.preferences;

  return useMemo(() => ({
    points,
    level: getHeatLevel(points),
    progress: heatLevelProgress(points),
    toNext: pointsToNextLevel(points),
    breakdown,
  }), [points, breakdown]);
}
