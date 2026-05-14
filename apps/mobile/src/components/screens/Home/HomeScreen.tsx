// V4 divergence: navigation via useNavigationStore (pas de Next.js router)
// V4 divergence: progression 3 niveaux (Découverte/Apprentissage/Maîtrise) via getProgressLevel() — @ouiclair/core
// V4 divergence: MotiView animate à la place de framer-motion, SafeAreaInsets pour le padding

import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  GalleryHorizontal,
  Lock,
  Sparkles,
  Star,
  Users,
} from 'lucide-react-native';
import {
  getModuleSequence,
  getProgressLevel,
  isHeatUnlocked,
  isModuleCompleted,
  useAuthStore,
  useModuleProgressStore,
  useNavigationStore,
  useUnlockStore,
  type Screen,
} from '@ouiclair/core';
import { collectorCards } from '../../../data/cards-collector';
import { useHeat } from '../../../context/HeatContext';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';
import { AppLogo, DailyQuestionCard, ExplicitModeToggle, IconBox } from '../../ui';

interface HomeScreenProps {
  isAdult?: boolean | null;
  userName?: string;
  onNavigate?: (screen: Screen) => void;
}

function useHomeProps(props: HomeScreenProps) {
  const authAdult = useAuthStore((s) => s.isAdult);
  const authName = useAuthStore((s) => s.userName);
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  return {
    isAdult: props.isAdult ?? authAdult,
    userName: props.userName ?? authName,
    onNavigate: props.onNavigate ?? navigateTo,
  };
}

function getNextModuleId(isAdult: boolean | null, completedModules: string[]): string | null {
  return getModuleSequence(isAdult).find((module) => !isModuleCompleted(module.id, completedModules, isAdult))?.id ?? null;
}

function AnimatedPressable({
  children,
  onPress,
  delay = 0,
  disabled = false,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  delay?: number;
  disabled?: boolean;
  style?: object;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 320, delay: delay * 1000 }}
    >
      <Pressable onPress={disabled ? undefined : onPress} disabled={disabled}>
        {({ pressed }) => (
          <MotiView animate={{ scale: pressed ? 0.97 : 1 }} transition={{ type: 'timing', duration: 100 }} style={style}>
            {children}
          </MotiView>
        )}
      </Pressable>
    </MotiView>
  );
}

function GreetingCard({ userName }: { userName: string }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      style={[styles.card, styles.rowTop, { borderColor: colors.border, backgroundColor: colors.bgCard }]}
    >
      <AppLogo size={40} variant="theme" animated />
      <View style={{ flex: 1 }}>
        <Text style={[styles.h2, { color: colors.textPrimary }]}>
          {t('homeAdult.greeting', { name: userName || t('moi.defaultName') })}
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>{t('homeAdult.subtitle')}</Text>
      </View>
    </MotiView>
  );
}

function MinorBadge() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <MotiView from={{ opacity: 0, translateY: -10 }} animate={{ opacity: 1, translateY: 0 }} style={{ marginBottom: 20 }}>
      <View style={[styles.badge, { backgroundColor: colors.bgSecondary }]}>
        <Text style={[styles.badgeText, { color: colors.accent }]}>{t('homeMinor.badge')}</Text>
      </View>
      <Text style={[styles.h1, { color: colors.textPrimary }]}>{t('homeMinor.title')}</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>{t('homeMinor.subtitle')}</Text>
    </MotiView>
  );
}

function CollectionButton({ ownedCount, onNavigate }: { ownedCount: number; onNavigate: (screen: Screen) => void }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const totalCards = collectorCards.filter((card) => card.deck === 'A').length;

  return (
    <AnimatedPressable
      delay={0.3}
      onPress={() => onNavigate('hall-of-cards')}
      style={[styles.card, styles.row, { borderColor: colors.border, backgroundColor: colors.bgCard }]}
    >
      <IconBox size="sm" style={{ backgroundColor: colors.bgSecondary }}>
        <GalleryHorizontal size={18} color={colors.accent} />
      </IconBox>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('homeAdult.collection.title')}</Text>
        <Text style={[styles.caption, { color: colors.textMuted }]}>
          {ownedCount === 0
            ? t('homeAdult.collection.empty')
            : t('homeAdult.collection.count', { owned: ownedCount, total: totalCards })}
        </Text>
      </View>
      <ChevronRight size={16} color={colors.textMuted} />
    </AnimatedPressable>
  );
}

function HeatGatedExplicitMode({ delay }: { delay: number }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { points, level } = useHeat();
  const unlocked = isHeatUnlocked('explicit', level);

  if (unlocked) return <ExplicitModeToggle delay={delay} />;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: delay * 1000, type: 'timing', duration: 300 }}
      style={[styles.card, styles.row, { borderColor: colors.border, backgroundColor: colors.bgCard, opacity: 0.68 }]}
    >
      <IconBox size="sm" style={{ backgroundColor: '#ef444422' }}>
        <Lock size={18} color="#ef4444" />
      </IconBox>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('settings.explicit.title')}</Text>
        <Text style={[styles.caption, { color: colors.textMuted }]}>
          {t('heat.points_to_next', { n: Math.max(12 - points, 0), palier: t('heat.chaud') })}
        </Text>
      </View>
    </MotiView>
  );
}

function PrivacyText({ text }: { text: string }) {
  const { colors } = useTheme();
  return <Text style={[styles.privacy, { color: colors.textMuted }]}>{text}</Text>;
}

function DiscoveryHome({ isAdult, userName, onNavigate }: Required<HomeScreenProps>) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      {isAdult ? <GreetingCard userName={userName} /> : <MinorBadge />}
      <AnimatedPressable
        delay={0.2}
        onPress={() => onNavigate('apprendre')}
        style={[styles.heroButton, { backgroundColor: colors.accent }]}
      >
        <IconBox size="xl" rounded="2xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
          <BookOpen size={24} color="#fff" />
        </IconBox>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>{isAdult ? t('homeV3.discovery.ctaAdult') : t('homeV3.discovery.ctaMinor')}</Text>
          <Text style={styles.heroDesc}>{t('homeV3.discovery.ctaDesc')}</Text>
        </View>
        <ArrowRight size={20} color="#fff" />
      </AnimatedPressable>
      <View style={[styles.card, styles.row, { borderColor: colors.border, backgroundColor: colors.bgCard }]}>
        <IconBox style={{ backgroundColor: colors.bgSecondary }}>
          <Lock size={18} color={colors.textMuted} />
        </IconBox>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('homeV3.discovery.fomoTitle')}</Text>
          <Text style={[styles.caption, { color: colors.textMuted }]}>{t('homeV3.discovery.fomoDesc')}</Text>
        </View>
      </View>
      {isAdult && (
        <View style={{ gap: 12, marginTop: 16 }}>
          <DailyQuestionCard onPress={() => onNavigate('moi')} delay={0.45} />
          <HeatGatedExplicitMode delay={0.5} />
        </View>
      )}
      <PrivacyText text={t(isAdult ? 'homeAdult.privacy' : 'homeMinor.privacy')} />
    </View>
  );
}

function LearningHome({ isAdult, userName, onNavigate }: Required<HomeScreenProps>) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { ownedCards } = useUnlockStore();
  const { completedModules } = useModuleProgressStore();
  const sequence = getModuleSequence(isAdult);
  const progress = sequence.filter((module) => isModuleCompleted(module.id, completedModules, isAdult)).length;
  const nextModuleId = getNextModuleId(isAdult, completedModules);
  const nextModule = sequence.find((module) => module.id === nextModuleId);
  const progressPct = sequence.length > 0 ? progress / sequence.length : 0;

  return (
    <View>
      {isAdult ? <GreetingCard userName={userName} /> : <MinorBadge />}
      <View style={{ marginBottom: 20 }}>
        <View style={styles.spaceBetween}>
          <Text style={[styles.overline, { color: colors.textSecondary }]}>{t('homeV3.learning.progressLabel')}</Text>
          <Text style={[styles.overline, { color: colors.accent }]}>{progress} / {sequence.length}</Text>
        </View>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: `${Math.max(progressPct * 100, 2)}%` }}
            transition={{ delay: 250, type: 'timing', duration: 800 }}
            style={[styles.fill, { backgroundColor: colors.accent }]}
          />
        </View>
      </View>
      {nextModule?.screen && (
        <AnimatedPressable
          delay={0.28}
          onPress={() => nextModule.screen && onNavigate(nextModule.screen)}
          style={[styles.card, styles.row, { borderColor: `${colors.accent}66`, backgroundColor: colors.bgCard }]}
        >
          <IconBox style={{ backgroundColor: colors.accent }}>
            <Star size={18} color="#fff" />
          </IconBox>
          <View style={{ flex: 1 }}>
            <Text style={[styles.overline, { color: colors.accent }]}>{t('homeV3.learning.nextModuleLabel')}</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t(nextModule.titleKey)}</Text>
          </View>
          <ArrowRight size={18} color={colors.accent} />
        </AnimatedPressable>
      )}
      <CollectionButton ownedCount={ownedCards.length} onNavigate={onNavigate} />
      {isAdult && (
        <View style={{ gap: 12, marginTop: 16 }}>
          <DailyQuestionCard onPress={() => onNavigate('moi')} delay={0.38} />
          <HeatGatedExplicitMode delay={0.43} />
        </View>
      )}
      <PrivacyText text={t(isAdult ? 'homeAdult.privacy' : 'homeMinor.privacy')} />
    </View>
  );
}

function MasteryHome({ isAdult, userName, onNavigate }: Required<HomeScreenProps>) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { ownedCards } = useUnlockStore();
  const { completedModules } = useModuleProgressStore();
  const rareCount = ownedCards.filter((card) => card.rarity === 'rare').length;
  const uniqueCount = ownedCards.filter((card) => card.rarity === 'unique').length;
  const nextModuleId = getNextModuleId(isAdult, completedModules);
  const nextModule = getModuleSequence(isAdult).find((module) => module.id === nextModuleId);

  return (
    <View>
      {isAdult ? <GreetingCard userName={userName} /> : <MinorBadge />}
      <AnimatedPressable
        delay={0.2}
        onPress={() => onNavigate('hall-of-cards')}
        style={[styles.card, { borderColor: colors.border, backgroundColor: colors.bgCard }]}
      >
        <View style={[styles.row, { padding: 0, borderWidth: 0 }]}>
          <IconBox style={{ backgroundColor: colors.accent }}>
            <GalleryHorizontal size={18} color="#fff" />
          </IconBox>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {ownedCards.length === 1
                ? t('homeV3.mastery.collectionOne')
                : t('homeV3.mastery.collectionPlural', { count: ownedCards.length })}
            </Text>
            <Text style={[styles.caption, { color: colors.textMuted }]}>
              {rareCount > 0
                ? `${rareCount === 1 ? t('homeV3.mastery.rareOne') : t('homeV3.mastery.rarePlural', { count: rareCount })} · `
                : ''}
              {uniqueCount > 0
                ? uniqueCount === 1 ? t('homeV3.mastery.uniqueOne') : t('homeV3.mastery.uniquePlural', { count: uniqueCount })
                : t('homeV3.mastery.viewCollection')}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
      {isAdult && (
        <AnimatedPressable
          delay={0.28}
          onPress={() => onNavigate('duo-space')}
          style={[styles.card, styles.row, { borderColor: 'rgba(236,72,153,0.25)', backgroundColor: 'rgba(236,72,153,0.08)' }]}
        >
          <IconBox style={{ backgroundColor: '#ec4899' }}>
            <Users size={18} color="#fff" />
          </IconBox>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t('homeV3.mastery.duoTitle')}</Text>
            <Text style={[styles.caption, { color: colors.textSecondary }]}>{t('homeV3.mastery.duoDesc')}</Text>
          </View>
          <ArrowRight size={18} color="#ec4899" />
        </AnimatedPressable>
      )}
      {nextModule?.screen && (
        <AnimatedPressable
          delay={0.35}
          onPress={() => nextModule.screen && onNavigate(nextModule.screen)}
          style={[styles.card, styles.row, { borderColor: colors.border, backgroundColor: colors.bgCard }]}
        >
          <IconBox size="sm" style={{ backgroundColor: colors.bgSecondary }}>
            <Sparkles size={16} color={colors.accent} />
          </IconBox>
          <View style={{ flex: 1 }}>
            <Text style={[styles.overline, { color: colors.accent }]}>{t('homeV3.mastery.goFurther')}</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t(nextModule.titleKey)}</Text>
          </View>
          <ArrowRight size={16} color={colors.textMuted} />
        </AnimatedPressable>
      )}
      {isAdult && (
        <View style={{ gap: 12, marginTop: 8 }}>
          <DailyQuestionCard onPress={() => onNavigate('moi')} delay={0.4} />
          <HeatGatedExplicitMode delay={0.45} />
        </View>
      )}
      <PrivacyText text={t(isAdult ? 'homeAdult.privacy' : 'homeMinor.privacy')} />
    </View>
  );
}

export function HomeScreen(props: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const normalized = useHomeProps(props);
  const { completedModules } = useModuleProgressStore();
  const level = getProgressLevel(completedModules);
  const contentProps = {
    isAdult: normalized.isAdult,
    userName: normalized.userName,
    onNavigate: normalized.onNavigate,
  };

  return (
    <ScrollView
      testID="screen-home"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {level === 3 ? <MasteryHome {...contentProps} /> : level === 2 ? <LearningHome {...contentProps} /> : <DiscoveryHome {...contentProps} />}
    </ScrollView>
  );
}

const styles = {
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  h1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginBottom: 4,
  },
  h2: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroButton: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  privacy: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 16,
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    borderRadius: 999,
  },
} as const;
