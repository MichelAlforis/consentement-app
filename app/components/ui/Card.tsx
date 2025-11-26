'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'gradient-pink' | 'gradient-purple' | 'gradient-green' | 'gradient-amber';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  delay?: number;
}

const variantStyles = {
  default: 'bg-white/80 backdrop-blur border border-gray-100',
  elevated: 'bg-white shadow-xl shadow-gray-200/50 border border-gray-100',
  'gradient-pink': 'bg-gradient-to-br from-pink-400 to-rose-500 border-none text-white',
  'gradient-purple': 'bg-gradient-to-br from-violet-400 to-purple-600 border-none text-white',
  'gradient-green': 'bg-gradient-to-br from-emerald-50 to-green-100 border border-green-200/50',
  'gradient-amber': 'bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/50',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  children,
  onClick,
  variant = 'default',
  padding = 'md',
  className = '',
  delay = 0,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={onClick ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        rounded-3xl
        ${onClick ? 'cursor-pointer active:brightness-95' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
