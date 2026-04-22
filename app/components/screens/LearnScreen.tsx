'use client';

import { motion } from 'framer-motion';
import {
  BookOpen, RefreshCw, MessageSquare, Target, HeartHandshake,
  Brain, Lightbulb, GraduationCap
} from 'lucide-react';
import { Card } from '../ui';
import { consentPrinciples } from '../../data';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

export function LearnScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const principleIcons = [
    <RefreshCw size={24} key="1" style={{ color: colors.accent }} />,
    <MessageSquare size={24} key="2" style={{ color: colors.accent }} />,
    <Target size={24} key="3" style={{ color: colors.accent }} />,
    <HeartHandshake size={24} key="4" style={{ color: colors.accent }} />,
    <Brain size={24} key="5" style={{ color: colors.accent }} />,
  ];

  const furtherItems = [
    t('learn.further.item1'),
    t('learn.further.item2'),
    t('learn.further.item3'),
    t('learn.further.item4'),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start gap-3"
      >
        <BookOpen size={28} className="mt-1 shrink-0" style={{ color: colors.accent }} />
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {t('learn.title')}
          </h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {t('learn.subtitle')}
          </p>
        </div>
      </motion.div>

      <div className="space-y-3">
        {consentPrinciples.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="elevated" padding="lg">
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: colors.bgSecondary }}
                >
                  {principleIcons[index]}
                </motion.div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {t(`principles.${index}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                    {t(`principles.${index}.text`)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Card variant="success" padding="lg" className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Lightbulb size={20} className="text-emerald-600" />
            <p className="font-semibold" style={{ color: colors.textPrimary }}>
              {t('learn.keyTakeaway')}
            </p>
          </div>
          <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
            {t('learn.keyText')}
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4"
      >
        <Card variant="default" padding="lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textSecondary }}>
            <GraduationCap size={18} style={{ color: colors.textSecondary }} />
            {t('learn.further.title')}
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
            {furtherItems.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                {item}
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>
    </motion.div>
  );
}
