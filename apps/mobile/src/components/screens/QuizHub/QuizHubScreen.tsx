import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { BookOpen, Brain, ChevronLeft, Zap } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useNavigationStore } from '@ouiclair/core';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';

const LEVELS: { labelKey: string; descKey: string; Icon: LucideIcon; color: string }[] = [
  { labelKey: 'quizHub.levels.0.label', descKey: 'quizHub.levels.0.desc', Icon: BookOpen, color: '#64B5F6' },
  { labelKey: 'quizHub.levels.1.label', descKey: 'quizHub.levels.1.desc', Icon: Brain, color: '#FFB74D' },
  { labelKey: 'quizHub.levels.2.label', descKey: 'quizHub.levels.2.desc', Icon: Zap, color: '#EF5350' },
];

export function QuizHubScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { goBack, navigateTo } = useNavigationStore();
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
          {t('quizHub.title')}
        </Text>
      </MotiView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 28 }}>
            {t('quizHub.subtitle')}
          </Text>
        </MotiView>

        {LEVELS.map((level, i) => (
          <MotiView
            key={level.labelKey}
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 120 + i * 80 }}
            style={{ marginBottom: 16 }}
          >
            <Pressable
              onPress={() => navigateTo('quiz-consentement')}
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 16,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: `${level.color}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <level.Icon size={24} color={level.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
                  {t(level.labelKey)}
                </Text>
                <Text style={{ fontSize: 13, color: colors.textMuted }}>
                  {t(level.descKey)}
                </Text>
              </View>
            </Pressable>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}
