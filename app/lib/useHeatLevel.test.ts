import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHeatLevel } from './useHeatLevel';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { useUnlockStore } from '../stores/unlockStore';
import { useProfileStore } from '../stores/profileStore';
import { useAuthStore } from '../stores/authStore';
import { useLexiqueStore } from '../stores/lexiqueStore';
import type { OwnedCard } from '../stores/unlockStore';

function makeCard(id: string, rarity: OwnedCard['rarity']): OwnedCard {
  return { id, rarity, gainedOn: '2026-01-01', unlockedBy: 'test' };
}

beforeEach(() => {
  useModuleProgressStore.setState({ completedModules: [] });
  useUnlockStore.setState({ ownedCards: [], sessionCount: 0 });
  useProfileStore.setState((s) => ({
    personalProfile: {
      ...s.personalProfile,
      safeword: '',
      tenderness: {},
      intensity: {},
      trust: {},
    },
  }));
  useAuthStore.setState({ pronouns: null });
  useLexiqueStore.setState({ unlockedIds: [] });
});

describe('useHeatLevel — état initial', () => {
  it('starts at 0 pts, palier 1', () => {
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.points).toBe(0);
    expect(result.current.level).toBe(1);
  });

  it('breakdown toutes sources à 0', () => {
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown).toEqual({ modules: 0, cards: 0, sessions: 0, profile: 0, lexique: 0, preferences: 0 });
  });

  it('profileDetails initial : tout à zéro / false', () => {
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.profileDetails).toEqual({ comfortFilled: 0, safewordSet: false, pronounsSet: false });
  });
});

describe('useHeatLevel — modules', () => {
  it('module-de-base complété → 3 pts module', () => {
    useModuleProgressStore.setState({ completedModules: ['module-de-base'] });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.modules).toBe(3);
  });

  it('module inconnu ignoré', () => {
    useModuleProgressStore.setState({ completedModules: ['module-inexistant'] });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.modules).toBe(0);
  });
});

describe('useHeatLevel — cartes', () => {
  it('24 cartes common → 24 pts cards', () => {
    const cards = Array.from({ length: 24 }, (_, i) => makeCard(`c-${i}`, 'common'));
    useUnlockStore.setState({ ownedCards: cards, sessionCount: 0 });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.cards).toBe(24);
  });

  it('1 rare → 2 pts, 1 unique → 5 pts', () => {
    useUnlockStore.setState({ ownedCards: [makeCard('r1', 'rare'), makeCard('u1', 'unique')], sessionCount: 0 });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.cards).toBe(7);
  });
});

describe('useHeatLevel — sessions', () => {
  it('sessionCount = 5 → 5 pts sessions', () => {
    useUnlockStore.setState({ ownedCards: [], sessionCount: 5 });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.sessions).toBe(5);
  });
});

describe('useHeatLevel — profil', () => {
  it('safeword défini → +3 pts profile', () => {
    useProfileStore.setState((s) => ({
      personalProfile: { ...s.personalProfile, safeword: 'ananas' },
    }));
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.profile).toBe(3);
    expect(result.current.profileDetails.safewordSet).toBe(true);
  });

  it('pronoms renseignés → +2 pts profile', () => {
    useAuthStore.setState({ pronouns: 'il/lui' });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.profile).toBe(2);
    expect(result.current.profileDetails.pronounsSet).toBe(true);
  });

  it('1 catégorie confort renseignée → +1 pt profile, comfortFilled = 1', () => {
    useProfileStore.setState((s) => ({
      personalProfile: { ...s.personalProfile, tenderness: { item1: 3 } },
    }));
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.profile).toBe(1);
    expect(result.current.profileDetails.comfortFilled).toBe(1);
  });

  it('3 catégories + safeword + pronoms → 8 pts profile (max)', () => {
    useProfileStore.setState((s) => ({
      personalProfile: {
        ...s.personalProfile,
        safeword: 'ok',
        tenderness: { a: 1 },
        intensity: { b: 2 },
        trust: { c: 3 },
      },
    }));
    useAuthStore.setState({ pronouns: 'iel' });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.profile).toBe(8);
    expect(result.current.profileDetails.comfortFilled).toBe(3);
  });
});

describe('useHeatLevel — lexique', () => {
  it('lexique séparé du bucket profile', () => {
    useLexiqueStore.setState({ unlockedIds: ['mot-1', 'mot-2', 'mot-3'] });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.lexique).toBe(3);
    expect(result.current.breakdown.profile).toBe(0);
  });

  it('lexique + profile sont additifs dans le total', () => {
    useLexiqueStore.setState({ unlockedIds: ['mot-1', 'mot-2'] });
    useProfileStore.setState((s) => ({
      personalProfile: { ...s.personalProfile, safeword: 'stop' },
    }));
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.breakdown.lexique).toBe(2);
    expect(result.current.breakdown.profile).toBe(3);
    expect(result.current.points).toBe(5);
  });
});

describe('useHeatLevel — paliers', () => {
  it('module-de-base + 24 cartes → 27 pts → palier 2', () => {
    const cards = Array.from({ length: 24 }, (_, i) => makeCard(`c-${i}`, 'common'));
    useModuleProgressStore.setState({ completedModules: ['module-de-base'] });
    useUnlockStore.setState({ ownedCards: cards, sessionCount: 0 });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.points).toBe(27);
    expect(result.current.level).toBe(2);
  });

  it('progress + toNext cohérents au palier 1', () => {
    useUnlockStore.setState({ ownedCards: [], sessionCount: 5 });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.progress).toBeCloseTo(5 / 12, 3);
    expect(result.current.toNext).toBe(7);
  });

  it('toNext est null au palier 5', () => {
    const cards = Array.from({ length: 130 }, (_, i) => makeCard(`c-${i}`, 'common'));
    useUnlockStore.setState({ ownedCards: cards, sessionCount: 0 });
    const { result } = renderHook(() => useHeatLevel());
    expect(result.current.toNext).toBeNull();
    expect(result.current.level).toBe(5);
  });
});
