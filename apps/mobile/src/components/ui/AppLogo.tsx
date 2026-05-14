import { useId } from 'react';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MotiView } from 'moti';
import { useTheme } from '../../theme/ThemeContext';

export type LogoVariant = 'dark' | 'light' | 'theme';

interface AppLogoProps {
  size?: number;
  variant?: LogoVariant;
  animated?: boolean;
}

const GRADIENTS: Record<LogoVariant, { stops: [string, string, string]; bg: string }> = {
  dark:  { stops: ['#f5f3ff', '#c4b5fd', '#8b5cf6'], bg: 'rgba(255,255,255,0.08)' },
  light: { stops: ['#f472b6', '#8b5cf6', '#14b8a6'], bg: 'rgba(255,255,255,0.78)' },
  theme: { stops: ['#f472b6', '#8b5cf6', '#14b8a6'], bg: 'rgba(255,255,255,0.72)' },
};

export function AppLogo({ size = 40, variant = 'light', animated = false }: AppLogoProps) {
  const { colors } = useTheme();
  const uid = useId().replace(/:/g, '');
  const palette = GRADIENTS[variant];

  const stops: [string, string, string] =
    variant === 'theme'
      ? [colors.accent, colors.premium, colors.success]
      : palette.stops;

  const gradId = `lg-${uid}`;
  const hlId = `hl-${uid}`;

  const svg = (
    <Svg width={size} height={size} viewBox="0 0 96 96">
      <Defs>
        <LinearGradient id={gradId} x1="18" y1="12" x2="78" y2="84" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={stops[0]} />
          <Stop offset="52%" stopColor={stops[1]} />
          <Stop offset="100%" stopColor={stops[2]} />
        </LinearGradient>
        <LinearGradient id={hlId} x1="28" y1="18" x2="66" y2="74" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="white" stopOpacity="0.82" />
          <Stop offset="100%" stopColor="white" stopOpacity="0.16" />
        </LinearGradient>
      </Defs>
      <Rect x="10" y="10" width="76" height="76" rx="24" fill={palette.bg} />
      <Path
        d="M48 78C37.5 68.6 25 58.7 25 44.3C25 34.9 31.2 28 39.4 28C43.7 28 46.6 30 48 32.5C49.4 30 52.3 28 56.6 28C64.8 28 71 34.9 71 44.3C71 58.7 58.5 68.6 48 78Z"
        fill={`url(#${gradId})`}
      />
      <Path
        d="M48 68C40.9 61.5 33 54.3 33 44.9C33 39.8 36.1 36 40.5 36C44.7 36 47.1 39.1 48 42.2C48.9 39.1 51.3 36 55.5 36C59.9 36 63 39.8 63 44.9C63 54.3 55.1 61.5 48 68Z"
        fill={`url(#${hlId})`}
        opacity="0.82"
      />
      <Path
        d="M34 47.5L43.2 56.7L63 37"
        fill="none"
        stroke="white"
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      />
    </Svg>
  );

  if (!animated) return svg;

  return (
    <MotiView
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ loop: true, duration: 5500, type: 'timing' }}
    >
      {svg}
    </MotiView>
  );
}
