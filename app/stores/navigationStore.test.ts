import { beforeEach, describe, expect, it } from 'vitest';
import { selectCanGoBack, useNavigationStore } from './navigationStore';

const store = () => useNavigationStore.getState();

beforeEach(() => {
  useNavigationStore.setState({ currentScreen: 'home', history: [] });
});

describe('navigationStore', () => {
  it('pushes previous screens into history on navigateTo', () => {
    store().navigateTo('apprendre');
    store().navigateTo('quiz-consentement');

    expect(store().currentScreen).toBe('quiz-consentement');
    expect(store().history).toEqual(['home', 'apprendre']);
  });

  it('goBack returns to the previous screen instead of always home', () => {
    store().navigateTo('apprendre');
    store().navigateTo('quiz-consentement');

    store().goBack();

    expect(store().currentScreen).toBe('apprendre');
    expect(store().history).toEqual(['home']);
  });

  it('replaceWith does not add the replaced screen to history', () => {
    store().navigateTo('personal-space');
    store().replaceWith('home');

    expect(store().currentScreen).toBe('home');
    expect(store().history).toEqual(['home']);
  });

  it('replaceWith is idempotent — no state change when already on target', () => {
    store().navigateTo('apprendre');
    const before = store();
    store().replaceWith('apprendre');

    expect(store().currentScreen).toBe(before.currentScreen);
    expect(store().history).toEqual(before.history);
  });

  it('selectCanGoBack requires both history and a non-root screen', () => {
    expect(selectCanGoBack('quiz-consentement', ['apprendre'])).toBe(true);
    expect(selectCanGoBack('quiz-consentement', [])).toBe(false);
    expect(selectCanGoBack('home', ['quiz-consentement'])).toBe(false);
  });
});
