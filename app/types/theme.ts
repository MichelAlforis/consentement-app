// Deux thèmes tendance, non genrés

export type ThemeMode = 'warm' | 'calm' | 'dark-luxury' | 'nude' | 'youth';

export interface ThemeColors {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgGradient: string;
  bgCard: string;
  bgCardHover: string;

  // Accent colors
  accent: string;
  accentLight: string;
  accentGradient: string;
  accentShadow: string;

  // Secondary accent
  secondary: string;
  secondaryLight: string;
  secondaryGradient: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // UI elements
  border: string;
  divider: string;

  // Status colors (shared)
  success: string;
  warning: string;
  error: string;

  // Comfort level colors (shared)
  comfortNo: string;
  comfortWait: string;
  comfortCurious: string;
  comfortOk: string;
  comfortLove: string;
}

export interface ThemeEffects {
  shimmer: boolean;
  shimmerColor: string;
  grain: boolean;
  pageTransition: 'slide' | 'fade' | 'drift';
  cardGlow: string | null;
  cardInnerBorder: string | null;
}

export interface Theme {
  id: ThemeMode;
  name: string;
  emoji: string;
  description: string;
  colors: ThemeColors;
  effects: ThemeEffects;
}

// Thème WARM - Tons chauds, terracotta, pêche, corail (tendance 2024-2025)
const freeEffects: ThemeEffects = {
  shimmer: false,
  shimmerColor: 'transparent',
  grain: false,
  pageTransition: 'slide',
  cardGlow: null,
  cardInnerBorder: null,
};

export const warmTheme: Theme = {
  id: 'warm',
  name: 'Chaleureux',
  emoji: '🌅',
  description: 'Tons chauds et doux',
  effects: freeEffects,
  colors: {
    // Backgrounds
    bgPrimary: '#fef7f0',
    bgSecondary: '#fff5eb',
    bgGradient: 'linear-gradient(135deg, #fef7f0 0%, #ffecd2 100%)',
    bgCard: 'rgba(255, 255, 255, 0.85)',
    bgCardHover: 'rgba(255, 255, 255, 0.95)',

    // Accent - Terracotta/Coral
    accent: '#e07a5f',
    accentLight: '#f2c0b0',
    accentGradient: 'linear-gradient(135deg, #e07a5f 0%, #f4a261 100%)',
    accentShadow: 'rgba(224, 122, 95, 0.35)',

    // Secondary - Warm sage
    secondary: '#8fb996',
    secondaryLight: '#c7dfc9',
    secondaryGradient: 'linear-gradient(135deg, #8fb996 0%, #a5c9ac 100%)',

    // Text
    textPrimary: '#3d3d3d',
    textSecondary: '#6b6b6b',
    textMuted: '#a0a0a0',

    // UI
    border: 'rgba(224, 122, 95, 0.15)',
    divider: 'rgba(0, 0, 0, 0.06)',

    // Status
    success: '#8fb996',
    warning: '#f4a261',
    error: '#e07a5f',

    // Comfort levels
    comfortNo: '#e07a5f',
    comfortWait: '#f4a261',
    comfortCurious: '#e9c46a',
    comfortOk: '#8fb996',
    comfortLove: '#7c6aa8',
  }
};

// Thème CALM - Tons froids, bleu nuit, gris ardoise, lavande (tendance premium)
export const calmTheme: Theme = {
  id: 'calm',
  name: 'Apaisant',
  emoji: '🌙',
  description: 'Tons sombres et sereins',
  effects: freeEffects,
  colors: {
    // Backgrounds
    bgPrimary: '#f5f6f8',
    bgSecondary: '#eef0f4',
    bgGradient: 'linear-gradient(135deg, #f5f6f8 0%, #e8eaef 100%)',
    bgCard: 'rgba(255, 255, 255, 0.9)',
    bgCardHover: 'rgba(255, 255, 255, 1)',

    // Accent - Slate blue / Indigo
    accent: '#5c6ac4',
    accentLight: '#b4b9e0',
    accentGradient: 'linear-gradient(135deg, #5c6ac4 0%, #7c8ce0 100%)',
    accentShadow: 'rgba(92, 106, 196, 0.3)',

    // Secondary - Lavender
    secondary: '#9d8cd9',
    secondaryLight: '#d4cdeb',
    secondaryGradient: 'linear-gradient(135deg, #9d8cd9 0%, #b5a8e3 100%)',

    // Text
    textPrimary: '#2d3142',
    textSecondary: '#5a5f7a',
    textMuted: '#9ca0b0',

    // UI
    border: 'rgba(92, 106, 196, 0.12)',
    divider: 'rgba(0, 0, 0, 0.05)',

    // Status
    success: '#6eb089',
    warning: '#e5a84c',
    error: '#d65d5d',

    // Comfort levels
    comfortNo: '#d65d5d',
    comfortWait: '#e5a84c',
    comfortCurious: '#e2c36b',
    comfortOk: '#6eb089',
    comfortLove: '#9d8cd9',
  }
};

// Thème DARK LUXURY - Noir profond, or, bordeaux — adulte premium
export const darkLuxuryTheme: Theme = {
  id: 'dark-luxury',
  name: 'Sombre & Luxe',
  emoji: '✨',
  description: 'Intimiste et sophistiqué',
  effects: {
    shimmer: true,
    shimmerColor: '#c9a84c',
    grain: false,
    pageTransition: 'fade',
    cardGlow: 'rgba(201, 168, 76, 0.07)',
    cardInnerBorder: 'rgba(201, 168, 76, 0.22)',
  },
  colors: {
    bgPrimary: '#0f0d0e',
    bgSecondary: '#1a1518',
    bgGradient: 'linear-gradient(135deg, #0f0d0e 0%, #1e1520 100%)',
    bgCard: 'rgba(30, 24, 28, 0.95)',
    bgCardHover: 'rgba(40, 32, 36, 1)',

    accent: '#c9a84c',
    accentLight: '#e8d08a',
    accentGradient: 'linear-gradient(135deg, #c9a84c 0%, #e8c96a 100%)',
    accentShadow: 'rgba(201, 168, 76, 0.4)',

    secondary: '#8b1a3a',
    secondaryLight: '#c45c7a',
    secondaryGradient: 'linear-gradient(135deg, #8b1a3a 0%, #b52d52 100%)',

    textPrimary: '#f0ece4',
    textSecondary: '#c8bfb0',
    textMuted: '#8a8078',

    border: 'rgba(201, 168, 76, 0.2)',
    divider: 'rgba(255, 255, 255, 0.06)',

    success: '#5a9e6f',
    warning: '#c9a84c',
    error: '#8b1a3a',

    comfortNo: '#8b1a3a',
    comfortWait: '#c9744c',
    comfortCurious: '#c9a84c',
    comfortOk: '#5a9e6f',
    comfortLove: '#9d5cba',
  }
};

// Thème NUDE - Crème, taupe, nude — minimaliste haut de gamme
export const nudeTheme: Theme = {
  id: 'nude',
  name: 'Nude & Doux',
  emoji: '🤍',
  description: 'Élégant et épuré',
  effects: {
    shimmer: false,
    shimmerColor: 'transparent',
    grain: true,
    pageTransition: 'drift',
    cardGlow: null,
    cardInnerBorder: 'rgba(176, 125, 106, 0.18)',
  },
  colors: {
    bgPrimary: '#faf7f4',
    bgSecondary: '#f2ede8',
    bgGradient: 'linear-gradient(135deg, #faf7f4 0%, #f0e8e0 100%)',
    bgCard: 'rgba(255, 253, 250, 0.92)',
    bgCardHover: 'rgba(255, 255, 255, 1)',

    accent: '#b07d6a',
    accentLight: '#ddb9ac',
    accentGradient: 'linear-gradient(135deg, #b07d6a 0%, #c99888 100%)',
    accentShadow: 'rgba(176, 125, 106, 0.3)',

    secondary: '#8c7860',
    secondaryLight: '#c4b4a4',
    secondaryGradient: 'linear-gradient(135deg, #8c7860 0%, #a89280 100%)',

    textPrimary: '#2e2420',
    textSecondary: '#6b5a50',
    textMuted: '#a89890',

    border: 'rgba(176, 125, 106, 0.15)',
    divider: 'rgba(0, 0, 0, 0.05)',

    success: '#7a9e7e',
    warning: '#c9a84c',
    error: '#b07d6a',

    comfortNo: '#b07d6a',
    comfortWait: '#c9a880',
    comfortCurious: '#c9c280',
    comfortOk: '#7a9e7e',
    comfortLove: '#a080b0',
  }
};

// Thème YOUTH - Coloré, lumineux, rassurant — interface mineurs
export const youthTheme: Theme = {
  id: 'youth',
  name: 'Jeunesse',
  emoji: '🌈',
  description: 'Coloré et bienveillant',
  effects: freeEffects,
  colors: {
    bgPrimary: '#f0f7ff',
    bgSecondary: '#e8f4ff',
    bgGradient: 'linear-gradient(135deg, #f0f7ff 0%, #e8f0ff 100%)',
    bgCard: 'rgba(255, 255, 255, 0.92)',
    bgCardHover: 'rgba(255, 255, 255, 1)',

    accent: '#3b82f6',
    accentLight: '#93c5fd',
    accentGradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    accentShadow: 'rgba(59, 130, 246, 0.3)',

    secondary: '#8b5cf6',
    secondaryLight: '#c4b5fd',
    secondaryGradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',

    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',

    border: 'rgba(59, 130, 246, 0.15)',
    divider: 'rgba(0, 0, 0, 0.05)',

    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',

    comfortNo: '#ef4444',
    comfortWait: '#f97316',
    comfortCurious: '#eab308',
    comfortOk: '#22c55e',
    comfortLove: '#8b5cf6',
  }
};

export const themes: Record<ThemeMode, Theme> = {
  warm: warmTheme,
  calm: calmTheme,
  'dark-luxury': darkLuxuryTheme,
  'nude': nudeTheme,
  'youth': youthTheme,
};
