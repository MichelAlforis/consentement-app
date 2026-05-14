import type { CollectorCard } from '../data/cards-collector';
import type { Rarity } from '../types';
import type { OwnedCard } from '../types';
import { getModuleReward } from '../data/modules';

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
  const config = getModuleReward(moduleId);
  if (!config) return [];

  const pool = allCards.filter(
    (c) =>
      c.deck === config.deck &&
      c.rarity === config.rarity &&
      !c.id.startsWith('lex-') &&
      !ownedIds.has(c.id)
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
