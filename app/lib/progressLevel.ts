import { isModuleCompleted } from './moduleIds';
import { MODULES } from '../modules';

const DEEP_MODULES = MODULES
  .filter((module) => module.reward.rarity !== 'common')
  .map((module) => module.id);

export function getProgressLevel(completedModules: string[], isAdult: boolean | null = true): 1 | 2 | 3 {
  if (completedModules.length === 0) return 1;
  if (DEEP_MODULES.some((id) => isModuleCompleted(id, completedModules, isAdult))) return 3;
  return 2;
}
