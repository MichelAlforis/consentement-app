import type { IconName } from '../utils/iconFromName';

export interface LoiItem {
  id: string;
  iconName: IconName;
  important: boolean;
}

export const ruptureHarceleLoiPoints: LoiItem[] = [
  { id: 'rupture-loi1', iconName: 'ShieldCheck', important: true },
  { id: 'rupture-loi2', iconName: 'MessageCircle', important: false },
  { id: 'rupture-loi3', iconName: 'Compass',       important: false },
  { id: 'rupture-loi4', iconName: 'EyeOff',        important: false },
  { id: 'rupture-loi5', iconName: 'Lightbulb',     important: false },
  { id: 'rupture-loi6', iconName: 'Heart',          important: false },
];
