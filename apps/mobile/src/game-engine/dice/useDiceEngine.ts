// V4 divergence: useHaptics → expo-haptics via wrapper shared/
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAntiRepeat } from '../shared/useAntiRepeat';
import { useHaptics } from '../shared/useHaptics';
import type { DiceConfig, DiceItem, DiceFace } from './types';

export interface DiceEngineState {
  currentFace: DiceFace | null;
  currentItem: DiceItem | null;
  isRolling: boolean;
  history: DiceItem[];
  roll: () => void;
  onRollComplete: () => void;
}

export function useDiceEngine(
  config: DiceConfig,
  items: DiceItem[],
  filter?: (item: DiceItem) => boolean,
): DiceEngineState {
  const [currentFace, setCurrentFace] = useState<DiceFace | null>(null);
  const [currentItem, setCurrentItem] = useState<DiceItem | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<DiceItem[]>([]);

  const faceRef = useRef<DiceFace | null>(null);
  const { pick, reset: resetAntiRepeat } = useAntiRepeat<DiceItem>();
  const { vibrate } = useHaptics();

  const onLandedRef = useRef<(face: DiceFace) => void>(() => {});

  useEffect(() => {
    onLandedRef.current = (face: DiceFace) => {
      const pool = items.filter(item => {
        if (item.faceId !== face.id) return false;
        return filter ? filter(item) : true;
      });
      if (pool.length === 0) return;
      const picked = pick(pool);
      setCurrentItem(picked);
      setHistory(prev => [picked, ...prev].slice(0, 50));
    };
  });

  const roll = useCallback(() => {
    const faceIndex = Math.floor(Math.random() * config.faces.length);
    const face = config.faces[faceIndex];
    faceRef.current = face;
    setCurrentFace(face);
    setIsRolling(true);
    void vibrate(100);
  }, [config.faces, vibrate]);

  const onRollComplete = useCallback(() => {
    setIsRolling(false);
    if (faceRef.current) {
      onLandedRef.current(faceRef.current);
    }
  }, []);

  const resetHistory = useCallback(() => {
    setHistory([]);
    resetAntiRepeat();
  }, [resetAntiRepeat]);

  void resetHistory;

  return { currentFace, currentItem, isRolling, history, roll, onRollComplete };
}
