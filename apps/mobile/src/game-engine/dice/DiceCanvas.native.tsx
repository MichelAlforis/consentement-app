import { useEffect, useRef, useMemo, Suspense } from 'react';
import { View } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';

// TODO: extraire vers @ouiclair/core quand les types dé seront migrés dans packages/core
interface DiceFace {
  id: number;
  label: string;
  iconName: string;
  gradient: string;
  border: string;
  color: string;
}

interface DiceConfig {
  faces: DiceFace[];
  size?: number;
  animationDuration?: number;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const FACE_ROTATIONS: Record<number, [number, number]> = {
  1: [0, 0],
  2: [0, -Math.PI / 2],
  3: [Math.PI / 2, 0],
  4: [-Math.PI / 2, 0],
  5: [0, Math.PI / 2],
  6: [0, Math.PI],
};

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

// ─── Couleurs par face — DataTexture 2×2 ────────────────────────────────────
// PNG + useTexture → pixelStorei non supporté par expo-gl → textures transparentes.
// DataTexture : créée en JS pur, aucun appel pixelStorei, garantie visible.

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function makeFaceTexture(face: DiceFace): THREE.DataTexture {
  const stops = face.gradient.match(/#[0-9a-fA-F]{6}/g) ?? [face.color ?? '#888888'];
  const [r1, g1, b1] = hexToRgb(stops[0]);
  const [r2, g2, b2] = stops[1] ? hexToRgb(stops[1]) : [r1, g1, b1];
  const data = new Uint8Array([
    r1, g1, b1, 255,  r1, g1, b1, 255,
    r2, g2, b2, 255,  r2, g2, b2, 255,
  ]);
  const tex = new THREE.DataTexture(data, 2, 2, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// ─── Cube animé ───────────────────────────────────────────────────────────────

function AnimatedCube({
  faces,
  targetFaceId,
  isRolling,
  onRollComplete,
}: {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.08), []);

  // DataTextures créées une fois, distinctes par face
  const textures = useMemo(() => faces.map(makeFaceTexture), [faces]);

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
  const idle = useRef({ t: 0 });

  useEffect(() => {
    if (!isRolling || !groupRef.current) return;

    const actualY = groupRef.current.rotation.y;
    const actualX = groupRef.current.rotation.x;
    const [tx, ty] = FACE_ROTATIONS[targetFaceId] ?? [0, 0];
    const baseX = Math.round(actualX / (Math.PI * 2)) * Math.PI * 2;
    const baseY = Math.round(actualY / (Math.PI * 2)) * Math.PI * 2;
    const finalX = baseX + Math.PI * 6 + tx;
    const finalY = baseY + Math.PI * 4 + ty;
    cumulative.current = { x: finalX, y: finalY };

    anim.current = {
      rolling: true,
      startX: actualX,
      startY: actualY,
      targetX: finalX,
      targetY: finalY,
      elapsed: 0,
      duration: 1.7,
      done: false,
      onComplete: onRollComplete,
      wobbleAmplitude: (Math.random() - 0.5) * 0.18,
      wobbleFreq: 8 + Math.random() * 4,
    };
  }, [isRolling, targetFaceId, onRollComplete]);

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
    group.position.y = Math.sin(Math.PI * t) * 0.38;

    if (t >= 1 && !a.done) {
      a.done = true;
      a.rolling = false;
      group.rotation.z = 0;
      group.position.y = 0;
      bounce.current = { active: true, elapsed: 0 };
      a.onComplete?.();
    }
  });

  useFrame((_, delta) => {
    const b = bounce.current;
    const group = groupRef.current;
    if (!group || !b.active) return;
    b.elapsed = Math.min(b.elapsed + delta, 0.44);
    const t = b.elapsed / 0.44;
    const sy =
      t < 0.22 ? 1 - 0.32 * (t / 0.22)
      : t < 0.52 ? 0.68 + 0.46 * ((t - 0.22) / 0.30)
      : t < 0.78 ? 1.14 - 0.20 * ((t - 0.52) / 0.26)
      : 0.94 + 0.06 * ((t - 0.78) / 0.22);
    const py = 0.18 * Math.sin(Math.PI * t * 1.9) * Math.exp(-t * 2.8);
    group.scale.set(1, Math.max(0.5, sy), 1);
    group.position.y = Math.max(0, py);
    if (t >= 1) {
      b.active = false;
      group.scale.set(1, 1, 1);
      group.position.y = 0;
      idle.current.t = 0;
    }
  });

  useFrame((_, delta) => {
    const group = groupRef.current;
    const a = anim.current;
    const b = bounce.current;
    if (!group || a.rolling || b.active) return;
    idle.current.t += delta;
    const t = idle.current.t;
    group.rotation.y = cumulative.current.y + Math.sin(t * 0.9) * 0.25;
    group.rotation.x = cumulative.current.x + Math.sin(t * 0.55) * 0.10;
    group.position.y = Math.sin(t * 1.1) * 0.06;
  });

  // Mapping groupes BoxGeometry → faces du dé
  // +X=group0=face2, -X=group1=face5, +Y=group2=face3, -Y=group3=face4, +Z=group4=face1, -Z=group5=face6
  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshBasicMaterial attach="material-0" map={textures[1]} />
        <meshBasicMaterial attach="material-1" map={textures[4]} />
        <meshBasicMaterial attach="material-2" map={textures[2]} />
        <meshBasicMaterial attach="material-3" map={textures[3]} />
        <meshBasicMaterial attach="material-4" map={textures[0]} />
        <meshBasicMaterial attach="material-5" map={textures[5]} />
      </mesh>
    </group>
  );
}

// ─── Scène complète ───────────────────────────────────────────────────────────

function DiceScene({
  faces,
  targetFaceId,
  isRolling,
  onRollComplete,
}: {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
  mode?: 'category' | 'numeric';
}) {
  return (
    <Suspense fallback={null}>
      <AnimatedCube
        faces={faces}
        targetFaceId={targetFaceId}
        isRolling={isRolling}
        onRollComplete={onRollComplete}
      />
    </Suspense>
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
}

export function DiceCanvas({
  config,
  currentFace,
  isRolling,
  onRollComplete,
  size = 180,
}: DiceCanvasProps) {
  const targetFaceId = currentFace?.id ?? 1;

  return (
    <View style={{ width: size, height: size }}>
      <Canvas
        frameloop="always"
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
          toneMapping: THREE.NeutralToneMapping,
          toneMappingExposure: 1.05,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ flex: 1 }}
      >
        <DiceScene
          faces={config.faces}
          targetFaceId={targetFaceId}
          isRolling={isRolling}
          onRollComplete={onRollComplete}
        />
      </Canvas>
    </View>
  );
}
