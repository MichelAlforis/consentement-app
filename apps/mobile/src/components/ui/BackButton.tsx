import { Pressable, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

interface BackButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export function BackButton({ onPress, style }: BackButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.btn, { backgroundColor: colors.bgCard, borderColor: colors.border }, style]}
    >
      <ChevronLeft size={22} color={colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
