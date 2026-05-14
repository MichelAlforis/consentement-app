import { ScrollView, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { useNavigationStore } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { SEXOLOGUES } from '../../data/sexologues';

export function AnnuaireSexologuesScreen() {
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
          {t('annuaire.title')}
        </Text>
      </MotiView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
            {t('annuaire.subtitle')}
          </Text>
        </MotiView>

        {SEXOLOGUES.map((sexo, i) => (
          <MotiView
            key={sexo.id}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 120 + i * 60 }}
            style={{ marginBottom: 12 }}
          >
            <View
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 14,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
                {sexo.nom}
              </Text>
              <Text style={{ fontSize: 13, color: colors.accent, marginBottom: 6 }}>
                {sexo.specialite}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} color={colors.textMuted} />
                <Text style={{ fontSize: 12, color: colors.textMuted }}>{sexo.ville}</Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.accent, marginTop: 8, fontWeight: '600' }}>
                {t('annuaire.cardCta')}
              </Text>
            </View>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}
