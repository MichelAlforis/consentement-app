'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, LifeBuoy, Crown, ChevronRight, CheckCircle2, Globe,
  Flame, Heart, RotateCcw, BookOpen,
} from 'lucide-react';
import { Screen } from '../../types';
import type { Language } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthStore } from '../../stores/authStore';
import { useModuleProgressStore } from '../../stores/moduleProgressStore';
import { resetAllData } from '../../stores';
import { ExplicitModeToggle } from '../ui/ExplicitModeToggle';

interface SettingsScreenProps {
  isPremium: boolean;
  isAdult: boolean;
  onNavigate: (screen: Screen) => void;
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionTitle({ label, delay }: { label: string; delay: number }) {
  const { colors } = useTheme();
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="text-xs font-bold uppercase tracking-widest px-1 pt-2 pb-1"
      style={{ color: colors.textMuted }}
    >
      {label}
    </motion.p>
  );
}

// ── Settings row ──────────────────────────────────────────────────────────────

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
  accent: string;
  onClick?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}

function SettingsRow({ icon, title, desc, delay, accent, onClick, right, danger }: SettingsRowProps) {
  const { colors } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: danger ? colors.danger : colors.textPrimary }}>
          {title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>{desc}</p>
      </div>
      {onClick ? (
        <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} className="shrink-0">
          {right ?? <ChevronRight size={16} style={{ color: colors.textMuted }} />}
        </motion.button>
      ) : (
        <div className="shrink-0">{right}</div>
      )}
    </motion.div>
  );
}

// ── Language picker ───────────────────────────────────────────────────────────

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
];

function LanguagePicker() {
  const { colors } = useTheme();
  const { language, changeLanguage } = useLanguage();
  return (
    <div className="flex gap-2">
      {LANGUAGES.map(({ code, label, flag }) => {
        const active = language === code;
        return (
          <motion.button
            key={code}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeLanguage(code)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: active ? colors.accent : colors.bgSecondary,
              color: active ? '#fff' : colors.textMuted,
              border: `1px solid ${active ? colors.accent : colors.divider}`,
            }}
          >
            <span>{flag}</span>
            <span>{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Pronoun pills ─────────────────────────────────────────────────────────────

const PRONOUNS = ['il', 'elle', 'iel', 'neutre'] as const;
type PronounKey = typeof PRONOUNS[number];

function PronounPills() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { pronouns, setPronouns } = useAuthStore();

  return (
    <div className="flex flex-wrap gap-2">
      {PRONOUNS.map((p) => {
        const active = pronouns === p;
        return (
          <motion.button
            key={p}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPronouns(active ? null : (p as PronounKey))}
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: active ? colors.accent : colors.bgSecondary,
              color: active ? '#fff' : colors.textMuted,
              border: `1px solid ${active ? colors.accent : colors.divider}`,
            }}
          >
            {t(`settings.profile.pronounOptions.${p}`)}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Reset modal ───────────────────────────────────────────────────────────────

function ResetModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-sm rounded-3xl p-6 space-y-4"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
          {t('settings.reset.title')}
        </h3>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          {t('settings.reset.confirm')}
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold"
            style={{ background: colors.bgSecondary, color: colors.textSecondary }}
          >
            {t('settings.reset.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold"
            style={{ background: colors.danger, color: '#fff' }}
          >
            {t('settings.reset.cta')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function SettingsScreen({ isPremium, isAdult, onNavigate }: SettingsScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { userName, setName } = useAuthStore();
  const markOnboardingSkipped = useModuleProgressStore((s) => s.markOnboardingSkipped);
  const [showReset, setShowReset] = useState(false);
  const [nameDraft, setNameDraft] = useState(userName);
  const [nameFocused, setNameFocused] = useState(false);

  const handleNameBlur = () => {
    setNameFocused(false);
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== userName) setName(trimmed);
    if (!trimmed) setNameDraft(userName);
  };

  const handleReset = () => {
    resetAllData();
    setShowReset(false);
  };

  const handleReplayIntro = () => {
    markOnboardingSkipped();
    onNavigate('module-de-base');
  };

  let baseDelay = 0;
  const d = () => { baseDelay += 0.05; return baseDelay; };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 space-y-1">

        {/* ── Mon profil ─────────────────────────── */}
        <SectionTitle label={t('settings.sections.profile')} delay={d()} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d() }}
          className="p-4 rounded-2xl space-y-4"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
        >
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textMuted }}>
              {t('settings.profile.name')}
            </label>
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={handleNameBlur}
              placeholder={t('settings.profile.namePlaceholder')}
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{
                background: colors.bgSecondary,
                borderColor: nameFocused ? colors.accent : colors.divider,
                color: colors.textPrimary,
                transition: 'border-color 0.2s ease',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textMuted }}>
              {t('settings.profile.pronouns')}{' '}
              <span style={{ color: colors.textMuted, fontWeight: 400 }}>
                {t('settings.profile.pronounsOptional')}
              </span>
            </label>
            <PronounPills />
          </div>
        </motion.div>

        {isAdult && (
          <SettingsRow
            icon={<Heart size={20} style={{ color: colors.accent }} />}
            title={t('settings.profile.personalSpace')}
            desc={t('settings.profile.personalSpaceDesc')}
            delay={d()}
            accent={colors.accent}
            onClick={() => onNavigate('personal-space')}
          />
        )}

        {/* ── Apparence ──────────────────────────── */}
        <SectionTitle label={t('settings.sections.appearance')} delay={d()} />

        <SettingsRow
          icon={<Globe size={20} style={{ color: colors.accent }} />}
          title={t('settings.language.title')}
          desc={t('settings.language.desc')}
          delay={d()}
          accent="#6366f1"
          right={<LanguagePicker />}
        />

        <SettingsRow
          icon={<Palette size={20} className="text-violet-500" />}
          title={t('settings.theme.title')}
          desc={t('settings.theme.desc')}
          delay={d()}
          accent="#8b5cf6"
          onClick={() => onNavigate('theme-select')}
        />

        {/* ── Contenu ────────────────────────────── */}
        <SectionTitle label={t('settings.sections.content')} delay={d()} />

        {isAdult && (
          <SettingsRow
            icon={<Flame size={20} style={{ color: '#ef4444' }} />}
            title={t('settings.explicit.title')}
            desc={t('settings.explicit.desc')}
            delay={d()}
            accent="#ef4444"
            right={<ExplicitModeToggle pillOnly />}
          />
        )}

        <SettingsRow
          icon={<BookOpen size={20} style={{ color: colors.accent }} />}
          title={t('settings.replayIntro.title')}
          desc={t('settings.replayIntro.desc')}
          delay={d()}
          accent={colors.accent}
          onClick={handleReplayIntro}
        />

        {/* ── App ────────────────────────────────── */}
        <SectionTitle label={t('settings.sections.app')} delay={d()} />

        <SettingsRow
          icon={<LifeBuoy size={20} className="text-teal-500" />}
          title={t('settings.help.title')}
          desc={t('settings.help.desc')}
          delay={d()}
          accent="#14b8a6"
          onClick={() => onNavigate('help')}
        />

        <SettingsRow
          icon={<Crown size={20} className={isPremium ? 'text-amber-500' : 'text-gray-400'} />}
          title={isPremium ? t('settings.premiumActive.title') : t('settings.premium.title')}
          desc={isPremium ? t('settings.premiumActive.desc') : t('settings.premium.desc')}
          delay={d()}
          accent={isPremium ? '#f59e0b' : '#6b7280'}
          onClick={isPremium ? undefined : () => onNavigate('premium')}
          right={
            isPremium
              ? <CheckCircle2 size={18} className="text-amber-500" />
              : <ChevronRight size={16} style={{ color: colors.textMuted }} />
          }
        />

        <SettingsRow
          icon={<RotateCcw size={20} style={{ color: colors.danger }} />}
          title={t('settings.reset.title')}
          desc={t('settings.reset.desc')}
          delay={d()}
          accent={colors.danger}
          onClick={() => setShowReset(true)}
          danger
        />
      </motion.div>

      <AnimatePresence>
        {showReset && (
          <ResetModal onClose={() => setShowReset(false)} onConfirm={handleReset} />
        )}
      </AnimatePresence>
    </>
  );
}
