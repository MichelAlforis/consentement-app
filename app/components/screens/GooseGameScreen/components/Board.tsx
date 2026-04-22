'use client';
import { motion } from 'framer-motion';
import { BOARD, BOARD_LAYOUT, getSquareBg, getSquareEmoji, SQUARE_VISUAL } from '../../../../data/goose-game';

// Sens de parcours par rangée (serpentin 6 lignes, alternance →/←)
const ROW_DIRECTIONS = ['→', '←', '→', '←', '→', '←'] as const;

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
  const square = BOARD[squareIndex];
  const bg     = getSquareBg(square);
  const emoji  = getSquareEmoji(square);
  const hasP0  = displayPos0 === squareIndex;
  const hasP1  = displayPos1 === squareIndex;

  return (
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
        overflow: 'hidden',
      }}
      className="flex flex-col items-center justify-center gap-0.5"
    >
      {/* Emoji catégorie / type */}
      <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>

      {/* Pions */}
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
              }}
            >
              {p1Emoji}
            </motion.span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── BoardGrid — Option B : serpentin avec flèches de direction ───────────────

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
    <div className="mx-auto px-2" style={{ maxWidth: 340 }}>
      {BOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} style={{ marginBottom: 5 }}>
          {/* Flèche de direction */}
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

          {/* Ligne de cases */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
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
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
            {SQUARE_VISUAL[type].emoji} {SQUARE_VISUAL[type].label}
          </span>
        </div>
      ))}
    </div>
  );
}
