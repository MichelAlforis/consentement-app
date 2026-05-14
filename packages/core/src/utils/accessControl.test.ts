import { describe, expect, it } from 'vitest';
import { canAccessFeature, canAccessScreen, safeScreenForAccess } from './accessControl';

describe('accessControl', () => {
  it('blocks adult-only screens for minors and unknown age', () => {
    expect(canAccessScreen('duo-space', { isAdult: false })).toBe(false);
    expect(canAccessScreen('duo-space', { isAdult: null })).toBe(false);
    expect(canAccessScreen('duo-space', { isAdult: true })).toBe(true);
  });

  it('keeps public screens accessible', () => {
    expect(canAccessScreen('apprendre', { isAdult: false })).toBe(true);
    expect(canAccessScreen('settings', { isAdult: null })).toBe(true);
  });

  it('returns a safe fallback for inaccessible screens', () => {
    expect(safeScreenForAccess('personal-space', { isAdult: false })).toBe('home');
    expect(safeScreenForAccess('personal-space', { isAdult: true })).toBe('personal-space');
  });

  it('gates explicit content by adult status and heat level', () => {
    expect(canAccessFeature('explicit', { isAdult: true, heatLevel: 1 })).toBe(false);
    expect(canAccessFeature('explicit', { isAdult: true, heatLevel: 2 })).toBe(true);
    expect(canAccessFeature('explicit', { isAdult: false, heatLevel: 5 })).toBe(false);
    expect(canAccessFeature('explicit', { isAdult: null, heatLevel: 5 })).toBe(false);
  });
});
