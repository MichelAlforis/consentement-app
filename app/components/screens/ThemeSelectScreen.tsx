'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { ThemeMode, themes } from '../../types/theme';

interface ThemeSelectScreenProps {
  onSelectTheme: (theme: ThemeMode) => void;
  isPremium?: boolean;
  onGoPremium?: () => void;
}

const freeThemes: ThemeMode[] = ['warm', 'calm'];
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

export function ThemeSelectScreen({ onSelectTheme, isPremium = false, onGoPremium }: ThemeSelectScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col p-6 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mx-auto mt-10 mb-6"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-2xl">
          <span className="text-4xl">💜</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Choisis ton ambiance</h1>
        <p className="text-gray-500 text-sm">Tu pourras changer à tout moment</p>
      </motion.div>

      {/* Thèmes gratuits */}
      <div className="max-w-sm mx-auto w-full space-y-3 mb-4">
        {freeThemes.map((mode, i) => {
          const t = themes[mode];
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
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: t.colors.accentGradient }}>
                  <span className="text-2xl">{t.emoji}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: t.colors.textPrimary }}>{t.name}</h3>
                  <p className="text-sm" style={{ color: t.colors.textSecondary }}>{t.description}</p>
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

      {/* Séparateur Premium */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="max-w-sm mx-auto w-full flex items-center gap-3 mb-4"
      >
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Lock size={11} /> Premium
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </motion.div>

      {/* Thèmes premium */}
      <div className="max-w-sm mx-auto w-full space-y-3">
        {premiumThemes.map((mode, i) => {
          const t = themes[mode];
          const locked = !isPremium;
          return (
            <motion.button
              key={mode}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: locked ? 1 : 1.02, y: locked ? 0 : -3 }}
              whileTap={{ scale: locked ? 1 : 0.98 }}
              onClick={() => locked ? onGoPremium?.() : onSelectTheme(mode)}
              className="relative overflow-hidden rounded-3xl p-5 text-left w-full"
              style={{
                background: themeGradients[mode],
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                opacity: locked ? 0.7 : 1,
              }}
            >
              {locked && (
                <div className="absolute inset-0 rounded-3xl bg-black/20 flex items-center justify-center z-10">
                  <div className="bg-white/90 rounded-2xl px-4 py-2 flex items-center gap-2 shadow">
                    <Lock size={14} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Premium</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: t.colors.accentGradient }}>
                  <span className="text-2xl">{t.emoji}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: t.colors.textPrimary }}>{t.name}</h3>
                  <p className="text-sm" style={{ color: t.colors.textSecondary }}>{t.description}</p>
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

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-xs text-gray-400 mt-6 mb-2"
      >
        Les thèmes premium font partie de l'abonnement
      </motion.p>
    </motion.div>
  );
}
