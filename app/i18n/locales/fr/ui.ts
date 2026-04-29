export const ui = {
  nav: {
    back: 'Retour',
    close: 'Fermer',
    or: 'ou',
  },

  headers: {
    personalSpace: 'Mon Espace',
    duoSpace: 'Notre Espace',
    learn: 'Comprendre',
    help: 'Aide',
    settings: 'Paramètres',
    resourcesMinor: 'Comprendre',
    pornoVsRealite: 'Porno vs. Réalité',
    loi: 'La Loi',
    quiz: 'Quiz',
    accompagnement: 'Je me pose des questions',
    accompagnementAdulte: 'Soutien & accompagnement',
    annuaireSexologues: 'Annuaire sexologues',
    games: 'Jeux',
    jeuDes: 'Le Dé du Consentement',
    jeuOie: "Jeu de l'Oie",
    jeuCartes: 'Cartes à tirer',
    hallOfCards: 'Ma Collection',
    defaultAdult: 'Mon Espace',
    defaultMinor: 'Espace Éducatif',
    personalSubtitle: 'Profil de confort',
    duoSubtitle: 'Dialogue à deux',
  },

  ad: {
    label: 'Publicité',
    removeCta: 'Retirer les pubs',
    placeholder: 'Espace publicitaire',
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
      desc: 'Choisir la langue de l\'application',
    },
    theme: {
      title: 'Thème',
      desc: 'Changer l\'ambiance visuelle',
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
      activeDesc: 'Contenu explicite activé',
      on: 'Activé',
      modal: {
        title: 'Contenu explicite',
        body: 'Ce mode débloque des contenus sexuellement explicites — fellation, cunnilingus, actes sexuels décrits sans ambiguité.\n\nRéservé aux adultes consentants. Assurez-vous d\'être dans un environnement approprié.',
        confirm: 'Activer le mode explicite',
        cancel: 'Annuler',
      },
    },
    replayIntro: {
      title: 'Revoir l\'introduction',
      desc: 'Refaire les slides de présentation',
    },
    reset: {
      title: 'Réinitialiser l\'app',
      desc: 'Effacer toutes les données locales',
      confirm: 'Toutes tes données locales seront effacées. Cette action est irréversible.',
      cta: 'Réinitialiser',
      cancel: 'Annuler',
    },
  },

  themeSelect: {
    title: 'Choisis ton ambiance',
    subtitle: 'Tu pourras changer à tout moment',
  },

  devBar: {
    home: 'Accueil',
    modeMinor: 'Mode Ado',
    modeAdult: 'Mode Adulte',
    premiumOn: 'Premium ON',
    premium: 'Premium',
    reset: 'Reset',
    demo: 'Mode démo — Navigation libre',
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
    quiz:          { title: 'Quiz Consentement',         desc: '8 questions pour tester ce que tu sais vraiment' },
    porno:         { title: 'Porno vs Réalité',           desc: 'Ce que les films ne te montrent pas' },
    loi:           { title: 'La loi & le consentement',   desc: "Tes droits, l'âge légal, ce qui est un crime" },
    pratiques:     { title: 'Pratiques avancées',         desc: 'Module rédigé par notre juriste — à venir' },
    accompagnement:{ title: 'Je me questionne',           desc: 'Des questions à se poser. Sans jugement.' },
  },

  moi: {
    defaultName:      'Mon espace',
    personalSpaceDesc:'Explorer mes zones de confort',
    duoSpaceDesc:     'Dialoguer avec mon/ma partenaire',
    helpDesc:         'Numéros gratuits, anonymes, disponibles 24h/24',
    settingsDesc:     'Thème, langue, données personnelles',
    premiumDesc:      'Tous les jeux · contenus profonds · sans limite',
    accompagnementAdulteDesc: 'Tu traverses quelque chose ? Des ressources confidentielles.',
    annuaireDesc: 'Trouver un·e professionnel·le — présentiel ou téléconsultation',
  },
} as const;
