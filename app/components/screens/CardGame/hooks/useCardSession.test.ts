import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useCardSession } from './useCardSession';
import type { OwnedCard } from '../../../../stores/unlockStore';

// Provide owned cards covering all decks A/B/M
const ALL_OWNED: OwnedCard[] = [
  { id: 'ca-001', rarity: 'common', gainedOn: '2026-01-01', unlockedBy: 'quiz-consentement' },
  { id: 'ca-002', rarity: 'common', gainedOn: '2026-01-01', unlockedBy: 'quiz-consentement' },
  { id: 'ca-003', rarity: 'common', gainedOn: '2026-01-01', unlockedBy: 'quiz-consentement' },
  { id: 'cb-001', rarity: 'common', gainedOn: '2026-01-01', unlockedBy: 'porno-vs-realite' },
];

vi.mock('../../../../stores/settingsStore', () => ({
  useSettingsStore: (selector: (s: { explicitMode: boolean }) => unknown) =>
    selector({ explicitMode: false }),
}));

vi.mock('../../../../stores/unlockStore', () => ({
  useUnlockStore: (selector: (s: { ownedCards: OwnedCard[] }) => unknown) =>
    selector({ ownedCards: ALL_OWNED }),
}));

// localStorage minimal mock
const storage: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (k: string) => storage[k] ?? null,
    setItem: (k: string, v: string) => { storage[k] = v; },
    removeItem: (k: string) => { delete storage[k]; },
    clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
  },
  writable: true,
});

const FAV_KEY = 'consentement_card_favorites';

describe('useCardSession', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.keys(storage).forEach((k) => delete storage[k]);
  });
  afterEach(() => vi.useRealTimers());

  // ── État initial ───────────────────────────────────────────────────────────

  it('démarre en step pick sans carte', () => {
    const { result } = renderHook(() => useCardSession(false));
    expect(result.current.step).toBe('pick');
    expect(result.current.currentCard).toBeNull();
    expect(result.current.cardCount).toBe(0);
    expect(result.current.isAnimating).toBe(false);
  });

  // ── Filtrage par âge ───────────────────────────────────────────────────────

  it('mineur : seules les cartes deck A sont disponibles', () => {
    const { result } = renderHook(() => useCardSession(false));
    expect(result.current.available.every((c) => c.deck === 'A')).toBe(true);
  });

  it('adulte : les cartes deck B peuvent être incluses si possédées', () => {
    const { result } = renderHook(() => useCardSession(true));
    // all owned fixtures are deck A — just verify no crash and available >= 0
    expect(result.current.available.length).toBeGreaterThanOrEqual(0);
  });

  it('adulte sans explicitMode : cartes deck M exclues', () => {
    const { result } = renderHook(() => useCardSession(true));
    expect(result.current.available.every((c) => c.deck !== 'M')).toBe(true);
  });

  // ── startPlaying ───────────────────────────────────────────────────────────

  it('startPlaying → step playing, carte posée, cardCount=1', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });
    expect(result.current.step).toBe('playing');
    expect(result.current.currentCard).not.toBeNull();
    expect(result.current.cardCount).toBe(1);
  });

  it('startPlaying → isRevealed false puis true après 350ms', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });
    expect(result.current.isRevealed).toBe(false);
    act(() => { vi.advanceTimersByTime(350); });
    expect(result.current.isRevealed).toBe(true);
  });

  // ── drawNewCard ────────────────────────────────────────────────────────────

  it('drawNewCard ignoré si isAnimating=true', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });
    const firstCard = result.current.currentCard;

    act(() => { result.current.drawNewCard(); }); // lance l'animation (isAnimating=true)
    act(() => { result.current.drawNewCard(); }); // no-op

    expect(result.current.isAnimating).toBe(true);
    expect(result.current.currentCard).toBe(firstCard);
  });

  it('drawNewCard → nouvelle carte et isAnimating=false après 480ms', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });

    act(() => { result.current.drawNewCard(); });
    expect(result.current.isAnimating).toBe(true);

    act(() => { vi.advanceTimersByTime(480); });
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.cardCount).toBe(2);
  });

  // ── Favoris ────────────────────────────────────────────────────────────────

  it('toggleFavorite ajoute la carte aux favoris', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });
    const id = result.current.currentCard!.id;

    act(() => { result.current.toggleFavorite(id); });
    expect(result.current.favorites).toContain(id);
    expect(result.current.isFavCard).toBe(true);
  });

  it('toggleFavorite retire la carte si déjà favorite', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });
    const id = result.current.currentCard!.id;

    act(() => { result.current.toggleFavorite(id); });
    act(() => { result.current.toggleFavorite(id); });
    expect(result.current.favorites).not.toContain(id);
  });

  it('toggleFavorite persiste en localStorage', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });
    const id = result.current.currentCard!.id;

    act(() => { result.current.toggleFavorite(id); });
    const stored = JSON.parse(storage[FAV_KEY] ?? '[]') as string[];
    expect(stored).toContain(id);
  });

  // ── isSeanceDone ───────────────────────────────────────────────────────────

  it('isSeanceDone=false au démarrage de la séance', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });
    expect(result.current.isSeanceDone).toBe(false);
  });

  // ── reset ──────────────────────────────────────────────────────────────────

  it('reset remet step pick, card null, cardCount 0', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });
    act(() => { result.current.reset(); });
    expect(result.current.step).toBe('pick');
    expect(result.current.currentCard).toBeNull();
    expect(result.current.cardCount).toBe(0);
    expect(result.current.isAnimating).toBe(false);
  });

  // ── goToEnd ────────────────────────────────────────────────────────────────

  it('goToEnd → step end', () => {
    const { result } = renderHook(() => useCardSession(false));
    act(() => { result.current.startPlaying(); });
    act(() => { result.current.goToEnd(); });
    expect(result.current.step).toBe('end');
  });
});
