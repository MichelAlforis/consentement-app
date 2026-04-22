'use client';

import { useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import type { DiceFace, DiceConfig } from './types';

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

  // Gradient plein canvas — pas de clip arrondi (UV boxGeometry = orientations variées)
  const grad = ctx.createLinearGradient(0, 0, size, size);
  const stops = face.gradient.match(/#[0-9a-fA-F]{6}/g) ?? ['#444', '#222'];
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(1, stops[1] ?? stops[0]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Highlight spéculaire haut-gauche — le clearcoat PBR en ajoute un dynamique par-dessus
  const spec = ctx.createRadialGradient(size * 0.25, size * 0.2, 0, size * 0.3, size * 0.25, size * 0.5);
  spec.addColorStop(0, 'rgba(255,255,255,0.32)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec;
  ctx.fillRect(0, 0, size, size);

  // Bord intérieur — simule l'épaisseur de la face
  roundedRect(ctx, size * 0.06, size * 0.06, size * 0.88, size * 0.88, size * 0.12);
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = size * 0.025;
  ctx.stroke();

  // Emoji
  ctx.font = `${size * 0.42}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.fillText(face.emoji, size / 2, size * 0.42);

  // Label
  ctx.font = `900 ${size * 0.11}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.fillText(face.label.toUpperCase(), size / 2, size * 0.74);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Matériaux PBR par face ───────────────────────────────────────────────────

function useFaceMaterials(faces: DiceFace[]): THREE.MeshPhysicalMaterial[] {
  return useMemo(() => {
    return faces.map(face => {
      const tex = makeFaceTexture(face);
      return new THREE.MeshPhysicalMaterial({
        map: tex,
        transmission: 0,        // opaque — la texture doit être lisible
        roughness: 0.15,
        metalness: 0.02,
        envMapIntensity: 0.8,
        clearcoat: 0.85,        // vernis brillant pour l'effet résine
        clearcoatRoughness: 0.05,
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

// ─── Cube animé ───────────────────────────────────────────────────────────────

function AnimatedCube({
  faces, targetFaceId, isRolling, onRollComplete,
}: {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materials = useFaceMaterials(faces);

  // BoxGeometry a exactement 6 groupes (un par face) — mapping garanti
  // +X=group0, -X=group1, +Y=group2, -Y=group3, +Z=group4, -Z=group5
  // face1→+Z(4), face2→+X(0), face3→+Y(2), face4→-Y(3), face5→-X(1), face6→-Z(5)
  const matArray = useMemo(() => {
    const m = materials;
    return [m[1], m[4], m[2], m[3], m[0], m[5]]; // group: +X,-X,+Y,-Y,+Z,-Z
  }, [materials]);

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

  const cumulative = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isRolling || !meshRef.current) return;

    const [tx, ty] = FACE_ROTATIONS[targetFaceId] ?? [0, 0];
    const baseX = Math.round(cumulative.current.x / (Math.PI * 2)) * Math.PI * 2;
    const baseY = Math.round(cumulative.current.y / (Math.PI * 2)) * Math.PI * 2;
    const finalX = baseX + Math.PI * 6 + tx;
    const finalY = baseY + Math.PI * 4 + ty;
    cumulative.current = { x: finalX, y: finalY };

    anim.current = {
      rolling: true,
      startX: meshRef.current.rotation.x,
      startY: meshRef.current.rotation.y,
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
    const mesh = meshRef.current;
    if (!mesh || !a.rolling || a.done) return;

    a.elapsed = Math.min(a.elapsed + delta, a.duration);
    const t = a.elapsed / a.duration;
    const eased = cubicBezier(t);

    mesh.rotation.x = a.startX + (a.targetX - a.startX) * eased;
    mesh.rotation.y = a.startY + (a.targetY - a.startY) * eased;
    mesh.rotation.z = a.wobbleAmplitude * Math.sin(a.wobbleFreq * t * Math.PI) * (1 - t);

    if (t >= 1 && !a.done) {
      a.done = true;
      a.rolling = false;
      mesh.rotation.z = 0;
      a.onComplete?.();
    }
  });

  return (
    <mesh ref={meshRef} material={matArray}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

// ─── Scène complète ───────────────────────────────────────────────────────────

function DiceScene({
  faces, targetFaceId, isRolling, onRollComplete,
}: {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
}) {
  const { gl } = useThree();
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 5, 3]} intensity={1.8} castShadow />
      <pointLight position={[-2, -3, 2]} intensity={0.4} color="#8b5cf6" />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <AnimatedCube
          faces={faces}
          targetFaceId={targetFaceId}
          isRolling={isRolling}
          onRollComplete={onRollComplete}
        />
        <ContactShadows
          position={[0, -0.62, 0]}
          opacity={0.55}
          blur={2.5}
          far={2}
          scale={3}
        />
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
}

export function DiceCanvas({ config, currentFace, isRolling, onRollComplete, size = 120 }: DiceCanvasProps) {
  const targetFaceId = currentFace?.id ?? 1;

  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <DiceScene
          faces={config.faces}
          targetFaceId={targetFaceId}
          isRolling={isRolling}
          onRollComplete={onRollComplete}
        />
      </Canvas>
    </div>
  );
}
