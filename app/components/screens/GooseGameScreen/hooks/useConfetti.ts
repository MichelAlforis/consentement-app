'use client';
import { useState, useCallback } from 'react';
import { vibrate } from '../utils';

export function useConfetti() {
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(0);

  const trigger = useCallback(() => {
    vibrate([80, 40, 80, 40, 120]);
    setKey(k => k + 1);
    setShow(true);
    setTimeout(() => setShow(false), 2200);
  }, []);

  return { show, key, trigger };
}
