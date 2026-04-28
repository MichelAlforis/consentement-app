'use client';

import { motion } from 'framer-motion';
import { GRAIN_CSS_URL } from '../../utils/grainTexture';

// Grain cinématographique — thème Nude
export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.038] mix-blend-overlay"
      style={{ backgroundImage: GRAIN_CSS_URL }}
    />
  );
}

// Shimmer diagonal — thème Dark Luxury
export function ShimmerLayer({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden z-[1] [border-radius:inherit]"
    >
      <motion.div
        className="absolute inset-y-0 w-2/5 blur-[6px]"
        style={{ background: `linear-gradient(105deg, transparent, ${color}40, ${color}18, transparent)` }}
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
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-[2]"
    >
      <motion.div
        className="absolute inset-y-0 w-2/5 blur-[8px]"
        style={{ background: `linear-gradient(105deg, transparent, ${color}50, transparent)` }}
        animate={{ x: ['-120%', '350%'] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
