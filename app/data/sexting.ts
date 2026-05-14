import type { IconName } from '../utils/iconFromName';

export interface VraiFauxItem {
  id: string;
  iconName: IconName;
}

export const sextingItems: VraiFauxItem[] = [
  { id: 'sexting-vf1', iconName: 'Eye' },
  { id: 'sexting-vf2', iconName: 'Heart' },
  { id: 'sexting-vf3', iconName: 'Flame' },
  { id: 'sexting-vf4', iconName: 'ShieldCheck' },
  { id: 'sexting-vf5', iconName: 'MessageCircle' },
  { id: 'sexting-vf6', iconName: 'EyeOff' },
  { id: 'sexting-vf7', iconName: 'Zap' },
  { id: 'sexting-vf8', iconName: 'Lightbulb' },
];
