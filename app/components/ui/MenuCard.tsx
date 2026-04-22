'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ShimmerLayer } from './ThemeEffects';

interface MenuCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'accent' | 'secondary' | 'green' | 'amber';
  delay?: number;
}

export function MenuCard({ icon, title, description, onClick, variant = 'default', delay = 0 }: MenuCardProps) {
  const { colors, effects } = useTheme();

  const premiumInnerBorder = effects.cardInnerBorder
    ? `inset 0 1px 0 ${effects.cardInnerBorder}`
    : '';

  const getCardStyle = () => {
    switch (variant) {
      case 'accent':
        return {
          background: colors.accentGradient,
          boxShadow: `0 8px 24px ${colors.accentShadow}${premiumInnerBorder ? `, ${premiumInnerBorder}` : ''}`,
        };
      case 'secondary':
        return {
          background: colors.secondaryGradient,
          boxShadow: `0 8px 24px rgba(0,0,0,0.15)${premiumInnerBorder ? `, ${premiumInnerBorder}` : ''}`,
        };
      case 'green':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
        };
      case 'amber':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
          boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
        };
      default:
        return {
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          boxShadow: premiumInnerBorder || undefined,
        };
    }
  };

  const isColored = variant !== 'default';
  const showShimmer = effects.shimmer && isColored;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={getCardStyle()}
      className="relative overflow-hidden w-full rounded-3xl p-5 text-left flex items-center gap-4 transition-all duration-300 active:brightness-95"
    >
      {showShimmer && <ShimmerLayer color={effects.shimmerColor} />}

      <div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0"
        style={{ background: isColored ? 'rgba(255,255,255,0.2)' : colors.accentGradient, zIndex: 2 }}
      >
        {icon}
      </div>

      <div className="relative flex-1 min-w-0" style={{ zIndex: 2 }}>
        <h3 className="font-semibold text-base" style={{ color: isColored ? '#ffffff' : colors.textPrimary }}>
          {title}
        </h3>
        <p className="text-sm mt-0.5" style={{ color: isColored ? 'rgba(255,255,255,0.82)' : colors.textSecondary }}>
          {description}
        </p>
      </div>

      {!isColored && (
        <ChevronRight size={24} style={{ color: colors.textMuted, zIndex: 2, position: 'relative' }} />
      )}
    </motion.button>
  );
}
