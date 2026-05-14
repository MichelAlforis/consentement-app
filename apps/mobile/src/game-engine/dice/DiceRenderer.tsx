// V4 divergence: framer-motion → MotiView, className → StyleSheet RN
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Dices } from 'lucide-react-native';
import { DiceCanvas } from './DiceCanvas.native';
import type { DiceConfig, DiceFace } from './types';

// ─── 6-face CSS 3D — non disponible sur RN ────────────────────────────────────
// RN n'a pas de perspective CSS + transformStyle preserve-3d.
// DiceCanvas (R3F) est utilisé à la place pour le mode webgl.
// FlatTile est le fallback 2D pour N ≠ 6 faces.

const TILE_BACK_BG = '#1e1b2e';
const TILE_BACK_BORDER = 'rgba(255,255,255,0.12)';

function FlatTile({
  face,
  isRolling,
  onRollComplete,
}: {
  face: DiceFace;
  isRolling: boolean;
  onRollComplete?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onRollComplete);
  useEffect(() => { onCompleteRef.current = onRollComplete; });

  useEffect(() => {
    if (!isRolling) return;
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
    setFlipped(false);
    showTimerRef.current = setTimeout(() => {
      setFlipped(true);
      doneTimerRef.current = setTimeout(() => onCompleteRef.current?.(), 560);
    }, 1200);
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
    };
  }, [isRolling]);

  return (
    <View style={styles.flatTileContainer}>
      <MotiView
        animate={{ rotateY: flipped ? '180deg' : '0deg' }}
        transition={{ type: 'timing', duration: 550 }}
        style={styles.flatTileInner}
      >
        {!flipped ? (
          <View style={[styles.flatTileSide, { backgroundColor: TILE_BACK_BG, borderColor: TILE_BACK_BORDER }]}>
            <Dices size={28} color="rgba(255,255,255,0.4)" />
          </View>
        ) : (
          <View style={[styles.flatTileSide, { backgroundColor: face.color, borderColor: face.border }]}>
            <Text style={styles.flatTileLabel}>{face.label}</Text>
          </View>
        )}
      </MotiView>
    </View>
  );
}

// ─── DiceRenderer ─────────────────────────────────────────────────────────────

export interface DiceRendererProps {
  config: DiceConfig;
  currentFace: DiceFace | null;
  isRolling: boolean;
  onRollComplete?: () => void;
  /** 'webgl' (défaut) : R3F PBR | 'css' ignoré sur RN → fallback FlatTile */
  renderer?: 'css' | 'webgl';
  size?: number;
  /** 'category' (défaut) | 'numeric' */
  mode?: 'category' | 'numeric';
}

export function DiceRenderer({
  config,
  currentFace,
  isRolling,
  onRollComplete,
  renderer = 'webgl',
  size = 180,
  mode = 'category',
}: DiceRendererProps) {
  if (renderer === 'webgl') {
    return (
      <DiceCanvas
        config={config}
        currentFace={currentFace}
        isRolling={isRolling}
        onRollComplete={onRollComplete}
        size={size}
        mode={mode}
      />
    );
  }

  const { faces } = config;
  const displayFace = currentFace ?? faces[0];

  return (
    <AnimatePresence>
      <FlatTile
        face={displayFace}
        isRolling={isRolling}
        onRollComplete={onRollComplete}
      />
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
  flatTileContainer: {
    width: 100,
    height: 100,
  },
  flatTileInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  flatTileSide: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flatTileLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.92)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
