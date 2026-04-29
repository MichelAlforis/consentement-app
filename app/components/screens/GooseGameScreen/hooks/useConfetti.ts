'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useHaptics } from '../../../../game-engine/shared/useHaptics';

export function useConfetti() {
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(0);
  const { vibrate } = useHaptics();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const trigger = useCallback(() => {
    vibrate([80, 40, 80, 40, 120]);
    setKey(k => k + 1);
    setShow(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(false), 2200);
  }, [vibrate]);

  return { show, key, trigger };
}
