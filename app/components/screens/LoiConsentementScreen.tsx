'use client';

import { motion } from 'framer-motion';
import { Scale, AlertTriangle } from 'lucide-react';
import { loiPoints } from '../../data';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

export function LoiConsentementScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

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
        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <Scale size={22} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{t('loi.title')}</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>{t('loi.subtitle')}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="my-5 p-4 rounded-2xl border-2 border-amber-300 bg-amber-50"
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={18} className="text-amber-600" />
          <span className="font-bold text-amber-800">{t('loi.alert.title')}</span>
        </div>
        <p
          className="text-sm text-amber-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t('loi.alert.text') }}
        />
      </motion.div>

      <div className="space-y-3">
        {loiPoints.map((point, i) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className={`p-4 rounded-2xl shadow-sm border ${point.important ? 'border-amber-200' : ''}`}
            style={{ background: colors.bgCard, ...(!point.important ? { borderColor: colors.border } : {}) }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{point.emoji}</span>
              <div>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                  {t(`loi.${i}.titre`)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                  {t(`loi.${i}.contenu`)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 text-center"
      >
        <p className="text-xs" style={{ color: colors.textMuted }}>
          {t('loi.source1')}
        </p>
        <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
          {t('loi.source2')}
        </p>
      </motion.div>
    </motion.div>
  );
}
