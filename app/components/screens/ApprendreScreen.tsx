'use client';

import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lock, ChevronRight, Sparkles, Brain, Film, Scale, HeartHandshake } from 'lucide-react';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';

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
  available: boolean;
};

const RARITY = {
  common: { bg: 'rgba(107,114,128,0.15)', text: '#9ca3af', label: 'commune' },
  rare:   { bg: 'rgba(139,92,246,0.15)',  text: '#8b5cf6', label: 'rare' },
  unique: { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b', label: 'unique' },
};

const ICON_BG = {
  common: 'linear-gradient(135deg, #6b7280, #4b5563)',
  rare:   'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  unique: 'linear-gradient(135deg, #f59e0b, #d97706)',
};

const ADULT_MODULES: ModuleMeta[] = [
  {
    id: 'quiz-consentement',
    screen: 'quiz-consentement',
    icon: <Brain size={20} className="text-white" />,
    title: 'Quiz Consentement',
    desc: '8 questions pour tester ce que tu sais vraiment',
    reward: '1 carte commune',
    rarity: 'common',
    available: true,
  },
  {
    id: 'porno-vs-realite',
    screen: 'porno-vs-realite',
    icon: <Film size={20} className="text-white" />,
    title: 'Porno vs Réalité',
    desc: 'Ce que les films ne te montrent pas',
    reward: '1 carte commune',
    rarity: 'common',
    available: true,
  },
  {
    id: 'loi-consentement',
    screen: 'loi-consentement',
    icon: <Scale size={20} className="text-white" />,
    title: 'La loi & le consentement',
    desc: 'Tes droits, l\'âge légal, ce qui est un crime',
    reward: '1 carte rare',
    rarity: 'rare',
    available: true,
  },
  {
    id: 'module-pratiques-adultes',
    screen: null,
    icon: <Sparkles size={20} className="text-white" />,
    title: 'Pratiques avancées',
    desc: 'Module rédigé par notre juriste — à venir',
    reward: '1 carte unique',
    rarity: 'unique',
    available: false,
  },
];

const MINOR_MODULES: ModuleMeta[] = [
  {
    id: 'quiz-consentement',
    screen: 'quiz-consentement',
    icon: <Brain size={20} className="text-white" />,
    title: 'Quiz Consentement',
    desc: '8 questions pour tester ce que tu sais vraiment',
    reward: '1 carte commune',
    rarity: 'common',
    available: true,
  },
  {
    id: 'porno-vs-realite',
    screen: 'porno-vs-realite',
    icon: <Film size={20} className="text-white" />,
    title: 'Porno vs Réalité',
    desc: 'Ce que les films ne te montrent pas',
    reward: '1 carte commune',
    rarity: 'common',
    available: true,
  },
  {
    id: 'loi-consentement',
    screen: 'loi-consentement',
    icon: <Scale size={20} className="text-white" />,
    title: 'La loi & le consentement',
    desc: 'Tes droits, l\'âge légal, ce qui est un crime',
    reward: '1 carte rare',
    rarity: 'rare',
    available: true,
  },
  {
    id: 'accompagnement-mineur',
    screen: 'accompagnement-mineur',
    icon: <HeartHandshake size={20} className="text-white" />,
    title: 'Je me questionne',
    desc: 'Des questions à se poser. Sans jugement.',
    reward: '1 carte rare',
    rarity: 'rare',
    available: true,
  },
];

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
            {r.label}
          </span>
        </div>
        <p className="text-xs leading-snug" style={{ color: colors.textSecondary }}>
          {module.desc}
        </p>
        <p className="text-[10px] mt-1 font-medium" style={{ color: r.text }}>
          Récompense : {module.reward}
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
  const { completedModules } = useModuleProgressStore();

  const modules = isAdult ? ADULT_MODULES : MINOR_MODULES;
  const completedCount = modules.filter((m) => completedModules.includes(m.id)).length;

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
            Apprendre
          </h1>
        </div>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          {completedCount === 0
            ? 'Chaque module complété débloque des cartes pour tes jeux.'
            : `${completedCount} / ${modules.length} module${completedCount > 1 ? 's' : ''} complété${completedCount > 1 ? 's' : ''}`}
        </p>
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
