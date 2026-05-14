import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo } from './AppLogo';
import type { Theme } from '@ouiclair/core';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  theme: Theme;
}

export function Header({ title, subtitle, showBack = false, onBack, theme }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = theme;

  return (
    <BlurView intensity={40} tint="dark" style={[styles.container, { paddingTop: insets.top + 8, borderBottomColor: colors.divider }]}>
      <View style={styles.row}>
        {showBack && (
          <Pressable
            onPress={onBack}
            style={[styles.backBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </Pressable>
        )}
        <AppLogo size={40} variant="theme" />
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
    </BlurView>
  );
}

const styles = {
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
} as const;
