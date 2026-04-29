'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { makeNumericFaceTexture } from '../../../../game-engine/dice/DiceCanvas';

// Doit rester synchronisé avec CELL_H3 dans Board.tsx
const CELL_H3 = 0.14;

const BOARD_DICE_S       = 0.675;
const BOARD_DICE_REST_Y  = CELL_H3 + BOARD_DICE_S / 2 + 0.04;
const BOARD_DICE_THROW_H = 0.9;
const BOARD_DICE_ARC_H   = 1.2;
const BOARD_DICE_ROT_DUR = 2.1;

// Mapping face → [rx, ry, rz] pour que la face soit sur le dessus (+Y world).
// Matériaux : Group0(+X)="2", Group1(-X)="5", Group2(+Y)="3",
//             Group3(-Y)="4", Group4(+Z)="1", Group5(-Z)="6"
// Vérification : n_local = Rx(-rx)*Ry(-ry)*Rz(-rz)*(0,1,0) doit pointer vers la face
const BOARD_DICE_FACE_ROT: Record<number, [number, number, number]> = {
  1: [-Math.PI / 2, 0, 0],   // +Z face on top
  2: [0, 0,  Math.PI / 2],   // +X face on top — nécessite rz
  3: [0, 0, 0],              // +Y face on top (default)
  4: [Math.PI, 0, 0],        // -Y face on top
  5: [0, 0, -Math.PI / 2],   // -X face on top — nécessite rz
  6: [Math.PI / 2, 0, 0],    // -Z face on top
};

// Origines de lancer — en dehors des bords du plateau
const THROW_ORIGINS: [number, number][] = [
  [-4.5,  0.0], [ 4.5,  0.0],
  [ 0.0,  5.5], [ 0.0, -5.5],
  [-4.5,  4.5], [ 4.5,  4.5],
  [-4.5, -4.5], [ 4.5, -4.5],
];
// Zones d'atterrissage — entre les cases, jamais sur un chemin de pion
const DICE_LANDING_ZONES: [number, number][] = [
  [-1.95,  3.55], [ 1.95,  3.55],  // coins avant
  [-1.95, -3.55], [ 1.95, -3.55],  // coins arrière
  [-1.95,  0.00], [ 1.95,  0.00],  // milieu des bords
];

export function BoardDice3D({ isRolling, targetFace, onRollComplete, visible }: {
  isRolling: boolean;
  targetFace: number;
  onRollComplete?: () => void;
  visible: boolean;
}) {
  const groupRef      = useRef<THREE.Group>(null);
  const dieGroupRef   = useRef<THREE.Group>(null);
  const cumulative    = useRef({ x: 0, y: 0, z: 0 });
  const bounceRef     = useRef(1);
  const squashRef     = useRef(0);
  const landingRef    = useRef({ x: 0, z: 0 });
  const throwRef      = useRef({ x: 0, z: 0 });
  const groundVelRef  = useRef({ x: 0, z: 0 });
  const slidingRef    = useRef(false);
  const slideTimeRef  = useRef(0);
  const rotElapsedRef = useRef(BOARD_DICE_ROT_DUR); // "done" par défaut
  const rotStartRef   = useRef({ x: 0, y: 0, z: 0 });
  const rotTargetRef  = useRef({ x: 0, y: 0, z: 0 });
  const lockedRef     = useRef(false); // verrou explicite — actif après convergence

  const textures = useMemo(
    () => ([1, 2, 3, 4, 5, 6] as const).map(n => makeNumericFaceTexture(n)),
    [],
  );
  const geometry = useMemo(
    () => new RoundedBoxGeometry(BOARD_DICE_S, BOARD_DICE_S, BOARD_DICE_S, 2, 0.08),
    [],
  );
  const matArray = useMemo(() => {
    const mat = (ti: number) => new THREE.MeshPhysicalMaterial({
      map: textures[ti], roughness: 0.18, metalness: 0,
      envMapIntensity: 0.9,
      clearcoat: 0.8, clearcoatRoughness: 0.10,
    });
    // +X="2", -X="5", +Y="3", -Y="4", +Z="1", -Z="6"
    return [mat(1), mat(4), mat(2), mat(3), mat(0), mat(5)];
  }, [textures]);

  const anim = useRef({
    rolling: false,
    elapsed: 0, duration: 1.7, done: false,
    onComplete: undefined as (() => void) | undefined,
    wobbleAmp: 0, wobbleFreq: 0,
  });

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(0, BOARD_DICE_REST_Y, 0);
  }, []);

  useEffect(() => {
    if (!isRolling || !groupRef.current) return;
    const g = groupRef.current;
    slidingRef.current = false;
    lockedRef.current  = false;
    const zone = DICE_LANDING_ZONES[Math.floor(Math.random() * DICE_LANDING_ZONES.length)];
    landingRef.current = {
      x: zone[0] + (Math.random() - 0.5) * 0.3,
      z: zone[1] + (Math.random() - 0.5) * 0.3,
    };
    const origin = THROW_ORIGINS[Math.floor(Math.random() * THROW_ORIGINS.length)];
    throwRef.current = {
      x: origin[0] + (Math.random() - 0.5) * 0.5,
      z: origin[1] + (Math.random() - 0.5) * 0.5,
    };
    const [tx, ty, tz] = BOARD_DICE_FACE_ROT[targetFace] ?? [0, 0, 0];
    const baseX = Math.round(cumulative.current.x / (Math.PI * 2)) * Math.PI * 2;
    const baseY = Math.round(cumulative.current.y / (Math.PI * 2)) * Math.PI * 2;
    const baseZ = Math.round(cumulative.current.z / (Math.PI * 2)) * Math.PI * 2;
    const finalX = baseX + Math.PI * 6 + tx;
    const finalY = baseY + Math.PI * 4 + ty;
    const finalZ = baseZ + tz; // pas de spins additionnels en Z — le wobble fournit le chaos visuel
    cumulative.current = { x: finalX, y: finalY, z: finalZ };
    rotElapsedRef.current = 0;
    rotStartRef.current  = { x: g.rotation.x, y: g.rotation.y, z: g.rotation.z };
    rotTargetRef.current = { x: finalX, y: finalY, z: finalZ };
    g.position.set(throwRef.current.x, BOARD_DICE_THROW_H, throwRef.current.z);
    anim.current = {
      rolling: true,
      elapsed: 0, duration: 1.7, done: false,
      onComplete: onRollComplete,
      wobbleAmp: (Math.random() - 0.5) * 0.18,
      wobbleFreq: 8 + Math.random() * 4,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRolling, targetFace]);

  useFrame((_, delta) => {
    const a = anim.current;
    const g = groupRef.current;
    if (!g) return;

    if (a.rolling && !a.done) {
      a.elapsed = Math.min(a.elapsed + delta, a.duration);
      const t = a.elapsed / a.duration;
      const horizEase = 1 - Math.pow(1 - t, 2);
      // Wobble additif sur la cible Z — s'annule naturellement à t=1
      g.rotation.z = rotTargetRef.current.z + a.wobbleAmp * Math.sin(a.wobbleFreq * t * Math.PI) * (1 - t);
      g.position.x = throwRef.current.x + (landingRef.current.x - throwRef.current.x) * horizEase;
      g.position.z = throwRef.current.z + (landingRef.current.z - throwRef.current.z) * horizEase;
      g.position.y = BOARD_DICE_THROW_H + (BOARD_DICE_REST_Y - BOARD_DICE_THROW_H) * t
                   + BOARD_DICE_ARC_H * Math.sin(Math.PI * t);
      if (t >= 1 && !a.done) {
        a.done = true; a.rolling = false;
        g.position.set(landingRef.current.x, BOARD_DICE_REST_Y, landingRef.current.z);
        // z est déjà à rotTargetRef.z (wobble = 0 à t=1) — pas de reset forcé
        const dx = landingRef.current.x - throwRef.current.x;
        const dz = landingRef.current.z - throwRef.current.z;
        groundVelRef.current = { x: (dx / a.duration) * 0.8, z: (dz / a.duration) * 0.8 };
        // Stopper le smoothstep vol → la slerp slide prend le relais
        rotElapsedRef.current = BOARD_DICE_ROT_DUR;
        bounceRef.current = 0;
        squashRef.current = 1;
        slidingRef.current = true;
        slideTimeRef.current = 0;
        a.onComplete?.();
      }
    }

    // Phase 1 : rebond vertical pur (indépendant du slide)
    if (bounceRef.current < 1) {
      bounceRef.current = Math.min(bounceRef.current + delta / 0.6, 1);
      const b = bounceRef.current;
      const b2 = b > 0.6 ? (b - 0.6) / 0.4 : 0;
      const bounce1 = Math.abs(Math.sin(Math.PI * b * 1.8)) * Math.exp(-b * 5) * 0.35;
      const bounce2 = Math.abs(Math.sin(Math.PI * b2 * 1.4)) * Math.exp(-b2 * 7) * 0.07;
      g.position.y = BOARD_DICE_REST_Y + bounce1 + bounce2;
      if (bounceRef.current >= 1) g.position.y = BOARD_DICE_REST_Y;
    }

    // Squash-stretch à l'impact — subtil, objet rigide pas gélatine
    if (squashRef.current > 0 && dieGroupRef.current) {
      squashRef.current = Math.max(squashRef.current - delta / 0.2, 0);
      const s = 1 - squashRef.current;
      const scaleY  = 1 - 0.08 * Math.sin(Math.PI * s);
      const scaleXZ = 1 + 0.05 * Math.sin(Math.PI * s);
      dieGroupRef.current.scale.set(scaleXZ, scaleY, scaleXZ);
    } else if (squashRef.current === 0 && dieGroupRef.current) {
      dieGroupRef.current.scale.set(1, 1, 1);
    }

    // Phase 2 : slide + rolling (découplé du rebond)
    if (slidingRef.current) {
      const vel = groundVelRef.current;
      slideTimeRef.current += delta;

      // Friction linéaire + clamp dur — coupe la queue infinie
      vel.x -= vel.x * 2.2 * delta;
      vel.z -= vel.z * 2.2 * delta;
      if (Math.hypot(vel.x, vel.z) < 0.03) { vel.x = 0; vel.z = 0; }

      const speed = Math.hypot(vel.x, vel.z);
      if (speed === 0 || slideTimeRef.current > 1.2) {
        vel.x = 0; vel.z = 0;
        slidingRef.current = false; // le bloc rotation lit cet état ci-dessous
      } else {
        g.position.x += vel.x * delta;
        g.position.z += vel.z * delta;
      }
    }

    // Rotation — 3 modes exclusifs, toujours exécutés APRÈS le slide (état à jour)
    if (!lockedRef.current) {
      if (slidingRef.current) {
        // Slerp couplé vitesse — frame-rate independent, coupé sous 0.05 u/s
        const spd = Math.hypot(groundVelRef.current.x, groundVelRef.current.z);
        if (spd > 0.05) {
          const bias = 1 - Math.exp(-8 * delta * (1 + spd));
          g.rotation.x += (rotTargetRef.current.x - g.rotation.x) * bias;
          g.rotation.y += (rotTargetRef.current.y - g.rotation.y) * bias;
          g.rotation.z += (rotTargetRef.current.z - g.rotation.z) * bias;
        }
      } else if (rotElapsedRef.current < BOARD_DICE_ROT_DUR) {
        // Smoothstep vol — avant atterrissage uniquement
        rotElapsedRef.current = Math.min(rotElapsedRef.current + delta, BOARD_DICE_ROT_DUR);
        const rt = rotElapsedRef.current / BOARD_DICE_ROT_DUR;
        const rotEase = rt * rt * (3 - 2 * rt);
        g.rotation.x = rotStartRef.current.x + (rotTargetRef.current.x - rotStartRef.current.x) * rotEase;
        g.rotation.y = rotStartRef.current.y + (rotTargetRef.current.y - rotStartRef.current.y) * rotEase;
        // z géré par le wobble pendant le vol — pas d'interpolation ici
      } else {
        // Verrou discret — slide fini, slerp convergé
        // Conditionné sur l'angle résiduel XYZ pour éviter tout snap visible
        const ex = rotTargetRef.current.x - g.rotation.x;
        const ey = rotTargetRef.current.y - g.rotation.y;
        const ez = rotTargetRef.current.z - g.rotation.z;
        if (Math.sqrt(ex * ex + ey * ey + ez * ez) < 0.05) {
          g.rotation.x = rotTargetRef.current.x;
          g.rotation.y = rotTargetRef.current.y;
          g.rotation.z = rotTargetRef.current.z;
          lockedRef.current = true;
        } else {
          // Cas rare : angle résiduel > seuil → slerp de rattrapage
          const bias = 1 - Math.exp(-8 * delta);
          g.rotation.x += ex * bias;
          g.rotation.y += ey * bias;
          g.rotation.z += ez * bias;
        }
      }
    }
  });

  return (
    <group ref={groupRef} visible={visible}>
      <group ref={dieGroupRef}>
        <mesh geometry={geometry} material={matArray} castShadow receiveShadow />
      </group>
      <mesh position={[0, CELL_H3 - BOARD_DICE_REST_Y + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[BOARD_DICE_S * 0.42, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}
