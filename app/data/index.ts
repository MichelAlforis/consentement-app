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

export interface DiePractice {
  id: string;
  emoji: string;
  name: string;
  description: string;
  consentNote: string;
  ageGate: AgeGate;
  level: 1 | 2 | 3;
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
  // Niveau 1 — Gratuit, tous publics (douceur, tendresse)
  {
    id: 'd1', level: 1, ageGate: 'all', emoji: '💋',
    name: 'Un baiser',
    description: 'Un baiser peut être doux, long, intense ou rapide. C\'est souvent le premier geste d\'intimité physique entre deux personnes.',
    consentNote: 'Le consentement à un baiser ne vaut que pour ce baiser. Il ne s\'étend pas à autre chose.',
  },
  {
    id: 'd2', level: 1, ageGate: 'all', emoji: '🤗',
    name: 'Un câlin',
    description: 'Se tenir dans les bras de quelqu\'un, sentir la chaleur d\'un corps. Simple, puissant, et souvent sous-estimé.',
    consentNote: 'Certaines personnes ne sont pas à l\'aise avec le contact physique. Toujours vérifier avant de toucher.',
  },
  {
    id: 'd3', level: 1, ageGate: 'all', emoji: '✋',
    name: 'Un massage',
    description: 'Toucher le corps de l\'autre avec douceur — dos, épaules, mains. Une forme d\'intimité non sexuelle mais très chargée en confiance.',
    consentNote: 'Précise où tu veux masser et demande si c\'est ok. Le massage peut s\'arrêter à tout moment.',
  },
  {
    id: 'd4', level: 1, ageGate: 'all', emoji: '🤝',
    name: 'Se tenir la main',
    description: 'Un geste simple qui dit beaucoup. En public ou en privé, tenir la main de quelqu\'un est un acte d\'affection conscient.',
    consentNote: 'Même les gestes du quotidien méritent un accord. Propose ta main plutôt que de la prendre.',
  },
  {
    id: 'd5', level: 1, ageGate: 'all', emoji: '💬',
    name: 'Exprimer ce qu\'on aime',
    description: 'Dire à l\'autre ce qui nous plaît — une façon de toucher, un moment, une sensation. La communication change tout.',
    consentNote: 'Partager ses désirs crée de la confiance. Écouter ceux de l\'autre sans jugement aussi.',
  },
  {
    id: 'd6', level: 1, ageGate: 'all', emoji: '👁️',
    name: 'Un regard intense',
    description: 'Le contact visuel soutenu pendant un moment d\'intimité peut être très puissant. Certains l\'adorent, d\'autres s\'en sentent exposés.',
    consentNote: 'Demande si l\'autre est à l\'aise avec le contact visuel. Ce n\'est pas universel.',
  },

  // Niveau 2 — Adultes, gratuit
  {
    id: 'd7', level: 2, ageGate: 'adult', emoji: '🌹',
    name: 'Caresses intimes',
    description: 'Toucher les parties intimes de l\'autre avec la main. Un acte sexuel qui demande une communication claire sur ce qui est agréable.',
    consentNote: 'Demande ce qui est agréable pendant, pas seulement avant. Les préférences varient et se découvrent ensemble.',
  },
  {
    id: 'd8', level: 2, ageGate: 'adult', emoji: '👄',
    name: 'Fellation',
    description: 'Stimulation orale du pénis. Une pratique courante dont le plaisir et le confort varient selon les personnes.',
    consentNote: 'Ni obligation, ni dette. Cette pratique doit être souhaitée des deux côtés. La pression ou insistance n\'est jamais acceptable.',
  },
  {
    id: 'd9', level: 2, ageGate: 'adult', emoji: '🌸',
    name: 'Cunnilingus',
    description: 'Stimulation orale de la vulve. Une pratique qui demande confiance, communication et attention aux signaux de l\'autre.',
    consentNote: 'Chaque corps est différent. Communiquer pendant la pratique sur ce qui est agréable est essentiel.',
  },
  {
    id: 'd10', level: 2, ageGate: 'adult', emoji: '🔥',
    name: 'Masturbation mutuelle',
    description: 'Se caresser mutuellement ou en même temps. Une forme d\'intimité sexuelle qui n\'implique pas de pénétration.',
    consentNote: 'Montrer à l\'autre ce qu\'on aime est un acte de confiance. Aucune obligation de performance.',
  },
  {
    id: 'd11', level: 2, ageGate: 'adult', emoji: '🎭',
    name: 'Jeu de séduction',
    description: 'Explorer une scène de désir, un fantasme léger, un rôle. Le jeu de séduction conscient peut renforcer la complicité.',
    consentNote: 'Définir le cadre ensemble avant. Ce qui se passe dans le jeu reste dans le jeu — sauf si l\'un des deux veut arrêter.',
  },

  // Niveau 3 — Adultes, premium
  {
    id: 'd12', level: 3, ageGate: 'premium', emoji: '💫',
    name: 'Pénétration vaginale',
    description: 'La pénétration est un acte sexuel qui nécessite préparation, lubrification et communication continue.',
    consentNote: 'Le consentement à la pénétration se vérifie au moment, pas à l\'avance. "Est-ce que tu es ok ?" pendant est aussi important qu\'avant.',
  },
  {
    id: 'd13', level: 3, ageGate: 'premium', emoji: '⚡',
    name: 'Pénétration anale',
    description: 'Un acte qui nécessite préparation physique, beaucoup de lubrification et une communication renforcée. Douleur = signal d\'arrêt.',
    consentNote: 'Cette pratique ne peut jamais être imposée ou surprise. La douleur doit faire stopper immédiatement. Un safeword clair est indispensable.',
  },
  {
    id: 'd14', level: 3, ageGate: 'premium', emoji: '🎀',
    name: 'Immobilisation douce',
    description: 'Maintenir les poignets, utiliser un foulard. Une pratique de confiance qui appartient à l\'univers BDSM léger.',
    consentNote: 'Accord explicite avant, safeword défini ensemble, et la personne immobilisée garde le contrôle final. Si elle dit stop, on s\'arrête.',
  },
  {
    id: 'd15', level: 3, ageGate: 'premium', emoji: '👑',
    name: 'Dynamique dominant·e / soumis·e',
    description: 'Explorer une relation de pouvoir consentie, où l\'un guide et l\'autre suit. Un jeu de rôle qui demande une confiance absolue.',
    consentNote: 'Cette dynamique doit être négociée en dehors du jeu, à tête reposée. Les règles, les limites et le safeword doivent être clairs avant de commencer.',
  },
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
