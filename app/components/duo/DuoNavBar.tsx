'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { DuoStep } from '../../types';

interface DuoNavBarProps {
  currentStep: DuoStep;
  onBack: () => void;
  onReset: () => void;
  onGoToStep: (step: DuoStep) => void;
}

const steps: { key: DuoStep; label: string; short: string }[] = [
  { key: 'choice', label: 'Choix', short: '1' },
  { key: 'bump', label: 'Bump', short: '2' },
  { key: 'connected', label: 'Connectés', short: '3' },
  { key: 'pact', label: 'Pacte', short: '4' },
  { key: 'filling', label: 'Profil', short: '5' },
  { key: 'waiting', label: 'Attente', short: '6' },
  { key: 'ready', label: 'Prêts', short: '7' },
  { key: 'reveal', label: 'Révélation', short: '8' },
  { key: 'summary', label: 'Résumé', short: '9' },
];

export function DuoNavBar({ currentStep, onBack, onReset, onGoToStep }: DuoNavBarProps) {
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/90 backdrop-blur-sm px-3 py-2 flex items-center gap-2 sticky top-0 z-50"
    >
      {/* Bouton retour */}
      <button
        onClick={onBack}
        className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Étapes */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {steps.map((step, idx) => {
          const isActive = step.key === currentStep;
          const isPast = idx < currentIndex;

          return (
            <button
              key={step.key}
              onClick={() => onGoToStep(step.key)}
              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-500 text-white'
                  : isPast
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'
              }`}
            >
              {step.short}
            </button>
          );
        })}
      </div>

      {/* Bouton reset */}
      <button
        onClick={onReset}
        className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-red-900 hover:text-red-300 transition-colors"
        title="Recommencer"
      >
        <RotateCcw size={16} />
      </button>
    </motion.div>
  );
}
