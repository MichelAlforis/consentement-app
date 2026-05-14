'use client';

import { useMemo } from 'react';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { useUnlockStore } from '../stores/unlockStore';
import { useProfileStore } from '../stores/profileStore';
import { useAuthStore } from '../stores/authStore';
import { useLexiqueStore } from '../stores/lexiqueStore';
import {
  computeHeatBreakdown,
  getHeatLevel,
  heatLevelProgress,
  pointsToNextLevel,
} from './heatLevel';
import type { HeatBreakdown, HeatLevel } from './heatLevel';

export interface HeatProfileDetails {
  comfortFilled: number; // 0–3
  safewordSet: boolean;
  pronounsSet: boolean;
}

export interface HeatState {
  points: number;
  level: HeatLevel;
  /** Progression 0–1 dans le palier actuel */
  progress: number;
  /** Points manquants pour le prochain palier, null si max */
  toNext: number | null;
  /** Détail des sources de points */
  breakdown: HeatBreakdown;
  /** Statut brut des champs profil — pour les nudges sans re-lire les stores */
  profileDetails: HeatProfileDetails;
}

export function useHeatLevel(): HeatState {
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  const ownedCards = useUnlockStore((s) => s.ownedCards);
  const sessionCount = useUnlockStore((s) => s.sessionCount);
  const personalProfile = useProfileStore((s) => s.personalProfile);
  const pronouns = useAuthStore((s) => s.pronouns);
  const lexiqueWords = useLexiqueStore((s) => s.unlockedIds.length);

  // Toutes les dérivations profil dans un seul useMemo — zéro recalcul parasite
  const profileDetails = useMemo<HeatProfileDetails>(() => {
    const { tenderness, intensity, trust, safeword } = personalProfile;
    return {
      comfortFilled: [tenderness, intensity, trust]
        .filter((cat) => Object.keys(cat).length > 0).length,
      safewordSet: safeword.trim() !== '',
      pronounsSet: pronouns !== null && pronouns.trim() !== '',
    };
  }, [personalProfile, pronouns]);

  const input = useMemo(
    () => ({
      completedModules, ownedCards, sessionCount, lexiqueWords,
      profileComfortCategories: profileDetails.comfortFilled,
      safewordDefined: profileDetails.safewordSet,
      pronounsDefined: profileDetails.pronounsSet,
    }),
    [completedModules, ownedCards, sessionCount, profileDetails, lexiqueWords]
  );

  const breakdown = useMemo(() => computeHeatBreakdown(input), [input]);
  const points = breakdown.modules + breakdown.cards + breakdown.sessions + breakdown.profile + breakdown.lexique;

  return useMemo(() => ({
    points,
    level: getHeatLevel(points),
    progress: heatLevelProgress(points),
    toNext: pointsToNextLevel(points),
    breakdown,
    profileDetails,
  }), [points, breakdown, profileDetails]);
}
