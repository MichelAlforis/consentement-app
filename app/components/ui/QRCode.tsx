'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface QRCodeProps {
  size?: number;
}

export function QRCode({ size = 120 }: QRCodeProps) {
  const { colors } = useTheme();
  const pattern = useMemo(() => {
    return Array.from({ length: 49 }, () => Math.random() > 0.4);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'backOut' }}
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Outer frame */}
      <div className="absolute inset-0 rounded-2xl p-3 shadow-2xl" style={{ background: colors.bgSecondary }}>
        {/* Inner area */}
        <div className="w-full h-full rounded-xl p-2 grid grid-cols-7 gap-0.5" style={{ background: colors.bgCard }}>
          {pattern.map((filled, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.01, duration: 0.2 }}
              className="rounded-sm aspect-square"
              style={{ background: filled ? colors.textPrimary : colors.bgCard }}
            />
          ))}
        </div>
      </div>

      {/* Corner markers */}
      {[
        'top-3 left-3',
        'top-3 right-3',
        'bottom-3 left-3',
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-5 h-5 rounded-md flex items-center justify-center`}
          style={{ background: colors.textPrimary }}
        >
          <div className="w-2.5 h-2.5 rounded-sm flex items-center justify-center" style={{ background: colors.bgCard }}>
            <div className="w-1.5 h-1.5 rounded-sm" style={{ background: colors.textPrimary }} />
          </div>
        </div>
      ))}

      {/* Pulsing animation ring */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 rounded-2xl border-2"
        style={{ borderColor: colors.accent }}
      />
    </motion.div>
  );
}
