export { useNavigationStore, selectShowHeader, selectCanGoBack } from './navigationStore';
export { useAuthStore } from './authStore';
export { useSettingsStore } from './settingsStore';
export { useProfileStore } from './profileStore';
export { usePremiumStore } from './premiumStore';
export { useDuoStore } from './duoStore';
export { useUnlockStore } from './unlockStore';
export type { OwnedCard, Rarity } from './unlockStore';
export { useModuleProgressStore } from './moduleProgressStore';

import { useNavigationStore } from './navigationStore';
import { useAuthStore } from './authStore';
import { useSettingsStore } from './settingsStore';
import { useProfileStore } from './profileStore';
import { usePremiumStore } from './premiumStore';
import { useDuoStore } from './duoStore';
import { useUnlockStore } from './unlockStore';
import { useModuleProgressStore } from './moduleProgressStore';
import { initialPersonalProfile } from '../data';

export function resetAllData() {
  useNavigationStore.setState({ currentScreen: 'welcome', history: [] });
  useAuthStore.setState({ isAuthenticated: false, isAdult: null, userName: '', pronouns: null });
  useSettingsStore.setState({ themeMode: null, theme: null, explicitMode: false });
  useProfileStore.setState({ personalProfile: initialPersonalProfile });
  usePremiumStore.setState({ isPremium: false });
  useDuoStore.getState().reset();
  useUnlockStore.getState().reset();
  useModuleProgressStore.getState().reset();

  // Clear all persisted storage
  [
    'consentement-auth',
    'consentement-settings',
    'consentement-profile',
    'consentement-premium',
    'consentement-unlocks',
    'consentement-modules',
  ].forEach((key) => localStorage.removeItem(key));
}
