// V4 divergence: écran autonome — onSelectMinor/onSelectAdult remplacés par useAuthStore + navigation directe

import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { Calendar, Sprout, TreeDeciduous, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useNavigationStore, useAuthStore } from '@ouiclair/core';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';
import { Card } from '../ui';

export function AgeCheckScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { navigateTo } = useNavigationStore();
  const { setAgeGroup } = useAuthStore();
  const insets = useSafeAreaInsets();

  const handleMinor = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    setAgeGroup(false);
    navigateTo('theme-select');
  };

  const handleAdult = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    setAgeGroup(true);
    navigateTo('theme-select');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
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
              backgroundColor: '#fde68a',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <Calendar size={40} color="#d97706" />
          </MotiView>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8, textAlign: 'center' }}>
            {t('ageCheck.title')}
          </Text>
          <Text style={{ fontSize: 15, color: colors.textMuted, textAlign: 'center' }}>
            {t('ageCheck.subtitle')}
          </Text>
        </MotiView>

        <View style={{ flex: 1, gap: 16 }}>
          <Card onClick={handleMinor} variant="elevated" delay={1}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: '#d1fae5',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Sprout size={28} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>
                  {t('ageCheck.minor.title')}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textMuted }}>
                  {t('ageCheck.minor.desc')}
                </Text>
              </View>
            </View>
          </Card>

          <Card onClick={handleAdult} variant="elevated" delay={2}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: '#d1fae5',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <TreeDeciduous size={28} color="#065f46" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>
                  {t('ageCheck.adult.title')}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textMuted }}>
                  {t('ageCheck.adult.desc')}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 500 }}
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: colors.bgSecondary,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <Lock size={14} color={colors.textMuted} />
          <Text style={{ fontSize: 12, color: colors.textMuted }}>
            {t('ageCheck.privacy')}
          </Text>
        </MotiView>
      </View>
    </View>
  );
}
