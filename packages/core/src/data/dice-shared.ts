import type { IconName } from '../types';

export type DiceAgeGate = 'all' | 'adult' | 'explicit' | 'premium';

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
  ageGate: DiceAgeGate;
}

export const diePractices: DiePractice[] = [
  // Face 1 - Osez
  { id: 'o1', face: 1, ageGate: 'all',   text: "Regardez-vous dans les yeux en silence pendant 30 secondes. Premier qui rigole a perdu. 👀" },
  { id: 'o2', face: 1, ageGate: 'all',   text: "Faites-vous un compliment inattendu — pas sur l'apparence, sur quelque chose que l'autre remarque rarement." },
  { id: 'o3', face: 1, ageGate: 'all',   text: "Inventez un geste secret que vous serez les seuls à connaître. Utilisez-le au moins une fois ce soir." },
  { id: 'o4', face: 1, ageGate: 'all',   text: "Échangez un objet que vous avez sur vous et expliquez en 30 secondes pourquoi il vous tient à cœur." },
  { id: 'o5', face: 1, ageGate: 'adult', text: "Décrivez à voix haute ce que vous aimeriez faire ensemble ce soir — sans filtre, sans honte." },
  { id: 'o6', face: 1, ageGate: 'adult', text: "Envoyez un message à l'autre décrivant exactement ce dont vous avez envie. Maintenant. Sans effacer." },

  // Face 2 - Parlez
  { id: 'p1', face: 2, ageGate: 'all',   text: "Dites une chose que vous n'osez jamais dire normalement. L'autre écoute sans interrompre." },
  { id: 'p2', face: 2, ageGate: 'all',   text: "Qu'est-ce que l'autre fait inconsciemment qui vous rend heureux·se ?" },
  { id: 'p3', face: 2, ageGate: 'all',   text: "Racontez un moment précis où vous avez ressenti une confiance totale avec l'autre." },
  { id: 'p4', face: 2, ageGate: 'all',   text: "Qu'est-ce que vous aimeriez que l'autre comprenne mieux de vous ?" },
  { id: 'p5', face: 2, ageGate: 'adult', text: "Qu'est-ce qui vous excite en ce moment — quelque chose que vous n'avez jamais vraiment dit ?" },
  { id: 'p6', face: 2, ageGate: 'adult', text: "Décrivez votre fantasme du moment en détail. L'autre écoute sans interrompre — ni juger." },

  // Face 3 - Et si...
  { id: 'e1', face: 3, ageGate: 'all',   text: "Et si vous passiez une journée parfaite ensemble — elle ressemble à quoi exactement ?" },
  { id: 'e2', face: 3, ageGate: 'all',   text: "Et si vous deviez décrire votre relation avec une météo — il fait quel temps ?" },
  { id: 'e3', face: 3, ageGate: 'all',   text: "Et si vous pouviez remonter le temps jusqu'à votre première rencontre — vous changeriez quoi ?" },
  { id: 'e4', face: 3, ageGate: 'all',   text: "Et si vous pouviez avoir un super-pouvoir de couple — ça serait lequel ?" },
  { id: 'e5', face: 3, ageGate: 'adult', text: "Et si vous pouviez rejouer votre première nuit ensemble — vous changeriez quoi ?" },
  { id: 'e6', face: 3, ageGate: 'adult', text: "Et si vous pouviez essayer quelque chose de nouveau ce soir — vous choisiriez quoi ?" },

  // Face 4 - Defi
  { id: 'df1', face: 4, ageGate: 'all',   text: "Inventez un surnom ridicule pour l'autre. Il doit l'accepter ou en proposer un encore pire. 😄" },
  { id: 'df2', face: 4, ageGate: 'all',   text: "Faites rire l'autre en 20 secondes max — sans le/la toucher. Chrono !" },
  { id: 'df3', face: 4, ageGate: 'all',   text: "Mimez une scène d'un film culte. L'autre doit deviner lequel en moins de 5 essais." },
  { id: 'df4', face: 4, ageGate: 'all',   text: "Prenez le selfie le plus bizarre et le plus laid possible ensemble. Celui qui rit le moins a perdu." },
  { id: 'df5', face: 4, ageGate: 'adult', text: "Écrivez un mini-scénario à deux — une phrase chacun à tour de rôle. Le plus torride possible." },
  { id: 'df6', face: 4, ageGate: 'adult', text: "Décrivez l'autre de façon sensuelle en 3 métaphores poétiques. Le plus lyrique gagne." },

  // Face 5 - Verite
  { id: 'v1', face: 5, ageGate: 'all',   text: "Qu'est-ce qui vous fait dire \"non\" immédiatement, sans hésiter ?" },
  { id: 'v2', face: 5, ageGate: 'all',   text: "Y a-t-il quelque chose que vous aimeriez que l'autre fasse différemment ? Dites-le maintenant." },
  { id: 'v3', face: 5, ageGate: 'all',   text: "Qu'est-ce que vous n'avez jamais osé demander à l'autre ?" },
  { id: 'v4', face: 5, ageGate: 'all',   text: "Quel est votre plus grand besoin dans cette relation — celui que vous exprimez rarement ?" },
  { id: 'v5', face: 5, ageGate: 'adult', text: "Qu'est-ce que vous aimeriez essayer — quelque chose que vous n'avez jamais osé demander ?" },
  { id: 'v6', face: 5, ageGate: 'adult', text: "Y a-t-il quelque chose dans votre vie intime que vous aimeriez changer — soyez honnête." },

  // Face 6 - Douceur
  { id: 'c1', face: 6, ageGate: 'all',   text: "Prenez-vous dans les bras pendant 60 secondes. En silence. Chronométrez." },
  { id: 'c2', face: 6, ageGate: 'all',   text: "Dites 3 choses que vous adorez chez l'autre — sans répéter quelque chose de déjà dit ce soir." },
  { id: 'c3', face: 6, ageGate: 'all',   text: "Tenez-vous la main, fermez les yeux tous les deux. Restez comme ça 30 secondes." },
  { id: 'c4', face: 6, ageGate: 'all',   text: "Laissez l'autre décider d'une chose qu'on fait ensemble ce soir — sans négocier, sans refuser." },
  { id: 'c5', face: 6, ageGate: 'adult', text: "Dites à l'autre exactement ce que vous aimez dans la façon dont il/elle vous touche." },
  { id: 'c6', face: 6, ageGate: 'adult', text: "Faites à l'autre un massage de 5 minutes, en silence. Juste donner, sans rien attendre." },

  // Mode Explicite - Face 1
  { id: 'ox1', face: 1, ageGate: 'explicit', text: "Dites à l'autre exactement ce que vous voulez lui faire ce soir — chaque geste, chaque endroit, sans métaphore ni euphémisme." },
  { id: 'ox2', face: 1, ageGate: 'explicit', text: "Décrivez comment vous aimeriez lui faire une fellation ou un cunnilingus — le rythme, la douceur, où vos mains iraient." },

  // Mode Explicite - Face 2
  { id: 'px1', face: 2, ageGate: 'explicit', text: "Parlez d'une position sexuelle que vous n'avez jamais essayée mais que vous voulez vraiment — décrivez-la précisément à l'autre." },
  { id: 'px2', face: 2, ageGate: 'explicit', text: "Racontez le moment de sexe le plus intense que vous ayez vécu — où, comment, ce qui vous a fait jouir." },

  // Mode Explicite - Face 3
  { id: 'ex1', face: 3, ageGate: 'explicit', text: "Et si vous passiez la nuit à explorer le corps de l'autre avec la bouche — par où vous commenceriez, où vous iriez ?" },
  { id: 'ex2', face: 3, ageGate: 'explicit', text: "Et si vous vous faisiez du sexe oral mutuellement ce soir — comment ça se passerait, dans quel ordre, combien de temps ?" },

  // Mode Explicite - Face 4
  { id: 'dfx1', face: 4, ageGate: 'explicit', text: "Choisissez une position sexuelle et expliquez à l'autre comment vous voulez la faire — chaque détail compte." },
  { id: 'dfx2', face: 4, ageGate: 'explicit', text: "Guidez l'autre avec des mots précis pour qu'il/elle vous touche exactement là et comme vous voulez — sans utiliser vos mains." },

  // Mode Explicite - Face 5
  { id: 'vx1', face: 5, ageGate: 'explicit', text: "Quel acte sexuel vous procure le plus de plaisir — soyez précis·e sur le comment et le pourquoi, aucun détail interdit." },
  { id: 'vx2', face: 5, ageGate: 'explicit', text: "Y a-t-il un acte sexuel que vous voulez vraiment — une pénétration, du sexe oral, quelque chose de spécifique — que vous n'avez jamais osé demander ?" },

  // Mode Explicite - Face 6
  { id: 'cx1', face: 6, ageGate: 'explicit', text: "Montrez à l'autre comment vous aimez être embrassé·e sur tout le corps — guidez-le/la de la tête aux pieds, prenez tout votre temps." },
  { id: 'cx2', face: 6, ageGate: 'explicit', text: "Faites une fellation ou un cunnilingus à l'autre en vous concentrant uniquement sur son plaisir — prenez tout le temps qu'il faut." },
];
