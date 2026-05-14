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

import { useNavigationStore, NAVIGATION_INITIAL_STATE } from './navigationStore';
import { useAuthStore } from './authStore';
import { useSettingsStore } from './settingsStore';
import { useProfileStore } from './profileStore';
import { usePremiumStore } from './premiumStore';
import { useDuoStore } from './duoStore';
import { useUnlockStore } from './unlockStore';
import { useModuleProgressStore } from './moduleProgressStore';
import { useLexiqueStore } from './lexiqueStore';
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

  // Clear all persisted storage
  [
    'consentement-auth',
    'consentement-settings',
    'consentement-profile',
    'consentement-premium',
    'consentement-unlocks',
    'consentement-modules',
    'consentement-lexique',
  ].forEach((key) => localStorage.removeItem(key));
}
