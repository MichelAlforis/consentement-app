'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from './storageKeys';
import { createAppStorage } from '../lib/storage';
import type { TopicId, PreferenceAnswer } from '../data/topicRegistry';

interface PreferencesStore {
  answers: Record<TopicId, PreferenceAnswer>;
  /** Enregistre ou met à jour la réponse pour un topic */
  answer: (topicId: TopicId, value: PreferenceAnswer) => void;
  getAnswer: (topicId: TopicId) => PreferenceAnswer | undefined;
  reset: () => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      answers: {},

      answer: (topicId, value) =>
        set((s) => ({ answers: { ...s.answers, [topicId]: value } })),

      getAnswer: (topicId) => get().answers[topicId],

      reset: () => set({ answers: {} }),
    }),
    {
      name: STORAGE_KEYS.PREFERENCES,
      version: 1,
      storage: createAppStorage<PreferencesStore>(),
    }
  )
);
