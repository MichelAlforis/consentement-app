'use client';

import { MODULES, resolveModuleId } from '../modules';

export type OnboardingStatus = 'completed' | 'skipped' | 'not_started';

const MODULE_DE_BASE = MODULES.find((module) => module.id === 'module-de-base');
const MODULE_DE_BASE_IDS = MODULE_DE_BASE
  ? [MODULE_DE_BASE.effectiveId.adult, MODULE_DE_BASE.effectiveId.minor]
  : ['module-de-base', 'module-de-base-mineur'];

export { resolveModuleId };

export function isModuleCompleted(
  moduleId: string,
  completedModules: string[],
  isAdult: boolean | null
): boolean {
  return completedModules.includes(resolveModuleId(moduleId, isAdult));
}

export function resolveOnboardingStatus(completedModules: string[]): OnboardingStatus {
  if (completedModules.includes('module-de-base-skip')) return 'skipped';
  if (completedModules.some((id) => MODULE_DE_BASE_IDS.includes(id))) return 'completed';
  return 'not_started';
}
