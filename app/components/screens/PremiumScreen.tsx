'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, ArrowLeft, CreditCard, Lock, Sparkles, Dices, Palette, Heart, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { AppLogo } from '../ui';

interface PremiumScreenProps {
  onActivate: () => void;
  onBack: () => void;
}

type Step = 'offer' | 'processing' | 'success';
type Plan = 'month' | 'year';

export function PremiumScreen({ onActivate, onBack }: PremiumScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('offer');
  const [selectedPlan, setSelectedPlan] = useState<Plan>('year');

  const features = [
    { icon: <Dices size={16} />,    label: t('premium.features.dice') },
    { icon: <Sparkles size={16} />, label: t('premium.features.cards') },
    { icon: <Heart size={16} />,    label: t('premium.features.scenarios') },
    { icon: <Palette size={16} />,  label: t('premium.features.themes') },
    { icon: <Crown size={16} />,    label: t('premium.features.access') },
  ];

  function handlePayment() {
    setStep('processing');
    setTimeout(() => setStep('success'), 2200);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
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
              <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft size={20} style={{ color: colors.textSecondary }} />
              </button>
              <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{t('premium.title')}</h1>
            </div>

            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-6 mb-5 text-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              <div className="flex justify-center mb-3">
                <AppLogo className="w-20 h-20" variant="dark" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{t('premium.heroTitle')}</h2>
              <p className="text-white/80 text-sm">{t('premium.heroSubtitle')}</p>
            </motion.div>

            {/* Plan toggle */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex gap-3 mb-4"
            >
              {(['month', 'year'] as Plan[]).map((plan) => {
                const isActive = selectedPlan === plan;
                return (
                  <motion.button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 rounded-2xl p-4 text-left relative overflow-hidden"
                    style={{
                      background: colors.bgCard,
                      border: `2px solid ${isActive ? '#7c3aed' : colors.border}`,
                      transition: 'border-color 0.22s ease',
                    }}
                  >
                    {/* Fond animé via layout */}
                    {isActive && (
                      <motion.div
                        layoutId="plan-bg"
                        className="absolute inset-0 rounded-[14px]"
                        style={{ background: 'linear-gradient(135deg, #7c3aed18, #db277718)' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {plan === 'year' && (
                      <span
                        className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: '#7c3aed', color: '#fff' }}
                      >
                        {t('premium.planYearSaving')}
                      </span>
                    )}
                    <p className="relative text-xs font-semibold mb-1" style={{ color: isActive ? '#7c3aed' : colors.textMuted, transition: 'color 0.2s' }}>
                      {plan === 'month' ? t('premium.planToggleMonth') : t('premium.planToggleYear')}
                    </p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`${plan}-price`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="relative text-lg font-bold"
                        style={{ color: colors.textPrimary }}
                      >
                        {plan === 'month' ? t('premium.planMonthPrice') : t('premium.planYearPrice')}
                      </motion.p>
                    </AnimatePresence>
                    <p className="relative text-[11px]" style={{ color: colors.textSecondary }}>
                      {plan === 'month' ? t('premium.planMonthSub') : t('premium.planYearSub')}
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-5 mb-5 space-y-3"
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
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${colors.success}22` }}
                  >
                    <Check size={13} strokeWidth={2.5} style={{ color: colors.success }} />
                  </div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>{f.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
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

            <p className="text-center text-xs mt-2" style={{ color: colors.textMuted }}>
              {t('premium.planTrialNote')}
            </p>

            <button
              onClick={() => {/* restore purchase */}}
              className="w-full mt-3 py-2 text-sm flex items-center justify-center gap-1.5"
              style={{ color: colors.textSecondary }}
            >
              <RotateCcw size={13} />
              {t('premium.restoreBtn')}
            </button>

            <p className="text-center text-[10px] mt-2 flex items-center justify-center gap-1" style={{ color: colors.textMuted }}>
              <Lock size={10} />
              {t('premium.legalNote')}
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
              <motion.div className="absolute inset-0 rounded-full border-4" style={{ borderColor: `${colors.accent}33` }} />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent"
                style={{ borderTopColor: colors.accent }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard size={24} style={{ color: colors.accent }} />
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
                  className="w-2 h-2 rounded-full"
                  style={{ background: colors.accent }}
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

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>{t('premium.successTitle')}</h2>
              <p className="text-sm max-w-xs" style={{ color: colors.textMuted }}>{t('premium.successDesc')}</p>
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
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                  style={{ background: `${colors.success}18` }}
                >
                  <Check size={14} strokeWidth={2.5} className="shrink-0" style={{ color: colors.success }} />
                  <span className="text-sm" style={{ color: colors.textPrimary }}>{f.label}</span>
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
