'use client';

import { create } from 'zustand';
import type { Screen } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TabId = 'home' | 'apprendre' | 'jeux' | 'moi';

export const TAB_ROOTS: Record<TabId, Screen> = {
  home: 'home',
  apprendre: 'apprendre',
  jeux: 'jeux',
  moi: 'moi',
};

// Screens pushed on top of the tab layout as a modal (TabBar hidden).
const MODAL_SCREENS = new Set<Screen>(['premium']);

const isTabRoot = (screen: Screen): screen is TabId =>
  Object.values(TAB_ROOTS).includes(screen as Screen);

const INITIAL_TAB_STACKS: Record<TabId, Screen[]> = {
  home: ['home'],
  apprendre: ['apprendre'],
  jeux: ['jeux'],
  moi: ['moi'],
};

// ─── Store ────────────────────────────────────────────────────────────────────

interface NavigationStore {
  // Onboarding / pre-auth flow — replaces everything
  fullscreenStack: Screen[];
  // Main app — each tab keeps its own back-stack
  activeTab: TabId;
  tabStacks: Record<TabId, Screen[]>;
  // Modal overlay — floats above the tab layout (premium, etc.)
  modalStack: Screen[];

  // Actions
  switchTab: (tab: TabId) => void;
  navigateTo: (screen: Screen) => void;
  replaceWith: (screen: Screen) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationStore>((set, _get) => ({
  fullscreenStack: ['onboarding'],
  activeTab: 'home',
  tabStacks: { ...INITIAL_TAB_STACKS },
  modalStack: [],

  // Tapping the active tab resets it to root (Instagram pattern).
  // Tapping a different tab preserves each tab's stack.
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
    // ── Fullscreen context (onboarding flow) ──────────────────────────────
    if (state.fullscreenStack.length > 0) {
      // Navigating to a tab root exits fullscreen and enters the tab layout.
      if (isTabRoot(screen)) {
        const tab = screen as TabId;
        return { fullscreenStack: [], activeTab: tab };
      }
      const top = state.fullscreenStack.at(-1);
      if (top === screen) return state;
      return { fullscreenStack: [...state.fullscreenStack, screen] };
    }

    // ── Modal screens ─────────────────────────────────────────────────────
    if (MODAL_SCREENS.has(screen)) {
      if (state.modalStack.at(-1) === screen) return state;
      return { modalStack: [...state.modalStack, screen] };
    }

    // ── Tab context ───────────────────────────────────────────────────────
    // Switching to another tab root via navigateTo (e.g. from a CTA button).
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
    // ── Fullscreen context ────────────────────────────────────────────────
    if (state.fullscreenStack.length > 0) {
      if (isTabRoot(screen)) {
        const tab = screen as TabId;
        return { fullscreenStack: [], activeTab: tab };
      }
      const stack = state.fullscreenStack.slice(0, -1);
      return { fullscreenStack: [...stack, screen] };
    }

    // ── Modal context ─────────────────────────────────────────────────────
    if (state.modalStack.length > 0) {
      const stack = state.modalStack.slice(0, -1);
      return { modalStack: [...stack, screen] };
    }

    // ── Tab context ───────────────────────────────────────────────────────
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
    // Close modal first
    if (state.modalStack.length > 0) {
      return { modalStack: state.modalStack.slice(0, -1) };
    }
    // Pop active tab stack (floor = tab root, cannot pop further)
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

/** True when the user is inside the main tab layout (not onboarding, not modal). */
export const selectIsTabContext = (state: NavigationStore): boolean =>
  state.fullscreenStack.length === 0;

/** True when the back button / Android back should be active. */
export const selectCanGoBack = (state: NavigationStore): boolean => {
  if (state.fullscreenStack.length > 0) return false;
  if (state.modalStack.length > 0) return true;
  return state.tabStacks[state.activeTab].length > 1;
};

/** True when the current screen is a tab root (no sub-screens pushed yet). */
export const selectIsAtTabRoot = (state: NavigationStore): boolean => {
  if (state.fullscreenStack.length > 0 || state.modalStack.length > 0) return false;
  return state.tabStacks[state.activeTab].length === 1;
};

/** TabBar visible: tab context only (hidden in fullscreen and modal). */
export const selectShowTabBar = (state: NavigationStore): boolean =>
  state.fullscreenStack.length === 0 && state.modalStack.length === 0;

/** Global header visible: tab sub-screens and modals (not tab roots, not fullscreen). */
export const selectShowHeader = (state: NavigationStore): boolean => {
  if (state.fullscreenStack.length > 0) return false;
  if (state.modalStack.length > 0) return true;
  return state.tabStacks[state.activeTab].length > 1;
};

// Legacy alias kept for DevBar reset compatibility.
export const NAVIGATION_INITIAL_STATE = {
  fullscreenStack: ['welcome'] as Screen[],
  activeTab: 'home' as TabId,
  tabStacks: { ...INITIAL_TAB_STACKS },
  modalStack: [] as Screen[],
};
