import { describe, expect, it } from 'vitest';
import { isTabRootScreen, screenMeta, tabScreens } from './screenMeta';

describe('screenMeta', () => {
  it('defines exactly 4 tabs in the correct order', () => {
    expect(tabScreens.map((tab) => tab.screen)).toEqual(['home', 'apprendre', 'jeux', 'moi']);
  });

  it('tab screens are all recognised as tab roots', () => {
    for (const tab of tabScreens) {
      expect(isTabRootScreen(tab.screen)).toBe(true);
    }
  });

  it('non-tab screens are not tab roots', () => {
    expect(isTabRootScreen('jeu-des')).toBe(false);
    expect(isTabRootScreen('premium')).toBe(false);
    expect(isTabRootScreen('settings')).toBe(false);
  });

  it('keeps legacy learning routes explicit', () => {
    expect(screenMeta.learn.legacy?.replacement).toBe('apprendre');
    expect(screenMeta['scenarios-minor'].legacy?.replacement).toBe('apprendre');
    expect(screenMeta.feelings.legacy?.replacement).toBe('apprendre');
  });
});
