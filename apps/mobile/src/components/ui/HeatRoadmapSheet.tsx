import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
      <Pressable style={styles.overlay} onPress={onClose}>
        <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />
        <MotiView
          from={{ translateY: 80, opacity: 0, scale: 0.96 }}
          animate={{ translateY: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          style={[styles.sheet, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
        >
          <Pressable>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t('heat.roadmap.title')}</Text>
              <Pressable onPress={onClose} style={[styles.closeButton, { backgroundColor: theme.colors.bgSecondary }]}>
                <Text style={[styles.closeText, { color: theme.colors.textMuted }]}>X</Text>
              </Pressable>
            </View>

            <View style={styles.levels}>
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
                    style={[
                      styles.levelRow,
                      {
                        backgroundColor: isCurrent ? `${color}18` : theme.colors.bgSecondary,
                        borderColor: isCurrent ? `${color}50` : 'transparent',
                      },
                    ]}
                  >
                    <View style={[styles.indicator, { backgroundColor: isLocked ? theme.colors.border : color }]}>
                      <Text style={[styles.indicatorText, { color: isLocked ? theme.colors.textMuted : '#fff' }]}>
                        {isUnlocked ? '✓' : isLocked ? 'L' : level}
                      </Text>
                    </View>

                    <View style={styles.levelContent}>
                      <View style={styles.levelTitleRow}>
                        <Text
                          style={[
                            styles.levelTitle,
                            { color: isLocked ? theme.colors.textMuted : theme.colors.textPrimary },
                          ]}
                        >
                          {t(LEVEL_NAME_KEYS[level])}
                        </Text>
                        {isCurrent ? (
                          <Text style={[styles.currentBadge, { backgroundColor: color }]}>
                            {t('heat.roadmap.current')}
                          </Text>
                        ) : null}
                        {isUnlocked ? (
                          <Text style={[styles.unlocked, { color: theme.colors.textMuted }]}>
                            {t('heat.roadmap.unlocked')}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={[styles.description, { color: theme.colors.textMuted }]}>
                        {level === 1
                          ? `${t('heat.roadmap.start')} · ${t(LEVEL_DESC_KEYS[level])}`
                          : `${t('heat.roadmap.pts')} ${threshold} · ${t(LEVEL_DESC_KEYS[level])}`}
                      </Text>
                    </View>
                  </MotiView>
                );
              })}
            </View>

            <View style={[styles.footer, { borderTopColor: theme.colors.divider }]}>
              <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
                {t('heat.roadmap.accumulated')} {currentPoints}
              </Text>
              {currentLevel === 5 ? (
                <Text style={[styles.maxText, { color: levelColors[5] }]}>{t('heat.roadmap.max')}</Text>
              ) : null}
            </View>
          </Pressable>
        </MotiView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    paddingBottom: 40,
  },
  sheet: {
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  closeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  levels: {
    gap: 8,
  },
  levelRow: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  indicator: {
    alignItems: 'center',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '800',
  },
  levelContent: {
    flex: 1,
    minWidth: 0,
  },
  levelTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 2,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  currentBadge: {
    borderRadius: 999,
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unlocked: {
    fontSize: 10,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
  },
  footer: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 12,
  },
  maxText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
