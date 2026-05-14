import { Modal, Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { HEAT_THRESHOLDS, type HeatLevel } from '@ouiclair/core';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';

const LEVEL_NAME_KEYS: Record<HeatLevel, string> = {
  1: 'heat.tiede',
  2: 'heat.chaud',
  3: 'heat.ardent',
  4: 'heat.brulant',
  5: 'heat.incandescent',
};

const LEVEL_DESC_KEYS: Record<HeatLevel, string> = {
  1: 'heat.roadmap.desc1',
  2: 'heat.roadmap.desc2',
  3: 'heat.roadmap.desc3',
  4: 'heat.roadmap.desc4',
  5: 'heat.roadmap.desc5',
};

const LEVELS: HeatLevel[] = [1, 2, 3, 4, 5];

interface HeatRoadmapSheetProps {
  currentLevel: HeatLevel;
  currentPoints: number;
  onClose: () => void;
}

export function HeatRoadmapSheet({ currentLevel, currentPoints, onClose }: HeatRoadmapSheetProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const levelColors: Record<HeatLevel, string> = {
    1: theme.colors.accentLight,
    2: theme.colors.warning,
    3: theme.colors.unique,
    4: theme.colors.danger,
    5: theme.colors.premium,
  };

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/70 p-4 pb-10" onPress={onClose}>
        <BlurView intensity={10} tint="dark" className="absolute inset-0" />
        <MotiView
          from={{ translateY: 80, opacity: 0, scale: 0.96 }}
          animate={{ translateY: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-full max-w-[390px] self-center rounded-3xl border p-5"
          style={{ backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }}
        >
          <Pressable>
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="flex-1 text-base font-bold" style={{ color: theme.colors.textPrimary }}>
                {t('heat.roadmap.title')}
              </Text>
              <Pressable
                onPress={onClose}
                className="h-7 w-7 items-center justify-center rounded-full"
                style={{ backgroundColor: theme.colors.bgSecondary }}
              >
                <Text className="text-[13px] font-bold" style={{ color: theme.colors.textMuted }}>
                  X
                </Text>
              </Pressable>
            </View>

            <View className="gap-2">
              {LEVELS.map((level) => {
                const isCurrent = level === currentLevel;
                const isUnlocked = level < currentLevel;
                const isLocked = level > currentLevel;
                const color = levelColors[level];
                const threshold = HEAT_THRESHOLDS[level];

                return (
                  <MotiView
                    key={level}
                    from={{ opacity: 0, translateX: -8 }}
                    animate={{ opacity: isLocked ? 0.5 : 1, translateX: 0 }}
                    transition={{ type: 'timing', delay: (level - 1) * 50, duration: 220 }}
                    className="flex-row items-center gap-3 rounded-2xl border p-3"
                    style={{
                      backgroundColor: isCurrent ? `${color}18` : theme.colors.bgSecondary,
                      borderColor: isCurrent ? `${color}50` : 'transparent',
                    }}
                  >
                    <View
                      className="h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: isLocked ? theme.colors.border : color }}
                    >
                      <Text className="text-xs font-extrabold" style={{ color: isLocked ? theme.colors.textMuted : '#fff' }}>
                        {isUnlocked ? '✓' : isLocked ? 'L' : level}
                      </Text>
                    </View>

                    <View className="min-w-0 flex-1">
                      <View className="mb-0.5 flex-row flex-wrap items-center gap-2">
                        <Text
                          className="text-sm font-bold"
                          style={{ color: isLocked ? theme.colors.textMuted : theme.colors.textPrimary }}
                        >
                          {t(LEVEL_NAME_KEYS[level])}
                        </Text>
                        {isCurrent ? (
                          <Text className="overflow-hidden rounded-full px-1.5 py-0.5 text-[10px] font-extrabold text-white" style={{ backgroundColor: color }}>
                            {t('heat.roadmap.current')}
                          </Text>
                        ) : null}
                        {isUnlocked ? (
                          <Text className="text-[10px]" style={{ color: theme.colors.textMuted }}>
                            {t('heat.roadmap.unlocked')}
                          </Text>
                        ) : null}
                      </View>
                      <Text className="text-xs leading-[17px]" style={{ color: theme.colors.textMuted }}>
                        {level === 1
                          ? `${t('heat.roadmap.start')} · ${t(LEVEL_DESC_KEYS[level])}`
                          : `${t('heat.roadmap.pts')} ${threshold} · ${t(LEVEL_DESC_KEYS[level])}`}
                      </Text>
                    </View>
                  </MotiView>
                );
              })}
            </View>

            <View className="mt-4 flex-row items-center justify-between border-t pt-4" style={{ borderTopColor: theme.colors.divider }}>
              <Text className="text-xs" style={{ color: theme.colors.textMuted }}>
                {t('heat.roadmap.accumulated')} {currentPoints}
              </Text>
              {currentLevel === 5 ? (
                <Text className="text-xs font-bold" style={{ color: levelColors[5] }}>
                  {t('heat.roadmap.max')}
                </Text>
              ) : null}
            </View>
          </Pressable>
        </MotiView>
      </Pressable>
    </Modal>
  );
}
