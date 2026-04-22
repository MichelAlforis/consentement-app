'use client';

import { motion } from 'framer-motion';
import { Users, QrCode, Lightbulb, Wifi } from 'lucide-react';
import { Card } from '../../../ui';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../i18n';

interface ConnectionChoiceProps {
  onBump: () => void;
  onQR: () => void;
}

export function ConnectionChoice({ onBump, onQR }: ConnectionChoiceProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start gap-3"
      >
        <Users size={28} className="text-purple-500 mt-1 shrink-0" />
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {t('duo.title')}
          </h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {t('duo.subtitle')}
          </p>
        </div>
      </motion.div>

      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="elevated" padding="lg" onClick={onBump} className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Wifi size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>{t('duo.bump.title')}</h3>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                    {t('duo.bump.tag')}
                  </span>
                </div>
                <p className="text-sm" style={{ color: colors.textMuted }}>{t('duo.bump.desc')}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-4 py-2"
        >
          <div className="flex-1 h-px" style={{ background: colors.divider }} />
          <span className="text-sm" style={{ color: colors.textMuted }}>{t('duo.or')}</span>
          <div className="flex-1 h-px" style={{ background: colors.divider }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card variant="elevated" padding="md" onClick={onQR} className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: colors.bgSecondary }}>
                <QrCode size={24} style={{ color: colors.textSecondary }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{t('duo.qr.title')}</h3>
                <p className="text-xs" style={{ color: colors.textMuted }}>{t('duo.qr.desc')}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
          <Card variant="default" padding="lg">
            <p className="font-medium mb-3 flex items-center gap-2" style={{ color: colors.textSecondary }}>
              <Lightbulb size={18} className="text-amber-500" />
              {t('duo.how.title')}
            </p>
            <ol className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
              {(['step1', 'step2', 'step3', 'step4'] as const).map((step, i) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {t(`duo.how.${step}`)}
                </li>
              ))}
            </ol>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
