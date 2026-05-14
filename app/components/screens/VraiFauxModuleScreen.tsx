'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, RotateCcw, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useModuleComplete } from '../../lib/useModuleComplete';
import { DynamicIcon } from '../../utils/iconFromName';
import type { VraiFauxItem } from '../../data/bdsmConsent';
import type { ModuleId } from '../../modules';

interface VraiFauxModuleScreenProps {
  items: VraiFauxItem[];
  namespace: string;
  moduleId: ModuleId;
  onComplete?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tx = (t: (k: any) => string, key: string) => t(key);

export function VraiFauxModuleScreen({ items, namespace, moduleId, onComplete }: VraiFauxModuleScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const item = items[current];
  const total = items.length;

  const handleReveal = () => setRevealed(true);

  const handleNext = () => {
    if (current + 1 >= total) {
      complete(moduleId);
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setRevealed(false);
    }
  };

  const handleReset = () => {
    setCurrent(0); setRevealed(false); setFinished(false);
  };

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-5 text-center"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mb-4"
        >
          <CheckCircle size={64} color="#22c55e" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
          {t('vraiFauxScreen.done')}
        </h2>
        <p className="mb-8 text-sm leading-relaxed max-w-xs" style={{ color: colors.textMuted }}>
          {tx(t, `${namespace}.closing`)}
        </p>
        <Button onClick={handleReset} variant="secondary"><RotateCcw size={16} />{t('vraiFauxScreen.restart')}</Button>
        {onComplete && (
          <Button onClick={onComplete} className="mt-3"><Sparkles size={16} />{t('vraiFauxScreen.seeCard')}</Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
          <Lightbulb size={22} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{tx(t, `${namespace}.title`)}</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {t('vraiFauxScreen.progress', { current: String(current + 1), total: String(total) })}
          </p>
        </div>
      </div>

      <div className="w-full h-2 rounded-full mb-6 overflow-hidden" style={{ background: colors.bgSecondary }}>
        <motion.div animate={{ width: `${(current / total) * 100}%` }} transition={{ duration: 0.4 }}
          className="h-full rounded-full bg-purple-400" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
        >
          {/* Idée reçue */}
          <div className="mb-4 p-4 rounded-2xl border" style={{ background: colors.bgCard, borderColor: colors.border }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {tx(t, `${namespace}.badgeFaux`)}
              </span>
              <DynamicIcon name={item.iconName} size={16} color={colors.textMuted} />
            </div>
            <p className="text-base font-semibold leading-snug italic" style={{ color: colors.textPrimary }}>
              &ldquo;{tx(t, `${namespace}.${current}.ideeRecue`)}&rdquo;
            </p>
          </div>

          {/* Révélation */}
          <AnimatePresence>
            {revealed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="mb-4"
              >
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      {tx(t, `${namespace}.badgeVrai`)}
                    </span>
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <p className="text-sm font-semibold leading-snug" style={{ color: '#166534' }}>
                    {tx(t, `${namespace}.${current}.realite`)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl border" style={{ background: colors.bgSecondary, borderColor: colors.border }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <XCircle size={14} color={colors.textMuted} />
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textMuted }}>
                      {t('vraiFauxScreen.explainLabel')}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                    {tx(t, `${namespace}.${current}.explication`)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!revealed ? (
            <Button onClick={handleReveal} fullWidth>{t('vraiFauxScreen.reveal')}</Button>
          ) : (
            <Button onClick={handleNext} fullWidth>
              {current + 1 < total ? t('vraiFauxScreen.next') : t('vraiFauxScreen.finish')}
              <ChevronRight size={18} />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
