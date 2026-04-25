export type Rarity = 'common' | 'rare' | 'unique';

export interface CollectorCard {
  id: string;
  deck: 'A' | 'B';
  text: string;
  depth: 1 | 2 | 3;
  tags: string[];
  rarity: Rarity;
  unlockedBy: string; // id du module source
  // decks gameplay liés (1–6) — pour le mapping session → gain
  sourceDeck?: number;
  visual: {
    gradient: string;
    iconName: string;
    border: string;
  };
}

// ---------------------------------------------------------------------------
// Deck A — Non-explicite (connexion, communication, exploration émotionnelle)
// Stubs — textes depth 2–3 à compléter par le juriste
// ---------------------------------------------------------------------------

export const collectorCards: CollectorCard[] = [
  // ── common · depth 1 ───────────────────────────────────────────────────
  {
    id: 'ca-001',
    deck: 'A',
    text: 'Dis à ton partenaire une chose que tu apprécies dans votre façon de communiquer.',
    depth: 1,
    tags: ['communication'],
    rarity: 'common',
    unlockedBy: 'quiz-consentement',
    sourceDeck: 2,
    visual: {
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      iconName: 'MessageCircle',
      border: '#a78bfa',
    },
  },
  {
    id: 'ca-002',
    deck: 'A',
    text: 'Qu\'est-ce qui te fait te sentir en sécurité avec ton partenaire ?',
    depth: 1,
    tags: ['confiance'],
    rarity: 'common',
    unlockedBy: 'quiz-consentement',
    sourceDeck: 1,
    visual: {
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      iconName: 'Layers',
      border: '#fbbf24',
    },
  },
  {
    id: 'ca-003',
    deck: 'A',
    text: 'Décris un moment où tu as senti que votre lien était particulièrement fort.',
    depth: 1,
    tags: ['confiance', 'duo'],
    rarity: 'common',
    unlockedBy: 'porno-vs-realite',
    sourceDeck: 2,
    visual: {
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      iconName: 'MessageCircle',
      border: '#a78bfa',
    },
  },
  {
    id: 'ca-004',
    deck: 'A',
    text: 'Quel petit geste de ton partenaire te touche le plus ?',
    depth: 1,
    tags: ['communication'],
    rarity: 'common',
    unlockedBy: 'porno-vs-realite',
    sourceDeck: 6,
    visual: {
      gradient: 'linear-gradient(135deg, #be123c, #9f1239)',
      iconName: 'Heart',
      border: '#fda4af',
    },
  },

  // ── rare · depth 2 ─────────────────────────────────────────────────────
  {
    id: 'ca-005',
    deck: 'A',
    text: 'Parle d\'un désir que tu n\'as jamais encore exprimé à voix haute.',
    depth: 2,
    tags: ['exploration', 'confiance'],
    rarity: 'rare',
    unlockedBy: 'duo-flow',
    sourceDeck: 5,
    visual: {
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      iconName: 'Sparkles',
      border: '#6ee7b7',
    },
  },
  {
    id: 'ca-006',
    deck: 'A',
    text: 'Qu\'est-ce que tu voudrais que ton partenaire comprenne mieux de toi ?',
    depth: 2,
    tags: ['communication', 'duo'],
    rarity: 'rare',
    unlockedBy: 'duo-flow',
    sourceDeck: 3,
    visual: {
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
      iconName: 'HelpCircle',
      border: '#f9a8d4',
    },
  },
  {
    id: 'ca-007',
    deck: 'A',
    text: 'Décris une limite que tu voudrais explorer ensemble, à votre rythme.',
    depth: 2,
    tags: ['cadre', 'exploration'],
    rarity: 'rare',
    unlockedBy: 'consent-check',
    sourceDeck: 4,
    visual: {
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      iconName: 'Target',
      border: '#93c5fd',
    },
  },

  // ── unique · depth 3 ───────────────────────────────────────────────────
  {
    id: 'ca-008',
    deck: 'A',
    text: 'Inventez ensemble un rituel intime qui n\'appartient qu\'à vous deux.',
    depth: 3,
    tags: ['duo', 'exploration'],
    rarity: 'unique',
    unlockedBy: 'module-pratiques-adultes',
    sourceDeck: 5,
    visual: {
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      iconName: 'Sparkles',
      border: '#6ee7b7',
    },
  },
  {
    id: 'ca-009',
    deck: 'A',
    text: 'Partagez chacun une fantasy que vous n\'avez jamais osé nommer.',
    depth: 3,
    tags: ['désir', 'confiance'],
    rarity: 'unique',
    unlockedBy: 'module-pratiques-adultes',
    sourceDeck: 6,
    visual: {
      gradient: 'linear-gradient(135deg, #be123c, #9f1239)',
      iconName: 'Heart',
      border: '#fda4af',
    },
  },

  // ── Deck B · unique · depth 3 (stub — contenu juriste à venir) ─────────
  {
    id: 'cb-001',
    deck: 'B',
    text: 'À venir — contenu rédigé par le juriste.',
    depth: 3,
    tags: ['pratique'],
    rarity: 'unique',
    unlockedBy: 'decouverte-desirs',
    sourceDeck: 5,
    visual: {
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      iconName: 'Sparkles',
      border: '#6ee7b7',
    },
  },
];

// Helpers de lecture

export function getCollectorCardById(id: string): CollectorCard | undefined {
  return collectorCards.find((c) => c.id === id);
}

export function getCardsByDepth(depth: 1 | 2 | 3): CollectorCard[] {
  return collectorCards.filter((c) => c.depth === depth);
}

export function getCardsByRarity(rarity: Rarity): CollectorCard[] {
  return collectorCards.filter((c) => c.rarity === rarity);
}
