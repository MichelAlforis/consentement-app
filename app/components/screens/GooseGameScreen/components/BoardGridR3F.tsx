'use client';
import { useRef, useState, useMemo, useEffect, Component, type ReactNode } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrthographicCamera, ContactShadows, RoundedBox, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { BoardDice3D } from './BoardDice3D';
import { BOARD, BOARD_LAYOUT, getSquareIconName } from '../../../../data/goose-game';
import type { SquareType } from '../../../../data/goose-game';
import { useTheme } from '../../../../context/ThemeContext';
import { ICON_NODES } from '../../../../utils/iconPaths';
import type { BoardGridProps } from './Board';

// ─── R3F constants ────────────────────────────────────────────────────────────

const CELL_S   = 1.0;
const CELL_H3  = 0.14;
const GAP_3    = 0.12;
const STEP_3   = CELL_S + GAP_3;
const BASE_H   = 0.18;
const BASE_PAD = 0.28;
const CAM_DIST = 20;
const ROWS = BOARD_LAYOUT.length;

// ─── Responsive board config ──────────────────────────────────────────────────

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

    // Exact board extents including base padding (world units)
    const totalW = 4    * STEP_3 - GAP_3 + 2 * BASE_PAD; // ≈ 4.92
    const totalD = ROWS * STEP_3 - GAP_3 + 2 * BASE_PAD; // ≈ 7.16

    if (isPortrait) {
      const elev   = (65 * Math.PI) / 180;
      const camPos: [number, number, number] = [0, CAM_DIST * Math.sin(elev), CAM_DIST * Math.cos(elev)];
      const projD  = totalD * Math.sin(elev);              // ≈ 6.49 world units projected to screen
      // zoom bounded by both screen width and available canvas height (56 % of screen)
      const maxH   = Math.round(h * 0.56);
      const zoom_w = Math.floor(w    / (totalW * 1.1));
      const zoom_h = Math.floor(maxH / (projD  * 1.1));
      const zoom   = Math.min(80, Math.max(30, Math.min(zoom_w, zoom_h)));
      const canvasH = Math.min(Math.round(projD * zoom * 1.1), maxH);
      return { zoom, canvasH, isPortrait, groupRotY: 0, camPos };
    } else {
      // After 45° Y rotation the board's screen X and Z extents are both (totalW + totalD) / √2
      const diag   = (totalW + totalD) / Math.SQRT2;       // ≈ 8.54 world units
      const elev   = (45 * Math.PI) / 180;
      const camPos: [number, number, number] = [0, CAM_DIST * Math.sin(elev), CAM_DIST * Math.cos(elev)];
      const projD  = diag * Math.sin(elev);                // ≈ 6.04 world units projected to screen
      const maxH   = Math.round(Math.min(h * 0.72, 520));
      const zoom_w = Math.floor(w    / (diag  * 1.1));
      const zoom_h = Math.floor(maxH / (projD * 1.1));
      const zoom   = Math.min(68, Math.max(30, Math.min(zoom_w, zoom_h)));
      const canvasH = Math.min(Math.round(projD * zoom * 1.1), maxH);
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

// ─── Square colors ────────────────────────────────────────────────────────────

const SQUARE_COLOR: Record<SquareType, string> = {
  depart:     '#4ade80',
  normal:     '#7a6248',
  chance:     '#fbbf24',
  pause:      '#f87171',
  accord:     '#60a5fa',
  complicite: '#c084fc',
  arrivee:    '#34d399',
};

const DICE_FACE_COLOR: Record<number, string> = {
  1: '#f59e0b',
  2: '#8b5cf6',
  3: '#ec4899',
  4: '#3b82f6',
  5: '#10b981',
  6: '#be123c',
};

function getSquareColor3D(square: { type: SquareType; face?: number }): string {
  if (square.type === 'normal' && square.face) return DICE_FACE_COLOR[square.face] ?? '#7a6248';
  return SQUARE_COLOR[square.type];
}

// ─── Layout helpers (mirrored from Board.tsx pour getCellPos3D) ───────────────

function getLayoutPos(idx: number) {
  for (let r = 0; r < BOARD_LAYOUT.length; r++) {
    const c = BOARD_LAYOUT[r].indexOf(idx);
    if (c !== -1) return { row: r, col: c };
  }
  return { row: 0, col: 0 };
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

function CameraLookAt({ camPos }: { camPos: [number, number, number] }) {
  const { camera } = useThree();
  useEffect(() => { camera.lookAt(0, 0, 0); }, [camera, camPos]);
  return null;
}

// ─── Icon textures (Path2D → CanvasTexture) ───────────────────────────────────

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
  tex.colorSpace = THREE.SRGBColorSpace;
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
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    if (isActive && !isAnimating) {
      tRef.current += delta;
      matRef.current.emissiveIntensity = 0.30 + 0.15 * Math.sin(tRef.current * 3.0);
    } else if (isActive && isAnimating) {
      tRef.current += delta;
      matRef.current.emissiveIntensity = 0.65 + 0.35 * Math.abs(Math.sin(tRef.current * 10));
    } else {
      matRef.current.emissiveIntensity = 0;
    }
  });

  return (
    <RoundedBox args={[CELL_S, CELL_H3, CELL_S]} radius={0.07} smoothness={5} position={[x, y, z]}>
      <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0} roughness={0.52} metalness={0.04} />
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
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
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

  const bodyTexture = useMemo(() => {
    // LCG seedé — déterministe entre mounts, pas de flash texture au remount
    let s = 42;
    const rand = () => { s = (s * 1664525 + 1013904223) | 0; return (s >>> 0) / 0xffffffff; };

    const size = 128;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y++) {
      const a = 0.03 + 0.05 * Math.sin(y * 0.9 + rand() * 0.8);
      ctx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`;
      ctx.fillRect(0, y, size, 1);
    }
    for (let i = 0; i < 220; i++) {
      ctx.fillStyle = `rgba(255,255,255,${(0.03 + rand() * 0.06).toFixed(3)})`;
      ctx.fillRect(rand() * size, rand() * size, 1, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.5, 3);
    return tex;
  }, []);

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

    const heightAbove = Math.max(0, g.position.y - PAWN_REST_Y);
    if (shadowMeshRef.current) {
      shadowMeshRef.current.position.y = CELL_H3 + 0.005 - g.position.y;
      const spread = 1 + (heightAbove / ARC_H) * 0.22;
      shadowMeshRef.current.scale.set(spread, 1, spread);
    }
    if (shadowMatRef.current) {
      shadowMatRef.current.opacity = 0.22 * Math.max(0, 1 - (heightAbove / ARC_H) * 0.88);
    }

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

// ─── PostFXBoundary — isole EffectComposer contre crash float-texture (Mali) ──

class PostFXBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

// ─── CanvasBoundary — swallow WebGL init failures silently ───────────────────

class CanvasBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() { return this.state.crashed ? null : this.props.children; }
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

  // Defer Canvas mount 60ms — absorbs React Strict Mode double-mount in dev
  // (first mount's cleanup fires clearTimeout before the 60ms; real mount lets it complete)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => { disposeIconTextureCache(); };
  }, []);

  return (
    <div className="overflow-x-hidden w-full">
      <div className="w-full py-1">
        <div className="relative overflow-hidden" style={{ height: canvasH }}>
          {mounted && <CanvasBoundary><Canvas
            className="absolute inset-0"
            shadows
            gl={{
              antialias: true,
              powerPreference: 'low-power',
              failIfMajorPerformanceCaveat: false,
            }}
            dpr={[1, 2]}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.15;
              gl.outputColorSpace = THREE.SRGBColorSpace;
            }}
          >
            <color attach="background" args={[colors.bgPrimary]} />
            <OrthographicCamera makeDefault position={camPos} zoom={zoom} near={0.1} far={100} />
            <CameraLookAt camPos={camPos} />

            <Environment preset="sunset" />
            <ambientLight intensity={0.35} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.001}
            />
            <directionalLight position={[-4, 4, -4]} intensity={0.2} />

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

            {/* N8AO incompatible OrthographicCamera (depth math diverge) — SSAO Phase 3 si switch Perspective */}
            {/* N8AO incompatible OrthographicCamera (depth math diverge) — SSAO Phase 3 si switch Perspective */}
            <PostFXBoundary>
              <EffectComposer>
                <Bloom intensity={0.45} luminanceThreshold={0.32} luminanceSmoothing={0.85} mipmapBlur />
                <Vignette eskil={false} offset={0.45} darkness={0.4} />
              </EffectComposer>
            </PostFXBoundary>
          </Canvas></CanvasBoundary>}
        </div>
      </div>
    </div>
  );
}

// Default export pour React.lazy
export default BoardGridR3F;
