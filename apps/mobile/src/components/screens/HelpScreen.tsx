import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronDown, ChevronLeft, ChevronUp, Phone, Shield } from 'lucide-react-native';
import { useNavigationStore, useSettingsStore } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { EMERGENCY_NUMBERS, HELP_RESOURCES } from '../../data/helpResources';

export function HelpScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { goBack } = useNavigationStore();
  const { language } = useSettingsStore();
  const insets = useSafeAreaInsets();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const resources = HELP_RESOURCES[language] ?? HELP_RESOURCES.fr;
  const emergencyNums = EMERGENCY_NUMBERS[language] ?? EMERGENCY_NUMBERS.fr;

  const faqs = [
    { q: t('help.faq.0.question'), a: t('help.faq.0.answer') },
    { q: t('help.faq.1.question'), a: t('help.faq.1.answer') },
    { q: t('help.faq.2.question'), a: t('help.faq.2.answer') },
  ];

  function dial(number: string) {
    Linking.openURL(`tel:${number}`).catch(() => null);
  }

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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}>
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 60 }}>
          <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: 20 }}>
            {t('help.subtitle')}
          </Text>
        </MotiView>

        {/* Resources — tappable phone cards */}
        {resources.map((resource, i) => {
          const name = t(`help.resources.${resource.id}.name`);
          const desc = t(`help.resources.${resource.id}.desc`);
          return (
            <MotiView
              key={resource.id}
              from={{ opacity: 0, translateX: -16 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 80 + i * 50 }}
              style={{ marginBottom: 10 }}
            >
              <Pressable
                onPress={() => dial(resource.dialNumber)}
                style={{
                  backgroundColor: colors.bgCard,
                  borderRadius: 14,
                  padding: 14,
                  borderLeftWidth: 4,
                  borderLeftColor: resource.color,
                  borderWidth: 1,
                  borderColor: colors.divider,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: resource.color + '22',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Phone size={18} color={resource.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 }}>
                    {name}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>
                    {desc}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: resource.color }}>
                    {resource.phone}
                  </Text>
                </View>
              </Pressable>
            </MotiView>
          );
        })}

        {/* Emergency quick-dial buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 80 + resources.length * 50 + 40 }}
          style={{
            backgroundColor: '#7f1d1d22',
            borderRadius: 14,
            padding: 14,
            marginTop: 4,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#ef444433',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Shield size={16} color="#ef4444" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#ef4444' }}>
              {t('help.emergency.title')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {emergencyNums.map((em) => (
              <Pressable
                key={em.labelKey + em.number}
                onPress={() => dial(em.dialNumber)}
                style={{
                  flex: 1,
                  backgroundColor: colors.bgCard,
                  borderRadius: 12,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: '900', color: '#ef4444' }}>
                  {em.number}
                </Text>
                <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2, textAlign: 'center' }}>
                  {t(em.labelKey)}
                </Text>
              </Pressable>
            ))}
          </View>
        </MotiView>

        {/* FAQ */}
        {faqs.map((item, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 80 + resources.length * 50 + 120 + i * 60 }}
            style={{ marginBottom: 10 }}
          >
            <Pressable
              onPress={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 12,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginRight: 8 }}>
                  {item.q}
                </Text>
                {openIndex === i
                  ? <ChevronUp size={16} color={colors.accent} />
                  : <ChevronDown size={16} color={colors.textMuted} />}
              </View>
              {openIndex === i && (
                <Text style={{ marginTop: 10, fontSize: 13, color: colors.textMuted, lineHeight: 20 }}>
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
