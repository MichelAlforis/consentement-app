'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface QRCodeProps {
  size?: number;
}

export function QRCode({ size = 120 }: QRCodeProps) {
  // Generate random QR pattern
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
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-3 shadow-2xl shadow-gray-400/30">
        {/* Inner white area */}
        <div className="w-full h-full bg-white rounded-xl p-2 grid grid-cols-7 gap-0.5">
          {pattern.map((filled, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.01, duration: 0.2 }}
              className={`
                rounded-sm aspect-square
                ${filled ? 'bg-gray-800' : 'bg-white'}
              `}
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
          className={`absolute ${pos} w-5 h-5 rounded-md bg-gray-800 flex items-center justify-center`}
        >
          <div className="w-2.5 h-2.5 rounded-sm bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-sm bg-gray-800" />
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
        className="absolute inset-0 rounded-2xl border-2 border-purple-400"
      />
    </motion.div>
  );
}
