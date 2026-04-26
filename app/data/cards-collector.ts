export type Rarity = 'common' | 'rare' | 'unique';

export type CardTheme = 'osez' | 'parlez' | 'et-si' | 'defi' | 'verite' | 'douceur';

export interface CollectorCard {
  id: string;
  deck: 'A' | 'B' | 'M';
  theme: CardTheme;
  text: string;
  depth: 1 | 2 | 3;
  tags: string[];
  rarity: Rarity;
  unlockedBy: string; // id du module source
  /** @deprecated Remplacé par `theme` — à supprimer Sprint 10 */
  sourceDeck?: number;
  visual: {
    gradient: string;
    iconName: string;
    border: string;
  };
}

// ---------------------------------------------------------------------------
// Deck A — Non-explicite (connexion, communication, exploration émotionnelle)
// ---------------------------------------------------------------------------

export const collectorCards: CollectorCard[] = [
  // ── common · depth 1 ───────────────────────────────────────────────────
  {
    id: 'ca-001',
    deck: 'A',
    theme: 'parlez',
    text: 'Dis à ton partenaire une chose que tu apprécies dans votre façon de communiquer.',
    depth: 1,
    tags: ['communication'],
    rarity: 'common',
    unlockedBy: 'quiz-consentement',
    visual: {
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      iconName: 'MessageCircle',
      border: '#a78bfa',
    },
  },
  {
    id: 'ca-002',
    deck: 'A',
    theme: 'osez',
    text: 'Qu\'est-ce qui te fait te sentir en sécurité avec ton partenaire ?',
    depth: 1,
    tags: ['confiance'],
    rarity: 'common',
    unlockedBy: 'quiz-consentement',
    visual: {
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      iconName: 'Layers',
      border: '#fbbf24',
    },
  },
  {
    id: 'ca-003',
    deck: 'A',
    theme: 'parlez',
    text: 'Décris un moment où tu as senti que votre lien était particulièrement fort.',
    depth: 1,
    tags: ['confiance', 'duo'],
    rarity: 'common',
    unlockedBy: 'porno-vs-realite',
    visual: {
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      iconName: 'MessageCircle',
      border: '#a78bfa',
    },
  },
  {
    id: 'ca-004',
    deck: 'A',
    theme: 'douceur',
    text: 'Quel petit geste de ton partenaire te touche le plus ?',
    depth: 1,
    tags: ['communication'],
    rarity: 'common',
    unlockedBy: 'porno-vs-realite',
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
    theme: 'verite',
    text: 'Parle d\'un désir que tu n\'as jamais encore exprimé à voix haute.',
    depth: 2,
    tags: ['exploration', 'confiance'],
    rarity: 'rare',
    unlockedBy: 'duo-flow',
    visual: {
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      iconName: 'Sparkles',
      border: '#6ee7b7',
    },
  },
  {
    id: 'ca-006',
    deck: 'A',
    theme: 'et-si',
    text: 'Qu\'est-ce que tu voudrais que ton partenaire comprenne mieux de toi ?',
    depth: 2,
    tags: ['communication', 'duo'],
    rarity: 'rare',
    unlockedBy: 'duo-flow',
    visual: {
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
      iconName: 'HelpCircle',
      border: '#f9a8d4',
    },
  },
  {
    id: 'ca-007',
    deck: 'A',
    theme: 'defi',
    text: 'Décris une limite que tu voudrais explorer ensemble, à votre rythme.',
    depth: 2,
    tags: ['cadre', 'exploration'],
    rarity: 'rare',
    unlockedBy: 'loi-consentement',
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
    theme: 'verite',
    text: 'Inventez ensemble un rituel intime qui n\'appartient qu\'à vous deux.',
    depth: 3,
    tags: ['duo', 'exploration'],
    rarity: 'unique',
    unlockedBy: 'module-pratiques-adultes',
    visual: {
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      iconName: 'Sparkles',
      border: '#6ee7b7',
    },
  },
  {
    id: 'ca-009',
    deck: 'A',
    theme: 'douceur',
    text: 'Partagez chacun une fantasy que vous n\'avez jamais osé nommer.',
    depth: 3,
    tags: ['désir', 'confiance'],
    rarity: 'unique',
    unlockedBy: 'module-pratiques-adultes',
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
    theme: 'verite',
    text: 'À venir — contenu rédigé par le juriste.',
    depth: 3,
    tags: ['pratique'],
    rarity: 'unique',
    unlockedBy: 'decouverte-desirs',
    visual: {
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      iconName: 'Sparkles',
      border: '#6ee7b7',
    },
  },
];

export type ThemeCategory = {
  name: string;
  iconName: string;
  gradient: string;
  border: string;
};

export const THEME_CATEGORIES: Record<CardTheme, ThemeCategory> = {
  'osez':    { name: 'Osez',    iconName: 'Layers',        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '#fbbf24' },
  'parlez':  { name: 'Parlez',  iconName: 'MessageCircle', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: '#a78bfa' },
  'et-si':   { name: 'Et si…',  iconName: 'HelpCircle',    gradient: 'linear-gradient(135deg, #ec4899, #db2777)', border: '#f9a8d4' },
  'defi':    { name: 'Défi',    iconName: 'Target',        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: '#93c5fd' },
  'verite':  { name: 'Vérité',  iconName: 'Sparkles',      gradient: 'linear-gradient(135deg, #10b981, #059669)', border: '#6ee7b7' },
  'douceur': { name: 'Douceur', iconName: 'Heart',         gradient: 'linear-gradient(135deg, #be123c, #9f1239)', border: '#fda4af' },
};

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

export function getCardsByTheme(theme: CardTheme): CollectorCard[] {
  return collectorCards.filter((c) => c.theme === theme);
}
