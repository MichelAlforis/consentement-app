// V4: port V3 → RN. Wrapper qui passe les données du module à
//     FichePratiqueScreen générique. Logique entièrement dans le
//     composant partagé. Données depuis apps/mobile/src/data/fiches-pratiques.ts
//     (stubs Phase 5, contenu réel en Phase 5 contenu).
import {
  useAuthStore,
  useNavigationStore,
  type Screen,
} from '@ouiclair/core';
import { PRATIQUES_EXPLICIT_ITEMS } from '../../../data/fiches-pratiques';
import { FichePratiqueScreen } from '../FichesPratiques';

interface Props {
  isAdult?: boolean | null;
  onNavigate?: (screen: Screen) => void;
}

export function PratiquesExplicitScreen({ isAdult: isAdultProp, onNavigate: onNavigateProp }: Props) {
  const storeIsAdult = useAuthStore((s) => s.isAdult);
  const storeNavigateTo = useNavigationStore((s) => s.navigateTo);
  const isAdult = isAdultProp ?? storeIsAdult;
  const navigateTo = onNavigateProp ?? storeNavigateTo;

  void isAdult;

  return (
    <FichePratiqueScreen
      moduleId="pratiques-explicit"
      namespace="pratiquesExplicit"
      items={PRATIQUES_EXPLICIT_ITEMS}
      onComplete={() => navigateTo('apprendre')}
      isPremiumGated={true}
    />
  );
}
