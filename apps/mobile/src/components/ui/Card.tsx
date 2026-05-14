import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { useTheme } from '../../theme/ThemeContext';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  variant?:
    | 'default'
    | 'elevated'
    | 'accent'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'premium'
    | 'locked'
    | 'rare'
    | 'unique'
    | 'danger';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'xl' | '2xl' | '3xl';
  delay?: number;
  style?: ViewStyle;
  blur?: boolean;
  blurIntensity?: number;
}

const PADDING: Record<NonNullable<CardProps['padding']>, number> = {
  none: 0,
  sm: 16,
  md: 20,
  lg: 24,
};

const RADII: Record<NonNullable<CardProps['radius']>, number> = {
  xl: 12,
  '2xl': 16,
  '3xl': 24,
};

export function Card({
  children,
  onClick,
  variant = 'default',
  padding = 'md',
  radius = '2xl',
  delay = 0,
  style,
  blur = false,
  blurIntensity = 18,
}: CardProps) {
  const theme = useTheme();
  const cardStyle = getVariantStyle(variant, theme.colors);
  const borderRadius = RADII[radius];

  const content = (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', delay: delay * 100, duration: 400 }}
      style={[
        styles.card,
        cardStyle,
        {
          borderRadius,
          padding: PADDING[padding],
        },
        style,
      ]}
    >
      {blur ? (
        <BlurView intensity={blurIntensity} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius }]} />
      ) : null}
      <View style={styles.content}>{children}</View>
    </MotiView>
  );

  if (!onClick) return content;

  return (
    <Pressable accessibilityRole="button" onPress={onClick}>
      {({ pressed }) => (
        <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: 'timing', duration: 120 }}>
          {content}
        </MotiView>
      )}
    </Pressable>
  );
}

function getVariantStyle(
  variant: NonNullable<CardProps['variant']>,
  colors: ReturnType<typeof useTheme>['colors'],
): ViewStyle {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: colors.bgCard,
        borderColor: colors.border,
        shadowColor: colors.textPrimary,
        shadowOpacity: 0.1,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
      };
    case 'accent':
      return { backgroundColor: colors.accent, borderColor: colors.accent };
    case 'secondary':
      return { backgroundColor: colors.secondary, borderColor: colors.secondary };
    case 'success':
      return { backgroundColor: `${colors.success}18`, borderColor: `${colors.success}30` };
    case 'warning':
      return { backgroundColor: `${colors.warning}18`, borderColor: `${colors.warning}30` };
    case 'premium':
      return {
        backgroundColor: colors.premium,
        borderColor: colors.premiumLight,
        shadowColor: colors.premium,
        shadowOpacity: 0.26,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
      };
    case 'locked':
      return { backgroundColor: colors.bgSecondary, borderColor: colors.locked };
    case 'rare':
      return { backgroundColor: colors.rareBg, borderColor: `${colors.rare}30` };
    case 'unique':
      return { backgroundColor: colors.uniqueBg, borderColor: `${colors.unique}30` };
    case 'danger':
      return { backgroundColor: `${colors.danger}18`, borderColor: `${colors.danger}30` };
    default:
      return { backgroundColor: colors.bgCard, borderColor: colors.border };
  }
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
  },
});
