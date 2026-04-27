'use client';

import type { CSSProperties } from 'react';
import { DynamicIcon } from '../../utils/iconFromName';
import type { GainedCard } from '../../lib/computeGainedCards';

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
  const s = SIZE[size];
  const themeLabel = getThemeLabel(card);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: s.radius,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: flippedFace ? 'rotateY(180deg)' : undefined,
        background: card.gradient,
        boxShadow: `0 8px 32px ${card.border}66`,
        display: 'grid',
        gridTemplateRows: s.rows,
        justifyItems: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) ${s.dot}px, transparent ${s.dot}px)`,
          backgroundSize: s.dotGrid,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.18) 100%)',
        }}
      />
      {themeLabel && (
        <span
          style={{
            position: 'absolute',
            top: s.badgeTop,
            left: s.badgeLeft,
            minWidth: s.badgeMinWidth,
            height: s.badgeHeight,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: s.badgeGap,
            padding: size === 'mini' ? '0 7px' : '0 9px',
            background: 'rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
          }}
        >
          <DynamicIcon name={card.iconName} size={Number(s.badgeIcon)} color="rgba(255,255,255,0.50)" />
          <span
            style={{
              color: 'rgba(255,255,255,0.78)',
              fontSize: s.badgeFont,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              lineHeight: 1,
            }}
          >
            {themeLabel}
          </span>
        </span>
      )}
      {rarityLabel && (
        <div
          style={{
            position: 'absolute',
            top: s.badgeTop,
            right: s.badgeLeft,
            borderRadius: 6,
            padding: size === 'mini' ? '2px 5px' : '3px 6px',
            background: card.rarity === 'unique'
              ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
              : 'linear-gradient(135deg, #7c3aed, #a855f7)',
          }}
        >
          <span style={{ fontSize: s.rarityFont, fontWeight: 900, color: 'white', letterSpacing: 1 }}>
            {rarityLabel}
          </span>
        </div>
      )}
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          gridRow: '2',
          alignSelf: 'center',
          width: s.iconBox,
          height: s.iconBox,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(0,0,0,0.13)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.18)',
        }}
      >
        <DynamicIcon name={card.iconName} size={Number(s.icon)} color="white" />
      </span>
      <p
        style={{
          gridRow: '3',
          alignSelf: 'stretch',
          color: 'white',
          fontWeight: 800,
          fontSize: s.textFont,
          textAlign: 'center',
          lineHeight: s.textLine,
          padding: s.textPad,
          margin: s.textMargin,
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          placeItems: 'center',
          borderRadius: s.textRadius,
          background: 'linear-gradient(180deg, rgba(5,5,12,0.34), rgba(5,5,12,0.52))',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          textShadow: '0 2px 8px rgba(0,0,0,0.50)',
          overflow: 'hidden',
          overflowWrap: 'break-word',
          hyphens: 'auto',
        }}
      >
        {truncateCardText(card.text, s.maxText as number | null)}
      </p>
    </div>
  );
}
