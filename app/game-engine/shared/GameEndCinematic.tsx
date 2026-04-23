'use client';
import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles, Float, MeshDistortMaterial, AdaptiveDpr } from '@react-three/drei';

type Intensity = 'low' | 'medium' | 'high';

const INTENSITY = {
  low:    { sparks: 40,  secondarySparks: 0,  orbCount: 2, speed: 1.0, amp: 0.22 },
  medium: { sparks: 80,  secondarySparks: 25, orbCount: 3, speed: 1.5, amp: 0.32 },
  high:   { sparks: 120, secondarySparks: 40, orbCount: 4, speed: 2.2, amp: 0.44 },
};

const ORB_POS: [number, number, number][] = [
  [-2.2,  1.2, -1.0],
  [ 2.0, -0.9, -0.5],
  [-0.8, -1.9, -1.5],
  [ 1.6,  1.7, -1.0],
];

function CentralBlob({ color, speed, amp }: { color: string; speed: number; amp: number }) {
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.25}>
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          distort={amp}
          speed={speed}
          transparent
          opacity={0.15}
          emissive={color}
          emissiveIntensity={0.5}
          depthWrite={false}
        />
      </mesh>
    </Float>
  );
}

function Orb({ pos, color, idx }: { pos: [number, number, number]; color: string; idx: number }) {
  const r = 0.16 + (idx % 3) * 0.07;
  return (
    <Float speed={0.7 + idx * 0.35} floatIntensity={0.7 + idx * 0.2} rotationIntensity={0.15}>
      <mesh position={pos}>
        <sphereGeometry args={[r, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.75} />
        <pointLight color={color} intensity={0.4} distance={2.5} />
      </mesh>
    </Float>
  );
}

interface CinematicSceneProps {
  primaryColor: string;
  secondaryColor: string;
  intensity: Intensity;
}

function CinematicScene({ primaryColor, secondaryColor, intensity }: CinematicSceneProps) {
  const cfg = INTENSITY[intensity];
  const orbColors = useMemo(
    () => ORB_POS.slice(0, cfg.orbCount).map((_, i) => (i % 2 === 0 ? primaryColor : secondaryColor)),
    [primaryColor, secondaryColor, cfg.orbCount],
  );

  return (
    <>
      <ambientLight intensity={0.05} />
      <CentralBlob color={primaryColor} speed={cfg.speed} amp={cfg.amp} />
      {ORB_POS.slice(0, cfg.orbCount).map((pos, i) => (
        <Orb key={i} pos={pos} color={orbColors[i]} idx={i} />
      ))}
      <Sparkles count={cfg.sparks} scale={[7, 9, 5]} size={1.6} speed={0.35} color={primaryColor} opacity={0.85} />
      {cfg.secondarySparks > 0 && (
        <Sparkles count={cfg.secondarySparks} scale={[6, 8, 4]} size={1.1} speed={0.25} color={secondaryColor} opacity={0.6} />
      )}
      <AdaptiveDpr pixelated />
    </>
  );
}

export interface GameEndCinematicProps {
  primaryColor: string;
  secondaryColor: string;
  intensity?: Intensity;
}

export function GameEndCinematic({ primaryColor, secondaryColor, intensity = 'medium' }: GameEndCinematicProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
        style={{ background: 'transparent' }}
        camera={{ position: [0, 0, 5], fov: 60 }}
      >
        <CinematicScene primaryColor={primaryColor} secondaryColor={secondaryColor} intensity={intensity} />
      </Canvas>
    </div>
  );
}
