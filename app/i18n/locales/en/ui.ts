export const ui = {
  nav: {
    back: 'Back',
    close: 'Close',
    or: 'or',
  },

  headers: {
    personalSpace: 'My Space',
    duoSpace: 'Our Space',
    learn: 'Learn',
    help: 'Help',
    settings: 'Settings',
    resourcesMinor: 'Understand',
    pornoVsRealite: 'Porn vs. Reality',
    loi: 'The Law',
    quiz: 'Quiz',
    accompagnement: 'I have questions',
    games: 'Games',
    jeuDes: 'The Consent Die',
    jeuOie: 'Goose Game',
    jeuCartes: 'Card Draw',
    hallOfCards: 'My Collection',
    defaultAdult: 'My Space',
    defaultMinor: 'Educational Space',
    personalSubtitle: 'Comfort profile',
    duoSubtitle: 'Dialogue for two',
  },

  ad: {
    label: 'Advertisement',
    removeCta: 'Remove ads',
    placeholder: 'Ad space',
  },

  settings: {
    language: {
      title: 'Language',
      desc: 'Choose the app language',
    },
    theme: {
      title: 'Theme',
      desc: 'Change the visual style',
    },
    help: {
      title: 'Help & Emergencies',
      desc: 'Useful numbers, resources available 24/7',
    },
    premium: {
      title: 'Go Premium',
      desc: 'All games + zero ads',
    },
    premiumActive: {
      title: 'Premium active',
      desc: 'All content unlocked, ad-free',
    },
    explicit: {
      title: 'Explicit Mode',
      desc: 'Unlock sexually explicit content',
      activeDesc: 'Explicit content enabled',
      on: 'Enabled',
      modal: {
        title: 'Explicit content',
        body: 'This mode unlocks sexually explicit content — oral sex, penetration, sexual acts described without ambiguity.\n\nFor consenting adults only. Make sure you are in an appropriate environment.',
        confirm: 'Enable explicit mode',
        cancel: 'Cancel',
      },
    },
  },

  themeSelect: {
    title: 'Choose your vibe',
    subtitle: 'You can change it anytime',
  },

  devBar: {
    home: 'Home',
    modeMinor: 'Teen Mode',
    modeAdult: 'Adult Mode',
    premiumOn: 'Premium ON',
    premium: 'Premium',
    reset: 'Reset',
    demo: 'Demo mode — Free navigation',
  },

  apprendre: {
    subtitleEmpty: 'Each completed module unlocks cards for your games.',
    subtitleOne: '1 / {total} module completed',
    subtitleMany: '{count} / {total} modules completed',
    rewardPrefix: 'Reward: ',
    rarityCommon: 'common',
    rarityRare: 'rare',
    rarityUnique: 'unique',
    rewardCommon: '1 common card',
    rewardRare: '1 rare card',
    rewardUnique: '1 unique card',
    quiz:          { title: 'Consent Quiz',        desc: '8 questions to test what you really know' },
    porno:         { title: 'Porn vs Reality',      desc: "What films don't show you" },
    loi:           { title: 'Law & Consent',        desc: 'Your rights, the legal age, what is a crime' },
    pratiques:     { title: 'Advanced Practices',   desc: 'Module written by our legal expert — coming soon' },
    accompagnement:{ title: 'I Have Questions',     desc: 'Questions to ask yourself. Without judgment.' },
  },

  moi: {
    defaultName:      'My space',
    personalSpaceDesc:'Explore my comfort zones',
    duoSpaceDesc:     'Talk with my partner',
    helpDesc:         'Free, anonymous numbers, available 24/7',
    settingsDesc:     'Theme, language, personal data',
    premiumDesc:      'All games · deep content · no limits',
  },
} as const;
