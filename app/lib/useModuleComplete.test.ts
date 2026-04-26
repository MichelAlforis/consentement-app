import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useModuleComplete } from './useModuleComplete';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { useUnlockStore } from '../stores/unlockStore';
import { useRevealStore } from '../stores/revealStore';

// Contrôle isAdult via mock — mutable entre tests
let currentIsAdult: boolean | null = true;

vi.mock('../stores/authStore', () => ({
  useAuthStore: (sel: (s: { isAdult: boolean | null }) => unknown) =>
    sel({ isAdult: currentIsAdult }),
}));

// Helpers
const modules = () => useModuleProgressStore.getState();
const owned   = () => useUnlockStore.getState();
const reveal  = () => useRevealStore.getState();

describe('useModuleComplete', () => {
  beforeEach(() => {
    currentIsAdult = true;
    modules().reset();
    owned().reset();
    reveal().clearPending();
    localStorage.clear();
  });

  // ── Adulte — cartes retournées ─────────────────────────────────────────────

  it('adulte — module-de-base : retourne 24 cartes Deck A communes', () => {
    const { result } = renderHook(() => useModuleComplete());
    let n = 0;
    act(() => { n = result.current('module-de-base'); });
    expect(n).toBe(24);
    expect(owned().ownedCards).toHaveLength(24);
    expect(owned().ownedCards.every((c) => c.id.startsWith('ca-'))).toBe(true);
    expect(owned().ownedCards.every((c) => c.rarity === 'common')).toBe(true);
  });

  it('adulte — quiz-consentement : retourne 1 carte commune', () => {
    const { result } = renderHook(() => useModuleComplete());
    let n = 0;
    act(() => { n = result.current('quiz-consentement'); });
    expect(n).toBe(1);
    expect(owned().ownedCards[0].rarity).toBe('common');
    expect(owned().ownedCards[0].unlockedBy).toBe('quiz-consentement');
  });

  it('adulte — loi-consentement : retourne 1 carte rare', () => {
    const { result } = renderHook(() => useModuleComplete());
    let n = 0;
    act(() => { n = result.current('loi-consentement'); });
    expect(n).toBe(1);
    expect(owned().ownedCards[0].rarity).toBe('rare');
  });

  it('adulte — duo-flow : retourne 1 carte rare', () => {
    const { result } = renderHook(() => useModuleComplete());
    let n = 0;
    act(() => { n = result.current('duo-flow'); });
    expect(n).toBe(1);
    expect(owned().ownedCards[0].rarity).toBe('rare');
  });

  // ── Mineur — résolution moduleId ───────────────────────────────────────────

  it('mineur — module-de-base → résout vers module-de-base-mineur, 24 cartes Deck M', () => {
    currentIsAdult = false;
    const { result } = renderHook(() => useModuleComplete());
    let n = 0;
    act(() => { n = result.current('module-de-base'); });
    expect(n).toBe(24);
    expect(owned().ownedCards.every((c) => c.id.startsWith('cm-'))).toBe(true);
    expect(modules().completedModules).toContain('module-de-base-mineur');
    expect(modules().completedModules).not.toContain('module-de-base');
  });

  it('mineur — quiz-consentement → résout vers quiz-consentement-mineur', () => {
    currentIsAdult = false;
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('quiz-consentement'); });
    expect(modules().completedModules).toContain('quiz-consentement-mineur');
    expect(modules().completedModules).not.toContain('quiz-consentement');
  });

  it('mineur — accompagnement-mineur : pas de résolution (déjà mineur), 1 carte rare Deck M', () => {
    currentIsAdult = false;
    const { result } = renderHook(() => useModuleComplete());
    let n = 0;
    act(() => { n = result.current('accompagnement-mineur'); });
    expect(n).toBe(1);
    expect(owned().ownedCards[0].rarity).toBe('rare');
    expect(owned().ownedCards[0].id.startsWith('cm-')).toBe(true);
  });

  // ── completedModules ───────────────────────────────────────────────────────

  it('completedModules contient l\'effectiveId après complétion', () => {
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('loi-consentement'); });
    expect(modules().completedModules).toContain('loi-consentement');
  });

  it('markModuleComplete toujours appelé même si 0 nouvelles cartes', () => {
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('module-inexistant'); });
    expect(modules().completedModules).toContain('module-inexistant');
  });

  // ── Idempotence ────────────────────────────────────────────────────────────

  it('idempotent : deuxième appel au même module → retourne 0', () => {
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('quiz-consentement'); });
    let second = -1;
    act(() => { second = result.current('quiz-consentement'); });
    expect(second).toBe(0);
  });

  it('idempotent : ownedCards inchangé au deuxième appel', () => {
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('quiz-consentement'); });
    const firstIds = owned().ownedCards.map((c) => c.id);
    act(() => { result.current('quiz-consentement'); });
    expect(owned().ownedCards.map((c) => c.id)).toEqual(firstIds);
  });

  // ── pendingIds ─────────────────────────────────────────────────────────────

  it('pendingIds = IDs des cartes gagnées après complétion', () => {
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('quiz-consentement'); });
    const ids = owned().ownedCards.map((c) => c.id);
    expect(reveal().pendingIds).toEqual(ids);
  });

  it('pendingIds reste vide si 0 nouvelles cartes (module inconnu)', () => {
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('module-inexistant'); });
    expect(reveal().pendingIds).toHaveLength(0);
  });

  it('pendingIds non re-settés au deuxième appel idempotent', () => {
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('quiz-consentement'); });
    reveal().clearPending(); // simule la fermeture de l'overlay
    act(() => { result.current('quiz-consentement'); });
    expect(reveal().pendingIds).toHaveLength(0);
  });

  // ── Invariant ownedCards append-only ──────────────────────────────────────

  it('deux modules différents : ownedCards cumule sans dédoublons', () => {
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('quiz-consentement'); });
    const firstId = owned().ownedCards[0].id;
    act(() => { result.current('porno-vs-realite'); });
    const ids = owned().ownedCards.map((c) => c.id);
    expect(ids).toContain(firstId);
    expect(new Set(ids).size).toBe(ids.length); // pas de dédoublon
    expect(ids).toHaveLength(2);
  });

  it('gainedOn est une date ISO valide', () => {
    const { result } = renderHook(() => useModuleComplete());
    act(() => { result.current('quiz-consentement'); });
    const date = owned().ownedCards[0].gainedOn;
    expect(() => new Date(date)).not.toThrow();
    expect(new Date(date).getFullYear()).toBeGreaterThan(2020);
  });
});
