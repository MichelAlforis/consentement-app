'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { BOARD, BOARD_LAYOUT, getSquareBg, getSquareIconName, SQUARE_VISUAL } from '../../../../data/goose-game';
import type { SquareType } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';

const ROW_DIRECTIONS = ['→', '←', '→', '←', '→', '←'] as const;

const ISO_TRANSFORM = 'rotateX(58deg) rotateZ(45deg) scale(0.78)';

const SQUARE_DEPTH: Record<SquareType, number> = {
  normal:     8,
  depart:    12,
  arrivee:   16,
  accord:    14,
  complicite: 14,
  chance:    10,
  pause:     10,
};

// ─── PawnToken ────────────────────────────────────────────────────────────────

interface PawnTokenProps {
  emoji: string;
  color: string;
  isAnimating: boolean;
  isActive: boolean;
  pawnKey: string;
}

function PawnToken({ emoji, color, isAnimating, isActive, pawnKey }: PawnTokenProps) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pawnKey}
        initial={{ y: isAnimating ? -12 : 0, scale: 0.5, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.07 } }}
        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
        style={{ display: 'flex' }}
      >
        {/* Pulse au repos sur la case active */}
        <motion.div
          animate={!isAnimating && isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={!isAnimating && isActive
            ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.2 }
            : { duration: 0.15 }
          }
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: color,
            boxShadow: '0 3px 8px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            lineHeight: 1,
            transform: 'rotateZ(-45deg) rotateX(-45deg) scale(1.4)',
          }}
        >
          {emoji}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── BoardCell ────────────────────────────────────────────────────────────────

interface BoardCellProps {
  squareIndex: number;
  displayPos0: number;
  displayPos1: number;
  p0Emoji: string;
  p1Emoji: string;
  p0Color: string;
  p1Color: string;
  isActive: boolean;
  isAnimating: boolean;
  animatingPos: number | null;
}

function BoardCell({
  squareIndex, displayPos0, displayPos1,
  p0Emoji, p1Emoji, p0Color, p1Color,
  isActive, isAnimating, animatingPos,
}: BoardCellProps) {
  const square   = BOARD[squareIndex];
  const bg       = getSquareBg(square);
  const iconName = getSquareIconName(square);
  const hasP0    = displayPos0 === squareIndex;
  const hasP1    = displayPos1 === squareIndex;
  const depth    = SQUARE_DEPTH[square.type];

  const p0Key = `p0-${squareIndex}-${animatingPos ?? 'rest'}`;
  const p1Key = `p1-${squareIndex}-${animatingPos ?? 'rest'}`;

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
        {iconName && <DynamicIcon name={iconName} size={18} color="rgba(255,255,255,0.85)" />}

        {(hasP0 || hasP1) && (
          <div style={{ display: 'flex', gap: 3, marginTop: iconName ? 2 : 0 }}>
            {hasP0 && (
              <PawnToken
                emoji={p0Emoji}
                color={p0Color}
                isAnimating={isAnimating}
                isActive={isActive}
                pawnKey={p0Key}
              />
            )}
            {hasP1 && (
              <PawnToken
                emoji={p1Emoji}
                color={p1Color}
                isAnimating={isAnimating}
                isActive={isActive}
                pawnKey={p1Key}
              />
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
  p0Color: string;
  p1Color: string;
  activeSquare: number;
  isAnimating: boolean;
  animatingPos: number | null;
}

export function BoardGrid({
  displayPos0, displayPos1,
  p0Emoji, p1Emoji, p0Color, p1Color,
  activeSquare, isAnimating, animatingPos,
}: BoardGridProps) {
  return (
    <div style={{ overflowX: 'hidden', width: '100%', perspective: '800px' }}>
    <div className="mx-auto" style={{ maxWidth: 380, padding: '8px 16px 48px' }}>
      <div style={{ transform: ISO_TRANSFORM, transformStyle: 'preserve-3d', transformOrigin: 'center center', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          inset: -22,
          background: 'linear-gradient(145deg, #4a2010 0%, #2e1208 55%, #1c0a05 100%)',
          borderRadius: 18,
          border: '1.5px solid rgba(200,130,50,0.45)',
          boxShadow: '0 0 28px rgba(160,80,20,0.45), inset 0 0 40px rgba(0,0,0,0.5)',
        }} />
        {[...BOARD_LAYOUT].reverse().map((row, rowIndex) => {
          const origRowIndex = BOARD_LAYOUT.length - 1 - rowIndex;
          return (
          <div key={rowIndex} style={{ marginBottom: 5, transformStyle: 'preserve-3d' }}>
            <div
              style={{
                fontSize: 9,
                color: 'rgba(255,255,255,0.28)',
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 3,
                textAlign: ROW_DIRECTIONS[origRowIndex] === '→' ? 'right' : 'left',
                paddingRight: ROW_DIRECTIONS[origRowIndex] === '→' ? 4 : 0,
                paddingLeft: ROW_DIRECTIONS[origRowIndex] === '←' ? 4 : 0,
              }}
            >
              {ROW_DIRECTIONS[origRowIndex]}
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
                  p0Color={p0Color}
                  p1Color={p1Color}
                  isActive={squareIndex === activeSquare}
                  isAnimating={isAnimating}
                  animatingPos={animatingPos}
                />
              ))}
            </div>
          </div>
          );
        })}
      </div>
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
