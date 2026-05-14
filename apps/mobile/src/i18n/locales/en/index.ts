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

export const en = {
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
    tagline: 'Learn. Understand. Decide.',
    description: "Adult films don't teach you about consent. We're here for that — no taboo, no judgment.",
  },
  ageCheck: {
    title: 'How old are you?',
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
  themeSelect: {
    title: 'Choose your vibe',
    subtitle: 'You can change it anytime',
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
  },
  onboarding: {
    skip: 'Skip',
  },
  ficheSection: {
    definition: 'Definition',
    consentement: 'Consent',
    loi: 'What the law says',
    question: 'Question to ask yourself',
  },
  nav: {
    previous: 'Previous',
    next: 'Next',
    finish: 'Finish',
  },
  premium: {
    gateMessage: 'This content is reserved for Premium members',
    unlockCta: 'Unlock Premium',
    title: 'Go Premium',
    subtitle: 'Access all exclusive content, without limits.',
    cta: 'Start — €4.99 / month',
    themesNote: 'Premium themes are part of the subscription',
    purchasing: 'Processing…',
    restore: 'Restore purchases',
    restoring: 'Restoring…',
    errorTitle: 'Purchase failed',
    errorMessage: 'The purchase could not be completed. Check your connection or try again.',
    restoreErrorTitle: 'Restore failed',
    restoreErrorMessage: 'No purchases found for this account.',
    features: [
      { label: 'Explicit content unlocked' },
      { label: 'All Kamasutra positions' },
      { label: 'Premium games without restriction' },
      { label: 'New cards every month' },
    ],
  },
  tabs: {
    home: 'Home',
    learn: 'Learn',
    games: 'Games',
    me: 'Me',
  },
  headers: {
    personalSpace: 'My Space',
    duoSpace: 'Our Space',
    learn: 'Learn',
    help: 'Help',
    settings: 'Settings',
    accompagnementAdulte: 'Support',
    annuaireSexologues: 'Sexologist Directory',
  },
  settings: {
    sections: {
      profile: 'My profile',
      appearance: 'Appearance',
      content: 'Content',
      app: 'App',
    },
    profile: {
      name: 'First name',
      namePlaceholder: 'Your name',
      pronouns: 'Pronouns',
      pronounsOptional: '(optional)',
      personalSpace: 'My personal space',
      personalSpaceDesc: 'Comfort profile and safe word',
    },
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
    },
    replayIntro: {
      title: 'Replay introduction',
      desc: 'Watch the intro slides again',
    },
    reset: {
      title: 'Reset app',
      desc: 'Erase all local data',
      confirm: 'All your local data will be erased. This action cannot be undone.',
      cta: 'Reset',
      cancel: 'Cancel',
    },
    deleteAccount: {
      title: 'Delete my account',
      desc: 'GDPR — permanently deletes all your data',
      confirmTitle: 'Delete my data?',
      confirmBody: 'This permanently deletes all your personal data (profile, progress, cards, preferences). In accordance with GDPR right to erasure (Art. 17). Irreversible.',
      cta: 'Permanently delete',
      cancel: 'Cancel',
    },
  },
  moi: {
    defaultName: 'My space',
    personalSpaceDesc: 'Explore my comfort zones',
    duoSpaceDesc: 'Talk with my partner',
    helpDesc: 'Free, anonymous numbers, available 24/7',
    settingsDesc: 'Theme, language, personal data',
    premiumDesc: 'All games · deep content · no limits',
    accompagnementAdulteDesc: 'Going through something? Confidential resources.',
    annuaireDesc: 'Find a professional — in person or teleconsultation',
    heatTitle: 'My Barometer',
    prefSection_title: 'How I feel',
    prefSection_empty: 'Questions will appear as you progress',
  },
  homeAdult: {
    subtitle: 'Explore your comfort profile or connect with your partner.',
    collection: {
      title: 'My Collection',
      empty: 'Complete a module to unlock your first cards',
    },
  },
  homeMinor: {
    badge: 'Youth Space',
    title: "What they don't teach you at school",
    subtitle: 'No taboo. No judgment. Just real info.',
  },
  homeV3: {
    discovery: {
      ctaAdult: 'Start your journey',
      ctaMinor: 'Explore modules',
      ctaDesc: 'Each completed module unlocks cards',
      fomoTitle: 'Your collection awaits',
      fomoDesc: 'Base module → 24 cards · Quiz → 1 card · Law → 1 rare…',
    },
    learning: {
      progressLabel: 'Progress',
      nextModuleLabel: 'Next module',
    },
    mastery: {
      collectionOne: '1 card unlocked',
      rareOne: '1 rare',
      uniqueOne: '1 unique',
      viewCollection: 'View your collection →',
      duoTitle: 'Our Space',
      duoDesc: 'Play with your unlocked cards together',
      goFurther: 'Go further',
    },
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
    allDone: 'Journey complete!',
    allDoneSub: "You've explored all available content. Now play!",
    heatRequired: 'Level {palier} required · {pts} pts',
    heatPoints: '+{n} pts',
    heatPointsEarned: '✓ {n} pts',
  },
  heat: {
    tiede: 'Lukewarm',
    chaud: 'Warm',
    ardent: 'Hot',
    brulant: 'Burning',
    incandescent: 'Incandescent',
  },
  duo: {
    title: 'Our Space',
    createSession: 'Create a session',
    createSessionDesc: 'Generate a QR code — your partner scans it',
    join: 'Join',
    joinDesc: 'Scan your partner\'s QR code',
    scanQRBtn: 'Scan QR code',
    manualCode: 'Enter the code manually',
    scanQRHint: 'Point the camera at your partner\'s QR code',
    shareCode: 'Or share the code manually',
    waiting: 'Waiting for your partner…',
    waitingSub: 'As soon as they scan the code, you\'ll be connected',
    connected: 'Partner connected!',
    connectedSub: 'Your comfort profiles are synced',
    disconnect: 'End session',
    enterCode: '6-character code',
    cancel: 'Cancel',
    loading: 'Connecting…',
    permissionDenied: 'Camera not allowed — enter the code manually',
    errorInvalidCode: 'Invalid or unfound code',
    errorExpired: 'This session has expired',
    errorNetwork: 'Connection failed. Check your connection.',
  },
};

export type EnTranslations = typeof en;
