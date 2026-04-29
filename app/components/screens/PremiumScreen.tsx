'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, ArrowLeft, CreditCard, Lock, Sparkles, Dices, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { AppLogo } from '../ui';

interface PremiumScreenProps {
  onActivate: () => void;
  onBack: () => void;
}

type Step = 'offer' | 'processing' | 'success';

export function PremiumScreen({ onActivate, onBack }: PremiumScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('offer');

  const features = [
    { icon: <Dices size={16} />, label: t('premium.features.dice') },
    { icon: <Sparkles size={16} />, label: t('premium.features.cards') },
    { icon: <Sparkles size={16} />, label: t('premium.features.scenarios') },
    { icon: <Palette size={16} />, label: t('premium.features.themes') },
    { icon: <Crown size={16} />, label: t('premium.features.access') },
  ];

  function handlePayment() {
    setStep('processing');
    setTimeout(() => setStep('success'), 2200);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col"
    >
      <AnimatePresence mode="wait">
        {step === 'offer' && (
          <motion.div
            key="offer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="p-5"
          >
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} style={{ color: colors.textSecondary }} />
              </button>
              <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{t('premium.title')}</h1>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-6 mb-6 text-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              <div className="flex justify-center mb-4">
                <AppLogo className="w-24 h-24" variant="dark" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{t('premium.heroTitle')}</h2>
              <p className="text-white/80 text-sm mb-4">{t('premium.heroSubtitle')}</p>
              <div className="inline-flex items-baseline gap-1 bg-white/20 rounded-2xl px-5 py-2">
                <span className="text-3xl font-bold text-white">{t('premium.price')}</span>
                <span className="text-white/70 text-sm">{t('premium.perMonth')}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-5 mb-6 space-y-3"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
                {t('premium.includedTitle')}
              </p>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} className="text-green-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>{f.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePayment}
              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              <CreditCard size={18} />
              {t('premium.payBtn')}
            </motion.button>

            <p className="text-center text-xs mt-3 flex items-center justify-center gap-1" style={{ color: colors.textMuted }}>
              <Lock size={11} />
              {t('premium.demoNote')}
            </p>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center flex-1 p-8 gap-6"
          >
            <div className="relative w-20 h-20">
              <motion.div className="absolute inset-0 rounded-full border-4 border-purple-200" />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard size={24} className="text-purple-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold mb-1" style={{ color: colors.textPrimary }}>{t('premium.processing')}</p>
              <p className="text-sm" style={{ color: colors.textMuted }}>{t('premium.processingDesc')}</p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center flex-1 p-8 gap-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              <Crown size={40} className="text-yellow-300" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>{t('premium.successTitle')}</h2>
              <p className="text-sm max-w-xs" style={{ color: colors.textMuted }}>
                {t('premium.successDesc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="w-full space-y-2"
            >
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2.5"
                >
                  <Check size={14} className="text-green-500 shrink-0" strokeWidth={2.5} />
                  <span className="text-sm text-green-800">{f.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileTap={{ scale: 0.97 }}
              onClick={onActivate}
              className="w-full py-4 rounded-2xl font-semibold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              {t('premium.accessBtn')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
