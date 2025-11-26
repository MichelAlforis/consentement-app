'use client';

import { motion } from 'framer-motion';
import { ThemeMode, themes } from '../../types/theme';

interface ThemeSelectScreenProps {
  onSelectTheme: (theme: ThemeMode) => void;
}

export function ThemeSelectScreen({ onSelectTheme }: ThemeSelectScreenProps) {
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
        className="mx-auto mt-12 mb-8"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-2xl">
          <span className="text-4xl">💜</span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Bienvenue
        </h1>
        <p className="text-gray-500">
          Choisis l'ambiance qui te correspond
        </p>
      </motion.div>

      {/* Theme Cards */}
      <div className="flex-1 flex flex-col gap-4 max-w-sm mx-auto w-full">
        {/* Warm Theme */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTheme('warm')}
          className="relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #fef7f0 0%, #ffecd2 100%)',
            boxShadow: '0 10px 40px rgba(224, 122, 95, 0.2)',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-orange-200/50 to-amber-200/50" />
          <div className="absolute -right-4 -bottom-12 w-24 h-24 rounded-full bg-gradient-to-br from-rose-200/40 to-orange-200/40" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #e07a5f 0%, #f4a261 100%)' }}
              >
                <span className="text-2xl">🌅</span>
              </motion.div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {themes.warm.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {themes.warm.description}
                </p>
              </div>
            </div>

            {/* Color preview */}
            <div className="flex gap-2">
              {['#e07a5f', '#f4a261', '#8fb996', '#e9c46a'].map((color, i) => (
                <motion.div
                  key={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="w-8 h-8 rounded-xl shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </motion.button>

        {/* Calm Theme */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTheme('calm')}
          className="relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #f5f6f8 0%, #e8eaef 100%)',
            boxShadow: '0 10px 40px rgba(92, 106, 196, 0.15)',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40" />
          <div className="absolute -right-4 -bottom-12 w-24 h-24 rounded-full bg-gradient-to-br from-slate-200/50 to-indigo-200/40" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5c6ac4 0%, #7c8ce0 100%)' }}
              >
                <span className="text-2xl">🌙</span>
              </motion.div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {themes.calm.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {themes.calm.description}
                </p>
              </div>
            </div>

            {/* Color preview */}
            <div className="flex gap-2">
              {['#5c6ac4', '#9d8cd9', '#6eb089', '#e2c36b'].map((color, i) => (
                <motion.div
                  key={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="w-8 h-8 rounded-xl shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-gray-400 mt-8 mb-4"
      >
        Tu pourras changer à tout moment
      </motion.p>
    </motion.div>
  );
}
