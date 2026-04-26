import { describe, it, expect, beforeEach } from 'vitest';
import { useRevealStore } from './revealStore';

const store = () => useRevealStore.getState();

beforeEach(() => {
  store().clearPending();
});

describe('revealStore', () => {
  it('état initial : pendingIds vide', () => {
    expect(store().pendingIds).toEqual([]);
  });

  it('setPending remplace les ids', () => {
    store().setPending(['ca-01', 'ca-02']);
    expect(store().pendingIds).toEqual(['ca-01', 'ca-02']);
  });

  it('setPending([]) → liste vide', () => {
    store().setPending(['ca-01']);
    store().setPending([]);
    expect(store().pendingIds).toEqual([]);
  });

  it('clearPending remet à zéro', () => {
    store().setPending(['ca-01', 'ca-02', 'ca-03']);
    store().clearPending();
    expect(store().pendingIds).toEqual([]);
  });

  it('deux setPending successifs — le dernier gagne', () => {
    store().setPending(['ca-01']);
    store().setPending(['ca-10', 'ca-11']);
    expect(store().pendingIds).toEqual(['ca-10', 'ca-11']);
  });

  it("setPending préserve l'ordre des ids", () => {
    const ids = ['cm-05', 'ca-01', 'ca-20'];
    store().setPending(ids);
    expect(store().pendingIds).toEqual(ids);
  });
});
