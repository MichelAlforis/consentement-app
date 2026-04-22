'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const SIZE = 100;
const HALF = SIZE / 2;

// Positions des points (x%, y%) pour chaque face
const DOT_POSITIONS: Record<number, Array<[number, number]>> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]],
};

// Rotation du cube [rotateX, rotateY] pour amener chaque face vers le spectateur
const FACE_ROTATIONS: Record<number, [number, number]> = {
  1: [0, 0],       // face avant
  2: [0, -90],     // face droite
  3: [90, 0],      // face haut
  4: [-90, 0],     // face bas
  5: [0, 90],      // face gauche
  6: [0, 180],     // face arrière
};

// Transforms CSS pour positionner chaque face du cube
const FACE_TRANSFORMS = [
  `translateZ(${HALF}px)`,                   // face 1 — avant
  `rotateY(90deg) translateZ(${HALF}px)`,    // face 2 — droite
  `rotateX(-90deg) translateZ(${HALF}px)`,   // face 3 — haut
  `rotateX(90deg) translateZ(${HALF}px)`,    // face 4 — bas
  `rotateY(-90deg) translateZ(${HALF}px)`,   // face 5 — gauche
  `rotateY(180deg) translateZ(${HALF}px)`,   // face 6 — arrière
];

function DiceFace({ value, faceTransform }: { value: number; faceTransform: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 100%)',
        border: '2px solid #fde68a',
        borderRadius: 18,
        transform: faceTransform,
        backfaceVisibility: 'hidden',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06), inset 0 -2px 4px rgba(0,0,0,0.04)',
      }}
    >
      {DOT_POSITIONS[value].map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 11,
            height: 11,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #fbbf24, #d97706)',
            top: `${y}%`,
            left: `${x}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 1px 4px rgba(217, 119, 6, 0.5)',
          }}
        />
      ))}
    </div>
  );
}

interface Dice3DProps {
  targetFace: number;
  isRolling: boolean;
  onRollComplete?: () => void;
  size?: number;
}

export function Dice3D({ targetFace, isRolling, onRollComplete }: Dice3DProps) {
  const controls = useAnimation();
  const cumulative = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isRolling) return;

    const [tx, ty] = FACE_ROTATIONS[targetFace];

    // Aligner sur le multiple de 360 le plus proche, puis ajouter des tours complets + cible
    const baseX = Math.round(cumulative.current.x / 360) * 360;
    const baseY = Math.round(cumulative.current.y / 360) * 360;
    const finalX = baseX + 1080 + tx; // 3 tours complets
    const finalY = baseY + 720 + ty;  // 2 tours complets

    cumulative.current = { x: finalX, y: finalY };

    controls.start({
      rotateX: finalX,
      rotateY: finalY,
      transition: {
        duration: 1.7,
        ease: [0.22, 0.61, 0.36, 1],
      },
    }).then(() => onRollComplete?.());
  }, [isRolling, targetFace]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ perspective: 500, width: SIZE, height: SIZE }}>
      <motion.div
        animate={controls}
        style={{
          width: SIZE,
          height: SIZE,
          position: 'relative',
          transformStyle: 'preserve-3d',
          // Ombre portée sous le cube
          filter: 'drop-shadow(0 12px 20px rgba(245,158,11,0.25))',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((face, i) => (
          <DiceFace key={face} value={face} faceTransform={FACE_TRANSFORMS[i]} />
        ))}
      </motion.div>
    </div>
  );
}
