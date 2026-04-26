const DEEP_MODULES = [
  'loi-consentement',
  'duo-flow',
  'accompagnement-mineur',
  'module-pratiques-adultes',
];

export function getProgressLevel(completedModules: string[]): 1 | 2 | 3 {
  if (completedModules.length === 0) return 1;
  if (completedModules.some((id) => DEEP_MODULES.includes(id))) return 3;
  return 2;
}
