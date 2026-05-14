import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronDown, ChevronLeft, ChevronUp } from 'lucide-react-native';
import { useNavigationStore } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';

export function HelpScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { goBack } = useNavigationStore();
  const insets = useSafeAreaInsets();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t('help.faq.0.question'), a: t('help.faq.0.answer') },
    { q: t('help.faq.1.question'), a: t('help.faq.1.answer') },
    { q: t('help.faq.2.question'), a: t('help.faq.2.answer') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: insets.top + 16 }}>
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <Pressable onPress={goBack} style={{ marginRight: 12 }} hitSlop={8}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>
          {t('help.title')}
        </Text>
      </MotiView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
            {t('help.subtitle')}
          </Text>
        </MotiView>

        {faqs.map((item, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 120 + i * 60 }}
            style={{ marginBottom: 12 }}
          >
            <Pressable
              onPress={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginRight: 8 }}>
                  {item.q}
                </Text>
                {openIndex === i
                  ? <ChevronUp size={18} color={colors.accent} />
                  : <ChevronDown size={18} color={colors.textMuted} />}
              </View>
              {openIndex === i && (
                <Text style={{ marginTop: 12, fontSize: 13, color: colors.textMuted, lineHeight: 20 }}>
                  {item.a}
                </Text>
              )}
            </Pressable>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}
