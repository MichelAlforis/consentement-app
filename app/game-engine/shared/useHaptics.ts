'use client';
import { useCallback } from 'react';
import { isCapacitor } from '../../lib/platform';

export function useHaptics() {
  const vibrate = useCallback(async (pattern: number | number[]) => {
    if (isCapacitor()) {
      try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        const duration = Array.isArray(pattern) ? pattern[0] : pattern;
        await Haptics.impact({ style: duration > 100 ? ImpactStyle.Heavy : ImpactStyle.Light });
      } catch { /* plugin non disponible */ }
    } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  return { vibrate };
}
