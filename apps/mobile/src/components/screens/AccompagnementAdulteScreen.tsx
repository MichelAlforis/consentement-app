import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronLeft, PhoneCall } from 'lucide-react-native';
import { useNavigationStore } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';

export function AccompagnementAdulteScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { goBack } = useNavigationStore();
  const insets = useSafeAreaInsets();

  const items = [
    { labelKey: 'accompagnementAdulte.items.0' },
    { labelKey: 'accompagnementAdulte.items.1' },
    { labelKey: 'accompagnementAdulte.items.2' },
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
          {t('accompagnementAdulte.title')}
        </Text>
      </MotiView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
            {t('accompagnementAdulte.subtitle')}
          </Text>
        </MotiView>

        {items.map((item, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 120 + i * 70 }}
            style={{ marginBottom: 12 }}
          >
            <View
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
                <PhoneCall size={20} color={colors.accent} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: colors.textPrimary, lineHeight: 20 }}>
                {t(item.labelKey)}
              </Text>
            </View>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}
