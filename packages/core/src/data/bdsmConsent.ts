import type { IconName } from '../types';

export interface VraiFauxItem {
  id: string;
  iconName: IconName;
}

export const bdsmConsentItems: VraiFauxItem[] = [
  { id: 'bdsm-vf1', iconName: 'ShieldCheck' },
  { id: 'bdsm-vf2', iconName: 'MessageCircle' },
  { id: 'bdsm-vf3', iconName: 'Handshake' },
  { id: 'bdsm-vf4', iconName: 'Compass' },
  { id: 'bdsm-vf5', iconName: 'Eye' },
  { id: 'bdsm-vf6', iconName: 'Zap' },
  { id: 'bdsm-vf7', iconName: 'Sparkles' },
];
