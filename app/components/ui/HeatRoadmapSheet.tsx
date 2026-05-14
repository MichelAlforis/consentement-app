'use client';

import { motion } from 'framer-motion';
import { X, Check, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { HEAT_THRESHOLDS } from '../../lib/heatLevel';
import type { HeatLevel } from '../../lib/heatLevel';

const LEVEL_NAME_KEYS: Record<HeatLevel, string> = {
  1: 'heat.tiede',
  2: 'heat.chaud',
  3: 'heat.ardent',
  4: 'heat.brulant',
  5: 'heat.incandescent',
};

const LEVEL_DESC_KEYS: Record<HeatLevel, string> = {
  1: 'heat.roadmap.desc1',
  2: 'heat.roadmap.desc2',
  3: 'heat.roadmap.desc3',
  4: 'heat.roadmap.desc4',
  5: 'heat.roadmap.desc5',
};

const LEVEL_COLORS: Record<HeatLevel, string> = {
  1: '#60a5fa',
  2: '#f59e0b',
  3: '#f97316',
  4: '#ef4444',
  5: '#fbbf24',
};

const LEVELS: HeatLevel[] = [1, 2, 3, 4, 5];

interface HeatRoadmapSheetProps {
  currentLevel: HeatLevel;
  currentPoints: number;
  onClose: () => void;
}

export function HeatRoadmapSheet({ currentLevel, currentPoints, onClose }: HeatRoadmapSheetProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-10 bg-black/70 backdrop-blur-[10px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="w-full max-w-sm rounded-3xl p-5"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
            {t('heat.roadmap.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full"
            style={{ background: colors.bgSecondary }}
          >
            <X size={16} style={{ color: colors.textMuted }} />
          </button>
        </div>

        {/* Paliers */}
        <div className="space-y-2">
          {LEVELS.map((lvl) => {
            const isCurrent = lvl === currentLevel;
            const isUnlocked = lvl < currentLevel;
            const isLocked = lvl > currentLevel;
            const color = LEVEL_COLORS[lvl];
            const threshold = HEAT_THRESHOLDS[lvl];

            return (
              <motion.div
                key={lvl}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (lvl - 1) * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{
                  background: isCurrent ? `${color}18` : colors.bgSecondary,
                  border: `1px solid ${isCurrent ? `${color}50` : 'transparent'}`,
                  opacity: isLocked ? 0.5 : 1,
                }}
              >
                {/* Indicateur */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: isLocked ? colors.border : color }}
                >
                  {isUnlocked && <Check size={14} className="text-white" />}
                  {isCurrent && <span className="text-white text-xs font-bold">{lvl}</span>}
                  {isLocked && <Lock size={12} style={{ color: colors.textMuted }} />}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold" style={{ color: isLocked ? colors.textMuted : colors.textPrimary }}>
                      {t(LEVEL_NAME_KEYS[lvl])}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: color, color: 'white' }}>
                        {t('heat.roadmap.current')}
                      </span>
                    )}
                    {isUnlocked && (
                      <span className="text-[10px]" style={{ color: colors.textMuted }}>
                        {t('heat.roadmap.unlocked')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                    {lvl === 1
                      ? t('heat.roadmap.start') + ' · ' + t(LEVEL_DESC_KEYS[lvl])
                      : t('heat.roadmap.pts', { pts: String(threshold) }) + ' · ' + t(LEVEL_DESC_KEYS[lvl])}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Points actuels */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: colors.divider }}>
          <span className="text-xs" style={{ color: colors.textMuted }}>
            {t('heat.roadmap.accumulated', { pts: String(currentPoints) })}
          </span>
          {currentLevel === 5 && (
            <span className="text-xs font-semibold" style={{ color: LEVEL_COLORS[5] }}>
              {t('heat.roadmap.max')} 🔥
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
