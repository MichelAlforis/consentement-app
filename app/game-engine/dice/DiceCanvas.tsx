'use client';

import { useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { DiceFace, DiceConfig } from './types';
import type { GainedCard } from '../../lib/computeGainedCards';
import { CardMesh, RarityLights } from '../cards/CollectorCardCanvas';

// ─── Constantes ───────────────────────────────────────────────────────────────

// Rotation du cube [x, y] pour amener chaque face vers la caméra (+Z)
// BoxGeometry groups : 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z
// Face 1 = +Z (front, group 4), face 2 = +X (group 0), face 3 = +Y (group 2)
// face 4 = -Y (group 3), face 5 = -X (group 1), face 6 = -Z (group 5)
const FACE_ROTATIONS: Record<number, [number, number]> = {
  1: [0, 0],
  2: [0, -Math.PI / 2],
  3: [Math.PI / 2, 0],
  4: [-Math.PI / 2, 0],
  5: [0, Math.PI / 2],
  6: [0, Math.PI],
};

// Même ease que le CSS : cubic-bezier(0.22, 0.61, 0.36, 1)
function cubicBezier(t: number): number {
  const cx = 3 * 0.22, bx = 3 * (0.36 - 0.22) - cx, ax = 1 - cx - bx;
  const cy = 3 * 0.61, by = 3 * (1 - 0.61) - cy, ay = 1 - cy - by;
  let x = t;
  for (let i = 0; i < 8; i++) {
    const xEst = ((ax * x + bx) * x + cx) * x - t;
    const dx = (3 * ax * x + 2 * bx) * x + cx;
    x -= xEst / dx;
  }
  return ((ay * x + by) * x + cy) * x;
}

// ─── Canvas textures par face ─────────────────────────────────────────────────

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function makeFaceTexture(face: DiceFace, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Gradient de fond — plein canvas (pas de clip : UV boxGeometry variables par face)
  const grad = ctx.createLinearGradient(0, 0, size, size);
  const stops = face.gradient.match(/#[0-9a-fA-F]{6}/g) ?? ['#444', '#222'];
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(1, stops[1] ?? stops[0]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Vignette aux coins — simule l'arrondi des bords sans clip géométrique
  const vig = ctx.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.78);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.52)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, size, size);

  // Highlight spéculaire discret — le clearcoat PBR ajoute un reflet dynamique par-dessus
  const spec = ctx.createRadialGradient(size * 0.3, size * 0.22, 0, size * 0.3, size * 0.22, size * 0.45);
  spec.addColorStop(0, 'rgba(255,255,255,0.28)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec;
  ctx.fillRect(0, 0, size, size);

  // Label (centré, police large)
  ctx.font = `900 ${size * 0.18}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = size * 0.04;
  ctx.fillText(face.label.toUpperCase(), size / 2, size * 0.5);
  ctx.shadowBlur = 0;

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Textures numériques (points style dé classique) ──────────────────────────

const DOT_LAYOUTS: Record<number, [number, number][]> = {
  1: [[0.5,  0.5]],
  2: [[0.72, 0.28], [0.28, 0.72]],
  3: [[0.72, 0.28], [0.5,  0.5],  [0.28, 0.72]],
  4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  5: [[0.28, 0.28], [0.72, 0.28], [0.5,  0.5],  [0.28, 0.72], [0.72, 0.72]],
  6: [[0.28, 0.25], [0.72, 0.25], [0.28, 0.5],  [0.72, 0.5],  [0.28, 0.75], [0.72, 0.75]],
};

export function makeNumericFaceTexture(n: number, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f0ebe0';
  ctx.fillRect(0, 0, size, size);

  const vig = ctx.createRadialGradient(size / 2, size / 2, size * 0.32, size / 2, size / 2, size * 0.76);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.10)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, size, size);

  const spec = ctx.createRadialGradient(size * 0.28, size * 0.22, 0, size * 0.28, size * 0.22, size * 0.42);
  spec.addColorStop(0, 'rgba(255,255,255,0.45)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec;
  ctx.fillRect(0, 0, size, size);

  const dotR = size * 0.088;
  for (const [nx, ny] of (DOT_LAYOUTS[n] ?? [])) {
    ctx.fillStyle = n === 1 ? '#c0392b' : '#1a1208';
    ctx.beginPath();
    ctx.arc(nx * size, ny * size, dotR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.arc(nx * size - dotR * 0.28, ny * size - dotR * 0.28, dotR * 0.44, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Cube animé ───────────────────────────────────────────────────────────────

// three-stdlib RoundedBoxGeometry étend BoxGeometry → 6 groupes identiques.
// Group order : +X=0, -X=1, +Y=2, -Y=3, +Z=4, -Z=5
// face1→+Z(group4), face2→+X(group0), face3→+Y(group2)
// face4→-Y(group3), face5→-X(group1), face6→-Z(group5)
// matArray[materialIndex] = texture index : [1, 4, 2, 3, 0, 5]

function AnimatedCube({
  faces, targetFaceId, isRolling, onRollComplete, mode = 'category',
}: {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
  mode?: 'category' | 'numeric';
}) {
  const groupRef = useRef<THREE.Group>(null);

  const textures = useMemo(
    () =>
      mode === 'numeric'
        ? ([1, 2, 3, 4, 5, 6] as const).map(n => makeNumericFaceTexture(n))
        : faces.map(face => makeFaceTexture(face)),
    [mode], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // RoundedBoxGeometry de three-stdlib : coins arrondis + 6 groupes BoxGeometry
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.08), []);

  // matArray indexé par materialIndex (0–5), même ordre que BoxGeometry groups
  const matArray = useMemo(() => {
    const mat = (texIdx: number) => new THREE.MeshPhysicalMaterial({
      map: textures[texIdx],
      transmission: 0,
      roughness: 0.18,
      metalness: 0,
      envMapIntensity: 0.9,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    // +X=group0=face2=tex[1], -X=group1=face5=tex[4], +Y=group2=face3=tex[2]
    // -Y=group3=face4=tex[3], +Z=group4=face1=tex[0], -Z=group5=face6=tex[5]
    return [mat(1), mat(4), mat(2), mat(3), mat(0), mat(5)];
  }, [textures]);

  const anim = useRef({
    rolling: false,
    startX: 0, startY: 0,
    targetX: 0, targetY: 0,
    elapsed: 0,
    duration: 1.7,
    done: false,
    onComplete: undefined as (() => void) | undefined,
    wobbleAmplitude: 0,
    wobbleFreq: 0,
  });

  const bounce = useRef({ active: false, elapsed: 0 });
  const cumulative = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isRolling || !groupRef.current) return;

    const [tx, ty] = FACE_ROTATIONS[targetFaceId] ?? [0, 0];
    const baseX = Math.round(cumulative.current.x / (Math.PI * 2)) * Math.PI * 2;
    const baseY = Math.round(cumulative.current.y / (Math.PI * 2)) * Math.PI * 2;
    const finalX = baseX + Math.PI * 6 + tx;
    const finalY = baseY + Math.PI * 4 + ty;
    cumulative.current = { x: finalX, y: finalY };

    anim.current = {
      rolling: true,
      startX: groupRef.current.rotation.x,
      startY: groupRef.current.rotation.y,
      targetX: finalX,
      targetY: finalY,
      elapsed: 0,
      duration: 1.7,
      done: false,
      onComplete: onRollComplete,
      wobbleAmplitude: (Math.random() - 0.5) * 0.18,
      wobbleFreq: 8 + Math.random() * 4,
    };
  }, [isRolling, targetFaceId]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    const a = anim.current;
    const group = groupRef.current;
    if (!group || !a.rolling || a.done) return;

    a.elapsed = Math.min(a.elapsed + delta, a.duration);
    const t = a.elapsed / a.duration;
    const eased = cubicBezier(t);

    group.rotation.x = a.startX + (a.targetX - a.startX) * eased;
    group.rotation.y = a.startY + (a.targetY - a.startY) * eased;
    group.rotation.z = a.wobbleAmplitude * Math.sin(a.wobbleFreq * t * Math.PI) * (1 - t);
    group.position.y = Math.sin(Math.PI * t) * 0.38; // arc de lancer

    if (t >= 1 && !a.done) {
      a.done = true;
      a.rolling = false;
      group.rotation.z = 0;
      group.position.y = 0;
      bounce.current = { active: true, elapsed: 0 };
      a.onComplete?.();
    }
  });

  // Bump à l'atterrissage — squash + rebond position
  useFrame((_, delta) => {
    const b = bounce.current;
    const group = groupRef.current;
    if (!group || !b.active) return;
    b.elapsed = Math.min(b.elapsed + delta, 0.44);
    const t = b.elapsed / 0.44;
    // Scale : squash → stretch → retour
    const sy = t < 0.22 ? 1 - 0.32 * (t / 0.22)
      : t < 0.52 ? 0.68 + 0.46 * ((t - 0.22) / 0.30)
      : t < 0.78 ? 1.14 - 0.20 * ((t - 0.52) / 0.26)
      : 0.94 + 0.06 * ((t - 0.78) / 0.22);
    // Position : rebond amorti
    const py = 0.18 * Math.sin(Math.PI * t * 1.9) * Math.exp(-t * 2.8);
    group.scale.set(1, Math.max(0.5, sy), 1);
    group.position.y = Math.max(0, py);
    if (t >= 1) {
      b.active = false;
      group.scale.set(1, 1, 1);
      group.position.y = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={matArray} />
    </group>
  );
}

// ─── Ajusteur de caméra — tire la caméra en arrière quand la carte apparaît ──

function CameraUpdater({ showCard }: { showCard: boolean }) {
  const { camera } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z = showCard ? 3.2 : 2.5;
    cam.fov = showCard ? 52 : 45;
    cam.updateProjectionMatrix();
  }, [showCard, camera]);
  return null;
}

// ─── Scène complète ───────────────────────────────────────────────────────────

function DiceScene({
  faces, targetFaceId, isRolling, onRollComplete, mode, previewCard, showCard,
}: {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
  mode?: 'category' | 'numeric';
  previewCard?: GainedCard | null;
  showCard?: boolean;
}) {
  const { gl } = useThree();
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [gl]);

  const hasCard = !!(showCard && previewCard);
  const dieX = hasCard ? -0.55 : 0;

  return (
    <>
      <CameraUpdater showCard={hasCard} />
      <pointLight position={[3, 4, 4]} intensity={0.55} castShadow />
      <pointLight position={[-3, -2, 1]} intensity={0.18} />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <group position={[dieX, 0, 0]}>
          <AnimatedCube
            faces={faces}
            targetFaceId={targetFaceId}
            isRolling={isRolling}
            onRollComplete={onRollComplete}
            mode={mode}
          />
          <ContactShadows
            position={[0, -0.62, 0]}
            opacity={0.55}
            blur={2.5}
            far={2}
            scale={3}
          />
        </group>
        {hasCard && (
          <group position={[0.72, 0, 0]} scale={0.55}>
            <Suspense fallback={null}>
              <CardMesh card={previewCard} isFlipped={true} enableBloom={false} />
            </Suspense>
            <RarityLights rarity={previewCard.rarity} />
          </group>
        )}
      </Suspense>
    </>
  );
}

// ─── Export public ────────────────────────────────────────────────────────────

export interface DiceCanvasProps {
  config: DiceConfig;
  currentFace: DiceFace | null;
  isRolling: boolean;
  onRollComplete?: () => void;
  size?: number;
  mode?: 'category' | 'numeric';
  previewCard?: GainedCard | null;
  showCard?: boolean;
}

export function DiceCanvas({ config, currentFace, isRolling, onRollComplete, size = 180, mode = 'category', previewCard, showCard }: DiceCanvasProps) {
  const targetFaceId = currentFace?.id ?? 1;

  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <DiceScene
          faces={config.faces}
          targetFaceId={targetFaceId}
          isRolling={isRolling}
          onRollComplete={onRollComplete}
          mode={mode}
          previewCard={previewCard}
          showCard={showCard}
        />
      </Canvas>
    </div>
  );
}
