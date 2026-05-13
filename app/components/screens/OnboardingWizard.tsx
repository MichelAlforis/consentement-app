'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, TreeDeciduous, Lock,
  ShieldCheck, KeyRound, Shield, User,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../i18n';
import { useAuthStore } from '../../stores/authStore';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { AppLogo } from '../ui/AppLogo';
import { Button, Card } from '../ui';
import { themes, type ThemeMode } from '../../types/theme';
import type { Language, Screen } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StepProps {
  onNext: () => void;
}

interface WizardProps {
  isAdult: boolean | null;
  isPremium: boolean;
  onSetAge: (adult: boolean) => void;
  onSelectTheme: (mode: ThemeMode) => void;
  onAuth: (name: string) => void;
  onNavigate: (screen: Screen) => void;
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function LanguageStep({ onNext }: StepProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const LANGUAGES: { code: Language; nativeName: string }[] = [
    { code: 'fr', nativeName: 'Français' },
    { code: 'en', nativeName: 'English' },
    { code: 'es', nativeName: 'Español' },
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-8">
      <AppLogo className="w-[4.5rem] h-[4.5rem]" variant="light" />
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{t('language.title')}</h1>
        <p className="text-sm" style={{ color: colors.textMuted }}>{t('language.subtitle')}</p>
      </div>
      <div className="w-full max-w-xs space-y-3">
        {LANGUAGES.map((lang) => {
          const active = language === lang.code;
          return (
            <motion.button
              key={lang.code}
              whileTap={{ scale: 0.97 }}
              onClick={() => changeLanguage(lang.code)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-left"
              style={{
                background: active ? `${colors.accent}18` : colors.bgCard,
                border: `2px solid ${active ? colors.accent : colors.divider}`,
                color: active ? colors.accent : colors.textPrimary,
              }}
            >
              <span className="font-semibold">{lang.nativeName}</span>
              {active && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: colors.accent }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      <Button onClick={onNext} fullWidth size="lg">{t('language.cta')}</Button>
    </div>
  );
}

function WelcomeAgeStep({ onNext, onSetAge, onSelectTheme }: StepProps & {
  onSetAge: (a: boolean) => void;
  onSelectTheme: (m: ThemeMode) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <div className="flex flex-col px-6 py-8 gap-5">
      <div className="text-center">
        <AppLogo className="w-20 h-20" variant="light" animated />
        <h1 className="text-2xl font-bold mt-4 mb-1" style={{ color: colors.textPrimary }}>{t('welcome.appName')}</h1>
        <p className="text-sm font-medium text-violet-500 tracking-widest uppercase">{t('welcome.tagline')}</p>
        <p className="text-sm mt-2 max-w-xs mx-auto leading-relaxed" style={{ color: colors.textMuted }}>{t('welcome.description')}</p>
      </div>
      <p className="text-center font-semibold" style={{ color: colors.textPrimary }}>{t('ageCheck.title')}</p>
      <div className="space-y-3">
        <Card onClick={() => { onSetAge(false); onSelectTheme('youth'); onNext(); }} variant="elevated" delay={1}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center shrink-0">
              <Sprout size={24} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{t('ageCheck.minor.title')}</h3>
              <p className="text-sm mt-0.5" style={{ color: colors.textMuted }}>{t('ageCheck.minor.desc')}</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => { onSetAge(true); onNext(); }} variant="elevated" delay={2}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center shrink-0">
              <TreeDeciduous size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{t('ageCheck.adult.title')}</h3>
              <p className="text-sm mt-0.5" style={{ color: colors.textMuted }}>{t('ageCheck.adult.desc')}</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex items-center justify-center gap-2 p-3 rounded-xl"
        style={{ background: colors.bgSecondary, border: `1px solid ${colors.divider}` }}>
        <Lock size={12} style={{ color: colors.textMuted }} />
        <p className="text-xs" style={{ color: colors.textMuted }}>{t('ageCheck.privacy')}</p>
      </div>
    </div>
  );
}

const themePreviewColors: Record<ThemeMode, string[]> = {
  warm:          ['#e07a5f', '#f4a261', '#8fb996', '#e9c46a'],
  calm:          ['#5c6ac4', '#9d8cd9', '#6eb089', '#e2c36b'],
  'dark-luxury': ['#c9a84c', '#8b1a3a', '#f0ece4', '#1a1518'],
  nude:          ['#b07d6a', '#8c7860', '#2e2420', '#f2ede8'],
  youth:         ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'],
};

const themeGradients: Record<ThemeMode, string> = {
  warm:          'linear-gradient(135deg, #fef7f0 0%, #ffecd2 100%)',
  calm:          'linear-gradient(135deg, #f5f6f8 0%, #e8eaef 100%)',
  'dark-luxury': 'linear-gradient(135deg, #0f0d0e 0%, #1e1520 100%)',
  nude:          'linear-gradient(135deg, #faf7f4 0%, #f0e8e0 100%)',
  youth:         'linear-gradient(135deg, #f0f7ff 0%, #e8f0ff 100%)',
};

function ThemeSelectStep({ onNext, onSelectTheme, isAdult, isPremium, onGoPremium }: StepProps & {
  onSelectTheme: (m: ThemeMode) => void;
  isAdult: boolean | null;
  isPremium: boolean;
  onGoPremium: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const isMinor = isAdult === false;
  const freeThemes: ThemeMode[] = isMinor ? ['youth', 'warm', 'calm'] : ['warm', 'calm'];

  return (
    <div className="flex flex-col px-6 py-8 gap-6">
      <div className="text-center">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-800 mb-4 shadow-2xl">
          <ShieldCheck size={36} className="text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{t('themeSelect.title')}</h1>
        <p className="text-sm" style={{ color: colors.textMuted }}>{t('themeSelect.subtitle')}</p>
      </div>
      <div className="space-y-3">
        {freeThemes.map((mode, i) => {
          const theme = themes[mode];
          return (
            <motion.button key={mode}
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }} whileTap={{ scale: 0.98 }}
              onClick={() => { onSelectTheme(mode); onNext(); }}
              className="relative overflow-hidden rounded-3xl p-5 text-left w-full"
              style={{ background: themeGradients[mode], boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden grid grid-cols-2 gap-px p-px"
                  style={{ background: theme.colors.accentGradient }}>
                  {themePreviewColors[mode].map((c) => (
                    <div key={c} className="rounded-[3px]" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: theme.colors.textPrimary }}>{theme.name}</h3>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>{theme.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      {!isMinor && !isPremium && (
        <button onClick={onGoPremium} className="text-sm text-center font-medium" style={{ color: colors.textMuted }}>
          {t('premium.themesNote')}
        </button>
      )}
    </div>
  );
}

function AuthStep({ onNext, onAuth }: StepProps & { onAuth: (name: string) => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { setPronouns } = useAuthStore();
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [pronoun, setPronoun] = useState<'il' | 'elle' | 'iel' | 'neutre' | null>(null);
  const PRONOUNS = ['il', 'elle', 'iel', 'neutre'] as const;

  const handleContinue = () => {
    if (name.trim()) { setPronouns(pronoun); onAuth(name.trim()); onNext(); }
    else { setHasError(true); setTimeout(() => setHasError(false), 2500); }
  };

  return (
    <div className="flex flex-col px-6 py-8 gap-6">
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4 shadow-xl shadow-violet-300/50">
          <User size={40} className="text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{t('auth.title')}</h2>
        <p style={{ color: colors.textMuted }}>{t('auth.subtitle')}</p>
      </div>

      <Card variant="default" padding="lg">
        <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>{t('auth.nameLabel')}</label>
        <motion.div animate={hasError ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.35 }}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.namePlaceholder')} autoFocus
            onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-3 rounded-xl border-2 text-base focus:outline-none"
            style={{
              background: colors.bgSecondary,
              borderColor: hasError ? colors.error : isFocused ? colors.accent : colors.border,
              color: colors.textPrimary,
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          />
        </motion.div>
        <div className="flex items-center gap-1.5 mt-2">
          <Shield size={11} style={{ color: colors.textMuted }} />
          <p className="text-xs" style={{ color: hasError ? colors.error : colors.textMuted }}>
            {hasError ? t('auth.nameRequired') : t('auth.namePrivacy')}
          </p>
        </div>
      </Card>

      <Card variant="default" padding="lg">
        <p className="text-sm font-medium mb-3" style={{ color: colors.textSecondary }}>{t('auth.pronounsLabel')}</p>
        <div className="flex flex-wrap gap-2">
          {PRONOUNS.map((p) => (
            <motion.button key={p} whileTap={{ scale: 0.95 }}
              onClick={() => setPronoun(pronoun === p ? null : p)}
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: pronoun === p ? colors.accent : colors.bgSecondary,
                color: pronoun === p ? '#fff' : colors.textMuted,
                border: `1px solid ${pronoun === p ? colors.accent : colors.divider}`,
              }}>
              {t(`auth.pronounOptions.${p}`)}
            </motion.button>
          ))}
        </div>
      </Card>

      <Button onClick={handleContinue} fullWidth size="lg">
        <KeyRound size={18} />
        {t('auth.btnContinue')}
      </Button>
    </div>
  );
}

// ─── Wizard shell ──────────────────────────────────────────────────────────────

export function OnboardingWizard({ isAdult, isPremium, onSetAge, onSelectTheme, onAuth, onNavigate }: WizardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const markOnboardingSkipped = useModuleProgressStore((s) => s.markOnboardingSkipped);
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Array<{ id: string }> = [
    { id: 'language' },
    { id: 'welcome-age' },
    { id: 'theme-select' },
    ...(isAdult !== false ? [{ id: 'auth' }] : []),
  ];

  const total = steps.length;
  const progress = total > 1 ? (stepIndex / (total - 1)) * 100 : 0;

  const handleNext = useCallback(() => {
    if (stepIndex < total - 1) {
      setStepIndex((i) => i + 1);
    } else {
      markOnboardingSkipped();
      onNavigate('home');
    }
  }, [stepIndex, total, markOnboardingSkipped, onNavigate]);

  const handleSkip = () => {
    markOnboardingSkipped();
    onNavigate('home');
  };

  const currentStepId = steps[stepIndex]?.id ?? 'language';

  const renderStep = () => {
    if (currentStepId === 'language') return <LanguageStep onNext={handleNext} />;
    if (currentStepId === 'welcome-age') return (
      <WelcomeAgeStep onNext={handleNext} onSetAge={onSetAge} onSelectTheme={onSelectTheme} />
    );
    if (currentStepId === 'theme-select') return (
      <ThemeSelectStep onNext={handleNext} onSelectTheme={onSelectTheme} isAdult={isAdult}
        isPremium={isPremium} onGoPremium={() => onNavigate('premium')} />
    );
    if (currentStepId === 'auth') return <AuthStep onNext={handleNext} onAuth={onAuth} />;
    return null;
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden" style={{ background: colors.bgGradient ?? colors.bgPrimary }}>
      <div className="shrink-0 flex items-center gap-3 px-5 pt-5 pb-3 safe-area-top">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: colors.bgSecondary }}>
          <motion.div className="h-full rounded-full" style={{ background: colors.accent }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
        </div>
        <button onClick={handleSkip} className="shrink-0 text-sm font-medium px-4 py-1.5 rounded-full"
          style={{ color: colors.textMuted, background: colors.bgSecondary }}>
          {t('onboarding.skip') || 'Passer'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div key={currentStepId}
            initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="min-h-full">
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
