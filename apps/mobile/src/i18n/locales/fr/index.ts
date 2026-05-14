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
  },
  apprendre: {
    subtitleEmpty: 'Chaque module complété débloque des cartes pour tes jeux.',
    subtitleOne: '1 / {total} module complété',
    subtitleMany: '{count} / {total} modules complétés',
    rewardPrefix: 'Récompense : ',
    rarityCommon: 'commune',
    rarityRare: 'rare',
    rarityUnique: 'unique',
    rewardCommon: '1 carte commune',
    rewardRare: '1 carte rare',
    rewardUnique: '1 carte unique',
    allDone: 'Parcours complété !',
    allDoneSub: 'Tu as exploré tout le contenu disponible. Maintenant, joue !',
    heatRequired: 'Palier {palier} requis · {pts} pts',
    heatPoints: '+{n} pts',
    heatPointsEarned: '✓ {n} pts',
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
  },
};

export type FrTranslations = typeof fr;
