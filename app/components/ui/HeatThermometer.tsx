'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { DURATION } from '../../constants/motion';
import { TYPE } from '../../constants/tokens';
import {
  getHeatLevel,
  heatLevelProgress,
  pointsToNextLevel,
  HEAT_THRESHOLDS,
} from '../../lib/heatLevel';
import type { HeatLevel } from '../../lib/heatLevel';

interface HeatThermometerProps {
  points: number;
  /** Mode compact : SVG seul, sans labels (pour overlay et header) */
  compact?: boolean;
  /** Mode sidebar : SVG fluide (width/height 100%) qui remplit son conteneur */
  sidebar?: boolean;
  /** Callback optionnel — rend le composant tappable */
  onPress?: () => void;
}

const LEVEL_NAMES: Record<HeatLevel, string> = {
  1: 'heat.tiede',
  2: 'heat.chaud',
  3: 'heat.ardent',
  4: 'heat.brulant',
  5: 'heat.incandescent',
};

// Paliers 2–5 : palette feu universelle (la chaleur transcende le thème)
const FIRE_COLORS: Record<2 | 3 | 4 | 5, string> = {
  2: '#f59e0b',
  3: '#f97316',
  4: '#ef4444',
  5: '#fbbf24',
};

// Gradient [bas → haut] pour les paliers feu
const FIRE_GRADIENTS: Record<2 | 3 | 4 | 5, [string, string]> = {
  2: ['#d97706', '#fde68a'],
  3: ['#c2410c', '#fed7aa'],
  4: ['#b91c1c', '#fecaca'],
  5: ['#92400e', '#fef9c3'],
};

// Dimensions normales / compactes / sidebar (viewBox, CSS scale ensuite)
const N = { tw: 12, th:  80, br: 11 } as const;
const C = { tw:  9, th:  60, br:  9 } as const;
const S = { tw: 14, th: 240, br: 14 } as const;

type D = { tw: number; th: number; br: number };
type Dims = D & { sw: number; sh: number; tx: number; bulbCY: number };

function getDims(compact: boolean, sidebar: boolean): Dims {
  const d: D = sidebar ? S : compact ? C : N;
  const sw = d.br * 2;
  return { ...d, sw, sh: d.th + d.br * 2, tx: (sw - d.tw) / 2, bulbCY: d.th + d.br };
}

const TICK_LVLS = [2, 3, 4] as const;

export function HeatThermometer({ points, compact = false, sidebar = false, onPress }: HeatThermometerProps) {
  const rawId = useId();
  const uid   = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const { colors } = useTheme();
  const { t }      = useTranslation();
  const reduced    = useReducedMotion();

  const level    = getHeatLevel(points);
  const progress = heatLevelProgress(points);
  const toNext   = pointsToNextLevel(points);
  const levelName = t(LEVEL_NAMES[level]);
  const isMax     = level === 5;

  // Palier 1 (Tiède) = accent du thème courant — chaque univers démarre depuis son propre "neutre".
  // Paliers 2–5 = palette feu universelle (la chaleur transcende le thème).
  const color              = level === 1 ? colors.accent       : FIRE_COLORS[level];
  const [gFrom, gTo]: [string, string] =
    level === 1 ? [colors.accent, colors.accentLight] : FIRE_GRADIENTS[level];

  const { tw, th, br, sw, sh, tx, bulbCY } = getDims(compact, sidebar);

  // Le remplissage couvre toujours le bulbe entier + la portion de tube selon la progression
  const fillH = br * 2 + progress * th;

  const clipId = `tc${uid}`;
  const gradId = `tg${uid}`;
  const shimId = `ts${uid}`;

  const spring = { type: 'spring' as const, stiffness: 90, damping: 18 };
  const trans  = reduced ? { duration: 0 } : spring;

  const Wrapper = onPress ? motion.button : motion.div;

  return (
    <Wrapper
      className={sidebar ? 'h-full w-full flex items-center justify-center' : 'flex items-end gap-2'}
      role={onPress ? 'button' : 'meter'}
      aria-label={`Baromètre du Hot : ${levelName}`}
      aria-valuenow={points}
      aria-valuemin={0}
      aria-valuemax={HEAT_THRESHOLDS[5]}
      onClick={onPress}
      whileTap={onPress ? { scale: 0.93 } : undefined}
      style={onPress ? { cursor: 'pointer', background: 'none', border: 'none', padding: 0 } : undefined}
    >
      {/* ── SVG thermomètre ── */}
      <svg
        width={sidebar ? '100%' : sw}
        height={sidebar ? '100%' : sh}
        viewBox={`0 0 ${sw} ${sh}`}
        preserveAspectRatio={sidebar ? 'xMidYMax meet' : undefined}
        overflow="visible"
        style={{
          filter: level >= 2 ? `drop-shadow(0 0 ${compact ? 3 : sidebar ? 7 : 5}px ${color}99)` : 'none',
          transition: `filter ${DURATION.medium}s`,
        }}
      >
        <defs>
          {/* Silhouette thermomètre = tube + bulbe */}
          <clipPath id={clipId}>
            <rect x={tx} y={0} width={tw} height={th + br} rx={tw / 2} />
            <circle cx={sw / 2} cy={bulbCY} r={br} />
          </clipPath>

          {/* Dégradé thermique bas → haut */}
          <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor={gFrom} />
            <stop offset="100%" stopColor={gTo}   />
          </linearGradient>

          {/* Dégradé pour le reflet shimmer */}
          <linearGradient id={shimId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="white" stopOpacity="0"    />
            <stop offset="50%"  stopColor="white" stopOpacity="0.45" />
            <stop offset="100%" stopColor="white" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Fond du tube */}
        <g clipPath={`url(#${clipId})`}>
          <rect x={0} y={0} width={sw} height={sh} fill={colors.bgSecondary} />
        </g>

        {/* Remplissage animé — monte depuis le bas
            y + height = sh est invariant pendant l'animation (même spring sur y et height) */}
        <g clipPath={`url(#${clipId})`}>
          <motion.rect
            x={0}
            width={sw}
            initial={{ y: sh,          height: 0     }}
            animate={{ y: sh - fillH,  height: fillH }}
            transition={trans}
            fill={`url(#${gradId})`}
          />
        </g>

        {/* Reflet vitré — ligne blanche sur le bord gauche du tube (effet verre) */}
        <line
          x1={tx + 2.5} y1={4}
          x2={tx + 2.5} y2={th - 8}
          stroke="white" strokeWidth={1}
          strokeOpacity={0.22} strokeLinecap="round"
        />

        {/* Reflet dans le bulbe */}
        <circle
          cx={sw / 2 - br * 0.3}
          cy={bulbCY  - br * 0.3}
          r={br * 0.22}
          fill="white" fillOpacity={0.28}
        />

        {/* Shimmer continu niveau Incandescent */}
        {level === 5 && !reduced && (
          <g clipPath={`url(#${clipId})`}>
            <motion.rect
              y={0} width={sw * 0.6} height={sh}
              fill={`url(#${shimId})`}
              initial={{ x: -(sw * 0.6) }}
              animate={{ x: sw * 1.6   }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
            />
          </g>
        )}

        {/* Bordure du tube */}
        <rect
          x={tx} y={0} width={tw} height={th + br} rx={tw / 2}
          fill="none" stroke={colors.border} strokeWidth={1.5}
        />
        {/* Bordure du bulbe */}
        <circle
          cx={sw / 2} cy={bulbCY} r={br}
          fill="none" stroke={colors.border} strokeWidth={1.5}
        />

        {/* Graduations paliers 2–4 (normal + sidebar, pas compact) */}
        {!compact && TICK_LVLS.map((lvl) => {
          const tyPos    = (1 - HEAT_THRESHOLDS[lvl] / HEAT_THRESHOLDS[5]) * th;
          const unlocked = level >= lvl;
          return (
            <line
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
      </svg>

      {/* Labels (normal uniquement — masqués en compact et sidebar) */}
      {!compact && !sidebar && (
        <div className="flex flex-col justify-end pb-0.5" style={{ gap: 2 }}>
          <span
            className="font-semibold"
            style={{ fontSize: TYPE.sm, color, lineHeight: 1.2 }}
          >
            {levelName}
          </span>
          <span style={{ fontSize: TYPE.xs, color: colors.textMuted, lineHeight: 1.2 }}>
            {isMax
              ? t('heat.max_reached')
              : t('heat.points_to_next', {
                  n: String(toNext),
                  palier: t(LEVEL_NAMES[(level + 1) as HeatLevel]),
                })}
          </span>
        </div>
      )}
    </Wrapper>
  );
}
