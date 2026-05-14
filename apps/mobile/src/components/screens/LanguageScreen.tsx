// V4 divergence: changeLanguage() utilisé à la place de setLanguage() (API réelle du settingsStore)
// V4 divergence: écran autonome — pas d'onContinue prop, navigation via useNavigationStore

import { View, Text, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useNavigationStore, useSettingsStore, type Language } from '@ouiclair/core';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';
import { AppLogo, Button } from '../ui';

const LANGUAGES: { code: Language; nativeName: string; flag: string }[] = [
  { code: 'fr', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', nativeName: 'English',  flag: '🇬🇧' },
  { code: 'es', nativeName: 'Español',  flag: '🇪🇸' },
];

export function LanguageScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { navigateTo } = useNavigationStore();
  const { language, changeLanguage } = useSettingsStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <MotiView
          from={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          style={{ marginBottom: 40 }}
        >
          <AppLogo size={80} variant="light" />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={{ marginBottom: 32, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8, textAlign: 'center' }}>
            {t('language.title')}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>
            {t('language.subtitle')}
          </Text>
        </MotiView>

        <View style={{ width: '100%', gap: 12 }}>
          {LANGUAGES.map((lang, i) => {
            const active = language === lang.code;
            return (
              <MotiView
                key={lang.code}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 300 + i * 80 }}
              >
                <Pressable
                  onPress={() => { impactAsync(ImpactFeedbackStyle.Light); changeLanguage(lang.code); }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: active ? `${colors.accent}18` : colors.bgCard,
                    borderWidth: 2,
                    borderColor: active ? colors.accent : colors.divider,
                  }}
                >
                  <Text style={{ fontSize: 28 }}>{lang.flag}</Text>
                  <Text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: active ? colors.accent : colors.textPrimary }}>
                    {lang.nativeName}
                  </Text>
                  {active && (
                    <View style={{
                      width: 20, height: 20, borderRadius: 10,
                      backgroundColor: colors.accent,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>✓</Text>
                    </View>
                  )}
                </Pressable>
              </MotiView>
            );
          })}
        </View>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 550 }}
        style={{ paddingHorizontal: 24, paddingBottom: 16 }}
      >
        <Button onPress={() => navigateTo('age-check')} fullWidth size="lg">
          {t('language.cta')}
        </Button>
      </MotiView>
    </View>
  );
}
