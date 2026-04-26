export const onboarding = {
  welcome: {
    tagline: 'Learn. Understand. Decide.',
    description: "Porn doesn't teach you about consent. We're here for that — no taboo, no judgment.",
    pillars: {
      consent: 'Consent',
      education: 'Education',
      dialogue: 'Dialogue',
    },
    cta: 'Get started',
    privacy: "100% private — nothing is recorded without your consent",
    appName: 'Consentement',
    legalBadge: 'Created with a criminal lawyer',
  },

  ageCheck: {
    title: 'How old are you?',
    subtitle: 'The experience adapts to your age',
    minor: {
      title: "I'm under 18",
      desc: 'Educational access, no account required',
    },
    adult: {
      title: "I'm 18 or older",
      desc: 'Full access with authentication',
    },
    privacy: "This information stays on your device and is never shared",
  },

  auth: {
    title: 'Secure login',
    subtitle: 'To protect your identity and verify your age',
    nameLabel: 'What should we call you?',
    namePlaceholder: 'Your first name...',
    namePrivacy: 'This name stays on your device only',
    nameRequired: 'Enter your name to continue',
    btnConnect: 'Sign in with FranceConnect',
    btnContinue: 'Continue',
    demoNote: 'Simulation — In production, redirects to FranceConnect',
    why: {
      title: 'Why FranceConnect?',
      reason1: 'Verifies your age',
      reason2: 'No password to create',
      reason3: 'Your identity stays protected',
    },
    badges: {
      encrypted: 'Encrypted',
      rgpd: 'GDPR',
      official: 'Official',
    },
  },
} as const;
