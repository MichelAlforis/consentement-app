'use client';

import { motion } from 'framer-motion';
import { Calendar, Sprout, TreeDeciduous, Lock } from 'lucide-react';
import { Card } from '../ui';

interface AgeCheckScreenProps {
  onSelectMinor: () => void;
  onSelectAdult: () => void;
}

export function AgeCheckScreen({ onSelectMinor, onSelectAdult }: AgeCheckScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-200 mb-6 shadow-lg shadow-amber-200/50"
        >
          <Calendar size={40} className="text-amber-600" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Quel âge as-tu ?
        </h2>
        <p className="text-gray-500">
          L'expérience s'adapte à ton âge
        </p>
      </motion.div>

      {/* Options */}
      <div className="flex-1 flex flex-col gap-4">
        <Card onClick={onSelectMinor} variant="elevated" delay={1}>
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center shadow-inner"
            >
              <Sprout size={28} className="text-emerald-600" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">
                J'ai moins de 18 ans
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Accès éducatif, aucun compte requis
              </p>
            </div>
          </div>
        </Card>

        <Card onClick={onSelectAdult} variant="elevated" delay={2}>
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center shadow-inner"
            >
              <TreeDeciduous size={28} className="text-emerald-700" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">
                J'ai 18 ans ou plus
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Accès complet avec authentification
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Privacy note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2"
      >
        <Lock size={14} className="text-gray-400" />
        <p className="text-xs text-gray-400">
          Cette information reste sur ton appareil et n'est jamais partagée
        </p>
      </motion.div>
    </motion.div>
  );
}
