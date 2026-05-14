import type { Screen } from '../types';
import { getRoute } from '../lib/routes';
import { isHeatUnlocked } from './heatGate';
import type { HeatLevel } from './heatLevel';

export type AccessContext = {
  isAdult: boolean | null;
  heatLevel?: HeatLevel;
};

export type AppFeature = 'explicit';

export function canAccessScreen(screen: Screen, context: AccessContext): boolean {
  const route = getRoute(screen);
  if (route.requiresAdult && context.isAdult !== true) return false;
  return true;
}

export function safeScreenForAccess(
  screen: Screen,
  context: AccessContext,
  fallback: Screen = 'home'
): Screen {
  return canAccessScreen(screen, context) ? screen : fallback;
}

export function canAccessFeature(feature: AppFeature, context: AccessContext): boolean {
  if (feature === 'explicit') {
    return context.isAdult === true && context.heatLevel !== undefined && isHeatUnlocked('explicit', context.heatLevel);
  }
  return false;
}
