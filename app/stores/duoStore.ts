'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PartnerProfile, CommonGround, PersonalProfile } from '../types';
import { comfortCategories } from '../data';
import { STORAGE_KEYS } from './storageKeys';

export interface DuoCachedResult {
  partnerProfile: PartnerProfile;
  commonGround: CommonGround;
  syncedAt: string; // ISO date
}

interface DuoStore {
  // Session courante (éphémère)
  duoConnected: boolean;
  duoCode: string;
  partnerProfile: PartnerProfile | null;
  showComparison: boolean;
  sessionId: string | null;

  // Résultat mis en cache pour l'offline
  cachedResult: DuoCachedResult | null;

  connectDuo: (code: string) => void;
  updateDuoCode: (code: string) => void;
  setShowComparison: (show: boolean) => void;
  setPartnerProfile: (profile: PartnerProfile, sessionId?: string) => void;
  saveCachedResult: (partnerProfile: PartnerProfile, personalProfile: PersonalProfile) => void;
  getCommonGround: (personalProfile: PersonalProfile) => CommonGround | null;
  reset: () => void;
}

export const useDuoStore = create<DuoStore>()(
  persist(
    (set, get) => ({
      duoConnected: false,
      duoCode: '',
      partnerProfile: null,
      showComparison: false,
      sessionId: null,
      cachedResult: null,

      connectDuo: (code) => {
        if (code.length === 6) {
          set({ duoConnected: true });
        }
      },

      updateDuoCode: (code) => set({ duoCode: code.replace(/\D/g, '') }),

      setShowComparison: (show) => set({ showComparison: show }),

      setPartnerProfile: (profile, sessionId) =>
        set({ partnerProfile: profile, duoConnected: true, sessionId: sessionId ?? null }),

      saveCachedResult: (partnerProfile, personalProfile) => {
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
        set({ cachedResult: { partnerProfile, commonGround: common, syncedAt: new Date().toISOString() } });
      },

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
        set({ duoConnected: false, duoCode: '', partnerProfile: null, showComparison: false, sessionId: null }),
    }),
    {
      name: STORAGE_KEYS.DUO_RESULT,
      // Seul cachedResult est persisté — le reste est éphémère
      partialize: (state) => ({ cachedResult: state.cachedResult }),
    }
  )
);
