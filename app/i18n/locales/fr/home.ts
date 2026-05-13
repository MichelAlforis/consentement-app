export const home = {
  tabs: {
    home: 'Accueil',
    learn: 'Apprendre',
    play: 'Jouer',
    me: 'Moi',
  },

  homeMinor: {
    badge: 'Espace Jeune',
    title: "Ce qu'on ne t'apprend pas à l'école",
    subtitle: 'Sans tabou. Sans jugement. Juste les vraies infos.',
    privacy: 'Cet espace est 100% privé',
    cards: {
      learn: {
        title: 'Comprendre',
        desc: 'Sexualité, quiz et la loi — les vraies infos',
      },
      guide: {
        title: 'Je me questionne',
        desc: 'Des questions à se poser. Sans jugement.',
      },
      help: {
        title: 'Aide & Urgences',
        desc: 'Numéros gratuits, anonymes, disponibles 24h/24',
      },
      games: {
        title: 'Jeux',
        desc: '1 gratuit · 2 jeux premium',
      },
    },
    resources: {
      porno: {
        title: 'Sexe vs. Réalité',
        desc: "Ce que les films ne te montrent pas",
        tag: 'Essentiel',
      },
      quiz: {
        title: 'Quiz Consentement',
        desc: '8 questions pour tester ce que tu sais vraiment',
        tag: 'Quiz',
      },
      loi: {
        title: 'La loi & le consentement',
        desc: "Tes droits, l'âge légal, ce qui est un crime",
        tag: 'Important',
      },
    },
  },

  homeAdult: {
    greeting: 'Bonjour {name}',
    subtitle: 'Explore ton profil de confort ou connecte-toi avec ton/ta partenaire.',
    menu: {
      personal: { title: 'Mon Espace', desc: 'Explorer mes zones de confort' },
      duo: { title: 'Notre Espace', desc: 'Dialoguer avec mon/ma partenaire' },
      games: { title: 'Jeux', desc: '1 gratuit · 2 jeux premium' },
      resources: { title: 'Ressources', desc: 'Guides et informations' },
    },
    collection: {
      title: 'Ma Collection',
      empty: 'Complète un module pour débloquer tes premières cartes',
      count: '{owned} / {total} cartes débloquées',
    },
    privacy: 'Tes données sont chiffrées et tu peux les supprimer à tout moment.',
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
      moduleCount: '{progress} / {total} modules',
      cardsOne: '1 carte débloquée',
      cardsPlural: '{count} cartes débloquées',
      nextModuleLabel: 'Prochain module',
    },
    mastery: {
      collectionOne: '1 carte débloquée',
      collectionPlural: '{count} cartes débloquées',
      rareOne: '1 rare',
      rarePlural: '{count} rares',
      uniqueOne: '1 unique',
      uniquePlural: '{count} uniques',
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
  heat: {
    tiede: 'Tiède',
    chaud: 'Chaud',
    ardent: 'Ardent',
    brulant: 'Brûlant',
    incandescent: 'Incandescent',
    points_to_next: '{n} pts pour {palier}',
    max_reached: 'Niveau max atteint',
    palierUp: 'Palier {palier} atteint !',
    palierUp_cta: 'Continuer',
    palierUp_explicit: 'Le contenu explicite est maintenant débloqué 🔥',
    palierUp_scenarios: 'Mode Scénario — bientôt disponible',
    palierUp_kamasutra: 'Gamme Kamasutra — bientôt disponible',
    palierUp_expert: 'Cartes Expert — bientôt disponibles',
    fomo_scenarios: 'Mode Scénario',
    fomo_kamasutra: 'Gamme Kamasutra',
    fomo_expert: 'Cartes Expert',
    fomo_pts: '{n} pts pour débloquer',
  },
} as const;
