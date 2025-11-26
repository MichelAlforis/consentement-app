'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface DuoWaitingStepProps {
  partnerName: string;
  onPartnerReady: () => void;
}

export function DuoWaitingStep({ partnerName, onPartnerReady }: DuoWaitingStepProps) {
  const [dots, setDots] = useState('');

  // Animation des points
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Simuler le partenaire qui finit après 3-6 secondes
  useEffect(() => {
    const delay = 3000 + Math.random() * 3000;
    const timer = setTimeout(onPartnerReady, delay);
    return () => clearTimeout(timer);
  }, [onPartnerReady]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-6"
    >
      {/* Animation poétique - vagues/respiration */}
      <div className="relative w-64 h-64 mb-8">
        {/* Cercles concentriques qui respirent */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-purple-200"
            style={{
              scale: 0.4 + i * 0.2,
            }}
            animate={{
              scale: [0.4 + i * 0.2, 0.5 + i * 0.2, 0.4 + i * 0.2],
              opacity: [0.3 - i * 0.05, 0.5 - i * 0.05, 0.3 - i * 0.05],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Coeur central qui pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <Heart size={32} className="text-purple-400" fill="#c4b5fd" />
          </div>
        </motion.div>

        {/* Petites particules flottantes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-purple-300"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${30 + Math.random() * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-2xl mb-2">
          Tu as terminé 💜
        </p>
        <motion.p
          className="text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          En attente de {partnerName}{dots}
        </motion.p>
      </motion.div>

      {/* Message poétique */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-sm text-gray-400 italic text-center max-w-xs"
      >
        Chacun avance à son rythme.
        <br />
        C'est ce qui rend ce moment précieux.
      </motion.p>
    </motion.div>
  );
}
