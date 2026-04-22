'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, BookOpen, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui';
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
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 40px rgba(59, 130, 246, 0.2)',
                '0 0 70px rgba(139, 92, 246, 0.35)',
                '0 0 40px rgba(59, 130, 246, 0.2)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 flex items-center justify-center"
          >
            <ShieldCheck size={54} className="text-white" strokeWidth={1.5} />
          </motion.div>

          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [-10, -55], x: [-15 + i * 10, -20 + i * 14] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              className="absolute top-2 left-1/2 w-2 h-2 rounded-full bg-violet-300"
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: colors.textPrimary }}>
            Consentement
          </h1>
          <p className="text-sm font-medium text-violet-500 tracking-widest uppercase">
            {t('welcome.tagline')}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-base leading-relaxed max-w-xs mb-8" style={{ color: colors.textMuted }}
        >
          {t('welcome.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {pillars.map((p, i) => (
            <motion.span
              key={p.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + i * 0.1 }}
              className="px-3 py-1.5 backdrop-blur rounded-full text-sm shadow-sm flex items-center gap-1.5"
              style={{ background: colors.bgCard, color: colors.textSecondary, border: `1px solid ${colors.divider}` }}
            >
              {p.icon}
              {p.label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
          transition={{ delay: 0.9 }}
          className="text-center text-xs" style={{ color: colors.textMuted }}
        >
          {t('welcome.privacy')}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
