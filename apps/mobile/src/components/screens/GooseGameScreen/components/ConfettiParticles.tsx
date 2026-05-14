import { useMemo } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Heart, Sparkles, Star, Zap, Handshake } from 'lucide-react-native';
import type { ComponentType } from 'react';

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

const CONFETTI_ITEMS: { Icon: LucideIcon; color: string }[] = [
  { Icon: Heart,     color: '#ff6b6b' },
  { Icon: Sparkles,  color: '#ffd700' },
  { Icon: Star,      color: '#c084fc' },
  { Icon: Zap,       color: '#60a5fa' },
  { Icon: Handshake, color: '#4ade80' },
];

interface ConfettiParticlesProps {
  id: number;
}

export function ConfettiParticles({ id }: ConfettiParticlesProps) {
  const { width, height } = useWindowDimensions();

  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      ...CONFETTI_ITEMS[i % CONFETTI_ITEMS.length],
      x: (Math.random() - 0.5) * 400,
      y: -(Math.random() * 560 + 80),
      rotate: (Math.random() - 0.5) * 600,
      scale: 0.6 + Math.random() * 1.0,
      delay: Math.random() * 300,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [id]);

  const originX = width / 2 - 12;
  const originY = height * 0.6;

  return (
    <>
      {particles.map(p => (
        <MotiView
          key={p.id}
          from={{ opacity: 1, translateX: originX, translateY: originY, rotate: '0deg', scale: 0 }}
          animate={{
            opacity: 0,
            translateX: originX + p.x,
            translateY: originY + p.y,
            rotate: `${p.rotate}deg`,
            scale: p.scale,
          }}
          transition={{ type: 'timing', duration: 1600, delay: p.delay }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <p.Icon size={24} color={p.color} />
        </MotiView>
      ))}
    </>
  );
}
