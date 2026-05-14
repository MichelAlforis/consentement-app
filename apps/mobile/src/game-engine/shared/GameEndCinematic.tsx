import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

// V4 divergence: framer-motion → MotiView, Canvas R3F → version CSS-RN animée
// drei Sparkles non disponible sur RN → orbes + étincelles MotiView

type Intensity = 'low' | 'medium' | 'high';

const INTENSITY = {
  low:    { sparks: 16, secondarySparks: 0,  orbCount: 2, speed: 1.0, amp: 0.22 },
  medium: { sparks: 24, secondarySparks: 8,  orbCount: 3, speed: 1.5, amp: 0.32 },
  high:   { sparks: 36, secondarySparks: 14, orbCount: 4, speed: 2.2, amp: 0.44 },
};

const ORB_BASE = [
  { x: 28, y: 36 },
  { x: 72, y: 63 },
  { x: 37, y: 67 },
  { x: 66, y: 27 },
] as const;

function makeLCG(seed: number) {
  let s = seed | 0;
  return () => { s = (s * 1664525 + 1013904223) | 0; return (s >>> 0) / 0xffffffff; };
}

interface SparkSpec { id: number; x: number; y: number; size: number; delay: number; dur: number }

function buildSparks(count: number, seed: number): SparkSpec[] {
  const r = makeLCG(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x:    Math.round(r() * 90 + 5),
    y:    Math.round(r() * 86 + 7),
    size: 1 + Math.round(r() * 2.5),
    delay: Math.round(r() * 30) / 10,
    dur:  1.5 + Math.round(r() * 20) / 10,
  }));
}

const CSS_SPARKS = {
  low:    buildSparks(16, 42),
  medium: buildSparks(24, 137),
  high:   buildSparks(36, 999),
};
const CSS_SECONDARY_SPARKS = {
  low:    [] as SparkSpec[],
  medium: buildSparks(8, 17),
  high:   buildSparks(14, 77),
};

export interface GameEndCinematicProps {
  primaryColor: string;
  secondaryColor: string;
  intensity?: Intensity;
  darkOverlay?: boolean;
}

export function GameEndCinematic({
  primaryColor,
  secondaryColor,
  intensity = 'medium',
  darkOverlay = false,
}: GameEndCinematicProps) {
  const cfg = INTENSITY[intensity];
  const sparks = CSS_SPARKS[intensity];
  const sparks2 = CSS_SECONDARY_SPARKS[intensity];
  const orbs = useMemo(() => ORB_BASE.slice(0, cfg.orbCount), [cfg.orbCount]);
  const blobDur = parseFloat((3 / cfg.speed).toFixed(2)) * 1000;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {darkOverlay && (
        <View style={[StyleSheet.absoluteFillObject, styles.darkOverlay]} />
      )}

      {/* Blob central */}
      <MotiView
        from={{ scale: 0.88, opacity: 0.07 }}
        animate={{ scale: [0.88, 1.18, 0.88], opacity: [0.07, 0.17, 0.07] }}
        transition={{ type: 'timing', duration: blobDur, loop: true }}
        style={[
          styles.blob,
          { backgroundColor: primaryColor },
        ]}
      />

      {/* Orbes flottants */}
      {orbs.map((orb, i) => {
        const color = i % 2 === 0 ? primaryColor : secondaryColor;
        const orbSize = 10 + (i % 3) * 6;
        return (
          <MotiView
            key={i}
            from={{ translateY: -14 }}
            animate={{ translateY: ['-14', '14', '-14'] as unknown as number[] }}
            transition={{ type: 'timing', duration: (1800 + i * 500), loop: true, delay: i * 450 }}
            style={[
              styles.orb,
              {
                left: `${orb.x}%` as unknown as number,
                top: `${orb.y}%` as unknown as number,
                width: orbSize,
                height: orbSize,
                borderRadius: orbSize / 2,
                backgroundColor: color,
              },
            ]}
          />
        );
      })}

      {/* Étincelles primaires */}
      {sparks.map(p => (
        <MotiView
          key={p.id}
          from={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.1, 0.3] }}
          transition={{ type: 'timing', duration: p.dur * 1000, loop: true, delay: p.delay * 1000 }}
          style={[
            styles.spark,
            {
              left: `${p.x}%` as unknown as number,
              top: `${p.y}%` as unknown as number,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: primaryColor,
            },
          ]}
        />
      ))}

      {/* Étincelles secondaires */}
      {sparks2.map(p => (
        <MotiView
          key={p.id}
          from={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1, 0.3] }}
          transition={{ type: 'timing', duration: p.dur * 1000, loop: true, delay: (p.delay + 0.35) * 1000 }}
          style={[
            styles.spark,
            {
              left: `${p.x}%` as unknown as number,
              top: `${p.y}%` as unknown as number,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: secondaryColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  darkOverlay: {
    backgroundColor: 'rgba(10,5,20,0.74)',
  },
  blob: {
    position: 'absolute',
    left: '14%',
    top: '16%',
    right: '14%',
    bottom: '16%',
    borderRadius: 9999,
    opacity: 0.1,
  } as object,
  orb: {
    position: 'absolute',
    transform: [{ translateX: -7 }, { translateY: -7 }],
  },
  spark: {
    position: 'absolute',
  },
});
