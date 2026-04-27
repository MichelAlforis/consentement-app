'use client';

import { create } from 'zustand';
import { PartnerProfile, CommonGround, PersonalProfile } from '../types';
import { comfortCategories } from '../data';

interface DuoStore {
  duoConnected: boolean;
  duoCode: string;
  partnerProfile: PartnerProfile | null;
  showComparison: boolean;
  connectDuo: (code: string) => void;
  updateDuoCode: (code: string) => void;
  setShowComparison: (show: boolean) => void;
  getCommonGround: (personalProfile: PersonalProfile) => CommonGround | null;
  reset: () => void;
}

function generatePartnerProfile(): PartnerProfile {
  const profile: PartnerProfile = { tenderness: {}, intensity: {}, trust: {} };
  const baseComfort = Math.random() > 0.5 ? 3 : 2;
  const variance = () => Math.floor(Math.random() * 2) - 1;

  (Object.keys(comfortCategories) as Array<keyof typeof comfortCategories>).forEach((cat) => {
    const categoryMod = cat === 'tenderness' ? 1 : cat === 'intensity' ? 0 : -1;
    comfortCategories[cat].items.forEach((item) => {
      let itemMod = 0;
      if (['kisses', 'cuddles', 'holding', 'words'].includes(item.id)) itemMod = 1;
      if (['filming', 'power', 'restraint'].includes(item.id)) itemMod = -1;
      profile[cat][item.id] = Math.max(0, Math.min(4, baseComfort + categoryMod + itemMod + variance()));
    });
  });
  return profile;
}

export const useDuoStore = create<DuoStore>((set, get) => ({
  duoConnected: false,
  duoCode: '',
  partnerProfile: null,
  showComparison: false,

  connectDuo: (code) => {
    if (code.length === 6) {
      set({ duoConnected: true, partnerProfile: generatePartnerProfile() });
    }
  },

  updateDuoCode: (code) => set({ duoCode: code.replace(/\D/g, '') }),

  setShowComparison: (show) => set({ showComparison: show }),

  getCommonGround: (personalProfile) => {
    const { partnerProfile } = get();
    if (!partnerProfile) return null;

    const common: CommonGround = { tenderness: {}, intensity: {}, trust: {} };

    (Object.keys(comfortCategories) as Array<keyof typeof comfortCategories>).forEach((cat) => {
      comfortCategories[cat].items.forEach((item) => {
        const myLevel = personalProfile[cat][item.id] ?? 0;
        const partnerLevel = partnerProfile[cat][item.id] ?? 0;
        common[cat][item.id] = {
          level: Math.min(myLevel, partnerLevel),
          compatible: myLevel >= 2 && partnerLevel >= 2,
        };
      });
    });

    return common;
  },

  reset: () =>
    set({ duoConnected: false, duoCode: '', partnerProfile: null, showComparison: false }),
}));
