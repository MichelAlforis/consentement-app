import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronLeft, Heart, Lock, Sparkles, Zap } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useNavigationStore } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';

const FEATURES: { key: string; Icon: LucideIcon }[] = [
  { key: 'premium.features.0.label', Icon: Sparkles },
  { key: 'premium.features.1.label', Icon: Lock },
  { key: 'premium.features.2.label', Icon: Heart },
  { key: 'premium.features.3.label', Icon: Zap },
];

export function PremiumScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { goBack } = useNavigationStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: insets.top }}>
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <Pressable onPress={goBack} style={{ marginRight: 12 }} hitSlop={8}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>
          {t('premium.title')}
        </Text>
      </MotiView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 24 }}>
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 32, textAlign: 'center', lineHeight: 22 }}>
            {t('premium.subtitle')}
          </Text>
        </MotiView>

        {FEATURES.map((f, i) => (
          <MotiView
            key={f.key}
            from={{ opacity: 0, translateX: -16 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 120 + i * 70 }}
            style={{ marginBottom: 16 }}
          >
            <View
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 14,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: `${colors.accent}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <f.Icon size={20} color={colors.accent} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>
                {t(f.key)}
              </Text>
            </View>
          </MotiView>
        ))}

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 500 }}
          style={{ marginTop: 16 }}
        >
          <Pressable
            onPress={() => {
              // TODO Phase 8: brancher RevenueCat IAP (react-native-purchases)
              Alert.alert(
                t('premium.comingSoonTitle'),
                t('premium.comingSoonMessage'),
              );
            }}
            style={{ backgroundColor: colors.accent, borderRadius: 14, padding: 18, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
              {t('premium.cta')}
            </Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </View>
  );
}
