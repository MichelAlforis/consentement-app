'use client';

import { motion } from 'framer-motion';
import { useId } from 'react';
import { useTheme } from '../../context/ThemeContext';

export type LogoVariant = 'dark' | 'light' | 'theme';

interface AppLogoProps {
  height?: number;
  variant?: LogoVariant;
  className?: string;
  animated?: boolean;
}

const GRADIENTS: Record<
  LogoVariant,
  { stops: [string, string, string]; bg: string; shadow: string }
> = {
  dark: {
    stops: ['#f5f3ff', '#c4b5fd', '#8b5cf6'],
    bg: 'rgba(255,255,255,0.08)',
    shadow: 'rgba(167,139,250,0.34)',
  },
  light: {
    stops: ['#f472b6', '#8b5cf6', '#14b8a6'],
    bg: 'rgba(255,255,255,0.78)',
    shadow: 'rgba(139,92,246,0.22)',
  },
  theme: {
    stops: ['#f472b6', '#8b5cf6', '#14b8a6'],
    bg: 'rgba(255,255,255,0.72)',
    shadow: 'rgba(139,92,246,0.20)',
  },
};

export function AppLogo({
  height,
  variant = 'light',
  className,
  animated = false,
}: AppLogoProps) {
  const { colors } = useTheme();
  const uid = useId().replace(/:/g, '');

  const palette = GRADIENTS[variant];
  const stops =
    variant === 'theme'
      ? ([
          colors.accent ?? palette.stops[0],
          colors.premium ?? palette.stops[1],
          colors.success ?? palette.stops[2],
        ] as [string, string, string])
      : palette.stops;

  const pulse = animated
    ? {
        scale: [1, 1.04, 1],
        rotate: [0, -1.5, 0, 1.5, 0],
      }
    : {};

  return (
    <motion.svg
      role="img"
      aria-label="Consentement"
      viewBox="0 0 96 96"
      width={height ?? '100%'}
      height={height ?? '100%'}
      className={`block shrink-0${className ? ` ${className}` : ''}`}
      style={{ filter: `drop-shadow(0 16px 28px ${palette.shadow})` }}
      animate={pulse}
      transition={animated ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
    >
      <defs>
        <linearGradient
          id={`logo-gradient-${uid}`}
          x1="18"
          y1="12"
          x2="78"
          y2="84"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={stops[0]} />
          <stop offset="52%" stopColor={stops[1]} />
          <stop offset="100%" stopColor={stops[2]} />
        </linearGradient>
        <linearGradient
          id={`logo-highlight-${uid}`}
          x1="28"
          y1="18"
          x2="66"
          y2="74"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="white" stopOpacity="0.82" />
          <stop offset="100%" stopColor="white" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      <rect x="10" y="10" width="76" height="76" rx="24" fill={palette.bg} />
      <path
        d="M48 78C37.5 68.6 25 58.7 25 44.3C25 34.9 31.2 28 39.4 28C43.7 28 46.6 30 48 32.5C49.4 30 52.3 28 56.6 28C64.8 28 71 34.9 71 44.3C71 58.7 58.5 68.6 48 78Z"
        fill={`url(#logo-gradient-${uid})`}
      />
      <path
        d="M48 68C40.9 61.5 33 54.3 33 44.9C33 39.8 36.1 36 40.5 36C44.7 36 47.1 39.1 48 42.2C48.9 39.1 51.3 36 55.5 36C59.9 36 63 39.8 63 44.9C63 54.3 55.1 61.5 48 68Z"
        fill={`url(#logo-highlight-${uid})`}
        opacity="0.82"
      />
      <path
        d="M34 47.5L43.2 56.7L63 37"
        fill="none"
        stroke="white"
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      />
      <path
        d="M24 25C30.6 18.5 40.2 16 48 16C55.8 16 65.4 18.5 72 25"
        fill="none"
        stroke={`url(#logo-gradient-${uid})`}
        strokeWidth="4.8"
        strokeLinecap="round"
        opacity="0.42"
      />
    </motion.svg>
  );
}
