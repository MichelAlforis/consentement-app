import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigationStore } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';

export function LoiConsentementScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { goBack } = useNavigationStore();
  const insets = useSafeAreaInsets();

  const articles = [
    { titreKey: 'loiConsentement.article0.titre', texteKey: 'loiConsentement.article0.texte' },
    { titreKey: 'loiConsentement.article1.titre', texteKey: 'loiConsentement.article1.texte' },
    { titreKey: 'loiConsentement.article2.titre', texteKey: 'loiConsentement.article2.texte' },
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
          {t('loiConsentement.title')}
        </Text>
      </MotiView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24, lineHeight: 22 }}>
            {t('loiConsentement.intro')}
          </Text>
        </MotiView>

        {articles.map((a, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 120 + i * 80 }}
            style={{ marginBottom: 20 }}
          >
            <View
              style={{
                backgroundColor: `${colors.accent}15`,
                borderRadius: 12,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: colors.accent,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: colors.accent,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {t(a.titreKey)}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, lineHeight: 20, fontStyle: 'italic' }}>
                {t(a.texteKey)}
              </Text>
            </View>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}
