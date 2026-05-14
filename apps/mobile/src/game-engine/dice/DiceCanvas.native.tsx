import { useEffect, useRef, useMemo, Suspense } from 'react';
import { View } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useTexture, Environment, ContactShadows } from '@react-three/drei/native';
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

// ─── Assets PNG pré-générés (build time via packages/textures/scripts/generate.ts) ──

// require() statiques obligatoires pour le bundler Metro (pas de require dynamique)
// TODO: si useTexture ne résout pas les modules RN nativement,
//       résoudre avec Asset.fromModule(require(...)).uri (expo-asset)
const NUMERIC_FACE_REQUIRES = [
  require('@ouiclair/textures/assets/dice/face-1.png'),
  require('@ouiclair/textures/assets/dice/face-2.png'),
  require('@ouiclair/textures/assets/dice/face-3.png'),
  require('@ouiclair/textures/assets/dice/face-4.png'),
  require('@ouiclair/textures/assets/dice/face-5.png'),
  require('@ouiclair/textures/assets/dice/face-6.png'),
] as const;

// ─── Texture catégorie — fallback couleur unie (DataTexture, 1×1 px) ─────────
// Canvas 2D API indisponible sur RN — génération dynamique de gradient/texte impossible.
// TODO: générer des PNG catégorie au build dans packages/textures/scripts/generate.ts
//       pour remplacer ce fallback (paramètres : label, gradient, couleur par face)
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function makeCategoryDataTexture(face: DiceFace): THREE.DataTexture {
  const stops = face.gradient.match(/#[0-9a-fA-F]{6}/g) ?? [face.color ?? '#444444'];
  const [r, g, b] = hexToRgb(stops[0]);
  const data = new Uint8Array([r, g, b, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// ─── Cube animé ───────────────────────────────────────────────────────────────

// three-stdlib RoundedBoxGeometry étend BoxGeometry → 6 groupes identiques.
// matArray[materialIndex] : +X=group0=face2=tex[1], -X=group1=face5=tex[4]
//   +Y=group2=face3=tex[2], -Y=group3=face4=tex[3], +Z=group4=face1=tex[0], -Z=group5=face6=tex[5]

function AnimatedCube({
  faces,
  targetFaceId,
  isRolling,
  onRollComplete,
  mode = 'category',
}: {
  faces: DiceFace[];
  targetFaceId: number;
  isRolling: boolean;
  onRollComplete?: () => void;
  mode?: 'category' | 'numeric';
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Toujours chargées (règle des hooks) — utilisées uniquement si mode === 'numeric'
  // TODO: tester fps sur device physique (seuil go = 45fps)
  const numericTextures = useTexture(
    NUMERIC_FACE_REQUIRES as unknown as string[],
  ) as THREE.Texture[];

  const categoryTextures = useMemo(() => faces.map(makeCategoryDataTexture), [faces]);

  const textures = mode === 'numeric' ? numericTextures : categoryTextures;

  // RoundedBoxGeometry de three-stdlib : coins arrondis + 6 groupes BoxGeometry
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.08), []);

  const matArray = useMemo(() => {
    const mat = (texIdx: number) =>
      new THREE.MeshPhysicalMaterial({
        map: textures[texIdx],
        roughness: 0.18,
        metalness: 0,
        envMapIntensity: 0.9,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
      });
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

  // TODO: tester fps sur device physique (seuil go = 45fps)
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

  // Bump à l'atterrissage — squash + rebond position
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
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={matArray} />
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
      <pointLight position={[3, 4, 4]} intensity={0.55} castShadow />
      <pointLight position={[-3, -2, 1]} intensity={0.18} />
      <Suspense fallback={null}>
        {/* TODO: vérifier support preset="studio" dans @react-three/drei/native
                — peut nécessiter un fichier HDR bundlé via expo-asset */}
        <Environment preset="studio" />
        <group position={[0, 0, 0]}>
          <AnimatedCube
            faces={faces}
            targetFaceId={targetFaceId}
            isRolling={isRolling}
            onRollComplete={onRollComplete}
            mode={mode}
          />
          {/* TODO: mesurer impact ContactShadows sur GPU mobile avant activation en prod
                  — si < 45 fps, désactiver ou réduire resolution à 128 */}
          <ContactShadows
            position={[0, -0.62, 0]}
            opacity={0.55}
            blur={2.5}
            far={2}
            scale={3}
            frames={1}
            resolution={256}
          />
        </group>
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
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        shadows
        dpr={[1, 2]}
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
