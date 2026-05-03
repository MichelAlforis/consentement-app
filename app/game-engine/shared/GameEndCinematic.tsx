'use client';
import { useMemo, useState, useEffect, Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Sparkles, Float, MeshDistortMaterial, AdaptiveDpr, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useRenderMode } from '../../hooks/useRenderMode';

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

// ─── R3F components ───────────────────────────────────────────────────────────

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
          toneMapped={false}
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
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.75} toneMapped={false} />
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
      <Environment preset="night" environmentIntensity={0.15} />
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

// Silently swallows WebGL init failures so the UI stays visible without the cinematic.
class CanvasBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() { return this.state.crashed ? null : this.props.children; }
}

// ─── CSS cinematic — GPU tier 0-1, zéro WebGL ────────────────────────────────

// LCG déterministe : positions stables entre re-renders, indépendant de Math.random()
function makeLCG(seed: number) {
  let s = seed | 0;
  // Arithmétique entière 32-bit pure — pas de Math.imul, compatible Chromium 37 / Huawei WebView
  return () => { s = (s * 1664525 + 1013904223) | 0; return (s >>> 0) / 0xffffffff; };
}

interface SparkSpec { id: number; x: number; y: number; size: number; delay: number; dur: number }

function buildSparks(count: number, seed: number): SparkSpec[] {
  const r = makeLCG(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x:    Math.round(r() * 90 + 5),
    y:    Math.round(r() * 86 + 7),
    size: 1 + Math.round(r() * 2.5),
    delay: Math.round(r() * 30) / 10,
    dur:  15 + Math.round(r() * 20) / 10,
  }));
}

// Positions des orbes CSS : mappées depuis ORB_POS 3D → plan 2D %
const CSS_ORB_BASE = [
  { x: 28, y: 36 },
  { x: 72, y: 63 },
  { x: 37, y: 67 },
  { x: 66, y: 27 },
] as const;

// Pré-calculé au chargement du module (pas par render)
const CSS_SPARKS = {
  low:    buildSparks(16, 42),
  medium: buildSparks(24, 137),
  high:   buildSparks(36, 999),
};
const CSS_SECONDARY_SPARKS = {
  low:    [] as SparkSpec[],
  medium: buildSparks(8, 17),
  high:   buildSparks(14, 77),
};

function GameEndCinematicCSS({
  primaryColor, secondaryColor, intensity = 'medium', darkOverlay = false,
}: GameEndCinematicProps) {
  const cfg     = INTENSITY[intensity];
  const sparks  = CSS_SPARKS[intensity];
  const sparks2 = CSS_SECONDARY_SPARKS[intensity];
  const orbs    = CSS_ORB_BASE.slice(0, cfg.orbCount);
  const blobDur = parseFloat((3 / cfg.speed).toFixed(2));

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {darkOverlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,5,20,0.74) 0%, rgba(4,2,10,0.86) 100%)',
        }} />
      )}

      {/* Blob central — analogue de MeshDistortMaterial opacity 0.15 */}
      <motion.div
        animate={{ scale: [0.88, 1.18, 0.88], opacity: [0.07, 0.17, 0.07] }}
        transition={{ duration: blobDur, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '14%', top: '16%', right: '14%', bottom: '16%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 50%, ${primaryColor} 0%, transparent 70%)`,
          filter: 'blur(36px)',
          WebkitFilter: 'blur(36px)',
        }}
      />

      {/* Orbes flottants — analogues aux Float/mesh/pointLight */}
      {orbs.map((orb, i) => {
        const color   = i % 2 === 0 ? primaryColor : secondaryColor;
        const orbSize = 10 + (i % 3) * 6;
        return (
          <motion.div
            key={i}
            animate={{
              y: ['-14px', '14px', '-14px'],
              x: ['-8px',  '8px',  '-8px'],
            }}
            transition={{ duration: 1.8 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.45 }}
            style={{
              position: 'absolute',
              left: `${orb.x}%`, top: `${orb.y}%`,
              width: orbSize, height: orbSize,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 ${orbSize}px ${color}, 0 0 ${orbSize * 2.5}px ${color}55`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {/* Étincelles primaires — analogues à Sparkles */}
      {sparks.map(p => (
        <motion.div
          key={p.id}
          animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.1, 0.3] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: primaryColor,
            boxShadow: `0 0 ${p.size * 2}px ${primaryColor}`,
          }}
        />
      ))}

      {/* Étincelles secondaires */}
      {sparks2.map(p => (
        <motion.div
          key={p.id}
          animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1, 0.3] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay + 0.35, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: secondaryColor,
            boxShadow: `0 0 ${p.size * 2}px ${secondaryColor}`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Export public ────────────────────────────────────────────────────────────

export interface GameEndCinematicProps {
  primaryColor: string;
  secondaryColor: string;
  intensity?: Intensity;
  darkOverlay?: boolean;
}

export function GameEndCinematic({ primaryColor, secondaryColor, intensity = 'medium', darkOverlay = false }: GameEndCinematicProps) {
  const renderMode = useRenderMode();
  // Tous les hooks appelés inconditionnellement (rules of hooks)
  // Defer Canvas mount: AnimatePresence swaps views synchronously on iOS —
  // the parent has no dimensions yet at that instant. 60ms lets layout settle.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (renderMode !== 'r3f') return;
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [renderMode]);

  if (renderMode === 'css') {
    return (
      <GameEndCinematicCSS
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        intensity={intensity}
        darkOverlay={darkOverlay}
      />
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {darkOverlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,5,20,0.74) 0%, rgba(4,2,10,0.86) 100%)',
        }} />
      )}
      {mounted && (
        <CanvasBoundary>
          <Canvas
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'low-power',
              failIfMajorPerformanceCaveat: false,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            frameloop="always"
            style={{ background: 'transparent' }}
            camera={{ position: [0, 0, 5], fov: 60 }}
          >
            <CinematicScene primaryColor={primaryColor} secondaryColor={secondaryColor} intensity={intensity} />
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}
