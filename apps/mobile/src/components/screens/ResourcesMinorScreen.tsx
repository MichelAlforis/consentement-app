import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronLeft, Phone } from 'lucide-react-native';
import { useNavigationStore } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';

export function ResourcesMinorScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { goBack } = useNavigationStore();
  const insets = useSafeAreaInsets();

  const resources = [
    { nameKey: 'resourcesMinor.item0.name', descKey: 'resourcesMinor.item0.desc', phoneKey: 'resourcesMinor.item0.phone' },
    { nameKey: 'resourcesMinor.item1.name', descKey: 'resourcesMinor.item1.desc', phoneKey: 'resourcesMinor.item1.phone' },
    { nameKey: 'resourcesMinor.item2.name', descKey: 'resourcesMinor.item2.desc', phoneKey: 'resourcesMinor.item2.phone' },
  ];

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
          {t('resourcesMinor.title')}
        </Text>
      </MotiView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
            {t('resourcesMinor.subtitle')}
          </Text>
        </MotiView>

        {resources.map((r, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 120 + i * 70 }}
            style={{ marginBottom: 12 }}
          >
            <Pressable
              onPress={() => Linking.openURL(`tel:${t(r.phoneKey)}`).catch(() => {
                // Silencieux : appareil sans capacité d'appel (tablette, etc.)
              })}
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 14,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
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
                <Phone size={20} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 }}>
                  {t(r.nameKey)}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>{t(r.descKey)}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.accent, marginTop: 4 }}>
                  {t(r.phoneKey)}
                </Text>
              </View>
            </Pressable>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}
