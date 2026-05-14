// V4 divergence: onClick (V3 web) renommé onPress (convention RN).
import { View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../../theme/ThemeContext';

interface GameMenuCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  tag: string;
  onPress: () => void;
  delay?: number;
  variant?: 'default' | 'premium';
  locked?: boolean;
  lockedLabel?: string;
}

export function GameMenuCard({
  icon,
  title,
  description,
  tag,
  onPress,
  delay = 0,
  variant = 'default',
  locked = false,
  lockedLabel,
}: GameMenuCardProps) {
  const { colors } = useTheme();
  const isPremium = variant === 'premium';

  // TODO Phase 8 polish UI: remplacer par expo-linear-gradient (premiumGradient)
  const cardStyle: ViewStyle = isPremium
    ? { backgroundColor: colors.premium, padding: 20, borderRadius: 24 }
    : { backgroundColor: colors.bgCard, borderWidth: 1.5, borderColor: colors.border, padding: 16, borderRadius: 16 };

  return (
    <MotiView
      from={{ opacity: 0, translateY: isPremium ? 14 : 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: delay * 1000 }}
    >
      <Pressable onPress={locked ? undefined : onPress} disabled={locked}>
        {({ pressed }) => (
          <MotiView
            animate={{ scale: pressed && !locked ? 0.98 : 1 }}
            transition={{ type: 'timing', duration: 100 }}
            style={[styles.card, cardStyle]}
          >
            <View
              style={[
                isPremium ? styles.iconBoxLg : styles.iconBoxSm,
                { backgroundColor: isPremium ? 'rgba(255,255,255,0.2)' : colors.bgSecondary },
              ]}
            >
              {icon}
            </View>

            <View style={styles.textBlock}>
              <View style={styles.titleRow}>
                <Text style={[isPremium ? styles.titleLg : styles.titleSm, { color: isPremium ? '#ffffff' : colors.textPrimary }]}>
                  {title}
                </Text>
                <View
                  style={[
                    isPremium ? styles.tagPill : styles.tagBadge,
                    { backgroundColor: isPremium ? 'rgba(255,255,255,0.2)' : `${colors.success}22` },
                  ]}
                >
                  <Text style={[styles.tagText, { color: isPremium ? '#ffffff' : colors.success }]}>
                    {tag}
                  </Text>
                </View>
              </View>
              <Text style={[isPremium ? styles.descLg : styles.descSm, { color: isPremium ? 'rgba(255,255,255,0.82)' : colors.textMuted }]}>
                {description}
              </Text>
            </View>

            {!isPremium && <ChevronRight size={16} color={colors.textMuted} style={{ flexShrink: 0 }} />}

            {locked && (
              <View style={[styles.lockedOverlay, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
                <View style={[styles.lockedBadge, { backgroundColor: colors.premium }]}>
                  <Sparkles size={14} color="#ffffff" />
                  <Text style={styles.lockedText}>{lockedLabel ?? tag}</Text>
                </View>
              </View>
            )}
          </MotiView>
        )}
      </Pressable>
    </MotiView>
  );
}

const styles = {
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  iconBoxLg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconBoxSm: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  titleLg: {
    fontSize: 16,
    fontWeight: '700',
  },
  titleSm: {
    fontSize: 14,
    fontWeight: '600',
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  descLg: {
    fontSize: 14,
    lineHeight: 20,
  },
  descSm: {
    fontSize: 12,
    lineHeight: 17,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  lockedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
} as const;
