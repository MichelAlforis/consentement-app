'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { vibrate } from '../utils';

export function usePawnAnimation() {
  const [animatingPos, setAnimatingPos] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Déplace le pion case par case à 210 ms/case avec vibration tactile
  const animate = useCallback((from: number, to: number, onDone: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
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
          onDone();
        }, 380);
      }
    };

    setAnimatingPos(from);
    timerRef.current = setTimeout(hop, 160);
  }, []);

  return { animatingPos, animate };
}
