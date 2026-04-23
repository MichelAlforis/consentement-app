'use client';
import { motion } from 'framer-motion';
import { BOARD, BOARD_LAYOUT, getSquareBg, getSquareIconName, SQUARE_VISUAL } from '../../../../data/goose-game';
import type { SquareType } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';

const ROW_DIRECTIONS = ['→', '←', '→', '←', '→', '←'] as const;

const ISO_TRANSFORM = 'rotateX(45deg) rotateZ(45deg) scale(0.82)';

const SQUARE_DEPTH: Record<SquareType, number> = {
  normal:     8,
  depart:    12,
  arrivee:   16,
  accord:    14,
  complicite: 14,
  chance:    10,
  pause:     10,
};

// ─── BoardCell ────────────────────────────────────────────────────────────────

interface BoardCellProps {
  squareIndex: number;
  displayPos0: number;
  displayPos1: number;
  p0Emoji: string;
  p1Emoji: string;
  isActive: boolean;
  isAnimating: boolean;
}

function BoardCell({ squareIndex, displayPos0, displayPos1, p0Emoji, p1Emoji, isActive, isAnimating }: BoardCellProps) {
  const square  = BOARD[squareIndex];
  const bg      = getSquareBg(square);
  const iconName = getSquareIconName(square);
  const hasP0   = displayPos0 === squareIndex;
  const hasP1   = displayPos1 === squareIndex;
  const depth   = SQUARE_DEPTH[square.type];

  return (
    <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
      <motion.div
        animate={
          isAnimating && isActive
            ? { scale: [1, 1.2, 1], boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.85)', '0 0 0px rgba(255,255,255,0)'] }
            : isActive
            ? { scale: [1, 1.07, 1] }
            : { scale: 1 }
        }
        transition={
          isActive
            ? { duration: isAnimating ? 0.28 : 0.8, repeat: isAnimating ? 0 : Infinity, repeatType: 'loop' }
            : {}
        }
        style={{
          background: bg || 'rgba(255,255,255,0.06)',
          borderRadius: 10,
          height: 68,
          position: 'relative',
          border: isActive
            ? '2px solid rgba(255,255,255,0.95)'
            : '1.5px solid rgba(255,255,255,0.1)',
        }}
        className="flex flex-col items-center justify-center gap-0.5"
      >
        {iconName && <DynamicIcon name={iconName} size={20} color="rgba(255,255,255,0.85)" />}

        {(hasP0 || hasP1) && (
          <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
            {hasP0 && (
              <motion.span
                layoutId="pawn-0"
                style={{
                  fontSize: 14,
                  background: 'rgba(255,255,255,0.22)',
                  borderRadius: 6,
                  padding: '1px 3px',
                  lineHeight: 1,
                  display: 'block',
                  transform: 'rotateZ(-45deg) rotateX(-45deg) scale(1.4)',
                }}
              >
                {p0Emoji}
              </motion.span>
            )}
            {hasP1 && (
              <motion.span
                layoutId="pawn-1"
                style={{
                  fontSize: 14,
                  background: 'rgba(255,255,255,0.22)',
                  borderRadius: 6,
                  padding: '1px 3px',
                  lineHeight: 1,
                  display: 'block',
                  transform: 'rotateZ(-45deg) rotateX(-45deg) scale(1.4)',
                }}
              >
                {p1Emoji}
              </motion.span>
            )}
          </div>
        )}
      </motion.div>

      {/* Face inférieure — ombre */}
      <div style={{
        position: 'absolute',
        left: 0,
        bottom: -depth,
        width: '100%',
        height: depth,
        background: 'rgba(0,0,0,0.4)',
        transform: 'rotateX(-90deg)',
        transformOrigin: 'bottom center',
      }} />

      {/* Face droite — reflet */}
      <div style={{
        position: 'absolute',
        right: -depth,
        top: 0,
        width: depth,
        height: '100%',
        background: 'rgba(255,255,255,0.12)',
        transform: 'rotateY(90deg)',
        transformOrigin: 'right center',
      }} />
    </div>
  );
}

// ─── BoardGrid ────────────────────────────────────────────────────────────────

interface BoardGridProps {
  displayPos0: number;
  displayPos1: number;
  p0Emoji: string;
  p1Emoji: string;
  activeSquare: number;
  isAnimating: boolean;
}

export function BoardGrid({ displayPos0, displayPos1, p0Emoji, p1Emoji, activeSquare, isAnimating }: BoardGridProps) {
  return (
    <div className="mx-auto" style={{ maxWidth: 420, padding: '8px 8px 48px' }}>
      <div style={{ transform: ISO_TRANSFORM, transformStyle: 'preserve-3d', transformOrigin: 'center center', position: 'relative' }}>
        {/* Surface du plateau */}
        <div style={{
          position: 'absolute',
          inset: -22,
          background: 'linear-gradient(145deg, #3b1078 0%, #1e0a4a 40%, #130730 100%)',
          borderRadius: 18,
          border: '1.5px solid rgba(160,100,255,0.3)',
          boxShadow: '0 0 32px rgba(120,50,220,0.4), inset 0 0 40px rgba(0,0,0,0.5)',
        }} />
        {BOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} style={{ marginBottom: 5, transformStyle: 'preserve-3d' }}>
            <div
              style={{
                fontSize: 9,
                color: 'rgba(255,255,255,0.28)',
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 3,
                textAlign: ROW_DIRECTIONS[rowIndex] === '→' ? 'right' : 'left',
                paddingRight: ROW_DIRECTIONS[rowIndex] === '→' ? 4 : 0,
                paddingLeft: ROW_DIRECTIONS[rowIndex] === '←' ? 4 : 0,
              }}
            >
              {ROW_DIRECTIONS[rowIndex]}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, transformStyle: 'preserve-3d' }}>
              {row.map(squareIndex => (
                <BoardCell
                  key={squareIndex}
                  squareIndex={squareIndex}
                  displayPos0={displayPos0}
                  displayPos1={displayPos1}
                  p0Emoji={p0Emoji}
                  p1Emoji={p1Emoji}
                  isActive={squareIndex === activeSquare}
                  isAnimating={isAnimating}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

export function Legend() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap mt-2 px-4">
      {(['pause', 'chance', 'accord', 'complicite'] as const).map(type => (
        <div key={type} className="flex items-center gap-1.5">
          <span style={{
            display: 'inline-block',
            width: 10, height: 10,
            borderRadius: 3,
            background: SQUARE_VISUAL[type].bg,
          }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
            {SQUARE_VISUAL[type].iconName && <DynamicIcon name={SQUARE_VISUAL[type].iconName} size={9} color="rgba(255,255,255,0.45)" />} {SQUARE_VISUAL[type].label}
          </span>
        </div>
      ))}
    </div>
  );
}
