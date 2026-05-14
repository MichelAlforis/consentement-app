import type { IconName } from '../utils/iconFromName';

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
    iconName: IconName;
    border: string;
  };
}

// ---------------------------------------------------------------------------
// Deck A — Non-explicite (connexion, communication, exploration émotionnelle)
// ---------------------------------------------------------------------------

// ── Visuels par thème (réutilisés ci-dessous) ────────────────────────────────
const V = {
  osez:    { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', iconName: 'Layers',        border: '#fbbf24' },
  parlez:  { gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', iconName: 'MessageCircle', border: '#a78bfa' },
  'et-si': { gradient: 'linear-gradient(135deg, #ec4899, #db2777)', iconName: 'HelpCircle',    border: '#f9a8d4' },
  defi:    { gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', iconName: 'Target',        border: '#93c5fd' },
  verite:  { gradient: 'linear-gradient(135deg, #10b981, #059669)', iconName: 'Sparkles',      border: '#6ee7b7' },
  douceur: { gradient: 'linear-gradient(135deg, #be123c, #9f1239)', iconName: 'Heart',         border: '#fda4af' },
} satisfies Record<CardTheme, { gradient: string; iconName: IconName; border: string }>;

// Palette Deck B — Kamasutra (rouge profond → bordeaux)
export const deckBVisuals = {
  fire:    { gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)', iconName: 'Flame'    as IconName, border: '#fca5a5' }, // common  · heat-4
  passion: { gradient: 'linear-gradient(135deg, #9f1239, #7f1d1d)', iconName: 'Heart'    as IconName, border: '#fda4af' }, // rare    · heat-4/5
  noir:    { gradient: 'linear-gradient(135deg, #450a0a, #1c0707)', iconName: 'Sparkles' as IconName, border: '#ef4444' }, // unique  · heat-5
};

export const collectorCards: CollectorCard[] = [

  // ═══════════════════════════════════════════════════════════════════════
  // DECK A — Adultes · non-explicite (connexion, communication, exploration)
  // ═══════════════════════════════════════════════════════════════════════

  // ── common · depth 1 · 24 cartes · débloquées par module-de-base ──────

  // Osez (4) — dépasser la gêne, demander ce qu'on veut vraiment
  { id: 'ca-001', deck: 'A', theme: 'osez',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['confiance'],      visual: V.osez,   text: "Qu'est-ce qui te fait te sentir en sécurité avec ton partenaire ?" },
  { id: 'ca-002', deck: 'A', theme: 'osez',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['désir'],          visual: V.osez,   text: "Nomme une chose que tu aimerais faire mais que tu n'as jamais osé proposer." },
  { id: 'ca-003', deck: 'A', theme: 'osez',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['communication'],  visual: V.osez,   text: "Qu'est-ce qui te retient parfois d'exprimer ce que tu veux vraiment ?" },
  { id: 'ca-004', deck: 'A', theme: 'osez',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['communication'],  visual: V.osez,   text: "Dis à voix haute quelque chose que tu trouves difficile à demander." },

  // Parlez (4) — communication explicite, exprimer ses besoins
  { id: 'ca-005', deck: 'A', theme: 'parlez', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['communication'],  visual: V.parlez, text: "Dis à ton partenaire une chose que tu apprécies dans votre façon de communiquer." },
  { id: 'ca-006', deck: 'A', theme: 'parlez', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['confiance'],      visual: V.parlez, text: "Décris un moment où tu as senti que votre lien était particulièrement fort." },
  { id: 'ca-007', deck: 'A', theme: 'parlez', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['écoute'],         visual: V.parlez, text: "Qu'est-ce que ton partenaire fait qui te fait te sentir vraiment entendu·e ?" },
  { id: 'ca-008', deck: 'A', theme: 'parlez', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['consentement'],   visual: V.parlez, text: "Comment préfères-tu qu'on te dise non ? Montre-lui." },

  // Et si… (4) — imagination, scénarios hypothétiques, exploration douce
  { id: 'ca-009', deck: 'A', theme: 'et-si',  depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['consentement'],   visual: V['et-si'], text: "Et si vous inventiez un mot de code pour dire 'j'ai besoin d'une pause' ?" },
  { id: 'ca-010', deck: 'A', theme: 'et-si',  depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['duo'],            visual: V['et-si'], text: "Et si chacun décrivait l'endroit parfait pour se retrouver ?" },
  { id: 'ca-011', deck: 'A', theme: 'et-si',  depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['relation'],       visual: V['et-si'], text: "Et si tu pouvais changer une habitude dans votre relation — laquelle ?" },
  { id: 'ca-012', deck: 'A', theme: 'et-si',  depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['connexion'],      visual: V['et-si'], text: "Et si vous passiez 24h sans écrans ensemble — qu'est-ce que vous feriez ?" },

  // Défi (4) — défis doux, proposer quelque chose de nouveau
  { id: 'ca-013', deck: 'A', theme: 'defi',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['communication'],  visual: V.defi,   text: "Fais un compliment sincère sur quelque chose que tu n'as jamais dit." },
  { id: 'ca-014', deck: 'A', theme: 'defi',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['consentement'],   visual: V.defi,   text: "Décris ce que représente le consentement pour toi en trois mots." },
  { id: 'ca-015', deck: 'A', theme: 'defi',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['exploration'],    visual: V.defi,   text: "Propose quelque chose que vous n'avez jamais fait ensemble — même simple." },
  { id: 'ca-016', deck: 'A', theme: 'defi',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['désir'],          visual: V.defi,   text: "Dis à ton partenaire ce que tu voudrais qu'il/elle fasse plus souvent." },

  // Vérité (4) — sincérité, révélations, vulnérabilité
  { id: 'ca-017', deck: 'A', theme: 'verite', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['vulnérabilité'],  visual: V.verite, text: "Qu'est-ce qui te rend le plus vulnérable dans une relation intime ?" },
  { id: 'ca-018', deck: 'A', theme: 'verite', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['relation'],       visual: V.verite, text: "Y a-t-il quelque chose dans notre relation que tu veux qu'on améliore ?" },
  { id: 'ca-019', deck: 'A', theme: 'verite', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['confiance'],      visual: V.verite, text: "Partage un moment où tu as changé d'avis sur quelque chose d'important." },
  { id: 'ca-020', deck: 'A', theme: 'verite', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['communication'],  visual: V.verite, text: "Qu'est-ce que tu n'as jamais dit mais que tu ressens souvent ?" },

  // Douceur (4) — tendresse, soin, gestes d'amour
  { id: 'ca-021', deck: 'A', theme: 'douceur', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['affection'],     visual: V.douceur, text: "Quel petit geste de ton partenaire te touche le plus ?" },
  { id: 'ca-022', deck: 'A', theme: 'douceur', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['soin'],          visual: V.douceur, text: "Qu'est-ce qui te fait te sentir choyé·e sans avoir besoin de le demander ?" },
  { id: 'ca-023', deck: 'A', theme: 'douceur', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['affection'],     visual: V.douceur, text: "Nomme quelque chose que tu aimes faire juste pour faire plaisir à l'autre." },
  { id: 'ca-024', deck: 'A', theme: 'douceur', depth: 1, rarity: 'common', unlockedBy: 'module-de-base', tags: ['connexion'],     visual: V.douceur, text: "Décris le moment idéal pour se retrouver après une journée difficile." },

  // ── rare · depth 2 · débloquées par modules medium ────────────────────

  // Verite, Et-si, Défi (existants)
  { id: 'ca-025', deck: 'A', theme: 'verite',  depth: 2, rarity: 'rare', unlockedBy: 'duo-flow',            tags: ['désir'],         visual: V.verite,    text: "Parle d'un désir que tu n'as jamais encore exprimé à voix haute." },
  { id: 'ca-026', deck: 'A', theme: 'et-si',   depth: 2, rarity: 'rare', unlockedBy: 'duo-flow',            tags: ['communication'], visual: V['et-si'],  text: "Qu'est-ce que tu voudrais que ton partenaire comprenne mieux de toi ?" },
  { id: 'ca-027', deck: 'A', theme: 'defi',    depth: 2, rarity: 'rare', unlockedBy: 'loi-consentement',    tags: ['exploration'],   visual: V.defi,      text: "Décris une limite que tu voudrais explorer ensemble, à votre rythme." },

  // Osez — porno-vs-realite & loi-consentement
  { id: 'ca-030', deck: 'A', theme: 'osez',    depth: 2, rarity: 'rare', unlockedBy: 'porno-vs-realite',    tags: ['conscience'],    visual: V.osez,      text: "Depuis que tu réfléchis au consentement, qu'est-ce qui a changé dans ta façon de dire ce que tu veux ?" },
  { id: 'ca-031', deck: 'A', theme: 'osez',    depth: 2, rarity: 'rare', unlockedBy: 'loi-consentement',    tags: ['limites'],       visual: V.osez,      text: "Y a-t-il quelque chose que tu pensais obligatoire dans une relation mais que tu réalises être un choix ?" },

  // Parlez — quiz-consentement & duo-flow
  { id: 'ca-032', deck: 'A', theme: 'parlez',  depth: 2, rarity: 'rare', unlockedBy: 'quiz-consentement',   tags: ['communication'], visual: V.parlez,    text: "Comment préfères-tu recevoir un refus — qu'est-ce qui te fait te sentir respecté·e malgré tout ?" },
  { id: 'ca-033', deck: 'A', theme: 'parlez',  depth: 2, rarity: 'rare', unlockedBy: 'duo-flow',            tags: ['consentement'],  visual: V.parlez,    text: "Comment vous assurez-vous mutuellement que ce que vous faites est vraiment souhaité par les deux ?" },

  // Et-si — quiz-consentement
  { id: 'ca-034', deck: 'A', theme: 'et-si',   depth: 2, rarity: 'rare', unlockedBy: 'quiz-consentement',   tags: ['relation'],      visual: V['et-si'],  text: "Et si tu devais réécrire les règles implicites de votre relation — qu'est-ce que tu changerais ?" },
  { id: 'ca-035', deck: 'A', theme: 'et-si',   depth: 2, rarity: 'rare', unlockedBy: 'duo-flow',            tags: ['communication'], visual: V['et-si'],  text: "Et si l'un·e de vous deux changeait d'avis en cours de route — comment vous l'exprimeriez ?" },

  // Défi — porno-vs-realite & quiz-consentement
  { id: 'ca-036', deck: 'A', theme: 'defi',    depth: 2, rarity: 'rare', unlockedBy: 'porno-vs-realite',    tags: ['conscience'],    visual: V.defi,      text: "Décris une chose que la pornographie t'a fait croire normale et que tu remettrais maintenant en question." },
  { id: 'ca-037', deck: 'A', theme: 'defi',    depth: 2, rarity: 'rare', unlockedBy: 'quiz-consentement',   tags: ['limites'],       visual: V.defi,      text: "Nomme une chose que tu autorises parfois sans vraiment le vouloir — et explore pourquoi avec l'autre." },

  // Vérité — loi-consentement & quiz-consentement
  { id: 'ca-038', deck: 'A', theme: 'verite',  depth: 2, rarity: 'rare', unlockedBy: 'loi-consentement',    tags: ['limites'],       visual: V.verite,    text: "Qu'est-ce qui te ferait dire stop immédiatement — et l'as-tu déjà dit à voix haute à ton/ta partenaire ?" },
  { id: 'ca-039', deck: 'A', theme: 'verite',  depth: 2, rarity: 'rare', unlockedBy: 'quiz-consentement',   tags: ['vulnérabilité'], visual: V.verite,    text: "Qu'est-ce qui te met le plus mal à l'aise dans une relation intime — même si tu ne l'as jamais dit ?" },

  // Douceur — porno-vs-realite, duo-flow, loi-consentement
  { id: 'ca-040', deck: 'A', theme: 'douceur', depth: 2, rarity: 'rare', unlockedBy: 'porno-vs-realite',    tags: ['respect'],       visual: V.douceur,   text: "Qu'est-ce qui te fait te sentir respecté·e dans l'intimité — au-delà du simple accord verbal ?" },
  { id: 'ca-041', deck: 'A', theme: 'douceur', depth: 2, rarity: 'rare', unlockedBy: 'duo-flow',            tags: ['connexion'],     visual: V.douceur,   text: "Qu'est-ce qui manque dans votre façon d'exprimer la tendresse — que l'un·e ou l'autre voudrait plus souvent ?" },
  { id: 'ca-042', deck: 'A', theme: 'douceur', depth: 2, rarity: 'rare', unlockedBy: 'loi-consentement',    tags: ['affection'],     visual: V.douceur,   text: "Y a-t-il un geste de votre relation qui vous semblait banal mais qui est en fait un choix précieux ?" },

  // ── unique · depth 3 · débloquées par module-pratiques-adultes ────────
  { id: 'ca-043', deck: 'A', theme: 'verite',  depth: 3, rarity: 'unique', unlockedBy: 'module-pratiques-adultes', tags: ['intimité'],  visual: V.verite,    text: "Inventez ensemble un rituel intime qui n'appartient qu'à vous deux." },
  { id: 'ca-044', deck: 'A', theme: 'douceur', depth: 3, rarity: 'unique', unlockedBy: 'module-pratiques-adultes', tags: ['désir'],     visual: V.douceur,   text: "Partagez chacun une envie que vous n'avez jamais osé nommer." },
  { id: 'ca-045', deck: 'A', theme: 'osez',    depth: 3, rarity: 'unique', unlockedBy: 'module-pratiques-adultes', tags: ['désir'],     visual: V.osez,      text: "Dites-vous en détail ce que vous n'avez jamais osé proposer. L'autre écoute sans interrompre." },
  { id: 'ca-046', deck: 'A', theme: 'parlez',  depth: 3, rarity: 'unique', unlockedBy: 'module-pratiques-adultes', tags: ['accord'],    visual: V.parlez,    text: "Créez ensemble un code : un mot pour 'ralentis', un pour 'plus', un pour 'stop'. Testez-le maintenant." },
  { id: 'ca-047', deck: 'A', theme: 'et-si',   depth: 3, rarity: 'unique', unlockedBy: 'module-pratiques-adultes', tags: ['exploration'], visual: V['et-si'], text: "Et si vous passiez cette nuit sans aucune règle implicite — qu'est-ce que vous voudriez vraiment ?" },
  { id: 'ca-048', deck: 'A', theme: 'defi',    depth: 3, rarity: 'unique', unlockedBy: 'module-pratiques-adultes', tags: ['communication'], visual: V.defi,  text: "Défiez-vous : chacun·e décrit ce qu'il/elle veut explorer ce soir. L'autre ne peut que dire oui, non ou peut-être." },

  // ═══════════════════════════════════════════════════════════════════════
  // DECK M — Mineurs 13-14 ans · langue adaptée, consentement & relations saines
  // ═══════════════════════════════════════════════════════════════════════

  // ── common · depth 1 · 24 cartes · débloquées par module-de-base-mineur

  // Osez (4) — dire ce qu'on veut/ne veut pas, résister à la pression
  { id: 'cm-001', deck: 'M', theme: 'osez',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['consentement'], visual: V.osez,   text: "Y a-t-il quelque chose que tu voudrais dire à quelqu'un mais que tu n'oses pas ?" },
  { id: 'cm-002', deck: 'M', theme: 'osez',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['pression'],     visual: V.osez,   text: "Qu'est-ce qui te retient de dire non quand quelqu'un t'insiste ?" },
  { id: 'cm-003', deck: 'M', theme: 'osez',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['limites'],       visual: V.osez,   text: "Nomme une chose que tu aimerais qu'on te demande avant de faire." },
  { id: 'cm-004', deck: 'M', theme: 'osez',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['consentement'], visual: V.osez,   text: "As-tu déjà dit oui à quelque chose juste pour faire plaisir ? Comment tu t'es senti·e ?" },

  // Parlez (4) — communication, écoute, exprimer ses limites
  { id: 'cm-005', deck: 'M', theme: 'parlez', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['respect'],       visual: V.parlez, text: "Comment tu sais qu'une personne te respecte vraiment ?" },
  { id: 'cm-006', deck: 'M', theme: 'parlez', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['consentement'], visual: V.parlez, text: "Qu'est-ce que tu fais quand tu veux arrêter quelque chose et que l'autre n'écoute pas ?" },
  { id: 'cm-007', deck: 'M', theme: 'parlez', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['limites'],       visual: V.parlez, text: "Qu'est-ce qui te rend plus facile de parler de tes limites à quelqu'un ?" },
  { id: 'cm-008', deck: 'M', theme: 'parlez', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['respect'],       visual: V.parlez, text: "Comment tu réagis quand quelqu'un te dit non ? Est-ce que ça te semble normal ?" },

  // Et si… (4) — situations hypothétiques, empathie
  { id: 'cm-009', deck: 'M', theme: 'et-si',  depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['respect'],       visual: V['et-si'], text: "Et si tu pouvais créer une règle dans ta classe sur le respect — laquelle ?" },
  { id: 'cm-010', deck: 'M', theme: 'et-si',  depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['consentement'], visual: V['et-si'], text: "Et si tu devais expliquer le consentement à un enfant de 8 ans — comment tu ferais ?" },
  { id: 'cm-011', deck: 'M', theme: 'et-si',  depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['amitié'],        visual: V['et-si'], text: "Et si un·e ami·e te parlait d'une situation où il/elle n'était pas à l'aise — que lui dirais-tu ?" },
  { id: 'cm-012', deck: 'M', theme: 'et-si',  depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['relation'],      visual: V['et-si'], text: "Et si tu pouvais changer une chose dans la façon dont les gens se parlent autour de toi ?" },

  // Défi (4) — affirmation de soi, poser des limites
  { id: 'cm-013', deck: 'M', theme: 'defi',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['confiance'],    visual: V.defi,   text: "Dis une chose positive sur toi sans minimiser — juste un fait." },
  { id: 'cm-014', deck: 'M', theme: 'defi',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['pression'],     visual: V.defi,   text: "Nomme deux choses que tu ne voudrais jamais faire même si tout le monde le fait." },
  { id: 'cm-015', deck: 'M', theme: 'defi',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['limites'],      visual: V.defi,   text: "Raconte un moment où tu as dit non et tu en étais fier·ère." },
  { id: 'cm-016', deck: 'M', theme: 'defi',   depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['consentement'], visual: V.defi,   text: "Propose une façon de vérifier que l'autre est vraiment ok avant de faire quelque chose ensemble." },

  // Vérité (4) — relations saines, reconnaître les signaux
  { id: 'cm-017', deck: 'M', theme: 'verite', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['relation'],     visual: V.verite, text: "C'est quoi pour toi une relation saine — avec un·e ami·e ou un·e amoureux·se ?" },
  { id: 'cm-018', deck: 'M', theme: 'verite', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['respect'],      visual: V.verite, text: "Y a-t-il quelqu'un dans ta vie qui te respecte toujours ? Pourquoi tu penses ça ?" },
  { id: 'cm-019', deck: 'M', theme: 'verite', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['amitié'],       visual: V.verite, text: "Qu'est-ce que tu ferais si un·e ami·e te disait que quelqu'un le/la met mal à l'aise ?" },
  { id: 'cm-020', deck: 'M', theme: 'verite', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['limites'],      visual: V.verite, text: "As-tu déjà ressenti que quelqu'un franchissait tes limites sans le réaliser ?" },

  // Douceur (4) — bienveillance, soin, connexion non-romantique
  { id: 'cm-021', deck: 'M', theme: 'douceur', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['affection'],   visual: V.douceur, text: "C'est quoi pour toi un geste qui montre qu'on tient à quelqu'un sans être amoureux·se ?" },
  { id: 'cm-022', deck: 'M', theme: 'douceur', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['soutien'],     visual: V.douceur, text: "Qu'est-ce qui te fait du bien quand tu ne vas pas bien — et que les autres peuvent faire ?" },
  { id: 'cm-023', deck: 'M', theme: 'douceur', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['connexion'],   visual: V.douceur, text: "Nomme quelqu'un qui te donne de l'énergie juste par sa présence. Pourquoi ?" },
  { id: 'cm-024', deck: 'M', theme: 'douceur', depth: 1, rarity: 'common', unlockedBy: 'module-de-base-mineur', tags: ['consentement'], visual: V.douceur, text: "Qu'est-ce qui rend un câlin ou une accolade OK ou pas OK selon toi ?" },

  // ── rare · depth 2 · débloquées par modules medium mineurs ────────────

  // Vérité, Et-si (existants)
  { id: 'cm-025', deck: 'M', theme: 'verite',  depth: 2, rarity: 'rare', unlockedBy: 'accompagnement-mineur',    tags: ['aide'],      visual: V.verite,    text: "Y a-t-il une situation qui te fait peur mais dont tu n'oses pas parler à un adulte ?" },
  { id: 'cm-026', deck: 'M', theme: 'et-si',   depth: 2, rarity: 'rare', unlockedBy: 'loi-consentement-mineur', tags: ['droits'],     visual: V['et-si'],  text: "Si un·e ami·e subissait quelque chose d'illégal, tu saurais vers qui l'orienter ?" },

  // Osez — porno-vs-realite-mineur & loi-consentement-mineur
  { id: 'cm-027', deck: 'M', theme: 'osez',    depth: 2, rarity: 'rare', unlockedBy: 'porno-vs-realite-mineur',  tags: ['pression'],  visual: V.osez,      text: "Y a-t-il des choses que tu crois que tu 'devrais' vouloir mais que tu ne ressens pas vraiment ?" },
  { id: 'cm-028', deck: 'M', theme: 'osez',    depth: 2, rarity: 'rare', unlockedBy: 'loi-consentement-mineur', tags: ['droits'],     visual: V.osez,      text: "Si quelqu'un faisait quelque chose qui te mettrait mal à l'aise, tu saurais expliquer tes droits ?" },

  // Parlez — quiz-consentement-mineur & accompagnement-mineur
  { id: 'cm-029', deck: 'M', theme: 'parlez',  depth: 2, rarity: 'rare', unlockedBy: 'quiz-consentement-mineur', tags: ['communication'], visual: V.parlez, text: "Pratique à voix haute : comment tu dirais 'je ne suis pas à l'aise' sans que ça soit gênant ?" },
  { id: 'cm-030', deck: 'M', theme: 'parlez',  depth: 2, rarity: 'rare', unlockedBy: 'accompagnement-mineur',    tags: ['aide'],      visual: V.parlez,    text: "Y a-t-il une situation dans ta vie où tu aimerais de l'aide mais tu ne sais pas comment la demander ?" },

  // Défi — quiz-consentement-mineur & accompagnement-mineur
  { id: 'cm-031', deck: 'M', theme: 'defi',    depth: 2, rarity: 'rare', unlockedBy: 'quiz-consentement-mineur', tags: ['confiance'],  visual: V.defi,     text: "Entraîne-toi : dis 'non, je ne veux pas' à voix haute. Est-ce plus facile ou plus dur que tu pensais ?" },
  { id: 'cm-032', deck: 'M', theme: 'defi',    depth: 2, rarity: 'rare', unlockedBy: 'accompagnement-mineur',    tags: ['ressources'], visual: V.defi,     text: "Nomme trois personnes de confiance à qui tu pourrais parler de n'importe quoi — même si c'est difficile." },

  // Vérité — porno-vs-realite-mineur & quiz-consentement-mineur
  { id: 'cm-033', deck: 'M', theme: 'verite',  depth: 2, rarity: 'rare', unlockedBy: 'porno-vs-realite-mineur',  tags: ['norme'],     visual: V.verite,    text: "Y a-t-il des images ou messages que tu vois qui te font te sentir 'pas normal·e' par rapport à toi-même ?" },
  { id: 'cm-034', deck: 'M', theme: 'verite',  depth: 2, rarity: 'rare', unlockedBy: 'quiz-consentement-mineur', tags: ['question'],  visual: V.verite,    text: "Y a-t-il une question que tu aimerais pouvoir poser à un adulte de confiance mais que tu n'oses pas ?" },

  // Et-si — quiz-consentement-mineur & loi-consentement-mineur
  { id: 'cm-035', deck: 'M', theme: 'et-si',   depth: 2, rarity: 'rare', unlockedBy: 'quiz-consentement-mineur', tags: ['pression'],  visual: V['et-si'],  text: "Et si tout le monde autour de toi faisait quelque chose que tu ne veux pas faire — comment tu agirais ?" },
  { id: 'cm-036', deck: 'M', theme: 'et-si',   depth: 2, rarity: 'rare', unlockedBy: 'loi-consentement-mineur', tags: ['education'], visual: V['et-si'],  text: "Et si tu devais expliquer le consentement à quelqu'un de ton âge en une seule phrase — laquelle ?" },

  // Douceur — accompagnement-mineur & loi-consentement-mineur
  { id: 'cm-037', deck: 'M', theme: 'douceur', depth: 2, rarity: 'rare', unlockedBy: 'accompagnement-mineur',    tags: ['sécurité'],  visual: V.douceur,   text: "Qu'est-ce qui te fait sentir en sécurité avec quelqu'un — qu'est-ce qui fait la différence pour toi ?" },
  { id: 'cm-038', deck: 'M', theme: 'douceur', depth: 2, rarity: 'rare', unlockedBy: 'loi-consentement-mineur', tags: ['respect'],   visual: V.douceur,   text: "C'est quoi pour toi une amitié ou une relation où tu te sens vraiment respecté·e ? Décris-la." },

  // ═══════════════════════════════════════════════════════════════════════
  // DECK B — Adultes · Kamasutra · explicite
  // Gate : isAdult && explicitMode (CardGame) + isHeatUnlocked('kamasutra', level)
  // unlockedBy : 'heat-4' ou 'heat-5' — rareté INDÉPENDANTE du palier
  // ═══════════════════════════════════════════════════════════════════════

  // ── heat-4 · common · depth 1 ─────────────────────────────────────────
  // Positions classiques — défi de communication simple

  // Justification rareté : exercice direct, question accessible → common
  { id: 'cb-001', deck: 'B', theme: 'defi',    depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', 'missionnaire'],  visual: deckBVisuals.fire,    text: 'Avant votre prochaine fois en missionnaire : dites chacun un réglage précis qui changerait tout — rythme, angle, contact.' },
  // Justification rareté : signal à inventer ensemble, simple → common
  { id: 'cb-002', deck: 'B', theme: 'parlez',  depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', 'levrette'],      visual: deckBVisuals.fire,    text: 'La levrette coupe le contact visuel. Inventez maintenant un signal pour "j\'adore ça" et un pour "ralentis".' },
  // Justification rareté : question directe sur une habitude → common
  { id: 'cb-003', deck: 'B', theme: 'parlez',  depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', 'cuillere'],      visual: deckBVisuals.fire,    text: 'En cuillère, qui initie d\'habitude ? Discutez si cette répartition vous convient vraiment à tous les deux.' },
  // Justification rareté : réflexion concrète sur le contrôle → common
  { id: 'cb-004', deck: 'B', theme: 'osez',    depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', 'cowgirl'],       visual: deckBVisuals.fire,    text: 'La personne du dessus contrôle le rythme. Partenaire du dessous : comment exprimes-tu tes préférences sans briser l\'élan ?' },
  // Justification rareté : signal non-verbal à définir ensemble → common
  { id: 'cb-005', deck: 'B', theme: 'parlez',  depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', 'andromaque'],    visual: deckBVisuals.fire,    text: 'En andromaque vous ne vous voyez pas. Quel geste utilisez-vous pour signaler "j\'adore" ou "ralentis" ? Définissez-le maintenant.' },
  // Justification rareté : négociation simple avant la position → common
  { id: 'cb-006', deck: 'B', theme: 'defi',    depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', 'papillon'],      visual: deckBVisuals.fire,    text: 'Au bord du lit, partenaire allongé. Avant d\'essayer le papillon : négociez l\'angle, le rythme et la profondeur à voix haute.' },
  // Justification rareté : communication sur l'inconfort, directe → common
  { id: 'cb-007', deck: 'B', theme: 'parlez',  depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', 'equerre'],       visual: deckBVisuals.fire,    text: 'Jambe levée sur l\'épaule. Dites clairement comment vous voulez que l\'autre ajuste sa position si quelque chose devient inconfortable.' },
  // Justification rareté : question sur le consentement simultané → common
  { id: 'cb-008', deck: 'B', theme: 'verite',  depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', '69'],            visual: deckBVisuals.fire,    text: 'Le 69 c\'est du simultané. Comment vérifiez-vous que les deux ont la même envie au même moment ?' },
  // Justification rareté : réflexion sur l'adaptation physique → common
  { id: 'cb-009', deck: 'B', theme: 'parlez',  depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', 'debout'],        visual: deckBVisuals.fire,    text: 'Debout demande de la synchronisation physique. Qui s\'adapte à qui — et l\'avez-vous décidé ensemble avant ?' },
  // Justification rareté : signal de plaisir dans position sans contact visuel → common
  { id: 'cb-010', deck: 'B', theme: 'parlez',  depth: 1, rarity: 'common', unlockedBy: 'heat-4', tags: ['kamasutra', 'cowgirl-inv'],   visual: deckBVisuals.fire,    text: 'En cowgirl inversée vous ne vous regardez pas. Comment la personne du dessous communique-t-elle son plaisir ou son inconfort ?' },

  // ── heat-4 · rare · depth 2 ───────────────────────────────────────────
  // Positions qui demandent une conversation plus profonde

  // Justification rareté : silence intime, vulnérabilité difficile à nommer → rare
  { id: 'cb-011', deck: 'B', theme: 'verite',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'lotus'],         visual: deckBVisuals.passion, text: 'Lotus : corps enlacés, face à face. Restez dans cette position 30 secondes sans bouger. Qu\'est-ce que ça révèle sur votre façon de vous regarder ?' },
  // Justification rareté : question sur le contrôle, difficile à aborder → rare
  { id: 'cb-012', deck: 'B', theme: 'verite',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'amazone'],       visual: deckBVisuals.passion, text: 'L\'amazone met l\'un d\'entre vous en position dominante. Avez-vous déjà parlé explicitement de qui "prend le contrôle" — et si ça vous convient ?' },
  // Justification rareté : code non-verbal à créer ensemble, créatif → rare
  { id: 'cb-013', deck: 'B', theme: 'et-si',   depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'balancier'],     visual: deckBVisuals.passion, text: 'Le balancier se rythme à deux. Inventez un code non-verbal pour vous synchroniser sans parler — et testez-le.' },
  // Justification rareté : question sur l'autorité dans la position → rare
  { id: 'cb-014', deck: 'B', theme: 'parlez',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'mur'],           visual: deckBVisuals.passion, text: 'Contre le mur — soutien et puissance. Qui donne le signal pour changer de position ou s\'arrêter — et comment ?' },
  // Justification rareté : limite de profondeur difficile à nommer → rare
  { id: 'cb-015', deck: 'B', theme: 'verite',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'jambes-epaules'], visual: deckBVisuals.passion, text: 'Jambes sur les épaules augmente la profondeur. Avez-vous déjà dit à voix haute où est votre limite — et qu\'est-ce qui l\'a changée ?' },
  // Justification rareté : ancrage corporel, réflexion intime → rare
  { id: 'cb-016', deck: 'B', theme: 'douceur', depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'cuillere-jambe'], visual: deckBVisuals.passion, text: 'Double cuillère, jambe levée — contact maximal. Quelle partie du corps vous ancre dans cette position, et pourquoi ?' },
  // Justification rareté : vulnérabilité du face à face total → rare
  { id: 'cb-017', deck: 'B', theme: 'verite',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'assis-face'],    visual: deckBVisuals.passion, text: 'Face à face assis, jambes enroulées — vulnérabilité totale. Qu\'est-ce que vous permettez à l\'autre de voir dans cette position que vous gardez habituellement ?' },
  // Justification rareté : verbalisation en continu, difficile → rare
  { id: 'cb-018', deck: 'B', theme: 'parlez',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'vague'],         visual: deckBVisuals.passion, text: 'Mouvement de vague, lent et synchronisé. Pouvez-vous rester 5 minutes ainsi en verbalisant à voix basse tout ce que vous ressentez ?' },
  // Justification rareté : communication dans une position de moindre contrôle → rare
  { id: 'cb-019', deck: 'B', theme: 'parlez',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'chaise-longue'],  visual: deckBVisuals.passion, text: 'Position chaise longue — l\'un a moins de contrôle. Comment exprimes-tu tes préférences de mouvement dans cette situation ?' },
  // Justification rareté : check-in pendant l'effort physique, souvent oublié → rare
  { id: 'cb-020', deck: 'B', theme: 'defi',    depth: 2, rarity: 'rare',   unlockedBy: 'heat-4', tags: ['kamasutra', 'arc'],           visual: deckBVisuals.passion, text: 'Position de l\'arc — dos cambré, physiquement exigeant. Comment vérifiez-vous que l\'autre est encore à l\'aise pendant une position intense ?' },

  // ── heat-5 · rare · depth 2 ───────────────────────────────────────────
  // Pratiques intimes qui demandent une communication explicite totale

  // Justification rareté : guidage à voix haute pendant l'acte, difficile → rare
  { id: 'cb-021', deck: 'B', theme: 'parlez',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-5', tags: ['kamasutra', 'oral'],          visual: deckBVisuals.passion, text: 'Guidez l\'autre à voix haute pendant un moment de plaisir oral. Dites ce que vous aimez, ce que vous voulez, ce que vous ne voulez pas — sans sous-entendre.' },
  // Justification rareté : retour en temps réel, rare à pratiquer → rare
  { id: 'cb-022', deck: 'B', theme: 'parlez',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-5', tags: ['kamasutra', 'oral'],          visual: deckBVisuals.passion, text: 'Cunnilingus guidé : décrivez en temps réel ce qui vous fait le plus de bien. L\'autre écoute et s\'adapte — sans deviner.' },
  // Justification rareté : conditions non-négociables, conversation difficile → rare
  { id: 'cb-023', deck: 'B', theme: 'verite',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-5', tags: ['kamasutra', 'anal'],          visual: deckBVisuals.passion, text: 'Si vous voulez explorer la pénétration anale : nommez maintenant trois conditions non-négociables chacun. Aucune ne peut être ignorée.' },
  // Justification rareté : coordination et contrôle à négocier → rare
  { id: 'cb-024', deck: 'B', theme: 'defi',    depth: 2, rarity: 'rare',   unlockedBy: 'heat-5', tags: ['kamasutra', 'sextoy'],        visual: deckBVisuals.passion, text: 'Sextoy en couple : décidez ensemble de son usage — qui contrôle, quel signal pour changer, comment vous communiquez en temps réel.' },
  // Justification rareté : safeword testé à froid, engagement fort → rare
  { id: 'cb-025', deck: 'B', theme: 'defi',    depth: 2, rarity: 'rare',   unlockedBy: 'heat-5', tags: ['kamasutra', 'bondage-leger'],  visual: deckBVisuals.passion, text: 'Liens légers convenus. Quel mot arrête tout immédiatement — et l\'avez-vous testé une fois à froid, hors du moment ?' },

  // ── heat-5 · unique · depth 3 ─────────────────────────────────────────
  // Défis mémorables — moments fondateurs dans la relation

  // Justification rareté : création partagée, permanente dans la relation → unique
  { id: 'cb-026', deck: 'B', theme: 'osez',    depth: 3, rarity: 'unique', unlockedBy: 'heat-5', tags: ['kamasutra', 'creation'],      visual: deckBVisuals.noir,    text: 'Inventez ensemble une position qui n\'existe pas encore. Donnez-lui un nom. Elle vous appartient.' },
  // Justification rareté : première fois ensemble, révélation de désirs cachés → unique
  { id: 'cb-027', deck: 'B', theme: 'verite',  depth: 3, rarity: 'unique', unlockedBy: 'heat-5', tags: ['kamasutra', 'premiers'],      visual: deckBVisuals.noir,    text: 'Choisissez chacun une chose que vous n\'avez jamais faite ensemble et qui vous fait envie. Négociez laquelle vous allez explorer — là, maintenant.' },
  // Justification rareté : contact visuel total, révèle une vulnérabilité profonde → unique
  { id: 'cb-028', deck: 'B', theme: 'verite',  depth: 3, rarity: 'unique', unlockedBy: 'heat-5', tags: ['kamasutra', 'miroir'],        visual: deckBVisuals.noir,    text: 'Face à face, gardez le contact visuel pendant tout un acte sans le couper. Qu\'est-ce que vous permettez à l\'autre de voir que vous masquiez habituellement ?' },
  // Justification rareté : verbalisation continue, exige une confiance totale → unique
  { id: 'cb-029', deck: 'B', theme: 'parlez',  depth: 3, rarity: 'unique', unlockedBy: 'heat-5', tags: ['kamasutra', 'marathon'],      visual: deckBVisuals.noir,    text: 'Pendant 10 minutes d\'intimité, verbalisez à voix haute tout ce que vous ressentez — plaisir, inconfort, désir, hésitation. Rien ne reste non-dit.' },
  // Justification rareté : intention posée avant l'acte, rituel fondateur → unique
  { id: 'cb-030', deck: 'B', theme: 'douceur', depth: 3, rarity: 'unique', unlockedBy: 'heat-5', tags: ['kamasutra', 'intention'],     visual: deckBVisuals.noir,    text: 'Avant de commencer, chacun dit ce qu\'il veut que ce moment soit. Pas de sous-entendus. Puis laissez vos corps faire le reste.' },

  // ═══════════════════════════════════════════════════════════════════════
  // LEXIQUE — Deck A · débloquées par palier Baromètre du Hot
  // Une carte par mot du Lexique du consentement.
  // unlockedBy: 'heat-N' (N = palier atteint, PAS la rareté)
  // ═══════════════════════════════════════════════════════════════════════

  // ── heat-1 · 9 cartes ────────────────────────────────────────────────
  // Justification : fondamental, question simple → common
  { id: 'lex-001', deck: 'A', theme: 'defi',    depth: 1, rarity: 'common', unlockedBy: 'heat-1', tags: ['lexique', 'juridique'],  visual: V.defi,      text: 'Chacun explique le consentement dans ses propres mots. Vos définitions se rejoignent-elles ?' },
  // Justification : pratique direct, exercice simple → common
  { id: 'lex-002', deck: 'A', theme: 'defi',    depth: 1, rarity: 'common', unlockedBy: 'heat-1', tags: ['lexique', 'pratique'],   visual: V.defi,      text: 'Entraînez-vous : dites "non" à voix haute. Plus facile ou plus dur que prévu ?' },
  // Justification : heat-1 accessible, rare car action à créer ensemble — moment fort
  { id: 'lex-003', deck: 'A', theme: 'et-si',   depth: 2, rarity: 'rare',   unlockedBy: 'heat-1', tags: ['lexique', 'pratique'],   visual: V['et-si'],  text: 'Et si vous choisissiez votre safeword ensemble maintenant — lequel serait-il ?' },
  // Justification : difficile à articuler à voix haute → rare
  { id: 'lex-004', deck: 'A', theme: 'douceur', depth: 2, rarity: 'rare',   unlockedBy: 'heat-1', tags: ['lexique', 'emotionnel'],  visual: V.douceur,   text: 'Nomme une limite que tu as du mal à exprimer. Prends le temps de la dire maintenant.' },
  // Justification : vérité légale directe, question accessible → common
  { id: 'lex-005', deck: 'A', theme: 'verite',  depth: 1, rarity: 'common', unlockedBy: 'heat-1', tags: ['lexique', 'juridique'],  visual: V.verite,    text: 'Avez-vous déjà eu une vraie conversation sur ce qui constitue légalement un viol ?' },
  // Justification : chiffre légal surprenant mais simple à énoncer → common
  { id: 'lex-006', deck: 'A', theme: 'verite',  depth: 1, rarity: 'common', unlockedBy: 'heat-1', tags: ['lexique', 'juridique'],  visual: V.verite,    text: 'Saviez-vous que l\'agression sexuelle inclut des actes sans pénétration ? Qu\'est-ce que ça change ?' },
  // Justification : difficile à reconnaître en soi, crée un vrai moment → rare
  { id: 'lex-007', deck: 'A', theme: 'parlez',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-1', tags: ['lexique', 'emotionnel'],  visual: V.parlez,    text: 'Y a-t-il une fois où tu as ressenti de la pression — même légère — pour dire oui ? Raconte.' },
  // Justification : concept accessible, exercice facile → common
  { id: 'lex-008', deck: 'A', theme: 'parlez',  depth: 1, rarity: 'common', unlockedBy: 'heat-1', tags: ['lexique', 'pratique'],   visual: V.parlez,    text: 'Donnez chacun un exemple concret de bonne communication dans votre relation.' },
  // Justification : difficile à définir et construire, crée un vrai moment → rare
  { id: 'lex-009', deck: 'A', theme: 'douceur', depth: 2, rarity: 'rare',   unlockedBy: 'heat-1', tags: ['lexique', 'emotionnel'],  visual: V.douceur,   text: 'Nomme une chose que ton partenaire fait qui te fait vraiment te sentir en confiance.' },

  // ── heat-2 · 7 cartes ────────────────────────────────────────────────
  // Justification : vérité inconfortable mais directe → common
  { id: 'lex-010', deck: 'A', theme: 'verite',  depth: 1, rarity: 'common', unlockedBy: 'heat-2', tags: ['lexique', 'juridique'],  visual: V.verite,    text: 'As-tu déjà utilisé une forme de pression pour convaincre quelqu\'un ? Même douce — sois honnête.' },
  // Justification : douloureux à reconnaître, difficile à dire à voix haute → rare
  { id: 'lex-011', deck: 'A', theme: 'verite',  depth: 2, rarity: 'rare',   unlockedBy: 'heat-2', tags: ['lexique', 'emotionnel'],  visual: V.verite,    text: 'Y a-t-il un schéma dans votre relation qui ressemble à de la manipulation — même involontaire ?' },
  // Justification : définition légale directe, question de sensibilisation → common
  { id: 'lex-012', deck: 'A', theme: 'defi',    depth: 1, rarity: 'common', unlockedBy: 'heat-2', tags: ['lexique', 'juridique'],  visual: V.defi,      text: 'Savez-vous identifier un comportement de harcèlement sexuel au quotidien ? Donnez un exemple.' },
  // Justification : standard exigeant, crée un engagement fort → rare
  { id: 'lex-013', deck: 'A', theme: 'et-si',   depth: 2, rarity: 'rare',   unlockedBy: 'heat-2', tags: ['lexique', 'pratique'],   visual: V['et-si'],  text: 'Et si vous exigiez tous les deux un vrai oui enthousiaste — plus jamais juste l\'absence de non ?' },
  // Justification : concept contre-intuitif, révélation forte, mémorable → unique
  { id: 'lex-014', deck: 'A', theme: 'osez',    depth: 3, rarity: 'unique', unlockedBy: 'heat-2', tags: ['lexique', 'pratique'],   visual: V.osez,      text: 'Avez-vous déjà continué quelque chose alors que l\'enthousiasme de l\'autre avait clairement disparu ?' },
  // Justification : difficile à reconnaître chez l'autre, crée de la conscience → rare
  { id: 'lex-015', deck: 'A', theme: 'douceur', depth: 2, rarity: 'rare',   unlockedBy: 'heat-2', tags: ['lexique', 'emotionnel'],  visual: V.douceur,   text: 'Comment tu reconnais chez l\'autre qu\'il/elle n\'est plus vraiment libre de décider ?' },
  // Justification : concept médico-légal accessible, question ouverte → common
  { id: 'lex-016', deck: 'A', theme: 'parlez',  depth: 1, rarity: 'common', unlockedBy: 'heat-2', tags: ['lexique', 'juridique'],  visual: V.parlez,    text: 'Y a-t-il des pratiques intimes pour lesquelles vous n\'avez jamais vraiment donné un consentement éclairé ?' },

  // ── heat-3 · 4 cartes ────────────────────────────────────────────────
  // Justification : invite une confidence profonde, situation mémorable → unique
  { id: 'lex-017', deck: 'A', theme: 'verite',  depth: 3, rarity: 'unique', unlockedBy: 'heat-3', tags: ['lexique', 'pratique'],   visual: V.verite,    text: 'Partagez une situation passée qui était une vraie zone grise — ni oui clair, ni non clair.' },
  // Justification : nuancé, crée une prise de conscience difficile → rare
  { id: 'lex-018', deck: 'A', theme: 'et-si',   depth: 2, rarity: 'rare',   unlockedBy: 'heat-3', tags: ['lexique', 'emotionnel'],  visual: V['et-si'],  text: 'Y a-t-il un déséquilibre dans votre relation qui influence parfois votre liberté de dire non ?' },
  // Justification : principe médical appliqué à l'intime, question directe → common
  { id: 'lex-019', deck: 'A', theme: 'parlez',  depth: 1, rarity: 'common', unlockedBy: 'heat-3', tags: ['lexique', 'medical'],    visual: V.parlez,    text: 'Y a-t-il une pratique intime sur laquelle vous n\'avez jamais vraiment expliqué les risques ?' },
  // Justification : chiffre choc (30 ans), mémorable, surprenant → unique
  { id: 'lex-020', deck: 'A', theme: 'verite',  depth: 3, rarity: 'unique', unlockedBy: 'heat-3', tags: ['lexique', 'juridique'],  visual: V.verite,    text: '30 ans après leur majorité pour les victimes mineures. Ce chiffre vous surprend-il ?' },
];

export type ThemeCategory = {
  name: string;
  iconName: IconName;
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
