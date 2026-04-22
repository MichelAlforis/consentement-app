import { isCapacitor } from '../../../lib/platform';

export async function vibrate(pattern: number | number[]) {
  if (isCapacitor()) {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      const duration = Array.isArray(pattern) ? pattern[0] : pattern;
      await Haptics.impact({ style: duration > 100 ? ImpactStyle.Heavy : ImpactStyle.Light });
    } catch { /* plugin non disponible */ }
  } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

export const ZONE_BG = [
  'linear-gradient(180deg, #082920 0%, #080f1f 100%)',  // 🌱 Découverte
  'linear-gradient(180deg, #0a1e3d 0%, #060e1f 100%)',  // 🌊 Intimité
  'linear-gradient(180deg, #1a0836 0%, #070512 100%)',  // ✨ Connexion
];
