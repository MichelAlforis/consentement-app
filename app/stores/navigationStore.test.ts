import { beforeEach, describe, expect, it } from 'vitest';
import {
  useNavigationStore,
  selectCurrentScreen,
  selectCanGoBack,
  selectIsAtTabRoot,
} from './navigationStore';

const store = () => useNavigationStore.getState();
const screen = () => selectCurrentScreen(useNavigationStore.getState());
const canGoBack = () => selectCanGoBack(useNavigationStore.getState());
const atTabRoot = () => selectIsAtTabRoot(useNavigationStore.getState());

beforeEach(() => {
  useNavigationStore.setState({
    fullscreenStack: [],
    activeTab: 'home',
    tabStacks: { home: ['home'], apprendre: ['apprendre'], jeux: ['jeux'], moi: ['moi'] },
    modalStack: [],
  });
});

describe('navigationStore', () => {
  it('pushes screens into the active tab stack on navigateTo', () => {
    store().navigateTo('quiz-consentement');
    expect(screen()).toBe('quiz-consentement');
    expect(store().tabStacks.home).toEqual(['home', 'quiz-consentement']);
  });

  it('goBack pops the active tab stack', () => {
    store().navigateTo('quiz-consentement');
    store().goBack();
    expect(screen()).toBe('home');
    expect(atTabRoot()).toBe(true);
  });

  it('goBack does not go below tab root', () => {
    store().goBack();
    expect(screen()).toBe('home');
    expect(canGoBack()).toBe(false);
  });

  it('replaceWith swaps the top of the active tab stack', () => {
    store().navigateTo('settings');
    store().replaceWith('personal-space');
    expect(screen()).toBe('personal-space');
    expect(store().tabStacks.home).toEqual(['home', 'personal-space']);
  });

  it('switchTab switches the active tab and preserves each stack independently', () => {
    store().navigateTo('quiz-consentement');
    store().switchTab('jeux');
    expect(screen()).toBe('jeux');
    expect(store().tabStacks.home).toEqual(['home', 'quiz-consentement']); // preserved
  });

  it('switching to the active tab resets its stack to root', () => {
    store().navigateTo('quiz-consentement');
    store().switchTab('home');
    expect(screen()).toBe('home');
    expect(atTabRoot()).toBe(true);
  });

  it('premium opens as a modal overlay', () => {
    store().navigateTo('premium');
    expect(store().modalStack).toEqual(['premium']);
    expect(screen()).toBe('premium');
    expect(canGoBack()).toBe(true);
  });

  it('goBack closes the modal and returns to tab context', () => {
    store().navigateTo('premium');
    store().goBack();
    expect(store().modalStack).toEqual([]);
    expect(screen()).toBe('home');
  });

  it('selectCanGoBack is false at tab root, true in sub-screens', () => {
    expect(canGoBack()).toBe(false);
    store().navigateTo('settings');
    expect(canGoBack()).toBe(true);
    store().goBack();
    expect(canGoBack()).toBe(false);
  });

  it('navigateTo a tab root from tab context switches tab without pushing to stack', () => {
    store().navigateTo('jeux');
    expect(store().activeTab).toBe('jeux');
    expect(store().tabStacks.home).toEqual(['home']); // home stack untouched
    expect(store().tabStacks.jeux).toEqual(['jeux']);
  });

  it('navigateTo a tab root from fullscreen exits fullscreen', () => {
    useNavigationStore.setState({ fullscreenStack: ['onboarding', 'welcome', 'age-check'] });
    store().navigateTo('home');
    expect(store().fullscreenStack).toEqual([]);
    expect(screen()).toBe('home');
  });
});
