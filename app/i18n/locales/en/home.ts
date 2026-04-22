export const home = {
  homeMinor: {
    badge: 'Youth Space',
    title: "What they don't teach you at school",
    subtitle: 'No taboo. No judgment. Just real info.',
    section1: 'Understand what you see',
    section2: 'What the law says',
    section3: 'Do you have questions?',
    privacy: 'This space is 100% private',
    modules: {
      porno: {
        title: 'Porn vs. Reality',
        desc: 'What porn shows and what it really is',
        tag: 'Essential',
      },
      quiz: {
        title: 'Quiz — I understand consent',
        desc: '8 questions to test what you really know',
        tag: 'Free',
      },
      dice: {
        title: 'The Consent Die',
        desc: 'Draw a random activity and discover what consent means',
        tag: 'Game',
      },
      loi: {
        title: 'The law and consent',
        desc: 'Legal age, what is a crime, your rights',
        tag: 'Important',
      },
      guide: {
        title: 'I want to have sex',
        desc: 'Questions to ask yourself first. No judgment.',
      },
      help: {
        title: 'Help & Resources',
        desc: 'Free, anonymous numbers, available 24/7',
      },
    },
  },

  homeAdult: {
    greeting: 'Hello {name}',
    subtitle: 'Explore your comfort profile or connect with your partner.',
    menu: {
      personal: { title: 'My Space', desc: 'Explore my comfort zones' },
      duo: { title: 'Our Space', desc: 'Talk with my partner' },
      games: { title: 'Games', desc: 'Explore consent through play' },
      resources: { title: 'Resources', desc: 'Guides and information' },
    },
    privacy: 'Your data is encrypted and you can delete it anytime.',
  },
} as const;
