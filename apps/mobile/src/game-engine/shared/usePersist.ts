import { useRef, useState, useCallback } from 'react';

// V4 divergence: AsyncStorage remplace localStorage (async, nécessite await)
// TODO Phase 8: migrer vers MMKV react-native-mmkv
// Implémentation session-only via useRef (pas de persistance entre sessions)
export function usePersist<T>(_key: string) {
  const dataRef = useRef<T | null>(null);
  const [, forceUpdate] = useState(0);

  const save = useCallback((data: T): void => {
    dataRef.current = data;
    forceUpdate(n => n + 1);
  }, []);

  const load = useCallback((): T | null => {
    return dataRef.current;
  }, []);

  const clear = useCallback((): void => {
    dataRef.current = null;
    forceUpdate(n => n + 1);
  }, []);

  return { save, load, clear };
}
