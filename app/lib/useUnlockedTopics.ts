'use client';

import { useMemo } from 'react';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import {
  getAvailableTopics,
  getPreferenceTopics,
  type TopicDefinition,
} from '../data/topicRegistry';

/** Tous les topics dont le moduleGate est dans completedModules */
export function useUnlockedTopics(): TopicDefinition[] {
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  return useMemo(() => getAvailableTopics(completedModules), [completedModules]);
}

/** Sous-ensemble : topics avec question préférence (pour MoiScreen) */
export function usePreferenceTopics(): TopicDefinition[] {
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  return useMemo(() => getPreferenceTopics(completedModules), [completedModules]);
}
