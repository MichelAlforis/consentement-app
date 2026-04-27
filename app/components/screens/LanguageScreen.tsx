'use client';

import { motion } from 'framer-motion';
import { AppLogo } from '../ui/AppLogo';
import { Button } from '../ui';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../types';

interface LanguageScreenProps {
  onContinue: () => void;
}

const LANGUAGES: { code: Language; label: string; flag: string; nativeName: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'en', label: 'English',  flag: '🇬🇧', nativeName: 'English'  },
  { code: 'es', label: 'Español',  flag: '🇪🇸', nativeName: 'Español'  },
];

export function LanguageScreen({ onContinue }: LanguageScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { language, changeLanguage } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col items-center justify-between p-6 pb-10"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xs">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.05 }}
          className="mb-10"
        >
          <AppLogo height={80} variant="light" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {t('language.title')}
          </h1>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {t('language.subtitle')}
          </p>
        </motion.div>

        <div className="w-full space-y-3">
          {LANGUAGES.map((lang, i) => {
            const active = language === lang.code;
            return (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => changeLanguage(lang.code)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                style={{
                  background: active ? `${colors.accent}18` : colors.bgCard,
                  border: `2px solid ${active ? colors.accent : colors.divider}`,
                }}
              >
                <span className="text-3xl">{lang.flag}</span>
                <span
                  className="text-base font-semibold flex-1"
                  style={{ color: active ? colors.accent : colors.textPrimary }}
                >
                  {lang.nativeName}
                </span>
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: colors.accent }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="w-full max-w-xs"
      >
        <Button onClick={onContinue} fullWidth size="lg">
          {t('language.cta')}
        </Button>
      </motion.div>
    </motion.div>
  );
}
