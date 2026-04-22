'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { vibrate } from '../utils';

export function useDice(onLanded: (face: 1 | 2 | 3 | 4 | 5 | 6) => void) {
  const [diceResult, setDiceResult] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isRolling, setIsRolling] = useState(false);
  const resultRef = useRef<1 | 2 | 3 | 4 | 5 | 6>(1);
  // Ref pour éviter les stale closures sur le callback
  const onLandedRef = useRef(onLanded);
  useEffect(() => { onLandedRef.current = onLanded; }, [onLanded]);

  const roll = useCallback(() => {
    const face = Math.ceil(Math.random() * 6) as 1 | 2 | 3 | 4 | 5 | 6;
    resultRef.current = face;
    setDiceResult(face);
    setIsRolling(true);
    vibrate(100);
  }, []);

  // Passé à Dice3D onRollComplete — déclenche la suite de jeu
  const handleRollComplete = useCallback(() => {
    setIsRolling(false);
    onLandedRef.current(resultRef.current);
  }, []);

  return { diceResult, isRolling, roll, handleRollComplete };
}
