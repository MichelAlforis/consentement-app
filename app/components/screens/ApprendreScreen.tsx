'use client';

import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lock, ChevronRight, Sparkles, Brain, Film, Scale, HeartHandshake } from 'lucide-react';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { useTranslation } from '../../i18n';

interface ApprendreScreenProps {
  isAdult: boolean | null;
  onNavigate: (screen: Screen) => void;
}

type Rarity = 'common' | 'rare' | 'unique';

type ModuleMeta = {
  id: string;
  screen: Screen | null;
  icon: React.ReactNode;
  title: string;
  desc: string;
  reward: string;
  rarity: Rarity;
  rarityLabel: string;
  available: boolean;
};

const RARITY = {
  common: { bg: 'rgba(107,114,128,0.15)', text: '#9ca3af' },
  rare:   { bg: 'rgba(139,92,246,0.15)',  text: '#8b5cf6' },
  unique: { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b' },
};

const ICON_BG = {
  common: 'linear-gradient(135deg, #6b7280, #4b5563)',
  rare:   'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  unique: 'linear-gradient(135deg, #f59e0b, #d97706)',
};

function ModuleCard({
  module,
  completed,
  index,
  onNavigate,
}: {
  module: ModuleMeta;
  completed: boolean;
  index: number;
  onNavigate: (screen: Screen) => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const r = RARITY[module.rarity];

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileTap={{ scale: 0.98 }}
      disabled={!module.available}
      onClick={() => module.screen && onNavigate(module.screen)}
      className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
      style={{
        background: colors.bgCard,
        border: `1px solid ${completed ? r.text + '50' : colors.border}`,
        opacity: module.available ? 1 : 0.55,
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: completed || !module.available ? ICON_BG[module.rarity] : 'rgba(107,114,128,0.2)' }}
      >
        {module.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
            {module.title}
          </span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
            style={{ background: r.bg, color: r.text }}
          >
            {module.rarityLabel}
          </span>
        </div>
        <p className="text-xs leading-snug" style={{ color: colors.textSecondary }}>
          {module.desc}
        </p>
        <p className="text-[10px] mt-1 font-medium" style={{ color: r.text }}>
          {t('apprendre.rewardPrefix')}{module.reward}
        </p>
      </div>

      <div className="shrink-0 ml-1">
        {completed ? (
          <CheckCircle size={20} style={{ color: r.text }} />
        ) : !module.available ? (
          <Lock size={16} style={{ color: colors.textMuted }} />
        ) : (
          <ChevronRight size={18} style={{ color: colors.textMuted }} />
        )}
      </div>
    </motion.button>
  );
}

export function ApprendreScreen({ isAdult, onNavigate }: ApprendreScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { completedModules } = useModuleProgressStore();

  const ADULT_MODULES: ModuleMeta[] = [
    {
      id: 'quiz-consentement', screen: 'quiz-consentement',
      icon: <Brain size={20} className="text-white" />,
      title: t('apprendre.quiz.title'), desc: t('apprendre.quiz.desc'),
      reward: t('apprendre.rewardCommon'), rarity: 'common', rarityLabel: t('apprendre.rarityCommon'), available: true,
    },
    {
      id: 'porno-vs-realite', screen: 'porno-vs-realite',
      icon: <Film size={20} className="text-white" />,
      title: t('apprendre.porno.title'), desc: t('apprendre.porno.desc'),
      reward: t('apprendre.rewardCommon'), rarity: 'common', rarityLabel: t('apprendre.rarityCommon'), available: true,
    },
    {
      id: 'loi-consentement', screen: 'loi-consentement',
      icon: <Scale size={20} className="text-white" />,
      title: t('apprendre.loi.title'), desc: t('apprendre.loi.desc'),
      reward: t('apprendre.rewardRare'), rarity: 'rare', rarityLabel: t('apprendre.rarityRare'), available: true,
    },
    {
      id: 'module-pratiques-adultes', screen: null,
      icon: <Sparkles size={20} className="text-white" />,
      title: t('apprendre.pratiques.title'), desc: t('apprendre.pratiques.desc'),
      reward: t('apprendre.rewardUnique'), rarity: 'unique', rarityLabel: t('apprendre.rarityUnique'), available: false,
    },
  ];

  const MINOR_MODULES: ModuleMeta[] = [
    {
      id: 'quiz-consentement', screen: 'quiz-consentement',
      icon: <Brain size={20} className="text-white" />,
      title: t('apprendre.quiz.title'), desc: t('apprendre.quiz.desc'),
      reward: t('apprendre.rewardCommon'), rarity: 'common', rarityLabel: t('apprendre.rarityCommon'), available: true,
    },
    {
      id: 'porno-vs-realite', screen: 'porno-vs-realite',
      icon: <Film size={20} className="text-white" />,
      title: t('apprendre.porno.title'), desc: t('apprendre.porno.desc'),
      reward: t('apprendre.rewardCommon'), rarity: 'common', rarityLabel: t('apprendre.rarityCommon'), available: true,
    },
    {
      id: 'loi-consentement', screen: 'loi-consentement',
      icon: <Scale size={20} className="text-white" />,
      title: t('apprendre.loi.title'), desc: t('apprendre.loi.desc'),
      reward: t('apprendre.rewardRare'), rarity: 'rare', rarityLabel: t('apprendre.rarityRare'), available: true,
    },
    {
      id: 'accompagnement-mineur', screen: 'accompagnement-mineur',
      icon: <HeartHandshake size={20} className="text-white" />,
      title: t('apprendre.accompagnement.title'), desc: t('apprendre.accompagnement.desc'),
      reward: t('apprendre.rewardRare'), rarity: 'rare', rarityLabel: t('apprendre.rarityRare'), available: true,
    },
  ];

  const modules = isAdult ? ADULT_MODULES : MINOR_MODULES;
  const completedCount = modules.filter((m) => completedModules.includes(m.id)).length;

  const subtitle = completedCount === 0
    ? t('apprendre.subtitleEmpty')
    : completedCount === 1
      ? t('apprendre.subtitleOne', { total: String(modules.length) })
      : t('apprendre.subtitleMany', { count: String(completedCount), total: String(modules.length) });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} style={{ color: colors.accent }} />
          <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {t('tabs.learn')}
          </h1>
        </div>
        <p className="text-sm" style={{ color: colors.textSecondary }}>{subtitle}</p>
      </motion.div>

      <div className="space-y-3">
        {modules.map((module, i) => (
          <ModuleCard
            key={module.id}
            module={module}
            completed={completedModules.includes(module.id)}
            index={i + 1}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </motion.div>
  );
}
