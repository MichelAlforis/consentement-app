import { useState, useCallback, useRef, useEffect } from 'react';
import { useHaptics } from '../../../../game-engine/shared/useHaptics';

const DICE_SAFETY_TIMEOUT_MS = 5000;

export function useDice(onLanded: (face: 1 | 2 | 3 | 4 | 5 | 6) => void) {
  const [diceResult, setDiceResult] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isRolling, setIsRolling] = useState(false);
  const resultRef   = useRef<1 | 2 | 3 | 4 | 5 | 6>(1);
  const onLandedRef = useRef(onLanded);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { onLandedRef.current = onLanded; }, [onLanded]);
  const { vibrate } = useHaptics();

  const fire = useCallback(() => {
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    setIsRolling(false);
    onLandedRef.current(resultRef.current);
  }, []);

  useEffect(() => {
    return () => { if (safetyTimer.current) clearTimeout(safetyTimer.current); };
  }, []);

  const roll = useCallback(() => {
    const face = Math.ceil(Math.random() * 6) as 1 | 2 | 3 | 4 | 5 | 6;
    resultRef.current = face;
    setDiceResult(face);
    setIsRolling(true);
    vibrate(100);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    safetyTimer.current = setTimeout(fire, DICE_SAFETY_TIMEOUT_MS);
  }, [vibrate, fire]);

  const handleRollComplete = useCallback(() => {
    fire();
  }, [fire]);

  return { diceResult, isRolling, roll, handleRollComplete };
}
