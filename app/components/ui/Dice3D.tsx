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
        WebkitBackfaceVisibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.3), inset 0 -3px 8px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Highlight spéculaire — simule une source lumineuse en haut à gauche */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 17,
        background: 'radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.38) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />
      <span style={{ fontSize: 34, lineHeight: 1, userSelect: 'none', position: 'relative' }}>{s.emoji}</span>
      <span style={{
        fontSize: 9,
        fontWeight: 800,
        color: 'rgba(255,255,255,0.92)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        userSelect: 'none',
        position: 'relative',
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
  const cubeControls = useAnimation();
  const wrapControls = useAnimation();
  const cumulative = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isRolling) return;

    const [tx, ty] = FACE_ROTATIONS[targetFace] ?? [0, 0];
    const baseX = Math.round(cumulative.current.x / 360) * 360;
    const baseY = Math.round(cumulative.current.y / 360) * 360;
    const finalX = baseX + 1080 + tx;
    const finalY = baseY + 720 + ty;
    // Instabilité Z aléatoire ±5° — revient à 0 en fin d'animation
    const zWobble = (Math.random() - 0.5) * 10;
    cumulative.current = { x: finalX, y: finalY };

    cubeControls.start({
      rotateX: finalX,
      rotateY: finalY,
      rotateZ: [0, zWobble, -zWobble * 0.6, zWobble * 0.25, 0],
      transition: { duration: 1.7, ease: [0.22, 0.61, 0.36, 1] },
    }).then(() => {
      onRollComplete?.();
      // Shake + micro-rebond à l'atterrissage (cosmétique, non-bloquant)
      wrapControls.start({
        x: [0, -4, 4, -2, 2, 0],
        scale: [1, 1.05, 0.97, 1.02, 0.99, 1],
        transition: { duration: 0.35, ease: 'easeOut' },
      });
    });
  }, [isRolling, targetFace]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
      {/* Ombre portée — se comprime pendant le vol, s'étale à l'atterrissage */}
      <motion.div
        animate={{ scaleY: isRolling ? 0.45 : 1, opacity: isRolling ? 0.28 : 0.55 }}
        transition={{ duration: 1.5, ease: [0.22, 0.61, 0.36, 1] }}
        style={{
          position: 'absolute',
          bottom: -9,
          left: '15%',
          right: '15%',
          height: 9,
          background: 'rgba(0,0,0,0.45)',
          borderRadius: '50%',
          filter: 'blur(5px)',
          transformOrigin: 'center bottom',
        }}
      />

      {/* Wrapper — reçoit le shake/scale post-atterrissage */}
      <motion.div animate={wrapControls}>
        {/* drop-shadow sur le conteneur extérieur — jamais sur preserve-3d */}
        <div style={{ perspective: 500, width: SIZE, height: SIZE, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))' }}>
          <motion.div
            animate={cubeControls}
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
      </motion.div>
    </div>
  );
}
