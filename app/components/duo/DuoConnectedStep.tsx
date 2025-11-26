'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface DuoConnectedStepProps {
  partnerName: string;
  onComplete: () => void;
}

export function DuoConnectedStep({ partnerName, onComplete }: DuoConnectedStepProps) {
  // Auto-avance après 4 secondes
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6"
    >
      {/* Animation des deux cercles qui fusionnent */}
      <div className="relative w-48 h-48 mb-8">
        {/* Cercle gauche (moi) */}
        <motion.div
          initial={{ x: -60, scale: 0.8 }}
          animate={{ x: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-pink-300"
          />
        </motion.div>

        {/* Cercle droit (partenaire) */}
        <motion.div
          initial={{ x: 60, scale: 0.8 }}
          animate={{ x: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 shadow-lg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full bg-purple-300"
          />
        </motion.div>

        {/* Cercle fusionné (apparaît après) */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-violet-500 shadow-xl"
        >
          {/* Pulse effect */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 to-violet-300"
          />
          {/* Coeur au centre */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
            className="absolute inset-0 flex items-center justify-center text-4xl"
          >
            💜
          </motion.div>
        </motion.div>
      </div>

      {/* Texte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Vous êtes connectés
        </h2>
        <p className="text-gray-500 text-lg">
          Prenez un moment ensemble.
        </p>
      </motion.div>

      {/* Indicateur de respiration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-3 h-3 rounded-full bg-purple-300"
        />
      </motion.div>
    </motion.div>
  );
}
