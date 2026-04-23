export const home = {
  homeMinor: {
    badge: 'Youth Space',
    title: "What they don't teach you at school",
    subtitle: 'No taboo. No judgment. Just real info.',
    privacy: 'This space is 100% private',
    cards: {
      learn: {
        title: 'Understand',
        desc: 'Porn, quiz and the law — real information',
      },
      guide: {
        title: 'I have questions',
        desc: 'Questions to ask yourself. No judgment.',
      },
      help: {
        title: 'Help & Emergencies',
        desc: 'Free, anonymous numbers, available 24/7',
      },
      games: {
        title: 'Games',
        desc: '1 free · 2 premium games',
      },
    },
    resources: {
      porno: {
        title: 'Porn vs. Reality',
        desc: "What movies don't show you",
        tag: 'Essential',
      },
      quiz: {
        title: 'Consent Quiz',
        desc: '8 questions to test what you really know',
        tag: 'Quiz',
      },
      loi: {
        title: 'The law & consent',
        desc: 'Your rights, legal age, what is a crime',
        tag: 'Important',
      },
    },
  },

  homeAdult: {
    greeting: 'Hello {name}',
    subtitle: 'Explore your comfort profile or connect with your partner.',
    menu: {
      personal: { title: 'My Space', desc: 'Explore my comfort zones' },
      duo: { title: 'Our Space', desc: 'Talk with my partner' },
      games: { title: 'Games', desc: '1 free · 2 premium games' },
      resources: { title: 'Resources', desc: 'Guides and information' },
    },
    privacy: 'Your data is encrypted and you can delete it anytime.',
  },
} as const;
