'use client';

import { motion } from 'framer-motion';
import { Palette, LifeBuoy, Crown, ChevronRight, CheckCircle2, Globe, Flame } from 'lucide-react';
import { Screen } from '../../types';
import { Language } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useLanguage } from '../../context/LanguageContext';
import { ExplicitModeToggle } from '../ui/ExplicitModeToggle';

interface SettingsScreenProps {
  isPremium: boolean;
  isAdult: boolean;
  onNavigate: (screen: Screen) => void;
}

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
  accent: string;
  onClick?: () => void;
  right?: React.ReactNode;
}

function SettingsRow({ icon, title, desc, delay, accent, onClick, right }: SettingsRowProps) {
  const { colors } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{title}</p>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
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

export function SettingsScreen({ isPremium, isAdult, onNavigate }: SettingsScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 space-y-3">
      <SettingsRow
        icon={<Globe size={20} style={{ color: colors.accent }} />}
        title={t('settings.language.title')}
        desc={t('settings.language.desc')}
        delay={0.1}
        accent="#6366f1"
        right={<LanguagePicker />}
      />

      <SettingsRow
        icon={<Palette size={20} className="text-violet-500" />}
        title={t('settings.theme.title')}
        desc={t('settings.theme.desc')}
        delay={0.15}
        accent="#8b5cf6"
        onClick={() => onNavigate('theme-select')}
      />

      <SettingsRow
        icon={<LifeBuoy size={20} className="text-teal-500" />}
        title={t('settings.help.title')}
        desc={t('settings.help.desc')}
        delay={0.2}
        accent="#14b8a6"
        onClick={() => onNavigate('help')}
      />

      <SettingsRow
        icon={<Crown size={20} className={isPremium ? 'text-amber-500' : 'text-gray-400'} />}
        title={isPremium ? t('settings.premiumActive.title') : t('settings.premium.title')}
        desc={isPremium ? t('settings.premiumActive.desc') : t('settings.premium.desc')}
        delay={0.25}
        accent={isPremium ? '#f59e0b' : '#6b7280'}
        onClick={isPremium ? undefined : () => onNavigate('premium')}
        right={
          isPremium
            ? <CheckCircle2 size={18} className="text-amber-500" />
            : <ChevronRight size={16} style={{ color: colors.textMuted }} />
        }
      />

      {isAdult && (
        <SettingsRow
          icon={<Flame size={20} style={{ color: '#ef4444' }} />}
          title={t('settings.explicit.title')}
          desc={t('settings.explicit.desc')}
          delay={0.3}
          accent="#ef4444"
          right={<ExplicitModeToggle pillOnly />}
        />
      )}
    </motion.div>
  );
}
