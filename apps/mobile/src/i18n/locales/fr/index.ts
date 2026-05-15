// BARREL — ne jamais transformer en export * glob (R7)
import { games } from './games';
import { moduleDeBase } from './moduleDeBase';
import { pratiquesBase } from './pratiquesBase';
import { pratiquesAvancees } from './pratiquesAvancees';
import { pratiquesExplicit } from './pratiquesExplicit';
import { lexiqueConsent } from './lexiqueConsent';
import { scenariosQuotidiens } from './scenariosQuotidiens';
import { bdsmConsent } from './bdsmConsent';
import { sexting } from './sexting';
import { pressionManip } from './pressionManip';
import { ruptureHarcele } from './ruptureHarcele';
import { contentNonConsenti } from './contentNonConsenti';
import { zonesGrises } from './zonesGrises';
import { lgbtqConsent } from './lgbtqConsent';
import { alcoolConsent } from './alcoolConsent';

export const fr = {
  ...games,
  ...moduleDeBase,
  ...pratiquesBase,
  ...pratiquesAvancees,
  ...pratiquesExplicit,
  ...lexiqueConsent,
  ...scenariosQuotidiens,
  ...bdsmConsent,
  ...sexting,
  ...pressionManip,
  ...ruptureHarcele,
  ...contentNonConsenti,
  ...zonesGrises,
  ...lgbtqConsent,
  ...alcoolConsent,
  welcome: {
    appName: 'OuiClair',
    tagline: 'Apprendre. Comprendre. Décider.',
    description: "Les films pour adultes ne t'apprennent pas le consentement. On est là pour ça — sans tabou, sans jugement.",
  },
  ageCheck: {
    title: 'Quel âge as-tu ?',
    minor: {
      title: "J'ai moins de 18 ans",
      desc: 'Accès éducatif, aucun compte requis',
    },
    adult: {
      title: "J'ai 18 ans ou plus",
      desc: 'Accès complet, personnalisation maximale',
    },
    privacy: "Cette information reste sur ton appareil et n'est jamais partagée",
  },
  themeSelect: {
    title: 'Choisis ton ambiance',
    subtitle: 'Tu pourras changer à tout moment',
  },
  auth: {
    title: "Comment t'appelle-t-on ?",
    subtitle: 'Un prénom suffit — il reste sur ton appareil',
    nameLabel: "Comment veux-tu qu'on t'appelle ?",
    namePlaceholder: 'Ton prénom...',
    namePrivacy: 'Ce prénom reste sur ton appareil uniquement',
    nameRequired: 'Entre ton prénom pour continuer',
    btnContinue: 'Continuer',
    pronounsLabel: 'Pronoms (optionnel)',
    pronounOptions: {
      il: 'il/lui',
      elle: 'elle',
      iel: 'iel',
      neutre: 'neutre',
    },
  },
  language: {
    title: 'Choisis ta langue',
    subtitle: 'Tu pourras changer à tout moment dans les paramètres',
  },
  onboarding: {
    skip: 'Passer',
  },
  ficheSection: {
    definition: 'Définition',
    consentement: 'Consentement',
    loi: 'Ce que dit la loi',
    question: 'Question à se poser',
  },
  nav: {
    previous: 'Précédent',
    next: 'Suivant',
    finish: 'Terminer',
  },
  premium: {
    gateMessage: 'Ce contenu est réservé aux membres Premium',
    unlockCta: 'Débloquer Premium',
    title: 'Passer à Premium',
    subtitle: 'Accédez à tout le contenu exclusif, sans limites.',
    cta: 'Commencer — 4,99 € / mois',
    themesNote: "Les thèmes premium font partie de l'abonnement",
    purchasing: 'Traitement en cours…',
    restore: 'Restaurer mes achats',
    restoring: 'Restauration…',
    errorTitle: 'Achat impossible',
    errorMessage: "L'achat n'a pas pu aboutir. Vérifie ta connexion ou réessaie.",
    restoreErrorTitle: 'Restauration impossible',
    restoreErrorMessage: 'Aucun achat trouvé pour ce compte.',
    features: [
      { label: 'Contenu explicite débloqué' },
      { label: 'Toutes les positions Kamasutra' },
      { label: 'Jeux premium sans restriction' },
      { label: 'Nouvelles cartes chaque mois' },
    ],
  },
  tab: {
    home: 'Accueil',
    apprendre: 'Apprendre',
    jeux: 'Jeux',
    moi: 'Moi',
  },
  tabs: {
    home: 'Accueil',
    learn: 'Apprendre',
    games: 'Jeux',
    me: 'Moi',
  },
  headers: {
    personalSpace: 'Mon Espace',
    duoSpace: 'Notre Espace',
    learn: 'Comprendre',
    help: 'Aide',
    settings: 'Paramètres',
    accompagnementAdulte: 'Soutien & accompagnement',
    annuaireSexologues: 'Annuaire sexologues',
  },
  settings: {
    sections: {
      profile: 'Mon profil',
      appearance: 'Apparence',
      content: 'Contenu',
      app: 'App',
    },
    profile: {
      name: 'Prénom',
      namePlaceholder: 'Ton prénom',
      pronouns: 'Pronoms',
      pronounsOptional: '(optionnel)',
      pronounOptions: {
        il: 'il/lui',
        elle: 'elle',
        iel: 'iel',
        neutre: 'neutre',
      },
      personalSpace: 'Mon espace perso',
      personalSpaceDesc: 'Profil de confort et mot de sécurité',
    },
    language: {
      title: 'Langue',
      desc: "Choisir la langue de l'application",
    },
    theme: {
      title: 'Thème',
      desc: "Changer l'ambiance visuelle",
    },
    help: {
      title: 'Aide & Urgences',
      desc: 'Numéros utiles, ressources disponibles 24h/24',
    },
    premium: {
      title: 'Passer Premium',
      desc: 'Tous les jeux + zéro publicité',
    },
    premiumActive: {
      title: 'Premium actif',
      desc: 'Tous les contenus débloqués, sans publicité',
    },
    explicit: {
      title: 'Mode Explicite',
      desc: 'Débloquer le contenu sexuellement explicite',
    },
    replayIntro: {
      title: "Revoir l'introduction",
      desc: 'Refaire les slides de présentation',
    },
    reset: {
      title: "Réinitialiser l'app",
      desc: 'Effacer toutes les données locales',
      confirm: 'Toutes tes données locales seront effacées. Cette action est irréversible.',
      cta: 'Réinitialiser',
      cancel: 'Annuler',
    },
    deleteAccount: {
      title: 'Supprimer mon compte',
      desc: 'RGPD — supprime toutes tes données définitivement',
      confirmTitle: 'Supprimer mes données ?',
      confirmBody: 'Cette action supprime définitivement toutes tes données personnelles (profil, progression, cartes, préférences). Conforme au droit de suppression RGPD (art. 17). Irréversible.',
      cta: 'Supprimer définitivement',
      cancel: 'Annuler',
    },
  },
  moi: {
    defaultName: 'Mon espace',
    personalSpaceDesc: 'Explorer mes zones de confort',
    duoSpaceDesc: 'Dialoguer avec mon/ma partenaire',
    helpDesc: 'Numéros gratuits, anonymes, disponibles 24h/24',
    settingsDesc: 'Thème, langue, données personnelles',
    premiumDesc: 'Tous les jeux · contenus profonds · sans limite',
    accompagnementAdulteDesc: 'Tu traverses quelque chose ? Des ressources confidentielles.',
    annuaireDesc: 'Trouver un·e professionnel·le — présentiel ou téléconsultation',
    heatTitle: 'Mon Baromètre',
    prefSection_title: 'Comment je me sens',
    prefSection_empty: 'Les questions apparaîtront au fil de ton parcours',
  },
  homeAdult: {
    subtitle: 'Explore ton profil de confort ou connecte-toi avec ton/ta partenaire.',
    collection: {
      title: 'Ma Collection',
      empty: 'Complète un module pour débloquer tes premières cartes',
    },
  },
  homeMinor: {
    badge: 'Espace Jeune',
    title: "Ce qu'on ne t'apprend pas à l'école",
    subtitle: 'Sans tabou. Sans jugement. Juste les vraies infos.',
  },
  homeV3: {
    discovery: {
      ctaAdult: 'Commence ton parcours',
      ctaMinor: 'Explore les modules',
      ctaDesc: 'Chaque module complété débloque des cartes',
      fomoTitle: "Ta collection t'attend",
      fomoDesc: 'Module de base → 24 cartes · Quiz → 1 carte · Loi → 1 rare…',
    },
    learning: {
      progressLabel: 'Progression',
      nextModuleLabel: 'Prochain module',
    },
    mastery: {
      collectionOne: '1 carte débloquée',
      rareOne: '1 rare',
      uniqueOne: '1 unique',
      viewCollection: 'Voir ta collection →',
      duoTitle: 'Notre Espace',
      duoDesc: 'Joue avec tes cartes débloquées en duo',
      goFurther: 'Aller plus loin',
    },
    modules: {
      'porno-vs-realite': 'Sexe vs. Réalité',
      'quiz-consentement': 'Quiz Consentement',
      'loi-consentement': 'La loi & le consentement',
      'duo-flow': 'Duo Flow',
      'accompagnement-mineur': 'Je me questionne',
    },
  },
  jeux: {
    subtitle: 'Explorer, découvrir, dialoguer.',
    dice:  { title: 'Le Dé du Consentement', desc: 'Solo ou à deux — 6 catégories, 3 niveaux' },
    cards: { title: 'Cartes à tirer',         desc: '48 cartes — 6 thèmes, solo ou à deux' },
    goose: { title: "Jeu de l'Oie",           desc: 'À deux · 24 cases · plateau narratif avec le dé du consentement' },
    available: 'Disponible',
    premium: 'Premium',
  },
  help: {
    title: 'Aide & Urgences',
    subtitle: 'Numéros gratuits, anonymes, disponibles 24h/24',
    faq: [
      {
        question: "Qu'est-ce que le consentement ?",
        answer: "Le consentement est un accord libre, éclairé, enthousiaste et révocable. Il doit être donné sans pression, sans alcool et sans contrainte.",
      },
      {
        question: "Que faire si je me sens mal à l'aise ?",
        answer: "Tu peux dire non à tout moment, même si tu avais dit oui avant. Ton confort prime toujours. En cas de danger, appelle le 3919 (gratuit, 24h/24).",
      },
      {
        question: "Où trouver de l'aide ?",
        answer: "Violences sexuelles ou conjugales : 3919 · Détresse psychologique : 3114 · Urgences : 15, 17 ou 18. Tous les numéros sont gratuits et anonymes.",
      },
    ],
  },
  quizMl: {
    ui: {
      hubTitle: 'Quiz Multi-Niveaux',
      hubSubtitle: 'Testez vos connaissances, niveau par niveau',
    },
  },
  apprendre: {
    subtitleEmpty: 'Chaque module complété débloque des cartes pour tes jeux.',
    subtitleOne: '1 / {{total}} module complété',
    subtitleMany: '{{count}} / {{total}} modules complétés',
    rewardPrefix: 'Récompense : ',
    rarityCommon: 'commune',
    rarityRare: 'rare',
    rarityUnique: 'unique',
    rewardCommon: '1 carte commune',
    rewardRare: '1 carte rare',
    rewardUnique: '1 carte unique',
    rewardBase: '24 cartes communes',
    allDone: 'Parcours complété !',
    allDoneSub: 'Tu as exploré tout le contenu disponible. Maintenant, joue !',
    heatRequired: 'Palier {{palier}} requis · {{pts}} pts',
    heatPoints: '+{{n}} pts',
    heatPointsEarned: '✓ {{n}} pts',
    base:                { title: 'Introduction au consentement' },
    porno:               { title: 'Sexe vs. Réalité',              desc: 'Ce que les films ne te montrent pas' },
    quiz:                { title: 'Quiz Consentement',             desc: '8 questions pour tester ce que tu sais vraiment' },
    loi:                 { title: 'La loi & le consentement',      desc: "Tes droits, l'âge légal, ce qui est un crime" },
    pratiques:           { title: 'Pratiques avancées',            desc: 'Module rédigé par notre juriste — à venir' },
    accompagnement:      { title: 'Je me questionne',              desc: 'Des questions à se poser. Sans jugement.' },
    pratiquesBase:       { title: 'Pratiques de base',             desc: 'Fellation, cunnilingus, masturbation, pénétration — consentement & loi' },
    lexique:             { title: 'Lexique du consentement',       desc: '20 termes essentiels à connaître — +1 pt de chaleur par terme' },
    scenariosQuotidiens: { title: 'Scénarios du quotidien',        desc: '4 situations réelles — pression, alcool, silence, couple' },
    alcoolConsent:       { title: 'Alcool & consentement',         desc: "Quiz + ce que dit la loi sur l'ivresse et le consentement" },
    bdsmConsent:         { title: 'BDSM & consentement',           desc: '7 idées reçues sur les pratiques consensuelles' },
    sexting:             { title: 'Sexting & images intimes',      desc: "Ce qu'on croit vs. ce qui se passe vraiment" },
    pressionManip:       { title: 'Pression & manipulation',       desc: "Reconnaître ce qui ressemble à du consentement mais n'en est pas" },
    ruptureHarcele:      { title: 'Rupture & harcèlement',         desc: 'Ce que la loi protège après une relation' },
    contentNonConsenti:  { title: 'Contenu non consenti',          desc: 'Images & vidéos intimes partagées sans accord — tes droits' },
    pratiquesExplicit:   { title: 'Pratiques explicites',          desc: "Communication avant, pendant et après — ce qu'on ne dit pas" },
    zonesGrises:         { title: 'Zones grises',                  desc: "Les situations où la réponse n'est pas évidente" },
    lgbtqConsent:        { title: 'LGBTQ+ & consentement',        desc: '7 mythes sur l\'orientation sexuelle et le consentement' },
    pratiquesAvancees:   { title: 'Pratiques avancées',            desc: 'Bondage, jeux de rôle, exploration — cadre et limites' },
  },
  heat: {
    tiede: 'Tiède',
    chaud: 'Chaud',
    ardent: 'Ardent',
    brulant: 'Brûlant',
    incandescent: 'Incandescent',
  },
  duo: {
    title: 'Notre Espace',
    createSession: 'Créer une session',
    createSessionDesc: 'Génère un QR code — ton partenaire le scanne',
    join: 'Rejoindre',
    joinDesc: 'Scanne le QR de ton partenaire',
    scanQRBtn: 'Scanner le QR code',
    manualCode: 'Entrer le code manuellement',
    scanQRHint: 'Pointe la caméra vers le QR code de ton partenaire',
    shareCode: 'Ou partage le code manuellement',
    waiting: 'En attente de ton partenaire…',
    waitingSub: 'Dès qu\'il scanne le code, vous serez connectés',
    connected: 'Partenaire connecté !',
    connectedSub: 'Vos profils de confort sont synchronisés',
    disconnect: 'Terminer la session',
    enterCode: 'Code à 6 caractères',
    cancel: 'Annuler',
    loading: 'Connexion…',
    permissionDenied: 'Caméra non autorisée — entre le code manuellement',
    errorInvalidCode: 'Code invalide ou introuvable',
    errorExpired: 'Cette session a expiré',
    errorNetwork: 'Connexion impossible. Vérifie ta connexion.',
    bump: {
      title: 'Rapprochez vos téléphones',
      desc: 'Synchronisation automatique — aucun geste requis',
      tag: 'Recommandé',
      instruction: 'Restez sur cet écran',
      sub: 'La connexion est automatique quand votre partenaire ouvre le même écran',
      searching: 'Recherche en cours…',
      useQr: 'Utiliser le QR code',
      retry: 'Réessayer',
      timeoutTitle: 'Partenaire introuvable',
      timeoutSub: 'Pas de souci, essayons le QR code.',
    },
  },

  levels: {
    '0': 'Non',
    '1': 'Attends',
    '2': 'Curieux·se',
    '3': 'OK',
    '4': "J'adore",
  } as Record<string, string>,

  loiConsentement: {
    title: 'La loi & le consentement',
    intro: "En France, le droit pénal protège toute personne contre les atteintes sexuelles non consenties. Voici les points essentiels à connaître.",
    article0: {
      titre: "Âge légal du consentement",
      texte: "En France, l'âge légal du consentement est 15 ans. Tout acte sexuel avec un·e mineur·e de moins de 15 ans par un adulte est un crime, quelle que soit la réponse du ou de la mineur·e.",
    },
    article1: {
      titre: "Ce qu'est le consentement",
      texte: "Le consentement doit être libre, éclairé et révocable à tout moment. Un oui donné sous pression, sous l'emprise de l'alcool ou par peur n'est pas un consentement valide.",
    },
    article2: {
      titre: "Les sanctions encourues",
      texte: "Un viol est puni de 15 ans de réclusion (20 ans si la victime a moins de 15 ans). Une agression sexuelle est punie de 7 ans d'emprisonnement (10 ans sur mineur·e de moins de 15 ans).",
    },
  },

  pornoVsRealite: {
    title: 'Sexe vs. Réalité',
    intro: "Les films pour adultes sont des fictions tournées avec des acteurs. Ce que tu vois n'est pas représentatif d'une vraie relation — ni sur le plan du consentement, ni sur celui de la communication.",
    section0: {
      title: 'La mise en scène',
      body: "Les productions pornographiques utilisent des scripts, des éclairages et des montages. Rien n'est spontané. Imiter ce qu'on voit peut être dangereux ou irréaliste.",
    },
    section1: {
      title: 'Le consentement invisible',
      body: "Dans ces films, la négociation du consentement n'est jamais montrée. Dans la réalité, parler de ses envies et de ses limites est essentiel — et tout à fait normal.",
    },
    section2: {
      title: 'Corps et standards',
      body: "Les corps montrés dans ces films sont souvent très éloignés de la réalité. Chaque corps est différent. Se comparer n'aide pas — et n'a aucun sens.",
    },
  },

  accompagnementMineur: {
    title: 'Soutien & ressources',
    subtitle: "Tu n'es pas seul·e. Des professionnels formés sont là pour t'écouter, gratuitement et en toute confidentialité.",
    items: {
      '0': 'Fil Santé Jeunes — 0 800 235 236 (gratuit, anonyme)',
      '1': 'Planning Familial — 0 800 08 11 11 (gratuit)',
      '2': 'Police / Gendarmerie — 17 (urgences)',
    } as Record<string, string>,
  },

  annuaire: {
    title: 'Sexologues partenaires',
    subtitle: "Des professionnels référencés pour t'accompagner — en présentiel ou en téléconsultation.",
    cardCta: 'Prendre rendez-vous',
  },

  resourcesMinor: {
    title: 'Ressources jeunes',
    subtitle: "Des numéros gratuits et anonymes pour parler à quelqu'un en qui tu peux avoir confiance.",
    item0: { name: 'Fil Santé Jeunes', desc: 'Santé, sexualité, bien-être — anonyme', phone: '0800235236' },
    item1: { name: 'Net Écoute', desc: 'Cyberharcèlement et problèmes en ligne', phone: '0800200000' },
    item2: { name: 'Police / Gendarmerie', desc: 'Urgences', phone: '17' },
  },

  quizHub: {
    title: 'Quiz Consentement',
    subtitle: '3 niveaux pour tester tes connaissances, à ton rythme.',
    levels: {
      '0': { label: 'Découverte', desc: 'Les bases du consentement — pour commencer' },
      '1': { label: 'Intermédiaire', desc: 'La loi, les situations complexes, les zones grises' },
      '2': { label: 'Expert', desc: 'Les nuances avancées — pour les plus curieux·ses' },
    },
  },

  quiz: {
    title: 'Quiz Consentement',
    result: 'Résultat',
    score: 'Chaque bonne réponse compte — relis les modules pour progresser.',
    back: 'Retour',
    q0:  { question: "Qu'est-ce qui définit un consentement valable ?", opt0: "Il est libre, éclairé, explicite et révocable", opt1: "C'est un accord donné une fois pour toutes", opt2: "Le silence vaut consentement si la personne ne dit pas non", opt3: "Il suffit d'un geste ou d'un sourire" },
    q1:  { question: "Une personne peut-elle retirer son consentement en cours de rapport ?", opt0: "Non, une fois commencé, on ne peut plus revenir en arrière", opt1: "Oui, à n'importe quel moment", opt2: "Seulement si elle donne une raison valable", opt3: "Oui, mais uniquement avant la pénétration" },
    q2:  { question: "Une personne ivre peut-elle donner un consentement valable ?", opt0: "Oui, si elle est juste légèrement alcoolisée", opt1: "Non, l'ivresse empêche un consentement libre et éclairé", opt2: "Oui, si elle le demande elle-même", opt3: "C'est subjectif selon le degré d'ivresse" },
    q3:  { question: "En France, quel est l'âge minimal de consentement sexuel fixé par la loi ?", opt0: "16 ans", opt1: "15 ans", opt2: "18 ans", opt3: "14 ans" },
    q4:  { question: "\"Si tu ne dis pas non, c'est oui.\" Cette affirmation est-elle correcte ?", opt0: "Oui, c'est la règle par défaut", opt1: "Non, le consentement doit être positif et actif", opt2: "Oui, sauf si la personne dit explicitement non", opt3: "Ça dépend du contexte et de la relation" },
    q5:  { question: "Ton partenaire a consenti la semaine dernière. Cela vaut-il pour aujourd'hui ?", opt0: "Oui, une relation établie implique un consentement continu", opt1: "Non, le consentement s'exprime à chaque moment", opt2: "Oui, tant que rien n'a changé dans la relation", opt3: "Oui, si vous êtes en couple depuis longtemps" },
    q6:  { question: "Partager une photo intime de quelqu'un sans son accord, c'est :", opt0: "Acceptable si vous aviez une relation", opt1: "Un délit pénal puni par la loi française", opt2: "Problématique mais pas illégal", opt3: "Ok si la photo a déjà été partagée avec d'autres" },
    q7:  { question: "Dans une relation BDSM, qu'est-ce qui est indispensable ?", opt0: "Que l'un des deux soit dominant par nature", opt1: "Un accord préalable clair, incluant limites et mot de sécurité", opt2: "Que personne ne soit blessé physiquement", opt3: "Qu'il n'y ait pas de pénétration" },
    q8:  { question: "\"Tu me fais une scène si je ne veux pas faire ça\" — cette phrase est :", opt0: "Un moyen légitime d'exprimer sa frustration", opt1: "Une pression qui invalide le consentement", opt2: "Normale dans une relation longue", opt3: "Acceptable si le couple a une dynamique forte" },
    q9:  { question: "Le consentement s'applique-t-il dans le mariage ?", opt0: "Non, le mariage implique un accord tacite permanent", opt1: "Oui, un·e conjoint·e peut toujours refuser un rapport", opt2: "Seulement si l'un des deux le demande expressément", opt3: "Non, ça reste une affaire privée" },
    q10: { question: "Envoyer un message sexuel non sollicité, c'est :", opt0: "Anodin si tu le fais de façon sympa", opt1: "Une violation du consentement numérique", opt2: "Ok si vous vous connaissiez avant", opt3: "Un compliment qui peut mal passer" },
    q11: { question: "Une personne endormie peut-elle consentir ?", opt0: "Oui, si elle ne se réveille pas et ne dit rien", opt1: "Non, le consentement exige d'être conscient·e", opt2: "Oui, si elle avait consenti avant de s'endormir", opt3: "Ça dépend de la profondeur du sommeil" },
    q12: { question: "Un \"non\" hésitant ou incertain doit être interprété comme :", opt0: "Un \"oui\" qui cache une timidité", opt1: "Un refus, à respecter comme tel", opt2: "Une invitation à insister doucement", opt3: "Un signal ambigu à explorer" },
    q13: { question: "En France, forcer quelqu'un à un acte sexuel est qualifié de :", opt0: "Comportement déplacé", opt1: "Viol ou agression sexuelle — crime ou délit selon les actes", opt2: "Abus de faiblesse", opt3: "Voies de fait" },
    q14: { question: "Quel est le rôle d'un mot de sécurité ?", opt0: "Pimenter un jeu de rôle", opt1: "Signaler immédiatement l'arrêt d'une pratique, sans discussion", opt2: "Indiquer à l'autre qu'on veut changer de position", opt3: "C'est purement symbolique" },
  },
};

export type FrTranslations = typeof fr;
