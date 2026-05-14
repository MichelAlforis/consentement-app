import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PartnerProfile, CommonGround, PersonalProfile } from '../types';
import { comfortCategories } from '../data';
import { STORAGE_KEYS } from './storageKeys';
import { createCoreStorage } from '../storage';
import { computePreferenceMatches } from '../lib/computePreferenceMatches';
import type { PreferenceAnswer, TopicId } from '../data/topicRegistry';

export interface DuoCachedResult {
  partnerProfile: PartnerProfile;
  commonGround: CommonGround;
  preferenceMatches: TopicId[];
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
  saveCachedResult: (
    partnerProfile: PartnerProfile,
    personalProfile: PersonalProfile,
    myAnswers: Record<string, PreferenceAnswer>,
  ) => void;
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

      updateDuoCode: (code) => set({ duoCode: code.replace(/[^A-Z0-9]/gi, '').toUpperCase() }),

      setShowComparison: (show) => set({ showComparison: show }),

      setPartnerProfile: (profile, sessionId) =>
        set({ partnerProfile: profile, duoConnected: true, sessionId: sessionId ?? null }),

      saveCachedResult: (partnerProfile, personalProfile, myAnswers) => {
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
        const preferenceMatches = computePreferenceMatches(myAnswers, partnerProfile.preferences);
        set({
          cachedResult: {
            partnerProfile,
            commonGround: common,
            preferenceMatches,
            syncedAt: new Date().toISOString(),
          },
        });
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
      storage: createCoreStorage(),
      partialize: (state) => ({ cachedResult: state.cachedResult }),
    }
  )
);
