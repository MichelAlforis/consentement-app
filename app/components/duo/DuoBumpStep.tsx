'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Wifi, WifiOff, QrCode, Check } from 'lucide-react';
import { Button, Card } from '../ui';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useBumpPolling } from './useBumpPolling';
import type { PartnerProfile } from '../../types';

interface DuoBumpStepProps {
  onBumpSuccess: (partnerProfile: PartnerProfile, sessionId: string) => void;
  onFallbackQR: () => void;
}

export function DuoBumpStep({ onBumpSuccess, onFallbackQR }: DuoBumpStepProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const { bumpState, retry, isOffline } = useBumpPolling(onBumpSuccess, () => {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center flex-1 px-6"
    >
      <AnimatePresence mode="wait">
        {isOffline && (
          <motion.div
            key="offline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
              <WifiOff size={36} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              {t('duo.bump.offline.title')}
            </h2>
            <p className="mb-6" style={{ color: colors.textMuted }}>
              {t('duo.bump.offline.sub')}
            </p>
            <Button onClick={onFallbackQR} fullWidth variant="primary">
              <QrCode size={18} />
              {t('duo.bump.failed.useQr')}
            </Button>
          </motion.div>
        )}

        {!isOffline && bumpState === 'searching' && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="relative w-64 h-48 mb-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-300"
                  initial={{ width: 60, height: 60, opacity: 0.6 }}
                  animate={{ width: [60, 200], height: [60, 200], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
                />
              ))}

              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              >
                <div className="w-16 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-700">
                  <Smartphone size={24} className="text-purple-400" />
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: colors.textMuted }}>{t('duo.you')}</p>
              </motion.div>

              <motion.div
                animate={{ x: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <div className="w-16 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-700">
                  <Smartphone size={24} className="text-pink-400" />
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: colors.textMuted }}>{t('duo.partner')}</p>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Wifi size={32} className="text-purple-500" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold mb-3" style={{ color: colors.textPrimary }}>
              {t('duo.bump.waiting.instruction')}
            </h2>
            <p className="mb-2" style={{ color: colors.textMuted }}>
              {t('duo.bump.waiting.sub')}
            </p>
            <motion.p
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm text-purple-500"
            >
              {t('duo.bump.waiting.searching')}
            </motion.p>

            <div className="mt-8 w-full max-w-xs">
              <Button onClick={onFallbackQR} fullWidth variant="ghost">
                <QrCode size={16} />
                {t('duo.bump.failed.useQr')}
              </Button>
            </div>
          </motion.div>
        )}

        {!isOffline && bumpState === 'detected' && (
          <motion.div
            key="detected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
                <Check size={40} color="white" strokeWidth={3} />
              </motion.div>
            </motion.div>
            <h2 className="text-xl font-bold text-green-600">
              {t('duo.bump.success')}
            </h2>
          </motion.div>
        )}

        {!isOffline && bumpState === 'timeout' && (
          <motion.div
            key="timeout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center"
            >
              <WifiOff size={36} className="text-amber-500" />
            </motion.div>

            <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              {t('duo.bump.failed.title')}
            </h2>
            <p className="mb-6" style={{ color: colors.textMuted }}>
              {t('duo.bump.failed.sub')}
            </p>

            <Card variant="default" padding="md" className="mb-6 text-left">
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                <strong>{t('duo.bump.failed.why.title')}</strong>
                <br />
                {t('duo.bump.failed.why.sub')}
              </p>
              <ul className="text-sm mt-2 space-y-1" style={{ color: colors.textMuted }}>
                <li>• {t('duo.bump.failed.why.reason1')}</li>
                <li>• {t('duo.bump.failed.why.reason2')}</li>
                <li>• {t('duo.bump.failed.why.reason3')}</li>
              </ul>
            </Card>

            <div className="space-y-3 w-full max-w-xs mx-auto">
              <Button onClick={onFallbackQR} fullWidth variant="primary">
                <QrCode size={18} />
                {t('duo.bump.failed.useQr')}
              </Button>
              <Button onClick={retry} fullWidth variant="ghost">
                {t('duo.bump.failed.retry')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
