'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, ChevronDown, ChevronUp, Lightbulb, Sparkles } from 'lucide-react';
import { pornoVsRealite } from '../../data';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { DynamicIcon } from '../../utils/iconFromName';
import { Button } from '../ui';
import { useModuleComplete } from '../../lib/useModuleComplete';

interface PornoVsRealiteScreenProps {
  onBack: () => void;
  onComplete?: () => void;
}

export function PornoVsRealiteScreen({ onBack, onComplete }: PornoVsRealiteScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pb-10"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 mb-2"
      >
        <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
          <Film size={22} className="text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{t('pornoVsRealiteScreen.title')}</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>{t('pornoVsRealiteScreen.subtitle')}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 p-4 rounded-2xl bg-violet-50 border border-violet-100"
      >
        <p
          className="text-sm text-violet-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t('pornoVsRealiteScreen.intro') }}
        />
      </motion.div>

      <div className="space-y-3">
        {pornoVsRealite.map((item, i) => {
          const isOpen = expanded === item.id;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="rounded-2xl overflow-hidden shadow-sm border"
              style={{ background: colors.bgCard, borderColor: colors.border }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : item.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <DynamicIcon name={item.iconName} size={22} className="shrink-0" color={colors.textMuted} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0 mt-0.5">
                        {t('pornoVsRealiteScreen.inPorno')}
                      </span>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {t(`pornoVsRealite.${i}.porno`)}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0 mt-0.5">
                        {t('pornoVsRealiteScreen.inReality')}
                      </span>
                      <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                        {t(`pornoVsRealite.${i}.realite`)}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 mt-1" style={{ color: colors.textMuted }}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: colors.divider }}>
                      <p className="text-sm leading-relaxed rounded-xl p-3 flex items-start gap-1.5" style={{ color: colors.textSecondary, background: colors.bgSecondary }}>
                        <Lightbulb size={14} className="shrink-0 mt-0.5" />
                        {t(`pornoVsRealite.${i}.explication`)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100"
      >
        <p className="text-sm text-blue-800 leading-relaxed text-center">
          {t('pornoVsRealiteScreen.closing')}
        </p>
      </motion.div>

      {onComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4"
        >
          <Button
            fullWidth
            onClick={() => { complete('porno-vs-realite'); onComplete(); }}
          >
            <Sparkles size={16} />
            {t('pornoVsRealiteScreen.markRead')}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
