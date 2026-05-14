export {
  useNavigationStore,
  selectCurrentScreen,
  selectCanGoBack,
  selectIsTabContext,
  selectIsAtTabRoot,
  selectShowTabBar,
  selectShowHeader,
  NAVIGATION_INITIAL_STATE,
  type TabId,
} from './navigationStore';
export { useAuthStore } from './authStore';
export { useSettingsStore } from './settingsStore';
export { useProfileStore } from './profileStore';
export { usePremiumStore } from './premiumStore';
export { useDuoStore } from './duoStore';
export { useUnlockStore } from './unlockStore';
export type { OwnedCard, Rarity } from './unlockStore';
export { useModuleProgressStore } from './moduleProgressStore';
export { useLexiqueStore } from './lexiqueStore';
export { usePreferencesStore } from './preferencesStore';
export type { PoolEntry } from './unlockStore';

import { useNavigationStore, NAVIGATION_INITIAL_STATE } from './navigationStore';
import { useAuthStore } from './authStore';
import { useSettingsStore } from './settingsStore';
import { useProfileStore } from './profileStore';
import { usePremiumStore } from './premiumStore';
import { useDuoStore } from './duoStore';
import { useUnlockStore } from './unlockStore';
import { useModuleProgressStore } from './moduleProgressStore';
import { useLexiqueStore } from './lexiqueStore';
import { usePreferencesStore } from './preferencesStore';
import { STORAGE_KEYS } from './storageKeys';
import { initialPersonalProfile } from '../data';

export function resetAllData() {
  useNavigationStore.setState(NAVIGATION_INITIAL_STATE);
  useAuthStore.setState({ isAuthenticated: false, isAdult: null, userName: '', pronouns: null });
  useSettingsStore.setState({ themeMode: null, theme: null, explicitMode: false });
  useProfileStore.setState({ personalProfile: initialPersonalProfile });
  usePremiumStore.setState({ isPremium: false });
  useDuoStore.getState().reset();
  useUnlockStore.getState().reset();
  useModuleProgressStore.getState().reset();
  useLexiqueStore.getState().reset();
  usePreferencesStore.getState().reset();

  // Clear all persisted storage (RENDER_MODE intentionnellement exclu — préférence technique)
  [
    STORAGE_KEYS.AUTH,
    STORAGE_KEYS.SETTINGS,
    STORAGE_KEYS.PROFILE,
    STORAGE_KEYS.PREMIUM,
    STORAGE_KEYS.UNLOCKS,
    STORAGE_KEYS.MODULES,
    STORAGE_KEYS.LEXIQUE,
    STORAGE_KEYS.PREFERENCES,
  ].forEach((key) => localStorage.removeItem(key));

  void import('../lib/pb').then(({ pb }) => pb.authStore.clear());
}
