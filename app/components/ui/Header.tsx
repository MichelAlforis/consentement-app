'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { Theme } from '../../types/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  theme: Theme;
}

export function Header({ title, subtitle, showBack = false, onBack, theme }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-5 py-4 backdrop-blur-xl border-b safe-area-top"
      style={{
        background: `linear-gradient(to right, ${theme.colors.bgCard}, ${theme.colors.bgSecondary})`,
        borderColor: theme.colors.divider,
      }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 backdrop-blur border rounded-full flex items-center justify-center active:opacity-80"
            style={{
              backgroundColor: theme.colors.bgCard,
              borderColor: theme.colors.border,
              boxShadow: `0 4px 12px ${theme.colors.accentShadow}`,
            }}
          >
            <ArrowLeft size={20} style={{ color: theme.colors.textPrimary }} />
          </motion.button>
        )}

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: theme.colors.accentGradient,
            boxShadow: `0 4px 12px ${theme.colors.accentShadow}`,
          }}
        >
          <Heart size={22} className="text-white" fill="white" />
        </motion.div>

        <div className="flex-1">
          <h1
            className="text-lg font-semibold tracking-tight"
            style={{ color: theme.colors.textPrimary }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.colors.textSecondary }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
