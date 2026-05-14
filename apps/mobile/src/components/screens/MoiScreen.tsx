import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  BookUser,
  ChevronRight,
  Crown,
  HandHeart,
  Heart,
  HelpCircle,
  Lock,
  Settings,
  User,
  Users,
} from 'lucide-react-native';
import {
  useAuthStore,
  useModuleProgressStore,
  useNavigationStore,
  usePreferencesStore,
  usePremiumStore,
  type Screen,
} from '@ouiclair/core';
import { useHeat } from '../../context/HeatContext';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { AppLogo, HeatThermometer } from '../ui';

interface MoiScreenProps {
  isAdult?: boolean | null;
  onNavigate?: (screen: Screen) => void;
}

type PreferenceAnswer = 'curious' | 'comfortable' | 'want-to-explore' | 'not-for-me' | 'no-comment';
type TopicDefinition = { id: string };

const PREF_TOPICS: TopicDefinition[] = [
  { id: 'topic-fellation' },
  { id: 'topic-cunnilingus' },
  { id: 'topic-masturbation-mutuelle' },
  { id: 'topic-penetration' },
  { id: 'topic-sodomie' },
];

const PREF_ANSWERS: { value: PreferenceAnswer; emoji: string; tKey: string }[] = [
  { value: 'curious', emoji: '🤔', tKey: 'moi.prefAnswer_curious' },
  { value: 'comfortable', emoji: '😊', tKey: 'moi.prefAnswer_comfortable' },
  { value: 'want-to-explore', emoji: '✨', tKey: 'moi.prefAnswer_want_to_explore' },
  { value: 'not-for-me', emoji: '🙅', tKey: 'moi.prefAnswer_not_for_me' },
  { value: 'no-comment', emoji: '🔒', tKey: 'moi.prefAnswer_no_comment' },
];

const TOPIC_LABEL_KEYS: Record<string, string> = {
  'topic-fellation': 'moi.prefTopic_fellation',
  'topic-cunnilingus': 'moi.prefTopic_cunnilingus',
  'topic-masturbation-mutuelle': 'moi.prefTopic_masturbation_mutuelle',
  'topic-penetration': 'moi.prefTopic_penetration',
  'topic-sodomie': 'moi.prefTopic_sodomie',
};

function TopicAnswerCard({ topic, index }: { topic: TopicDefinition; index: number }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const currentAnswer = usePreferencesStore((s) => s.answers[topic.id]);
  const answer = usePreferencesStore((s) => s.answer);
  const labelKey = TOPIC_LABEL_KEYS[topic.id] ?? topic.id;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 60, type: 'timing', duration: 260 }}
      style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>{t(labelKey)}</Text>
      <View style={styles.answerWrap}>
        {PREF_ANSWERS.map(({ value, emoji, tKey }) => {
          const selected = currentAnswer === value;
          return (
            <Pressable key={value} onPress={() => answer(topic.id, value)}>
              <View
                style={[
                  styles.answerPill,
                  {
                    backgroundColor: selected ? `${colors.accent}22` : colors.bgSecondary,
                    borderColor: selected ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text>{emoji}</Text>
                <Text style={[styles.answerText, { color: selected ? colors.accent : colors.textSecondary }]}>{t(tKey)}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </MotiView>
  );
}

function PreferenceSection() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  const availableTopics = completedModules.includes('pratiques-base') ? PREF_TOPICS : [];

  return (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 150, type: 'timing' }} style={{ marginBottom: 24 }}>
      <View style={styles.sectionTitleRow}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('moi.prefSection_title')}</Text>
        <Lock size={12} color={colors.textMuted} />
      </View>
      {availableTopics.length === 0 ? (
        <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.desc, { color: colors.textMuted, textAlign: 'center' }]}>{t('moi.prefSection_empty')}</Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {availableTopics.map((topic, index) => <TopicAnswerCard key={topic.id} topic={topic} index={index} />)}
        </View>
      )}
    </MotiView>
  );
}

function ProfileCard({
  icon,
  title,
  desc,
  iconBg,
  onPress,
  index,
  accentColor,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  iconBg?: string;
  onPress: () => void;
  index: number;
  accentColor?: string;
}) {
  const { colors } = useTheme();
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 70, type: 'timing', duration: 280 }}
    >
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <MotiView
            animate={{ scale: pressed ? 0.97 : 1 }}
            transition={{ type: 'timing', duration: 100 }}
            style={[
              styles.profileCard,
              {
                backgroundColor: accentColor ? `${accentColor}12` : colors.bgCard,
                borderColor: accentColor ? `${accentColor}44` : colors.border,
              },
            ]}
          >
            <View style={[styles.profileIcon, { backgroundColor: iconBg ?? colors.bgSecondary }]}>{icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
              <Text style={[styles.desc, { color: colors.textSecondary }]}>{desc}</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </MotiView>
        )}
      </Pressable>
    </MotiView>
  );
}

export function MoiScreen({ isAdult: propAdult, onNavigate: propNavigate }: MoiScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const userName = useAuthStore((s) => s.userName);
  const authAdult = useAuthStore((s) => s.isAdult);
  const isAdult = propAdult ?? authAdult;
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const onNavigate = propNavigate ?? navigateTo;
  const { isPremium } = usePremiumStore();
  const { points, level: heatLevel, breakdown } = useHeat();
  let cardIndex = 0;
  const personalProfile = useModuleProgressStore((s) => s.completedModules);
  const comfortFilled = personalProfile.length > 0 ? 1 : 0;

  return (
    <ScrollView
      testID="screen-moi"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={[styles.brandCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
      >
        <AppLogo size={56} variant="theme" />
        <View style={{ flex: 1 }}>
          <View style={styles.inlineRow}>
            <User size={15} color={colors.accent} />
            <Text numberOfLines={1} style={[styles.brandTitle, { color: colors.textPrimary }]}>{userName || t('moi.defaultName')}</Text>
          </View>
          {isPremium ? (
            <View style={styles.inlineRow}>
              <Crown size={11} color={colors.unique} />
              <Text style={[styles.small, { color: colors.unique }]}>{t('games.premium')}</Text>
            </View>
          ) : (
            <Text style={[styles.small, { color: colors.textMuted }]}>Consentement</Text>
          )}
        </View>
      </MotiView>

      <View style={[styles.brandCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <HeatThermometer points={points} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('moi.heatTitle')}</Text>
          <Text style={[styles.desc, { color: colors.textMuted }]}>
            {t('moi.heatDesc', { pts: points, level: heatLevel })}
          </Text>
          {points > 0 && (
            <View style={styles.answerWrap}>
              {([
                ['moi.heatBreak_modules', breakdown.modules],
                ['moi.heatBreak_cards', breakdown.cards],
                ['moi.heatBreak_sessions', breakdown.sessions],
                ['moi.heatBreak_profile', breakdown.profile],
                ['moi.heatBreak_lexique', breakdown.lexique],
                ['moi.heatBreak_preferences', breakdown.preferences],
              ] as const).filter(([, n]) => n > 0).map(([key, n]) => (
                <Text key={key} style={[styles.small, { color: colors.textMuted }]}>
                  {t(key)} <Text style={{ color: colors.textSecondary, fontWeight: '800' }}>{t('moi.heatBreak_pts', { n })}</Text>
                </Text>
              ))}
            </View>
          )}
          {isAdult && comfortFilled < 3 && (
            <Text style={[styles.nudge, { color: '#f97316', borderColor: '#f9731633', backgroundColor: '#f9731615' }]}>
              {t('moi.heatNudge_comfort', { n: comfortFilled })} {t('moi.heatNudge_pts', { n: 3 - comfortFilled })}
            </Text>
          )}
        </View>
      </View>

      {isAdult && <PreferenceSection />}

      <View style={{ gap: 12 }}>
        {isAdult && (
          <>
            <ProfileCard
              icon={<Heart size={20} color="#fff" />}
              title={t('headers.personalSpace')}
              desc={t('moi.personalSpaceDesc')}
              iconBg={colors.premium}
              onPress={() => onNavigate('personal-space')}
              index={++cardIndex}
            />
            <ProfileCard
              icon={<Users size={20} color="#fff" />}
              title={t('headers.duoSpace')}
              desc={t('moi.duoSpaceDesc')}
              iconBg={colors.secondary}
              onPress={() => onNavigate('duo-space')}
              index={++cardIndex}
            />
            <ProfileCard
              icon={<HandHeart size={20} color="#fff" />}
              title={t('headers.accompagnementAdulte')}
              desc={t('moi.accompagnementAdulteDesc')}
              iconBg="#ec4899"
              onPress={() => onNavigate('accompagnement-adulte')}
              index={++cardIndex}
            />
            <ProfileCard
              icon={<BookUser size={20} color="#fff" />}
              title={t('headers.annuaireSexologues')}
              desc={t('moi.annuaireDesc')}
              iconBg={colors.accent}
              onPress={() => onNavigate('annuaire-sexologues')}
              index={++cardIndex}
            />
          </>
        )}
        {!isAdult && (
          <ProfileCard
            icon={<HelpCircle size={20} color="#fff" />}
            title={t('settings.help.title')}
            desc={t('moi.helpDesc')}
            iconBg={colors.unique}
            onPress={() => onNavigate('help')}
            index={++cardIndex}
          />
        )}
        <ProfileCard
          icon={<Settings size={20} color={colors.textMuted} />}
          title={t('headers.settings')}
          desc={t('moi.settingsDesc')}
          onPress={() => onNavigate('settings')}
          index={++cardIndex}
        />
        {!isPremium && (
          <ProfileCard
            icon={<Crown size={20} color="#fff" />}
            title={t('settings.premium.title')}
            desc={t('moi.premiumDesc')}
            iconBg={colors.unique}
            accentColor={colors.unique}
            onPress={() => onNavigate('premium')}
            index={++cardIndex}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = {
  brandCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },
  title: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
  },
  desc: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  small: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  answerWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  answerPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  answerText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
  },
  profileCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nudge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
} as const;
