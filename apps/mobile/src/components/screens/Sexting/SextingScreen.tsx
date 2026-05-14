import {
  useAuthStore,
  useNavigationStore,
  type Screen,
} from '@ouiclair/core';
import { SEXTING_ITEMS } from '../../../data/fiches-pratiques';
import { FichePratiqueScreen } from '../FichesPratiques';

interface Props {
  isAdult?: boolean | null;
  onNavigate?: (screen: Screen) => void;
}

export function SextingScreen({ isAdult: isAdultProp, onNavigate: onNavigateProp }: Props) {
  const storeIsAdult = useAuthStore((s) => s.isAdult);
  const storeNavigateTo = useNavigationStore((s) => s.navigateTo);
  const isAdult = isAdultProp ?? storeIsAdult;
  const navigateTo = onNavigateProp ?? storeNavigateTo;

  void isAdult;

  return (
    <FichePratiqueScreen
      moduleId="sexting"
      namespace="sexting"
      items={SEXTING_ITEMS}
      onComplete={() => navigateTo('apprendre')}
      isPremiumGated={true}
    />
  );
}
