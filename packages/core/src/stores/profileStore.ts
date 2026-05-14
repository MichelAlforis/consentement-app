import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonalProfile } from '../types';
import { initialPersonalProfile } from '../data';
import { STORAGE_KEYS } from './storageKeys';
import { createCoreStorage } from '../storage';

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
  void import('./authStore').then(async ({ useAuthStore }) => {
    const { pbUserId, pbToken, deviceId } = useAuthStore.getState();
    if (!pbUserId) return;
    const [{ pb }, { pushProfile }] = await Promise.all([
      import('../lib/pb'),
      import('../lib/sync/profileSync'),
    ]);
    if (pbToken && !pb.authStore.isValid) {
      pb.authStore.save(pbToken, { id: pbUserId } as Parameters<typeof pb.authStore.save>[1]);
    }
    await pushProfile(profile, pbUserId, deviceId).catch(() => {});
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
        const { pbUserId, deviceId } = useAuthStore.getState();
        if (!pbUserId) return;
        const { pullProfile } = await import('../lib/sync/profileSync');
        const remote = await pullProfile(pbUserId, deviceId);
        if (remote) {
          set({ personalProfile: remote });
        }
      },
    }),
    {
      name: STORAGE_KEYS.PROFILE,
      storage: createCoreStorage(),
    }
  )
);
