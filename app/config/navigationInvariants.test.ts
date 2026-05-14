import { describe, expect, it } from 'vitest';
import { ROUTES } from '../routes';
import type { Screen } from '../types';
import { screenMeta } from './screenMeta';

const routeScreens = Object.keys(ROUTES).sort();
const metaScreens = Object.keys(screenMeta).sort();

describe('navigation invariants', () => {
  it('keeps routes and screen metadata in sync at runtime', () => {
    expect(metaScreens).toEqual(routeScreens);
  });

  it('redirects legacy standalone onboarding screens to the canonical wizard', () => {
    const legacyOnboardingScreens: Screen[] = ['language', 'welcome', 'age-check', 'auth', 'personal-intro'];
    for (const screen of legacyOnboardingScreens) {
      expect(screenMeta[screen].legacy?.replacement).toBe('onboarding');
    }
  });

  it('marks adult-only screens explicitly in route config', () => {
    expect(ROUTES['personal-space'].requiresAdult).toBe(true);
    expect(ROUTES['duo-space'].requiresAdult).toBe(true);
    expect(ROUTES['quiz-hub'].requiresAdult).toBe(true);
    expect(ROUTES['accompagnement-adulte'].requiresAdult).toBe(true);
    expect(ROUTES['annuaire-sexologues'].requiresAdult).toBe(true);
  });
});
