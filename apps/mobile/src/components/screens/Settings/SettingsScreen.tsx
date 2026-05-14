// V4 divergence: navigation via useNavigationStore (pas de Next.js router)
// V4 divergence: resetAllMobileData() inline — pas d'équivalent dans @ouiclair/core (stores multiples)
// V4 divergence: Modal RN natif à la place d'un dialog web, Header depuis ../ui

import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Crown,
  Flame,
  Globe,
  Heart,
  LifeBuoy,
  Palette,
  RotateCcw,
  Trash2,
} from 'lucide-react-native';
import {
  initialPersonalProfile,
  useAuthStore,
  useDuoStore,
  useLexiqueStore,
  useModuleProgressStore,
  useNavigationStore,
  usePreferencesStore,
  usePremiumStore,
  useProfileStore,
  useSettingsStore,
  useUnlockStore,
  type Language,
  type Screen,
} from '@ouiclair/core';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';
import { Button, ExplicitModeToggle, Header } from '../../ui';

interface SettingsScreenProps {
  isPremium?: boolean;
  isAdult?: boolean;
  onNavigate?: (screen: Screen) => void;
}

function resetAllMobileData() {
  useAuthStore.setState({ isAuthenticated: false, isAdult: null, userName: '', pronouns: null });
  useSettingsStore.setState({ themeMode: null, theme: null, explicitMode: false });
  useProfileStore.setState({ personalProfile: initialPersonalProfile });
  usePremiumStore.setState({ isPremium: false });
  useDuoStore.getState().reset();
  useUnlockStore.getState().reset();
  useModuleProgressStore.getState().reset();
  useLexiqueStore.getState().reset();
  usePreferencesStore.getState().reset();
}

function SectionTitle({ label }: { label: string }) {
  const { colors } = useTheme();
  return <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{label}</Text>;
}

function SettingsRow({
  icon,
  title,
  desc,
  accent,
  onPress,
  right,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  const { colors } = useTheme();
  const content = (
    <MotiView
      animate={{ scale: 1 }}
      style={[styles.row, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
    >
      <View style={[styles.iconBox, { backgroundColor: `${accent}20` }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: danger ? colors.danger : colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.desc, { color: colors.textMuted }]}>{desc}</Text>
      </View>
      {right ?? (onPress ? <ChevronRight size={16} color={colors.textMuted} /> : null)}
    </MotiView>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: 'timing', duration: 100 }}>
          {content}
        </MotiView>
      )}
    </Pressable>
  );
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
];

function LanguagePicker() {
  const { colors } = useTheme();
  const { language, changeLanguage } = useSettingsStore();

  return (
    <View style={styles.languageRow}>
      {LANGUAGES.map(({ code, label }) => {
        const active = language === code;
        return (
          <Pressable key={code} onPress={() => changeLanguage(code)}>
            <View
              style={[
                styles.smallPill,
                {
                  backgroundColor: active ? colors.accent : colors.bgSecondary,
                  borderColor: active ? colors.accent : colors.divider,
                },
              ]}
            >
              <Text style={[styles.smallPillText, { color: active ? '#fff' : colors.textMuted }]}>{label}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const PRONOUNS = ['il', 'elle', 'iel', 'neutre'] as const;

function PronounPills() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const pronouns = useAuthStore((s) => s.pronouns);
  const setPronouns = useAuthStore((s) => s.setPronouns);

  return (
    <View style={styles.languageRow}>
      {PRONOUNS.map((pronoun) => {
        const active = pronouns === pronoun;
        return (
          <Pressable key={pronoun} onPress={() => setPronouns(active ? null : pronoun)}>
            <View
              style={[
                styles.smallPill,
                {
                  backgroundColor: active ? colors.accent : colors.bgSecondary,
                  borderColor: active ? colors.accent : colors.divider,
                },
              ]}
            >
              <Text style={[styles.smallPillText, { color: active ? '#fff' : colors.textMuted }]}>
                {t(`settings.profile.pronounOptions.${pronoun}`)}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function ConfirmModal({
  visible,
  title,
  body,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.modalBackdrop}>
        <Pressable onPress={(event) => event.stopPropagation()} style={[styles.modalCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.modalBody, { color: colors.textMuted }]}>{body}</Text>
          <View style={styles.modalActions}>
            <Button variant="outline" onPress={onClose} style={{ flex: 1 }}>{t('settings.reset.cancel')}</Button>
            <Button variant="primary" onPress={onConfirm} style={{ flex: 1, backgroundColor: colors.danger }}>{confirmLabel}</Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function SettingsScreen({ isPremium: propPremium, isAdult: propAdult, onNavigate: propNavigate }: SettingsScreenProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const goBack = useNavigationStore((s) => s.goBack);
  const onNavigate = propNavigate ?? navigateTo;
  const authAdult = useAuthStore((s) => s.isAdult);
  const isAdult = propAdult ?? authAdult === true;
  const isPremiumStore = usePremiumStore((s) => s.isPremium);
  const isPremium = propPremium ?? isPremiumStore;
  const { userName, setName } = useAuthStore();
  const markOnboardingSkipped = useModuleProgressStore((s) => s.markOnboardingSkipped);
  const [showReset, setShowReset] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [nameDraft, setNameDraft] = useState(userName);
  const [nameFocused, setNameFocused] = useState(false);

  const handleNameBlur = () => {
    setNameFocused(false);
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== userName) setName(trimmed);
    if (!trimmed) setNameDraft(userName);
  };

  const handleReplayIntro = () => {
    markOnboardingSkipped();
    onNavigate('module-de-base');
  };

  const handleReset = () => {
    resetAllMobileData();
    setShowReset(false);
  };

  const handleDelete = () => {
    resetAllMobileData();
    setShowDeleteAccount(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <Header title={t('headers.settings')} showBack onBack={goBack} theme={theme} />
      <ScrollView
        testID="screen-settings"
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle label={t('settings.sections.profile')} />
        <View style={[styles.profilePanel, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{t('settings.profile.name')}</Text>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              onFocus={() => setNameFocused(true)}
              onBlur={handleNameBlur}
              placeholder={t('settings.profile.namePlaceholder')}
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.bgSecondary,
                  borderColor: nameFocused ? colors.accent : colors.divider,
                  color: colors.textPrimary,
                },
              ]}
            />
          </View>
          <View>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
              {t('settings.profile.pronouns')} <Text>{t('settings.profile.pronounsOptional')}</Text>
            </Text>
            <PronounPills />
          </View>
        </View>

        {isAdult && (
          <SettingsRow
            icon={<Heart size={20} color={colors.accent} />}
            title={t('settings.profile.personalSpace')}
            desc={t('settings.profile.personalSpaceDesc')}
            accent={colors.accent}
            onPress={() => onNavigate('personal-space')}
          />
        )}

        <SectionTitle label={t('settings.sections.appearance')} />
        <SettingsRow
          icon={<Globe size={20} color={colors.accent} />}
          title={t('settings.language.title')}
          desc={t('settings.language.desc')}
          accent="#6366f1"
          right={<LanguagePicker />}
        />
        <SettingsRow
          icon={<Palette size={20} color="#8b5cf6" />}
          title={t('settings.theme.title')}
          desc={t('settings.theme.desc')}
          accent="#8b5cf6"
          onPress={() => onNavigate('theme-select')}
        />

        <SectionTitle label={t('settings.sections.content')} />
        {isAdult && (
          <SettingsRow
            icon={<Flame size={20} color="#ef4444" />}
            title={t('settings.explicit.title')}
            desc={t('settings.explicit.desc')}
            accent="#ef4444"
            right={<ExplicitModeToggle pillOnly />}
          />
        )}
        <SettingsRow
          icon={<BookOpen size={20} color={colors.accent} />}
          title={t('settings.replayIntro.title')}
          desc={t('settings.replayIntro.desc')}
          accent={colors.accent}
          onPress={handleReplayIntro}
        />

        <SectionTitle label={t('settings.sections.app')} />
        <SettingsRow
          icon={<LifeBuoy size={20} color="#14b8a6" />}
          title={t('settings.help.title')}
          desc={t('settings.help.desc')}
          accent="#14b8a6"
          onPress={() => onNavigate('help')}
        />
        <SettingsRow
          icon={<Crown size={20} color={isPremium ? colors.unique : colors.textMuted} />}
          title={isPremium ? t('settings.premiumActive.title') : t('settings.premium.title')}
          desc={isPremium ? t('settings.premiumActive.desc') : t('settings.premium.desc')}
          accent={isPremium ? colors.unique : colors.textMuted}
          onPress={isPremium ? undefined : () => onNavigate('premium')}
          right={isPremium ? <CheckCircle2 size={18} color={colors.unique} /> : undefined}
        />
        <SettingsRow
          icon={<RotateCcw size={20} color={colors.danger} />}
          title={t('settings.reset.title')}
          desc={t('settings.reset.desc')}
          accent={colors.danger}
          onPress={() => setShowReset(true)}
          danger
        />
        <SettingsRow
          icon={<Trash2 size={20} color={colors.danger} />}
          title={t('settings.deleteAccount.title')}
          desc={t('settings.deleteAccount.desc')}
          accent={colors.danger}
          onPress={() => setShowDeleteAccount(true)}
          danger
        />
      </ScrollView>

      <ConfirmModal
        visible={showReset}
        title={t('settings.reset.title')}
        body={t('settings.reset.confirm')}
        confirmLabel={t('settings.reset.cta')}
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
      />
      <ConfirmModal
        visible={showDeleteAccount}
        title={t('settings.deleteAccount.confirmTitle')}
        body={t('settings.deleteAccount.confirmBody')}
        confirmLabel={t('settings.deleteAccount.cta')}
        onClose={() => setShowDeleteAccount(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

const styles = {
  sectionTitle: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    paddingHorizontal: 4,
    paddingTop: 10,
    paddingBottom: 2,
  },
  row: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  smallPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  smallPillText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
  },
  profilePanel: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  inputLabel: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  modalCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  modalTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
  },
} as const;
