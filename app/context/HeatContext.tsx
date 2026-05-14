'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useHeatLevel } from '../lib/useHeatLevel';
import type { HeatState } from '../lib/useHeatLevel';

const defaultHeat: HeatState = {
  points: 0, level: 1, progress: 0, toNext: 12,
  breakdown: { modules: 0, cards: 0, sessions: 0, profile: 0, lexique: 0, preferences: 0 },
  profileDetails: { comfortFilled: 0, safewordSet: false, pronounsSet: false },
};

const HeatContext = createContext<HeatState>(defaultHeat);

export function HeatProvider({ children }: { children: ReactNode }) {
  const heat = useHeatLevel();
  return <HeatContext.Provider value={heat}>{children}</HeatContext.Provider>;
}

/** Accès au baromètre du Hot depuis n'importe quel composant. */
export function useHeat(): HeatState {
  return useContext(HeatContext);
}
