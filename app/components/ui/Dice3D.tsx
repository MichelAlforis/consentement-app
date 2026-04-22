'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const SIZE = 100;
const HALF = SIZE / 2;

const FACE_STYLES: Record<number, { gradient: string; border: string; emoji: string; name: string }> = {
  1: { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '#fbbf24', emoji: '🎭', name: 'Osez' },
  2: { gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: '#a78bfa', emoji: '💬', name: 'Parlez' },
  3: { gradient: 'linear-gradient(135deg, #ec4899, #db2777)', border: '#f9a8d4', emoji: '🤔', name: 'Et si…' },
  4: { gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: '#93c5fd', emoji: '🎯', name: 'Défi' },
  5: { gradient: 'linear-gradient(135deg, #10b981, #059669)', border: '#6ee7b7', emoji: '✨', name: 'Vérité' },
  6: { gradient: 'linear-gradient(135deg, #be123c, #9f1239)', border: '#fda4af', emoji: '❤️', name: 'Douceur' },
};

// Rotation du cube [rotateX, rotateY] pour amener chaque face vers le spectateur
const FACE_ROTATIONS: Record<number, [number, number]> = {
  1: [0, 0],
  2: [0, -90],
  3: [90, 0],
  4: [-90, 0],
  5: [0, 90],
  6: [0, 180],
};

const FACE_TRANSFORMS = [
  `translateZ(${HALF}px)`,
  `rotateY(90deg) translateZ(${HALF}px)`,
  `rotateX(-90deg) translateZ(${HALF}px)`,
  `rotateX(90deg) translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateY(180deg) translateZ(${HALF}px)`,
];

function DiceFace({ faceNumber, faceTransform }: { faceNumber: number; faceTransform: string }) {
  const s = FACE_STYLES[faceNumber];
  return (
    <div
      style={{
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        background: s.gradient,
        border: `2px solid ${s.border}`,
        borderRadius: 18,
        transform: faceTransform,
        backfaceVisibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.25), inset 0 -2px 6px rgba(0,0,0,0.15)',
      }}
    >
      <span style={{ fontSize: 34, lineHeight: 1, userSelect: 'none' }}>{s.emoji}</span>
      <span style={{
        fontSize: 9,
        fontWeight: 800,
        color: 'rgba(255,255,255,0.92)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        userSelect: 'none',
      }}>
        {s.name}
      </span>
    </div>
  );
}

interface Dice3DProps {
  targetFace: number;
  isRolling: boolean;
  onRollComplete?: () => void;
}

export function Dice3D({ targetFace, isRolling, onRollComplete }: Dice3DProps) {
  const controls = useAnimation();
  const cumulative = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isRolling) return;

    const [tx, ty] = FACE_ROTATIONS[targetFace];
    const baseX = Math.round(cumulative.current.x / 360) * 360;
    const baseY = Math.round(cumulative.current.y / 360) * 360;
    const finalX = baseX + 1080 + tx;
    const finalY = baseY + 720 + ty;

    cumulative.current = { x: finalX, y: finalY };

    controls.start({
      rotateX: finalX,
      rotateY: finalY,
      transition: { duration: 1.7, ease: [0.22, 0.61, 0.36, 1] },
    }).then(() => onRollComplete?.());
  }, [isRolling, targetFace]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ perspective: 500, width: SIZE, height: SIZE, filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.2))' }}>
      <motion.div
        animate={controls}
        style={{
          width: SIZE,
          height: SIZE,
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((face, i) => (
          <DiceFace key={face} faceNumber={face} faceTransform={FACE_TRANSFORMS[i]} />
        ))}
      </motion.div>
    </div>
  );
}
