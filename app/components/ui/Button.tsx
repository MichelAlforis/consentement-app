'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

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

const variants = {
  primary: 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-300/40',
  secondary: 'bg-gradient-to-r from-violet-400 to-purple-500 text-white shadow-lg shadow-purple-300/40',
  outline: 'bg-white/80 backdrop-blur border-2 border-gray-200 text-gray-800',
  ghost: 'bg-transparent text-gray-600',
};

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
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
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
