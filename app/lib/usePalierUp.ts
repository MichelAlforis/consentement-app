'use client';

import { useEffect, useRef, useState } from 'react';
import type { HeatLevel } from './heatLevel';

export function usePalierUp(level: HeatLevel) {
  const prevLevel = useRef<HeatLevel>(level);
  const [justUnlocked, setJustUnlocked] = useState<HeatLevel | null>(null);

  useEffect(() => {
    if (level > prevLevel.current) {
      setJustUnlocked(level);
    }
    prevLevel.current = level;
  }, [level]);

  return {
    justUnlocked,
    clear: () => setJustUnlocked(null),
  };
}
