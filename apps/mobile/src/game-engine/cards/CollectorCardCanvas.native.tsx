import {
  useRef, useMemo, useState, useEffect, useCallback,
  Suspense, Component, type ReactNode,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { DeviceMotion } from 'expo-sensors';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { ContactShadows } from '@react-three/drei/native';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { GainedCard } from '@ouiclair/core';
import { DURATION, RADIUS } from '@ouiclair/core';
import { useHaptics } from '../shared/useHaptics';
import { PositionSVG } from '../../components/ui/PositionSVG';

// ─── Eases ────────────────────────────────────────────────────────────────────

function easeOutSnap(t: number): number {
  return 1 + 2 * Math.pow(t - 1, 3) + Math.pow(t - 1, 2);
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function parseGradient(gradient: string): [string, string] {
  const m = gradient.match(/#[0-9a-fA-F]{6}/g) ?? ['#7c3aed', '#a855f7'];
  return [m[0], m[1] ?? m[0]];
}

// Remplace document.createElement('canvas') — DataTexture gradient 64×1px
function makeGradientDataTexture(
  color1: string,
  color2: string,
  size = 64,
): THREE.DataTexture {
  const data = new Uint8Array(size * 4);
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  for (let i = 0; i < size; i++) {
    const t = i / (size - 1);
    data[i * 4 + 0] = Math.round(r1 * (1 - t) + r2 * t);
    data[i * 4 + 1] = Math.round(g1 * (1 - t) + g2 * t);
    data[i * 4 + 2] = Math.round(b1 * (1 - t) + b2 * t);
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// DataTexture dos — gradient quasi-noir → indigo → violet saturé
function makeBackDataTexture(): THREE.DataTexture {
  return makeGradientDataTexture('#010007', '#3b1f85');
}

// DataTexture face — gradient depuis card.gradient
function makeFaceDataTexture(card: GainedCard): THREE.DataTexture {
  const [c1, c2] = parseGradient(card.gradient);
  return makeGradientDataTexture(c1, c2);
}

function makeRoundedCardGeometry(w: number, h: number, r: number): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  const hw = w / 2, hh = h / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  shape.closePath();
  const geo = new THREE.ShapeGeometry(shape, 8);
  const pos = geo.attributes.position;
  const uv  = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + hw) / w, (pos.getY(i) + hh) / h);
  }
  uv.needsUpdate = true;
  return geo;
}

// ─── Particles unique ─────────────────────────────────────────────────────────

function UniqueParticles() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 12;

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2;
      pos[i * 3]     = Math.cos(angle) * 0.72;
      pos[i * 3 + 1] = Math.sin(angle) * 1.08;
      pos[i * 3 + 2] = 0.01;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * 0.22;
    (ref.current.material as THREE.PointsMaterial).opacity = 0.55 + Math.sin(t * 1.8) * 0.18;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#f6d36a" size={0.042} transparent opacity={0.65} sizeAttenuation toneMapped={false} />
    </points>
  );
}

// ─── RarityGlowRing ───────────────────────────────────────────────────────────

function RarityGlowRing({ rarity }: { rarity: GainedCard['rarity'] }) {
  const glowRef  = useRef<THREE.MeshBasicMaterial>(null);
  const glowGeom = useMemo(() => makeRoundedCardGeometry(1.06, 1.58, 0.16), []);

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    if (rarity === 'rare') {
      glowRef.current.opacity = 0.30 + Math.sin(clock.getElapsedTime() * 1.4) * 0.08;
    } else if (rarity === 'unique') {
      glowRef.current.opacity = 0.55 + Math.sin(clock.getElapsedTime() * 0.9) * 0.10;
    }
  });

  if (rarity === 'common') return null;

  return (
    <mesh position={[0, 0, -0.005]} geometry={glowGeom}>
      <meshBasicMaterial
        ref={glowRef}
        color={rarity === 'unique' ? '#f6d36a' : '#7c3aed'}
        transparent
        opacity={0.4}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── CardMesh ─────────────────────────────────────────────────────────────────

export interface CardMeshProps {
  card: GainedCard;
  isFlipped: boolean;
  autoFlip?: boolean;
  onFlipComplete?: () => void;
}

export function CardMesh({
  card, isFlipped, autoFlip, onFlipComplete,
}: CardMeshProps) {
  const outerRef  = useRef<THREE.Group>(null);
  const flipRef   = useRef<THREE.Group>(null);
  const styleRef  = useRef<THREE.Group>(null);
  const idleT     = useRef(0);

  const geometry      = useMemo(() => makeRoundedCardGeometry(1, 1.5, 0.15), []);
  const glowGeometry  = useMemo(() => makeRoundedCardGeometry(1.06, 1.58, 0.16), []);
  const glowGeometry2 = useMemo(() => makeRoundedCardGeometry(1.14, 1.68, 0.17), []);

  const backTex = useMemo(() => makeBackDataTexture(), []);
  const faceTex = useMemo(() => makeFaceDataTexture(card), [card]);

  const isUnique = card.rarity === 'unique';
  const isRare   = card.rarity === 'rare';

  // V4 divergence: gpuTier non disponible sur mobile → pas de PBR foil
  const backMat = useMemo(() => new THREE.MeshBasicMaterial({ map: backTex }), [backTex]);
  const faceMat = useMemo(() => new THREE.MeshBasicMaterial({ map: faceTex }), [faceTex]);

  const glowMat2Ref   = useRef<THREE.MeshBasicMaterial>(null);
  const uniqueGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const revealAnim    = useRef({ active: true, elapsed: 0, duration: DURATION.medium });

  const { vibrate } = useHaptics();

  const anim = useRef({
    active: false, startRot: 0, targetRot: 0,
    elapsed: 0, duration: DURATION.cardFlipRare as number, done: true,
    bouncing: false, bounceElapsed: 0,
    onComplete: undefined as (() => void) | undefined,
  });

  const flipDuration = card.rarity === 'unique' ? DURATION.cardFlipUnique : card.rarity === 'rare' ? DURATION.cardFlipRare : DURATION.cardFlipCommon;

  const triggerFlip = useCallback((toFace: boolean, cb?: () => void) => {
    const flip = flipRef.current;
    if (!flip) return;
    vibrate('light');
    anim.current = {
      active: true, startRot: flip.rotation.y,
      targetRot: toFace ? Math.PI : 0,
      elapsed: 0, duration: flipDuration, done: false,
      bouncing: false, bounceElapsed: 0,
      onComplete: () => {
        if (toFace) {
          if (card.rarity === 'unique')    vibrate('heavy');
          else if (card.rarity === 'rare') vibrate('medium');
          else                             vibrate('light');
        } else {
          vibrate('light');
        }
        cb?.();
      },
    };
  }, [card.rarity, flipDuration, vibrate]);

  const prevFlipped = useRef<boolean | null>(null);
  useEffect(() => {
    if (prevFlipped.current === null) {
      prevFlipped.current = isFlipped;
      if (isFlipped) triggerFlip(true, onFlipComplete);
      return;
    }
    if (prevFlipped.current !== isFlipped) {
      prevFlipped.current = isFlipped;
      triggerFlip(isFlipped, onFlipComplete);
    }
  }, [isFlipped, triggerFlip, onFlipComplete]);

  useEffect(() => {
    if (!autoFlip) return;
    const t = setTimeout(() => triggerFlip(true, onFlipComplete), 800);
    return () => clearTimeout(t);
  }, [autoFlip, triggerFlip, onFlipComplete]);

  useFrame(({ clock }, delta) => {
    const outer = outerRef.current;
    const flip  = flipRef.current;
    const style = styleRef.current;
    const a = anim.current;
    const rv = revealAnim.current;
    if (!outer || !flip || !style) return;

    if (rv.active) {
      rv.elapsed = Math.min(rv.elapsed + delta, rv.duration);
      outer.position.y = -3 + 3 * easeOutCubic(rv.elapsed / rv.duration);
      if (rv.elapsed >= rv.duration) { rv.active = false; outer.position.y = 0; }
      return;
    }

    if (isRare && glowMat2Ref.current) {
      glowMat2Ref.current.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 1.4) * 0.06;
    }

    if (isUnique && uniqueGlowRef.current) {
      uniqueGlowRef.current.color.setHSL((clock.getElapsedTime() * 25 % 360) / 360, 1.0, 0.65);
    }

    if (a.active && !a.done) {
      a.elapsed = Math.min(a.elapsed + delta, a.duration);
      const t = a.elapsed / a.duration;
      flip.rotation.y  = a.startRot + (a.targetRot - a.startRot) * easeOutSnap(t);
      outer.rotation.z = Math.sin(Math.PI * t) * 0.04;
      outer.position.y = -Math.sin(Math.PI * t) * 0.18;

      if (t >= 1) {
        a.done = true; a.active = false;
        outer.rotation.z = 0;
        outer.position.y = 0;
        a.bouncing = true; a.bounceElapsed = 0;
        a.onComplete?.();
      }
    }

    if (a.bouncing) {
      a.bounceElapsed = Math.min(a.bounceElapsed + delta, DURATION.normal);
      const b = a.bounceElapsed / DURATION.normal;
      const sy = b < 0.40
        ? 1 - 0.04 * (b / 0.40)
        : b < 0.75
        ? 0.96 + 0.06 * ((b - 0.40) / 0.35)
        : 1.02 - 0.02 * ((b - 0.75) / 0.25);
      const sx = 1 + (1 - sy) * 0.5;
      style.scale.set(sx, sy, 1);
      if (b >= 1) { a.bouncing = false; style.scale.set(1, 1, 1); }
    }

    if (!a.active && !a.bouncing) {
      idleT.current += delta;
      if (isUnique) {
        outer.scale.setScalar(1 + Math.sin(idleT.current * 1.2) * 0.006);
      } else if (isRare) {
        outer.position.y = Math.sin(idleT.current * 0.8) * 0.015;
      } else {
        outer.scale.setScalar(1);
        outer.position.y = 0;
      }
    }
  });

  return (
    <group ref={outerRef}>
      {isUnique && <UniqueParticles />}
      <group ref={flipRef}>
        <group ref={styleRef}>
          {/* Dos */}
          <mesh geometry={geometry} material={backMat} position={[0, 0, 0.001]} />
          {/* Face */}
          <group rotation={[0, Math.PI, 0]}>
            {isRare && (
              <mesh geometry={glowGeometry} position={[0, 0, -0.003]}>
                <meshBasicMaterial color={card.border} toneMapped={false} transparent opacity={0.38} />
              </mesh>
            )}
            {isUnique && (
              <mesh geometry={glowGeometry} position={[0, 0, -0.003]}>
                <meshBasicMaterial ref={uniqueGlowRef} color={card.border} toneMapped={false} transparent opacity={0.55} />
              </mesh>
            )}
            {isRare && (
              <mesh geometry={glowGeometry2} position={[0, 0, -0.006]}>
                <meshBasicMaterial ref={glowMat2Ref} color={card.border} toneMapped={false} transparent opacity={0.12} />
              </mesh>
            )}
            <mesh geometry={geometry} material={faceMat} position={[0, 0, 0.001]} />
          </group>
        </group>
      </group>
    </group>
  );
}

// ─── CardScene ────────────────────────────────────────────────────────────────

function CardScene({
  card, isFlipped, autoFlip, onFlipComplete,
}: {
  card: GainedCard;
  isFlipped: boolean;
  autoFlip?: boolean;
  onFlipComplete?: () => void;
}) {
  return (
    <>
      <RarityGlowRing rarity={card.rarity} />
      <Suspense fallback={null}>
        <CardMesh
          card={card}
          isFlipped={isFlipped}
          autoFlip={autoFlip}
          onFlipComplete={onFlipComplete}
        />
        <ContactShadows
          position={[0, -0.80, 0]}
          opacity={0.45}
          blur={2.0}
          far={2.0}
          scale={3}
          frames={1}
          resolution={128}
        />
      </Suspense>
      {/* W-BLOOM: mipmapBlur=false — crash expo-gl sur simulateur, à re-tester sur device physique */}
      <PostFXBoundary>
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.45} luminanceSmoothing={0.5} mipmapBlur={false} />
          <Vignette eskil={false} offset={0.42} darkness={0.45} />
        </EffectComposer>
      </PostFXBoundary>
    </>
  );
}

// ─── PostFXBoundary ───────────────────────────────────────────────────────────

class PostFXBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

// ─── CanvasBoundary ───────────────────────────────────────────────────────────

class CanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidCatch(err: unknown) {
    if (process.env.NODE_ENV === 'development') console.warn('[CollectorCard] expo-gl/R3F error →', err);
  }
  render() { return this.state.crashed ? this.props.fallback : this.props.children; }
}

// ─── Face overlay RN — contenu de la carte (icône + texte + badges) ──────────
// Rendu par-dessus le Canvas, visible uniquement après le flip R3F.

function CardIconRN({ iconName, size, color }: { iconName: string; size: number; color: string }) {
  // Inline switch pour éviter de dépendre de DynamicIcon (DOM-only)
  switch (iconName) {
    case 'Layers':       return <Text style={{ fontSize: size, color }}>◫</Text>;
    case 'MessageCircle': return <Text style={{ fontSize: size, color }}>💬</Text>;
    case 'HelpCircle':   return <Text style={{ fontSize: size, color }}>❓</Text>;
    case 'Target':       return <Text style={{ fontSize: size, color }}>🎯</Text>;
    case 'Sparkles':     return <Text style={{ fontSize: size, color }}>✨</Text>;
    case 'Heart':        return <Text style={{ fontSize: size, color }}>♥</Text>;
    case 'Flame':        return <Text style={{ fontSize: size, color }}>🔥</Text>;
    default:             return <Text style={{ fontSize: size, color }}>✦</Text>;
  }
}

function FaceOverlay({ card, size }: { card: GainedCard; size: number }) {
  const h = Math.round(size * 1.5);
  const themeLabel = (card as unknown as Record<string, unknown>).themeName as string
    ?? (card as unknown as Record<string, unknown>).theme as string
    ?? '';

  return (
    <View style={[faceStyles.root, { width: size, height: h }]} pointerEvents="none">
      {/* Badge thème haut-gauche */}
      {themeLabel ? (
        <View style={faceStyles.themeBadge}>
          <CardIconRN iconName={card.iconName} size={size * 0.045 * 2} color="rgba(255,255,255,0.78)" />
          <Text style={[faceStyles.themeBadgeText, { fontSize: Math.round(size * 0.042) }]}>
            {themeLabel.toUpperCase()}
          </Text>
        </View>
      ) : null}

      {/* Badge rareté haut-droit */}
      {card.rarity !== 'common' ? (
        <View style={[
          faceStyles.rarityBadge,
          card.rarity === 'unique'
            ? faceStyles.rarityBadgeUnique
            : faceStyles.rarityBadgeRare,
        ]}>
          <Text style={[
            faceStyles.rarityBadgeText,
            { fontSize: Math.round(size * 0.069), color: card.rarity === 'unique' ? '#f6d36a' : '#fff' },
          ]}>
            {card.rarity === 'unique' ? 'UNIQUE' : 'RARE'}
          </Text>
        </View>
      ) : null}

      {/* Icône ou PositionSVG centrale */}
      <View style={[faceStyles.iconCenter, { top: `${43}%` as unknown as number }]}>
        {card.positionKey
          ? <PositionSVG positionKey={card.positionKey} size={Math.round(size * 0.26 * 1.6)} />
          : <CardIconRN iconName={card.iconName} size={Math.round(size * 0.26)} color="rgba(255,255,255,0.88)" />
        }
      </View>

      {/* Panneau texte */}
      <View style={[
        faceStyles.textPanel,
        {
          top: `${66}%` as unknown as number,
          left: size * 0.075,
          right: size * 0.075,
          height: `${30}%` as unknown as number,
          borderRadius: Math.round(size * 0.05),
          padding: Math.round(size * 0.045),
        },
      ]}>
        <Text
          style={[faceStyles.cardText, { fontSize: Math.round(size * 0.082) }]}
          numberOfLines={4}
        >
          {card.text}
        </Text>
      </View>
    </View>
  );
}

const faceStyles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0, left: 0,
    overflow: 'hidden',
    borderRadius: 14,
  },
  themeBadge: {
    position: 'absolute',
    top: '5.8%',
    left: '7.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  themeBadgeText: {
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rarityBadge: {
    position: 'absolute',
    top: '4.6%',
    right: '7.5%',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rarityBadgeRare: {
    backgroundColor: '#7c3aed',
  },
  rarityBadgeUnique: {
    backgroundColor: '#2b1e0f',
    borderWidth: 1,
    borderColor: 'rgba(246,211,106,0.55)',
  },
  rarityBadgeText: {
    fontWeight: '600',
  },
  iconCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -24 }],
  },
  textPanel: {
    position: 'absolute',
    backgroundColor: 'rgba(5,5,12,0.52)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    margin: 0,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.90)',
    lineHeight: 20,
    textAlign: 'center',
  },
});

// ─── RN fallback — carte entièrement en RN quand WebGL crash ─────────────────

function NativeCardFallback({ card, isFlipped, size = 160 }: { card: GainedCard; isFlipped: boolean; size?: number }) {
  const h = Math.round(size * 1.5);
  const [c1] = parseGradient(card.gradient);

  const flipAnim = useSharedValue(isFlipped ? 1 : 0);
  useEffect(() => {
    flipAnim.value = withTiming(isFlipped ? 1 : 0, { duration: 600 });
  }, [isFlipped]); // eslint-disable-line react-hooks/exhaustive-deps

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 800 }, { rotateY: `${flipAnim.value * 180}deg` }],
    opacity: flipAnim.value < 0.5 ? 1 : 0,
    backfaceVisibility: 'hidden' as const,
  }));

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 800 }, { rotateY: `${flipAnim.value * 180 + 180}deg` }],
    opacity: flipAnim.value >= 0.5 ? 1 : 0,
    backfaceVisibility: 'hidden' as const,
  }));

  return (
    <View style={{ width: size, height: h, position: 'relative' }}>
      {/* Dos */}
      <Animated.View style={[
        StyleSheet.absoluteFillObject,
        { borderRadius: 14, backgroundColor: '#0c0920', borderWidth: 2, borderColor: 'rgba(255,255,255,0.16)' },
        backStyle,
      ]}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, fontWeight: '900', color: 'rgba(255,255,255,0.05)' }}>C</Text>
        </View>
      </Animated.View>

      {/* Face */}
      <Animated.View style={[
        StyleSheet.absoluteFillObject,
        { borderRadius: 14, backgroundColor: c1, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.10)' },
        frontStyle,
      ]}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: size * 0.08 }}>
          <Text style={{ color: 'rgba(255,255,255,0.90)', fontWeight: '700', fontSize: Math.round(size * 0.082), textAlign: 'center', lineHeight: 20 }} numberOfLines={4}>
            {card.text}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Shimmer + gyro overlay ───────────────────────────────────────────────────

function LightOverlay({ rarity, isFlipped, size = 160 }: { rarity: string; isFlipped: boolean; size?: number }) {
  const shimmerX  = useSharedValue(-1.1);
  const gyroOpacity = useSharedValue(0);

  // Shimmer sweep — 3 passages après révélation, puis s'arrête
  useEffect(() => {
    if (!isFlipped) {
      shimmerX.value = -1.1;
      return;
    }
    shimmerX.value = withDelay(550,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: rarity === 'unique' ? 1000 : 1300, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
          withTiming(-1.1, { duration: 0 }),
        ),
        3,
        false,
      ),
    );
  }, [isFlipped, rarity]); // eslint-disable-line react-hooks/exhaustive-deps

  // Gyroscope via expo-sensors
  useEffect(() => {
    if (!isFlipped || size < 140) return;
    const sub = DeviceMotion.addListener((data) => {
      if (!data.rotation) return;
      // gamma = z, beta = x en DeviceMotion — approximation portrait
      const gamma = (data.rotation.gamma ?? 0) * (180 / Math.PI);
      const beta  = (data.rotation.beta  ?? 0) * (180 / Math.PI);
      const x = Math.min(100, Math.max(0, 50 + (gamma / 30) * 35));
      const y = Math.min(100, Math.max(0, 50 - ((beta - 60) / 30) * 30));
      void x; void y; // used in gradient string below
      gyroOpacity.value = withTiming(1, { duration: 400 });
    });
    DeviceMotion.setUpdateInterval(16);
    return () => sub.remove();
  }, [isFlipped, size]); // eslint-disable-line react-hooks/exhaustive-deps

  const shimmerColor =
    rarity === 'unique'
      ? 'rgba(255,200,80,0.22)'
      : rarity === 'rare'
      ? 'rgba(192,132,252,0.30)'
      : 'rgba(255,255,255,0.20)';

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value * size }],
  }));

  const h = Math.round(size * 1.5);

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: h, overflow: 'hidden', borderRadius: RADIUS.card, pointerEvents: 'none' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0, bottom: 0,
            width: '100%',
            backgroundColor: shimmerColor,
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
}

// ─── Export public ────────────────────────────────────────────────────────────

export interface CollectorCardCanvasProps {
  card: GainedCard;
  isFlipped: boolean;
  size?: number;
  autoFlip?: boolean;
  onFlipComplete?: () => void;
}

export function CollectorCardCanvas({
  card, isFlipped, size = 160, autoFlip, onFlipComplete,
}: CollectorCardCanvasProps) {
  const [mounted, setMounted]     = useState(false);
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>('always');
  const [isFaceVisible, setIsFaceVisible] = useState(isFlipped);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { setFrameloop('always'); }, [isFlipped, autoFlip]);

  const handleFlipComplete = useCallback(() => {
    if (card.rarity === 'common') setFrameloop('demand');
    setIsFaceVisible(isFlipped);
    onFlipComplete?.();
  }, [card.rarity, isFlipped, onFlipComplete]);

  // Sync face visibility with isFlipped (back-flip case)
  useEffect(() => {
    if (!isFlipped) setIsFaceVisible(false);
  }, [isFlipped]);

  const w = size;
  const h = Math.round(size * 1.5);
  const fallback = <NativeCardFallback card={card} isFlipped={isFlipped} size={size} />;

  return (
    <View style={{ width: w, height: h, position: 'relative', overflow: 'hidden' }}>
      {mounted ? (
        <CanvasBoundary fallback={fallback}>
          <Canvas
            style={{ width: w, height: h }}
            gl={{
              antialias: true,
              powerPreference: 'low-power',
              toneMapping: THREE.NeutralToneMapping,
              toneMappingExposure: 1.0,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            frameloop={frameloop}
            camera={{ position: [0, 0, 2.2], fov: 45 }}
          >
            <color attach="background" args={['#0a0810']} />
            <CardScene
              card={card}
              isFlipped={isFlipped}
              autoFlip={autoFlip}
              onFlipComplete={handleFlipComplete}
            />
          </Canvas>
        </CanvasBoundary>
      ) : fallback}

      {/* Face overlay — contenu textuel visible uniquement face-up */}
      {isFaceVisible && <FaceOverlay card={card} size={size} />}

      {/* Shimmer + gyro */}
      <LightOverlay rarity={card.rarity} isFlipped={isFlipped} size={size} />
    </View>
  );
}
