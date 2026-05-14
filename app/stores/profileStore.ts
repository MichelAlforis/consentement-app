'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonalProfile } from '../types';
import { initialPersonalProfile } from '../data';
import { STORAGE_KEYS } from './storageKeys';

interface ProfileStore {
  personalProfile: PersonalProfile;
  updateComfortLevel: (
    category: 'tenderness' | 'intensity' | 'trust',
    itemId: string,
    value: number
  ) => void;
  updateSafeword: (safeword: string) => void;
  syncFromServer: () => Promise<void>;
}

function syncToServer(profile: PersonalProfile) {
  // Import dynamique pour éviter la circularité authStore ↔ profileStore
  import('./authStore').then(({ useAuthStore }) => {
    const { pbUserId } = useAuthStore.getState();
    if (!pbUserId) return;
    import('../lib/sync/profileSync').then(({ pushProfile }) => {
      void pushProfile(profile, pbUserId);
    });
  });
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      personalProfile: initialPersonalProfile,

      updateComfortLevel: (category, itemId, value) => {
        set((state) => ({
          personalProfile: {
            ...state.personalProfile,
            [category]: { ...state.personalProfile[category], [itemId]: value },
          },
        }));
        syncToServer(get().personalProfile);
      },

      updateSafeword: (safeword) => {
        set((state) => ({
          personalProfile: { ...state.personalProfile, safeword },
        }));
        syncToServer(get().personalProfile);
      },

      syncFromServer: async () => {
        const { useAuthStore } = await import('./authStore');
        const { pbUserId } = useAuthStore.getState();
        if (!pbUserId) return;
        const { pullProfile } = await import('../lib/sync/profileSync');
        const remote = await pullProfile(pbUserId);
        if (remote) {
          set({ personalProfile: remote });
        }
      },
    }),
    {
      name: STORAGE_KEYS.PROFILE,
    }
  )
);
