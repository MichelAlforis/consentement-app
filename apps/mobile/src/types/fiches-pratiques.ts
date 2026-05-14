export interface FichePratiqueItem {
  id: string;
  iconName: string;
}

export interface FichePratiqueScreenProps {
  moduleId: string;
  namespace: string;
  items: FichePratiqueItem[];
  onComplete?: () => void;
  isPremiumGated?: boolean;
}
