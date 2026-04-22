export const home = {
  homeMinor: {
    badge: 'Espace Jeune',
    title: "Ce qu'on ne t'apprend pas à l'école",
    subtitle: 'Sans tabou. Sans jugement. Juste les vraies infos.',
    section1: 'Comprendre ce que tu vois',
    section2: 'Ce que dit la loi',
    section3: 'Tu te poses des questions ?',
    privacy: 'Cet espace est 100% privé',
    modules: {
      porno: {
        title: 'Porno vs. Réalité',
        desc: "Ce que le porno montre et ce que c'est vraiment",
        tag: 'Essentiel',
      },
      quiz: {
        title: 'Quiz — Je comprends le consentement',
        desc: '8 questions pour tester ce que tu sais vraiment',
        tag: 'Gratuit',
      },
      dice: {
        title: 'Le Dé du Consentement',
        desc: 'Tire une pratique au hasard et découvre ce que le consentement implique',
        tag: 'Jeu',
      },
      loi: {
        title: 'La loi et le consentement',
        desc: "L'âge légal, ce qui est un crime, tes droits",
        tag: 'Important',
      },
      guide: {
        title: 'Je veux avoir un rapport',
        desc: 'Des questions à se poser avant. Sans jugement.',
      },
      help: {
        title: 'Aide & Ressources',
        desc: 'Numéros gratuits, anonymes, disponibles 24h/24',
      },
    },
  },

  homeAdult: {
    greeting: 'Bonjour {name}',
    subtitle: 'Explore ton profil de confort ou connecte-toi avec ton/ta partenaire.',
    menu: {
      personal: { title: 'Mon Espace', desc: 'Explorer mes zones de confort' },
      duo: { title: 'Notre Espace', desc: 'Dialoguer avec mon/ma partenaire' },
      games: { title: 'Jeux', desc: 'Explorer le consentement en jouant' },
      resources: { title: 'Ressources', desc: 'Guides et informations' },
    },
    privacy: 'Tes données sont chiffrées et tu peux les supprimer à tout moment.',
  },
} as const;
