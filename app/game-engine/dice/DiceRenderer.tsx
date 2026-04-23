'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Dices } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ShimmerLayer } from '../../components/ui/ThemeEffects';
import { DiceCanvas } from './DiceCanvas';
import { DynamicIcon } from '../../utils/iconFromName';
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
      <span style={{ lineHeight: 1, userSelect: 'none', position: 'relative' }}><DynamicIcon name={face.iconName} size={34} color="rgba(255,255,255,0.92)" /></span>
      <span style={{
        fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.92)',
        textTransform: 'uppercase', letterSpacing: '0.1em', userSelect: 'none', position: 'relative',
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
  const cubeControls = useAnimation();
  const wrapControls = useAnimation();
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
    // Instabilité Z aléatoire ±5° — revient à 0 en fin d'animation
    const zWobble = (Math.random() - 0.5) * 10;
    cumulative.current = { x: finalX, y: finalY };
    cubeControls.start({
      rotateX: finalX,
      rotateY: finalY,
      rotateZ: [0, zWobble, -zWobble * 0.6, zWobble * 0.25, 0],
      transition: { duration: 1.7, ease: [0.22, 0.61, 0.36, 1] },
    }).then(() => {
      setLanded(true);
      onRollComplete?.();
      // Shake + micro-rebond à l'atterrissage (cosmétique, non-bloquant)
      wrapControls.start({
        x: [0, -4, 4, -2, 2, 0],
        scale: [1, 1.05, 0.97, 1.02, 0.99, 1],
        transition: { duration: 0.35, ease: 'easeOut' },
      });
    });
  }, [isRolling, targetFaceIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const glowColor = theme.effects.cardGlow ?? theme.effects.shimmerColor;

  return (
    <div style={{ position: 'relative', width: 100, height: 100 }}>
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

      {/* Wrapper — reçoit le shake/scale post-atterrissage */}
      <motion.div animate={wrapControls} style={{ position: 'relative', zIndex: 1 }}>
        {/* drop-shadow sur le conteneur extérieur — jamais sur preserve-3d */}
        <div style={{ perspective: 500, width: 100, height: 100, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))' }}>
          <motion.div
            animate={cubeControls}
            style={{ width: 100, height: 100, position: 'relative', transformStyle: 'preserve-3d' }}
          >
            {faces.map((face, i) => (
              <CubeFace key={face.id} face={face} transform={FACE_TRANSFORMS_6[i]} />
            ))}
          </motion.div>
        </div>
      </motion.div>

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
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))',
        }}
      >
        {/* Dos */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 18,
          background: TILE_BACK_GRADIENT, border: `2px solid ${TILE_BACK_BORDER}`,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Dices size={28} color="rgba(255,255,255,0.4)" />
        </div>
        {/* Face */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 18,
          background: face.gradient, border: `2px solid ${face.border}`,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 3,
          boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.3)',
          overflow: 'hidden',
        }}>
          {/* Highlight spéculaire */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 17,
            background: 'radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.38) 0%, transparent 55%)',
            pointerEvents: 'none',
          }} />
          <span style={{ lineHeight: 1, userSelect: 'none', position: 'relative' }}><DynamicIcon name={face.iconName} size={34} color="rgba(255,255,255,0.92)" /></span>
          <span style={{
            fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.92)',
            textTransform: 'uppercase', letterSpacing: '0.1em', userSelect: 'none', position: 'relative',
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
  /** 'css' (défaut) : cube CSS 3D Level 1 | 'webgl' : R3F PBR */
  renderer?: 'css' | 'webgl';
  size?: number;
}

export function DiceRenderer({ config, currentFace, isRolling, onRollComplete, renderer = 'css', size }: DiceRendererProps) {
  if (renderer === 'webgl') {
    return (
      <DiceCanvas
        config={config}
        currentFace={currentFace}
        isRolling={isRolling}
        onRollComplete={onRollComplete}
        size={size ?? 200}
      />
    );
  }

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
