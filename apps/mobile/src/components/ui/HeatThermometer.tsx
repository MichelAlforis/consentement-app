import { useId, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, {
  Defs,
  ClipPath,
  Rect,
  Circle,
  LinearGradient,
  Stop,
  Line,
  G,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import {
  getHeatLevel,
  heatLevelProgress,
  pointsToNextLevel,
  HEAT_THRESHOLDS,
  TYPE,
} from '@ouiclair/core';
import type { HeatLevel } from '@ouiclair/core';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const LEVEL_NAMES: Record<HeatLevel, string> = {
  1: 'heat.tiede',
  2: 'heat.chaud',
  3: 'heat.ardent',
  4: 'heat.brulant',
  5: 'heat.incandescent',
};

const FIRE_COLORS: Record<2 | 3 | 4 | 5, string> = {
  2: '#f59e0b',
  3: '#f97316',
  4: '#ef4444',
  5: '#fbbf24',
};

const FIRE_GRADIENTS: Record<2 | 3 | 4 | 5, [string, string]> = {
  2: ['#d97706', '#fde68a'],
  3: ['#c2410c', '#fed7aa'],
  4: ['#b91c1c', '#fecaca'],
  5: ['#92400e', '#fef9c3'],
};

const N = { tw: 12, th: 80, br: 11 } as const;
const C = { tw: 9, th: 60, br: 9 } as const;
const S = { tw: 14, th: 240, br: 14 } as const;

type Dims = { tw: number; th: number; br: number; sw: number; sh: number; tx: number; bulbCY: number };

function getDims(compact: boolean, sidebar: boolean): Dims {
  const d = sidebar ? S : compact ? C : N;
  const sw = d.br * 2;
  return { ...d, sw, sh: d.th + d.br * 2, tx: (sw - d.tw) / 2, bulbCY: d.th + d.br };
}

const TICK_LVLS = [2, 3, 4] as const;

interface HeatThermometerProps {
  points: number;
  compact?: boolean;
  sidebar?: boolean;
  onPress?: () => void;
}

export function HeatThermometer({ points, compact = false, sidebar = false, onPress }: HeatThermometerProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const { colors } = useTheme();
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  const level = getHeatLevel(points);
  const progress = heatLevelProgress(points);
  const toNext = pointsToNextLevel(points);
  const levelName = t(LEVEL_NAMES[level]);
  const isMax = level === 5;

  const color = level === 1 ? colors.accent : FIRE_COLORS[level];
  const [gFrom, gTo]: [string, string] =
    level === 1 ? [colors.accent, colors.accentLight ?? colors.accent] : FIRE_GRADIENTS[level];

  const { tw, th, br, sw, sh, tx, bulbCY } = getDims(compact, sidebar);

  const targetFillH = br * 2 + progress * th;
  const targetFillY = sh - targetFillH;

  const fillY = useSharedValue(sh);
  const fillH = useSharedValue(0);

  const shimX = useSharedValue(-(sw * 0.6));

  useEffect(() => {
    const spring = { stiffness: 90, damping: 18 };
    if (reduced) {
      fillY.value = targetFillY;
      fillH.value = targetFillH;
    } else {
      fillY.value = withSpring(targetFillY, spring);
      fillH.value = withSpring(targetFillH, spring);
    }
  }, [fillY, fillH, targetFillY, targetFillH, reduced]);

  useEffect(() => {
    if (level !== 5 || reduced) return;
    shimX.value = withRepeat(
      withSequence(
        withDelay(2500, withTiming(sw * 1.6, { duration: 1600, easing: Easing.inOut(Easing.ease) })),
        withTiming(-(sw * 0.6), { duration: 0 }),
      ),
      -1,
    );
  }, [shimX, level, reduced, sw]);

  const fillProps = useAnimatedProps(() => ({
    y: fillY.value,
    height: fillH.value,
  }));

  const shimProps = useAnimatedProps(() => ({
    x: shimX.value,
  }));

  const clipId = `tc${uid}`;
  const gradId = `tg${uid}`;
  const shimId = `ts${uid}`;

  const svgWidth = sidebar ? '100%' : sw;
  const svgHeight = sidebar ? '100%' : sh;

  // TODO: drop-shadow filter non supporté dans react-native-svg — approximé via shadowColor sur le wrapper
  const shadowStyle = level >= 2
    ? {
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: compact ? 3 : sidebar ? 7 : 5,
        elevation: compact ? 3 : sidebar ? 7 : 5,
      }
    : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        sidebar
          ? styles.wrapperSidebar
          : styles.wrapperRow,
        shadowStyle,
      ]}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessible
      accessibilityLabel={`Baromètre du Hot : ${levelName}`}
      accessibilityValue={{ min: 0, max: HEAT_THRESHOLDS[5], now: points }}
    >
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${sw} ${sh}`}
        preserveAspectRatio={sidebar ? 'xMidYMax meet' : undefined}
        style={sidebar ? { flex: 1 } : undefined}
      >
        <Defs>
          <ClipPath id={clipId}>
            <Rect x={tx} y={0} width={tw} height={th + br} rx={tw / 2} />
            <Circle cx={sw / 2} cy={bulbCY} r={br} />
          </ClipPath>
          <LinearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0%" stopColor={gFrom} />
            <Stop offset="100%" stopColor={gTo} />
          </LinearGradient>
          <LinearGradient id={shimId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="white" stopOpacity={0} />
            <Stop offset="50%" stopColor="white" stopOpacity={0.45} />
            <Stop offset="100%" stopColor="white" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Fond du tube */}
        <G clipPath={`url(#${clipId})`}>
          <Rect x={0} y={0} width={sw} height={sh} fill={colors.bgSecondary} />
        </G>

        {/* Remplissage animé */}
        <G clipPath={`url(#${clipId})`}>
          <AnimatedRect x={0} width={sw} fill={`url(#${gradId})`} animatedProps={fillProps} />
        </G>

        {/* Reflet vitré tube */}
        <Line
          x1={tx + 2.5} y1={4}
          x2={tx + 2.5} y2={th - 8}
          stroke="white" strokeWidth={1}
          strokeOpacity={0.22} strokeLinecap="round"
        />

        {/* Reflet bulbe */}
        <Circle
          cx={sw / 2 - br * 0.3}
          cy={bulbCY - br * 0.3}
          r={br * 0.22}
          fill="white" fillOpacity={0.28}
        />

        {/* Shimmer Incandescent */}
        {level === 5 && !reduced && (
          <G clipPath={`url(#${clipId})`}>
            <AnimatedRect
              y={0} width={sw * 0.6} height={sh}
              fill={`url(#${shimId})`}
              animatedProps={shimProps}
            />
          </G>
        )}

        {/* Bordure tube */}
        <Rect
          x={tx} y={0} width={tw} height={th + br} rx={tw / 2}
          fill="none" stroke={colors.border} strokeWidth={1.5}
        />
        {/* Bordure bulbe */}
        <Circle
          cx={sw / 2} cy={bulbCY} r={br}
          fill="none" stroke={colors.border} strokeWidth={1.5}
        />

        {/* Graduations paliers 2–4 */}
        {!compact && TICK_LVLS.map((lvl) => {
          const tyPos = (1 - HEAT_THRESHOLDS[lvl] / HEAT_THRESHOLDS[5]) * th;
          const unlocked = level >= lvl;
          return (
            <Line
              key={lvl}
              x1={tx - 1.5} y1={tyPos}
              x2={tx - 5.5} y2={tyPos}
              stroke={unlocked ? color : colors.border}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={unlocked ? 0.85 : 0.35}
            />
          );
        })}
      </Svg>

      {/* Labels (normal uniquement) */}
      {!compact && !sidebar && (
        <View style={styles.labels}>
          <Text style={[styles.levelName, { fontSize: TYPE.sm, color }]}>
            {levelName}
          </Text>
          <Text style={[styles.subLabel, { fontSize: TYPE.xs, color: colors.textMuted }]}>
            {isMax
              ? t('heat.max_reached')
              : t('heat.points_to_next', {
                  n: String(toNext),
                  palier: t(LEVEL_NAMES[(level + 1) as HeatLevel]),
                })}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = {
  wrapperRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  wrapperSidebar: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labels: {
    justifyContent: 'flex-end',
    paddingBottom: 2,
    gap: 2,
  },
  levelName: {
    fontWeight: '600',
    lineHeight: 15,
  },
  subLabel: {
    lineHeight: 13,
  },
} as const;
