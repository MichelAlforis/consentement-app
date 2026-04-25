// Type partagé — importé par CollectorCardCanvas + CardGameScreen
export interface GainedCard {
  id: string;
  text: string;
  rarity: 'common' | 'rare' | 'unique';
  gradient: string;
  iconName: string;
  border: string;
}

// Pool Deck A non-explicite, depth 1-3
// depth 1 → common, depth 2 → rare, depth 3 → unique (premium)
const POOL: GainedCard[] = [
  // ── depth 1 / common ──────────────────────────────────────────────
  { id: 'cc-1-1', rarity: 'common', text: "Dites ce que vous aimez sans retenue",               gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', iconName: 'Layers',        border: '#fbbf24' },
  { id: 'cc-1-2', rarity: 'common', text: "Nommez un désir que vous n'avez jamais osé exprimer", gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', iconName: 'Layers',        border: '#fbbf24' },
  { id: 'cc-1-3', rarity: 'common', text: "Partagez ce qui vous met à l'aise dans l'intimité",  gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', iconName: 'MessageCircle', border: '#a78bfa' },
  { id: 'cc-1-4', rarity: 'common', text: "Décrivez une limite que vous voulez explorer",        gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', iconName: 'MessageCircle', border: '#a78bfa' },
  { id: 'cc-1-5', rarity: 'common', text: "Partagez une préférence que l'autre ignore",          gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', iconName: 'Layers',        border: '#fbbf24' },
  { id: 'cc-1-6', rarity: 'common', text: "Exprimez ce dont vous avez besoin ce soir",           gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', iconName: 'MessageCircle', border: '#a78bfa' },

  // ── depth 2 / rare ────────────────────────────────────────────────
  { id: 'cc-2-1', rarity: 'rare', text: "Imaginez un scénario que vous viveriez ensemble",     gradient: 'linear-gradient(135deg, #ec4899, #db2777)', iconName: 'HelpCircle', border: '#f9a8d4' },
  { id: 'cc-2-2', rarity: 'rare', text: "Proposez un défi d'intimité pour cette semaine",       gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', iconName: 'Target',     border: '#93c5fd' },
  { id: 'cc-2-3', rarity: 'rare', text: "Et si vous changiez un rituel pendant un mois ?",      gradient: 'linear-gradient(135deg, #ec4899, #db2777)', iconName: 'HelpCircle', border: '#f9a8d4' },
  { id: 'cc-2-4', rarity: 'rare', text: "Lancez-vous un défi de connexion sans écrans",         gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', iconName: 'Target',     border: '#93c5fd' },

  // ── depth 3 / unique (premium) ────────────────────────────────────
  { id: 'cc-3-1', rarity: 'unique', text: "Révélez votre vérité la plus profonde sur l'intimité", gradient: 'linear-gradient(135deg, #10b981, #059669)', iconName: 'Sparkles', border: '#6ee7b7' },
  { id: 'cc-3-2', rarity: 'unique', text: "Offrez le moment de douceur dont vous rêvez",          gradient: 'linear-gradient(135deg, #be123c, #9f1239)', iconName: 'Heart',    border: '#fda4af' },
];

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface ComputeParams {
  sessionMode: 'seance' | 'libre';
  cardCount: number;
  seanceSize: number;
  sessionDecks: number[];   // numéros de decks joués cette séance
  sessionCount: number;     // total APRÈS incrément (déjà incrémenté dans le store)
  ownedIds: Set<string>;
  isPremium: boolean;
}

// Pure function — ne touche pas au store, appelée une seule fois à la transition 'end'
export function computeGainedCards(p: ComputeParams): GainedCard[] {
  // Uniquement sur séance complète
  if (p.sessionMode !== 'seance' || p.cardCount < p.seanceSize) return [];

  const available = {
    common: POOL.filter((c) => c.rarity === 'common' && !p.ownedIds.has(c.id)),
    rare:   POOL.filter((c) => c.rarity === 'rare'   && !p.ownedIds.has(c.id)),
    unique: POOL.filter((c) => c.rarity === 'unique' && !p.ownedIds.has(c.id) && p.isPremium),
  };

  const gained: GainedCard[] = [];

  // 1 carte common garantie à chaque séance complète
  const base = pickRandom(available.common);
  if (base) gained.push(base);

  // Tous les 3 sessions : bonus rare si decks profonds joués (3-4), common sinon
  if (p.sessionCount % 3 === 0) {
    const playedDeep = p.sessionDecks.some((d) => [3, 4, 5, 6].includes(d));
    const bonusPool = playedDeep
      ? available.rare
      : available.common.filter((c) => c.id !== base?.id);
    const bonus = pickRandom(bonusPool);
    if (bonus) gained.push(bonus);
  }

  // Decks Vérité/Douceur joués + premium : carte unique
  const playedSlow = p.sessionDecks.some((d) => [5, 6].includes(d));
  if (playedSlow && p.isPremium && gained.length < 3) {
    const unique = pickRandom(available.unique.filter((c) => !gained.find((g) => g.id === c.id)));
    if (unique) gained.push(unique);
  }

  return gained.slice(0, 3);
}
