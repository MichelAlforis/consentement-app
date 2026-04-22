'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { BoardConfig, SquareConfig, BoardPlayerState } from './types';

// Construit la grille 2D à partir d'une liste linéaire de cases en serpentin
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
        background: config.gradient || 'rgba(255,255,255,0.06)',
        borderRadius: 10,
        aspectRatio: '1 / 1',
        position: 'relative',
        border: isActive
          ? '2px solid rgba(255,255,255,0.95)'
          : '1.5px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        minHeight: 44,
      }}
      className="flex flex-col items-center justify-center gap-0.5"
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{config.emoji}</span>

      {/* Pions avec animation d'entrée/sortie */}
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
                }}
              >
                {p.emoji}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

export interface LegendEntry {
  emoji: string;
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
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
            {entry.emoji} {entry.label}
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
      <div className="mx-auto px-2" style={{ maxWidth: layout.columns * 85 }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ marginBottom: 5 }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.columns}, 1fr)`, gap: 5 }}>
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

      {legend && legend.length > 0 && <BoardLegend entries={legend} />}
    </div>
  );
}
