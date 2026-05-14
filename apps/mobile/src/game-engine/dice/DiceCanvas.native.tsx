import { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

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

const FACE_ROTATIONS: Record<number, [number, number]> = {
  1: [0, 0],
  2: [0, -Math.PI / 2],
  3: [Math.PI / 2, 0],
  4: [-Math.PI / 2, 0],
  5: [0, Math.PI / 2],
  6: [0, Math.PI],
};

const DICE_SCALE = 1.08;
const FACE_OFFSET = 0.512;
const PIP_RADIUS = 0.055;

type PipKey = 'c' | 'tl' | 'tr' | 'ml' | 'mr' | 'bl' | 'br';

const PIP_COORDS: Record<PipKey, [number, number]> = {
  c: [0, 0],
  tl: [-0.18, 0.18],
  tr: [0.18, 0.18],
  ml: [-0.18, 0],
  mr: [0.18, 0],
  bl: [-0.18, -0.18],
  br: [0.18, -0.18],
};

const PIP_LAYOUTS: Record<number, PipKey[]> = {
  1: ['c'],
  2: ['tl', 'br'],
  3: ['tl', 'c', 'br'],
  4: ['tl', 'tr', 'bl', 'br'],
  5: ['tl', 'tr', 'c', 'bl', 'br'],
  6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br'],
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

function getPipTransform(face: number, pip: PipKey): {
  position: [number, number, number];
  rotation: [number, number, number];
} {
  const [u, v] = PIP_COORDS[pip];

  switch (face) {
    case 2:
      return { position: [FACE_OFFSET, v, -u], rotation: [0, Math.PI / 2, 0] };
    case 3:
      return { position: [u, FACE_OFFSET, -v], rotation: [-Math.PI / 2, 0, 0] };
    case 4:
      return { position: [u, -FACE_OFFSET, v], rotation: [Math.PI / 2, 0, 0] };
    case 5:
      return { position: [-FACE_OFFSET, v, u], rotation: [0, -Math.PI / 2, 0] };
    case 6:
      return { position: [-u, v, -FACE_OFFSET], rotation: [0, Math.PI, 0] };
    case 1:
    default:
      return { position: [u, v, FACE_OFFSET], rotation: [0, 0, 0] };
  }
}

function DicePips() {
  const pipGeometry = useMemo(() => new THREE.CircleGeometry(PIP_RADIUS, 24), []);
  const pipMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#18181b' }), []);

  return (
    <>
      {[1, 2, 3, 4, 5, 6].flatMap((face) =>
        PIP_LAYOUTS[face].map((pip) => {
          const { position, rotation } = getPipTransform(face, pip);
          return (
            <mesh
              key={`${face}-${pip}`}
              geometry={pipGeometry}
              material={pipMaterial}
              position={position}
              rotation={rotation}
            />
          );
        }),
      )}
    </>
  );
}

function AnimatedCube({
  faces: _faces,
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
  const onRollCompleteRef = useRef(onRollComplete);
  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const cubeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#f8f6f0' }), []);

  const anim = useRef({
    rolling: false,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
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
    onRollCompleteRef.current = onRollComplete;
  }, [onRollComplete]);

  useEffect(() => {
    const group = groupRef.current;
    if (!isRolling || !group) return;

    const actualY = group.rotation.y;
    const actualX = group.rotation.x;
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
      onComplete: onRollCompleteRef.current,
      wobbleAmplitude: (Math.random() - 0.5) * 0.18,
      wobbleFreq: 8 + Math.random() * 4,
    };
  }, [isRolling, targetFaceId]);

  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 30);
    const a = anim.current;
    const group = groupRef.current;
    if (!group || !a.rolling || a.done) return;

    a.elapsed = Math.min(a.elapsed + step, a.duration);
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
    const step = Math.min(delta, 1 / 30);
    const b = bounce.current;
    const group = groupRef.current;
    if (!group || !b.active) return;

    b.elapsed = Math.min(b.elapsed + step, 0.44);
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
    const step = Math.min(delta, 1 / 30);
    const group = groupRef.current;
    const a = anim.current;
    const b = bounce.current;
    if (!group || a.rolling || b.active) return;

    idle.current.t += step;
    const t = idle.current.t;
    group.rotation.y = cumulative.current.y + Math.sin(t * 0.9) * 0.25;
    group.rotation.x = cumulative.current.x + Math.sin(t * 0.55) * 0.10;
    group.position.y = Math.sin(t * 1.1) * 0.06;
  });

  return (
    <group ref={groupRef} scale={DICE_SCALE}>
      <mesh geometry={cubeGeometry} material={cubeMaterial} />
      <DicePips />
    </group>
  );
}

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
}) {
  return (
    <AnimatedCube
      faces={faces}
      targetFaceId={targetFaceId}
      isRolling={isRolling}
      onRollComplete={onRollComplete}
    />
  );
}

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
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        gl={{
          antialias: false,
          alpha: true,
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
