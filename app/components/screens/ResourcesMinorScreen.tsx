'use client';

import { motion } from 'framer-motion';
import { Film, Scale, HelpCircle, ChevronRight } from 'lucide-react';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface ResourcesMinorScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  accent: string;
  delay: number;
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}

function ResourceCard({ icon, title, desc, tag, tagColor, accent, delay, screen, onNavigate }: ResourceCardProps) {
  const { colors } = useTheme();
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onNavigate(screen)}
      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
      style={{ background: colors.bgCard, border: `1.5px solid ${accent}22` }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${tagColor}20`, color: tagColor }}>
            {tag}
          </span>
        </div>
        <p className="text-xs leading-snug" style={{ color: colors.textMuted }}>{desc}</p>
      </div>
      <ChevronRight size={16} style={{ color: colors.textMuted }} className="shrink-0" />
    </motion.button>
  );
}

export function ResourcesMinorScreen({ onNavigate }: ResourcesMinorScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
          {t('homeMinor.subtitle')}
        </p>
      </motion.div>

      <div className="space-y-3">
        <ResourceCard
          icon={<Film size={22} className="text-violet-500" />}
          title={t('homeMinor.resources.porno.title')}
          desc={t('homeMinor.resources.porno.desc')}
          tag={t('homeMinor.resources.porno.tag')}
          tagColor="#8b5cf6"
          accent="#8b5cf6"
          delay={0.15}
          screen="porno-vs-realite"
          onNavigate={onNavigate}
        />
        <ResourceCard
          icon={<HelpCircle size={22} className="text-blue-500" />}
          title={t('homeMinor.resources.quiz.title')}
          desc={t('homeMinor.resources.quiz.desc')}
          tag={t('homeMinor.resources.quiz.tag')}
          tagColor="#3b82f6"
          accent="#3b82f6"
          delay={0.2}
          screen="quiz-consentement"
          onNavigate={onNavigate}
        />
        <ResourceCard
          icon={<Scale size={22} className="text-amber-500" />}
          title={t('homeMinor.resources.loi.title')}
          desc={t('homeMinor.resources.loi.desc')}
          tag={t('homeMinor.resources.loi.tag')}
          tagColor="#f59e0b"
          accent="#f59e0b"
          delay={0.25}
          screen="loi-consentement"
          onNavigate={onNavigate}
        />
      </div>
    </motion.div>
  );
}
