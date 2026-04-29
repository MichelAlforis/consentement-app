'use client';
import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrthographicCamera, ContactShadows, RoundedBox, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { BoardDice3D } from './BoardDice3D';
import { BOARD, BOARD_LAYOUT, getSquareBg, getSquareIconName, SQUARE_VISUAL } from '../../../../data/goose-game';
import type { SquareType } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';
import type { IconName } from '../../../../utils/iconFromName';
import { useTheme } from '../../../../context/ThemeContext';
import { ICON_NODES } from '../../../../utils/iconPaths';
import s from './Board.module.css';

// ─── CSS constants ────────────────────────────────────────────────────────────

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

const CAM_DIST = 20;

// ─── Responsive + orientation-aware board config ──────────────────────────────
//
// Portrait  : groupRotY=0 (rangées face caméra), caméra haute (65°)
//             → board X = 4*STEP_3 + 2*BASE_PAD ≈ 5.0 units → zoom = w / 5.5
// Landscape : groupRotY=π/4 (losange 45°), caméra médiane (45°)
//             → board X = (4+ROWS)*STEP_3/√2 ≈ 7.9 units → zoom = w / 9.1
//
type BoardConfig = {
  zoom: number;
  canvasH: number;
  isPortrait: boolean;
  groupRotY: number;
  camPos: [number, number, number];
};

function useResponsiveBoardConfig(): BoardConfig {
  const calc = (): BoardConfig => {
    if (typeof window === 'undefined') {
      return { zoom: 48, canvasH: 400, isPortrait: true, groupRotY: 0, camPos: [0, 16, 9] };
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isPortrait = h > w;

    if (isPortrait) {
      // Rangées horizontales — pas de rotation Y → largeur = 4 cols
      const boardW = 4 * STEP_3 + 2 * BASE_PAD;       // ≈ 5.04 world units
      const zoom   = Math.min(80, Math.max(30, Math.floor(w / (boardW * 1.1))));
      const elev   = (65 * Math.PI) / 180;
      const camPos: [number, number, number] = [0, CAM_DIST * Math.sin(elev), CAM_DIST * Math.cos(elev)];
      // Hauteur canvas : profondeur projetée = ROWS*STEP_3 * sin(65°) * zoom + marge
      const projH  = Math.round(ROWS * STEP_3 * Math.sin(elev) * zoom * 1.25);
      const canvasH = Math.min(projH, Math.round(h * 0.48));
      return { zoom, canvasH, isPortrait, groupRotY: 0, camPos };
    } else {
      // Losange 45° — largeur = (4+ROWS)*STEP_3 / √2
      const boardW = (4 + ROWS) * STEP_3 / Math.SQRT2;  // ≈ 7.9 world units
      const zoom   = Math.min(68, Math.max(30, Math.floor(w / (boardW * 1.15))));
      const elev   = (45 * Math.PI) / 180;
      const camPos: [number, number, number] = [0, CAM_DIST * Math.sin(elev), CAM_DIST * Math.cos(elev)];
      const canvasH = Math.round(Math.min(h * 0.72, 520));
      return { zoom, canvasH, isPortrait, groupRotY: Math.PI / 4, camPos };
    }
  };

  const [config, setConfig] = useState<BoardConfig>(calc);
  useEffect(() => {
    const update = () => setConfig(calc());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);
  return config;
}

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

function PawnSvg({ pawn, color, pawnId }: { pawn: IconName; color: string; pawnId: string }) {
  const cylId  = `pc-${pawnId}`;
  const headId = `ph-${pawnId}`;
  const baseId = `pb-${pawnId}`;
  return (
    <svg width={PAWN_SIZE} height={PAWN_SIZE} viewBox="0 0 60 80" className="block">
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

      {/* Pawn icon */}
      <foreignObject x="17" y="9" width="26" height="26">
        <div className="flex items-center justify-center w-full h-full">
          <DynamicIcon name={pawn} size={14} color="rgba(255,255,255,0.92)" />
        </div>
      </foreignObject>
    </svg>
  );
}

// ─── PawnOverlay ──────────────────────────────────────────────────────────────

function PawnOverlay({ squareIndex, pawn, color, pawnId, cellW, xOffset = 0 }: {
  squareIndex: number;
  pawn: IconName;
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
      className={s.pawnOverlay}
      style={{ z: 50 }}
    >
      <PawnSvg pawn={pawn} color={color} pawnId={pawnId} />
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
      className={s.cell}
      style={{
        background: bg || 'rgba(255,255,255,0.06)',
        border: isActive
          ? '2px solid rgba(255,255,255,0.95)'
          : '1.5px solid rgba(255,255,255,0.1)',
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
  p0Pawn: IconName;
  p1Pawn: IconName;
  p0Color: string;
  p1Color: string;
  activeSquare: number;
  isAnimating: boolean;
  animatingPos: number | null;
  // Dé sur plateau — optionnel, uniquement R3F
  diceResult?: number;
  isDiceRolling?: boolean;
  onDiceRollComplete?: () => void;
  showDice?: boolean;
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
  p0Pawn, p1Pawn, p0Color, p1Color,
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
    <div className="overflow-x-hidden w-full">
      <div className={`mx-auto ${s.boardInner}`}>
        <div className={s.isoGrid}>
          <div className={s.woodBorder} />

          <div ref={gridRef} className={s.gridRef}>
            {[...BOARD_LAYOUT].reverse().map((row, rowIndex) => (
              <div key={rowIndex} className={s.gridRow}>
                <div className={s.gridCells}>
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
              pawn={p0Pawn}
              color={p0Color}
              pawnId="p0"
              cellW={cellW}
              xOffset={sameCell ? -10 : 0}
            />
            <PawnOverlay
              squareIndex={displayPos1}
              pawn={p1Pawn}
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

// ─── Icon textures (Path2D → CanvasTexture, source unique → iconPaths.ts) ─────

function buildIconTexture(iconName: string): THREE.CanvasTexture | null {
  const nodes = ICON_NODES[iconName];
  if (!nodes) return null;
  const S = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d')!;
  const scale = S / 24;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.fillStyle   = 'rgba(255,255,255,0.92)';
  ctx.lineWidth   = 2.8 / scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const [tag, a] of nodes) {
    ctx.beginPath();
    if (tag === 'path')    { const p = new Path2D(a.d); ctx.stroke(p); }
    else if (tag === 'polygon') {
      const pts = a.points.trim().split(/[\s,]+/).map(Number);
      pts.forEach((v, i) => i % 2 === 0 ? ctx.moveTo(v, pts[i+1]) : null);
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath(); ctx.stroke();
    }
    else if (tag === 'rect') {
      const rx = parseFloat(a.rx ?? '0');
      const [x, y, w, h] = [a.x, a.y, a.width, a.height].map(parseFloat);
      const roundedCtx = ctx as CanvasRenderingContext2D & {
        roundRect?: (x: number, y: number, w: number, h: number, radii: number) => void;
      };
      if (rx > 0 && roundedCtx.roundRect) {
        roundedCtx.roundRect(x, y, w, h, rx);
      } else { ctx.rect(x, y, w, h); }
      ctx.fill();
    }
    else if (tag === 'circle') {
      ctx.arc(parseFloat(a.cx), parseFloat(a.cy), parseFloat(a.r), 0, Math.PI * 2);
      if (a.fill === 'true') ctx.fill(); else ctx.stroke();
    }
    else if (tag === 'line') {
      ctx.moveTo(parseFloat(a.x1), parseFloat(a.y1));
      ctx.lineTo(parseFloat(a.x2), parseFloat(a.y2));
      ctx.stroke();
    }
  }
  ctx.restore();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const iconTextureCache = new Map<string, THREE.CanvasTexture | null>();
function getIconTexture(name: string): THREE.CanvasTexture | null {
  if (!iconTextureCache.has(name)) iconTextureCache.set(name, buildIconTexture(name));
  return iconTextureCache.get(name) ?? null;
}
function disposeIconTextureCache() {
  iconTextureCache.forEach(tex => tex?.dispose());
  iconTextureCache.clear();
}

// ─── R3F: Cell3D ─────────────────────────────────────────────────────────────

interface BoardCellR3FProps {
  squareIndex: number;
  isActive: boolean;
  isAnimating: boolean;
}

function Cell3D({ squareIndex, isActive, isAnimating }: BoardCellR3FProps) {
  const square = BOARD[squareIndex];
  const [x, y, z] = getCellPos3D(squareIndex);
  const color = getSquareColor3D(square);
  const iconName = getSquareIconName(square);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    if (isActive && !isAnimating) {
      tRef.current += delta;
      const f = 1 + 0.22 * Math.sin(tRef.current * 3);
      matRef.current.color.setRGB(Math.min(baseColor.r * f, 1), Math.min(baseColor.g * f, 1), Math.min(baseColor.b * f, 1));
    } else if (isActive && isAnimating) {
      tRef.current += delta;
      const f = 1 + 0.55 * Math.abs(Math.sin(tRef.current * 10));
      matRef.current.color.setRGB(Math.min(baseColor.r * f, 1), Math.min(baseColor.g * f, 1), Math.min(baseColor.b * f, 1));
    } else {
      matRef.current.color.copy(baseColor);
    }
  });

  return (
    <RoundedBox args={[CELL_S, CELL_H3, CELL_S]} radius={0.07} smoothness={5} position={[x, y, z]}>
      <meshBasicMaterial ref={matRef} color={color} />
      {iconName && (() => {
        const tex = getIconTexture(iconName);
        return tex ? (
          <mesh position={[0, CELL_H3 / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.55, 0.55]} />
            <meshBasicMaterial map={tex} transparent depthWrite={false} />
          </mesh>
        ) : null;
      })()}
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

function BoardBase3D({ accentColor }: { accentColor: string }) {
  const totalW = 4 * STEP_3 - GAP_3 + BASE_PAD * 2;
  const totalD = ROWS * STEP_3 - GAP_3 + BASE_PAD * 2;
  const woodTex = useMahoganyTexture();
  return (
    <>
      <mesh position={[0, -BASE_H / 2, 0]} receiveShadow>
        <boxGeometry args={[totalW, BASE_H, totalD]} />
        <meshStandardMaterial map={woodTex} roughness={0.75} metalness={0.04} />
      </mesh>
      {/* Glow ring sous le socle — reproduit le boxShadow CSS, couleur accent du thème */}
      <mesh position={[0, -(BASE_H + 0.03), 0]}>
        <boxGeometry args={[totalW + 0.35, 0.04, totalD + 0.35]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} roughness={0.4} toneMapped={false} />
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
    <group ref={groupRef} scale={0.65}>
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
  diceResult, isDiceRolling, onDiceRollComplete, showDice,
}: BoardGridProps) {
  const { colors } = useTheme();
  const { zoom, canvasH, groupRotY, camPos } = useResponsiveBoardConfig();

  useEffect(() => {
    return () => { disposeIconTextureCache(); };
  }, []);

  return (
    <div className="overflow-x-hidden w-full">
      <div className="w-full py-1">
        <div className="relative overflow-hidden" style={{ height: canvasH }}>
          <Canvas
            className="absolute inset-0"
            shadows
            gl={{ antialias: true, powerPreference: 'low-power', toneMappingExposure: 1.1 }}
            dpr={[1, 2]}
          >
            <color attach="background" args={[colors.bgPrimary]} />
            <OrthographicCamera makeDefault position={camPos} zoom={zoom} near={0.1} far={100} />
            <CameraLookAt />

            <Environment preset="sunset" />
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

            {/* Portrait : groupRotY=0 (rangées face caméra) — Paysage : groupRotY=π/4 (losange) */}
            <group rotation={[0, groupRotY, 0]}>
              <BoardBase3D accentColor={colors.accent} />

              {BOARD.map(sq => (
                <Cell3D
                  key={sq.index}
                  squareIndex={sq.index}
                  isActive={sq.index === activeSquare}
                  isAnimating={isAnimating}
                />
              ))}

              <Pawn3D squareIndex={displayPos0} color={p0Color} xOffset={-0.28} zOffset={0.28}  isActive={displayPos0 === activeSquare} />
              <Pawn3D squareIndex={displayPos1} color={p1Color} xOffset={ 0.28} zOffset={-0.28} isActive={displayPos1 === activeSquare} />

              {diceResult !== undefined && (
                <BoardDice3D
                  isRolling={isDiceRolling ?? false}
                  targetFace={diceResult}
                  onRollComplete={onDiceRollComplete}
                  visible={showDice ?? false}
                />
              )}

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
              <Bloom intensity={0.25} luminanceThreshold={0.5} luminanceSmoothing={0.9} />
              <Vignette eskil={false} offset={0.45} darkness={0.4} />
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
          <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: SQUARE_VISUAL[type].bg }} />
          <span className="text-[10px] text-white/45 font-semibold flex items-center gap-[3px]">
            {SQUARE_VISUAL[type].iconName && <DynamicIcon name={SQUARE_VISUAL[type].iconName} size={9} color="rgba(255,255,255,0.45)" />} {SQUARE_VISUAL[type].label}
          </span>
        </div>
      ))}
    </div>
  );
}
