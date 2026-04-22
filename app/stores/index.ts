export { useNavigationStore, selectShowHeader, selectCanGoBack } from './navigationStore';
export { useAuthStore } from './authStore';
export { useSettingsStore } from './settingsStore';
export { useProfileStore } from './profileStore';
export { usePremiumStore } from './premiumStore';
export { useDuoStore } from './duoStore';

import { useNavigationStore } from './navigationStore';
import { useAuthStore } from './authStore';
import { useSettingsStore } from './settingsStore';
import { useProfileStore } from './profileStore';
import { usePremiumStore } from './premiumStore';
import { useDuoStore } from './duoStore';
import { initialPersonalProfile } from '../data';

export function resetAllData() {
  useNavigationStore.setState({ currentScreen: 'welcome' });
  useAuthStore.setState({ isAuthenticated: false, isAdult: null, userName: '' });
  useSettingsStore.setState({ themeMode: null, theme: null });
  useProfileStore.setState({ personalProfile: initialPersonalProfile });
  usePremiumStore.setState({ isPremium: false });
  useDuoStore.getState().reset();

  // Clear all persisted storage
  ['consentement-auth', 'consentement-settings', 'consentement-profile', 'consentement-premium'].forEach(
    (key) => localStorage.removeItem(key)
  );
}
