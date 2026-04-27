'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, BookOpen, MessageCircle, ArrowRight, BadgeCheck } from 'lucide-react';
import { Button, AppLogo } from '../ui';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const pillars = [
    { icon: <ShieldCheck size={15} />, label: t('welcome.pillars.consent') },
    { icon: <BookOpen size={15} />, label: t('welcome.pillars.education') },
    { icon: <MessageCircle size={15} />, label: t('welcome.pillars.dialogue') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col justify-between p-6 pb-10"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.1 }}
          className="relative mb-8 flex items-center justify-center"
        >
          <AppLogo height={180} variant="light" animated />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-4"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: colors.textPrimary }}>
            {t('welcome.appName')}
          </h1>
          <p className="text-sm font-medium text-violet-500 tracking-widest uppercase">
            {t('welcome.tagline')}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base leading-relaxed max-w-xs mb-8" style={{ color: colors.textMuted }}
        >
          {t('welcome.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {pillars.map((p, i) => (
            <motion.span
              key={p.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="px-3 py-1.5 backdrop-blur rounded-full text-sm shadow-sm flex items-center gap-1.5"
              style={{ background: colors.bgCard, color: colors.textSecondary, border: `1px solid ${colors.divider}` }}
            >
              {p.icon}
              {p.label}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex items-center gap-1.5 mt-5 text-xs font-medium"
          style={{ color: colors.textMuted }}
        >
          <BadgeCheck size={13} className="text-violet-500 shrink-0" />
          {t('welcome.legalBadge')}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="space-y-4"
      >
        <Button
          onClick={onStart}
          fullWidth
          size="lg"
          className="shadow-xl shadow-violet-300/30"
        >
          {t('welcome.cta')}
          <ArrowRight size={20} />
        </Button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center text-xs" style={{ color: colors.textMuted }}
        >
          {t('welcome.privacy')}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
