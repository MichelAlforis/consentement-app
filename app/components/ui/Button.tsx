'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

const sizes = {
  sm: 'px-4 py-2.5 text-sm rounded-xl',
  md: 'px-5 py-3.5 text-base rounded-2xl',
  lg: 'px-6 py-4 text-lg rounded-2xl',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
}: ButtonProps) {
  const { colors } = useTheme();

  const getStyle = () => {
    switch (variant) {
      case 'primary':
        return { background: colors.accentGradient, boxShadow: `0 8px 24px ${colors.accentShadow}`, color: '#ffffff' };
      case 'secondary':
        return { background: colors.secondaryGradient, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', color: '#ffffff' };
      case 'outline':
        return { background: colors.bgCard, border: `2px solid ${colors.border}`, color: colors.textPrimary };
      case 'ghost':
        return { background: 'transparent', color: colors.textSecondary };
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      style={getStyle()}
      className={`
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        font-medium flex items-center justify-center gap-2
        transition-all duration-200 active:brightness-95
        ${className}
      `}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </motion.button>
  );
}
