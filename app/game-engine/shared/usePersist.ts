'use client';
import { useCallback } from 'react';
import { logger } from '../../lib/logger';

export function usePersist<T>(key: string) {
  const save = useCallback((data: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      logger.warn('localStorage.setItem failed', err instanceof Error ? err : undefined, { extra: { key } });
    }
  }, [key]);

  const load = useCallback((): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : null;
    } catch {
      return null;
    }
  }, [key]);

  const clear = useCallback((): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }, [key]);

  return { save, load, clear };
}
