'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useHaptics } from '../../../../game-engine/shared/useHaptics';

export function useDice(onLanded: (face: 1 | 2 | 3 | 4 | 5 | 6) => void) {
  const [diceResult, setDiceResult] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isRolling, setIsRolling] = useState(false);
  const resultRef = useRef<1 | 2 | 3 | 4 | 5 | 6>(1);
  const onLandedRef = useRef(onLanded);
  useEffect(() => { onLandedRef.current = onLanded; }, [onLanded]);
  const { vibrate } = useHaptics();

  const roll = useCallback(() => {
    const face = Math.ceil(Math.random() * 6) as 1 | 2 | 3 | 4 | 5 | 6;
    resultRef.current = face;
    setDiceResult(face);
    setIsRolling(true);
    vibrate(100);
  }, [vibrate]);

  const handleRollComplete = useCallback(() => {
    setIsRolling(false);
    onLandedRef.current(resultRef.current);
  }, []);

  return { diceResult, isRolling, roll, handleRollComplete };
}
