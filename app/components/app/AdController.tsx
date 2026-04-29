'use client';

import { AdBanner } from '../ui';
import { shouldShowAd } from '../../routes';
import { useNavigationStore, usePremiumStore, selectCurrentScreen } from '../../stores';

export function AdController() {
  const currentScreen = useNavigationStore(selectCurrentScreen);
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const isPremium = usePremiumStore((s) => s.isPremium);

  if (isPremium || !shouldShowAd(currentScreen)) return null;

  return <AdBanner onGoPremium={() => navigateTo('premium')} />;
}
