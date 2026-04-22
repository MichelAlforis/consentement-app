'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { DuoStep } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface DuoNavBarProps {
  currentStep: DuoStep;
  onBack: () => void;
  onReset: () => void;
  onGoToStep: (step: DuoStep) => void;
}

const steps: { key: DuoStep; label: string }[] = [
  { key: 'choice', label: 'Connexion' },
  { key: 'bump', label: 'Bump' },
  { key: 'qr-fallback', label: 'QR Code' },
  { key: 'connected', label: 'Connectés' },
  { key: 'pact', label: 'Pacte' },
  { key: 'filling', label: 'Profil' },
  { key: 'waiting', label: 'Attente' },
  { key: 'ready', label: 'Prêts' },
  { key: 'reveal', label: 'Révélation' },
  { key: 'summary', label: 'Résumé' },
];

export function DuoNavBar({ currentStep, onBack, onReset }: DuoNavBarProps) {
  const { colors } = useTheme();
  const currentIndex = steps.findIndex(s => s.key === currentStep);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const progress = (safeIndex / (steps.length - 1)) * 100;
  const stepLabel = steps[safeIndex]?.label ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-sm px-3 py-2.5 sticky top-0 z-50"
      style={{ background: colors.bgCard, borderBottom: `1px solid ${colors.divider}` }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl transition-opacity hover:opacity-70 shrink-0"
          style={{ background: colors.bgSecondary, color: colors.textSecondary }}
          aria-label="Retour"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold" style={{ color: colors.textPrimary }}>
              {stepLabel}
            </span>
            <span className="text-xs tabular-nums" style={{ color: colors.textMuted }}>
              {safeIndex + 1} / {steps.length}
            </span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: colors.bgSecondary }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: colors.accentGradient }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>

        <button
          onClick={onReset}
          className="p-2 rounded-xl transition-opacity hover:opacity-70 shrink-0"
          style={{ background: colors.bgSecondary, color: colors.textSecondary }}
          title="Recommencer"
          aria-label="Recommencer"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </motion.div>
  );
}
