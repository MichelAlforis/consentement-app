import { describe, expect, it } from 'vitest';
import { isRootScreen, isTabRootScreen, screenMeta, tabScreens } from './screenMeta';

describe('screenMeta', () => {
  it('keeps tab roots, root screens, and tab order in one config', () => {
    expect(tabScreens.map((tab) => tab.screen)).toEqual(['home', 'apprendre', 'jeux', 'moi']);

    for (const tab of tabScreens) {
      expect(isRootScreen(tab.screen)).toBe(true);
      expect(isTabRootScreen(tab.screen)).toBe(true);
    }
  });

  it('keeps legacy learning routes explicit', () => {
    expect(screenMeta.learn.legacy?.replacement).toBe('apprendre');
    expect(screenMeta['scenarios-minor'].legacy?.replacement).toBe('apprendre');
    expect(screenMeta.feelings.legacy?.replacement).toBe('apprendre');
  });
});
