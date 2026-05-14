import type { IconName } from '../utils/iconFromName';

export interface FichePratiqueItem {
  id: string;
  iconName: IconName;
}

export const pratiquesBaseItems: FichePratiqueItem[] = [
  { id: 'pratiques-base-f1', iconName: 'MessageCircle' },
  { id: 'pratiques-base-f2', iconName: 'Heart' },
  { id: 'pratiques-base-f3', iconName: 'Handshake' },
  { id: 'pratiques-base-f4', iconName: 'Flame' },
];
