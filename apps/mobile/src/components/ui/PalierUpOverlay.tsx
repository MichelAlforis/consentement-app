import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { DURATION } from '@ouiclair/core';
import type { HeatLevel } from '@ouiclair/core';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';
import { useHeat } from '../../context/HeatContext';
import { HeatThermometer } from './HeatThermometer';

const LEVEL_NAMES_KEY: Record<HeatLevel, string> = {
  1: 'heat.tiede',
  2: 'heat.chaud',
  3: 'heat.ardent',
  4: 'heat.brulant',
  5: 'heat.incandescent',
};

const UNLOCK_DESC_KEY: Record<HeatLevel, string | null> = {
  1: null,
  2: 'heat.palierUp_explicit',
  3: 'heat.palierUp_scenarios',
  4: 'heat.palierUp_kamasutra',
  5: 'heat.palierUp_expert',
};

const LEVEL_COLORS: Record<HeatLevel, string> = {
  1: '#60a5fa',
  2: '#f59e0b',
  3: '#f97316',
  4: '#ef4444',
  5: '#fbbf24',
};

interface PalierUpOverlayProps {
  level: HeatLevel;
  onDismiss: () => void;
}

export function PalierUpOverlay({ level, onDismiss }: PalierUpOverlayProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { points } = useHeat();

  const levelName = t(LEVEL_NAMES_KEY[level]);
  const unlockDescKey = UNLOCK_DESC_KEY[level];
  const unlockDesc = unlockDescKey ? t(unlockDescKey) : null;
  const fillColor = LEVEL_COLORS[level];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <MotiView
          from={{ translateY: 80, opacity: 0, scale: 0.96 }}
          animate={{ translateY: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          style={[
            styles.card,
            {
              backgroundColor: colors.bgCard,
              borderColor: `${fillColor}60`,
            },
          ]}
        >
          {/* En-tête : thermomètre + titre */}
          <View style={styles.header}>
            <HeatThermometer points={points} compact />
            <View style={styles.titleBlock}>
              <Text style={[styles.palierLabel, { color: fillColor }]}>
                {t('heat.palierUp', { palier: levelName })}
              </Text>
              <Text style={[styles.levelName, { color: colors.textPrimary }]}>
                {levelName}
              </Text>
            </View>
          </View>

          {/* Description du déblocage */}
          {unlockDesc && (
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                delay: 180,
                type: 'timing',
                duration: DURATION.medium * 1000,
              }}
              style={[
                styles.unlockBox,
                {
                  backgroundColor: `${fillColor}15`,
                  borderColor: `${fillColor}40`,
                },
              ]}
            >
              <Text style={[styles.unlockText, { color: fillColor }]}>{unlockDesc}</Text>
            </MotiView>
          )}

          {/* CTA */}
          <TouchableOpacity
            onPress={onDismiss}
            activeOpacity={0.85}
            style={[
              styles.cta,
              { backgroundColor: fillColor },
            ]}
          >
            <Text style={styles.ctaText}>{t('heat.palierUp_cta')}</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </Modal>
  );
}

const styles = {
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.70)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  titleBlock: {
    flex: 1,
  },
  palierLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  levelName: {
    fontSize: 24,
    fontWeight: '900',
  },
  unlockBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  unlockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cta: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
} as const;
