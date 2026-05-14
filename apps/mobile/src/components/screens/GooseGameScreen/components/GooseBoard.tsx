import { useMemo } from 'react';
import {
  BOARD,
  SQUARE_VISUAL,
  PAWN_COLORS,
  getSquareBg,
  getSquareIconName,
} from '@ouiclair/core';
import { BoardRenderer } from '../../../../game-engine/board';
import type { BoardConfig, SquareConfig, BoardPlayerState, LegendEntry } from '../../../../game-engine/board';
import type { Player } from '../types';

// ── Mapper BOARD → SquareConfig[] ─────────────────────────────────────────────

const SQUARE_CONFIGS: SquareConfig[] = BOARD.map(sq => ({
  id: String(sq.index),
  kind: sq.type === 'depart' ? 'start'
      : sq.type === 'arrivee' ? 'end'
      : sq.type === 'normal' ? 'normal'
      : 'special',
  label: SQUARE_VISUAL[sq.type].label,
  iconName: getSquareIconName(sq),
  gradient: getSquareBg(sq) || 'rgba(255,255,255,0.06)',
  action: sq.type === 'chance'     ? 'bonus-move'
        : sq.type === 'accord'     ? 'vote'
        : sq.type === 'complicite' ? 'forced'
        : sq.type === 'arrivee'    ? 'end'
        : undefined,
  bonusMoves: sq.type === 'chance' ? 2 : undefined,
}));

const BOARD_CONFIG: BoardConfig = {
  squares: BOARD.map(sq => ({ index: sq.index, configId: String(sq.index) })),
  layout: { columns: 4, snake: true },
  pawnEmojis: [...PAWN_COLORS],
};

const LEGEND_ENTRIES: LegendEntry[] = (['pause', 'chance', 'accord', 'complicite'] as const).map(type => ({
  iconName: SQUARE_VISUAL[type].iconName,
  label: SQUARE_VISUAL[type].label,
  gradient: SQUARE_VISUAL[type].bg,
}));

// ── GooseBoard ────────────────────────────────────────────────────────────────

interface GooseBoardProps {
  displayPos0: number;
  displayPos1: number;
  player1: Player;
  player2: Player;
  activeSquare: number;
  animatingPos: number | null;
}

export function GooseBoard({ displayPos0, displayPos1, player1, player2, activeSquare, animatingPos }: GooseBoardProps) {
  const players: BoardPlayerState[] = useMemo(() => [
    { name: player1.name, emoji: player1.pawn, position: displayPos0 },
    { name: player2.name, emoji: player2.pawn, position: displayPos1 },
  ], [player1.name, player1.pawn, player2.name, player2.pawn, displayPos0, displayPos1]);

  return (
    <BoardRenderer
      boardConfig={BOARD_CONFIG}
      squareConfigs={SQUARE_CONFIGS}
      players={players}
      activeSquare={activeSquare}
      animatingPos={animatingPos}
      legend={LEGEND_ENTRIES}
    />
  );
}
