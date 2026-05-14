// Profils fictifs basés sur la structure réelle des annuaires français (SNSC, AIUS, Doctolib).
// À remplacer par de vrais profils avec accord des professionnels avant publication.

export type TitreProf =
  | 'Médecin sexologue'
  | 'Psychologue sexologue'
  | 'Sexologue clinicien·ne (SNSC)'
  | 'Psychosexologue'
  | 'Sexologue & thérapeute de couple';

export type ConsultationType = 'présentiel' | 'téléconsultation' | 'les deux';

export type Label = 'SNSC' | 'AIUS' | 'SFSC';

export type Sexologue = {
  id: string;
  prenom: string;
  nom: string;
  titre: TitreProf;
  labels: Label[];
  ville: string;
  departement: string;
  bio: string;
  specialites: string[];
  approches: string[];
  publics: string[];
  consultation: ConsultationType;
  tarifPremiere: number;
  tarifSuivi: number;
  tarifCouple?: number;
  dureeMinutes: number;
  remboursementSS: boolean;
  langues: string[];
  telephone: string;
  doctolib?: string;
};

export const SEXOLOGUES: Sexologue[] = [
  {
    id: 'sophie-laurent',
    prenom: 'Sophie',
    nom: 'Laurent',
    titre: 'Médecin sexologue',
    labels: ['AIUS'],
    ville: 'Paris (9e)',
    departement: 'Île-de-France',
    bio: "Médecin généraliste avec DIU de sexologie clinique (Paris Cité), je reçois des femmes et des couples confrontés à des douleurs sexuelles, des troubles du désir ou des difficultés relationnelles. Mon approche combine examen médical, thérapie cognitivo-comportementale et rééducation périnéale selon les besoins.",
    specialites: [
      'Vaginisme',
      'Dyspareunie (douleurs à la pénétration)',
      'Vulvodynie',
      'Anorgasmie',
      'Trouble du désir féminin',
      'Sexualité post-partum',
      'Sexualité et ménopause',
    ],
    approches: ['TCC', 'Rééducation périnéale', 'Sexothérapie intégrative'],
    publics: ['Femmes', 'Couples'],
    consultation: 'les deux',
    tarifPremiere: 100,
    tarifSuivi: 85,
    tarifCouple: 120,
    dureeMinutes: 60,
    remboursementSS: true,
    langues: ['Français', 'Anglais'],
    telephone: '01 42 XX XX XX',
    doctolib: 'https://www.doctolib.fr/sexologie',
  },
  {
    id: 'thomas-renard',
    prenom: 'Thomas',
    nom: 'Renard',
    titre: 'Psychologue sexologue',
    labels: ['SNSC'],
    ville: 'Lyon (3e)',
    departement: 'Auvergne-Rhône-Alpes',
    bio: "Psychologue clinicien spécialisé en sexologie, je travaille principalement avec des hommes et des couples sur les troubles sexuels masculins — troubles de l'érection, éjaculation précoce ou retardée — ainsi que sur les comportements sexuels compulsifs et l'usage problématique de la pornographie. Approche non-jugeante, axée sur la compréhension des mécanismes psychologiques.",
    specialites: [
      'Dysfonction érectile (troubles de l\'érection)',
      'Éjaculation précoce',
      'Éjaculation retardée',
      'Addiction pornographique',
      'Hypersexualité / sexualité compulsive',
      'Trouble du désir masculin',
    ],
    approches: ['TCC', 'Thérapie ACT', 'Pleine conscience'],
    publics: ['Hommes', 'Couples'],
    consultation: 'les deux',
    tarifPremiere: 70,
    tarifSuivi: 60,
    tarifCouple: 90,
    dureeMinutes: 50,
    remboursementSS: false,
    langues: ['Français'],
    telephone: '04 72 XX XX XX',
    doctolib: 'https://www.doctolib.fr/sexologie',
  },
  {
    id: 'claire-moreau',
    prenom: 'Claire',
    nom: 'Moreau',
    titre: 'Sexologue clinicien·ne (SNSC)',
    labels: ['SNSC'],
    ville: 'Paris (15e)',
    departement: 'Île-de-France',
    bio: "Sexologue clinicienne labellisée SNSC (ACENOS), je reçois en cabinet uniquement. Mon travail porte sur l'anorgasmie, les désaccords de désir dans le couple et la thérapie de couple en général. Je travaille avec une approche systémique qui prend en compte la dynamique relationnelle dans son ensemble.",
    specialites: [
      'Anorgasmie (primaire et situationnelle)',
      'Désaccord de désir dans le couple',
      'Thérapie de couple',
      'Communication intime et sexuelle',
      'Infidélité et reconstruction de la confiance',
    ],
    approches: ['Thérapie systémique', 'Sexothérapie de couple'],
    publics: ['Femmes', 'Couples', 'Hommes'],
    consultation: 'présentiel',
    tarifPremiere: 90,
    tarifSuivi: 75,
    tarifCouple: 110,
    dureeMinutes: 55,
    remboursementSS: false,
    langues: ['Français', 'Espagnol'],
    telephone: '01 45 XX XX XX',
  },
  {
    id: 'antoine-dubois',
    prenom: 'Antoine',
    nom: 'Dubois',
    titre: 'Médecin sexologue',
    labels: ['AIUS', 'SFSC'],
    ville: 'Bordeaux',
    departement: 'Nouvelle-Aquitaine',
    bio: "Médecin sexologue (DIU, université de Bordeaux), je me spécialise dans l'onco-sexologie (accompagnement de la sexualité après un cancer), la sexologie du handicap et la sexologie affirmative LGBTQIA+. Je propose des consultations en cabinet et en téléconsultation. Remboursement partiel Sécurité Sociale (secteur 2).",
    specialites: [
      'Onco-sexologie (sexualité et cancer)',
      'Sexualité et handicap',
      'Thérapie affirmative LGBTQIA+',
      'Dysphorie de genre / accompagnement transidentité',
      'Questionnement sur l\'orientation sexuelle',
      'Sexualité et maladies chroniques',
    ],
    approches: ['Thérapie affirmative', 'Entretien motivationnel', 'Psychoéducation'],
    publics: ['LGBTQIA+', 'Personnes en situation de handicap', 'Personnes atteintes de cancer', 'Tous publics adultes'],
    consultation: 'les deux',
    tarifPremiere: 75,
    tarifSuivi: 65,
    dureeMinutes: 60,
    remboursementSS: true,
    langues: ['Français', 'Anglais'],
    telephone: '05 56 XX XX XX',
    doctolib: 'https://www.doctolib.fr/sexologie',
  },
  {
    id: 'amina-bensalem',
    prenom: 'Amina',
    nom: 'Bensalem',
    titre: 'Psychosexologue',
    labels: ['SNSC'],
    ville: 'Marseille',
    departement: 'Provence-Alpes-Côte d\'Azur',
    bio: "Psychosexologue formée à l'EMDR, je reçois des personnes ayant vécu des traumatismes sexuels — agressions sexuelles, inceste, situations d'emprise — ainsi que des personnes LGBTQIA+ en quête d'un espace sécurisant et non-pathologisant. Ma pratique est clairement affirmative : mon rôle n'est pas de questionner ton identité ou tes désirs, mais de t'aider à te les approprier.",
    specialites: [
      'Traumatismes sexuels (agressions, inceste)',
      'TSPT d\'origine sexuelle',
      'Thérapie affirmative LGBTQIA+',
      'Non-binarité et expression de genre',
      'Anorgasmie post-traumatique',
      'Relations après un vécu de violence',
    ],
    approches: ['EMDR', 'Thérapie affirmative', 'Thérapie narrative'],
    publics: ['LGBTQIA+', 'Femmes', 'Survivant·e·s de violences sexuelles'],
    consultation: 'les deux',
    tarifPremiere: 65,
    tarifSuivi: 55,
    dureeMinutes: 60,
    remboursementSS: false,
    langues: ['Français', 'Arabe'],
    telephone: '04 91 XX XX XX',
  },
  {
    id: 'marc-fontaine',
    prenom: 'Marc',
    nom: 'Fontaine',
    titre: 'Sexologue clinicien·ne (SNSC)',
    labels: ['SNSC'],
    ville: 'Toulouse',
    departement: 'Occitanie',
    bio: "Sexologue clinicien (SNSC), je propose un accompagnement non-pathologisant des pratiques sexuelles alternatives : BDSM et kink, sexualités non-monogames, polyamour. Mon travail ne consiste pas à « traiter » ces pratiques, mais à aider à les vivre de façon éclairée, à travailler le consentement dans ces contextes spécifiques, et à dénouer les tensions que ces pratiques peuvent créer dans un couple ou en soi.",
    specialites: [
      'Accompagnement BDSM / kink (non-pathologisant)',
      'Polyamour et non-monogamie éthique',
      'Consentement dans les pratiques sexuelles avancées',
      'Désaccord de pratiques dans le couple',
      'Paraphilies non-problématiques',
      'Thérapie de couple (contexte alternatif)',
    ],
    approches: ['Approche humaniste', 'Thérapie systémique', 'Psychoéducation sur le consentement'],
    publics: ['Tous publics adultes', 'Couples', 'Communauté kink / BDSM'],
    consultation: 'les deux',
    tarifPremiere: 70,
    tarifSuivi: 60,
    tarifCouple: 95,
    dureeMinutes: 60,
    remboursementSS: false,
    langues: ['Français', 'Anglais'],
    telephone: '05 61 XX XX XX',
  },
  {
    id: 'nathalie-girard',
    prenom: 'Nathalie',
    nom: 'Girard',
    titre: 'Psychologue sexologue',
    labels: ['AIUS'],
    ville: 'Strasbourg',
    departement: 'Grand Est',
    bio: "Psychologue spécialisée en sexologie féminine, je reçois principalement des femmes confrontées aux bouleversements sexuels liés aux grandes étapes de vie : grossesse, post-partum, ménopause. Je travaille aussi l'anorgasmie, les douleurs lors de la pénétration (dyspareunie, vaginisme), et la perte de désir à diverses étapes de la vie.",
    specialites: [
      'Sexualité et ménopause / post-ménopause',
      'Sexualité post-partum',
      'Anorgasmie',
      'Vaginisme',
      'Dyspareunie (douleurs à la pénétration)',
      'Perte de désir féminin',
      'Sexualité et endométriose',
    ],
    approches: ['TCC', 'Sophrologie', 'Pleine conscience'],
    publics: ['Femmes'],
    consultation: 'présentiel',
    tarifPremiere: 65,
    tarifSuivi: 55,
    dureeMinutes: 50,
    remboursementSS: false,
    langues: ['Français', 'Allemand'],
    telephone: '03 88 XX XX XX',
  },
  {
    id: 'karim-mansouri',
    prenom: 'Karim',
    nom: 'Mansouri',
    titre: 'Médecin sexologue',
    labels: ['AIUS', 'SFSC'],
    ville: 'Paris (8e)',
    departement: 'Île-de-France',
    bio: "Médecin sexologue (DIU Sorbonne), je me consacre exclusivement aux troubles sexuels masculins. Je reçois des hommes de tous âges pour des problèmes d'érection, d'éjaculation — précoce, retardée ou douloureuse — ainsi que des douleurs à l'éjaculation, des courbures péniennes (maladie de Peyronie) et des préoccupations sur le désir. Bilan médical complet inclus en première consultation.",
    specialites: [
      'Dysfonction érectile (troubles de l\'érection)',
      'Éjaculation précoce',
      'Éjaculation retardée / anéjaculation',
      'Éjaculation douloureuse',
      'Maladie de Peyronie (courbure pénienne)',
      'Trouble du désir masculin',
      'Sexualité et vieillissement',
    ],
    approches: ['Bilan médical sexologique', 'TCC', 'Prescription si nécessaire'],
    publics: ['Hommes'],
    consultation: 'les deux',
    tarifPremiere: 120,
    tarifSuivi: 100,
    dureeMinutes: 60,
    remboursementSS: true,
    langues: ['Français', 'Anglais', 'Arabe'],
    telephone: '01 44 XX XX XX',
    doctolib: 'https://www.doctolib.fr/sexologie',
  },
  {
    id: 'lucie-deschamps',
    prenom: 'Lucie',
    nom: 'Deschamps',
    titre: 'Sexologue clinicien·ne (SNSC)',
    labels: ['SNSC'],
    ville: 'Nantes',
    departement: 'Pays de la Loire',
    bio: "Sexologue clinicienne (SNSC), je travaille avec des adultes — jeunes adultes compris — sur le vaginisme, les douleurs lors de la pénétration, et les questions autour de la sexualité naissante à l'âge adulte. Je suis convaincue que l'éducation sexuelle continue tout au long de la vie, et j'adapte mon vocabulaire et mon approche à chaque personne.",
    specialites: [
      'Vaginisme',
      'Douleurs à la pénétration',
      'Première expérience sexuelle (adultes)',
      'Anorgasmie',
      'Éducation à la sexualité adulte',
      'Trouble du désir (homme ou femme)',
    ],
    approches: ['TCC', 'Hypnose éricksonnienne', 'Sexothérapie intégrative'],
    publics: ['Femmes', 'Hommes', 'Jeunes adultes (18+)'],
    consultation: 'les deux',
    tarifPremiere: 65,
    tarifSuivi: 55,
    dureeMinutes: 55,
    remboursementSS: false,
    langues: ['Français'],
    telephone: '02 40 XX XX XX',
  },
  {
    id: 'paul-mercier',
    prenom: 'Paul',
    nom: 'Mercier',
    titre: 'Sexologue & thérapeute de couple',
    labels: ['SNSC'],
    ville: 'Rennes',
    departement: 'Bretagne',
    bio: "Sexologue et thérapeute de couple (15 ans d'expérience), je reçois des couples traversant des difficultés sexuelles ou relationnelles : perte de désir, problèmes d'érection ou de lubrification, divergences sur les pratiques souhaitées — fréquence des rapports, fellation, sodomie, pratiques que l'un propose et l'autre refuse — et les questions autour de l'infidélité. Mon approche : aider le couple à reconstruire une communication intime, sans imposer de norme.",
    specialites: [
      'Thérapie de couple',
      'Désaccord de désir dans le couple',
      'Divergence sur les pratiques sexuelles',
      'Infidélité et reconstruction de la confiance',
      'Communication intime et sexuelle',
      'Prise en charge du couple après un trauma',
    ],
    approches: ['Thérapie systémique', 'Thérapie de couple Gottman', 'Médiation relationnelle'],
    publics: ['Couples', 'Tous genres et orientations'],
    consultation: 'les deux',
    tarifPremiere: 80,
    tarifSuivi: 70,
    tarifCouple: 110,
    dureeMinutes: 60,
    remboursementSS: false,
    langues: ['Français'],
    telephone: '02 99 XX XX XX',
  },
];

export const ALL_SPECIALITES = Array.from(
  new Set(SEXOLOGUES.flatMap((s) => s.specialites)),
).sort();

export const ALL_DEPARTEMENTS = Array.from(
  new Set(SEXOLOGUES.map((s) => s.departement)),
).sort();
