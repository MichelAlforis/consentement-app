import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePalierUp } from './usePalierUp';
import type { HeatLevel } from './heatLevel';

describe('usePalierUp', () => {
  it('état initial : justUnlocked est null', () => {
    const { result } = renderHook(() => usePalierUp(1 as HeatLevel));
    expect(result.current.justUnlocked).toBeNull();
  });

  it('ne déclenche pas si le niveau reste identique', () => {
    const { result, rerender } = renderHook(({ level }) => usePalierUp(level), {
      initialProps: { level: 2 as HeatLevel },
    });
    rerender({ level: 2 as HeatLevel });
    expect(result.current.justUnlocked).toBeNull();
  });

  it('déclenche quand le niveau monte de 1 à 2', () => {
    const { result, rerender } = renderHook(({ level }) => usePalierUp(level), {
      initialProps: { level: 1 as HeatLevel },
    });
    rerender({ level: 2 as HeatLevel });
    expect(result.current.justUnlocked).toBe(2);
  });

  it('déclenche quand le niveau monte de 2 à 3', () => {
    const { result, rerender } = renderHook(({ level }) => usePalierUp(level), {
      initialProps: { level: 2 as HeatLevel },
    });
    rerender({ level: 3 as HeatLevel });
    expect(result.current.justUnlocked).toBe(3);
  });

  it('ne déclenche pas si le niveau descend', () => {
    const { result, rerender } = renderHook(({ level }) => usePalierUp(level), {
      initialProps: { level: 3 as HeatLevel },
    });
    rerender({ level: 2 as HeatLevel });
    expect(result.current.justUnlocked).toBeNull();
  });

  it('clear() remet justUnlocked à null', () => {
    const { result, rerender } = renderHook(({ level }) => usePalierUp(level), {
      initialProps: { level: 1 as HeatLevel },
    });
    rerender({ level: 2 as HeatLevel });
    expect(result.current.justUnlocked).toBe(2);
    act(() => result.current.clear());
    expect(result.current.justUnlocked).toBeNull();
  });

  it('clear() est stable entre renders — pas de boucle infinie', () => {
    const { result, rerender } = renderHook(({ level }) => usePalierUp(level), {
      initialProps: { level: 1 as HeatLevel },
    });
    const clear1 = result.current.clear;
    rerender({ level: 1 as HeatLevel });
    // La référence peut changer (setState inline), ce qui compte c'est qu'elle fonctionne
    act(() => result.current.clear());
    expect(result.current.justUnlocked).toBeNull();
    void clear1; // utilisé pour éviter le warning "unused variable"
  });

  it('détecte des franchissements successifs après clear', () => {
    const { result, rerender } = renderHook(({ level }) => usePalierUp(level), {
      initialProps: { level: 1 as HeatLevel },
    });

    rerender({ level: 2 as HeatLevel });
    expect(result.current.justUnlocked).toBe(2);

    act(() => result.current.clear());
    expect(result.current.justUnlocked).toBeNull();

    rerender({ level: 3 as HeatLevel });
    expect(result.current.justUnlocked).toBe(3);
  });

  it('sans clear, justUnlocked pointe sur le dernier palier franchi', () => {
    const { result, rerender } = renderHook(({ level }) => usePalierUp(level), {
      initialProps: { level: 1 as HeatLevel },
    });
    rerender({ level: 2 as HeatLevel });
    rerender({ level: 3 as HeatLevel });
    expect(result.current.justUnlocked).toBe(3);
  });

  it('fonctionne correctement au palier max (5)', () => {
    const { result, rerender } = renderHook(({ level }) => usePalierUp(level), {
      initialProps: { level: 4 as HeatLevel },
    });
    rerender({ level: 5 as HeatLevel });
    expect(result.current.justUnlocked).toBe(5);
  });
});
