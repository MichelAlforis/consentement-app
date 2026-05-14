// V4 divergence: selectTheme() utilisé à la place de setTheme() (API réelle du settingsStore)
// V4 divergence: LinearGradient expo-linear-gradient remplace les gradients CSS string
// V4 divergence: écran autonome — pas d'onSelectTheme prop, navigation via useNavigationStore

import { View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Crown, Lock, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useNavigationStore, useAuthStore, useSettingsStore, usePremiumStore, themes, type ThemeMode } from '@ouiclair/core';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';

const THEME_PREVIEW_COLORS: Record<ThemeMode, string[]> = {
  warm:          ['#e07a5f', '#f4a261', '#8fb996', '#e9c46a'],
  calm:          ['#5c6ac4', '#9d8cd9', '#6eb089', '#e2c36b'],
  'dark-luxury': ['#c9a84c', '#8b1a3a', '#f0ece4', '#1a1518'],
  nude:          ['#b07d6a', '#8c7860', '#2e2420', '#f2ede8'],
  youth:         ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'],
};

const THEME_GRADIENT_COLORS: Record<ThemeMode, [string, string]> = {
  warm:          ['#fef7f0', '#ffecd2'],
  calm:          ['#f5f6f8', '#e8eaef'],
  'dark-luxury': ['#0f0d0e', '#1e1520'],
  nude:          ['#faf7f4', '#f0e8e0'],
  youth:         ['#f0f7ff', '#e8f0ff'],
};

const ADULT_FREE_THEMES: ThemeMode[] = ['warm', 'calm'];
const MINOR_THEMES: ThemeMode[] = ['youth', 'warm', 'calm'];
const PREMIUM_THEMES: ThemeMode[] = ['dark-luxury', 'nude'];

export function ThemeSelectScreen() {
  const { t } = useTranslation();
  const { id: currentMode } = useTheme();
  const { navigateTo } = useNavigationStore();
  const { isAdult } = useAuthStore();
  const { selectTheme } = useSettingsStore();
  const { isPremium } = usePremiumStore();
  const insets = useSafeAreaInsets();

  const isMinor = isAdult === false;
  const freeThemes = isMinor ? MINOR_THEMES : ADULT_FREE_THEMES;

  const handleSelectTheme = (mode: ThemeMode, locked: boolean) => {
    impactAsync(ImpactFeedbackStyle.Light);
    if (locked) { navigateTo('premium'); return; }
    selectTheme(mode);
    setTimeout(() => navigateTo('auth'), 200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6', paddingTop: insets.top }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ scale: 0, rotate: '-180deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ alignItems: 'center', marginTop: 40, marginBottom: 24 }}
        >
          <View style={{
            width: 80, height: 80, borderRadius: 24,
            backgroundColor: '#7c3aed',
            alignItems: 'center', justifyContent: 'center',
            shadowColor: '#7c3aed',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          }}>
            <Text style={{ fontSize: 36 }}>🎨</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={{ alignItems: 'center', marginBottom: 32 }}
        >
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 4, textAlign: 'center' }}>
            {t('themeSelect.title')}
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
            {t('themeSelect.subtitle')}
          </Text>
        </MotiView>

        <View style={{ gap: 12, marginBottom: 16 }}>
          {freeThemes.map((mode, i) => {
            const theme = themes[mode];
            const isSelected = mode === currentMode;
            return (
              <MotiView
                key={mode}
                from={{ opacity: 0, translateX: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 300 + i * 100 }}
              >
                <Pressable onPress={() => handleSelectTheme(mode, false)}>
                  {({ pressed }) => (
                    <LinearGradient
                      colors={THEME_GRADIENT_COLORS[mode]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 24,
                        padding: 20,
                        opacity: pressed ? 0.92 : 1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 3,
                        borderWidth: isSelected ? 2 : 0,
                        borderColor: isSelected ? theme.colors.accent : 'transparent',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                        <View style={{
                          width: 48, height: 48, borderRadius: 16,
                          overflow: 'hidden',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          padding: 2,
                          gap: 2,
                          backgroundColor: theme.colors.accentGradient,
                        }}>
                          {THEME_PREVIEW_COLORS[mode].map((c) => (
                            <View key={c} style={{ width: 20, height: 20, borderRadius: 3, backgroundColor: c }} />
                          ))}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary }}>
                            {theme.name}
                          </Text>
                          <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                            {theme.description}
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={{
                            width: 24, height: 24, borderRadius: 12,
                            backgroundColor: theme.colors.accent,
                            alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Check size={13} color="#fff" />
                          </View>
                        )}
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {THEME_PREVIEW_COLORS[mode].map((c) => (
                          <View key={c} style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: c }} />
                        ))}
                      </View>
                    </LinearGradient>
                  )}
                </Pressable>
              </MotiView>
            );
          })}
        </View>

        {!isMinor && (
          <>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 550 }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Lock size={11} color="#9ca3af" />
                <Text style={{ fontSize: 12, color: '#9ca3af' }}>{t('games.premium')}</Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
            </MotiView>

            <View style={{ gap: 12 }}>
              {PREMIUM_THEMES.map((mode, i) => {
                const theme = themes[mode];
                const locked = !isPremium;
                const isDarkLuxury = mode === 'dark-luxury';

                return (
                  <MotiView
                    key={mode}
                    from={{ opacity: 0, translateX: i % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 600 + i * 100 }}
                  >
                    <Pressable onPress={() => handleSelectTheme(mode, locked)}>
                      {({ pressed }) => (
                        <LinearGradient
                          colors={THEME_GRADIENT_COLORS[mode]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            borderRadius: 24,
                            padding: 20,
                            opacity: pressed ? 0.92 : 1,
                            overflow: 'hidden',
                            shadowColor: isDarkLuxury ? '#000' : '#b07d6a',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: isDarkLuxury ? 0.35 : 0.12,
                            shadowRadius: 20,
                            elevation: isDarkLuxury ? 8 : 3,
                          }}
                        >
                          {locked && (
                            <View style={{
                              ...({ position: 'absolute' } as const),
                              top: 0, left: 0, right: 0, bottom: 0,
                              borderRadius: 24,
                              backgroundColor: isDarkLuxury ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.18)',
                              alignItems: 'center', justifyContent: 'center',
                              zIndex: 10,
                              gap: 8,
                            }}>
                              <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 16,
                                backgroundColor: isDarkLuxury ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.85)',
                                borderWidth: 1,
                                borderColor: isDarkLuxury ? 'rgba(201,168,76,0.4)' : 'rgba(176,125,106,0.3)',
                              }}>
                                <Crown size={14} color={isDarkLuxury ? '#c9a84c' : '#8c7860'} />
                                <Text style={{ fontSize: 14, fontWeight: '600', color: isDarkLuxury ? '#c9a84c' : '#5c4a40' }}>
                                  Premium
                                </Text>
                              </View>
                              <Text style={{ fontSize: 12, color: isDarkLuxury ? 'rgba(201,168,76,0.7)' : 'rgba(92,74,64,0.7)' }}>
                                {t('games.unlock')}
                              </Text>
                            </View>
                          )}

                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                            <View style={{
                              width: 48, height: 48, borderRadius: 16,
                              overflow: 'hidden',
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              padding: 2,
                              gap: 2,
                              backgroundColor: theme.colors.accentGradient,
                            }}>
                              {THEME_PREVIEW_COLORS[mode].map((c) => (
                                <View key={c} style={{ width: 20, height: 20, borderRadius: 3, backgroundColor: c }} />
                              ))}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary }}>
                                {theme.name}
                              </Text>
                              <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                                {theme.description}
                              </Text>
                            </View>
                          </View>
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            {THEME_PREVIEW_COLORS[mode].map((c) => (
                              <View key={c} style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: c }} />
                            ))}
                          </View>
                        </LinearGradient>
                      )}
                    </Pressable>
                  </MotiView>
                );
              })}
            </View>

            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 900 }}
              style={{ marginTop: 24, marginBottom: 8 }}
            >
              <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
                {t('premium.themesNote')}
              </Text>
            </MotiView>
          </>
        )}
      </ScrollView>
    </View>
  );
}
