'use client';

import { motion } from 'framer-motion';
import {
  BookOpen, RefreshCw, MessageSquare, Target, HeartHandshake,
  Brain, Lightbulb, GraduationCap
} from 'lucide-react';
import { Card } from '../ui';
import { consentPrinciples } from '../../data';
import { useTheme } from '../../context/ThemeContext';

// Map des icônes pour les principes
const principleIcons = [
  <RefreshCw size={24} className="text-pink-600" key="1" />,
  <MessageSquare size={24} className="text-pink-600" key="2" />,
  <Target size={24} className="text-pink-600" key="3" />,
  <HeartHandshake size={24} className="text-pink-600" key="4" />,
  <Brain size={24} className="text-pink-600" key="5" />,
];

export function LearnScreen() {
  const { colors } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start gap-3"
      >
        <BookOpen size={28} className="text-pink-500 mt-1 shrink-0" />
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Comprendre le consentement
          </h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Les piliers d'une relation saine et respectueuse
          </p>
        </div>
      </motion.div>

      {/* Principles */}
      <div className="space-y-3">
        {consentPrinciples.map((principle, index) => (
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
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center shrink-0"
                >
                  {principleIcons[index]}
                </motion.div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {principle.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                    {principle.text}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Key takeaway */}
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
              Le consentement n'est pas un contrat
            </p>
          </div>
          <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
            C'est une conversation continue, basée sur le respect mutuel.
          </p>
        </Card>
      </motion.div>

      {/* Additional resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4"
      >
        <Card variant="default" padding="lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textSecondary }}>
            <GraduationCap size={18} style={{ color: colors.textSecondary }} />
            Pour aller plus loin
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
            {[
              'Le consentement s\'applique à chaque situation',
              'Ton corps t\'appartient, toujours',
              'Poser des limites est un signe de force',
              'La communication est la clé'
            ].map((item, i) => (
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
