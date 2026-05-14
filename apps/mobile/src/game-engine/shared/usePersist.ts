import { useCallback } from 'react';
import { mmkvStorage } from '../../storage/mmkvStorage';

// V4 divergence: MMKV remplace localStorage (synchrone, persistance entre sessions)
export function usePersist<T>(key: string) {
  const save = useCallback((data: T): void => {
    try { mmkvStorage.setItem(key, JSON.stringify(data)); } catch { /* silently ignore */ }
  }, [key]);

  const load = useCallback((): T | null => {
    try {
      const s = mmkvStorage.getItem(key) as string | null;
      return s ? (JSON.parse(s) as T) : null;
    } catch { return null; }
  }, [key]);

  const clear = useCallback((): void => {
    try { mmkvStorage.removeItem(key); } catch { /* silently ignore */ }
  }, [key]);

  return { save, load, clear };
}
