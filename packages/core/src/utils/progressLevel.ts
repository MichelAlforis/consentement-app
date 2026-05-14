import { MODULES } from '../data/modules';

const DEEP_MODULES = MODULES
  .filter((module) => module.reward.rarity !== 'common')
  .flatMap((module) => [module.effectiveId.adult, module.effectiveId.minor]);

export function getProgressLevel(completedModules: string[]): 1 | 2 | 3 {
  if (completedModules.length === 0) return 1;
  if (DEEP_MODULES.some((id) => completedModules.includes(id))) return 3;
  return 2;
}
