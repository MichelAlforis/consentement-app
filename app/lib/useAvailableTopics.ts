'use client';

import { useMemo } from 'react';
import { useModuleProgressStore } from '../stores/moduleProgressStore';
import { getAvailableTopics, getPreferenceTopics } from '../data/topicRegistry';
import type { TopicDefinition } from '../data/topicRegistry';

/**
 * Topics dont le moduleGate est complété par l'utilisateur.
 * "Disponible" ≠ "terme lexique débloqué" ≠ "préférence donnée".
 */
export function useAvailableTopics(): TopicDefinition[] {
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  return useMemo(() => getAvailableTopics(completedModules), [completedModules]);
}

/**
 * Sous-ensemble : topics disponibles avec une question préférence.
 * Utilisé par MoiScreen pour afficher les sections progressives.
 */
export function usePreferenceTopics(): TopicDefinition[] {
  const completedModules = useModuleProgressStore((s) => s.completedModules);
  return useMemo(() => getPreferenceTopics(completedModules), [completedModules]);
}
