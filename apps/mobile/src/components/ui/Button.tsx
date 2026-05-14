import { Pressable, Text, type ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import type { ReactNode } from 'react';
import { useTheme } from '../../theme/ThemeContext';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const PADDING: Record<Size, { paddingHorizontal: number; paddingVertical: number }> = {
  sm: { paddingHorizontal: 16, paddingVertical: 10 },
  md: { paddingHorizontal: 20, paddingVertical: 14 },
  lg: { paddingHorizontal: 24, paddingVertical: 16 },
};

const FONT_SIZE: Record<Size, number> = { sm: 14, md: 16, lg: 18 };
const RADIUS: Record<Size, number> = { sm: 12, md: 16, lg: 16 };

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  style,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.accent };
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'outline':
        return { backgroundColor: colors.bgCard, borderWidth: 2, borderColor: colors.border };
      case 'ghost':
        return { backgroundColor: 'transparent' };
    }
  };

  const textColor =
    variant === 'outline' ? colors.textPrimary :
    variant === 'ghost' ? colors.textMuted :
    '#ffffff';

  return (
    <Pressable onPress={disabled ? undefined : onPress} disabled={disabled} testID={testID}>
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.97 : 1 }}
          transition={{ type: 'timing', duration: 100 }}
          style={[
            PADDING[size],
            getContainerStyle(),
            {
              borderRadius: RADIUS[size],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              alignSelf: fullWidth ? 'stretch' : 'flex-start',
              opacity: disabled ? 0.4 : 1,
            },
            style,
          ]}
        >
          {icon}
          <Text style={{ color: textColor, fontSize: FONT_SIZE[size], fontWeight: '500' }}>
            {children}
          </Text>
        </MotiView>
      )}
    </Pressable>
  );
}
