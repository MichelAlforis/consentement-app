'use client';
import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrthographicCamera, ContactShadows, Html, RoundedBox, Environment, Billboard, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { BOARD, BOARD_LAYOUT, getSquareBg, getSquareIconName, SQUARE_VISUAL } from '../../../../data/goose-game';
import type { SquareType } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';

// ─── CSS constants ────────────────────────────────────────────────────────────

const ISO_TRANSFORM = 'rotateX(58deg) rotateZ(45deg) scale(0.78)';
const CELL_H   = 68;
const CELL_GAP = 5;
const PAWN_SIZE = 75;
const ROWS = BOARD_LAYOUT.length;

// ─── R3F constants ────────────────────────────────────────────────────────────

const CELL_S   = 1.0;   // cell size (world units)
const CELL_H3  = 0.14;  // cell box height (thin → plus à plat)
const GAP_3    = 0.12;  // gap between cells
const STEP_3   = CELL_S + GAP_3;
const BASE_H   = 0.18;  // mahogany base height
const BASE_PAD = 0.28;  // base extends beyond cells
const CANVAS_H = 660;   // canvas px height

const CAM_DIST = 20;
const CAM_ELEV = (40 * Math.PI) / 180;
// Azimut 0° : caméra centrée sur l'axe Z. Le losange vient du group rotation Y=45° sur le plateau.
const CAM_POS: [number, number, number] = [
  0,
  CAM_DIST * Math.sin(CAM_ELEV),
  CAM_DIST * Math.cos(CAM_ELEV),
];

const SQUARE_COLOR: Record<SquareType, string> = {
  depart:     '#4ade80',
  normal:     '#7a6248', // fallback only — normal squares use DICE_FACE_COLOR by face
  chance:     '#fbbf24',
  pause:      '#f87171',
  accord:     '#60a5fa',
  complicite: '#c084fc',
  arrivee:    '#34d399',
};

// Couleurs des cases normales par face de dé — miroir de DICE_CATEGORIES.gradient (couleur de départ)
const DICE_FACE_COLOR: Record<number, string> = {
  1: '#f59e0b', // Osez — amber
  2: '#8b5cf6', // Parlez — violet
  3: '#ec4899', // Et si… — rose
  4: '#3b82f6', // Défi — bleu
  5: '#10b981', // Vérité — vert
  6: '#be123c', // Douceur — rouge
};

function getSquareColor3D(square: { type: SquareType; face?: number }): string {
  if (square.type === 'normal' && square.face) return DICE_FACE_COLOR[square.face] ?? '#7a6248';
  return SQUARE_COLOR[square.type];
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function getLayoutPos(idx: number) {
  for (let r = 0; r < BOARD_LAYOUT.length; r++) {
    const c = BOARD_LAYOUT[r].indexOf(idx);
    if (c !== -1) return { row: r, col: c };
  }
  return { row: 0, col: 0 };
}

function cellCenter(idx: number, cellW: number) {
  const { row, col } = getLayoutPos(idx);
  const renderedRow = ROWS - 1 - row;
  return {
    x: col * (cellW + CELL_GAP) + cellW / 2,
    y: renderedRow * (CELL_H + CELL_GAP) + CELL_H / 2,
  };
}

function getCellPos3D(squareIndex: number): [number, number, number] {
  const { row, col } = getLayoutPos(squareIndex);
  const renderedRow = ROWS - 1 - row;
  const totalW = 4 * STEP_3 - GAP_3;
  const totalD = ROWS * STEP_3 - GAP_3;
  return [
    col * STEP_3 - totalW / 2 + CELL_S / 2,
    CELL_H3 / 2,
    renderedRow * STEP_3 - totalD / 2 + CELL_S / 2,
  ];
}

function CameraLookAt() {
  const { camera } = useThree();
  useFrame(() => { camera.lookAt(0, 0, 0); });
  return null;
}

// ─── PawnSvg ──────────────────────────────────────────────────────────────────

function PawnSvg({ emoji, color, pawnId }: { emoji: string; color: string; pawnId: string }) {
  const cylId  = `pc-${pawnId}`;
  const headId = `ph-${pawnId}`;
  const baseId = `pb-${pawnId}`;
  return (
    <svg width={PAWN_SIZE} height={PAWN_SIZE} viewBox="0 0 60 80" style={{ display: 'block' }}>
      <defs>
        {/* Shading cylindrique : sombre gauche → highlight → sombre droite */}
        <linearGradient id={cylId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#000000" stopOpacity="0.55" />
          <stop offset="28%"  stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="52%"  stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
        </linearGradient>
        {/* Base ellipse : sombre au centre → transparent */}
        <radialGradient id={baseId} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#000000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        {/* Tête : highlight haut-gauche */}
        <radialGradient id={headId} cx="36%" cy="32%" r="62%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="45%"  stopColor={color} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Ombre sol */}
      <ellipse cx="30" cy="77" rx="16" ry="3.5" fill="rgba(0,0,0,0.28)" />

      {/* Base — couleur pleine + bord sombre */}
      <ellipse cx="30" cy="65" rx="19" ry="6.5" fill={color} />
      <ellipse cx="30" cy="65" rx="19" ry="6.5" fill={`url(#${baseId})`} />

      {/* Corps trapèze — couleur pleine */}
      <polygon points="11,65 19,30 41,30 49,65" fill={color} />
      {/* Corps trapèze — shading cylindrique par-dessus */}
      <polygon points="11,65 19,30 41,30 49,65" fill={`url(#${cylId})`} />

      {/* Tête sphère */}
      <circle cx="30" cy="22" r="13" fill={`url(#${headId})`} />

      {/* Emoji */}
      <text x="30" y="23" textAnchor="middle" dominantBaseline="middle" fontSize="15">
        {emoji}
      </text>
    </svg>
  );
}

// ─── PawnOverlay ──────────────────────────────────────────────────────────────

function PawnOverlay({ squareIndex, emoji, color, pawnId, cellW, xOffset = 0 }: {
  squareIndex: number;
  emoji: string;
  color: string;
  pawnId: string;
  cellW: number;
  xOffset?: number;
}) {
  const controls = useAnimation();
  const prevIdxRef = useRef(squareIndex);
  const half = PAWN_SIZE / 2;

  const pos = (idx: number, ox: number) => {
    const c = cellCenter(idx, cellW);
    return { x: c.x - half + ox, y: c.y - half };
  };

  // Snap position when cellW changes (resize)
  useEffect(() => {
    const { x, y } = pos(squareIndex, xOffset);
    controls.start({ x, y, transition: { duration: 0 } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellW]);

  // Arc animation on position change
  useEffect(() => {
    if (prevIdxRef.current === squareIndex) return;
    const from = cellCenter(prevIdxRef.current, cellW);
    const to   = cellCenter(squareIndex, cellW);
    prevIdxRef.current = squareIndex;

    const midX = (from.x + to.x) / 2 - half + xOffset;
    const arcY  = Math.min(from.y, to.y) - 55 - half;

    controls.start({
      x: [from.x - half + xOffset, midX, to.x - half + xOffset],
      y: [from.y - half,           arcY,  to.y - half],
      transition: { duration: 0.19, ease: 'easeInOut' },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squareIndex]);

  const init = pos(squareIndex, xOffset);

  return (
    <motion.div
      initial={{ x: init.x, y: init.y }}
      animate={controls}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: PAWN_SIZE,
        height: PAWN_SIZE,
        zIndex: 10,
        pointerEvents: 'none',
        willChange: 'transform',
        z: 50,
      }}
    >
      <PawnSvg emoji={emoji} color={color} pawnId={pawnId} />
    </motion.div>
  );
}

// ─── BoardCell ────────────────────────────────────────────────────────────────

interface BoardCellProps {
  squareIndex: number;
  isActive: boolean;
  isAnimating: boolean;
}

function BoardCell({ squareIndex, isActive, isAnimating }: BoardCellProps) {
  const square   = BOARD[squareIndex];
  const bg       = getSquareBg(square);
  const iconName = getSquareIconName(square);

  return (
    <motion.div
      animate={
        isAnimating && isActive
          ? { scale: [1, 1.2, 1], boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.85)', '0 0 0px rgba(255,255,255,0)'] }
          : isActive
          ? { scale: [1, 1.07, 1] }
          : { scale: 1 }
      }
      transition={
        isActive
          ? { duration: isAnimating ? 0.28 : 0.8, repeat: isAnimating ? 0 : Infinity, repeatType: 'loop' }
          : {}
      }
      style={{
        background: bg || 'rgba(255,255,255,0.06)',
        borderRadius: 10,
        height: CELL_H,
        border: isActive
          ? '2px solid rgba(255,255,255,0.95)'
          : '1.5px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {iconName && <DynamicIcon name={iconName} size={18} color="rgba(255,255,255,0.85)" />}
    </motion.div>
  );
}

// ─── BoardGridProps ───────────────────────────────────────────────────────────

interface BoardGridProps {
  displayPos0: number;
  displayPos1: number;
  p0Emoji: string;
  p1Emoji: string;
  p0Color: string;
  p1Color: string;
  activeSquare: number;
  isAnimating: boolean;
  animatingPos: number | null;
}

// ─── useWebGLSupport ──────────────────────────────────────────────────────────

function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (canvas.getContext as any)('experimental-webgl');
      setSupported(!!ctx);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

// ─── BoardGridCSS ─────────────────────────────────────────────────────────────

function BoardGridCSS({
  displayPos0, displayPos1,
  p0Emoji, p1Emoji, p0Color, p1Color,
  activeSquare, isAnimating,
}: BoardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellW, setCellW] = useState(83);

  useEffect(() => {
    if (!gridRef.current) return;
    const measure = () => {
      if (gridRef.current) setCellW(Math.floor((gridRef.current.clientWidth - 3 * CELL_GAP) / 4));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, []);

  const sameCell = displayPos0 === displayPos1;

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <div className="mx-auto" style={{ maxWidth: 380, padding: '8px 16px 48px', perspective: '800px' }}>
        <div style={{ transform: ISO_TRANSFORM, transformStyle: 'preserve-3d', transformOrigin: 'center center', position: 'relative', isolation: 'auto' }}>
          <div style={{
            position: 'absolute',
            inset: -22,
            background: `
              repeating-linear-gradient(89deg, transparent 0px, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 4px),
              repeating-linear-gradient(86deg, transparent 0px, transparent 9px, rgba(255,255,255,0.14) 9px, rgba(255,255,255,0.14) 11px),
              repeating-linear-gradient(91deg, transparent 0px, transparent 18px, rgba(0,0,0,0.18) 18px, rgba(0,0,0,0.18) 20px),
              linear-gradient(145deg, #c45628 0%, #8a3418 50%, #582210 100%)
            `.replace(/\s+/g, ' '),
            borderRadius: 18,
            border: '2px solid rgba(240,170,60,0.85)',
            boxShadow: '0 0 18px rgba(240,160,40,0.55), 0 0 40px rgba(200,100,20,0.25), inset 0 0 30px rgba(0,0,0,0.45)',
          }} />

          <div ref={gridRef} style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
            {[...BOARD_LAYOUT].reverse().map((row, rowIndex) => (
              <div key={rowIndex} style={{ marginBottom: CELL_GAP, transformStyle: 'preserve-3d' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: CELL_GAP, transformStyle: 'preserve-3d' }}>
                  {row.map(squareIndex => (
                    <BoardCell
                      key={squareIndex}
                      squareIndex={squareIndex}
                      isActive={squareIndex === activeSquare}
                      isAnimating={isAnimating}
                    />
                  ))}
                </div>
              </div>
            ))}

            <PawnOverlay
              squareIndex={displayPos0}
              emoji={p0Emoji}
              color={p0Color}
              pawnId="p0"
              cellW={cellW}
              xOffset={sameCell ? -10 : 0}
            />
            <PawnOverlay
              squareIndex={displayPos1}
              emoji={p1Emoji}
              color={p1Color}
              pawnId="p1"
              cellW={cellW}
              xOffset={sameCell ? 10 : 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── R3F: Cell3D ─────────────────────────────────────────────────────────────

interface BoardCellR3FProps {
  squareIndex: number;
  isActive: boolean;
  isAnimating: boolean;
  hideIcon?: boolean;
}

function Cell3D({ squareIndex, isActive, isAnimating, hideIcon }: BoardCellR3FProps) {
  const square = BOARD[squareIndex];
  const [x, y, z] = getCellPos3D(squareIndex);
  const color = getSquareColor3D(square);
  const iconName = getSquareIconName(square);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const tRef = useRef(0);
  const roughness = useRef(0.46 + Math.random() * 0.04).current;

  useFrame((_, delta) => {
    if (!matRef.current) return;
    if (isActive && !isAnimating) {
      tRef.current += delta;
      matRef.current.emissiveIntensity = 0.18 + 0.14 * Math.sin(tRef.current * 3);
    } else if (isActive && isAnimating) {
      tRef.current += delta;
      matRef.current.emissiveIntensity = 0.55 * Math.abs(Math.sin(tRef.current * 10));
    } else {
      matRef.current.emissiveIntensity = 0.0;
    }
  });

  return (
    <RoundedBox args={[CELL_S, CELL_H3, CELL_S]} radius={0.07} smoothness={5} position={[x, y, z]} receiveShadow castShadow>
      <meshStandardMaterial
        ref={matRef}
        color={color}
        roughness={roughness}
        metalness={0.0}
        emissive={color}
        emissiveIntensity={0.0}
      />
      {iconName && !hideIcon && (
        <Billboard position={[0, CELL_H3 / 2 + 0.08, 0]}>
          <Html center style={{ pointerEvents: 'none' }}>
            <DynamicIcon name={iconName} size={14} color="rgba(255,255,255,0.95)" />
          </Html>
        </Billboard>
      )}
    </RoundedBox>
  );
}

// ─── R3F: BoardBase3D ─────────────────────────────────────────────────────────

function useMahoganyTexture() {
  return useMemo(() => {
    const W = 512, H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createLinearGradient(W * 0.2, 0, W, H);
    g.addColorStop(0, '#c45628');
    g.addColorStop(0.5, '#8a3418');
    g.addColorStop(1, '#582210');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    const lines = (spacing: number, color: string, lw: number, slant: number) => {
      ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw;
      for (let x = -H * Math.abs(slant); x < W + H * Math.abs(slant); x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + H * slant, H); ctx.stroke();
      }
      ctx.restore();
    };
    lines(4,  'rgba(0,0,0,0.22)',       1,  0.02);
    lines(10, 'rgba(255,255,255,0.13)', 2, -0.07);
    lines(19, 'rgba(0,0,0,0.18)',       2,  0.04);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }, []);
}

function BoardBase3D() {
  const totalW = 4 * STEP_3 - GAP_3 + BASE_PAD * 2;
  const totalD = ROWS * STEP_3 - GAP_3 + BASE_PAD * 2;
  const woodTex = useMahoganyTexture();
  return (
    <>
      <mesh position={[0, -BASE_H / 2, 0]} receiveShadow>
        <boxGeometry args={[totalW, BASE_H, totalD]} />
        <meshStandardMaterial map={woodTex} roughness={0.75} metalness={0.04} />
      </mesh>
      {/* Glow ring ambré sous le socle — reproduit le boxShadow CSS */}
      <mesh position={[0, -(BASE_H + 0.03), 0]}>
        <boxGeometry args={[totalW + 0.35, 0.04, totalD + 0.35]} />
        <meshStandardMaterial color="#f0a020" emissive="#f0a020" emissiveIntensity={0.6} roughness={0.4} toneMapped={false} />
      </mesh>
    </>
  );
}

// ─── R3F: Pawn3D ─────────────────────────────────────────────────────────────

const PAWN_REST_Y = CELL_H3;
const ARC_H      = 1.0;
const HOP_DUR    = 0.32;
const BOUNCE_DUR = 0.28;

function Pawn3D({ squareIndex, color, xOffset = 0, zOffset = 0, isActive = false }: {
  squareIndex: number;
  color: string;
  xOffset?: number;
  zOffset?: number;
  isActive?: boolean;
}) {
  const groupRef      = useRef<THREE.Group>(null);
  const shadowMeshRef = useRef<THREE.Mesh>(null);
  const shadowMatRef  = useRef<THREE.MeshBasicMaterial>(null);
  const headMatRef    = useRef<THREE.MeshPhysicalMaterial>(null);
  const fromRef       = useRef<[number, number, number]>((() => { const [x,,z] = getCellPos3D(squareIndex); return [x + xOffset, PAWN_REST_Y, z + zOffset]; })());
  const toRef         = useRef<[number, number, number]>(fromRef.current);
  const progRef       = useRef(1);
  const bounceProgRef = useRef(1);
  const tRef          = useRef(0);

  // Grain texture on body — horizontal bands + sparse highlights
  const bodyTexture = useMemo(() => {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y++) {
      const a = 0.03 + 0.05 * Math.sin(y * 0.9 + Math.random() * 0.8);
      ctx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`;
      ctx.fillRect(0, y, size, 1);
    }
    for (let i = 0; i < 220; i++) {
      ctx.fillStyle = `rgba(255,255,255,${(0.03 + Math.random() * 0.06).toFixed(3)})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.5, 3);
    return tex;
  }, []);

  // Imperative mount position — no position prop on group (would overwrite g.position each render)
  useEffect(() => {
    if (!groupRef.current) return;
    const [ix, , iz] = getCellPos3D(squareIndex);
    groupRef.current.position.set(ix + xOffset, PAWN_REST_Y, iz + zOffset);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const [tx, , tz] = getCellPos3D(squareIndex);
    const g = groupRef.current;
    if (!g) return;
    fromRef.current = [g.position.x, g.position.y, g.position.z];
    toRef.current   = [tx + xOffset, PAWN_REST_Y, tz + zOffset];
    progRef.current = 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squareIndex]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Arc hop
    if (progRef.current < 1) {
      progRef.current = Math.min(progRef.current + delta / HOP_DUR, 1);
      const p    = progRef.current;
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      const [fx, , fz] = fromRef.current;
      const [tx, , tz] = toRef.current;
      g.position.x = fx + (tx - fx) * ease;
      g.position.y = PAWN_REST_Y + Math.sin(Math.PI * p) * ARC_H;
      g.position.z = fz + (tz - fz) * ease;
      if (progRef.current >= 1) bounceProgRef.current = 0;
    }

    // Squash-stretch bounce on landing
    if (bounceProgRef.current < 1) {
      bounceProgRef.current = Math.min(bounceProgRef.current + delta / BOUNCE_DUR, 1);
      const b = bounceProgRef.current;
      const scaleY = b < 0.35
        ? 1 - 0.28 * (b / 0.35)
        : b < 0.70
        ? 0.72 + 0.40 * ((b - 0.35) / 0.35)
        : 1.12 - 0.12 * ((b - 0.70) / 0.30);
      g.scale.y = scaleY;
    }

    // Dynamic shadow — pinned to board surface, fades + expands when airborne
    const heightAbove = Math.max(0, g.position.y - PAWN_REST_Y);
    if (shadowMeshRef.current) {
      shadowMeshRef.current.position.y = CELL_H3 + 0.005 - g.position.y;
      const spread = 1 + (heightAbove / ARC_H) * 0.22;
      shadowMeshRef.current.scale.set(spread, 1, spread);
    }
    if (shadowMatRef.current) {
      shadowMatRef.current.opacity = 0.22 * Math.max(0, 1 - (heightAbove / ARC_H) * 0.88);
    }

    // Emissive glow pulse on head when this pawn is on the active square
    if (headMatRef.current) {
      if (isActive) {
        tRef.current += delta;
        headMatRef.current.emissiveIntensity = 0.14 + 0.12 * Math.sin(tRef.current * 2.5);
      } else {
        headMatRef.current.emissiveIntensity = 0;
      }
    }
  });

  const matBase = { color, roughness: 0.35, metalness: 0.06, clearcoat: 0.6,  clearcoatRoughness: 0.15, envMapIntensity: 1.2 };
  const matBody = { color, roughness: 0.22, metalness: 0.08, clearcoat: 0.9,  clearcoatRoughness: 0.08, envMapIntensity: 1.5, iridescence: 0.18, iridescenceIOR: 1.4, map: bodyTexture };
  const matHead = { color, roughness: 0.08, metalness: 0.10, clearcoat: 1.0,  clearcoatRoughness: 0.04, envMapIntensity: 2.0, iridescence: 0.28, iridescenceIOR: 1.5, transmission: 0.04, thickness: 0.3, emissive: color, emissiveIntensity: 0 };

  return (
    <group ref={groupRef} scale={0.7}>
      <mesh ref={shadowMeshRef} position={[0, CELL_H3 + 0.005 - PAWN_REST_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.33, 20]} />
        <meshBasicMaterial ref={shadowMatRef} color="#000" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.33, 0.36, 0.12, 24]} />
        <meshPhysicalMaterial {...matBase} />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.135, 0.30, 0.60, 16]} />
        <meshPhysicalMaterial {...matBody} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.12, 12]} />
        <meshPhysicalMaterial {...matBody} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.2325, 20, 20]} />
        <meshPhysicalMaterial ref={headMatRef} {...matHead} />
      </mesh>
    </group>
  );
}

// ─── BoardGridR3F ─────────────────────────────────────────────────────────────

function BoardGridR3F({
  displayPos0, displayPos1,
  p0Color, p1Color,
  activeSquare, isAnimating,
}: BoardGridProps) {
  // Fixed Z offset per pawn — évite le bug de double animation lors du same-cell

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <div style={{ width: '100%', padding: '8px 0 48px' }}>
        <div style={{ position: 'relative', height: CANVAS_H }}>
          <Canvas
            style={{ position: 'absolute', inset: 0 }}
            shadows
            gl={{ antialias: true, powerPreference: 'low-power', toneMappingExposure: 1.1 }}
            dpr={[1, 2]}
          >
            <color attach="background" args={['#f7f3ee']} />
            <OrthographicCamera makeDefault position={CAM_POS} zoom={68} near={0.1} far={100} />
            <CameraLookAt />

            <Environment preset="sunset" intensity={0.5} />
            <ambientLight intensity={0.35} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-radius={4}
              shadow-bias={-0.001}
            />
            <directionalLight position={[-4, 4, -4]} intensity={0.2} />

            {/* rotateY 45° = même effet que CSS rotateZ(45°) — donne la vue losange */}
            <group rotation={[0, Math.PI / 4, 0]}>
              <BoardBase3D />

              {BOARD.map(sq => (
                <Cell3D
                  key={sq.index}
                  squareIndex={sq.index}
                  isActive={sq.index === activeSquare}
                  isAnimating={isAnimating}
                  hideIcon={sq.index === displayPos0 || sq.index === displayPos1}
                />
              ))}

              <Pawn3D squareIndex={displayPos0} color={p0Color} xOffset={-0.28} zOffset={0.28}  isActive={displayPos0 === activeSquare} />
              <Pawn3D squareIndex={displayPos1} color={p1Color} xOffset={ 0.28} zOffset={-0.28} isActive={displayPos1 === activeSquare} />

              <ContactShadows
                position={[0, -(BASE_H + 0.02), 0]}
                opacity={0.28}
                scale={14}
                blur={3.5}
                far={5}
                frames={1}
                resolution={256}
              />
            </group>


            <EffectComposer>
              <Bloom intensity={0.15} luminanceThreshold={0.6} luminanceSmoothing={0.9} />
            </EffectComposer>
          </Canvas>
        </div>
      </div>
    </div>
  );
}

// ─── BoardGrid (export — API stable) ─────────────────────────────────────────

export function BoardGrid(props: BoardGridProps) {
  const webgl = useWebGLSupport();
  // null = SSR / detection en cours → CSS jusqu'à confirmation WebGL
  if (webgl === null) return <BoardGridCSS {...props} />;
  return webgl ? <BoardGridR3F {...props} /> : <BoardGridCSS {...props} />;
}

// ─── Legend ───────────────────────────────────────────────────────────────────

export function Legend() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap mt-2 px-4">
      {(['pause', 'chance', 'accord', 'complicite'] as const).map(type => (
        <div key={type} className="flex items-center gap-1.5">
          <span style={{
            display: 'inline-block',
            width: 10, height: 10,
            borderRadius: 3,
            background: SQUARE_VISUAL[type].bg,
          }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
            {SQUARE_VISUAL[type].iconName && <DynamicIcon name={SQUARE_VISUAL[type].iconName} size={9} color="rgba(255,255,255,0.45)" />} {SQUARE_VISUAL[type].label}
          </span>
        </div>
      ))}
    </div>
  );
}
