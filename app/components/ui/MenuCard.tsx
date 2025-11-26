'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface MenuCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'pink' | 'purple' | 'green';
  delay?: number;
}

const variantStyles = {
  default: {
    bg: 'bg-white/80 backdrop-blur border border-gray-100',
    iconBg: 'bg-gradient-to-br from-rose-50 to-pink-100',
    title: 'text-gray-800',
    desc: 'text-gray-500',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-300/40',
    iconBg: 'bg-white/20 backdrop-blur',
    title: 'text-white',
    desc: 'text-white/80',
  },
  purple: {
    bg: 'bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg shadow-purple-300/40',
    iconBg: 'bg-white/20 backdrop-blur',
    title: 'text-white',
    desc: 'text-white/80',
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-300/40',
    iconBg: 'bg-white/20 backdrop-blur',
    title: 'text-white',
    desc: 'text-white/80',
  },
};

export function MenuCard({
  icon,
  title,
  description,
  onClick,
  variant = 'default',
  delay = 0,
}: MenuCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: delay * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        ${styles.bg}
        w-full rounded-3xl p-5 text-left
        flex items-center gap-4
        transition-all duration-300
        active:brightness-95
      `}
    >
      <motion.div
        className={`
          ${styles.iconBg}
          w-14 h-14 rounded-2xl flex items-center justify-center
          shadow-inner
        `}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>

      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-base ${styles.title}`}>
          {title}
        </h3>
        <p className={`text-sm mt-0.5 ${styles.desc}`}>
          {description}
        </p>
      </div>

      {variant === 'default' && (
        <motion.div
          className="text-gray-300"
          whileHover={{ x: 4 }}
        >
          <ChevronRight size={24} />
        </motion.div>
      )}
    </motion.button>
  );
}
