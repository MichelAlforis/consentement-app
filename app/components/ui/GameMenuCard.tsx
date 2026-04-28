'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface GameMenuCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  tag: string;
  onClick: () => void;
  delay?: number;
  variant?: 'default' | 'premium';
  locked?: boolean;
  lockedLabel?: string;
}

export function GameMenuCard({
  icon,
  title,
  description,
  tag,
  onClick,
  delay = 0,
  variant = 'default',
  locked = false,
  lockedLabel,
}: GameMenuCardProps) {
  const { colors } = useTheme();
  const isPremium = variant === 'premium';

  return (
    <motion.button
      initial={{ opacity: 0, y: isPremium ? 14 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={isPremium && !locked ? { scale: 1.02, y: -3 } : undefined}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full overflow-hidden text-left flex items-center gap-3 ${
        isPremium ? 'rounded-3xl p-5' : 'rounded-2xl p-4'
      }`}
      style={{
        background: isPremium ? colors.premiumGradient : colors.bgCard,
        border: isPremium ? undefined : `1.5px solid ${colors.border}`,
        boxShadow: isPremium && !locked ? `0 8px 28px ${colors.premiumShadow}` : undefined,
      }}
    >
      <div
        className={`${isPremium ? 'w-12 h-12 rounded-2xl' : 'w-11 h-11 rounded-xl'} flex items-center justify-center shrink-0`}
        style={{
          background: isPremium ? 'rgba(255,255,255,0.2)' : colors.bgSecondary,
          color: isPremium ? '#ffffff' : colors.textSecondary,
        }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span
            className={isPremium ? 'font-bold text-base' : 'font-semibold text-sm'}
            style={{ color: isPremium ? '#ffffff' : colors.textPrimary }}
          >
            {title}
          </span>
          <span
            className={`${isPremium ? 'text-xs px-2 rounded-full' : 'text-xs px-1.5 rounded-md uppercase'} py-0.5 font-bold`}
            style={{
              background: isPremium ? 'rgba(255,255,255,0.2)' : `${colors.success}22`,
              color: isPremium ? '#ffffff' : colors.success,
            }}
          >
            {tag}
          </span>
        </div>
        <p
          className={`${isPremium ? 'text-sm' : 'text-xs'} leading-snug`}
          style={{ color: isPremium ? 'rgba(255,255,255,0.82)' : colors.textMuted }}
        >
          {description}
        </p>
      </div>

      {!isPremium && <ChevronRight size={16} className="shrink-0" style={{ color: colors.textMuted }} />}

      {locked && (
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3"
          style={{ background: colors.lockedOverlay }}
        >
          <div
            className="px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg text-white"
            style={{ background: colors.premiumGradient }}
          >
            <Sparkles size={14} />
            {lockedLabel ?? tag}
          </div>
        </div>
      )}
    </motion.button>
  );
}
