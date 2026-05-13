'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  Lock,
  ChevronRight,
  Sparkles,
  Brain,
  Film,
  Scale,
  HeartHandshake,
  Users,
  PartyPopper,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { useTranslation } from '../../i18n';
import { isModuleCompleted } from '../../lib/moduleIds';
import { MODULES, moduleAudience } from '../../modules';
import { useHeat } from '../../context/HeatContext';
import { MODULE_POINTS, HEAT_THRESHOLDS } from '../../lib/heatLevel';
import type { EffectiveModuleId } from '../../modules';

interface ApprendreScreenProps {
  isAdult: boolean | null;
  onNavigate: (screen: Screen) => void;
}

type Rarity = 'common' | 'rare' | 'unique';

type ModuleMeta = {
  id: string;
  screen: Screen | null;
  icon: ReactNode;
  title: string;
  desc: string;
  reward: string;
  rarity: Rarity;
  rarityLabel: string;
  available: boolean;
  heatPoints: number;
  /** Palier requis si le module est verrouillé par la chaleur (non disponible mais visible) */
  requiredHeatLevel?: 2 | 3 | 4 | 5;
};

const MODULE_ICONS: Record<string, ReactNode> = {
  'quiz-consentement': <Brain size={20} className="text-white" />,
  'porno-vs-realite': <Film size={20} className="text-white" />,
  'loi-consentement': <Scale size={20} className="text-white" />,
  'module-pratiques-adultes': <Sparkles size={20} className="text-white" />,
  'accompagnement-mineur': <HeartHandshake size={20} className="text-white" />,
  'duo-flow': <Users size={20} className="text-white" />,
};

function ModuleCard({
  module,
  completed,
  index,
  currentHeatLevel,
  onNavigate,
}: {
  module: ModuleMeta;
  completed: boolean;
  index: number;
  currentHeatLevel: number;
  onNavigate: (screen: Screen) => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const heatLocked = !module.available && module.requiredHeatLevel !== undefined;
  const heatUnlockable = heatLocked && module.requiredHeatLevel !== undefined && currentHeatLevel >= (module.requiredHeatLevel ?? 99);
  const rarity = {
    common: {
      bg: `color-mix(in srgb, ${colors.textMuted} 15%, transparent)`,
      text: colors.textMuted,
      iconBg: `linear-gradient(135deg, ${colors.textMuted}, ${colors.locked})`,
    },
    rare: {
      bg: colors.rareBg,
      text: colors.rare,
      iconBg: `linear-gradient(135deg, ${colors.rare}, ${colors.premium})`,
    },
    unique: {
      bg: colors.uniqueBg,
      text: colors.unique,
      iconBg: `linear-gradient(135deg, ${colors.unique}, ${colors.warning})`,
    },
  } satisfies Record<Rarity, { bg: string; text: string; iconBg: string }>;
  const r = rarity[module.rarity];

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileTap={{ scale: 0.98 }}
      disabled={!module.available && !heatUnlockable}
      onClick={() => module.screen && onNavigate(module.screen)}
      className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
      style={{
        background: colors.bgCard,
        border: `1px solid ${completed ? r.text + '50' : heatLocked ? '#f9731640' : colors.border}`,
        opacity: module.available || heatLocked ? 1 : 0.55,
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background:
            completed || !module.available
              ? r.iconBg
              : `color-mix(in srgb, ${colors.locked} 20%, transparent)`,
        }}
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
          {module.heatPoints > 0 && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
              style={{ background: '#f9731620', color: '#f97316' }}
            >
              {t('apprendre.heatPoints', { n: String(module.heatPoints) })}
            </span>
          )}
        </div>
        <p className="text-xs leading-snug" style={{ color: colors.textSecondary }}>
          {module.desc}
        </p>
        {heatLocked && module.requiredHeatLevel !== undefined ? (
          <p className="text-[10px] mt-1 font-medium" style={{ color: '#f97316' }}>
            {t('apprendre.heatRequired', {
              palier: t(`heat.${['', 'tiede', 'chaud', 'ardent', 'brulant', 'incandescent'][module.requiredHeatLevel]}`),
              pts: String(HEAT_THRESHOLDS[module.requiredHeatLevel]),
            })}
          </p>
        ) : (
          <p className="text-[10px] mt-1 font-medium" style={{ color: r.text }}>
            {t('apprendre.rewardPrefix')}
            {module.reward}
          </p>
        )}
      </div>

      <div className="shrink-0 ml-1">
        {completed ? (
          <CheckCircle size={20} style={{ color: r.text }} />
        ) : heatLocked ? (
          <span style={{ fontSize: 16 }}>🔥</span>
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
  const { level: heatLevel } = useHeat();
  const audience = moduleAudience(isAdult);
  const modules: ModuleMeta[] = MODULES.filter(
    (module) =>
      module.id !== 'module-de-base' &&
      module.screen !== null &&
      module.available[audience]
  )
    .sort((a, b) => (a.sequence[audience] ?? 99) - (b.sequence[audience] ?? 99))
    .map((module) => {
      const effectiveId = module.effectiveId[audience];
      const pts = MODULE_POINTS[effectiveId as EffectiveModuleId] ?? 0;
      return {
        id: module.id,
        screen: module.screen,
        icon: MODULE_ICONS[module.id],
        title: t(module.titleKey),
        desc: 'descriptionKey' in module && module.descriptionKey ? t(module.descriptionKey) : '',
        reward: t(module.rewardKey),
        rarity: module.reward.rarity,
        rarityLabel: t(
          `apprendre.rarity${module.reward.rarity[0].toUpperCase()}${module.reward.rarity.slice(1)}`
        ),
        available: module.available[audience],
        heatPoints: pts,
        requiredHeatLevel: undefined,
      };
    });
  const availableModules = modules.filter((m) => m.available);
  const completedCount = availableModules.filter((m) =>
    isModuleCompleted(m.id, completedModules, isAdult)
  ).length;
  const totalAvailable = availableModules.length;
  const allDone = totalAvailable > 0 && completedCount === totalAvailable;
  const progressPct = totalAvailable > 0 ? completedCount / totalAvailable : 0;

  const subtitle =
    completedCount === 0
      ? t('apprendre.subtitleEmpty')
      : completedCount === 1
        ? t('apprendre.subtitleOne', { total: String(totalAvailable) })
        : t('apprendre.subtitleMany', {
            count: String(completedCount),
            total: String(totalAvailable),
          });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
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
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          {subtitle}
        </p>
        <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: colors.border }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct * 100}%` }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ background: colors.accentGradient }}
          />
        </div>
      </motion.div>

      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{ background: `${colors.success}18`, border: `1px solid ${colors.success}44` }}
        >
          <PartyPopper size={22} style={{ color: colors.success }} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: colors.success }}>{t('apprendre.allDone')}</p>
            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>{t('apprendre.allDoneSub')}</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {modules.map((module, i) => (
          <ModuleCard
            key={module.id}
            module={module}
            completed={isModuleCompleted(module.id, completedModules, isAdult)}
            index={i + 1}
            currentHeatLevel={heatLevel}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {isAdult !== false && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: modules.length * 0.07 + 0.15 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('quiz-hub')}
          className="w-full mt-3 rounded-2xl p-4 flex items-center gap-3 text-left"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            <Brain size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                {t('quizMl.ui.hubTitle')}
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: '#3b82f622', color: '#3b82f6' }}>
                9 quiz
              </span>
            </div>
            <p className="text-xs leading-snug" style={{ color: colors.textSecondary }}>
              {t('quizMl.ui.hubSubtitle')}
            </p>
            <p className="text-[10px] mt-1 font-medium" style={{ color: '#3b82f6' }}>
              Débutant · Intermédiaire · Expert
            </p>
          </div>
          <ChevronRight size={18} style={{ color: colors.textMuted }} />
        </motion.button>
      )}
    </motion.div>
  );
}
