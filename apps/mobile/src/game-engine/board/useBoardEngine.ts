import { useState, useCallback, useEffect, useRef } from 'react';
import { useAntiRepeat } from '../shared/useAntiRepeat';
import { usePersist } from '../shared/usePersist';
import { useHaptics } from '../shared/useHaptics';
import type { BoardConfig, SquareConfig, ActivityPool, BoardSquareInstance, BoardPlayerState } from './types';

export interface BoardEngineState {
  players: BoardPlayerState[];
  currentPlayerIndex: number;
  animatingPos: number | null;
  currentSquare: BoardSquareInstance | null;
  currentActivity: { id: string; text: string; tags?: string[] } | null;
  move: (steps: number, onLanded?: (square: BoardSquareInstance) => void) => void;
  endTurn: () => void;
  save: () => void;
  load: () => boolean;
  clear: () => void;
}

interface SaveData {
  players: BoardPlayerState[];
  currentPlayerIndex: number;
}

export function useBoardEngine(
  boardConfig: BoardConfig,
  squareConfigs: SquareConfig[],
  activityPools: ActivityPool[],
  options?: {
    initialPlayers?: BoardPlayerState[];
    filter?: (item: { tags?: string[] }) => boolean;
  },
): BoardEngineState {
  const maxPlayers = boardConfig.maxPlayers ?? 2;
  const saveKey = boardConfig.saveKey ?? '__board_engine__';

  const defaultPlayers: BoardPlayerState[] = boardConfig.pawnEmojis
    .slice(0, maxPlayers)
    .map((emoji, i) => ({ name: `Joueur ${i + 1}`, emoji, position: 0 }));

  const [players, setPlayers] = useState<BoardPlayerState[]>(
    options?.initialPlayers ?? defaultPlayers,
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [animatingPos, setAnimatingPos] = useState<number | null>(null);
  const [currentSquare, setCurrentSquare] = useState<BoardSquareInstance | null>(null);
  const [currentActivity, setCurrentActivity] = useState<{ id: string; text: string; tags?: string[] } | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { vibrate } = useHaptics();
  const { pick } = useAntiRepeat<{ id: string; text: string; tags?: string[] }>();
  const persist = usePersist<SaveData>(saveKey);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const resolveActivity = useCallback((square: BoardSquareInstance) => {
    const config = squareConfigs.find(c => c.id === square.configId);
    if (!config?.pool) { setCurrentActivity(null); return; }
    const pool = activityPools.find(p => p.id === config.pool);
    if (!pool) { setCurrentActivity(null); return; }
    const filtered = options?.filter ? pool.items.filter(options.filter) : pool.items;
    if (filtered.length === 0) { setCurrentActivity(null); return; }
    const picked = pick(filtered);
    setCurrentActivity(picked);
  }, [squareConfigs, activityPools, options, pick]);

  const move = useCallback((steps: number, onLanded?: (square: BoardSquareInstance) => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setPlayers(prev => {
      const updated = [...prev];
      const player = { ...updated[currentPlayerIndex] };
      const maxIndex = boardConfig.squares.length - 1;
      const from = player.position;
      const to = Math.min(from + steps, maxIndex);
      let current = from;

      const hop = () => {
        current = Math.min(current + 1, to);
        setAnimatingPos(current);
        vibrate(30);

        if (current < to) {
          timerRef.current = setTimeout(hop, 210);
        } else {
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            setAnimatingPos(null);
            const square = boardConfig.squares[current];
            setCurrentSquare(square);
            resolveActivity(square);
            onLanded?.(square);
          }, 380);
        }
      };

      setAnimatingPos(from);
      timerRef.current = setTimeout(hop, 160);

      player.position = to;
      updated[currentPlayerIndex] = player;
      return updated;
    });
  }, [currentPlayerIndex, boardConfig.squares, vibrate, resolveActivity]);

  const endTurn = useCallback(() => {
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    setCurrentActivity(null);
    setCurrentSquare(null);
  }, [players.length]);

  const save = useCallback(() => {
    persist.save({ players, currentPlayerIndex });
  }, [persist, players, currentPlayerIndex]);

  const load = useCallback((): boolean => {
    const data = persist.load();
    if (!data) return false;
    setPlayers(data.players);
    setCurrentPlayerIndex(data.currentPlayerIndex);
    return true;
  }, [persist]);

  const clear = useCallback(() => { persist.clear(); }, [persist]);

  return { players, currentPlayerIndex, animatingPos, currentSquare, currentActivity, move, endTurn, save, load, clear };
}
