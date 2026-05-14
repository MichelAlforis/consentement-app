import type { IconName } from '../utils/iconFromName';

export interface LoiItem {
  id: string;
  iconName: IconName;
  important: boolean;
}

export const contentNonConsentLoiPoints: LoiItem[] = [
  { id: 'cnc-loi1', iconName: 'ShieldCheck', important: true },
  { id: 'cnc-loi2', iconName: 'EyeOff',      important: false },
  { id: 'cnc-loi3', iconName: 'Zap',         important: false },
  { id: 'cnc-loi4', iconName: 'Compass',     important: false },
  { id: 'cnc-loi5', iconName: 'Lightbulb',   important: false },
  { id: 'cnc-loi6', iconName: 'Moon',        important: false },
];
