// V4 divergence: navigation via useNavigationStore (pas de Next.js router)
// V4 divergence: heat gates (bdsm-consent/pratiques-explicit/pratiques-avancees) — V3 n'avait pas ce système
// V4 divergence: Rarity importé depuis @ouiclair/core (R3 — pas de redéfinition locale)

import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  BookOpen,
  Brain,
  CheckCircle,
  ChevronRight,
  Film,
  Flame,
  Heart,
  HeartHandshake,
  Lightbulb,
  Lock,
  MessageCircle,
  PartyPopper,
  Scale,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react-native';
import {
  getVisibleLearningModules,
  HEAT_THRESHOLDS,
  isModuleCompleted,
  MODULE_POINTS,
  moduleAudience,
  useAuthStore,
  useModuleProgressStore,
  useNavigationStore,
  type EffectiveModuleId,
  type Rarity,
  type Screen,
} from '@ouiclair/core';
import { useHeat } from '../../../context/HeatContext';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';
import { IconBox } from '../../ui';

interface ApprendreScreenProps {
  isAdult?: boolean | null;
  onNavigate?: (screen: Screen) => void;
}

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
  requiredHeatLevel?: 2 | 3 | 4 | 5;
};

const HEAT_GATES: Partial<Record<string, 2 | 3 | 4 | 5>> = {
  'bdsm-consent': 2,
  'pratiques-explicit': 2,
  'pratiques-avancees': 3,
};

function moduleIcon(id: string): ReactNode {
  const color = '#fff';
  switch (id) {
    case 'quiz-consentement':
    case 'pression-manip':
      return <Brain size={20} color={color} />;
    case 'porno-vs-realite':
    case 'content-non-consenti':
      return <Film size={20} color={color} />;
    case 'loi-consentement':
    case 'bdsm-consent':
      return <Scale size={20} color={color} />;
    case 'accompagnement-mineur':
    case 'rupture-harcele':
      return <HeartHandshake size={20} color={color} />;
    case 'duo-flow':
      return <Users size={20} color={color} />;
    case 'pratiques-base':
    case 'pratiques-explicit':
      return <Flame size={20} color={color} />;
    case 'lexique-consent':
    case 'zones-grises':
      return <Lightbulb size={20} color={color} />;
    case 'scenarios-quotidiens':
    case 'sexting':
      return <MessageCircle size={20} color={color} />;
    case 'alcool-consent':
      return <PartyPopper size={20} color={color} />;
    case 'lgbtq-consent':
      return <Heart size={20} color={color} />;
    case 'pratiques-avancees':
      return <Zap size={20} color={color} />;
    default:
      return <Sparkles size={20} color={color} />;
  }
}

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
  const heatLocked = module.requiredHeatLevel !== undefined && currentHeatLevel < module.requiredHeatLevel;
  const fullyLocked = !module.available && !heatLocked;
  const rarityStyle = {
    common: { bg: `${colors.textMuted}22`, text: colors.textMuted, iconBg: colors.locked },
    rare: { bg: colors.rareBg, text: colors.rare, iconBg: colors.rare },
    unique: { bg: colors.uniqueBg, text: colors.unique, iconBg: colors.unique },
  } satisfies Record<Rarity, { bg: string; text: string; iconBg: string }>;
  const r = rarityStyle[module.rarity];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 70, type: 'timing', duration: 280 }}
    >
      <Pressable disabled={fullyLocked || heatLocked} onPress={() => module.screen && onNavigate(module.screen)}>
        {({ pressed }) => (
          <MotiView
            animate={{ scale: pressed ? 0.98 : 1 }}
            transition={{ type: 'timing', duration: 100 }}
            style={[
              styles.card,
              {
                backgroundColor: colors.bgCard,
                borderColor: completed ? `${r.text}77` : heatLocked ? '#f9731666' : colors.border,
                opacity: fullyLocked ? 0.55 : 1,
              },
            ]}
          >
            <IconBox size="lg" style={{ backgroundColor: completed ? r.iconBg : heatLocked ? '#f9731633' : colors.locked }}>
              {module.icon}
            </IconBox>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.wrapRow}>
                <Text numberOfLines={1} style={[styles.title, { color: colors.textPrimary }]}>{module.title}</Text>
                <View style={[styles.pill, { backgroundColor: r.bg }]}>
                  <Text style={[styles.pillText, { color: r.text }]}>{module.rarityLabel}</Text>
                </View>
                {module.heatPoints > 0 && (
                  <View style={[styles.pill, { backgroundColor: completed ? `${colors.success}22` : '#f9731622' }]}>
                    <Text style={[styles.pillText, { color: completed ? colors.success : '#f97316' }]}>
                      {completed
                        ? t('apprendre.heatPointsEarned', { n: module.heatPoints })
                        : t('apprendre.heatPoints', { n: module.heatPoints })}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.desc, { color: colors.textSecondary }]}>{module.desc}</Text>
              {heatLocked && module.requiredHeatLevel !== undefined ? (
                <Text style={[styles.reward, { color: '#f97316' }]}>
                  {t('apprendre.heatRequired', {
                    palier: t(`heat.${['', 'tiede', 'chaud', 'ardent', 'brulant', 'incandescent'][module.requiredHeatLevel]}`),
                    pts: HEAT_THRESHOLDS[module.requiredHeatLevel],
                  })}
                </Text>
              ) : (
                <Text style={[styles.reward, { color: r.text }]}>
                  {t('apprendre.rewardPrefix')}{module.reward}
                </Text>
              )}
            </View>
            {completed ? (
              <CheckCircle size={20} color={r.text} />
            ) : heatLocked ? (
              <Flame size={18} color="#f97316" />
            ) : fullyLocked ? (
              <Lock size={16} color={colors.textMuted} />
            ) : (
              <ChevronRight size={18} color={colors.textMuted} />
            )}
          </MotiView>
        )}
      </Pressable>
    </MotiView>
  );
}

export function ApprendreScreen({ isAdult: propAdult, onNavigate: propNavigate }: ApprendreScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const authAdult = useAuthStore((s) => s.isAdult);
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const isAdult = propAdult ?? authAdult;
  const onNavigate = propNavigate ?? navigateTo;
  const { completedModules } = useModuleProgressStore();
  const { level: heatLevel } = useHeat();
  const audience = moduleAudience(isAdult);
  const modules: ModuleMeta[] = getVisibleLearningModules(isAdult).map((module) => {
    const effectiveId = module.effectiveId[audience];
    const pts = MODULE_POINTS[effectiveId as EffectiveModuleId] ?? 0;
    return {
      id: module.id,
      screen: module.screen,
      icon: moduleIcon(module.id),
      title: t(module.titleKey),
      desc: module.descriptionKey ? t(module.descriptionKey) : '',
      reward: t(module.rewardKey),
      rarity: module.reward.rarity,
      rarityLabel: t(`apprendre.rarity${module.reward.rarity[0].toUpperCase()}${module.reward.rarity.slice(1)}`),
      available: module.available[audience],
      heatPoints: pts,
      requiredHeatLevel: HEAT_GATES[module.id],
    };
  });
  const availableModules = modules.filter((module) => module.available);
  const completedCount = availableModules.filter((module) => isModuleCompleted(module.id, completedModules, isAdult)).length;
  const totalAvailable = availableModules.length;
  const allDone = totalAvailable > 0 && completedCount === totalAvailable;
  const progressPct = totalAvailable > 0 ? completedCount / totalAvailable : 0;
  const subtitle = completedCount === 0
    ? t('apprendre.subtitleEmpty')
    : completedCount === 1
      ? t('apprendre.subtitleOne', { total: totalAvailable })
      : t('apprendre.subtitleMany', { count: completedCount, total: totalAvailable });

  return (
    <ScrollView
      testID="screen-apprendre"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      <MotiView from={{ opacity: 0, translateY: -8 }} animate={{ opacity: 1, translateY: 0 }} style={{ marginBottom: 24 }}>
        <View style={styles.headerRow}>
          <BookOpen size={20} color={colors.accent} />
          <Text style={[styles.h1, { color: colors.textPrimary }]}>{t('tabs.learn')}</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: `${progressPct * 100}%` }}
            transition={{ delay: 200, type: 'timing', duration: 800 }}
            style={[styles.fill, { backgroundColor: colors.accent }]}
          />
        </View>
      </MotiView>

      {allDone && (
        <View style={[styles.doneCard, { backgroundColor: `${colors.success}22`, borderColor: `${colors.success}66` }]}>
          <PartyPopper size={22} color={colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.doneTitle, { color: colors.success }]}>{t('apprendre.allDone')}</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>{t('apprendre.allDoneSub')}</Text>
          </View>
        </View>
      )}

      <View style={{ gap: 12 }}>
        {modules.map((module, index) => (
          <ModuleCard
            key={module.id}
            module={module}
            completed={isModuleCompleted(module.id, completedModules, isAdult)}
            index={index + 1}
            currentHeatLevel={heatLevel}
            onNavigate={onNavigate}
          />
        ))}
      </View>

      {isAdult !== false && (
        <ModuleCard
          module={{
            id: 'quiz-hub',
            screen: 'quiz-hub',
            icon: <Brain size={20} color="#fff" />,
            title: t('quizMl.ui.hubTitle'),
            desc: t('quizMl.ui.hubSubtitle'),
            reward: 'Débutant · Intermédiaire · Expert',
            rarity: 'common',
            rarityLabel: '9 quiz',
            available: true,
            heatPoints: 0,
          }}
          completed={false}
          index={modules.length + 2}
          currentHeatLevel={heatLevel}
          onNavigate={onNavigate}
        />
      )}
    </ScrollView>
  );
}

const styles = {
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  h1: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  track: {
    height: 5,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 10,
  },
  fill: {
    height: 5,
    borderRadius: 999,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  title: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  desc: {
    fontSize: 12,
    lineHeight: 17,
  },
  reward: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  doneCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doneTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
  },
} as const;
