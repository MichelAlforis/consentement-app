'use client';
import { useCallback } from 'react';
import { isCapacitor } from '../../lib/platform';

type HapticPattern = number | number[] | 'light' | 'medium' | 'heavy';

export function useHaptics() {
  const vibrate = useCallback(async (pattern: HapticPattern) => {
    if (isCapacitor()) {
      try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        if (pattern === 'light')  { await Haptics.impact({ style: ImpactStyle.Light });  return; }
        if (pattern === 'medium') { await Haptics.impact({ style: ImpactStyle.Medium }); return; }
        if (pattern === 'heavy')  { await Haptics.impact({ style: ImpactStyle.Heavy });  return; }
        const duration = Array.isArray(pattern) ? pattern[0] : pattern;
        await Haptics.impact({ style: duration > 100 ? ImpactStyle.Heavy : ImpactStyle.Light });
      } catch { /* plugin non disponible */ }
    } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (pattern === 'light')  { navigator.vibrate(20);  return; }
      if (pattern === 'medium') { navigator.vibrate(60);  return; }
      if (pattern === 'heavy')  { navigator.vibrate(150); return; }
      navigator.vibrate(pattern as number | number[]);
    }
  }, []);

  return { vibrate };
}
