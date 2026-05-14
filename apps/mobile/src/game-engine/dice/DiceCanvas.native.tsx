import { useEffect, useRef, useMemo } from 'react';
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

// ─── Cube animé ───────────────────────────────────────────────────────────────

// three-stdlib RoundedBoxGeometry étend BoxGeometry → 6 groupes identiques.
// Points dessinés en géométrie 3D : zéro texture, zéro asset, zéro pixelStorei EXGL.

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

const FACE_OFFSET = 0.512;
const PIP_RADIUS = 0.055;
const DICE_SCALE = 0.72;

function getPipTransform(face: number, pip: PipKey): {
  position: [number, number, number];
  rotation: [number, number, number];
} {
  const [u, v] = PIP_COORDS[pip];

  switch (face) {
    case 2: // +X
      return { position: [FACE_OFFSET, v, -u], rotation: [0, Math.PI / 2, 0] };
    case 3: // +Y
      return { position: [u, FACE_OFFSET, -v], rotation: [-Math.PI / 2, 0, 0] };
    case 4: // -Y
      return { position: [u, -FACE_OFFSET, v], rotation: [Math.PI / 2, 0, 0] };
    case 5: // -X
      return { position: [-FACE_OFFSET, v, u], rotation: [0, -Math.PI / 2, 0] };
    case 6: // -Z
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

type AnimatedCubeProps = {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
  mode?: 'category' | 'numeric';
};

function FrameProbe() {
  const logged = useRef(false);

  useFrame((_, delta) => {
    if (!logged.current) {
      logged.current = true;
      console.log('[DiceCanvas] R3F frame loop OK', { delta });
    }
  });

  return null;
}

function AnimatedCube({
  mode: _mode = 'category',
  ...props
}: AnimatedCubeProps) {
  return <AnimatedCubeInner {...props} />;
}

function AnimatedCubeInner({
  targetFaceId,
  isRolling,
  onRollComplete,
}: Omit<AnimatedCubeProps, 'mode' | 'faces'>) {
  const groupRef = useRef<THREE.Group>(null);
  const frameLogged = useRef(false);
  const onRollCompleteRef = useRef(onRollComplete);

  // RoundedBoxGeometry de three-stdlib : coins arrondis + 6 groupes BoxGeometry
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.08), []);

  const anim = useRef({
    rolling: false,
    startX: 0, startY: 0,
    targetX: 0, targetY: 0,
    elapsed: 0,
    duration: 1.7,
    done: false,
    settling: false,
    settleStartX: 0,
    settleStartY: 0,
    settleStartZ: 0,
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
    console.log('[DiceCanvas] roll effect', { isRolling, hasRef: !!groupRef.current, targetFaceId });
    if (!isRolling || !groupRef.current) return;

    // Resync cumulative avec la rotation réelle (qui inclut l'offset idle)
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
      duration: 2.2,
      done: false,
      settling: false,
      settleStartX: 0,
      settleStartY: 0,
      settleStartZ: 0,
      onComplete: onRollCompleteRef.current,
      wobbleAmplitude: (Math.random() - 0.5) * 0.18,
      wobbleFreq: 8 + Math.random() * 4,
    };
  }, [isRolling, targetFaceId]);

  // TODO: tester fps sur device physique (seuil go = 45fps)
  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 30);
    // DIAG: log premier frame — si absent → render loop expo-gl ne tourne pas
    if (!frameLogged.current) {
      frameLogged.current = true;
      console.log('[DiceCanvas] useFrame running — render loop OK', { isRolling });
    }
    const a = anim.current;
    const group = groupRef.current;
    if (!group || !a.rolling || a.done) return;

    a.elapsed = Math.min(a.elapsed + step, a.duration);
    const t = a.elapsed / a.duration;
    const spinEnd = 0.7;

    if (t < spinEnd) {
      const p = t / spinEnd;
      group.rotation.x = a.startX + p * Math.PI * 2 * 4.25;
      group.rotation.y = a.startY + p * Math.PI * 2 * 5.5;
      group.rotation.z = 0.28 * Math.sin(p * Math.PI * 8);
      group.position.y = 0.16 + Math.sin(p * Math.PI * 6) * 0.18;
    } else {
      if (!a.settling) {
        a.settling = true;
        a.settleStartX = group.rotation.x;
        a.settleStartY = group.rotation.y;
        a.settleStartZ = group.rotation.z;
      }

      const settleT = (t - spinEnd) / (1 - spinEnd);
      const eased = cubicBezier(settleT);
      group.rotation.x = a.settleStartX + (a.targetX - a.settleStartX) * eased;
      group.rotation.y = a.settleStartY + (a.targetY - a.settleStartY) * eased;
      group.rotation.z = a.settleStartZ * (1 - eased);
      group.position.y = Math.sin(Math.PI * settleT) * 0.22;
    }

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

  // Animation idle : flottement + oscillation douce quand le dé est au repos
  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 30);
    const group = groupRef.current;
    const a = anim.current;
    const b = bounce.current;
    if (!group || a.rolling || b.active) return;
    if (idle.current.t === 0) console.log('[DiceCanvas] useFrame idle — premier tick ✓');
    idle.current.t += step;
    const t = idle.current.t;
    // Oscillation Y (±26°) + tilt X (±8°) + flottement vertical (±0.12)
    group.rotation.y = cumulative.current.y + Math.sin(t * 0.9) * 0.45;
    group.rotation.x = cumulative.current.x + Math.sin(t * 0.55) * 0.14;
    group.position.y = Math.sin(t * 1.1) * 0.12;
  });

  return (
    <group ref={groupRef} scale={DICE_SCALE}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#f8f6f0" />
      </mesh>
      <DicePips />
    </group>
  );
}

// ─── Scène complète ───────────────────────────────────────────────────────────

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
  mode?: 'category' | 'numeric';
}) {
  return (
    <>
      {/* Environment preset supprimé : charge HDR externe → échec silencieux → Suspense fallback=null */}
      <FrameProbe />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 4]} intensity={1.0} />
      <directionalLight position={[-3, -2, 1]} intensity={0.4} />
      <group position={[0, 0, 0]}>
        <AnimatedCube
          faces={faces}
          targetFaceId={targetFaceId}
          isRolling={isRolling}
          onRollComplete={onRollComplete}
          mode={mode}
        />
        {/*
          ContactShadows reste désactivé pendant le diagnostic render-loop.
          Le réactiver après validation fps/device si nécessaire :
          <ContactShadows position={[0, -0.62, 0]} opacity={0.55} blur={2.5} far={2} scale={3} frames={1} resolution={256} />
        */}
      </group>
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
    // TODO: tester fps sur device physique (seuil go = 45fps)
    <View style={{ width: size, height: size }}>
      <Canvas
        frameloop="always"
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        shadows
        onCreated={() => {
          // DIAG: log GL context — si absent → expo-gl n'initialise pas
          console.log('[DiceCanvas] GL context created ✓');
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
          // failIfMajorPerformanceCaveat supprimé : hint WebGL non pertinent sur expo-gl
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
          mode={mode}
        />
      </Canvas>
    </View>
  );
}
