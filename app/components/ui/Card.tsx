'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShimmerLayer } from './ThemeEffects';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'accent' | 'secondary' | 'success' | 'warning';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  delay?: number;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, onClick, variant = 'default', padding = 'md', className = '', delay = 0 }: CardProps) {
  const { colors, effects } = useTheme();

  const premiumInnerBorder = effects.cardInnerBorder
    ? `inset 0 1px 0 ${effects.cardInnerBorder}, inset 0 -1px 0 ${effects.cardInnerBorder}55`
    : '';
  const premiumGlow = effects.cardGlow ? `0 0 28px ${effects.cardGlow}` : '';

  const combineShadows = (...s: string[]) => s.filter(Boolean).join(', ');

  const getStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          boxShadow: combineShadows('0 8px 32px rgba(0,0,0,0.08)', premiumGlow, premiumInnerBorder),
        };
      case 'accent':
        return { background: colors.accentGradient };
      case 'secondary':
        return { background: colors.secondaryGradient };
      case 'success':
        return { background: `${colors.success}18`, border: `1px solid ${colors.success}30` };
      case 'warning':
        return { background: `${colors.warning}18`, border: `1px solid ${colors.warning}30` };
      default:
        return {
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          boxShadow: combineShadows(premiumGlow, premiumInnerBorder) || undefined,
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={onClick ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={getStyle()}
      className={`
        relative overflow-hidden
        ${paddingStyles[padding]}
        rounded-3xl
        ${onClick ? 'cursor-pointer active:brightness-95' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {effects.shimmer && (variant === 'elevated' || variant === 'default') && (
        <ShimmerLayer color={effects.shimmerColor} />
      )}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  );
}
