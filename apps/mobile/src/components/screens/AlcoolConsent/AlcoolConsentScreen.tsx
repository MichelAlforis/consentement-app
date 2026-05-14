import {
  useAuthStore,
  useNavigationStore,
  type Screen,
} from '@ouiclair/core';
import { ALCOOL_CONSENT_ITEMS } from '../../../data/fiches-pratiques';
import { FichePratiqueScreen } from '../FichesPratiques';

interface Props {
  isAdult?: boolean | null;
  onNavigate?: (screen: Screen) => void;
}

export function AlcoolConsentScreen({ isAdult: isAdultProp, onNavigate: onNavigateProp }: Props) {
  const storeIsAdult = useAuthStore((s) => s.isAdult);
  const storeNavigateTo = useNavigationStore((s) => s.navigateTo);
  const isAdult = isAdultProp ?? storeIsAdult;
  const navigateTo = onNavigateProp ?? storeNavigateTo;

  void isAdult;

  return (
    <FichePratiqueScreen
      moduleId="alcool-consent"
      namespace="alcoolConsent"
      items={ALCOOL_CONSENT_ITEMS}
      onComplete={() => navigateTo('apprendre')}
      isPremiumGated={false}
    />
  );
}
