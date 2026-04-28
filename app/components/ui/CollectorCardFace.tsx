'use client';

import type { CSSProperties } from 'react';
import { DynamicIcon } from '../../utils/iconFromName';
import type { GainedCard } from '../../lib/computeGainedCards';
import s from './CollectorCardFace.module.css';

type CollectorCardFaceSize = 'mini' | 'compact' | 'full';

interface CollectorCardFaceProps {
  card: GainedCard;
  rarityLabel?: string | null;
  size?: CollectorCardFaceSize;
  flippedFace?: boolean;
  className?: string;
  style?: CSSProperties;
}

const SIZE = {
  mini: {
    radius: 16,
    rows: '32px 1fr 56px',
    dot: 1.2,
    dotGrid: '10px 10px',
    badgeTop: 7,
    badgeLeft: 7,
    badgeHeight: 22,
    badgeMinWidth: 58,
    badgeIcon: 9,
    badgeFont: 6,
    badgeGap: 4,
    rarityFont: 6,
    iconBox: 34,
    icon: 22,
    textFont: 8,
    textLine: 1.12,
    textPad: '7px 8px',
    textMargin: '0 7px 8px',
    textRadius: 9,
    maxText: 54,
  },
  compact: {
    radius: 14,
    rows: '34px 1fr 92px',
    dot: 1,
    dotGrid: '9px 9px',
    badgeTop: 8,
    badgeLeft: 8,
    badgeHeight: 21,
    badgeMinWidth: 48,
    badgeIcon: 12,
    badgeFont: 6.5,
    badgeGap: 3,
    rarityFont: 6,
    iconBox: 44,
    icon: 27,
    textFont: 10,
    textLine: 1.15,
    textPad: '9px 10px',
    textMargin: '0 7px 8px',
    textRadius: 10,
    maxText: 86,
  },
  full: {
    radius: 20,
    rows: '46px 1fr 122px',
    dot: 1.5,
    dotGrid: '12px 12px',
    badgeTop: 12,
    badgeLeft: 12,
    badgeHeight: 28,
    badgeMinWidth: 76,
    badgeIcon: 14,
    badgeFont: 9,
    badgeGap: 5,
    rarityFont: 8,
    iconBox: 66,
    icon: 40,
    textFont: 14,
    textLine: 1.22,
    textPad: '14px 18px',
    textMargin: '0 12px 14px',
    textRadius: 14,
    maxText: null,
  },
} satisfies Record<CollectorCardFaceSize, Record<string, string | number | null>>;

function getThemeLabel(card: GainedCard) {
  return card.themeName ?? card.theme ?? '';
}

function truncateCardText(text: string, max: number | null) {
  return max && text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

export function CollectorCardFace({
  card,
  rarityLabel,
  size = 'compact',
  flippedFace = false,
  className,
  style,
}: CollectorCardFaceProps) {
  const v = SIZE[size];
  const themeLabel = getThemeLabel(card);

  return (
    <div
      className={`${s.face}${className ? ` ${className}` : ''}`}
      style={{
        '--ccf-radius': `${v.radius}px`,
        '--ccf-rows': v.rows,
        '--ccf-dot': `${v.dot}px`,
        '--ccf-dot-grid': v.dotGrid,
        '--ccf-badge-top': `${v.badgeTop}px`,
        '--ccf-badge-left': `${v.badgeLeft}px`,
        '--ccf-badge-h': `${v.badgeHeight}px`,
        '--ccf-badge-min-w': `${v.badgeMinWidth}px`,
        '--ccf-badge-gap': `${v.badgeGap}px`,
        '--ccf-badge-pad': size === 'mini' ? '0 7px' : '0 9px',
        '--ccf-badge-font': `${v.badgeFont}px`,
        '--ccf-rarity-pad': size === 'mini' ? '2px 5px' : '3px 6px',
        '--ccf-rarity-font': `${v.rarityFont}px`,
        '--ccf-icon-box': `${v.iconBox}px`,
        '--ccf-text-font': `${v.textFont}px`,
        '--ccf-text-line': v.textLine,
        '--ccf-text-pad': v.textPad,
        '--ccf-text-margin': v.textMargin,
        '--ccf-text-radius': `${v.textRadius}px`,
        background: card.gradient,
        boxShadow: `0 8px 32px ${card.border}66`,
        transform: flippedFace ? 'rotateY(180deg)' : undefined,
        ...style,
      } as CSSProperties}
    >
      <div className={s.dotPattern} />
      <div className={s.topGradient} />

      {themeLabel && (
        <span className={s.badge}>
          <DynamicIcon name={card.iconName} size={Number(v.badgeIcon)} color="rgba(255,255,255,0.50)" />
          <span className={s.badgeLabel}>{themeLabel}</span>
        </span>
      )}

      {rarityLabel && (
        <div className={`${s.rarityBadge} ${card.rarity === 'unique' ? s.rarityUnique : s.rarityCommonRare}`}>
          <span className={s.rarityBadgeLabel}>{rarityLabel}</span>
        </div>
      )}

      <span className={s.iconBox}>
        <DynamicIcon name={card.iconName} size={Number(v.icon)} color="white" />
      </span>

      <p className={s.textPanel}>
        {truncateCardText(card.text, v.maxText as number | null)}
      </p>
    </div>
  );
}
