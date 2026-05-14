import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigationStore } from '@ouiclair/core';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';
import { QUIZ_QUESTIONS } from '../../../data/quizConsentement';

export function QuizConsentementScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { goBack } = useNavigationStore();
  const insets = useSafeAreaInsets();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[questionIndex];

  function handleAnswer(optionIndex: number) {
    const newScore = currentQuestion.correct === optionIndex ? score + 1 : score;
    if (questionIndex + 1 >= QUIZ_QUESTIONS.length) {
      setScore(newScore);
      setIsFinished(true);
    } else {
      setScore(newScore);
      setQuestionIndex(questionIndex + 1);
    }
  }

  if (isFinished) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bgPrimary,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MotiView from={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, textAlign: 'center' }}>
            {t('quiz.result')}
          </Text>
          <Text style={{ fontSize: 40, fontWeight: '900', color: colors.accent, marginBottom: 24 }}>
            {score}/{QUIZ_QUESTIONS.length}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 32, textAlign: 'center' }}>
            {t('quiz.score')}
          </Text>
          <Pressable
            onPress={goBack}
            style={{ backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>{t('quiz.back')}</Text>
          </Pressable>
        </MotiView>
      </View>
    );
  }

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
          {t('quiz.title')}
        </Text>
      </MotiView>

      <Text style={{ textAlign: 'center', fontSize: 12, color: colors.textMuted, paddingBottom: 8 }}>
        {questionIndex + 1} / {QUIZ_QUESTIONS.length}
      </Text>

      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <MotiView key={questionIndex} from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.textPrimary,
              marginBottom: 32,
              lineHeight: 28,
              textAlign: 'center',
            }}
          >
            {t(currentQuestion.questionKey)}
          </Text>

          {currentQuestion.optionKeys.map((optKey, i) => (
            <Pressable
              key={i}
              onPress={() => handleAnswer(i)}
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <Text style={{ fontSize: 14, color: colors.textPrimary, textAlign: 'center', fontWeight: '600' }}>
                {t(optKey)}
              </Text>
            </Pressable>
          ))}
        </MotiView>
      </View>
    </View>
  );
}
