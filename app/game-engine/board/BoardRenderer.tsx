'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { BoardConfig, SquareConfig, SquareKind, BoardPlayerState } from './types';
import { DynamicIcon } from '../../utils/iconFromName';

function buildLayout(totalSquares: number, columns: number, snake: boolean): number[][] {
  const rows: number[][] = [];
  let idx = 0;
  while (idx < totalSquares) {
    const row: number[] = [];
    for (let c = 0; c < columns && idx < totalSquares; c++) {
      row.push(idx++);
    }
    if (snake && rows.length % 2 === 1) row.reverse();
    rows.push(row);
  }
  return rows;
}

const ISO_TRANSFORM = 'rotateX(45deg) rotateZ(45deg) scale(0.72)';

const SQUARE_DEPTH: Record<SquareKind, number> = {
  normal:  8,
  start:  12,
  end:    16,
  special: 14,
};

// ─── BoardCell ────────────────────────────────────────────────────────────────

interface BoardCellProps {
  squareIndex: number;
  config: SquareConfig;
  players: BoardPlayerState[];
  isActive: boolean;
  isAnimating: boolean;
}

function BoardCell({ squareIndex, config, players, isActive, isAnimating }: BoardCellProps) {
  const here = players.filter(p => p.position === squareIndex);
  const depth = SQUARE_DEPTH[config.kind];

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
          background: config.gradient || 'rgba(255,255,255,0.06)',
          borderRadius: 10,
          aspectRatio: '1 / 1',
          position: 'relative',
          border: isActive
            ? '2px solid rgba(255,255,255,0.95)'
            : '1.5px solid rgba(255,255,255,0.1)',
          minHeight: 44,
        }}
        className="flex flex-col items-center justify-center gap-0.5"
      >
        {config.iconName && <DynamicIcon name={config.iconName} size={18} color="rgba(255,255,255,0.85)" />}

        <AnimatePresence>
          {here.length > 0 && (
            <motion.div
              key="pawns"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              style={{ display: 'flex', gap: 2, marginTop: 2 }}
            >
              {here.map((p, i) => (
                <motion.span
                  key={`${p.emoji}-${i}`}
                  layoutId={`pawn-${p.emoji}`}
                  style={{
                    fontSize: 12,
                    background: 'rgba(255,255,255,0.22)',
                    borderRadius: 5,
                    padding: '1px 3px',
                    lineHeight: 1,
                    display: 'block',
                    transform: 'rotateZ(-45deg) rotateX(-45deg) scale(1.4)',
                  }}
                >
                  {p.emoji}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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

// ─── Legend ───────────────────────────────────────────────────────────────────

export interface LegendEntry {
  iconName: string;
  label: string;
  gradient: string;
}

interface LegendProps {
  entries: LegendEntry[];
}

export function BoardLegend({ entries }: LegendProps) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap mt-3 px-4">
      {entries.map(entry => (
        <div key={entry.label} className="flex items-center gap-1.5">
          <span style={{
            display: 'inline-block',
            width: 10, height: 10,
            borderRadius: 3,
            background: entry.gradient,
          }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
            {entry.iconName && <DynamicIcon name={entry.iconName} size={9} color="rgba(255,255,255,0.45)" />} {entry.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── BoardRenderer ────────────────────────────────────────────────────────────

export interface BoardRendererProps {
  boardConfig: BoardConfig;
  squareConfigs: SquareConfig[];
  players: BoardPlayerState[];
  activeSquare: number;
  animatingPos: number | null;
  legend?: LegendEntry[];
}

export function BoardRenderer({
  boardConfig,
  squareConfigs,
  players,
  activeSquare,
  animatingPos,
  legend,
}: BoardRendererProps) {
  const { squares, layout } = boardConfig;
  const configMap = new Map(squareConfigs.map(c => [c.id, c]));
  const grid = buildLayout(squares.length, layout.columns, layout.snake);
  const isAnimating = animatingPos !== null;
  const currentActive = animatingPos ?? activeSquare;

  const rowDirections = grid.map((_, i) => (i % 2 === 0 ? '→' : '←'));

  return (
    <div>
      {/* Padding compensatoire : la projection iso peut déborder vers le bas */}
      <div className="mx-auto" style={{ maxWidth: layout.columns * 85, padding: '8px 8px 40px' }}>
        <div style={{ transform: ISO_TRANSFORM, transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} style={{ marginBottom: 5, transformStyle: 'preserve-3d' }}>
              {layout.snake && (
                <div
                  style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.28)',
                    fontWeight: 700,
                    letterSpacing: 2,
                    marginBottom: 3,
                    textAlign: rowDirections[rowIndex] === '→' ? 'right' : 'left',
                    paddingRight: rowDirections[rowIndex] === '→' ? 4 : 0,
                    paddingLeft: rowDirections[rowIndex] === '←' ? 4 : 0,
                  }}
                >
                  {rowDirections[rowIndex]}
                </div>
              )}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
                gap: 5,
                transformStyle: 'preserve-3d',
              }}>
                {row.map(squareIndex => {
                  const instance = squares[squareIndex];
                  const config = instance ? configMap.get(instance.configId) : undefined;
                  if (!config) return <div key={squareIndex} style={{ aspectRatio: '1 / 1', minHeight: 44 }} />;
                  return (
                    <BoardCell
                      key={squareIndex}
                      squareIndex={squareIndex}
                      config={config}
                      players={players}
                      isActive={squareIndex === currentActive}
                      isAnimating={isAnimating && squareIndex === animatingPos}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {legend && legend.length > 0 && <BoardLegend entries={legend} />}
    </div>
  );
}
