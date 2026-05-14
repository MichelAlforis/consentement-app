import { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';

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
const FACE_TEXT_OFFSET = FACE_OFFSET + 0.018;
const PIP_RADIUS = 0.038;
const MARK_COLOR = '#ffffff';

// BoxGeometry groups: 0=+X 1=-X 2=+Y 3=-Y 4=+Z 5=-Z
// Derived from getPipTransform: face1→+Z, face2→+X, face3→+Y, face4→-Y, face5→-X, face6→-Z
const FACE_TO_MATERIAL_INDEX: Record<number, number> = { 1: 4, 2: 0, 3: 2, 4: 3, 5: 1, 6: 5 };

const FACE_LABELS: Record<number, string> = {
  1: 'OSEZ',
  2: 'PARLEZ',
  3: 'ETSI',
  4: 'DEFI',
  5: 'VERITE',
  6: 'DOUX',
};

const GRADIENT_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GRADIENT_FRAG = `
  precision mediump float;
  varying vec2 vUv;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  void main() {
    float t = (vUv.x + (1.0 - vUv.y)) * 0.5;
    gl_FragColor = vec4(mix(uColor1, uColor2, t), 1.0);
  }
`;

function hexToVec3(hex: string): THREE.Vector3 {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new THREE.Vector3(r, g, b);
}

function parseGradientColors(gradient: string): [THREE.Vector3, THREE.Vector3] {
  const stops = gradient.match(/#[0-9a-fA-F]{6}/g) ?? ['#888888', '#444444'];
  return [hexToVec3(stops[0]), hexToVec3(stops[1] ?? stops[0])];
}

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

function getFaceTransform(face: number): {
  position: [number, number, number];
  rotation: [number, number, number];
} {
  switch (face) {
    case 2:
      return { position: [FACE_TEXT_OFFSET, 0, 0], rotation: [0, Math.PI / 2, 0] };
    case 3:
      return { position: [0, FACE_TEXT_OFFSET, 0], rotation: [-Math.PI / 2, 0, 0] };
    case 4:
      return { position: [0, -FACE_TEXT_OFFSET, 0], rotation: [Math.PI / 2, 0, 0] };
    case 5:
      return { position: [-FACE_TEXT_OFFSET, 0, 0], rotation: [0, -Math.PI / 2, 0] };
    case 6:
      return { position: [0, 0, -FACE_TEXT_OFFSET], rotation: [0, Math.PI, 0] };
    case 1:
    default:
      return { position: [0, 0, FACE_TEXT_OFFSET], rotation: [0, 0, 0] };
  }
}

type Stroke = [x: number, y: number, w: number, h: number, rotation?: number];

const LETTER_STROKES: Record<string, Stroke[]> = {
  A: [[0, 0.045, 0.07, 0.014], [-0.035, 0, 0.014, 0.09], [0.035, 0, 0.014, 0.09], [0, 0, 0.06, 0.014]],
  D: [[-0.035, 0, 0.014, 0.1], [0, 0.045, 0.06, 0.014], [0, -0.045, 0.06, 0.014], [0.035, 0, 0.014, 0.09]],
  E: [[0, 0.045, 0.075, 0.014], [-0.035, 0, 0.014, 0.1], [0, 0, 0.064, 0.014], [0, -0.045, 0.075, 0.014]],
  F: [[0, 0.045, 0.075, 0.014], [-0.035, 0, 0.014, 0.1], [0, 0, 0.064, 0.014]],
  I: [[0, 0.045, 0.07, 0.014], [0, 0, 0.014, 0.1], [0, -0.045, 0.07, 0.014]],
  L: [[-0.035, 0, 0.014, 0.1], [0, -0.045, 0.075, 0.014]],
  O: [[0, 0.045, 0.07, 0.014], [0, -0.045, 0.07, 0.014], [-0.035, 0, 0.014, 0.09], [0.035, 0, 0.014, 0.09]],
  P: [[0, 0.045, 0.07, 0.014], [-0.035, 0, 0.014, 0.1], [0.035, 0.022, 0.014, 0.045], [0, 0, 0.064, 0.014]],
  R: [[0, 0.045, 0.07, 0.014], [-0.035, 0, 0.014, 0.1], [0.035, 0.022, 0.014, 0.045], [0, 0, 0.064, 0.014], [0.018, -0.025, 0.014, 0.06, -0.65]],
  S: [[0, 0.045, 0.075, 0.014], [-0.035, 0.022, 0.014, 0.045], [0, 0, 0.064, 0.014], [0.035, -0.022, 0.014, 0.045], [0, -0.045, 0.075, 0.014]],
  T: [[0, 0.045, 0.075, 0.014], [0, 0, 0.014, 0.1]],
  U: [[-0.035, 0.006, 0.014, 0.085], [0.035, 0.006, 0.014, 0.085], [0, -0.045, 0.07, 0.014]],
  V: [[-0.02, 0, 0.014, 0.105, -0.32], [0.02, 0, 0.014, 0.105, 0.32]],
  X: [[0, 0, 0.014, 0.112, -0.6], [0, 0, 0.014, 0.112, 0.6]],
  Z: [[0, 0.045, 0.075, 0.014], [0, 0, 0.014, 0.104, -0.72], [0, -0.045, 0.075, 0.014]],
};

function StrokeMesh({ stroke, z = 0 }: { stroke: Stroke; z?: number }) {
  const [x, y, w, h, rotation = 0] = stroke;
  return (
    <mesh position={[x, y, z]} rotation={[0, 0, rotation]} scale={[w, h, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={MARK_COLOR} transparent opacity={0.95} side={THREE.DoubleSide} />
    </mesh>
  );
}

function VectorText({ text, y }: { text: string; y: number }) {
  const chars = text.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const charStep = 0.085;
  const start = -((chars.length - 1) * charStep) / 2;

  return (
    <group position={[0, y, 0.014]}>
      {chars.map((char, index) => (
        <group key={`${char}-${index}`} position={[start + index * charStep, 0, 0]} scale={0.72}>
          {(LETTER_STROKES[char] ?? LETTER_STROKES.O).map((stroke, strokeIndex) => (
            <StrokeMesh key={strokeIndex} stroke={stroke} />
          ))}
        </group>
      ))}
    </group>
  );
}

function RingMark({ scale = 1, y = 0 }: { scale?: number | [number, number, number]; y?: number }) {
  const geometry = useMemo(() => new THREE.RingGeometry(0.085, 0.108, 28), []);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: MARK_COLOR, transparent: true, opacity: 0.96, side: THREE.DoubleSide }),
    [],
  );

  return (
    <mesh geometry={geometry} material={material} position={[0, y, 0.012]} scale={scale} />
  );
}

function CircleMark({ position, radius }: { position: [number, number, number]; radius: number }) {
  const geometry = useMemo(() => new THREE.CircleGeometry(radius, 20), [radius]);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: MARK_COLOR, transparent: true, opacity: 0.96, side: THREE.DoubleSide }),
    [],
  );

  return <mesh geometry={geometry} material={material} position={position} />;
}

function RectOutline({ scale = 1, offset = 0 }: { scale?: number; offset?: number }) {
  return (
    <group position={[offset, offset, 0.012]} scale={scale}>
      <StrokeMesh stroke={[0, 0.08, 0.16, 0.014]} />
      <StrokeMesh stroke={[0, -0.08, 0.16, 0.014]} />
      <StrokeMesh stroke={[-0.08, 0, 0.014, 0.16]} />
      <StrokeMesh stroke={[0.08, 0, 0.014, 0.16]} />
    </group>
  );
}

function CategoryIcon({ faceId }: { faceId: number }) {
  switch (faceId) {
    case 1:
      return (
        <group position={[0, 0.15, 0]}>
          <RectOutline scale={0.58} offset={-0.03} />
          <RectOutline scale={0.58} offset={0.02} />
          <RectOutline scale={0.58} offset={0.07} />
        </group>
      );
    case 2:
      return (
        <group position={[0, 0.15, 0]}>
          <RingMark scale={[1.02, 0.82, 1]} />
          <StrokeMesh stroke={[0.075, -0.085, 0.014, 0.06, -0.7]} z={0.012} />
        </group>
      );
    case 3:
      return (
        <group position={[0, 0.15, 0]}>
          <RingMark />
          <VectorText text="?" y={-0.005} />
        </group>
      );
    case 4:
      return (
        <group position={[0, 0.15, 0]}>
          <RingMark scale={1.08} />
          <RingMark scale={0.62} />
          <CircleMark position={[0, 0, 0.014]} radius={0.026} />
        </group>
      );
    case 5:
      return (
        <group position={[0, 0.15, 0]}>
          <StrokeMesh stroke={[0, 0, 0.014, 0.19]} z={0.012} />
          <StrokeMesh stroke={[0, 0, 0.014, 0.19, Math.PI / 2]} z={0.012} />
          <StrokeMesh stroke={[0, 0, 0.012, 0.13, Math.PI / 4]} z={0.012} />
          <StrokeMesh stroke={[0, 0, 0.012, 0.13, -Math.PI / 4]} z={0.012} />
        </group>
      );
    case 6:
      return (
        <group position={[0, 0.15, 0]}>
          <CircleMark position={[-0.04, 0.03, 0.012]} radius={0.055} />
          <CircleMark position={[0.04, 0.03, 0.012]} radius={0.055} />
          <mesh position={[0, -0.035, 0.012]} rotation={[0, 0, Math.PI / 4]} scale={[0.095, 0.095, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color={MARK_COLOR} transparent opacity={0.96} side={THREE.DoubleSide} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function DicePips() {
  const pipGeometry = useMemo(() => new THREE.SphereGeometry(PIP_RADIUS, 16, 8), []);
  const pipMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#18181b' }), []);

  return (
    <>
      {[1, 2, 3, 4, 5, 6].flatMap((face) =>
        PIP_LAYOUTS[face].map((pip) => {
          const { position, rotation } = getPipTransform(face, pip);
          void rotation;
          return (
            <mesh
              key={`${face}-${pip}`}
              geometry={pipGeometry}
              material={pipMaterial}
              position={position}
            />
          );
        }),
      )}
    </>
  );
}

function FaceLabels({ faces }: { faces: DiceFace[] }) {
  return (
    <>
      {faces.map((face) => {
        const { position, rotation } = getFaceTransform(face.id);

        return (
          <group key={face.id} position={position} rotation={rotation}>
            <CategoryIcon faceId={face.id} />
            <VectorText text={FACE_LABELS[face.id] ?? face.label} y={-0.14} />
          </group>
        );
      })}
    </>
  );
}

function AnimatedCube({
  faces,
  targetFaceId,
  isRolling,
  onRollComplete,
  mode,
}: {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
  mode: 'category' | 'numeric';
}) {
  const groupRef = useRef<THREE.Group>(null);
  const onRollCompleteRef = useRef(onRollComplete);
  const cubeGeometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 4, 0.1), []);
  const cubeMaterial = useMemo(() => {
    const defaultColors = parseGradientColors('linear-gradient(135deg, #e0ddd6, #c8c4bb)');
    const mats = Array.from({ length: 6 }, () =>
      new THREE.ShaderMaterial({
        vertexShader: GRADIENT_VERT,
        fragmentShader: GRADIENT_FRAG,
        uniforms: {
          uColor1: { value: defaultColors[0].clone() },
          uColor2: { value: defaultColors[1].clone() },
        },
      }),
    );
    for (const face of faces) {
      const idx = FACE_TO_MATERIAL_INDEX[face.id];
      if (idx !== undefined) {
        const [c1, c2] = parseGradientColors(face.gradient);
        mats[idx].uniforms.uColor1.value = c1;
        mats[idx].uniforms.uColor2.value = c2;
      }
    }
    return mats;
  }, [faces]);

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
      {mode === 'category' && <FaceLabels faces={faces} />}
      {mode === 'numeric' && <DicePips />}
    </group>
  );
}

function DiceScene({
  faces,
  targetFaceId,
  isRolling,
  onRollComplete,
  mode,
}: {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
  mode: 'category' | 'numeric';
}) {
  return (
    <AnimatedCube
      faces={faces}
      targetFaceId={targetFaceId}
      isRolling={isRolling}
      onRollComplete={onRollComplete}
      mode={mode}
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
  mode = 'category',
}: DiceCanvasProps) {
  const targetFaceId = currentFace?.id ?? 1;

  return (
    <View style={{ width: size, height: size }}>
      <Canvas
        frameloop="always"
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        gl={{ antialias: false, alpha: true }}
        style={{ flex: 1 }}
      >
        <DiceScene
          faces={config.faces}
          targetFaceId={targetFaceId}
          isRolling={isRolling}
          onRollComplete={onRollComplete}
          mode={mode}
        />
      </Canvas>
    </View>
  );
}
