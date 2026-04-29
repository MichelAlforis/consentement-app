'use client';

import { motion } from 'framer-motion';
import { Crown, Lock } from 'lucide-react';
import { AppLogo } from '../ui';
import { ThemeMode, themes } from '../../types/theme';
import { PreviewShimmer } from '../ui/ThemeEffects';
import { useTranslation } from '../../i18n';

interface ThemeSelectScreenProps {
  onSelectTheme: (theme: ThemeMode) => void;
  isPremium?: boolean;
  onGoPremium?: () => void;
  isAdult?: boolean | null;
}

const adultFreeThemes: ThemeMode[] = ['warm', 'calm'];
const minorThemes: ThemeMode[] = ['youth', 'warm', 'calm'];
const premiumThemes: ThemeMode[] = ['dark-luxury', 'nude'];

const themePreviewColors: Record<ThemeMode, string[]> = {
  'warm':        ['#e07a5f', '#f4a261', '#8fb996', '#e9c46a'],
  'calm':        ['#5c6ac4', '#9d8cd9', '#6eb089', '#e2c36b'],
  'dark-luxury': ['#c9a84c', '#8b1a3a', '#f0ece4', '#1a1518'],
  'nude':        ['#b07d6a', '#8c7860', '#2e2420', '#f2ede8'],
  'youth':       ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'],
};

const themeGradients: Record<ThemeMode, string> = {
  'warm':        'linear-gradient(135deg, #fef7f0 0%, #ffecd2 100%)',
  'calm':        'linear-gradient(135deg, #f5f6f8 0%, #e8eaef 100%)',
  'dark-luxury': 'linear-gradient(135deg, #0f0d0e 0%, #1e1520 100%)',
  'nude':        'linear-gradient(135deg, #faf7f4 0%, #f0e8e0 100%)',
  'youth':       'linear-gradient(135deg, #f0f7ff 0%, #e8f0ff 100%)',
};

export function ThemeSelectScreen({ onSelectTheme, isPremium = false, onGoPremium, isAdult }: ThemeSelectScreenProps) {
  const { t } = useTranslation();
  const isMinor = isAdult === false;
  const freeThemes = isMinor ? minorThemes : adultFreeThemes;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col p-6 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mx-auto mt-10 mb-6"
      >
        <AppLogo className="w-20 h-20" variant="theme" animated={true} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('themeSelect.title')}</h1>
        <p className="text-gray-500 text-sm">{t('themeSelect.subtitle')}</p>
      </motion.div>

      <div className="max-w-sm mx-auto w-full space-y-3 mb-4">
        {(freeThemes as ThemeMode[]).map((mode, i) => {
          const theme = themes[mode];
          return (
            <motion.button
              key={mode}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTheme(mode)}
              className="relative overflow-hidden rounded-3xl p-5 text-left w-full"
              style={{ background: themeGradients[mode], boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden grid grid-cols-2 gap-px p-px"
                  style={{ background: theme.colors.accentGradient }}>
                  {themePreviewColors[mode].map((color) => (
                    <div key={color} className="rounded-[3px]" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: theme.colors.textPrimary }}>{theme.name}</h3>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>{theme.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {themePreviewColors[mode].map((color) => (
                  <div key={color} className="w-7 h-7 rounded-lg shadow-sm" style={{ backgroundColor: color }} />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {!isMinor && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="max-w-sm mx-auto w-full flex items-center gap-3 mb-4"
          >
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Lock size={11} /> {t('premium.title').split(' ').pop()}
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </motion.div>

          <div className="max-w-sm mx-auto w-full space-y-3">
            {premiumThemes.map((mode, i) => {
          const theme = themes[mode];
          const locked = !isPremium;
          const isDarkLuxury = mode === 'dark-luxury';
          const isNude = mode === 'nude';

          return (
            <motion.button
              key={mode}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={isNude && locked
                ? { opacity: 1, x: 0, scale: [1, 1.008, 1] }
                : { opacity: 1, x: 0 }
              }
              transition={isNude && locked
                ? { delay: 0.6 + i * 0.1, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' } }
                : { delay: 0.6 + i * 0.1 }
              }
              whileHover={{ scale: locked ? 1.01 : 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => locked ? onGoPremium?.() : onSelectTheme(mode)}
              className="relative overflow-hidden rounded-3xl p-5 text-left w-full"
              style={{
                background: themeGradients[mode],
                boxShadow: isDarkLuxury
                  ? '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(201,168,76,0.3)'
                  : isNude
                    ? '0 8px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(176,125,106,0.2)'
                    : '0 8px 30px rgba(0,0,0,0.12)',
              }}
            >
              {isDarkLuxury && locked && <PreviewShimmer color="#c9a84c" />}

              {locked && (
                <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-2"
                  style={{ background: isDarkLuxury ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.18)', zIndex: 10 }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl"
                    style={{
                      background: isDarkLuxury ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.85)',
                      border: isDarkLuxury ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(176,125,106,0.3)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Crown size={14} style={{ color: isDarkLuxury ? '#c9a84c' : '#8c7860' }} />
                    <span className="text-sm font-semibold" style={{ color: isDarkLuxury ? '#c9a84c' : '#5c4a40' }}>
                      Premium
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: isDarkLuxury ? 'rgba(201,168,76,0.7)' : 'rgba(92,74,64,0.7)' }}>
                    {t('games.unlock')}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 mb-3" style={{ position: 'relative', zIndex: 5 }}>
                <div className="w-12 h-12 rounded-2xl overflow-hidden grid grid-cols-2 gap-px p-px"
                  style={{ background: theme.colors.accentGradient }}>
                  {themePreviewColors[mode].map((color) => (
                    <div key={color} className="rounded-[3px]" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: theme.colors.textPrimary }}>{theme.name}</h3>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>{theme.description}</p>
                </div>
              </div>
              <div className="flex gap-2" style={{ position: 'relative', zIndex: 5 }}>
                {themePreviewColors[mode].map((color) => (
                  <div key={color} className="w-7 h-7 rounded-lg shadow-sm" style={{ backgroundColor: color }} />
                ))}
              </div>
            </motion.button>
          );
          })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center text-xs text-gray-400 mt-6 mb-2"
          >
            {t('premium.themesNote')}
          </motion.p>
        </>
      )}
    </motion.div>
  );
}
