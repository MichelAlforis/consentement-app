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
    legalSheet: {
      title: 'Verified by a lawyer',
      role: 'Criminal law · Consent specialist',
      bio: "All educational content has been reviewed and validated by a lawyer specializing in criminal consent law. Our commitment: reliable, accurate, and legally sound information.",
      close: 'Close',
    },
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
      desc: 'Full access, maximum personalisation',
    },
    privacy: "This information stays on your device and is never shared",
  },

  auth: {
    title: 'What should we call you?',
    subtitle: 'A first name is enough — it stays on your device',
    nameLabel: 'What should we call you?',
    namePlaceholder: 'Your first name...',
    namePrivacy: 'This name stays on your device only',
    nameRequired: 'Enter your name to continue',
    btnContinue: 'Continue',
    pronounsLabel: 'Pronouns (optional)',
    pronounOptions: {
      il: 'he/him',
      elle: 'she/her',
      iel: 'they/them',
      neutre: 'neutral',
    },
  },

  language: {
    title: 'Choose your language',
    subtitle: 'You can change it anytime in settings',
    cta: 'Continue',
  },

  personalIntro: {
    title: 'Your personal space',
    subtitle: 'Tell us what feels right. You can adjust anytime.',
    tenderness: 'Tenderness',
    intensity: 'Intensity',
    trust: 'Trust',
    ctaNow: 'Personalise now',
    ctaLater: 'Set up later',
  },
  skip: 'Skip',
  next: 'Next',
  finish: 'Got it · See my cards',
} as const;
