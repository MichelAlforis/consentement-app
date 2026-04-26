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
        desc: 'Porno, quiz et la loi — les vraies infos',
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
        title: 'Porno vs. Réalité',
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
} as const;
