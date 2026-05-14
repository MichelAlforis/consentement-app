import type { IconName } from '../types';

export interface FichePratiqueItem {
  id: string;
  iconName: IconName;
}

export const pratiquesAvanceesItems: FichePratiqueItem[] = [
  { id: 'prat-av-f1', iconName: 'Zap' },
  { id: 'prat-av-f2', iconName: 'Compass' },
  { id: 'prat-av-f3', iconName: 'Eye' },
  { id: 'prat-av-f4', iconName: 'MessageSquare' },
  { id: 'prat-av-f5', iconName: 'Flame' },
];
