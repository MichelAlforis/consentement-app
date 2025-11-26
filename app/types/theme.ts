// Deux thèmes tendance, non genrés

export type ThemeMode = 'warm' | 'calm';

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

export interface Theme {
  id: ThemeMode;
  name: string;
  emoji: string;
  description: string;
  colors: ThemeColors;
}

// Thème WARM - Tons chauds, terracotta, pêche, corail (tendance 2024-2025)
export const warmTheme: Theme = {
  id: 'warm',
  name: 'Chaleureux',
  emoji: '🌅',
  description: 'Tons chauds et doux',
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

export const themes: Record<ThemeMode, Theme> = {
  warm: warmTheme,
  calm: calmTheme,
};
