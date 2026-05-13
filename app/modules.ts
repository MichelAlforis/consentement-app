import type { Rarity } from './data/cards-collector';
import type { Screen } from './types';

export type ModuleId =
  | 'module-de-base'
  | 'quiz-consentement'
  | 'porno-vs-realite'
  | 'loi-consentement'
  | 'duo-flow'
  | 'module-pratiques-adultes'
  | 'accompagnement-mineur'
  // Quiz multi-niveaux
  | 'quiz-d1' | 'quiz-d2' | 'quiz-d3'
  | 'quiz-i1' | 'quiz-i2' | 'quiz-i3'
  | 'quiz-e1' | 'quiz-e2' | 'quiz-e3';

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
  // ── Quiz multi-niveaux ────────────────────────────────────────────────────
  { id: 'quiz-d1', effectiveId: { adult: 'quiz-d1', minor: 'quiz-d1' }, screen: null, titleKey: 'quizMl.d.v1.title', reward: { rarity: 'common', count: 1 }, rewardKey: 'apprendre.rewardCommon', deck: { adult: 'A', minor: 'A' }, sequence: { adult: null, minor: null }, available: { adult: true, minor: false } },
  { id: 'quiz-d2', effectiveId: { adult: 'quiz-d2', minor: 'quiz-d2' }, screen: null, titleKey: 'quizMl.d.v2.title', reward: { rarity: 'common', count: 1 }, rewardKey: 'apprendre.rewardCommon', deck: { adult: 'A', minor: 'A' }, sequence: { adult: null, minor: null }, available: { adult: true, minor: false } },
  { id: 'quiz-d3', effectiveId: { adult: 'quiz-d3', minor: 'quiz-d3' }, screen: null, titleKey: 'quizMl.d.v3.title', reward: { rarity: 'common', count: 1 }, rewardKey: 'apprendre.rewardCommon', deck: { adult: 'A', minor: 'A' }, sequence: { adult: null, minor: null }, available: { adult: true, minor: false } },
  { id: 'quiz-i1', effectiveId: { adult: 'quiz-i1', minor: 'quiz-i1' }, screen: null, titleKey: 'quizMl.i.v1.title', reward: { rarity: 'rare', count: 1 }, rewardKey: 'apprendre.rewardRare', deck: { adult: 'A', minor: 'A' }, sequence: { adult: null, minor: null }, available: { adult: true, minor: false } },
  { id: 'quiz-i2', effectiveId: { adult: 'quiz-i2', minor: 'quiz-i2' }, screen: null, titleKey: 'quizMl.i.v2.title', reward: { rarity: 'rare', count: 1 }, rewardKey: 'apprendre.rewardRare', deck: { adult: 'A', minor: 'A' }, sequence: { adult: null, minor: null }, available: { adult: true, minor: false } },
  { id: 'quiz-i3', effectiveId: { adult: 'quiz-i3', minor: 'quiz-i3' }, screen: null, titleKey: 'quizMl.i.v3.title', reward: { rarity: 'rare', count: 1 }, rewardKey: 'apprendre.rewardRare', deck: { adult: 'A', minor: 'A' }, sequence: { adult: null, minor: null }, available: { adult: true, minor: false } },
  { id: 'quiz-e1', effectiveId: { adult: 'quiz-e1', minor: 'quiz-e1' }, screen: null, titleKey: 'quizMl.e.v1.title', reward: { rarity: 'unique', count: 1 }, rewardKey: 'apprendre.rewardUnique', deck: { adult: 'A', minor: 'A' }, sequence: { adult: null, minor: null }, available: { adult: true, minor: false } },
  { id: 'quiz-e2', effectiveId: { adult: 'quiz-e2', minor: 'quiz-e2' }, screen: null, titleKey: 'quizMl.e.v2.title', reward: { rarity: 'unique', count: 1 }, rewardKey: 'apprendre.rewardUnique', deck: { adult: 'A', minor: 'A' }, sequence: { adult: null, minor: null }, available: { adult: true, minor: false } },
  { id: 'quiz-e3', effectiveId: { adult: 'quiz-e3', minor: 'quiz-e3' }, screen: null, titleKey: 'quizMl.e.v3.title', reward: { rarity: 'unique', count: 1 }, rewardKey: 'apprendre.rewardUnique', deck: { adult: 'A', minor: 'A' }, sequence: { adult: null, minor: null }, available: { adult: true, minor: false } },
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
  // When adult and minor share the same effectiveId, audience can't be inferred — fall back to 'adult'.
  // Invariant: such modules must have deck.adult === deck.minor.
  const sharedId = mod.effectiveId.adult === mod.effectiveId.minor;
  const audience: 'adult' | 'minor' = sharedId
    ? 'adult'
    : mod.effectiveId.minor === effectiveId ? 'minor' : 'adult';
  return {
    ...mod.reward,
    deck: mod.deck[audience],
  };
}
