import type { CollectorCard, Rarity } from '../data/cards-collector';
import type { OwnedCard } from '../stores/unlockStore';

type ModuleConfig = {
  rarity: Rarity;
  count: number;
  deck: 'A' | 'M';
};

const MODULE_CONFIG: Record<string, ModuleConfig> = {
  'module-de-base':            { rarity: 'common', count: 24, deck: 'A' },
  'module-de-base-mineur':     { rarity: 'common', count: 24, deck: 'M' },
  'quiz-consentement':         { rarity: 'common', count: 1,  deck: 'A' },
  'porno-vs-realite':          { rarity: 'common', count: 1,  deck: 'A' },
  'loi-consentement':          { rarity: 'rare',   count: 1,  deck: 'A' },
  'duo-flow':                  { rarity: 'rare',   count: 1,  deck: 'A' },
  'module-pratiques-adultes':  { rarity: 'unique', count: 1,  deck: 'A' },
  'quiz-consentement-mineur':  { rarity: 'common', count: 1,  deck: 'M' },
  'porno-vs-realite-mineur':   { rarity: 'common', count: 1,  deck: 'M' },
  'loi-consentement-mineur':   { rarity: 'rare',   count: 1,  deck: 'M' },
  'accompagnement-mineur':     { rarity: 'rare',   count: 1,  deck: 'M' },
};

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function computeModuleGain(
  moduleId: string,
  ownedIds: Set<string>,
  allCards: CollectorCard[]
): OwnedCard[] {
  const config = MODULE_CONFIG[moduleId];
  if (!config) return [];

  const pool = allCards.filter(
    (c) => c.deck === config.deck && c.rarity === config.rarity && !ownedIds.has(c.id)
  );

  if (pool.length === 0) return [];

  const picked = shuffled(pool).slice(0, config.count);
  const now = new Date().toISOString();

  return picked.map((c) => ({
    id: c.id,
    rarity: c.rarity as Rarity,
    gainedOn: now,
    unlockedBy: moduleId,
  }));
}
