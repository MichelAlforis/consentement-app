import { Pressable, Text, View } from 'react-native';
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
    <View className="py-2">
      <View className="flex-row gap-1.5">
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
              className="flex-1"
            >
              {({ pressed }) => (
                <MotiView
                  animate={{
                    scale: pressed && !disabled ? 0.94 : 1,
                    opacity: active ? 1 : 0.5,
                    backgroundColor,
                  }}
                  transition={{ type: 'timing', duration: 180 }}
                  className="h-11 items-center justify-center overflow-hidden rounded-xl"
                >
                  {selected ? (
                    <MotiView
                      from={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                    >
                      <Text className="text-xs font-extrabold text-white">{LEVEL_ICONS[index]}</Text>
                    </MotiView>
                  ) : null}
                </MotiView>
              )}
            </Pressable>
          );
        })}
      </View>

      <MotiView animate={{ opacity: 1 }} className="mt-2 items-end">
        <Text
          className="overflow-hidden rounded-full px-2 py-1 text-xs font-semibold"
          style={{
            color: currentColor,
            backgroundColor: `${currentColor}20`,
          }}
        >
          {t(`levels.${currentIndex}`)}
        </Text>
      </MotiView>
    </View>
  );
}
