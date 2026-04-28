'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Calendar, Sprout, TreeDeciduous, Lock,
  ShieldCheck, BookOpen, MessageCircle, BadgeCheck, ArrowRight,
  Flag, KeyRound, Shield, Landmark, Check,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../i18n';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { useModuleComplete } from '../../lib/useModuleComplete';
import { AppLogo } from '../ui/AppLogo';
import { Button, Card } from '../ui';
import { ONBOARDING_ICON_MAP } from '../../utils/onboardingIcons';
import { MODULE_DE_BASE_SLIDES, MODULE_DE_BASE_SLIDES_MINEUR } from '../../data/moduleDeBase';
import { themes, type ThemeMode } from '../../types/theme';
import type { Language, Screen } from '../../types';
import { comfortCategories } from '../../data';

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

// ─── Steps content ────────────────────────────────────────────────────────────

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
      <AppLogo height={72} variant="light" />
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

function WelcomeStep({ onNext }: StepProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const pillars = [
    { icon: <ShieldCheck size={14} />, label: t('welcome.pillars.consent') },
    { icon: <BookOpen size={14} />, label: t('welcome.pillars.education') },
    { icon: <MessageCircle size={14} />, label: t('welcome.pillars.dialogue') },
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-8 text-center">
      <AppLogo height={140} variant="light" animated />
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: colors.textPrimary }}>{t('welcome.appName')}</h1>
        <p className="text-sm font-medium text-violet-500 tracking-widest uppercase">{t('welcome.tagline')}</p>
      </div>
      <p className="text-base leading-relaxed max-w-xs" style={{ color: colors.textMuted }}>{t('welcome.description')}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {pillars.map((p) => (
          <span key={p.label} className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
            style={{ background: colors.bgCard, color: colors.textSecondary, border: `1px solid ${colors.divider}` }}>
            {p.icon}{p.label}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: colors.textMuted }}>
        <BadgeCheck size={13} className="text-violet-500 shrink-0" />
        {t('welcome.legalBadge')}
      </div>
      <Button onClick={onNext} fullWidth size="lg">
        {t('welcome.cta')} <ArrowRight size={18} />
      </Button>
    </div>
  );
}

function AgeCheckStep({ onNext, onSetAge, onSelectTheme }: StepProps & { onSetAge: (a: boolean) => void; onSelectTheme: (m: ThemeMode) => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <div className="flex flex-col px-6 py-8 gap-6">
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-200 mb-4 shadow-lg shadow-amber-200/50">
          <Calendar size={40} className="text-amber-600" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{t('ageCheck.title')}</h2>
        <p style={{ color: colors.textMuted }}>{t('ageCheck.subtitle')}</p>
      </div>
      <div className="space-y-4">
        <Card onClick={() => { onSetAge(false); onSelectTheme('youth'); onNext(); }} variant="elevated" delay={1}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
              <Sprout size={28} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>{t('ageCheck.minor.title')}</h3>
              <p className="text-sm mt-1" style={{ color: colors.textMuted }}>{t('ageCheck.minor.desc')}</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => { onSetAge(true); onNext(); }} variant="elevated" delay={2}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center">
              <TreeDeciduous size={28} className="text-emerald-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>{t('ageCheck.adult.title')}</h3>
              <p className="text-sm mt-1" style={{ color: colors.textMuted }}>{t('ageCheck.adult.desc')}</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex items-center justify-center gap-2 p-4 rounded-2xl"
        style={{ background: colors.bgSecondary, border: `1px solid ${colors.divider}` }}>
        <Lock size={13} style={{ color: colors.textMuted }} />
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
  const [showInput, setShowInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [pronoun, setPronoun] = useState<'il' | 'elle' | 'iel' | 'neutre' | null>(null);
  const PRONOUNS = ['il', 'elle', 'iel', 'neutre'] as const;

  const handleContinue = () => {
    if (!showInput) { setShowInput(true); return; }
    if (name.trim()) { setPronouns(pronoun); onAuth(name.trim()); onNext(); }
    else { setHasError(true); setTimeout(() => setHasError(false), 2500); }
  };

  return (
    <div className="flex flex-col px-6 py-8 gap-6">
      <div className="text-center">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4 shadow-xl shadow-blue-300/50">
          <Flag size={48} className="text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{t('auth.title')}</h2>
        <p style={{ color: colors.textMuted }}>{t('auth.subtitle')}</p>
      </div>

      {showInput && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
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
            <p className="text-xs mt-2" style={{ color: hasError ? colors.error : colors.textMuted }}>
              {hasError ? t('auth.nameRequired') : t('auth.namePrivacy')}
            </p>
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
        </motion.div>
      )}

      <Button onClick={handleContinue} fullWidth size="lg">
        <KeyRound size={18} />
        {showInput ? t('auth.btnContinue') : t('auth.btnConnect')}
      </Button>

      {!showInput && (
        <Card variant="default" padding="lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
            <Lock size={16} style={{ color: colors.textMuted }} />{t('auth.why.title')}
          </h4>
          <ul className="space-y-2">
            {[t('auth.why.reason1'), t('auth.why.reason2'), t('auth.why.reason3')].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-sm" style={{ color: colors.textSecondary }}>
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <Check size={12} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex justify-center gap-2 flex-wrap">
        {[
          { icon: <Shield size={12} />, label: t('auth.badges.encrypted') },
          { icon: <Flag size={12} />, label: t('auth.badges.rgpd') },
          { icon: <Landmark size={12} />, label: t('auth.badges.official') },
        ].map(({ icon, label }) => (
          <span key={label} className="px-3 py-1.5 bg-blue-50 rounded-full text-xs text-blue-600 font-medium flex items-center gap-1.5">
            {icon}{label}
          </span>
        ))}
      </div>
    </div>
  );
}

const COMFORT_CATS = [
  { key: 'tenderness' as const, labelKey: 'personalIntro.tenderness', color: '#f8a5c2' },
  { key: 'intensity'  as const, labelKey: 'personalIntro.intensity',  color: '#ff7675' },
  { key: 'trust'      as const, labelKey: 'personalIntro.trust',      color: '#a29bfe' },
];

function PersonalIntroStep({ onNext }: StepProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { updateComfortLevel } = useProfileStore();
  const [values, setValues] = useState({ tenderness: 2, intensity: 2, trust: 2 });

  const handleSave = () => {
    for (const cat of COMFORT_CATS) {
      for (const item of comfortCategories[cat.key].items) {
        updateComfortLevel(cat.key, item.id, values[cat.key]);
      }
    }
    onNext();
  };

  return (
    <div className="flex flex-col items-center px-6 py-8 gap-6">
      <AppLogo height={56} variant="theme" />
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{t('personalIntro.title')}</h1>
        <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>{t('personalIntro.subtitle')}</p>
      </div>
      <div className="w-full space-y-4">
        {COMFORT_CATS.map((cat) => (
          <div key={cat.key} className="p-4 rounded-2xl" style={{ background: colors.bgCard, border: `1px solid ${colors.divider}` }}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{t(cat.labelKey)}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${cat.color}22`, color: cat.color }}>{values[cat.key]} / 4</span>
            </div>
            <input type="range" min={0} max={4} step={1} value={values[cat.key]}
              onChange={(e) => setValues((v) => ({ ...v, [cat.key]: Number(e.target.value) }))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: cat.color,
                background: `linear-gradient(to right, ${cat.color} 0%, ${cat.color} ${values[cat.key] * 25}%, ${colors.divider} ${values[cat.key] * 25}%, ${colors.divider} 100%)`,
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: colors.textMuted }}>Non</span>
              <span className="text-xs" style={{ color: colors.textMuted }}>J&apos;adore</span>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full space-y-2">
        <Button onClick={handleSave} fullWidth size="lg">{t('personalIntro.ctaNow')}</Button>
        <button onClick={onNext} className="w-full py-3 text-sm font-medium" style={{ color: colors.textMuted }}>
          {t('personalIntro.ctaLater')}
        </button>
      </div>
    </div>
  );
}

function SlideStep({ slide, isLast, onNext }: { slide: { iconName: string; title: string; body: string }; isLast: boolean; onNext: () => void }) {
  const { colors } = useTheme();
  const Icon = ONBOARDING_ICON_MAP[slide.iconName];
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-8 gap-5 min-h-full">
      {Icon && (
        <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
          <Icon size={64} color={colors.accent} />
        </motion.div>
      )}
      <h1 className="text-2xl font-black leading-tight" style={{ color: colors.textPrimary }}>{slide.title}</h1>
      <p className="text-base leading-relaxed whitespace-pre-line max-w-sm" style={{ color: colors.textSecondary }}>{slide.body}</p>
      <motion.button whileTap={{ scale: 0.96 }} onClick={onNext}
        className="w-full max-w-sm py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 mt-2"
        style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent})`, color: 'white', boxShadow: `0 6px 24px ${colors.accent}44` }}>
        {isLast ? 'J\'ai compris · Voir l\'accueil' : 'Suivant'}
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}

// ─── Wizard shell ──────────────────────────────────────────────────────────────

export function OnboardingWizard({ isAdult, isPremium, onSetAge, onSelectTheme, onAuth, onNavigate }: WizardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const markOnboardingSkipped = useModuleProgressStore((s) => s.markOnboardingSkipped);
  const completeModule = useModuleComplete();
  const [stepIndex, setStepIndex] = useState(0);

  const slides = isAdult === false ? MODULE_DE_BASE_SLIDES_MINEUR : MODULE_DE_BASE_SLIDES;

  const steps: Array<{ id: string; skipForAdultOnly?: boolean }> = [
    { id: 'language' },
    { id: 'welcome' },
    { id: 'age-check' },
    { id: 'theme-select' },
    ...(isAdult !== false ? [{ id: 'auth', skipForAdultOnly: true }, { id: 'personal-intro', skipForAdultOnly: true }] : []),
    ...slides.map((s) => ({ id: `slide-${s.id}` })),
  ];

  const total = steps.length;
  const progress = total > 1 ? (stepIndex / (total - 1)) * 100 : 0;

  const handleNext = useCallback(() => {
    if (stepIndex < total - 1) {
      setStepIndex((i) => i + 1);
    } else {
      completeModule('module-de-base');
      onNavigate('home');
    }
  }, [stepIndex, total, completeModule, onNavigate]);

  const handleSkip = () => {
    markOnboardingSkipped();
    onNavigate('home');
  };

  const currentStepId = steps[stepIndex]?.id ?? 'language';
  const isSlideStep = currentStepId.startsWith('slide-');
  const slideIndex = isSlideStep ? slides.findIndex((s) => `slide-${s.id}` === currentStepId) : -1;

  const renderStep = () => {
    if (currentStepId === 'language') return <LanguageStep onNext={handleNext} />;
    if (currentStepId === 'welcome') return <WelcomeStep onNext={handleNext} />;
    if (currentStepId === 'age-check') return <AgeCheckStep onNext={handleNext} onSetAge={onSetAge} onSelectTheme={onSelectTheme} />;
    if (currentStepId === 'theme-select') return (
      <ThemeSelectStep onNext={handleNext} onSelectTheme={onSelectTheme} isAdult={isAdult}
        isPremium={isPremium} onGoPremium={() => onNavigate('premium')} />
    );
    if (currentStepId === 'auth') return <AuthStep onNext={handleNext} onAuth={onAuth} />;
    if (currentStepId === 'personal-intro') return <PersonalIntroStep onNext={handleNext} />;
    if (isSlideStep && slideIndex >= 0) return (
      <SlideStep slide={slides[slideIndex]} isLast={stepIndex === total - 1} onNext={handleNext} />
    );
    return null;
  };

  return (
    <div className="h-dvh min-h-0 flex flex-col overflow-hidden" style={{ background: colors.bgGradient ?? colors.bgPrimary }}>
      {/* Top bar — progress + skip */}
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

      {/* Step content */}
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
