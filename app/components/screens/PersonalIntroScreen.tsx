'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLogo } from '../ui/AppLogo';
import { Button } from '../ui';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useProfileStore } from '../../stores';
import { comfortCategories } from '../../data';

interface PersonalIntroScreenProps {
  onContinue: () => void;
}

const CATEGORIES = [
  { key: 'tenderness' as const, labelKey: 'personalIntro.tenderness', color: '#f8a5c2' },
  { key: 'intensity'  as const, labelKey: 'personalIntro.intensity',  color: '#ff7675' },
  { key: 'trust'      as const, labelKey: 'personalIntro.trust',      color: '#a29bfe' },
];

export function PersonalIntroScreen({ onContinue }: PersonalIntroScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { updateComfortLevel } = useProfileStore();

  const [values, setValues] = useState<Record<string, number>>({
    tenderness: 2,
    intensity: 2,
    trust: 2,
  });

  const handleSave = () => {
    for (const cat of CATEGORIES) {
      const items = comfortCategories[cat.key].items;
      for (const item of items) {
        updateComfortLevel(cat.key, item.id, values[cat.key]);
      }
    }
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col items-center justify-between p-6 pb-10"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xs">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.05 }}
          className="mb-8"
        >
          <AppLogo height={64} variant="theme" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {t('personalIntro.title')}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
            {t('personalIntro.subtitle')}
          </p>
        </motion.div>

        <div className="w-full space-y-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              className="p-4 rounded-2xl"
              style={{ background: colors.bgCard, border: `1px solid ${colors.divider}` }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                  {t(cat.labelKey)}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${cat.color}22`, color: cat.color }}
                >
                  {values[cat.key]} / 4
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={values[cat.key]}
                onChange={(e) => setValues((v) => ({ ...v, [cat.key]: Number(e.target.value) }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  accentColor: cat.color,
                  background: `linear-gradient(to right, ${cat.color} 0%, ${cat.color} ${values[cat.key] * 25}%, ${colors.divider} ${values[cat.key] * 25}%, ${colors.divider} 100%)`,
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: colors.textMuted }}>Non</span>
                <span className="text-xs" style={{ color: colors.textMuted }}>J&apos;adore</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="w-full max-w-xs space-y-3"
      >
        <Button onClick={handleSave} fullWidth size="lg">
          {t('personalIntro.ctaNow')}
        </Button>
        <button
          onClick={onContinue}
          className="w-full py-3 text-sm font-medium"
          style={{ color: colors.textMuted }}
        >
          {t('personalIntro.ctaLater')}
        </button>
      </motion.div>
    </motion.div>
  );
}
