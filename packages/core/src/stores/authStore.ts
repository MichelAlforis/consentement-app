import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../types';
import { isAdultApp } from '../lib/appVariant';
import { STORAGE_KEYS } from './storageKeys';
import { createCoreStorage } from '../storage';

interface AuthStore {
  isAuthenticated: boolean;
  isAdult: boolean | null;
  userName: string;
  pronouns: string | null;
  isHydrated: boolean;
  deviceId: string;
  pbUserId: string | null;
  pbToken: string | null;

  setAgeGroup: (adult: boolean) => void;
  authenticate: (name: string) => void;
  setName: (name: string) => void;
  setPronouns: (pronouns: string | null) => void;
  _setHydrated: () => void;
  authenticateWithPocketBase: () => Promise<void>;
}

function generateDeviceId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdult: isAdultApp ? true : null,
      userName: '',
      pronouns: null,
      isHydrated: false,
      deviceId: generateDeviceId(),
      pbUserId: null,
      pbToken: null,

      setAgeGroup: (adult) => set({ isAdult: adult }),
      authenticate: (name) => set({ isAuthenticated: true, userName: name }),
      setName: (name) => set({ userName: name }),
      setPronouns: (pronouns) => set({ pronouns }),
      _setHydrated: () => set({ isHydrated: true }),

      authenticateWithPocketBase: async () => {
        const { pb } = await import('../lib/pb');
        const { deviceId, pbUserId, pbToken } = get();
        const email = `${deviceId}@device.local`;
        const password = deviceId;

        if (pbUserId && pbToken && !pb.authStore.isValid) {
          pb.authStore.save(pbToken, { id: pbUserId } as Parameters<typeof pb.authStore.save>[1]);
        }

        try {
          const auth = await pb.collection('users').authWithPassword(email, password);
          set({ pbUserId: auth.record.id, pbToken: auth.token });
        } catch {
          try {
            await pb.collection('users').create({ email, password, passwordConfirm: password });
            const auth = await pb.collection('users').authWithPassword(email, password);
            set({ pbUserId: auth.record.id, pbToken: auth.token });
          } catch {
            // Offline ou erreur serveur — on continue sans PocketBase
          }
        }
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createCoreStorage(),
      partialize: (state) => ({
        isAdult: state.isAdult,
        userName: state.userName,
        pronouns: state.pronouns,
        isAuthenticated: state.isAuthenticated,
        deviceId: state.deviceId,
        pbUserId: state.pbUserId,
        // pbToken exclu volontairement : géré par SecureStore dans apps/mobile
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (isAdultApp) state.isAdult = true;
          state._setHydrated();
        }
      },
    }
  )
);

export type { Language };
