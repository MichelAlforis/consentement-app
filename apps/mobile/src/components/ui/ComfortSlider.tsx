import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';

interface ComfortSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const LEVEL_KEYS = ['No', 'Wait', 'Curious', 'OK', 'Love'];
const LEVEL_ICONS = ['N', 'W', '?', 'OK', '<3'];

export function ComfortSlider({ value = 0, onChange, disabled = false }: ComfortSliderProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const colors = [
    theme.colors.comfortNo,
    theme.colors.comfortWait,
    theme.colors.comfortCurious,
    theme.colors.comfortOk,
    theme.colors.comfortLove,
  ];
  const currentIndex = Math.max(0, Math.min(value, LEVEL_KEYS.length - 1));
  const currentColor = colors[currentIndex] ?? theme.colors.accent;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {LEVEL_KEYS.map((level, index) => {
          const active = currentIndex >= index;
          const selected = currentIndex === index;
          const backgroundColor = active ? colors[index] : theme.colors.bgSecondary;

          return (
            <Pressable
              key={level}
              accessibilityRole="button"
              accessibilityState={{ disabled, selected }}
              disabled={disabled}
              onPress={() => onChange(index)}
              style={styles.segmentPressable}
            >
              {({ pressed }) => (
                <MotiView
                  animate={{
                    scale: pressed && !disabled ? 0.94 : 1,
                    opacity: active ? 1 : 0.5,
                    backgroundColor,
                  }}
                  transition={{ type: 'timing', duration: 180 }}
                  style={styles.segment}
                >
                  {selected ? (
                    <MotiView
                      from={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                    >
                      <Text style={styles.iconText}>{LEVEL_ICONS[index]}</Text>
                    </MotiView>
                  ) : null}
                </MotiView>
              )}
            </Pressable>
          );
        })}
      </View>

      <MotiView animate={{ opacity: 1 }} style={styles.labelRow}>
        <Text
          style={[
            styles.label,
            {
              color: currentColor,
              backgroundColor: `${currentColor}20`,
            },
          ]}
        >
          {t(`levels.${currentIndex}`)}
        </Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  track: {
    flexDirection: 'row',
    gap: 6,
  },
  segmentPressable: {
    flex: 1,
  },
  segment: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  labelRow: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  label: {
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
