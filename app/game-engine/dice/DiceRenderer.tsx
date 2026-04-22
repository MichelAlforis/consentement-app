'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ShimmerLayer } from '../../components/ui/ThemeEffects';
import type { DiceConfig, DiceFace } from './types';

// ─── 6-face 3D cube ───────────────────────────────────────────────────────────

const HALF = 50;

const FACE_TRANSFORMS_6 = [
  `translateZ(${HALF}px)`,
  `rotateY(90deg) translateZ(${HALF}px)`,
  `rotateX(-90deg) translateZ(${HALF}px)`,
  `rotateX(90deg) translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateY(180deg) translateZ(${HALF}px)`,
];

const FACE_ROTATIONS_6: [number, number][] = [
  [0, 0], [0, -90], [90, 0], [-90, 0], [0, 90], [0, 180],
];

function CubeFace({ face, transform }: { face: DiceFace; transform: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: 100,
        height: 100,
        background: face.gradient,
        border: `2px solid ${face.border}`,
        borderRadius: 18,
        transform,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.25), inset 0 -2px 6px rgba(0,0,0,0.15)',
      }}
    >
      <span style={{ fontSize: 34, lineHeight: 1, userSelect: 'none' }}>{face.emoji}</span>
      <span style={{
        fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.92)',
        textTransform: 'uppercase', letterSpacing: '0.1em', userSelect: 'none',
      }}>
        {face.label}
      </span>
    </div>
  );
}

function Cube6({
  faces, targetFaceIndex, isRolling, onRollComplete,
}: {
  faces: DiceFace[];
  targetFaceIndex: number;
  isRolling: boolean;
  onRollComplete?: () => void;
}) {
  const theme = useTheme();
  const controls = useAnimation();
  const cumulative = useRef({ x: 0, y: 0 });
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (!isRolling) return;
    setLanded(false);
    const [tx, ty] = FACE_ROTATIONS_6[targetFaceIndex] ?? [0, 0];
    const baseX = Math.round(cumulative.current.x / 360) * 360;
    const baseY = Math.round(cumulative.current.y / 360) * 360;
    const finalX = baseX + 1080 + tx;
    const finalY = baseY + 720 + ty;
    cumulative.current = { x: finalX, y: finalY };
    controls.start({
      rotateX: finalX,
      rotateY: finalY,
      transition: { duration: 1.7, ease: [0.22, 0.61, 0.36, 1] },
    }).then(() => {
      setLanded(true);
      onRollComplete?.();
    });
  }, [isRolling, targetFaceIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const glowColor = theme.effects.cardGlow ?? theme.effects.shimmerColor;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Glow anneau thème — visible après l'atterrissage */}
      <AnimatePresence>
        {landed && glowColor && glowColor !== 'transparent' && (
          <motion.div
            key="glow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: 26,
              background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 72%)`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      <div style={{ perspective: 500, width: 100, height: 100, filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.25))', position: 'relative', zIndex: 1 }}>
        <motion.div
          animate={controls}
          style={{ width: 100, height: 100, position: 'relative', transformStyle: 'preserve-3d' }}
        >
          {faces.map((face, i) => (
            <CubeFace key={face.id} face={face} transform={FACE_TRANSFORMS_6[i]} />
          ))}
        </motion.div>
      </div>

      {/* Shimmer thème sur la face avant — uniquement quand posé */}
      {theme.effects.shimmer && landed && (
        <div style={{ position: 'absolute', inset: 0, borderRadius: 18, zIndex: 2, overflow: 'hidden', pointerEvents: 'none' }}>
          <ShimmerLayer color={theme.effects.shimmerColor} />
        </div>
      )}
    </div>
  );
}

// ─── Fallback 2D — flip de tuile pour N ≠ 6 faces ───────────────────────────

const TILE_BACK_GRADIENT = 'linear-gradient(135deg, #1e1b2e 0%, #2d2640 100%)';
const TILE_BACK_BORDER   = 'rgba(255,255,255,0.12)';

function FlatTile({
  face, isRolling, onRollComplete,
}: {
  face: DiceFace;
  isRolling: boolean;
  onRollComplete?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onRollComplete);
  useEffect(() => { onCompleteRef.current = onRollComplete; });

  // Quand isRolling passe à true : retourner sur le dos, puis revenir sur la face
  useEffect(() => {
    if (!isRolling) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlipped(false); // dos visible au lancer
    // Après la durée d'animation, montrer la face et signaler la fin
    timerRef.current = setTimeout(() => {
      setFlipped(true);
      onCompleteRef.current?.();
    }, 1500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isRolling]);

  return (
    <div style={{ perspective: 600, width: 100, height: 100 }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          width: '100%', height: '100%',
          position: 'relative', transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.25))',
        }}
      >
        {/* Dos */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 18,
          background: TILE_BACK_GRADIENT, border: `2px solid ${TILE_BACK_BORDER}`,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 28, opacity: 0.4 }}>🎲</span>
        </div>
        {/* Face */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 18,
          background: face.gradient, border: `2px solid ${face.border}`,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 3,
          boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.25)',
        }}>
          <span style={{ fontSize: 34, lineHeight: 1, userSelect: 'none' }}>{face.emoji}</span>
          <span style={{
            fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.92)',
            textTransform: 'uppercase', letterSpacing: '0.1em', userSelect: 'none',
          }}>
            {face.label}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── DiceRenderer ─────────────────────────────────────────────────────────────

export interface DiceRendererProps {
  config: DiceConfig;
  currentFace: DiceFace | null;
  isRolling: boolean;
  onRollComplete?: () => void;
}

export function DiceRenderer({ config, currentFace, isRolling, onRollComplete }: DiceRendererProps) {
  const { faces } = config;
  const displayFace = currentFace ?? faces[0];
  const targetIndex = currentFace ? faces.findIndex(f => f.id === currentFace.id) : 0;

  if (faces.length === 6) {
    return (
      <Cube6
        faces={faces}
        targetFaceIndex={Math.max(0, targetIndex)}
        isRolling={isRolling}
        onRollComplete={onRollComplete}
      />
    );
  }

  return (
    <FlatTile
      face={displayFace}
      isRolling={isRolling}
      onRollComplete={onRollComplete}
    />
  );
}
