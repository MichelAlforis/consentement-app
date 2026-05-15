import { create } from 'zustand';
import type { Screen } from '../types';

export type TabId = 'home' | 'apprendre' | 'jeux' | 'moi';

export const TAB_ROOTS: Record<TabId, Screen> = {
  home: 'home',
  apprendre: 'apprendre',
  jeux: 'jeux',
  moi: 'moi',
};

const MODAL_SCREENS = new Set<Screen>(['premium']);

const isTabRoot = (screen: Screen): screen is TabId =>
  Object.values(TAB_ROOTS).includes(screen as Screen);

const INITIAL_TAB_STACKS: Record<TabId, Screen[]> = {
  home: ['home'],
  apprendre: ['apprendre'],
  jeux: ['jeux'],
  moi: ['moi'],
};

interface NavigationStore {
  fullscreenStack: Screen[];
  activeTab: TabId;
  tabStacks: Record<TabId, Screen[]>;
  modalStack: Screen[];

  switchTab: (tab: TabId) => void;
  navigateTo: (screen: Screen) => void;
  replaceWith: (screen: Screen) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationStore>((set, _get) => ({
  fullscreenStack: __DEV__ ? [] : ['onboarding'],
  activeTab: 'home',
  tabStacks: { ...INITIAL_TAB_STACKS },
  modalStack: [],

  switchTab: (tab) => set((state) => {
    if (tab === state.activeTab) {
      return {
        tabStacks: { ...state.tabStacks, [tab]: [TAB_ROOTS[tab]] },
        modalStack: [],
      };
    }
    return { activeTab: tab, modalStack: [] };
  }),

  navigateTo: (screen) => set((state) => {
    if (state.fullscreenStack.length > 0) {
      if (isTabRoot(screen)) {
        const tab = screen as TabId;
        return { fullscreenStack: [], activeTab: tab };
      }
      const top = state.fullscreenStack.at(-1);
      if (top === screen) return state;
      return { fullscreenStack: [...state.fullscreenStack, screen] };
    }

    if (MODAL_SCREENS.has(screen)) {
      if (state.modalStack.at(-1) === screen) return state;
      return { modalStack: [...state.modalStack, screen] };
    }

    if (isTabRoot(screen)) {
      const tab = screen as TabId;
      if (tab === state.activeTab) return state;
      return { activeTab: tab, modalStack: [] };
    }

    const tabStack = state.tabStacks[state.activeTab];
    if (tabStack.at(-1) === screen) return state;
    return {
      tabStacks: { ...state.tabStacks, [state.activeTab]: [...tabStack, screen] },
    };
  }),

  replaceWith: (screen) => set((state) => {
    if (state.fullscreenStack.length > 0) {
      if (isTabRoot(screen)) {
        const tab = screen as TabId;
        return { fullscreenStack: [], activeTab: tab };
      }
      const stack = state.fullscreenStack.slice(0, -1);
      return { fullscreenStack: [...stack, screen] };
    }

    if (state.modalStack.length > 0) {
      const stack = state.modalStack.slice(0, -1);
      return { modalStack: [...stack, screen] };
    }

    if (isTabRoot(screen)) {
      const tab = screen as TabId;
      return { activeTab: tab, tabStacks: { ...state.tabStacks, [tab]: [TAB_ROOTS[tab]] } };
    }

    const tabStack = state.tabStacks[state.activeTab];
    return {
      tabStacks: { ...state.tabStacks, [state.activeTab]: [...tabStack.slice(0, -1), screen] },
    };
  }),

  goBack: () => set((state) => {
    if (state.modalStack.length > 0) {
      return { modalStack: state.modalStack.slice(0, -1) };
    }
    const tabStack = state.tabStacks[state.activeTab];
    if (tabStack.length <= 1) return state;
    return {
      tabStacks: { ...state.tabStacks, [state.activeTab]: tabStack.slice(0, -1) },
    };
  }),
}));

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCurrentScreen = (state: NavigationStore): Screen => {
  if (state.fullscreenStack.length > 0) return state.fullscreenStack.at(-1)!;
  if (state.modalStack.length > 0) return state.modalStack.at(-1)!;
  return state.tabStacks[state.activeTab].at(-1)!;
};

export const selectIsTabContext = (state: NavigationStore): boolean =>
  state.fullscreenStack.length === 0;

export const selectCanGoBack = (state: NavigationStore): boolean => {
  if (state.fullscreenStack.length > 0) return false;
  if (state.modalStack.length > 0) return true;
  return state.tabStacks[state.activeTab].length > 1;
};

export const selectIsAtTabRoot = (state: NavigationStore): boolean => {
  if (state.fullscreenStack.length > 0 || state.modalStack.length > 0) return false;
  return state.tabStacks[state.activeTab].length === 1;
};

export const selectShowTabBar = (state: NavigationStore): boolean =>
  state.fullscreenStack.length === 0 && state.modalStack.length === 0;

export const selectShowHeader = (state: NavigationStore): boolean => {
  if (state.fullscreenStack.length > 0) return false;
  if (state.modalStack.length > 0) return true;
  return state.tabStacks[state.activeTab].length > 1;
};

export const NAVIGATION_INITIAL_STATE = {
  fullscreenStack: ['welcome'] as Screen[],
  activeTab: 'home' as TabId,
  tabStacks: { ...INITIAL_TAB_STACKS },
  modalStack: [] as Screen[],
};
