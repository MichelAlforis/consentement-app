'use client';

import { useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { DiceFace, DiceConfig } from './types';

// ─── Constantes ───────────────────────────────────────────────────────────────

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
  // Approximation numérique par subdivision (Newton-Raphson simplifié)
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

function makeFaceTexture(face: DiceFace, size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Gradient de fond
  const grad = ctx.createLinearGradient(0, 0, size, size);
  const stops = face.gradient.match(/#[0-9a-fA-F]{6}/g) ?? ['#444', '#222'];
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(1, stops[1] ?? stops[0]);
  ctx.fillStyle = grad;
  ctx.roundRect(0, 0, size, size, 36);
  ctx.fill();

  // Highlight spéculaire
  const spec = ctx.createRadialGradient(size * 0.28, size * 0.22, 0, size * 0.28, size * 0.22, size * 0.55);
  spec.addColorStop(0, 'rgba(255,255,255,0.38)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec;
  ctx.roundRect(0, 0, size, size, 36);
  ctx.fill();

  // Emoji
  ctx.font = `${size * 0.38}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(face.emoji, size / 2, size * 0.42);

  // Label
  ctx.font = `bold ${size * 0.1}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.letterSpacing = '0.1em';
  ctx.fillText(face.label.toUpperCase(), size / 2, size * 0.72);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Matériau PBR par face ───────────────────────────────────────────────────

function useFaceMaterials(faces: DiceFace[]): THREE.MeshPhysicalMaterial[] {
  return useMemo(() => {
    return faces.map(face => {
      const tex = makeFaceTexture(face);
      return new THREE.MeshPhysicalMaterial({
        map: tex,
        transmission: 0.18,      // légère translucidité résine
        roughness: 0.22,
        metalness: 0.0,
        ior: 1.45,
        thickness: 0.5,
        envMapIntensity: 1.2,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
      });
    });
  }, [faces]); // eslint-disable-line react-hooks/exhaustive-deps
}

// ─── Cube animé ───────────────────────────────────────────────────────────────

// Ordre des faces sur un RoundedBox Three.js : +X, -X, +Y, -Y, +Z, -Z
// On mappe faces[0..5] sur les 6 matériaux du cube
// Les rotations FACE_ROTATIONS amènent la face voulue vers la caméra (+Z)
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

  // Animation state
  const anim = useRef({
    rolling: false,
    startX: 0, startY: 0,
    targetX: 0, targetY: 0,
    elapsed: 0,
    duration: 1.7,
    done: false,
    onComplete: undefined as (() => void) | undefined,
    // wobble Z
    wobbleAmplitude: 0,
    wobbleFreq: 0,
  });

  // Cumulative rotation (identique à la logique CSS)
  const cumulative = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isRolling || !meshRef.current) return;

    const [tx, ty] = FACE_ROTATIONS[targetFaceId] ?? [0, 0];
    const baseX = Math.round(cumulative.current.x / (Math.PI * 2)) * Math.PI * 2;
    const baseY = Math.round(cumulative.current.y / (Math.PI * 2)) * Math.PI * 2;
    const finalX = baseX + Math.PI * 6 + tx;  // 3 tours X
    const finalY = baseY + Math.PI * 4 + ty;  // 2 tours Y
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
      wobbleAmplitude: (Math.random() - 0.5) * 0.18, // ±~5°
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
    // Wobble Z : s'estompe en fin d'animation
    mesh.rotation.z = a.wobbleAmplitude * Math.sin(a.wobbleFreq * t * Math.PI) * (1 - t);

    if (t >= 1 && !a.done) {
      a.done = true;
      a.rolling = false;
      mesh.rotation.z = 0;
      a.onComplete?.();
    }
  });

  // Ordre matériaux RoundedBox : +X,-X,+Y,-Y,+Z,-Z
  // On attribue face par face dans l'ordre du tableau (face 1→6)
  const matArray = useMemo(() => {
    // faces[0]=face1 front, faces[1]=face2 right, faces[2]=face3 top...
    // Mapping : +X=face2, -X=face5, +Y=face3, -Y=face4, +Z=face1, -Z=face6
    const m = materials;
    return [m[1], m[4], m[2], m[3], m[0], m[5]]; // +X,-X,+Y,-Y,+Z,-Z
  }, [materials]);

  return (
    <RoundedBox
      ref={meshRef}
      args={[1, 1, 1]}
      radius={0.14}
      smoothness={4}
      material={matArray}
    />
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
  // Adapte la taille du renderer à la taille du canvas parent
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

// ─── Export public ───────────────────────────────────────────────────────────

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
