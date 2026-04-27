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
  danger: string;

  // Semantic product states
  premium: string;
  premiumLight: string;
  premiumGradient: string;
  premiumShadow: string;
  locked: string;
  lockedOverlay: string;
  rare: string;
  rareBg: string;
  unique: string;
  uniqueBg: string;

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
  description: 'Tons chauds et doux',
  effects: freeEffects,
  colors: {
    // Backgrounds
    bgPrimary: '#fef7f0',
    bgSecondary: '#fff5eb',
    bgGradient:
      'radial-gradient(ellipse at 88% 8%, rgba(244,162,97,0.40) 0%, transparent 50%), linear-gradient(160deg, #fef7f0 0%, #feecd0 100%)',
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
    danger: '#c2410c',

    premium: '#7c6aa8',
    premiumLight: '#d7c8ef',
    premiumGradient: 'linear-gradient(135deg, #7c6aa8 0%, #b07dba 100%)',
    premiumShadow: 'rgba(124, 106, 168, 0.32)',
    locked: '#5f5148',
    lockedOverlay: 'linear-gradient(to bottom, rgba(61,61,61,0.42), rgba(61,61,61,0.72))',
    rare: '#7c6aa8',
    rareBg: 'rgba(124, 106, 168, 0.15)',
    unique: '#d97706',
    uniqueBg: 'rgba(217, 119, 6, 0.15)',

    // Comfort levels
    comfortNo: '#e07a5f',
    comfortWait: '#f4a261',
    comfortCurious: '#e9c46a',
    comfortOk: '#8fb996',
    comfortLove: '#7c6aa8',
  },
};

// Thème CALM - Tons froids, bleu nuit, gris ardoise, lavande (tendance premium)
export const calmTheme: Theme = {
  id: 'calm',
  name: 'Apaisant',
  description: 'Tons sombres et sereins',
  effects: freeEffects,
  colors: {
    // Backgrounds
    bgPrimary: '#f5f6f8',
    bgSecondary: '#eef0f4',
    bgGradient:
      'radial-gradient(ellipse at 12% 88%, rgba(157,140,217,0.28) 0%, transparent 50%), linear-gradient(160deg, #f5f6f8 0%, #e7eaf2 100%)',
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
    danger: '#b94141',

    premium: '#7c8ce0',
    premiumLight: '#d4cdeb',
    premiumGradient: 'linear-gradient(135deg, #5c6ac4 0%, #9d8cd9 100%)',
    premiumShadow: 'rgba(92, 106, 196, 0.32)',
    locked: '#4b5563',
    lockedOverlay: 'linear-gradient(to bottom, rgba(45,49,66,0.42), rgba(45,49,66,0.72))',
    rare: '#7c8ce0',
    rareBg: 'rgba(124, 140, 224, 0.15)',
    unique: '#d9902f',
    uniqueBg: 'rgba(217, 144, 47, 0.15)',

    // Comfort levels
    comfortNo: '#d65d5d',
    comfortWait: '#e5a84c',
    comfortCurious: '#e2c36b',
    comfortOk: '#6eb089',
    comfortLove: '#9d8cd9',
  },
};

// Thème DARK LUXURY - Noir profond, or, bordeaux — adulte premium
export const darkLuxuryTheme: Theme = {
  id: 'dark-luxury',
  name: 'Sombre & Luxe',
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
    bgGradient:
      'radial-gradient(ellipse at 82% 8%, rgba(139,26,58,0.32) 0%, transparent 48%), radial-gradient(ellipse at 18% 88%, rgba(201,168,76,0.16) 0%, transparent 48%), linear-gradient(160deg, #0f0d0e 0%, #1a1020 100%)',
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
    danger: '#c45c7a',

    premium: '#c9a84c',
    premiumLight: '#e8d08a',
    premiumGradient: 'linear-gradient(135deg, #8b1a3a 0%, #c9a84c 100%)',
    premiumShadow: 'rgba(201, 168, 76, 0.35)',
    locked: '#2a2528',
    lockedOverlay: 'linear-gradient(to bottom, rgba(15,13,14,0.48), rgba(15,13,14,0.78))',
    rare: '#c45c7a',
    rareBg: 'rgba(196, 92, 122, 0.16)',
    unique: '#c9a84c',
    uniqueBg: 'rgba(201, 168, 76, 0.16)',

    comfortNo: '#8b1a3a',
    comfortWait: '#c9744c',
    comfortCurious: '#c9a84c',
    comfortOk: '#5a9e6f',
    comfortLove: '#9d5cba',
  },
};

// Thème NUDE - Crème, taupe, nude — minimaliste haut de gamme
export const nudeTheme: Theme = {
  id: 'nude',
  name: 'Nude & Doux',
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
    bgGradient:
      'radial-gradient(ellipse at 82% 6%, rgba(176,125,106,0.26) 0%, transparent 50%), linear-gradient(160deg, #faf7f4 0%, #ece4d8 100%)',
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
    danger: '#9f5f51',

    premium: '#8c7860',
    premiumLight: '#dccfc0',
    premiumGradient: 'linear-gradient(135deg, #8c7860 0%, #b07d6a 100%)',
    premiumShadow: 'rgba(140, 120, 96, 0.3)',
    locked: '#6b5a50',
    lockedOverlay: 'linear-gradient(to bottom, rgba(46,36,32,0.40), rgba(46,36,32,0.70))',
    rare: '#8c7860',
    rareBg: 'rgba(140, 120, 96, 0.15)',
    unique: '#b88746',
    uniqueBg: 'rgba(184, 135, 70, 0.15)',

    comfortNo: '#b07d6a',
    comfortWait: '#c9a880',
    comfortCurious: '#c9c280',
    comfortOk: '#7a9e7e',
    comfortLove: '#a080b0',
  },
};

// Thème YOUTH - Coloré, lumineux, rassurant — interface mineurs
export const youthTheme: Theme = {
  id: 'youth',
  name: 'Jeunesse',
  description: 'Coloré et bienveillant',
  effects: freeEffects,
  colors: {
    bgPrimary: '#f0f7ff',
    bgSecondary: '#e8f4ff',
    bgGradient:
      'radial-gradient(ellipse at 50% 92%, rgba(139,92,246,0.20) 0%, transparent 50%), linear-gradient(160deg, #f0f7ff 0%, #e5eeff 100%)',
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
    danger: '#dc2626',

    premium: '#8b5cf6',
    premiumLight: '#c4b5fd',
    premiumGradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    premiumShadow: 'rgba(139, 92, 246, 0.3)',
    locked: '#64748b',
    lockedOverlay: 'linear-gradient(to bottom, rgba(30,41,59,0.36), rgba(30,41,59,0.68))',
    rare: '#8b5cf6',
    rareBg: 'rgba(139, 92, 246, 0.15)',
    unique: '#f59e0b',
    uniqueBg: 'rgba(245, 158, 11, 0.15)',

    comfortNo: '#ef4444',
    comfortWait: '#f97316',
    comfortCurious: '#eab308',
    comfortOk: '#22c55e',
    comfortLove: '#8b5cf6',
  },
};

export const themes: Record<ThemeMode, Theme> = {
  warm: warmTheme,
  calm: calmTheme,
  'dark-luxury': darkLuxuryTheme,
  nude: nudeTheme,
  youth: youthTheme,
};
