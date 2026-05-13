'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { HeatThermometer } from './HeatThermometer';
import { DURATION, EASING } from '../../constants/motion';
import type { HeatLevel } from '../../lib/heatLevel';
import { computeHeatPoints } from '../../lib/heatLevel';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { useUnlockStore } from '../../stores/unlockStore';

const LEVEL_NAMES_KEY: Record<HeatLevel, string> = {
  1: 'heat.tiede',
  2: 'heat.chaud',
  3: 'heat.ardent',
  4: 'heat.brulant',
  5: 'heat.incandescent',
};

const UNLOCK_DESC_KEY: Record<HeatLevel, string | null> = {
  1: null,
  2: 'heat.palierUp_explicit',
  3: 'heat.palierUp_scenarios',
  4: 'heat.palierUp_kamasutra',
  5: 'heat.palierUp_expert',
};

const LEVEL_COLORS: Record<HeatLevel, string> = {
  1: '#60a5fa',
  2: '#f59e0b',
  3: '#f97316',
  4: '#ef4444',
  5: '#fbbf24',
};

interface PalierUpOverlayProps {
  level: HeatLevel;
  onDismiss: () => void;
}

export function PalierUpOverlay({ level, onDismiss }: PalierUpOverlayProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  const { ownedCards, sessionCount } = useUnlockStore();
  const points = computeHeatPoints({ completedModules, ownedCards, sessionCount });

  const levelName = t(LEVEL_NAMES_KEY[level]);
  const unlockDesc = UNLOCK_DESC_KEY[level] ? t(UNLOCK_DESC_KEY[level]!) : null;
  const fillColor = LEVEL_COLORS[level];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.normal }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-10 bg-black/70 backdrop-blur-[10px]"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: colors.bgCard, border: `1px solid ${fillColor}60` }}
      >
        {/* En-tête : thermomètre + titre */}
        <div className="flex items-center gap-4 mb-5">
          <HeatThermometer points={points} compact />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-0.5"
              style={{ color: fillColor }}>
              {t('heat.palierUp', { palier: levelName })}
            </p>
            <h2 className="text-2xl font-black" style={{ color: colors.textPrimary }}>
              {levelName}
            </h2>
          </div>
        </div>

        {/* Description du déblocage */}
        {unlockDesc && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: DURATION.medium, ease: EASING.standard }}
            className="rounded-2xl p-4 mb-5"
            style={{ background: `${fillColor}15`, border: `1px solid ${fillColor}40` }}
          >
            <p className="text-sm font-semibold" style={{ color: fillColor }}>
              {unlockDesc}
            </p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onDismiss}
          className="w-full py-4 rounded-2xl font-bold text-base text-white"
          style={{ background: `linear-gradient(135deg, ${fillColor}, ${fillColor}cc)` }}
        >
          {t('heat.palierUp_cta')}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
