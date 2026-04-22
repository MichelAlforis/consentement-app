import { ComfortCategories, ComfortLevel, ConsentPrinciple, HelpResource } from '../types';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PornoVsRealite {
  id: string;
  porno: string;
  realite: string;
  explication: string;
  emoji: string;
}

export interface LoiPoint {
  id: string;
  titre: string;
  contenu: string;
  emoji: string;
  important?: boolean;
}

export type AgeGate = 'all' | 'adult' | 'premium';

export const DICE_CATEGORIES: Record<number, {
  name: string;
  emoji: string;
  gradient: string;
  border: string;
}> = {
  1: { name: 'Osez',     emoji: '🎭', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '#fbbf24' },
  2: { name: 'Parlez',   emoji: '💬', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: '#a78bfa' },
  3: { name: 'Et si…',   emoji: '🤔', gradient: 'linear-gradient(135deg, #ec4899, #db2777)', border: '#f9a8d4' },
  4: { name: 'Défi',     emoji: '🎯', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: '#93c5fd' },
  5: { name: 'Vérité',   emoji: '✨', gradient: 'linear-gradient(135deg, #10b981, #059669)', border: '#6ee7b7' },
  6: { name: 'Douceur',  emoji: '❤️', gradient: 'linear-gradient(135deg, #be123c, #9f1239)', border: '#fda4af' },
};

export interface DiePractice {
  id: string;
  face: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  ageGate: AgeGate;
}

export const comfortCategories: ComfortCategories = {
  tenderness: {
    icon: '🌸',
    title: 'Tendresse',
    description: 'Intimité émotionnelle et contact doux',
    color: '#f8a5c2',
    items: [
      { id: 'kisses', label: 'Baisers', icon: '💋' },
      { id: 'cuddles', label: 'Câlins', icon: '🤗' },
      { id: 'massage', label: 'Massages', icon: '✨' },
      { id: 'words', label: 'Mots doux', icon: '💬' },
      { id: 'holding', label: 'Se tenir la main', icon: '🤝' },
      { id: 'sleeping', label: 'Dormir ensemble', icon: '😴' }
    ]
  },
  intensity: {
    icon: '🔥',
    title: 'Intensité',
    description: "Rythme et niveau d'intimité",
    color: '#ff7675',
    items: [
      { id: 'slow', label: 'Prendre son temps', icon: '🐢' },
      { id: 'spontaneous', label: 'Spontanéité', icon: '⚡' },
      { id: 'lights', label: 'Lumières allumées', icon: '💡' },
      { id: 'talking', label: 'Parler pendant', icon: '🗣️' },
      { id: 'eye-contact', label: 'Contact visuel', icon: '👁️' },
      { id: 'guidance', label: "Guider l'autre", icon: '🧭' }
    ]
  },
  trust: {
    icon: '⛓️',
    title: 'Confiance',
    description: 'Pratiques nécessitant une communication renforcée',
    color: '#a29bfe',
    items: [
      { id: 'blindfold', label: 'Yeux bandés', icon: '🙈' },
      { id: 'restraint', label: 'Immobilisation douce', icon: '🎀' },
      { id: 'roleplay', label: 'Jeux de rôle', icon: '🎭' },
      { id: 'power', label: 'Dynamique de pouvoir', icon: '👑' },
      { id: 'toys', label: 'Accessoires', icon: '🎁' },
      { id: 'filming', label: 'Photos/Vidéos', icon: '📵' }
    ]
  }
};

export const comfortLevels: ComfortLevel[] = [
  { value: 0, label: 'Non', color: '#e74c3c', emoji: '🚫' },
  { value: 1, label: 'Pas maintenant', color: '#e67e22', emoji: '⏸️' },
  { value: 2, label: 'Curieux·se', color: '#f1c40f', emoji: '🤔' },
  { value: 3, label: "À l'aise", color: '#2ecc71', emoji: '✅' },
  { value: 4, label: "J'adore", color: '#9b59b6', emoji: '💜' }
];

export const consentPrinciples: ConsentPrinciple[] = [
  { emoji: '🔄', title: 'Continu', text: 'Il peut être retiré à tout moment. Un "oui" peut devenir un "non".' },
  { emoji: '🗣️', title: 'Explicite', text: 'Le silence ou l\'absence de "non" ne signifie pas "oui".' },
  { emoji: '🎯', title: 'Spécifique', text: 'Accepter une chose ne veut pas dire accepter tout.' },
  { emoji: '💚', title: 'Libre', text: 'Sans pression, sans chantage, sans manipulation.' },
  { emoji: '🧠', title: 'Éclairé', text: 'On doit comprendre ce à quoi on consent.' }
];

export const helpResources: HelpResource[] = [
  { name: 'Fil Santé Jeunes', phone: '0 800 235 236', desc: 'Anonyme et gratuit', color: '#4db6ac' },
  { name: 'Violences Femmes Info', phone: '3919', desc: '24h/24', color: '#f78fb3' },
  { name: 'Planning Familial', phone: '0 800 08 11 11', desc: 'Sexualité, contraception', color: '#81c784' }
];

export const initialPersonalProfile = {
  tenderness: {},
  intensity: {},
  trust: {},
  safeword: ''
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Quelqu\'un ne dit rien et ne résiste pas. Est-ce que ça veut dire qu\'il ou elle est d\'accord ?',
    options: ['Oui, le silence c\'est oui', 'Non, le silence n\'est pas un consentement', 'Ça dépend de la situation', 'Oui si on se connaît bien'],
    correctIndex: 1,
    explanation: 'Le silence ne veut pas dire oui. Le consentement doit être clairement exprimé. Une personne peut être paralysée par la peur ou la surprise sans pouvoir parler.',
  },
  {
    id: 'q2',
    question: 'Tu avais dit oui hier soir. Ce matin, tu peux changer d\'avis ?',
    options: ['Non, t\'as déjà dit oui', 'Oui, on peut toujours changer d\'avis', 'Non, c\'est trop tard', 'Ça dépend de ce que tu avais accepté'],
    correctIndex: 1,
    explanation: 'Le consentement est continu. On peut dire non à n\'importe quel moment, même si on avait dit oui avant. Personne ne peut être obligé à continuer quelque chose qu\'il ne veut plus.',
  },
  {
    id: 'q3',
    question: 'Accepter un bisou, c\'est accepter quoi d\'autre ?',
    options: ['Tout ce qui vient après', 'Rien de plus que le bisou', 'Ça dépend de qui c\'est', 'Tout si on est en couple'],
    correctIndex: 1,
    explanation: 'Accepter quelque chose ne veut pas dire accepter autre chose. Chaque acte nécessite son propre consentement. Un bisou = seulement un bisou.',
  },
  {
    id: 'q4',
    question: 'Quelqu\'un t\'offre des cadeaux pour que tu fasses quelque chose avec lui/elle. C\'est quoi ce consentement ?',
    options: ['C\'est normal, c\'est comme un échange', 'C\'est un consentement sous pression, donc pas valable', 'C\'est ok si t\'as envie de faire l\'échange', 'C\'est juste une gentillesse'],
    correctIndex: 1,
    explanation: 'Un consentement donné sous pression, manipulation ou échange n\'est pas un vrai consentement. Il doit être libre, sans contrepartie.',
  },
  {
    id: 'q5',
    question: 'Une personne ivre ou défoncée peut-elle donner son consentement ?',
    options: ['Oui, si elle dit oui', 'Non, elle n\'est pas en état de décider', 'Oui si elle a l\'habitude', 'Ça dépend de combien elle a bu'],
    correctIndex: 1,
    explanation: 'Une personne sous l\'emprise d\'alcool ou de drogues ne peut pas donner un consentement valable. Profiter de cet état est considéré comme une agression sexuelle par la loi.',
  },
  {
    id: 'q6',
    question: 'Dans le porno, les acteurs crient de plaisir tout le temps. C\'est comme ça dans la vraie vie ?',
    options: ['Oui, c\'est comme ça quand c\'est bien', 'Non, c\'est du jeu d\'acteur pour les caméras', 'Oui si on fait bien les choses', 'Ça dépend des personnes'],
    correctIndex: 1,
    explanation: 'Le porno est un film avec des acteurs qui jouent un rôle. Les sons, les réactions, les corps sont mis en scène. La vraie intimité est très différente et beaucoup plus variée.',
  },
  {
    id: 'q7',
    question: 'En France, quel est l\'âge légal du consentement sexuel ?',
    options: ['13 ans', '14 ans', '15 ans', '18 ans'],
    correctIndex: 2,
    explanation: 'En France, l\'âge légal du consentement est 15 ans. En dessous de cet âge, tout acte sexuel avec un adulte est un crime, même si le mineur dit oui — sa parole ne peut pas constituer un consentement légal.',
  },
  {
    id: 'q8',
    question: 'Un garçon qui a été forcé peut aussi être victime d\'agression sexuelle ?',
    options: ['Non, les garçons ne peuvent pas être victimes', 'Oui, n\'importe qui peut être victime', 'Seulement si c\'était un adulte', 'Oui mais c\'est rare'],
    correctIndex: 1,
    explanation: 'N\'importe qui peut être victime d\'une agression sexuelle, peu importe le genre. Les garçons et les hommes sont aussi concernés.',
  },
];

export const pornoVsRealite: PornoVsRealite[] = [
  {
    id: 'p1',
    emoji: '🎬',
    porno: 'Les acteurs font des choses sans jamais en parler avant',
    realite: 'Les vraies relations commencent par une communication, des questions, un accord mutuel',
    explication: 'Dans la vraie vie, parler avant, pendant et après est normal et nécessaire. Ce n\'est pas bizarre, c\'est du respect.',
  },
  {
    id: 'p2',
    emoji: '🎭',
    porno: 'Tout le monde semble adorer tout, tout le temps',
    realite: 'Chaque personne a des limites, des préférences, des choses qu\'elle n\'aime pas',
    explication: 'Les acteurs jouent un rôle. Dans la réalité, on peut aimer certaines choses et pas d\'autres. Dire non à quelque chose c\'est tout à fait normal.',
  },
  {
    id: 'p3',
    emoji: '💪',
    porno: 'Le refus ou l\'hésitation est souvent ignoré',
    realite: 'Un non ou une hésitation doit toujours être respecté, immédiatement',
    explication: 'Ignorer un refus est une agression. Dans la vraie vie, la moindre hésitation doit faire arrêter tout de suite.',
  },
  {
    id: 'p4',
    emoji: '🧴',
    porno: 'Certains actes semblent faciles et sans douleur',
    realite: 'Certains actes demandent préparation, douceur et peuvent faire mal si mal faits',
    explication: 'La pornographie ne montre pas la préparation, les produits nécessaires ni la douleur possible. Mal imiter ce qu\'on voit peut blesser.',
  },
  {
    id: 'p5',
    emoji: '⚖️',
    porno: 'Certaines scènes semblent normales à l\'écran',
    realite: 'Certains actes reproduits hors d\'un cadre consenti sont des crimes',
    explication: 'Ce qui est filmé avec des acteurs adultes consentants dans un contexte légal n\'est pas reproductible librement. Forcer quelqu\'un est un crime, peu importe ce qu\'on a vu dans un film.',
  },
  {
    id: 'p6',
    emoji: '💬',
    porno: 'Pas besoin de parler, tout se comprend',
    realite: 'La communication est la base de toute relation sexuelle saine',
    explication: 'Dans la réalité, vérifier que l\'autre est ok, poser des questions, demander ce qu\'il ou elle aime — c\'est ce qui fait que c\'est bien pour les deux.',
  },
];

export const diePractices: DiePractice[] = [
  // Face 1 — Osez 🎭
  { id: 'o1', face: 1, ageGate: 'all',   text: "Regardez-vous dans les yeux en silence pendant 30 secondes. Premier qui rigole a perdu. 👀" },
  { id: 'o2', face: 1, ageGate: 'all',   text: "Faites-vous un compliment inattendu — pas sur l'apparence, sur quelque chose que l'autre remarque rarement." },
  { id: 'o3', face: 1, ageGate: 'all',   text: "Inventez un geste secret que vous serez les seuls à connaître. Utilisez-le au moins une fois ce soir." },
  { id: 'o4', face: 1, ageGate: 'all',   text: "Échangez un objet que vous avez sur vous et expliquez en 30 secondes pourquoi il vous tient à cœur." },
  { id: 'o5', face: 1, ageGate: 'adult', text: "Décrivez à voix haute ce que vous aimeriez faire ensemble ce soir — sans filtre, sans honte." },
  { id: 'o6', face: 1, ageGate: 'adult', text: "Envoyez un message à l'autre décrivant exactement ce dont vous avez envie. Maintenant. Sans effacer." },

  // Face 2 — Parlez 💬
  { id: 'p1', face: 2, ageGate: 'all',   text: "Dites une chose que vous n'osez jamais dire normalement. L'autre écoute sans interrompre." },
  { id: 'p2', face: 2, ageGate: 'all',   text: "Qu'est-ce que l'autre fait inconsciemment qui vous rend heureux·se ?" },
  { id: 'p3', face: 2, ageGate: 'all',   text: "Racontez un moment précis où vous avez ressenti une confiance totale avec l'autre." },
  { id: 'p4', face: 2, ageGate: 'all',   text: "Qu'est-ce que vous aimeriez que l'autre comprenne mieux de vous ?" },
  { id: 'p5', face: 2, ageGate: 'adult', text: "Qu'est-ce qui vous excite en ce moment — quelque chose que vous n'avez jamais vraiment dit ?" },
  { id: 'p6', face: 2, ageGate: 'adult', text: "Décrivez votre fantasme du moment en détail. L'autre écoute sans interrompre — ni juger." },

  // Face 3 — Et si… 🤔
  { id: 'e1', face: 3, ageGate: 'all',   text: "Et si vous passiez une journée parfaite ensemble — elle ressemble à quoi exactement ?" },
  { id: 'e2', face: 3, ageGate: 'all',   text: "Et si vous deviez décrire votre relation avec une météo — il fait quel temps ?" },
  { id: 'e3', face: 3, ageGate: 'all',   text: "Et si vous pouviez remonter le temps jusqu'à votre première rencontre — vous changeriez quoi ?" },
  { id: 'e4', face: 3, ageGate: 'all',   text: "Et si vous pouviez avoir un super-pouvoir de couple — ça serait lequel ?" },
  { id: 'e5', face: 3, ageGate: 'adult', text: "Et si vous pouviez rejouer votre première nuit ensemble — vous changeriez quoi ?" },
  { id: 'e6', face: 3, ageGate: 'adult', text: "Et si vous pouviez essayer quelque chose de nouveau ce soir — vous choisiriez quoi ?" },

  // Face 4 — Défi 🎯
  { id: 'df1', face: 4, ageGate: 'all',   text: "Inventez un surnom ridicule pour l'autre. Il doit l'accepter ou en proposer un encore pire. 😄" },
  { id: 'df2', face: 4, ageGate: 'all',   text: "Faites rire l'autre en 20 secondes max — sans le/la toucher. Chrono !" },
  { id: 'df3', face: 4, ageGate: 'all',   text: "Mimez une scène d'un film culte. L'autre doit deviner lequel en moins de 5 essais." },
  { id: 'df4', face: 4, ageGate: 'all',   text: "Prenez le selfie le plus bizarre et le plus laid possible ensemble. Celui qui rit le moins a perdu." },
  { id: 'df5', face: 4, ageGate: 'adult', text: "Écrivez un mini-scénario à deux — une phrase chacun à tour de rôle. Le plus torride possible." },
  { id: 'df6', face: 4, ageGate: 'adult', text: "Décrivez l'autre de façon sensuelle en 3 métaphores poétiques. Le plus lyrique gagne." },

  // Face 5 — Vérité ✨
  { id: 'v1', face: 5, ageGate: 'all',   text: "Qu'est-ce qui vous fait dire \"non\" immédiatement, sans hésiter ?" },
  { id: 'v2', face: 5, ageGate: 'all',   text: "Y a-t-il quelque chose que vous aimeriez que l'autre fasse différemment ? Dites-le maintenant." },
  { id: 'v3', face: 5, ageGate: 'all',   text: "Qu'est-ce que vous n'avez jamais osé demander à l'autre ?" },
  { id: 'v4', face: 5, ageGate: 'all',   text: "Quel est votre plus grand besoin dans cette relation — celui que vous exprimez rarement ?" },
  { id: 'v5', face: 5, ageGate: 'adult', text: "Qu'est-ce que vous aimeriez essayer — quelque chose que vous n'avez jamais osé demander ?" },
  { id: 'v6', face: 5, ageGate: 'adult', text: "Y a-t-il quelque chose dans votre vie intime que vous aimeriez changer — soyez honnête." },

  // Face 6 — Douceur ❤️
  { id: 'c1', face: 6, ageGate: 'all',   text: "Prenez-vous dans les bras pendant 60 secondes. En silence. Chronométrez." },
  { id: 'c2', face: 6, ageGate: 'all',   text: "Dites 3 choses que vous adorez chez l'autre — sans répéter quelque chose de déjà dit ce soir." },
  { id: 'c3', face: 6, ageGate: 'all',   text: "Tenez-vous la main, fermez les yeux tous les deux. Restez comme ça 30 secondes." },
  { id: 'c4', face: 6, ageGate: 'all',   text: "Laissez l'autre décider d'une chose qu'on fait ensemble ce soir — sans négocier, sans refuser." },
  { id: 'c5', face: 6, ageGate: 'adult', text: "Dites à l'autre exactement ce que vous aimez dans la façon dont il/elle vous touche." },
  { id: 'c6', face: 6, ageGate: 'adult', text: "Faites à l'autre un massage de 5 minutes, en silence. Juste donner, sans rien attendre." },
];

export const loiPoints: LoiPoint[] = [
  {
    id: 'l1',
    emoji: '📅',
    titre: 'L\'âge légal du consentement',
    contenu: 'En France, l\'âge légal du consentement sexuel est fixé à 15 ans. En dessous de cet âge, aucun acte sexuel avec un adulte ne peut être légal, même si le ou la jeune dit qu\'il ou elle est d\'accord.',
    important: true,
  },
  {
    id: 'l2',
    emoji: '⚠️',
    titre: 'Ce que risque l\'adulte',
    contenu: 'Un adulte qui a un rapport sexuel avec un mineur de moins de 15 ans risque jusqu\'à 20 ans de prison. Si l\'adulte est un parent, professeur ou figure d\'autorité, les peines sont encore plus lourdes.',
    important: true,
  },
  {
    id: 'l3',
    emoji: '👥',
    titre: 'Et entre adolescents ?',
    contenu: 'Quand les deux personnes ont moins de 18 ans et un écart d\'âge raisonnable, la loi est plus souple. Mais le consentement reste obligatoire. Forcer quelqu\'un ou ignorer un refus est une infraction, peu importe l\'âge.',
    important: false,
  },
  {
    id: 'l4',
    emoji: '📱',
    titre: 'Photos et vidéos',
    contenu: 'Prendre, partager ou posséder des photos ou vidéos à caractère sexuel d\'un mineur est un crime grave — même si le mineur a dit oui, même si c\'est lui qui a envoyé la photo. C\'est la loi.',
    important: true,
  },
  {
    id: 'l5',
    emoji: '🔕',
    titre: 'Le silence n\'est pas un oui',
    contenu: 'La loi française est claire : l\'absence de résistance ne constitue pas un consentement. Une personne qui ne dit rien, qui est sous pression, intimidée ou sous l\'emprise d\'alcool ne peut pas consentir.',
    important: false,
  },
  {
    id: 'l6',
    emoji: '🆘',
    titre: 'Si tu as vécu quelque chose',
    contenu: 'Si tu as vécu quelque chose qui t\'a mis mal à l\'aise ou que tu penses être une agression, tu peux en parler. Ce n\'est jamais ta faute. Des professionnels sont là pour t\'écouter sans te juger.',
    important: false,
  },
];
