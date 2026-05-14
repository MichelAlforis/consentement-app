export const onboarding = {
  welcome: {
    tagline: 'Apprendre. Comprendre. Décider.',
    description: "Les films pour adultes ne t'apprennent pas le consentement. On est là pour ça — sans tabou, sans jugement.",
    pillars: {
      consent: 'Consentement',
      education: 'Éducation',
      dialogue: 'Dialogue',
    },
    cta: 'Commencer',
    privacy: "100% privé — rien n'est enregistré sans ton accord",
    appName: 'Consentement',
    legalBadge: 'Créé avec un juriste en droit pénal',
    legalSheet: {
      title: 'Validé par un juriste',
      role: 'Droit pénal · Spécialité consentement',
      bio: "Tous les contenus éducatifs ont été relus et validés par un juriste spécialisé en droit pénal du consentement. Notre engagement : une information fiable, exacte et juridiquement défendable.",
      close: 'Fermer',
    },
  },

  ageCheck: {
    title: 'Quel âge as-tu ?',
    subtitle: "L'expérience s'adapte à ton âge",
    minor: {
      title: "J'ai moins de 18 ans",
      desc: 'Accès éducatif, aucun compte requis',
    },
    adult: {
      title: "J'ai 18 ans ou plus",
      desc: 'Accès complet, personnalisation maximale',
    },
    privacy: "Cette information reste sur ton appareil et n'est jamais partagée",
  },

  auth: {
    title: 'Comment t\'appelle-t-on ?',
    subtitle: 'Un prénom suffit — il reste sur ton appareil',
    nameLabel: "Comment veux-tu qu'on t'appelle ?",
    namePlaceholder: 'Ton prénom...',
    namePrivacy: 'Ce prénom reste sur ton appareil uniquement',
    nameRequired: 'Entre ton prénom pour continuer',
    btnContinue: 'Continuer',
    pronounsLabel: 'Pronoms (optionnel)',
    pronounOptions: {
      il: 'il/lui',
      elle: 'elle',
      iel: 'iel',
      neutre: 'neutre',
    },
  },

  language: {
    title: 'Choisis ta langue',
    subtitle: 'Tu pourras changer à tout moment dans les paramètres',
    cta: 'Continuer',
  },

  personalIntro: {
    title: 'Ton espace personnel',
    subtitle: 'Dis-nous ce qui te correspond. Tu pourras ajuster à tout moment.',
    tenderness: 'Tendresse',
    intensity: 'Intensité',
    trust: 'Confiance',
    ctaNow: 'Personnaliser maintenant',
    ctaLater: 'Configurer plus tard',
  },
  skip: 'Passer',
  next: 'Suivant',
  finish: "J'ai compris · Voir mes cartes",
} as const;
