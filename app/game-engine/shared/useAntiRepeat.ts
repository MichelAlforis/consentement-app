'use client';
import { useRef, useCallback } from 'react';

export function useAntiRepeat<T extends { id: string }>() {
  const usedIds = useRef<Set<string>>(new Set());

  const pick = useCallback((pool: T[]): T => {
    const available = pool.filter(item => !usedIds.current.has(item.id));
    const source = available.length > 0 ? available : pool;
    if (available.length === 0) usedIds.current.clear();
    const picked = source[Math.floor(Math.random() * source.length)];
    usedIds.current.add(picked.id);
    return picked;
  }, []);

  const reset = useCallback(() => {
    usedIds.current.clear();
  }, []);

  return { pick, reset };
}
