import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { MessageCircle, ArrowRight } from 'lucide-react-native';
import { useMemo } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';

const QUESTION_COUNT = 15;

function getDailyIndex(): number {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return seed % QUESTION_COUNT;
}

interface DailyQuestionCardProps {
  onPress: () => void;
  delay?: number;
}

export function DailyQuestionCard({ onPress, delay = 0 }: DailyQuestionCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const questionKey = useMemo(() => `dailyQ.q${getDailyIndex()}`, []);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: delay * 1000 }}
    >
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <MotiView
            animate={{ scale: pressed ? 0.97 : 1 }}
            transition={{ type: 'timing', duration: 100 }}
            style={styles.card}
          >
            <View style={styles.iconBox}>
              <MessageCircle size={17} color="#ffffff" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>{t('dailyQ.title' as Parameters<typeof t>[0])}</Text>
              <Text style={[styles.question, { color: colors.textPrimary }]}>
                {t(questionKey as Parameters<typeof t>[0])}
              </Text>
            </View>
            <ArrowRight size={16} color="#a855f7" style={styles.arrow} />
          </MotiView>
        )}
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(139,92,246,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.22)',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    marginTop: 2,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: '#a855f7',
    marginBottom: 4,
  },
  question: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  arrow: {
    flexShrink: 0,
    marginTop: 2,
  },
});
