// V4 divergence: authenticate() utilisé à la place de login() (API réelle du authStore)
// V4 divergence: KeyboardAvoidingView + Keyboard.dismiss() pour dismiss natif du clavier
// V4 divergence: TextInput RN à la place de <input> HTML

import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Keyboard, Platform } from 'react-native';
import { MotiView } from 'moti';
import { Shield, KeyRound, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useNavigationStore, useAuthStore } from '@ouiclair/core';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';
import { Card, Button } from '../ui';
import { secureTokenStore } from '../../storage/secureTokenStore';

const PRONOUNS = ['il', 'elle', 'iel', 'neutre'] as const;
type PronounKey = typeof PRONOUNS[number];

export function AuthScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { replaceWith } = useNavigationStore();
  const { authenticate, setPronouns } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedPronoun, setSelectedPronoun] = useState<PronounKey | null>(null);

  const handleContinue = async () => {
    if (name.trim()) {
      Keyboard.dismiss();
      impactAsync(ImpactFeedbackStyle.Light);
      setPronouns(selectedPronoun);
      authenticate(name.trim());
      const { pbToken } = useAuthStore.getState();
      if (pbToken) await secureTokenStore.save(pbToken);
      replaceWith('home');
    } else {
      setHasError(true);
      setTimeout(() => setHasError(false), 2500);
    }
  };

  const handleChangeName = (value: string) => {
    setName(value);
    if (hasError) setHasError(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 32 }}
        >
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              width: 80, height: 80, borderRadius: 24,
              backgroundColor: '#7c3aed',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 24,
              shadowColor: '#7c3aed',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <User size={40} color="#fff" />
          </MotiView>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8, textAlign: 'center' }}>
            {t('auth.title')}
          </Text>
          <Text style={{ fontSize: 15, color: colors.textMuted, textAlign: 'center' }}>
            {t('auth.subtitle')}
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={{ gap: 12 }}
        >
          <Card variant="default" padding="lg">
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: 8 }}>
              {t('auth.nameLabel')}
            </Text>
            <MotiView
              animate={{ translateX: hasError ? [0, -6, 6, -4, 4, 0] : 0 }}
              transition={{ type: 'timing', duration: 350 }}
            >
              <TextInput
                value={name}
                onChangeText={handleChangeName}
                placeholder={t('auth.namePlaceholder')}
                placeholderTextColor={colors.textMuted}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 2,
                  fontSize: 16,
                  backgroundColor: colors.bgSecondary,
                  borderColor: hasError ? colors.error : isFocused ? colors.accent : colors.border,
                  color: colors.textPrimary,
                }}
              />
            </MotiView>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <Shield size={11} color={colors.textMuted} />
              <Text style={{ fontSize: 12, color: hasError ? colors.error : colors.textMuted }}>
                {hasError ? t('auth.nameRequired') : t('auth.namePrivacy')}
              </Text>
            </View>
          </Card>

          <Card variant="default" padding="lg">
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: 12 }}>
              {t('auth.pronounsLabel')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {PRONOUNS.map((p) => {
                const active = selectedPronoun === p;
                return (
                  <Pressable
                    key={p}
                    onPress={() => { impactAsync(ImpactFeedbackStyle.Light); setSelectedPronoun(active ? null : p); }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      backgroundColor: active ? colors.accent : colors.bgSecondary,
                      borderWidth: 1,
                      borderColor: active ? colors.accent : colors.divider,
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '500', color: active ? '#fff' : colors.textMuted }}>
                      {t(`auth.pronounOptions.${p}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={{ marginTop: 24 }}
        >
          <Button onPress={handleContinue} fullWidth size="lg" icon={<KeyRound size={18} color="#fff" />}>
            {t('auth.btnContinue')}
          </Button>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
