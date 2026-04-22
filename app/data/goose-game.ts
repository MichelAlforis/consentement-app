import { diePractices, DICE_CATEGORIES, DiePractice } from './index';

export type SquareType = 'depart' | 'normal' | 'chance' | 'pause' | 'accord' | 'complicite' | 'arrivee';

export interface BoardSquare {
  index: number;
  type: SquareType;
  face?: 1 | 2 | 3 | 4 | 5 | 6;
}

// 24 squares: 16 normales + 8 spéciales
export const BOARD: BoardSquare[] = [
  { index: 0,  type: 'depart' },
  { index: 1,  type: 'normal',    face: 1 },
  { index: 2,  type: 'pause' },
  { index: 3,  type: 'normal',    face: 2 },
  { index: 4,  type: 'normal',    face: 3 },
  { index: 5,  type: 'chance' },
  { index: 6,  type: 'normal',    face: 4 },
  { index: 7,  type: 'normal',    face: 5 },
  { index: 8,  type: 'accord' },
  { index: 9,  type: 'normal',    face: 6 },
  { index: 10, type: 'normal',    face: 1 },
  { index: 11, type: 'pause' },
  { index: 12, type: 'normal',    face: 2 },
  { index: 13, type: 'complicite' },
  { index: 14, type: 'normal',    face: 3 },
  { index: 15, type: 'normal',    face: 4 },
  { index: 16, type: 'chance' },
  { index: 17, type: 'normal',    face: 5 },
  { index: 18, type: 'accord' },
  { index: 19, type: 'normal',    face: 6 },
  { index: 20, type: 'normal',    face: 1 },
  { index: 21, type: 'normal',    face: 2 },
  { index: 22, type: 'normal',    face: 3 },
  { index: 23, type: 'arrivee' },
];

// Disposition en serpentin : [ligne][colonne] → index de case
export const BOARD_LAYOUT: number[][] = [
  [0,  1,  2,  3],
  [7,  6,  5,  4],
  [8,  9,  10, 11],
  [15, 14, 13, 12],
  [16, 17, 18, 19],
  [23, 22, 21, 20],
];

export interface SquareVisual {
  bg: string;
  emoji: string;
  label: string;
}

export const SQUARE_VISUAL: Record<SquareType, SquareVisual> = {
  depart:     { bg: 'linear-gradient(135deg, #4ade80, #16a34a)', emoji: '🚀', label: 'Départ' },
  normal:     { bg: '', emoji: '', label: '' },
  chance:     { bg: 'linear-gradient(135deg, #fbbf24, #d97706)', emoji: '⭐', label: 'Chance' },
  pause:      { bg: 'linear-gradient(135deg, #f87171, #dc2626)', emoji: '⏸️', label: 'Pause' },
  accord:     { bg: 'linear-gradient(135deg, #60a5fa, #2563eb)', emoji: '🤝', label: 'Accord' },
  complicite: { bg: 'linear-gradient(135deg, #c084fc, #9333ea)', emoji: '💜', label: 'Complicité' },
  arrivee:    { bg: 'linear-gradient(135deg, #34d399, #059669)', emoji: '🏁', label: 'Arrivée' },
};

export const PAWN_EMOJIS = ['🦊', '🐼', '🦋', '🌙', '🌟', '🎲'];

// ─── Zones narratives ─────────────────────────────────────────────────────────

export interface Zone {
  name: string;
  emoji: string;
  desc: string;
  color: string;
}

export const ZONES: Zone[] = [
  { name: 'Découverte',  emoji: '🌱', desc: 'cases 1–7',   color: '#4ade80' },
  { name: 'Intimité',    emoji: '🌊', desc: 'cases 8–15',  color: '#60a5fa' },
  { name: 'Connexion',   emoji: '✨', desc: 'cases 16–23', color: '#c084fc' },
];

export function getZone(pos: number): Zone {
  if (pos <= 7)  return ZONES[0];
  if (pos <= 15) return ZONES[1];
  return ZONES[2];
}

// ─── Activités exclusives plateau ────────────────────────────────────────────
// Contenu inédit — ne figure pas dans Le Dé du Consentement

export const EXTRA_BOARD_ACTIVITIES: DiePractice[] = [
  // Face 1 — Osez 🎭
  { id: 'b_o1', face: 1, ageGate: 'all',   text: "Montrez-vous un objet que vous portez sur vous et que l'autre n'a jamais remarqué. Racontez-lui pourquoi vous l'avez." },
  { id: 'b_o2', face: 1, ageGate: 'all',   text: "Chuchotez à l'autre une pensée que vous avez eue pendant cette partie." },
  { id: 'b_o3', face: 1, ageGate: 'all',   text: "Inventez ensemble le nom d'une rue où vous aimeriez vivre. Décrivez-la en 30 secondes chacun·e." },
  { id: 'b_o4', face: 1, ageGate: 'adult', text: "Regardez vos mains. Dites à l'autre ce que vous voudriez qu'elles fassent ce soir." },

  // Face 2 — Parlez 💬
  { id: 'b_p1', face: 2, ageGate: 'all',   text: "Dites à l'autre ce que vous ressentiez quand vous avez commencé à lui faire confiance." },
  { id: 'b_p2', face: 2, ageGate: 'all',   text: "Partagez une peur que l'autre ne connaît pas encore. Juste la nommer — pas besoin d'expliquer." },
  { id: 'b_p3', face: 2, ageGate: 'all',   text: "Racontez un moment récent où l'autre vous a surpris·e en bien, sans le savoir." },
  { id: 'b_p4', face: 2, ageGate: 'all',   text: "Qu'est-ce que vous aimeriez que l'autre vous dise plus souvent ?" },

  // Face 3 — Et si… 🤔
  { id: 'b_e1', face: 3, ageGate: 'all',   text: "Et si vous pouviez passer cette nuit n'importe où dans le monde — où iriez-vous ? Décrivez la nuit idéale." },
  { id: 'b_e2', face: 3, ageGate: 'all',   text: "Et si vous deviez écrire une lettre à votre futur couple dans 5 ans — elle commencerait par quoi ?" },
  { id: 'b_e3', face: 3, ageGate: 'adult', text: "Et si la soirée pouvait se terminer exactement comme vous le voulez — elle ressemble à quoi, précisément ?" },
  { id: 'b_e4', face: 3, ageGate: 'all',   text: "Et si vous pouviez vous souvenir d'un seul moment ensemble pour toujours — lequel choisiriez-vous ?" },

  // Face 4 — Défi 🎯
  { id: 'b_df1', face: 4, ageGate: 'all',  text: "Dessinez le portrait de l'autre en 30 secondes chacun·e. Sans regarder sa feuille. Commentez les chefs-d'œuvre." },
  { id: 'b_df2', face: 4, ageGate: 'all',  text: "Récitez une pub ou une chanson, mais en remplaçant les mots clés par le prénom de l'autre. L'autre doit deviner laquelle." },
  { id: 'b_df3', face: 4, ageGate: 'all',  text: "Trouvez 5 choses que vous avez en commun que des inconnus ne devineraient pas en vous regardant." },
  { id: 'b_df4', face: 4, ageGate: 'all',  text: "Faites une imitation de l'autre — une habitude, une expression, un geste. L'autre commente sans se vexer. 😄" },

  // Face 5 — Vérité ✨
  { id: 'b_v1', face: 5, ageGate: 'all',   text: "Y a-t-il quelque chose que vous attendez de cette relation et que vous n'avez pas encore demandé ?" },
  { id: 'b_v2', face: 5, ageGate: 'all',   text: "Quelle habitude de l'autre adorez-vous sans jamais le/la lui avoir dit ?" },
  { id: 'b_v3', face: 5, ageGate: 'all',   text: "Qu'est-ce que vous aimeriez changer dans la façon dont vous communiquez ensemble ?" },
  { id: 'b_v4', face: 5, ageGate: 'adult', text: "Y a-t-il quelque chose que vous aimeriez plus souvent dans votre vie intime — et qui n'a pas encore été dit ?" },

  // Face 6 — Douceur ❤️
  { id: 'b_c1', face: 6, ageGate: 'all',   text: "Tenez le visage de l'autre entre vos mains pendant 10 secondes. Regardez-le·la. En silence." },
  { id: 'b_c2', face: 6, ageGate: 'all',   text: "Posez votre tête contre l'autre. Respirez ensemble. Restez comme ça 30 secondes." },
  { id: 'b_c3', face: 6, ageGate: 'all',   text: "Dites à l'autre un souvenir précis où il·elle vous a rendu·e heureux·se sans le savoir." },
  { id: 'b_c4', face: 6, ageGate: 'adult', text: "Tracez doucement le contour du visage de l'autre avec un doigt. Prenez votre temps." },
];

// ─── Activités Pause (12 — plus de variété) ──────────────────────────────────

export const PAUSE_ACTIVITIES: { id: string; text: string }[] = [
  { id: 'pa1', text: "Dites-vous quelque chose que vous n'avez pas encore dit ce soir." },
  { id: 'pa2', text: "Regardez-vous dans les yeux pendant 10 secondes, en silence." },
  { id: 'pa3', text: "Dites une chose que vous appréciez chez l'autre — maintenant." },
  { id: 'pa4', text: "Chacun·e dit comment il·elle se sent en ce moment. En un mot." },
  { id: 'pa5', text: "Prenez-vous la main. Restez comme ça jusqu'au prochain lancer." },
  { id: 'pa6', text: "Dites quelque chose de vrai que vous n'avez pas osé dire avant ce jeu." },
  { id: 'pa7', text: "Prenez une grande respiration ensemble. Soufflez lentement. Puis souriez." },
  { id: 'pa8', text: "Dites à l'autre ce qui vous a le plus touché·e depuis le début de cette partie." },
  { id: 'pa9', text: "Chacun·e dit ce qu'il·elle espère pour la suite de cette soirée. Sans filtre." },
  { id: 'pa10', text: "Nommez quelque chose que vous avez appris sur l'autre grâce à ce jeu." },
  { id: 'pa11', text: "Fermez les yeux 5 secondes. Puis ouvrez-les et regardez l'autre directement." },
  { id: 'pa12', text: "Dites à l'autre une chose que vous n'avez jamais prise le temps de lui dire." },
];

// ─── Activités Accord (12 — plus de variété) ─────────────────────────────────

export const ACCORD_ACTIVITIES: { id: string; text: string }[] = [
  { id: 'ac1', text: "Échangez un massage de 1 minute chacun·e." },
  { id: 'ac2', text: "Racontez à l'autre votre souvenir de tendresse préféré avec lui·elle." },
  { id: 'ac3', text: "Inventez ensemble un rituel de soirée que vous voudrez répéter." },
  { id: 'ac4', text: "Décidez d'un défi doux à faire ensemble avant la fin de la semaine." },
  { id: 'ac5', text: "Faites-vous un câlin de 30 secondes — sans lâcher avant le signal." },
  { id: 'ac6', text: "Échangez un mot doux à voix basse, l'un dans l'oreille de l'autre." },
  { id: 'ac7', text: "Fermez les yeux et tenez-vous la main pendant 20 secondes." },
  { id: 'ac8', text: "Décrivez l'autre en 3 mots magnifiques — et lisez-les à voix haute." },
  { id: 'ac9', text: "Chacun·e dit ce qu'il·elle aime dans la façon dont l'autre l'écoute." },
  { id: 'ac10', text: "Inventez ensemble un code secret pour signaler \"j'ai besoin d'une pause\" — et promettez de le respecter." },
  { id: 'ac11', text: "Dansez ensemble 30 secondes — même sans musique, même maladroitement." },
  { id: 'ac12', text: "Chacun·e dit ce qu'il·elle voudrait faire avec l'autre cette semaine. On choisit ensemble." },
];

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickNoRepeat<T extends { id: string }>(
  pool: T[],
  usedIds: Set<string>,
): T {
  const available = pool.filter(a => !usedIds.has(a.id));
  const source = available.length > 0 ? available : pool;
  if (available.length === 0) usedIds.clear();
  const picked = pickRandom(source);
  usedIds.add(picked.id);
  return picked;
}

// Retourne le pool combiné dé + exclusif plateau pour une face donnée
export function getBoardActivitiesForFace(
  face: 1 | 2 | 3 | 4 | 5 | 6,
  isAdult: boolean,
): DiePractice[] {
  const fromDie = diePractices.filter(p => {
    if (p.face !== face) return false;
    if (p.ageGate === 'all') return true;
    if (p.ageGate === 'adult' && isAdult) return true;
    return false;
  });
  const fromBoard = EXTRA_BOARD_ACTIVITIES.filter(p => {
    if (p.face !== face) return false;
    if (p.ageGate === 'all') return true;
    if (p.ageGate === 'adult' && isAdult) return true;
    return false;
  });
  const combined = [...fromDie, ...fromBoard];
  return combined.length > 0 ? combined : diePractices.filter(p => p.face === face && p.ageGate === 'all');
}

// Conservé pour compatibilité avec le Dé du Consentement
export function getActivitiesForFace(
  face: 1 | 2 | 3 | 4 | 5 | 6,
  isAdult: boolean,
  isPremium: boolean
) {
  const filtered = diePractices.filter(p => {
    if (p.face !== face) return false;
    if (p.ageGate === 'all') return true;
    if (p.ageGate === 'adult' && (isAdult || isPremium)) return true;
    if (p.ageGate === 'premium' && isPremium) return true;
    return false;
  });
  return filtered.length > 0 ? filtered : diePractices.filter(p => p.face === face && p.ageGate === 'all');
}

export function getSquareBg(square: BoardSquare): string {
  if (square.type === 'normal' && square.face) {
    return DICE_CATEGORIES[square.face].gradient;
  }
  return SQUARE_VISUAL[square.type].bg;
}

export function getSquareEmoji(square: BoardSquare): string {
  if (square.type === 'normal' && square.face) {
    return DICE_CATEGORIES[square.face].emoji;
  }
  return SQUARE_VISUAL[square.type].emoji;
}

export interface SavedGooseGame {
  players: [{ name: string; emoji: string }, { name: string; emoji: string }];
  positions: [number, number];
  currentPlayer: 0 | 1;
  accordsCount: number;
}

const SAVE_KEY = 'consentement_jeu_oie';

export function loadSavedGame(): SavedGooseGame | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(SAVE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function saveGame(data: SavedGooseGame): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {}
}

export function clearSavedGame(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SAVE_KEY);
}
