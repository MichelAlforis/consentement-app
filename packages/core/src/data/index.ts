import { ComfortCategories, ComfortLevel, ConsentPrinciple, HelpResource } from '../types';
import type { IconName } from '../types';

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
  iconName: IconName;
}

export interface LoiPoint {
  id: string;
  titre: string;
  contenu: string;
  iconName: IconName;
  important?: boolean;
}

export type AgeGate = 'all' | 'adult' | 'explicit' | 'premium';

export const DICE_CATEGORIES: Record<number, {
  name: string;
  iconName: IconName;
  gradient: string;
  border: string;
}> = {
  1: { name: 'Osez',     iconName: 'Layers',        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '#fbbf24' },
  2: { name: 'Parlez',   iconName: 'MessageCircle',  gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: '#a78bfa' },
  3: { name: 'Et si…',   iconName: 'HelpCircle',     gradient: 'linear-gradient(135deg, #ec4899, #db2777)', border: '#f9a8d4' },
  4: { name: 'Défi',     iconName: 'Target',         gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: '#93c5fd' },
  5: { name: 'Vérité',   iconName: 'Sparkles',       gradient: 'linear-gradient(135deg, #10b981, #059669)', border: '#6ee7b7' },
  6: { name: 'Douceur',  iconName: 'Heart',          gradient: 'linear-gradient(135deg, #be123c, #9f1239)', border: '#fda4af' },
};

export interface DiePractice {
  id: string;
  face: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  ageGate: AgeGate;
}

export const comfortCategories: ComfortCategories = {
  tenderness: {
    iconName: 'Heart',
    title: 'Tendresse',
    description: 'Intimité émotionnelle et contact doux',
    color: '#f8a5c2',
    items: [
      { id: 'kisses', label: 'Baisers', iconName: 'Heart' },
      { id: 'cuddles', label: 'Câlins', iconName: 'Smile' },
      { id: 'massage', label: 'Massages', iconName: 'Sparkles' },
      { id: 'words', label: 'Mots doux', iconName: 'MessageCircle' },
      { id: 'holding', label: 'Se tenir la main', iconName: 'Handshake' },
      { id: 'sleeping', label: 'Dormir ensemble', iconName: 'Moon' }
    ]
  },
  intensity: {
    iconName: 'Flame',
    title: 'Intensité',
    description: "Rythme et niveau d'intimité",
    color: '#ff7675',
    items: [
      { id: 'slow', label: 'Prendre son temps', iconName: 'Clock' },
      { id: 'spontaneous', label: 'Spontanéité', iconName: 'Zap' },
      { id: 'lights', label: 'Lumières allumées', iconName: 'Lightbulb' },
      { id: 'talking', label: 'Parler pendant', iconName: 'MessageSquare' },
      { id: 'eye-contact', label: 'Contact visuel', iconName: 'Eye' },
      { id: 'guidance', label: "Guider l'autre", iconName: 'Compass' }
    ]
  },
  trust: {
    iconName: 'ShieldCheck',
    title: 'Confiance',
    description: 'Pratiques nécessitant une communication renforcée',
    color: '#a29bfe',
    items: [
      { id: 'blindfold', label: 'Yeux bandés', iconName: 'EyeOff' },
      { id: 'restraint', label: 'Immobilisation douce', iconName: 'Link2' },
      { id: 'roleplay', label: 'Jeux de rôle', iconName: 'Layers' },
      { id: 'power', label: 'Dynamique de pouvoir', iconName: 'Crown' },
      { id: 'toys', label: 'Accessoires', iconName: 'Gift' },
      { id: 'filming', label: 'Photos/Vidéos', iconName: 'PhoneOff' }
    ]
  }
};

export const comfortLevels: ComfortLevel[] = [
  { value: 0, label: 'Non', color: '#e74c3c', iconName: 'XCircle' },
  { value: 1, label: 'Pas maintenant', color: '#e67e22', iconName: 'Pause' },
  { value: 2, label: 'Curieux·se', color: '#f1c40f', iconName: 'HelpCircle' },
  { value: 3, label: "À l'aise", color: '#2ecc71', iconName: 'CheckCircle' },
  { value: 4, label: "J'adore", color: '#9b59b6', iconName: 'Heart' }
];

export const consentPrinciples: ConsentPrinciple[] = [
  { title: 'Continu', text: 'Il peut être retiré à tout moment. Un "oui" peut devenir un "non".' },
  { title: 'Explicite', text: 'Le silence ou l\'absence de "non" ne signifie pas "oui".' },
  { title: 'Spécifique', text: 'Accepter une chose ne veut pas dire accepter tout.' },
  { title: 'Libre', text: 'Sans pression, sans chantage, sans manipulation.' },
  { title: 'Éclairé', text: 'On doit comprendre ce à quoi on consent.' }
];

export const helpResources: HelpResource[] = [
  { name: 'Fil Santé Jeunes', phone: '0 800 235 236', desc: 'Anonyme et gratuit', color: '#4db6ac' },
  { name: 'Violences Femmes Info', phone: '3919', desc: '24h/24', color: '#f78fb3' },
  { name: 'Planning Familial', phone: '0 800 08 11 11', desc: 'Sexualité, contraception', color: '#81c784' },
  { name: 'Prévention Suicide', phone: '3114', desc: 'Disponible 24h/24, 7j/7', color: '#7c3aed' },
  { name: 'Enfance en Danger', phone: '119', desc: 'Gratuit, 7j/7, 24h/24', color: '#f59e0b' },
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
    iconName: 'Film',
    porno: 'Les acteurs font des choses sans jamais en parler avant',
    realite: 'Les vraies relations commencent par une communication, des questions, un accord mutuel',
    explication: 'Dans la vraie vie, parler avant, pendant et après est normal et nécessaire. Ce n\'est pas bizarre, c\'est du respect.',
  },
  {
    id: 'p2',
    iconName: 'Layers',
    porno: 'Tout le monde semble adorer tout, tout le temps',
    realite: 'Chaque personne a des limites, des préférences, des choses qu\'elle n\'aime pas',
    explication: 'Les acteurs jouent un rôle. Dans la réalité, on peut aimer certaines choses et pas d\'autres. Dire non à quelque chose c\'est tout à fait normal.',
  },
  {
    id: 'p3',
    iconName: 'ShieldAlert',
    porno: 'Le refus ou l\'hésitation est souvent ignoré',
    realite: 'Un non ou une hésitation doit toujours être respecté, immédiatement',
    explication: 'Ignorer un refus est une agression. Dans la vraie vie, la moindre hésitation doit faire arrêter tout de suite.',
  },
  {
    id: 'p4',
    iconName: 'AlertCircle',
    porno: 'Certains actes semblent faciles et sans douleur',
    realite: 'Certains actes demandent préparation, douceur et peuvent faire mal si mal faits',
    explication: 'La pornographie ne montre pas la préparation, les produits nécessaires ni la douleur possible. Mal imiter ce qu\'on voit peut blesser.',
  },
  {
    id: 'p5',
    iconName: 'Scale',
    porno: 'Certaines scènes semblent normales à l\'écran',
    realite: 'Certains actes reproduits hors d\'un cadre consenti sont des crimes',
    explication: 'Ce qui est filmé avec des acteurs adultes consentants dans un contexte légal n\'est pas reproductible librement. Forcer quelqu\'un est un crime, peu importe ce qu\'on a vu dans un film.',
  },
  {
    id: 'p6',
    iconName: 'MessageCircle',
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

  // Mode Explicite — Face 1 🎭
  { id: 'ox1', face: 1, ageGate: 'explicit', text: "Dites à l'autre exactement ce que vous voulez lui faire ce soir — chaque geste, chaque endroit, sans métaphore ni euphémisme." },
  { id: 'ox2', face: 1, ageGate: 'explicit', text: "Décrivez comment vous aimeriez lui faire une fellation ou un cunnilingus — le rythme, la douceur, où vos mains iraient." },

  // Mode Explicite — Face 2 💬
  { id: 'px1', face: 2, ageGate: 'explicit', text: "Parlez d'une position sexuelle que vous n'avez jamais essayée mais que vous voulez vraiment — décrivez-la précisément à l'autre." },
  { id: 'px2', face: 2, ageGate: 'explicit', text: "Racontez le moment de sexe le plus intense que vous ayez vécu — où, comment, ce qui vous a fait jouir." },

  // Mode Explicite — Face 3 🤔
  { id: 'ex1', face: 3, ageGate: 'explicit', text: "Et si vous passiez la nuit à explorer le corps de l'autre avec la bouche — par où vous commenceriez, où vous iriez ?" },
  { id: 'ex2', face: 3, ageGate: 'explicit', text: "Et si vous vous faisiez du sexe oral mutuellement ce soir — comment ça se passerait, dans quel ordre, combien de temps ?" },

  // Mode Explicite — Face 4 🎯
  { id: 'dfx1', face: 4, ageGate: 'explicit', text: "Choisissez une position sexuelle et expliquez à l'autre comment vous voulez la faire — chaque détail compte." },
  { id: 'dfx2', face: 4, ageGate: 'explicit', text: "Guidez l'autre avec des mots précis pour qu'il/elle vous touche exactement là et comme vous voulez — sans utiliser vos mains." },

  // Mode Explicite — Face 5 ✨
  { id: 'vx1', face: 5, ageGate: 'explicit', text: "Quel acte sexuel vous procure le plus de plaisir — soyez précis·e sur le comment et le pourquoi, aucun détail interdit." },
  { id: 'vx2', face: 5, ageGate: 'explicit', text: "Y a-t-il un acte sexuel que vous voulez vraiment — une pénétration, du sexe oral, quelque chose de spécifique — que vous n'avez jamais osé demander ?" },

  // Mode Explicite — Face 6 ❤️
  { id: 'cx1', face: 6, ageGate: 'explicit', text: "Montrez à l'autre comment vous aimez être embrassé·e sur tout le corps — guidez-le/la de la tête aux pieds, prenez tout votre temps." },
  { id: 'cx2', face: 6, ageGate: 'explicit', text: "Faites une fellation ou un cunnilingus à l'autre en vous concentrant uniquement sur son plaisir — prenez tout le temps qu'il faut." },
];

export interface CardData {
  id: string;
  deck: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  ageGate: AgeGate;
}

export const cardData: CardData[] = [
  // Deck 1 — 🎭 Osez
  { id: 'ca1',  deck: 1, ageGate: 'all',   text: "Regardez-vous dans les yeux en silence pendant 30 secondes. Premier qui rigole a perdu." },
  { id: 'ca2',  deck: 1, ageGate: 'all',   text: "Faites-vous un compliment inattendu — pas sur l'apparence, sur quelque chose de rarement remarqué." },
  { id: 'ca3',  deck: 1, ageGate: 'all',   text: "Inventez un geste secret que vous serez les seuls à connaître. Utilisez-le avant la fin de la soirée." },
  { id: 'ca4',  deck: 1, ageGate: 'all',   text: "Échangez un objet que vous avez sur vous et expliquez en 30 secondes pourquoi il vous tient à cœur." },
  { id: 'ca5',  deck: 1, ageGate: 'all',   text: "Dites à l'autre une chose que vous n'auriez jamais pensé lui dire ce soir." },
  { id: 'ca6',  deck: 1, ageGate: 'all',   text: "Faites rire l'autre en moins de 20 secondes — sans le toucher." },
  { id: 'ca7',  deck: 1, ageGate: 'all',   text: "Montrez à l'autre une photo sur votre téléphone qui raconte quelque chose sur vous." },
  { id: 'ca8',  deck: 1, ageGate: 'all',   text: "Imitez la gestuelle ou la voix de l'autre. Il doit deviner qui vous imitez." },
  { id: 'ca9',  deck: 1, ageGate: 'all',   text: "Faites quelque chose de gentil pour l'autre en moins d'une minute — de façon créative." },
  { id: 'ca10', deck: 1, ageGate: 'all',   text: "Posez votre main sur l'épaule de l'autre pendant qu'il parle. Restez là, juste présent·e." },
  { id: 'ca11', deck: 1, ageGate: 'adult', text: "Décrivez à voix haute ce que vous aimeriez faire ensemble ce soir — sans filtre, sans honte." },
  { id: 'ca12', deck: 1, ageGate: 'adult', text: "Envoyez un message à l'autre décrivant exactement ce dont vous avez envie. Maintenant. Sans effacer." },
  { id: 'ca13', deck: 1, ageGate: 'adult', text: "Dites à l'autre ce que vous trouvez le plus attirant chez lui/elle — de façon très précise." },
  { id: 'ca14', deck: 1, ageGate: 'adult', text: "Chuchotez à l'autre quelque chose que vous n'avez jamais osé dire à voix normale." },

  // Deck 2 — 💬 Parlez
  { id: 'cb1',  deck: 2, ageGate: 'all',   text: "Quelle est la chose que l'autre fait inconsciemment qui vous rend toujours heureux·se ?" },
  { id: 'cb2',  deck: 2, ageGate: 'all',   text: "Racontez un souvenir où vous vous êtes senti·e pleinement accepté·e par l'autre." },
  { id: 'cb3',  deck: 2, ageGate: 'all',   text: "Si vous deviez décrire votre relation avec une météo — il fait quel temps ?" },
  { id: 'cb4',  deck: 2, ageGate: 'all',   text: "Qu'est-ce que vous n'osez pas demander à l'autre depuis longtemps ?" },
  { id: 'cb5',  deck: 2, ageGate: 'all',   text: "Quelle est la chose que vous voudriez que l'autre comprenne mieux de vous ?" },
  { id: 'cb6',  deck: 2, ageGate: 'all',   text: "Décrivez l'autre en 3 adjectifs qu'il ou elle ne se donnerait probablement jamais." },
  { id: 'cb7',  deck: 2, ageGate: 'all',   text: "À quel moment avez-vous réalisé que vous pouviez vraiment faire confiance à l'autre ?" },
  { id: 'cb8',  deck: 2, ageGate: 'all',   text: "Qu'est-ce qui vous a surpris chez l'autre depuis le début de votre relation ?" },
  { id: 'cb9',  deck: 2, ageGate: 'all',   text: "Quelle est la chose la plus importante que l'autre vous ait apprise sur vous-même ?" },
  { id: 'cb10', deck: 2, ageGate: 'all',   text: "Dites une chose que vous gardez généralement pour vous, mais que vous pouvez dire ce soir." },
  { id: 'cb11', deck: 2, ageGate: 'adult', text: "Qu'est-ce qui vous attire en ce moment — quelque chose que vous n'avez jamais vraiment dit ?" },
  { id: 'cb12', deck: 2, ageGate: 'adult', text: "Y a-t-il quelque chose dans l'intimité qui vous plaît, mais dont vous avez un peu honte d'aimer ?" },
  { id: 'cb13', deck: 2, ageGate: 'adult', text: "Décrivez votre fantasme du moment en détail. L'autre écoute sans interrompre ni juger." },
  { id: 'cb14', deck: 2, ageGate: 'adult', text: "Qu'aimeriez-vous que l'autre fasse plus souvent, sans avoir à le demander ?" },

  // Deck 3 — 🤔 Et si…
  { id: 'cc1',  deck: 3, ageGate: 'all',   text: "Et si vous pouviez avoir un super-pouvoir de couple — ce serait lequel ?" },
  { id: 'cc2',  deck: 3, ageGate: 'all',   text: "Et si vous partiez demain pour 3 mois en voyage — vous iriez où exactement ?" },
  { id: 'cc3',  deck: 3, ageGate: 'all',   text: "Et si vous pouviez remonter le temps jusqu'à votre première rencontre — vous changeriez quoi ?" },
  { id: 'cc4',  deck: 3, ageGate: 'all',   text: "Et si vous deviez choisir un film qui décrit parfaitement votre relation — ce serait lequel ?" },
  { id: 'cc5',  deck: 3, ageGate: 'all',   text: "Et si vous passiez une journée parfaite ensemble — elle ressemblerait à quoi exactement ?" },
  { id: 'cc6',  deck: 3, ageGate: 'all',   text: "Et si on vous interviewait dans 20 ans sur votre relation — qu'est-ce qu'on dirait ?" },
  { id: 'cc7',  deck: 3, ageGate: 'all',   text: "Et si vous pouviez vivre n'importe où dans le monde — vous choisiriez quoi ?" },
  { id: 'cc8',  deck: 3, ageGate: 'all',   text: "Et si vous deviez créer une règle entre vous deux que vous n'avez jamais formalisée — ce serait laquelle ?" },
  { id: 'cc9',  deck: 3, ageGate: 'all',   text: "Et si vous deviez décrire l'autre à quelqu'un qui ne l'a jamais rencontré — vous diriez quoi ?" },
  { id: 'cc10', deck: 3, ageGate: 'all',   text: "Et si vous pouviez changer une chose dans la façon dont vous communiquez — ce serait quoi ?" },
  { id: 'cc11', deck: 3, ageGate: 'adult', text: "Et si vous pouviez rejouer votre première nuit ensemble — vous changeriez quoi ?" },
  { id: 'cc12', deck: 3, ageGate: 'adult', text: "Et si vous pouviez essayer quelque chose de nouveau ce soir — vous choisiriez quoi ?" },
  { id: 'cc13', deck: 3, ageGate: 'adult', text: "Et si vous n'aviez aucune inhibition pendant une nuit — qu'est-ce que vous feriez ?" },
  { id: 'cc14', deck: 3, ageGate: 'adult', text: "Et si vous pouviez exprimer un désir secret sans aucun jugement de l'autre — ce serait lequel ?" },

  // Deck 4 — 🎯 Défi
  { id: 'cd1',  deck: 4, ageGate: 'all',   text: "Inventez un surnom ridicule pour l'autre. Il/elle doit l'accepter ou en proposer un encore pire." },
  { id: 'cd2',  deck: 4, ageGate: 'all',   text: "Dessinez le portrait de l'autre en moins de 60 secondes — montrez le résultat sans rougir." },
  { id: 'cd3',  deck: 4, ageGate: 'all',   text: "Mimez une scène d'un film culte. L'autre doit deviner lequel en moins de 5 essais." },
  { id: 'cd4',  deck: 4, ageGate: 'all',   text: "Prenez le selfie le plus bizarre et le plus laid possible ensemble." },
  { id: 'cd5',  deck: 4, ageGate: 'all',   text: "Chantez les premières secondes d'une chanson. L'autre doit la reconnaître." },
  { id: 'cd6',  deck: 4, ageGate: 'all',   text: "Dites 5 choses que vous avez en commun en moins de 30 secondes." },
  { id: 'cd7',  deck: 4, ageGate: 'all',   text: "Inventez une signature de salutation unique que vous utiliserez chaque matin." },
  { id: 'cd8',  deck: 4, ageGate: 'all',   text: "Racontez comment vous vous êtes rencontré·e·s comme si c'était une scène de film hollywoodien." },
  { id: 'cd9',  deck: 4, ageGate: 'all',   text: "En 60 secondes, expliquez à l'autre pourquoi vous l'aimez — sans utiliser le mot 'parce que'." },
  { id: 'cd10', deck: 4, ageGate: 'all',   text: "Inventez une danse à deux, maintenant. Nommez-la. Répétez-la 2 fois." },
  { id: 'cd11', deck: 4, ageGate: 'adult', text: "Écrivez un mini-scénario à deux — une phrase chacun à tour de rôle. Le plus torride gagne." },
  { id: 'cd12', deck: 4, ageGate: 'adult', text: "Décrivez l'autre de façon sensuelle en 3 métaphores poétiques. Le plus lyrique gagne." },
  { id: 'cd13', deck: 4, ageGate: 'adult', text: "Inventez un code secret pour communiquer un désir sans le dire à voix haute." },
  { id: 'cd14', deck: 4, ageGate: 'adult', text: "Décrivez la chose la plus mémorable que vous avez faite ensemble — de façon cinématographique, en 60 secondes." },

  // Deck 5 — ✨ Vérité
  { id: 'ce1',  deck: 5, ageGate: 'all',   text: "Qu'est-ce qui vous fait dire 'non' immédiatement, sans hésiter ?" },
  { id: 'ce2',  deck: 5, ageGate: 'all',   text: "Y a-t-il quelque chose que vous aimeriez que l'autre fasse différemment ? Dites-le maintenant." },
  { id: 'ce3',  deck: 5, ageGate: 'all',   text: "Qu'est-ce que vous n'avez jamais osé demander à l'autre ?" },
  { id: 'ce4',  deck: 5, ageGate: 'all',   text: "Quel est votre plus grand besoin dans cette relation — celui que vous exprimez rarement ?" },
  { id: 'ce5',  deck: 5, ageGate: 'all',   text: "Y a-t-il quelque chose qui vous a blessé·e récemment, que vous n'avez pas dit ?" },
  { id: 'ce6',  deck: 5, ageGate: 'all',   text: "De quoi avez-vous besoin pour vous sentir vraiment en sécurité avec l'autre ?" },
  { id: 'ce7',  deck: 5, ageGate: 'all',   text: "Quelle est la chose qui vous rend le plus vulnérable dans une relation ?" },
  { id: 'ce8',  deck: 5, ageGate: 'all',   text: "Vous sentez-vous libre de dire 'non' à l'autre ? Qu'est-ce qui vous en empêche parfois ?" },
  { id: 'ce9',  deck: 5, ageGate: 'all',   text: "Qu'est-ce qui compte vraiment pour vous — une chose que l'autre devrait toujours respecter ?" },
  { id: 'ce10', deck: 5, ageGate: 'all',   text: "Est-ce qu'il y a quelque chose dont vous avez besoin et que l'autre ne sait peut-être pas ?" },
  { id: 'ce11', deck: 5, ageGate: 'adult', text: "Qu'est-ce que vous aimeriez essayer — quelque chose que vous n'avez jamais osé demander ?" },
  { id: 'ce12', deck: 5, ageGate: 'adult', text: "Y a-t-il quelque chose dans votre vie intime que vous aimeriez changer — soyez honnête." },
  { id: 'ce13', deck: 5, ageGate: 'adult', text: "Quelle est votre limite absolue — quelque chose que vous ne feriez jamais, même si on vous le demandait ?" },
  { id: 'ce14', deck: 5, ageGate: 'adult', text: "Vous sentez-vous vraiment libre d'exprimer vos désirs avec l'autre ? Qu'est-ce qui vous retient ?" },

  // Deck 6 — ❤️ Douceur
  { id: 'cf1',  deck: 6, ageGate: 'all',   text: "Prenez-vous dans les bras pendant 60 secondes. En silence. Chronométrez." },
  { id: 'cf2',  deck: 6, ageGate: 'all',   text: "Dites 3 choses que vous adorez chez l'autre — sans répéter quelque chose de déjà dit ce soir." },
  { id: 'cf3',  deck: 6, ageGate: 'all',   text: "Tenez-vous la main, fermez les yeux tous les deux. Restez comme ça 30 secondes." },
  { id: 'cf4',  deck: 6, ageGate: 'all',   text: "Laissez l'autre décider d'une chose à faire ensemble ce soir — sans négocier, sans refuser." },
  { id: 'cf5',  deck: 6, ageGate: 'all',   text: "Regardez l'autre dans les yeux et dites-lui une chose que vous êtes content·e d'avoir dans votre vie." },
  { id: 'cf6',  deck: 6, ageGate: 'all',   text: "Posez votre tête sur l'épaule de l'autre pendant une minute complète." },
  { id: 'cf7',  deck: 6, ageGate: 'all',   text: "Écrivez à l'autre un message avec ce que vous auriez voulu lui dire il y a longtemps." },
  { id: 'cf8',  deck: 6, ageGate: 'all',   text: "Inventez un signe doux entre vous — quelque chose à utiliser quand les mots manquent." },
  { id: 'cf9',  deck: 6, ageGate: 'all',   text: "Dites à l'autre en quoi il ou elle vous a aidé·e à grandir depuis que vous vous connaissez." },
  { id: 'cf10', deck: 6, ageGate: 'all',   text: "Restez en silence avec l'autre pendant 2 minutes complètes. Juste être là, ensemble." },
  { id: 'cf11', deck: 6, ageGate: 'adult', text: "Dites à l'autre exactement ce que vous aimez dans la façon dont il ou elle vous touche." },
  { id: 'cf12', deck: 6, ageGate: 'adult', text: "Faites à l'autre un massage de 5 minutes, en silence. Juste donner, sans rien attendre." },
  { id: 'cf13', deck: 6, ageGate: 'adult', text: "Montrez à l'autre comment vous aimez être touché·e — guidez doucement sa main." },
  { id: 'cf14', deck: 6, ageGate: 'adult', text: "Dites à l'autre ce qui vous rend le plus à l'aise dans l'intimité, et ce dont vous avez besoin pour vous sentir bien." },

  // Mode Explicite — Deck 1 🎭
  { id: 'cax1', deck: 1, ageGate: 'explicit', text: "Dites à l'autre exactement ce que vous voulez lui faire ce soir — chaque geste, chaque endroit, sans métaphore ni euphémisme." },
  { id: 'cax2', deck: 1, ageGate: 'explicit', text: "Décrivez comment vous aimeriez lui faire une fellation ou un cunnilingus — le rythme, la douceur, où vos mains iraient." },

  // Mode Explicite — Deck 2 💬
  { id: 'cbx1', deck: 2, ageGate: 'explicit', text: "Parlez d'une position sexuelle que vous n'avez jamais essayée mais que vous voulez vraiment — décrivez-la précisément à l'autre." },
  { id: 'cbx2', deck: 2, ageGate: 'explicit', text: "Racontez le moment de sexe le plus intense que vous ayez vécu — où, comment, ce qui vous a fait jouir." },

  // Mode Explicite — Deck 3 🤔
  { id: 'ccx1', deck: 3, ageGate: 'explicit', text: "Et si vous passiez la nuit à explorer le corps de l'autre avec la bouche — par où commenceriez-vous, où iriez-vous ?" },
  { id: 'ccx2', deck: 3, ageGate: 'explicit', text: "Et si vous vous faisiez du sexe oral mutuellement ce soir — comment ça se passerait, dans quel ordre ?" },

  // Mode Explicite — Deck 4 🎯
  { id: 'cdx1', deck: 4, ageGate: 'explicit', text: "Choisissez une position sexuelle et expliquez à l'autre comment vous voulez la faire — chaque détail compte." },
  { id: 'cdx2', deck: 4, ageGate: 'explicit', text: "Guidez l'autre avec des mots précis pour qu'il/elle vous touche exactement là et comme vous voulez — sans utiliser vos mains." },

  // Mode Explicite — Deck 5 ✨
  { id: 'cex1', deck: 5, ageGate: 'explicit', text: "Quel acte sexuel vous procure le plus de plaisir — soyez précis·e sur le comment et le pourquoi, aucun détail interdit." },
  { id: 'cex2', deck: 5, ageGate: 'explicit', text: "Y a-t-il un acte sexuel spécifique — une pénétration, du sexe oral, autre chose — que vous voulez vraiment mais n'avez jamais osé demander ?" },

  // Mode Explicite — Deck 6 ❤️
  { id: 'cfx1', deck: 6, ageGate: 'explicit', text: "Montrez à l'autre comment vous aimez être touché·e sur tout le corps — guidez-le/la doucement, prenez tout votre temps." },
  { id: 'cfx2', deck: 6, ageGate: 'explicit', text: "Faites une fellation ou un cunnilingus à l'autre en vous concentrant uniquement sur son plaisir — prenez tout le temps qu'il faut." },
];

export const loiPoints: LoiPoint[] = [
  {
    id: 'l1',
    iconName: 'Calendar',
    titre: 'L\'âge légal du consentement',
    contenu: 'En France, l\'âge légal du consentement sexuel est fixé à 15 ans. En dessous de cet âge, aucun acte sexuel avec un adulte ne peut être légal, même si le ou la jeune dit qu\'il ou elle est d\'accord.',
    important: true,
  },
  {
    id: 'l2',
    iconName: 'AlertTriangle',
    titre: 'Ce que risque l\'adulte',
    contenu: 'Un adulte qui a un rapport sexuel avec un mineur de moins de 15 ans risque jusqu\'à 20 ans de prison. Si l\'adulte est un parent, professeur ou figure d\'autorité, les peines sont encore plus lourdes.',
    important: true,
  },
  {
    id: 'l3',
    iconName: 'Users',
    titre: 'Et entre adolescents ?',
    contenu: 'Quand les deux personnes ont moins de 18 ans et un écart d\'âge raisonnable, la loi est plus souple. Mais le consentement reste obligatoire. Forcer quelqu\'un ou ignorer un refus est une infraction, peu importe l\'âge.',
    important: false,
  },
  {
    id: 'l4',
    iconName: 'Smartphone',
    titre: 'Photos et vidéos',
    contenu: 'Prendre, partager ou posséder des photos ou vidéos à caractère sexuel d\'un mineur est un crime grave — même si le mineur a dit oui, même si c\'est lui qui a envoyé la photo. C\'est la loi.',
    important: true,
  },
  {
    id: 'l5',
    iconName: 'BellOff',
    titre: 'Le silence n\'est pas un oui',
    contenu: 'La loi française est claire : l\'absence de résistance ne constitue pas un consentement. Une personne qui ne dit rien, qui est sous pression, intimidée ou sous l\'emprise d\'alcool ne peut pas consentir.',
    important: false,
  },
  {
    id: 'l6',
    iconName: 'LifeBuoy',
    titre: 'Si tu as vécu quelque chose',
    contenu: 'Si tu as vécu quelque chose qui t\'a mis mal à l\'aise ou que tu penses être une agression, tu peux en parler. Ce n\'est jamais ta faute. Des professionnels sont là pour t\'écouter sans te juger.',
    important: false,
  },
];
