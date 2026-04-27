'use client';

import { create } from 'zustand';
import { Screen } from '../types';
import { isRootScreen, shouldScreenShowHeader } from '../config/screenMeta';

interface NavigationStore {
  currentScreen: Screen;
  history: Screen[];
  navigateTo: (screen: Screen) => void;
  replaceWith: (screen: Screen) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentScreen: 'welcome',
  history: [],

  navigateTo: (screen) => set((state) => {
    if (state.currentScreen === screen) return state;
    return {
      currentScreen: screen,
      history: [...state.history, state.currentScreen],
    };
  }),

  replaceWith: (screen) => set((state) => ({
    currentScreen: screen,
    history: state.history,
  })),

  goBack: () => set((state) => {
    const previous = state.history.at(-1);
    if (!previous) return { currentScreen: 'home', history: [] };
    return {
      currentScreen: previous,
      history: state.history.slice(0, -1),
    };
  }),
}));

export const selectShowHeader = (screen: Screen) =>
  shouldScreenShowHeader(screen);

export const selectCanGoBack = (screen: Screen, history: Screen[] = []) =>
  history.length > 0 && !isRootScreen(screen);
