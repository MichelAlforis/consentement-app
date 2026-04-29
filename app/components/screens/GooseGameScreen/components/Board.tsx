'use client';
import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { BOARD, BOARD_LAYOUT, getSquareBg, getSquareIconName, SQUARE_VISUAL } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';
import type { IconName } from '../../../../utils/iconFromName';
import s from './Board.module.css';
import { useRenderMode } from '../../../../hooks/useRenderMode';

// Lazy — Three.js/R3F ne chargent jamais en mode CSS
const BoardGridR3FLazy = lazy(() => import('./BoardGridR3F'));

// ─── CSS constants ────────────────────────────────────────────────────────────

const CELL_H   = 68;
const CELL_GAP = 5;
const PAWN_SIZE = 75;
const ROWS = BOARD_LAYOUT.length;

// ─── Shared layout helpers ────────────────────────────────────────────────────

function getLayoutPos(idx: number) {
  for (let r = 0; r < BOARD_LAYOUT.length; r++) {
    const c = BOARD_LAYOUT[r].indexOf(idx);
    if (c !== -1) return { row: r, col: c };
  }
  return { row: 0, col: 0 };
}

function cellCenter(idx: number, cellW: number) {
  const { row, col } = getLayoutPos(idx);
  const renderedRow = ROWS - 1 - row;
  return {
    x: col * (cellW + CELL_GAP) + cellW / 2,
    y: renderedRow * (CELL_H + CELL_GAP) + CELL_H / 2,
  };
}

// ─── PawnSvg ──────────────────────────────────────────────────────────────────

function PawnSvg({ pawn, color, pawnId, size = PAWN_SIZE }: { pawn: IconName; color: string; pawnId: string; size?: number }) {
  const cylId  = `pc-${pawnId}`;
  const headId = `ph-${pawnId}`;
  const baseId = `pb-${pawnId}`;
  return (
    <svg width={size} height={size} viewBox="0 0 60 80" className="block">
      <defs>
        <linearGradient id={cylId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#000000" stopOpacity="0.55" />
          <stop offset="28%"  stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="52%"  stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
        </linearGradient>
        <radialGradient id={baseId} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#000000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={headId} cx="36%" cy="32%" r="62%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="45%"  stopColor={color} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      <ellipse cx="30" cy="77" rx="16" ry="3.5" fill="rgba(0,0,0,0.28)" />
      <ellipse cx="30" cy="65" rx="19" ry="6.5" fill={color} />
      <ellipse cx="30" cy="65" rx="19" ry="6.5" fill={`url(#${baseId})`} />
      <polygon points="11,65 19,30 41,30 49,65" fill={color} />
      <polygon points="11,65 19,30 41,30 49,65" fill={`url(#${cylId})`} />
      <circle cx="30" cy="22" r="13" fill={`url(#${headId})`} />

      <foreignObject x="17" y="9" width="26" height="26">
        <div className="flex items-center justify-center w-full h-full">
          <DynamicIcon name={pawn} size={14} color="rgba(255,255,255,0.92)" />
        </div>
      </foreignObject>
    </svg>
  );
}

// ─── PawnOverlay ──────────────────────────────────────────────────────────────

function PawnOverlay({ squareIndex, pawn, color, pawnId, cellW, xOffset = 0, pawnSize = PAWN_SIZE }: {
  squareIndex: number;
  pawn: IconName;
  color: string;
  pawnId: string;
  cellW: number;
  xOffset?: number;
  pawnSize?: number;
}) {
  const controls = useAnimation();
  const prevIdxRef = useRef(squareIndex);
  const half = pawnSize / 2;

  const pos = (idx: number, ox: number) => {
    const c = cellCenter(idx, cellW);
    return { x: c.x - half + ox, y: c.y - half };
  };

  useEffect(() => {
    const { x, y } = pos(squareIndex, xOffset);
    controls.start({ x, y, transition: { duration: 0 } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellW]);

  useEffect(() => {
    if (prevIdxRef.current === squareIndex) return;
    const from = cellCenter(prevIdxRef.current, cellW);
    const to   = cellCenter(squareIndex, cellW);
    prevIdxRef.current = squareIndex;

    const midX = (from.x + to.x) / 2 - half + xOffset;
    const arcY  = Math.min(from.y, to.y) - 55 - half;

    controls.start({
      x: [from.x - half + xOffset, midX, to.x - half + xOffset],
      y: [from.y - half,           arcY,  to.y - half],
      transition: { duration: 0.45, ease: [0.42, 0, 0.32, 1] },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squareIndex]);

  const init = pos(squareIndex, xOffset);

  return (
    <motion.div
      initial={{ x: init.x, y: init.y }}
      animate={controls}
      className={s.pawnOverlay}
      style={{ zIndex: 10, width: pawnSize, height: pawnSize }}
    >
      <PawnSvg pawn={pawn} color={color} pawnId={pawnId} size={pawnSize} />
    </motion.div>
  );
}

// ─── BoardCell ────────────────────────────────────────────────────────────────

interface BoardCellProps {
  squareIndex: number;
  isActive: boolean;
  isAnimating: boolean;
}

function BoardCell({ squareIndex, isActive, isAnimating }: BoardCellProps) {
  const square   = BOARD[squareIndex];
  const bg       = getSquareBg(square);
  const iconName = getSquareIconName(square);

  return (
    <motion.div
      animate={
        isAnimating && isActive
          ? { scale: [1, 1.2, 1], boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.85)', '0 0 0px rgba(255,255,255,0)'] }
          : isActive
          ? { scale: [1, 1.07, 1], boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 10px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)'] }
          : { scale: 1, boxShadow: '0 0 0px rgba(255,255,255,0)' }
      }
      transition={
        isActive
          ? { duration: isAnimating ? 0.28 : 0.9, repeat: isAnimating ? 0 : Infinity, repeatType: 'loop' }
          : {}
      }
      className={s.cell}
      style={{
        background: bg || 'rgba(255,255,255,0.06)',
        border: isActive
          ? '2px solid rgba(255,255,255,0.95)'
          : '1.5px solid rgba(255,255,255,0.1)',
      }}
    >
      {iconName && <DynamicIcon name={iconName} size={18} color="rgba(255,255,255,0.85)" />}
    </motion.div>
  );
}

// ─── BoardGridProps ───────────────────────────────────────────────────────────

export interface BoardGridProps {
  displayPos0: number;
  displayPos1: number;
  p0Pawn: IconName;
  p1Pawn: IconName;
  p0Color: string;
  p1Color: string;
  activeSquare: number;
  isAnimating: boolean;
  animatingPos: number | null;
  // Dé sur plateau — optionnel, uniquement R3F
  diceResult?: number;
  isDiceRolling?: boolean;
  onDiceRollComplete?: () => void;
  showDice?: boolean;
}

// ─── BoardGridCSS ─────────────────────────────────────────────────────────────

function BoardGridCSS({
  displayPos0, displayPos1,
  p0Pawn, p1Pawn, p0Color, p1Color,
  activeSquare, isAnimating,
}: BoardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellW, setCellW] = useState(83);

  useEffect(() => {
    if (!gridRef.current) return;
    const measure = () => {
      if (gridRef.current) setCellW(Math.floor((gridRef.current.clientWidth - 3 * CELL_GAP) / 4));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, []);

  // Pawn scales with cell width so it never overflows on narrow screens
  const pawnSize = Math.min(PAWN_SIZE, Math.max(40, cellW - 6));

  const sameCell = displayPos0 === displayPos1;

  return (
    <div className="overflow-x-hidden w-full">
      <div className={`mx-auto ${s.boardInner}`}>
        <div className={s.isoGrid}>
          <div className={s.woodBorder} />

          <div ref={gridRef} className={s.gridRef}>
            {[...BOARD_LAYOUT].reverse().map((row, rowIndex) => (
              <div key={rowIndex} className={s.gridRow}>
                <div className={s.gridCells}>
                  {row.map(squareIndex => (
                    <BoardCell
                      key={squareIndex}
                      squareIndex={squareIndex}
                      isActive={squareIndex === activeSquare}
                      isAnimating={isAnimating}
                    />
                  ))}
                </div>
              </div>
            ))}

            <PawnOverlay
              squareIndex={displayPos0}
              pawn={p0Pawn}
              color={p0Color}
              pawnId="p0"
              cellW={cellW}
              pawnSize={pawnSize}
              xOffset={sameCell ? -8 : 0}
            />
            <PawnOverlay
              squareIndex={displayPos1}
              pawn={p1Pawn}
              color={p1Color}
              pawnId="p1"
              cellW={cellW}
              pawnSize={pawnSize}
              xOffset={sameCell ? 8 : 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BoardGrid (export — API stable) ─────────────────────────────────────────

export function BoardGrid(props: BoardGridProps) {
  const renderMode = useRenderMode();
  if (renderMode === 'r3f') {
    return (
      <Suspense fallback={<BoardGridCSS {...props} />}>
        <BoardGridR3FLazy {...props} />
      </Suspense>
    );
  }
  return <BoardGridCSS {...props} />;
}

// ─── Legend ───────────────────────────────────────────────────────────────────

export function Legend() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap mt-2 px-4">
      {(['pause', 'chance', 'accord', 'complicite'] as const).map(type => (
        <div key={type} className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: SQUARE_VISUAL[type].bg }} />
          <span className="text-[10px] text-white/45 font-semibold flex items-center gap-[3px]">
            {SQUARE_VISUAL[type].iconName && <DynamicIcon name={SQUARE_VISUAL[type].iconName} size={9} color="rgba(255,255,255,0.45)" />} {SQUARE_VISUAL[type].label}
          </span>
        </div>
      ))}
    </div>
  );
}
