'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useDailyQuestion } from '../../lib/useDailyQuestion';

interface DailyQuestionCardProps {
  onPress: () => void;
  delay?: number;
}

export function DailyQuestionCard({ onPress, delay = 0 }: DailyQuestionCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const questionKey = useDailyQuestion();

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      className="w-full rounded-2xl p-4 flex items-start gap-3 text-left"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.10), rgba(168,85,247,0.06))',
        border: '1px solid rgba(139,92,246,0.22)',
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
      >
        <MessageCircle size={17} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#a855f7' }}>
          {t('dailyQ.title')}
        </p>
        <p className="text-sm leading-snug font-medium" style={{ color: colors.textPrimary }}>
          {t(questionKey as Parameters<typeof t>[0])}
        </p>
      </div>
      <ArrowRight size={16} style={{ color: '#a855f7', flexShrink: 0, marginTop: 2 }} />
    </motion.button>
  );
}
