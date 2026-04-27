import { describe, expect, it } from 'vitest';
import { getGameDescriptionKey, getVisibleGameMenuItems } from './gamesMenu';

describe('gamesMenu', () => {
  it('orders games declaratively by section', () => {
    expect(getVisibleGameMenuItems(true, 'free').map((item) => item.id)).toEqual(['dice']);
    expect(getVisibleGameMenuItems(true, 'premium').map((item) => item.id)).toEqual([
      'goose',
      'cards',
      'scenarios',
    ]);
    expect(getVisibleGameMenuItems(true, 'collection').map((item) => item.id)).toEqual(['collection']);
  });

  it('filters adult-only games for minors', () => {
    expect(getVisibleGameMenuItems(false, 'premium').map((item) => item.id)).toEqual([
      'goose',
      'cards',
    ]);
  });

  it('resolves age-specific descriptions', () => {
    const dice = getVisibleGameMenuItems(true, 'free')[0];

    expect(getGameDescriptionKey(dice, true)).toBe('games.dice.descAdult');
    expect(getGameDescriptionKey(dice, false)).toBe('games.dice.descMinor');
  });
});
