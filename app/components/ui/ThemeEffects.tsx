'use client';

import { motion } from 'framer-motion';

// Grain cinématographique — thème Nude
export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9999,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.038,
        mixBlendMode: 'overlay',
      }}
    />
  );
}

// Shimmer diagonal — thème Dark Luxury
export function ShimmerLayer({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ borderRadius: 'inherit', zIndex: 1 }}
    >
      <motion.div
        className="absolute inset-y-0 w-2/5"
        style={{
          background: `linear-gradient(105deg, transparent, ${color}40, ${color}18, transparent)`,
          filter: 'blur(6px)',
        }}
        animate={{ x: ['-120%', '350%'] }}
        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

// Shimmer statique pour les previews dans ThemeSelectScreen (sans useTheme)
export function PreviewShimmer({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
      style={{ zIndex: 2 }}
    >
      <motion.div
        className="absolute inset-y-0 w-2/5"
        style={{
          background: `linear-gradient(105deg, transparent, ${color}50, transparent)`,
          filter: 'blur(8px)',
        }}
        animate={{ x: ['-120%', '350%'] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
