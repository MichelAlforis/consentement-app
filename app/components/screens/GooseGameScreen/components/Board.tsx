'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { BOARD, BOARD_LAYOUT, getSquareBg, getSquareIconName, SQUARE_VISUAL } from '../../../../data/goose-game';
import type { SquareType } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';

const ISO_TRANSFORM = 'rotateX(58deg) rotateZ(45deg) scale(0.78)';

// ─── PawnToken ────────────────────────────────────────────────────────────────

interface PawnTokenProps {
  emoji: string;
  color: string;
  isAnimating: boolean;
  isActive: boolean;
  pawnKey: string;
  pawnId: string;
}

function PawnToken({ emoji, color, isAnimating, pawnKey, pawnId }: PawnTokenProps) {
  const gId = `pg-${pawnId}`;
  const hId = `ph-${pawnId}`;
  const sId = `ps-${pawnId}`;
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pawnKey}
        initial={{ y: isAnimating ? -12 : 0, scale: 0.5, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.07 } }}
        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
        style={{ display: 'flex', filter: 'drop-shadow(0 4px 7px rgba(0,0,0,0.75))' }}
      >
        <svg width="75" height="75" viewBox="0 0 75 75">
          <defs>
            <radialGradient id={gId} cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor={color} />
              <stop offset="100%" stopColor="#3d1800" />
            </radialGradient>
            <radialGradient id={hId} cx="33%" cy="26%" r="32%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={sId} cx="50%" cy="88%" r="42%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="37.5" cy="37.5" r="35" fill={`url(#${gId})`} />
          <circle cx="37.5" cy="37.5" r="35" fill={`url(#${sId})`} />
          <circle cx="37.5" cy="37.5" r="35" fill={`url(#${hId})`} />
          <text x="37.5" y="38.5" textAnchor="middle" dominantBaseline="middle" fontSize="26">
            {emoji}
          </text>
        </svg>
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

  const p0Key = `p0-${squareIndex}-${animatingPos ?? 'rest'}`;
  const p1Key = `p1-${squareIndex}-${animatingPos ?? 'rest'}`;

  return (
    <div style={{ position: 'relative' }}>
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
          border: isActive
            ? '2px solid rgba(255,255,255,0.95)'
            : '1.5px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {iconName && <DynamicIcon name={iconName} size={18} color="rgba(255,255,255,0.85)" />}
      </motion.div>

      {/* Pions HORS du motion.div — immunisés contre le scale de la case */}
      {(hasP0 || hasP1) && (
        <div style={{ position: 'absolute', bottom: -4, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, pointerEvents: 'none' }}>
          {hasP0 && (
            <div style={{ transform: hasP1 ? 'translateX(-10px)' : 'none', zIndex: 2 }}>
              <PawnToken
                emoji={p0Emoji}
                color={p0Color}
                isAnimating={isAnimating}
                isActive={isActive}
                pawnKey={p0Key}
                pawnId={`p0-${squareIndex}`}
              />
            </div>
          )}
          {hasP1 && (
            <div style={{ transform: hasP0 ? 'translateX(10px)' : 'none', zIndex: 1 }}>
              <PawnToken
                emoji={p1Emoji}
                color={p1Color}
                isAnimating={isAnimating}
                isActive={isActive}
                pawnKey={p1Key}
                pawnId={`p1-${squareIndex}`}
              />
            </div>
          )}
        </div>
      )}
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
    <div style={{ overflowX: 'hidden', width: '100%' }}>
    <div className="mx-auto" style={{ maxWidth: 380, padding: '8px 16px 48px', perspective: '800px' }}>
      <div style={{ transform: ISO_TRANSFORM, transformStyle: 'preserve-3d', transformOrigin: 'center center', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          inset: -22,
          background: `
            repeating-linear-gradient(
              89deg,
              transparent 0px, transparent 3px,
              rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 4px
            ),
            repeating-linear-gradient(
              86deg,
              transparent 0px, transparent 9px,
              rgba(255,255,255,0.14) 9px, rgba(255,255,255,0.14) 11px
            ),
            repeating-linear-gradient(
              91deg,
              transparent 0px, transparent 18px,
              rgba(0,0,0,0.18) 18px, rgba(0,0,0,0.18) 20px
            ),
            linear-gradient(145deg, #c45628 0%, #8a3418 50%, #582210 100%)
          `.replace(/\s+/g, ' '),
          borderRadius: 18,
          border: '2px solid rgba(240,170,60,0.85)',
          boxShadow: '0 0 18px rgba(240,160,40,0.55), 0 0 40px rgba(200,100,20,0.25), inset 0 0 30px rgba(0,0,0,0.45)',
        }} />
        {[...BOARD_LAYOUT].reverse().map((row, rowIndex) => (
          <div key={rowIndex} style={{ marginBottom: 5, transformStyle: 'preserve-3d' }}>
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
        ))}
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
