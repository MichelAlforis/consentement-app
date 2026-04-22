'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonalProfile } from '../types';
import { initialPersonalProfile } from '../data';

interface ProfileStore {
  personalProfile: PersonalProfile;
  updateComfortLevel: (
    category: 'tenderness' | 'intensity' | 'trust',
    itemId: string,
    value: number
  ) => void;
  updateSafeword: (safeword: string) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      personalProfile: initialPersonalProfile,

      updateComfortLevel: (category, itemId, value) =>
        set((state) => ({
          personalProfile: {
            ...state.personalProfile,
            [category]: { ...state.personalProfile[category], [itemId]: value },
          },
        })),

      updateSafeword: (safeword) =>
        set((state) => ({
          personalProfile: { ...state.personalProfile, safeword },
        })),
    }),
    {
      name: 'consentement-profile',
    }
  )
);
