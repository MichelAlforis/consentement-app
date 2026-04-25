import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useGooseGame } from './useGooseGame';

const { mockUnlockCards, mockGetState } = vi.hoisted(() => {
  const mockUnlockCards = vi.fn();
  const mockGetState = vi.fn(() => ({ ownedCards: [], unlockCards: mockUnlockCards }));
  return { mockUnlockCards, mockGetState };
});

vi.mock('../../../../stores', () => ({
  useUnlockStore: Object.assign(
    vi.fn(() => ({ ownedCards: [], unlockCards: mockUnlockCards })),
    { getState: mockGetState }
  ),
}));

// Capture le callback onDiceLanded pour simuler un lancer dans les tests
let capturedOnDiceLanded: (face: 1 | 2 | 3 | 4 | 5 | 6) => void = () => {};

vi.mock('./useDice', () => ({
  useDice: vi.fn((onLanded: (face: number) => void) => {
    capturedOnDiceLanded = onLanded;
    return { diceResult: null, isRolling: false, roll: vi.fn(), handleRollComplete: vi.fn() };
  }),
}));

// animate appelle le callback immédiatement (pas d'animation réelle en test)
vi.mock('./usePawnAnimation', () => ({
  usePawnAnimation: () => ({
    animatingPos: null,
    animate: vi.fn((_from: number, _to: number, cb: () => void) => cb()),
  }),
}));

vi.mock('./useConfetti', () => ({
  useConfetti: () => ({ show: false, key: 0, trigger: vi.fn() }),
}));

vi.mock('../../../../game-engine/shared/useHaptics', () => ({
  useHaptics: () => ({ vibrate: vi.fn() }),
}));

vi.mock('../../../../stores/settingsStore', () => ({
  useSettingsStore: (selector: (s: { explicitMode: boolean }) => unknown) =>
    selector({ explicitMode: false }),
}));

vi.mock('../../../../data/goose-game', async () => {
  const actual = await vi.importActual('../../../../data/goose-game') as Record<string, unknown>;
  return { ...actual, loadSavedGame: vi.fn(() => null), saveGame: vi.fn(), clearSavedGame: vi.fn() };
});

// Helper : amène le hook jusqu'à la phase playing avec deux joueurs configurés
function setupPlaying() {
  const hook = renderHook(() => useGooseGame({ isAdult: false }));
  act(() => { hook.result.current.handleP1Confirm('Alice', '🦊'); });
  act(() => { hook.result.current.handleP2Confirm('Bob', '🐼'); });
  act(() => { hook.result.current.startNewGame(); });
  return hook;
}

describe('useGooseGame', () => {
  beforeEach(() => {
    capturedOnDiceLanded = () => {};
    mockUnlockCards.mockClear();
  });

  // ── Setup ──────────────────────────────────────────────────────────────────

  it('phase initiale : intro, joueurs null', () => {
    const { result } = renderHook(() => useGooseGame({ isAdult: false }));
    expect(result.current.phase).toBe('intro');
    expect(result.current.p1).toBeNull();
    expect(result.current.p2).toBeNull();
  });

  it('handleP1Confirm → p1 défini, phase setup-p2', () => {
    const { result } = renderHook(() => useGooseGame({ isAdult: false }));
    act(() => { result.current.handleP1Confirm('Alice', '🦊'); });
    expect(result.current.p1).toMatchObject({ name: 'Alice', emoji: '🦊' });
    expect(result.current.phase).toBe('setup-p2');
  });

  it('handleP2Confirm → p2 défini, phase pacte', () => {
    const { result } = renderHook(() => useGooseGame({ isAdult: false }));
    act(() => { result.current.handleP1Confirm('Alice', '🦊'); });
    act(() => { result.current.handleP2Confirm('Bob', '🐼'); });
    expect(result.current.p2).toMatchObject({ name: 'Bob', emoji: '🐼' });
    expect(result.current.phase).toBe('pacte');
  });

  it('startNewGame → phase playing, positions 0/0, joueur 0 en premier', () => {
    const { result } = setupPlaying();
    expect(result.current.phase).toBe('playing');
    expect(result.current.pos0).toBe(0);
    expect(result.current.pos1).toBe(0);
    expect(result.current.curPlayer).toBe(0);
  });

  // ── Tour et alternance ─────────────────────────────────────────────────────

  it('endTurn alterne curPlayer 0 → 1 → 0', () => {
    const { result } = setupPlaying();
    expect(result.current.curPlayer).toBe(0);
    act(() => { result.current.endTurn(); });
    expect(result.current.curPlayer).toBe(1);
    act(() => { result.current.endTurn(); });
    expect(result.current.curPlayer).toBe(0);
  });

  // ── Dé et déplacement ─────────────────────────────────────────────────────

  it('lancer de dé 3 → joueur 0 avance à la case 3', () => {
    const { result } = setupPlaying();
    act(() => { capturedOnDiceLanded(3); });
    expect(result.current.pos0).toBe(3);
  });

  it('lancer de dé pour joueur 1 → pos1 avance', () => {
    const { result } = setupPlaying();
    act(() => { result.current.endTurn(); }); // joueur 1
    act(() => { capturedOnDiceLanded(4); });
    expect(result.current.pos1).toBe(4);
    expect(result.current.pos0).toBe(0); // joueur 0 n'a pas bougé
  });

  it('pion bloqué à la case 23 (arrivée)', () => {
    const { result } = setupPlaying();
    // Avancer près de la fin : 6+6+6 = 18
    act(() => { capturedOnDiceLanded(6); }); // pos0=6
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); }); // retour joueur 0
    act(() => { capturedOnDiceLanded(6); }); // pos0=12
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); });
    act(() => { capturedOnDiceLanded(6); }); // pos0=18
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); });
    act(() => { capturedOnDiceLanded(6); }); // 18+6=24 → capé à 23
    expect(result.current.pos0).toBe(23);
  });

  // ── Accord ────────────────────────────────────────────────────────────────

  it('handleAccordResult(true) → accordsCount++, tour suivant', () => {
    const { result } = setupPlaying();
    expect(result.current.accordsCount).toBe(0);
    act(() => { result.current.handleAccordResult(true); });
    expect(result.current.accordsCount).toBe(1);
    expect(result.current.curPlayer).toBe(1);
  });

  it('handleAccordResult(false) → accordsCount inchangé', () => {
    const { result } = setupPlaying();
    act(() => { result.current.handleAccordResult(false); });
    expect(result.current.accordsCount).toBe(0);
  });

  // ── Reset ──────────────────────────────────────────────────────────────────

  it('resetToIntro → phase intro, savedGame null', () => {
    const { result } = setupPlaying();
    act(() => { result.current.resetToIntro(); });
    expect(result.current.phase).toBe('intro');
    expect(result.current.savedGame).toBeNull();
  });
});

// ── Sprint 5 — Triggers gain de cartes (5.7) ──────────────────────────────────

describe('Triggers gain de cartes GooseGame', () => {
  beforeEach(() => { mockUnlockCards.mockClear(); });

  it('5.7a — case complicite (index 13) → unlockCards rarity:rare + goose-complicite', () => {
    const { result } = setupPlaying();
    // 0 → 6 → 12 → 13 (complicite) via trois lancers
    act(() => { capturedOnDiceLanded(6); }); // pos0=6 (normal)
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); });
    act(() => { capturedOnDiceLanded(6); }); // pos0=12 (normal)
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); });
    act(() => { capturedOnDiceLanded(1); }); // pos0=13 → complicite
    expect(mockUnlockCards).toHaveBeenCalledOnce();
    expect(mockUnlockCards).toHaveBeenCalledWith([
      expect.objectContaining({ rarity: 'rare', unlockedBy: 'goose-complicite' }),
    ]);
  });

  it('5.7b — arrivée (index 23) → unlockCards rarity:unique + goose-slow', () => {
    const { result } = setupPlaying();
    // 0 → 6 → 12 → 18 → 23
    act(() => { capturedOnDiceLanded(6); }); // pos0=6 (normal)
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); });
    act(() => { capturedOnDiceLanded(6); }); // pos0=12 (normal)
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); });
    act(() => { capturedOnDiceLanded(6); }); // pos0=18 (accord)
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); });
    act(() => { capturedOnDiceLanded(6); }); // 18+6=24 → capé 23 → arrivée
    expect(mockUnlockCards).toHaveBeenCalledOnce();
    expect(mockUnlockCards).toHaveBeenCalledWith([
      expect.objectContaining({ rarity: 'unique', unlockedBy: 'goose-slow' }),
    ]);
  });

  it('5.7c — complicite avec toutes rares possédées → unlockCards non appelé', () => {
    // IDs réels des cartes rares dans cards-collector.ts (ca-005, ca-006, ca-007)
    const allRaresOwned = [
      { id: 'ca-005', rarity: 'rare' as const, gainedOn: '', unlockedBy: '' },
      { id: 'ca-006', rarity: 'rare' as const, gainedOn: '', unlockedBy: '' },
      { id: 'ca-007', rarity: 'rare' as const, gainedOn: '', unlockedBy: '' },
    ];
    mockGetState.mockReturnValueOnce({ ownedCards: allRaresOwned, unlockCards: mockUnlockCards } as never);
    const { result } = setupPlaying();
    act(() => { capturedOnDiceLanded(6); });
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); });
    act(() => { capturedOnDiceLanded(6); });
    act(() => { result.current.endTurn(); }); act(() => { result.current.endTurn(); });
    act(() => { capturedOnDiceLanded(1); }); // pos0=13 → complicite, pool vide
    expect(mockUnlockCards).not.toHaveBeenCalled();
  });
});
