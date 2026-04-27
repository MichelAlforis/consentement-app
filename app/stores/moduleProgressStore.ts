'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingStatus, resolveOnboardingStatus } from '../lib/moduleIds';

interface ModuleProgressStore {
  completedModules: string[];
  onboardingStatus: OnboardingStatus;
  markModuleComplete: (id: string) => void;
  markOnboardingCompleted: (moduleId: string) => void;
  markOnboardingSkipped: () => void;
  reset: () => void;
}

export const useModuleProgressStore = create<ModuleProgressStore>()(
  persist(
    (set, get) => ({
      completedModules: [],
      onboardingStatus: 'not_started',

      markModuleComplete: (id) => {
        if (get().completedModules.includes(id)) return;
        set((s) => ({ completedModules: [...s.completedModules, id] }));
      },

      markOnboardingCompleted: (moduleId) => {
        get().markModuleComplete(moduleId);
        set({ onboardingStatus: 'completed' });
      },

      markOnboardingSkipped: () => set({ onboardingStatus: 'skipped' }),

      reset: () => set({ completedModules: [], onboardingStatus: 'not_started' }),
    }),
    {
      name: 'consentement-modules',
      version: 1,
      // Without migrate, Zustand v5 discards stored state on version mismatch
      // and calls merge(undefined, initialState) — losing all progress.
      migrate: (persistedState, fromVersion) => {
        if (fromVersion === 0) {
          const s = persistedState as { completedModules?: string[] };
          const completedModules = s.completedModules ?? [];
          return { completedModules, onboardingStatus: resolveOnboardingStatus(completedModules) };
        }
        return persistedState;
      },
      merge: (persisted, current) => {
        const state = { ...current, ...(persisted as Partial<ModuleProgressStore>) };
        return {
          ...state,
          onboardingStatus: state.onboardingStatus ?? resolveOnboardingStatus(state.completedModules ?? []),
        };
      },
    }
  )
);
