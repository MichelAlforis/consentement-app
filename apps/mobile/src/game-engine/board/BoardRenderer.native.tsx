import { useWindowDimensions, View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import {
  Zap, Leaf, Wind, Moon, Star, Dices,
  Pause, Handshake, Heart, Rocket, Flag, Waves, Sparkles, Lock,
} from 'lucide-react-native';
import type { ComponentType } from 'react';
import type { BoardConfig, SquareConfig, BoardPlayerState } from './types';
import type { IconName } from '@ouiclair/core';

// V4 divergence: window.resize → useWindowDimensions()
// V4 divergence: ISO 3D CSS transform impossible en RN → grille plate avec surlignage animé

// ─── Icon map (noms utilisés par GooseGame + board générique) ─────────────────

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

const ICON_MAP: Partial<Record<string, LucideIcon>> = {
  Zap, Leaf, Wind, Moon, Star, Dices,
  Pause, Handshake, Heart, Rocket, Flag, Waves, Sparkles, Lock,
};

function IconNode({ name, size, color }: { name: IconName | ''; size: number; color: string }) {
  if (!name) return null;
  const Icon = ICON_MAP[name] as LucideIcon | undefined;
  if (!Icon) return <Text style={{ fontSize: size * 0.7, color }}>{name[0]}</Text>;
  return <Icon size={size} color={color} />;
}

// ─── Layout snake ─────────────────────────────────────────────────────────────

function buildLayout(totalSquares: number, columns: number, snake: boolean): number[][] {
  const rows: number[][] = [];
  let idx = 0;
  while (idx < totalSquares) {
    const row: number[] = [];
    for (let c = 0; c < columns && idx < totalSquares; c++) row.push(idx++);
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
  cellSize: number;
}

function BoardCell({ squareIndex, config, players, isActive, isAnimating, cellSize }: BoardCellProps) {
  const here = players.filter(p => p.position === squareIndex);

  return (
    <MotiView
      animate={
        isAnimating && isActive
          ? { scale: 1.18, opacity: 1 }
          : isActive
          ? { scale: [1, 1.06, 1], opacity: 1 }
          : { scale: 1, opacity: 1 }
      }
      transition={
        isActive && !isAnimating
          ? { type: 'timing', duration: 900, loop: true }
          : { type: 'timing', duration: 200 }
      }
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          borderRadius: cellSize * 0.15,
          borderColor: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.12)',
          borderWidth: isActive ? 2 : 1.5,
        },
      ]}
    >
      {/* Fond coloré de la case */}
      <View style={[StyleSheet.absoluteFill, { borderRadius: cellSize * 0.15, backgroundColor: extractBg(config.gradient) }]} />

      {config.iconName ? (
        <IconNode name={config.iconName} size={cellSize * 0.32} color="rgba(255,255,255,0.85)" />
      ) : null}

      {here.length > 0 && (
        <View style={styles.pawns}>
          {here.map((p, i) => (
            <View key={`${p.emoji}-${i}`} style={[styles.pawnBadge, { width: cellSize * 0.36, height: cellSize * 0.36, borderRadius: cellSize * 0.18 }]}>
              <IconNode name={p.emoji} size={cellSize * 0.22} color="white" />
            </View>
          ))}
        </View>
      )}
    </MotiView>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractBg(gradient: string): string {
  const match = gradient.match(/#[0-9a-fA-F]{3,6}/);
  return match ? match[0] + '33' : 'rgba(255,255,255,0.06)';
}

// ─── LegendEntry ──────────────────────────────────────────────────────────────

export interface LegendEntry {
  iconName: IconName | '';
  label: string;
  gradient: string;
}

function BoardLegend({ entries }: { entries: LegendEntry[] }) {
  return (
    <View style={styles.legend}>
      {entries.map(e => (
        <View key={e.label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: extractBg(e.gradient) }]} />
          <View style={styles.legendLabelRow}>
            {e.iconName ? <IconNode name={e.iconName} size={9} color="rgba(255,255,255,0.45)" /> : null}
            <Text style={styles.legendText}>{e.label}</Text>
          </View>
        </View>
      ))}
    </View>
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
  const { width } = useWindowDimensions();
  const { squares, layout } = boardConfig;
  const configMap = new Map(squareConfigs.map(c => [c.id, c]));
  const grid = buildLayout(squares.length, layout.columns, layout.snake);
  const isAnimating = animatingPos !== null;
  const currentActive = animatingPos ?? activeSquare;

  // Taille de cellule adaptée à la largeur écran
  const GAP = 4;
  const PADDING = 8;
  const cellSize = Math.floor((width - PADDING * 2 - GAP * (layout.columns - 1)) / layout.columns);

  return (
    <View style={{ paddingHorizontal: PADDING }}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { marginBottom: rowIndex < grid.length - 1 ? GAP : 0 }]}>
          {row.map(squareIndex => {
            const instance = squares[squareIndex];
            const config = instance ? configMap.get(instance.configId) : undefined;
            if (!config) return <View key={squareIndex} style={{ width: cellSize, height: cellSize }} />;
            return (
              <BoardCell
                key={squareIndex}
                squareIndex={squareIndex}
                config={config}
                players={players}
                isActive={squareIndex === currentActive}
                isAnimating={isAnimating && squareIndex === animatingPos}
                cellSize={cellSize}
              />
            );
          })}
        </View>
      ))}
      {legend && legend.length > 0 && <BoardLegend entries={legend} />}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pawns: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    flexDirection: 'row',
    gap: 1,
  },
  pawnBadge: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  legendText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '600',
  },
});
