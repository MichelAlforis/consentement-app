// V4 divergence: onClick (V3 web) renommé onPress (convention RN).
import { View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../../theme/ThemeContext';

type MenuCardVariant = 'default' | 'accent' | 'secondary' | 'green' | 'amber';

interface MenuCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onPress: () => void;
  variant?: MenuCardVariant;
  delay?: number;
}

export function MenuCard({
  icon,
  title,
  description,
  onPress,
  variant = 'default',
  delay = 0,
}: MenuCardProps) {
  const { colors } = useTheme();
  const isColored = variant !== 'default';

  // TODO Phase 5b: remplacer par expo-linear-gradient (accentGradient, secondaryGradient, etc.)
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'accent':
        return { backgroundColor: colors.accent };
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'green':
        return { backgroundColor: colors.success };
      case 'amber':
        return { backgroundColor: colors.warning };
      default:
        return { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border };
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'timing', duration: 500, delay: delay * 100 }}
    >
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <MotiView
            animate={{ scale: pressed ? 0.98 : 1 }}
            transition={{ type: 'timing', duration: 100 }}
            style={[styles.card, getCardStyle()]}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: isColored ? 'rgba(255,255,255,0.2)' : colors.accent },
              ]}
            >
              {icon}
            </View>

            <View style={styles.textBlock}>
              <Text style={[styles.title, { color: isColored ? '#ffffff' : colors.textPrimary }]}>
                {title}
              </Text>
              <Text style={[styles.description, { color: isColored ? 'rgba(255,255,255,0.82)' : colors.textSecondary }]}>
                {description}
              </Text>
            </View>

            {!isColored && (
              <ChevronRight size={24} color={colors.textMuted} />
            )}
          </MotiView>
        )}
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
});
