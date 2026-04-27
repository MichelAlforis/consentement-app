import type { Rarity } from './data/cards-collector';
import type { Screen } from './types';

export type ModuleId =
  | 'module-de-base'
  | 'quiz-consentement'
  | 'porno-vs-realite'
  | 'loi-consentement'
  | 'duo-flow'
  | 'module-pratiques-adultes'
  | 'accompagnement-mineur';

export type EffectiveModuleId =
  | ModuleId
  | 'module-de-base-mineur'
  | 'quiz-consentement-mineur'
  | 'porno-vs-realite-mineur'
  | 'loi-consentement-mineur';

type AudienceValue<T> = {
  adult: T;
  minor: T;
};

export type ModuleReward = {
  rarity: Rarity;
  count: number;
};

export type ModuleConfig = {
  id: ModuleId;
  effectiveId: AudienceValue<EffectiveModuleId>;
  screen: Screen | null;
  titleKey: string;
  descriptionKey?: string;
  reward: ModuleReward;
  rewardKey: string;
  deck: AudienceValue<'A' | 'M'>;
  sequence: AudienceValue<number | null>;
  available: AudienceValue<boolean>;
};

export const MODULES = [
  {
    id: 'module-de-base',
    effectiveId: { adult: 'module-de-base', minor: 'module-de-base-mineur' },
    screen: 'module-de-base',
    titleKey: 'apprendre.base.title',
    reward: { rarity: 'common', count: 24 },
    rewardKey: 'apprendre.rewardBase',
    deck: { adult: 'A', minor: 'M' },
    sequence: { adult: null, minor: null },
    available: { adult: true, minor: true },
  },
  {
    id: 'porno-vs-realite',
    effectiveId: { adult: 'porno-vs-realite', minor: 'porno-vs-realite-mineur' },
    screen: 'porno-vs-realite',
    titleKey: 'apprendre.porno.title',
    descriptionKey: 'apprendre.porno.desc',
    reward: { rarity: 'common', count: 1 },
    rewardKey: 'apprendre.rewardCommon',
    deck: { adult: 'A', minor: 'M' },
    sequence: { adult: 1, minor: 1 },
    available: { adult: true, minor: true },
  },
  {
    id: 'quiz-consentement',
    effectiveId: { adult: 'quiz-consentement', minor: 'quiz-consentement-mineur' },
    screen: 'quiz-consentement',
    titleKey: 'apprendre.quiz.title',
    descriptionKey: 'apprendre.quiz.desc',
    reward: { rarity: 'common', count: 1 },
    rewardKey: 'apprendre.rewardCommon',
    deck: { adult: 'A', minor: 'M' },
    sequence: { adult: 2, minor: 2 },
    available: { adult: true, minor: true },
  },
  {
    id: 'loi-consentement',
    effectiveId: { adult: 'loi-consentement', minor: 'loi-consentement-mineur' },
    screen: 'loi-consentement',
    titleKey: 'apprendre.loi.title',
    descriptionKey: 'apprendre.loi.desc',
    reward: { rarity: 'rare', count: 1 },
    rewardKey: 'apprendre.rewardRare',
    deck: { adult: 'A', minor: 'M' },
    sequence: { adult: 3, minor: 3 },
    available: { adult: true, minor: true },
  },
  {
    id: 'duo-flow',
    effectiveId: { adult: 'duo-flow', minor: 'duo-flow' },
    screen: 'duo-space',
    titleKey: 'homeV3.modules.duo-flow',
    reward: { rarity: 'rare', count: 1 },
    rewardKey: 'apprendre.rewardRare',
    deck: { adult: 'A', minor: 'A' },
    sequence: { adult: 4, minor: null },
    available: { adult: true, minor: false },
  },
  {
    id: 'module-pratiques-adultes',
    effectiveId: { adult: 'module-pratiques-adultes', minor: 'module-pratiques-adultes' },
    screen: null,
    titleKey: 'apprendre.pratiques.title',
    descriptionKey: 'apprendre.pratiques.desc',
    reward: { rarity: 'unique', count: 1 },
    rewardKey: 'apprendre.rewardUnique',
    deck: { adult: 'A', minor: 'A' },
    sequence: { adult: null, minor: null },
    available: { adult: false, minor: false },
  },
  {
    id: 'accompagnement-mineur',
    effectiveId: { adult: 'accompagnement-mineur', minor: 'accompagnement-mineur' },
    screen: 'accompagnement-mineur',
    titleKey: 'apprendre.accompagnement.title',
    descriptionKey: 'apprendre.accompagnement.desc',
    reward: { rarity: 'rare', count: 1 },
    rewardKey: 'apprendre.rewardRare',
    deck: { adult: 'M', minor: 'M' },
    sequence: { adult: null, minor: 4 },
    available: { adult: false, minor: true },
  },
] as const satisfies readonly ModuleConfig[];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((mod) => [mod.id, mod])) as Record<ModuleId, ModuleConfig>;

export const MODULE_BY_EFFECTIVE_ID = MODULES.reduce((acc, mod) => {
  acc[mod.effectiveId.adult] = mod;
  acc[mod.effectiveId.minor] = mod;
  return acc;
}, {} as Partial<Record<EffectiveModuleId, ModuleConfig>>);

export function moduleAudience(isAdult: boolean | null): 'adult' | 'minor' {
  return isAdult === false ? 'minor' : 'adult';
}

export function resolveModuleId(moduleId: string, isAdult: boolean | null): string {
  const mod = MODULE_BY_ID[moduleId as ModuleId];
  if (!mod) return moduleId;
  return mod.effectiveId[moduleAudience(isAdult)];
}

export function getModuleSequence(isAdult: boolean | null): ModuleConfig[] {
  const audience = moduleAudience(isAdult);
  return MODULES
    .filter((mod) => mod.sequence[audience] !== null && mod.available[audience])
    .sort((a, b) => (a.sequence[audience] ?? 0) - (b.sequence[audience] ?? 0));
}

export function getModuleReward(effectiveId: string): (ModuleReward & { deck: 'A' | 'M' }) | null {
  const mod = MODULE_BY_EFFECTIVE_ID[effectiveId as EffectiveModuleId];
  if (!mod) return null;
  const audience = mod.effectiveId.minor === effectiveId ? 'minor' : 'adult';
  return {
    ...mod.reward,
    deck: mod.deck[audience],
  };
}
