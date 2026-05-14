import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigationStore } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';

const SECTION_COLORS = ['#E57373', '#64B5F6', '#81C784'];

export function PornoVsRealiteScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { goBack } = useNavigationStore();
  const insets = useSafeAreaInsets();

  const sections = [
    { titleKey: 'pornoVsRealite.section0.title', bodyKey: 'pornoVsRealite.section0.body' },
    { titleKey: 'pornoVsRealite.section1.title', bodyKey: 'pornoVsRealite.section1.body' },
    { titleKey: 'pornoVsRealite.section2.title', bodyKey: 'pornoVsRealite.section2.body' },
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
          {t('pornoVsRealite.title')}
        </Text>
      </MotiView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24, lineHeight: 22 }}>
            {t('pornoVsRealite.intro')}
          </Text>
        </MotiView>

        {sections.map((s, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateX: -16 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 120 + i * 80 }}
            style={{ marginBottom: 20 }}
          >
            <View
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 12,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: SECTION_COLORS[i],
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>
                {t(s.titleKey)}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, lineHeight: 20 }}>
                {t(s.bodyKey)}
              </Text>
            </View>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}
