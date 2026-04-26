'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DynamicIcon } from '../../../../utils/iconFromName';

const CONFETTI_ITEMS = [
  { icon: 'Heart',      color: '#ff6b6b' },
  { icon: 'Sparkles',   color: '#ffd700' },
  { icon: 'Star',       color: '#c084fc' },
  { icon: 'Zap',        color: '#60a5fa' },
  { icon: 'Flame',      color: '#fb923c' },
  { icon: 'Handshake',  color: '#4ade80' },
];

interface ConfettiParticlesProps {
  id: number; // change de valeur à chaque déclenchement → régénère les positions
}

export function ConfettiParticles({ id }: ConfettiParticlesProps) {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      ...CONFETTI_ITEMS[i % CONFETTI_ITEMS.length],
      x: (Math.random() - 0.5) * 400,
      y: -(Math.random() * 560 + 80),
      rotate: (Math.random() - 0.5) * 600,
      scale: 0.6 + Math.random() * 1.0,
      delay: Math.random() * 0.3,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [id]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 300, overflow: 'hidden' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 'calc(50vw - 12px)', y: '60vh', rotate: 0, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: `calc(50vw + ${p.x}px - 12px)`,
            y: `calc(60vh + ${p.y}px)`,
            rotate: p.rotate,
            scale: p.scale,
          }}
          transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1], delay: p.delay }}
          style={{ position: 'absolute' }}
        >
          <DynamicIcon name={p.icon} size={24} color={p.color} />
        </motion.div>
      ))}
    </div>
  );
}
