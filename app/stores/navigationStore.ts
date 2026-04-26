'use client';

import { create } from 'zustand';
import { Screen } from '../types';

const NO_HEADER_SCREENS: Screen[] = ['welcome', 'age-check', 'auth', 'home', 'apprendre', 'moi'];
const ROOT_SCREENS: Screen[] = ['welcome', 'age-check', 'home', 'apprendre', 'jeux', 'moi'];

interface NavigationStore {
  currentScreen: Screen;
  navigateTo: (screen: Screen) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentScreen: 'welcome',

  navigateTo: (screen) => set({ currentScreen: screen }),

  goBack: () => set({ currentScreen: 'home' }),
}));

export const selectShowHeader = (screen: Screen) =>
  !NO_HEADER_SCREENS.includes(screen);

export const selectCanGoBack = (screen: Screen) =>
  !ROOT_SCREENS.includes(screen);
