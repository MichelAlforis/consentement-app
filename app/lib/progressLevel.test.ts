import { describe, it, expect } from 'vitest';
import { getProgressLevel } from './progressLevel';

describe('getProgressLevel', () => {
  it('returns 1 when no modules completed', () => {
    expect(getProgressLevel([])).toBe(1);
  });

  it('returns 2 with easy modules only', () => {
    expect(getProgressLevel(['quiz-consentement'])).toBe(2);
    expect(getProgressLevel(['porno-vs-realite'])).toBe(2);
    expect(getProgressLevel(['quiz-consentement', 'porno-vs-realite'])).toBe(2);
  });

  it('returns 3 with loi-consentement', () => {
    expect(getProgressLevel(['loi-consentement'])).toBe(3);
  });

  it('returns 3 with duo-flow', () => {
    expect(getProgressLevel(['duo-flow'])).toBe(3);
  });

  it('returns 3 with accompagnement-mineur', () => {
    expect(getProgressLevel(['accompagnement-mineur'])).toBe(3);
  });

  it('returns 3 with module-pratiques-adultes', () => {
    expect(getProgressLevel(['module-pratiques-adultes'])).toBe(3);
  });

  it('returns 3 when deep module mixed with easy modules', () => {
    expect(getProgressLevel(['quiz-consentement', 'loi-consentement'])).toBe(3);
  });

  it('returns 3 regardless of order', () => {
    expect(getProgressLevel(['loi-consentement', 'quiz-consentement'])).toBe(3);
  });

  it('returns 2 with unknown module id', () => {
    expect(getProgressLevel(['module-inconnu'])).toBe(2);
  });
});
