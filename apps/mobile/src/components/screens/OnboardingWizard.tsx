// V4 divergence: wizard lit les stores directement — WizardProps supprimés
// V4 divergence: AuthStep appelle authenticate() à la place de login()
// V4 divergence: selectTheme() à la place de setTheme() ; changeLanguage() à la place de setLanguage()
// V4 divergence: KeyboardAvoidingView sur AuthStep pour le TextInput natif

import { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Keyboard, Platform, ScrollView } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Sprout, TreeDeciduous, Lock, Check, Shield, KeyRound, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import {
  useNavigationStore,
  useAuthStore,
  useSettingsStore,
  usePremiumStore,
  useModuleProgressStore,
  themes,
  type ThemeMode,
  type Language,
} from '@ouiclair/core';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';
import { AppLogo, Card, IconBox, Button } from '../ui';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StepProps { onNext: () => void }

// ─── Data ─────────────────────────────────────────────────────────────────────

const LANGUAGES: { code: Language; nativeName: string; flag: string }[] = [
  { code: 'fr', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', nativeName: 'English',  flag: '🇬🇧' },
  { code: 'es', nativeName: 'Español',  flag: '🇪🇸' },
];

const THEME_PREVIEW_COLORS: Record<ThemeMode, string[]> = {
  warm:          ['#e07a5f', '#f4a261', '#8fb996', '#e9c46a'],
  calm:          ['#5c6ac4', '#9d8cd9', '#6eb089', '#e2c36b'],
  'dark-luxury': ['#c9a84c', '#8b1a3a', '#f0ece4', '#1a1518'],
  nude:          ['#b07d6a', '#8c7860', '#2e2420', '#f2ede8'],
  youth:         ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'],
};

const THEME_GRADIENT_COLORS: Record<ThemeMode, [string, string]> = {
  warm:          ['#fef7f0', '#ffecd2'],
  calm:          ['#f5f6f8', '#e8eaef'],
  'dark-luxury': ['#0f0d0e', '#1e1520'],
  nude:          ['#faf7f4', '#f0e8e0'],
  youth:         ['#f0f7ff', '#e8f0ff'],
};

const PRONOUNS = ['il', 'elle', 'iel', 'neutre'] as const;
type PronounKey = typeof PRONOUNS[number];

// ─── Steps ────────────────────────────────────────────────────────────────────

function LanguageStep({ onNext }: StepProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { language, changeLanguage } = useSettingsStore();

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <AppLogo size={72} variant="light" />
      <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4, textAlign: 'center' }}>
          {t('language.title')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>
          {t('language.subtitle')}
        </Text>
      </View>
      <View style={{ width: '100%', gap: 12 }}>
        {LANGUAGES.map((lang) => {
          const active = language === lang.code;
          return (
            <Pressable
              key={lang.code}
              onPress={() => {
                impactAsync(ImpactFeedbackStyle.Light);
                changeLanguage(lang.code);
                setTimeout(onNext, 300);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                borderRadius: 16,
                backgroundColor: active ? `${colors.accent}18` : colors.bgCard,
                borderWidth: 2,
                borderColor: active ? colors.accent : colors.divider,
              }}
            >
              <Text style={{ fontSize: 28 }}>{lang.flag}</Text>
              <Text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: active ? colors.accent : colors.textPrimary }}>
                {lang.nativeName}
              </Text>
              {active && (
                <View style={{
                  width: 20, height: 20, borderRadius: 10,
                  backgroundColor: colors.accent,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function WelcomeAgeStep({ onNext }: StepProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { setAgeGroup } = useAuthStore();
  const { selectTheme } = useSettingsStore();

  const handleMinor = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    setAgeGroup(false);
    selectTheme('youth');
    onNext();
  };

  const handleAdult = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    setAgeGroup(true);
    onNext();
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24, gap: 20, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems: 'center' }}>
        <AppLogo size={80} variant="light" animated />
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginTop: 16, marginBottom: 4, textAlign: 'center' }}>
          {t('welcome.appName')}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#8b5cf6', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
          {t('welcome.tagline')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20, maxWidth: 280 }}>
          {t('welcome.description')}
        </Text>
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' }}>
        {t('ageCheck.title')}
      </Text>

      <View style={{ gap: 12 }}>
        <Card testID="btn-age-minor" onClick={handleMinor} variant="elevated" delay={1}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <IconBox size="xl" rounded="2xl" style={{ backgroundColor: '#d1fae5' }}>
              <Sprout size={24} color="#059669" />
            </IconBox>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
                {t('ageCheck.minor.title')}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                {t('ageCheck.minor.desc')}
              </Text>
            </View>
          </View>
        </Card>

        <Card testID="btn-age-adult" onClick={handleAdult} variant="elevated" delay={2}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <IconBox size="xl" rounded="2xl" style={{ backgroundColor: '#ede9fe' }}>
              <TreeDeciduous size={24} color="#7c3aed" />
            </IconBox>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>
                {t('ageCheck.adult.title')}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                {t('ageCheck.adult.desc')}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: 12, borderRadius: 12,
        backgroundColor: colors.bgSecondary,
        borderWidth: 1, borderColor: colors.divider,
      }}>
        <Lock size={12} color={colors.textMuted} />
        <Text style={{ fontSize: 12, color: colors.textMuted }}>{t('ageCheck.privacy')}</Text>
      </View>
    </ScrollView>
  );
}

function ThemeSelectStep({ onNext }: StepProps) {
  const { t } = useTranslation();
  const { id: currentMode } = useTheme();
  const { isAdult } = useAuthStore();
  const { selectTheme } = useSettingsStore();
  const { isPremium } = usePremiumStore();
  const { navigateTo } = useNavigationStore();

  const isMinor = isAdult === false;
  const freeThemes: ThemeMode[] = isMinor ? ['youth', 'warm', 'calm'] : ['warm', 'calm'];

  const handleSelect = (mode: ThemeMode) => {
    impactAsync(ImpactFeedbackStyle.Light);
    selectTheme(mode);
    setTimeout(onNext, 200);
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24, gap: 24, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems: 'center' }}>
        <MotiView
          from={{ scale: 0, rotate: '-180deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{
            width: 80, height: 80, borderRadius: 24,
            backgroundColor: '#7c3aed',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
            shadowColor: '#7c3aed',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
          }}
        >
          <Text style={{ fontSize: 36 }}>🎨</Text>
        </MotiView>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: currentMode ? themes[currentMode].colors.textPrimary : '#1f2937', marginBottom: 4, textAlign: 'center' }}>
          {t('themeSelect.title')}
        </Text>
        <Text style={{ fontSize: 14, color: currentMode ? themes[currentMode].colors.textSecondary : '#6b7280', textAlign: 'center' }}>
          {t('themeSelect.subtitle')}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        {freeThemes.map((mode, i) => {
          const theme = themes[mode];
          const isSelected = mode === currentMode;
          return (
            <MotiView
              key={mode}
              from={{ opacity: 0, translateX: i % 2 === 0 ? -24 : 24 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 100 + i * 80 }}
            >
              <Pressable testID={`btn-theme-${mode}`} onPress={() => handleSelect(mode)}>
                {({ pressed }) => (
                  <LinearGradient
                    colors={THEME_GRADIENT_COLORS[mode]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 20, padding: 16,
                      opacity: pressed ? 0.92 : 1,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? theme.colors.accent : 'transparent',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                      <View style={{
                        width: 48, height: 48, borderRadius: 16, overflow: 'hidden',
                        flexDirection: 'row', flexWrap: 'wrap', padding: 2, gap: 2,
                        backgroundColor: theme.colors.accentGradient,
                      }}>
                        {THEME_PREVIEW_COLORS[mode].map((c) => (
                          <View key={c} style={{ width: 20, height: 20, borderRadius: 3, backgroundColor: c }} />
                        ))}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary }}>
                          {theme.name}
                        </Text>
                        <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                          {theme.description}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={{
                          width: 24, height: 24, borderRadius: 12,
                          backgroundColor: theme.colors.accent,
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={13} color="#fff" />
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                )}
              </Pressable>
            </MotiView>
          );
        })}
      </View>

      {!isMinor && !isPremium && (
        <Pressable onPress={() => navigateTo('premium')}>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
            {t('premium.themesNote')}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function AuthStep({ onNext }: StepProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { authenticate, setPronouns } = useAuthStore();

  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [pronoun, setPronoun] = useState<PronounKey | null>(null);

  const handleContinue = () => {
    if (name.trim()) {
      Keyboard.dismiss();
      impactAsync(ImpactFeedbackStyle.Light);
      setPronouns(pronoun);
      authenticate(name.trim());
      onNext();
    } else {
      setHasError(true);
      setTimeout(() => setHasError(false), 2500);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24, gap: 24, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', paddingTop: 8 }}>
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              width: 80, height: 80, borderRadius: 24,
              backgroundColor: '#7c3aed',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
              shadowColor: '#7c3aed',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
            }}
          >
            <User size={40} color="#fff" />
          </MotiView>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8, textAlign: 'center' }}>
            {t('auth.title')}
          </Text>
          <Text style={{ fontSize: 15, color: colors.textMuted, textAlign: 'center' }}>
            {t('auth.subtitle')}
          </Text>
        </View>

        <Card variant="default" padding="lg">
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: 8 }}>
            {t('auth.nameLabel')}
          </Text>
          <TextInput
            value={name}
            onChangeText={(v) => { setName(v); if (hasError) setHasError(false); }}
            placeholder={t('auth.namePlaceholder')}
            placeholderTextColor={colors.textMuted}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 2,
              fontSize: 16,
              backgroundColor: colors.bgSecondary,
              borderColor: hasError ? colors.error : isFocused ? colors.accent : colors.border,
              color: colors.textPrimary,
            }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Shield size={11} color={colors.textMuted} />
            <Text style={{ fontSize: 12, color: hasError ? colors.error : colors.textMuted }}>
              {hasError ? t('auth.nameRequired') : t('auth.namePrivacy')}
            </Text>
          </View>
        </Card>

        <Card variant="default" padding="lg">
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: 12 }}>
            {t('auth.pronounsLabel')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {PRONOUNS.map((p) => {
              const active = pronoun === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => { impactAsync(ImpactFeedbackStyle.Light); setPronoun(active ? null : p); }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: active ? colors.accent : colors.bgSecondary,
                    borderWidth: 1,
                    borderColor: active ? colors.accent : colors.divider,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '500', color: active ? '#fff' : colors.textMuted }}>
                    {t(`auth.pronounOptions.${p}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Button testID="btn-onboarding-continue" onPress={handleContinue} fullWidth size="lg" icon={<KeyRound size={18} color="#fff" />}>
          {t('auth.btnContinue')}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Wizard shell ─────────────────────────────────────────────────────────────

export function OnboardingWizard() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { replaceWith } = useNavigationStore();
  const { isAdult } = useAuthStore();
  const { markOnboardingSkipped } = useModuleProgressStore();
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(0);

  // Frozen at mount — matches V3 logic to avoid step count changing mid-wizard
  const steps = useMemo<Array<{ id: string }>>(() => [
    { id: 'language' },
    { id: 'welcome-age' },
    { id: 'theme-select' },
    ...(isAdult !== false ? [{ id: 'auth' }] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const total = steps.length;

  const handleNext = useCallback(() => {
    if (stepIndex < total - 1) {
      setStepIndex((i) => i + 1);
    } else {
      markOnboardingSkipped();
      replaceWith('home');
    }
  }, [stepIndex, total, markOnboardingSkipped, replaceWith]);

  const handleSkip = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    markOnboardingSkipped();
    replaceWith('home');
  };

  const currentStepId = steps[stepIndex]?.id ?? 'language';

  const renderStep = () => {
    if (currentStepId === 'language')     return <LanguageStep onNext={handleNext} />;
    if (currentStepId === 'welcome-age')  return <WelcomeAgeStep onNext={handleNext} />;
    if (currentStepId === 'theme-select') return <ThemeSelectStep onNext={handleNext} />;
    if (currentStepId === 'auth')         return <AuthStep onNext={handleNext} />;
    return null;
  };

  return (
    <View
      testID="screen-onboarding"
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
    >
      {/* Progress dots + skip */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: insets.top + 12,
        paddingBottom: 12,
      }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {steps.map((_, i) => (
            <MotiView
              key={i}
              animate={{ width: i === stepIndex ? 20 : 8 }}
              transition={{ type: 'timing', duration: 300 }}
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: i <= stepIndex ? colors.accent : colors.bgSecondary,
              }}
            />
          ))}
        </View>
        <Pressable
          onPress={handleSkip}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: colors.bgSecondary,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textMuted }}>
            {t('onboarding.skip') || 'Passer'}
          </Text>
        </Pressable>
      </View>

      {/* Step content with slide animation */}
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <AnimatePresence>
          <MotiView
            key={currentStepId}
            from={{ opacity: 0, translateX: 28 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -28 }}
            transition={{ type: 'timing', duration: 300 }}
            style={{ flex: 1 }}
          >
            {renderStep()}
          </MotiView>
        </AnimatePresence>
      </View>
    </View>
  );
}
