import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

// V4 divergence: expo-haptics remplace navigator.vibrate (pas de browser API en RN)
type HapticPattern = number | number[] | 'light' | 'medium' | 'heavy';

export function useHaptics() {
  const vibrate = useCallback(async (pattern: HapticPattern) => {
    try {
      if (pattern === 'light') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }
      if (pattern === 'medium') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      }
      if (pattern === 'heavy') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        return;
      }
      const duration = Array.isArray(pattern) ? pattern[0] : pattern;
      await Haptics.impactAsync(
        duration > 100
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Light,
      );
    } catch { /* plugin non disponible */ }
  }, []);

  return { vibrate };
}
