export const onboarding = {
  welcome: {
    tagline: 'Apprendre. Comprendre. Décider.',
    description: "Le porno ne t'apprend pas le consentement. On est là pour ça — sans tabou, sans jugement.",
    pillars: {
      consent: 'Consentement',
      education: 'Éducation',
      dialogue: 'Dialogue',
    },
    cta: 'Commencer',
    privacy: "100% privé — rien n'est enregistré sans ton accord",
    appName: 'Consentement',
    legalBadge: 'Créé avec un juriste en droit pénal',
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
      desc: 'Accès complet avec authentification',
    },
    privacy: "Cette information reste sur ton appareil et n'est jamais partagée",
  },

  auth: {
    title: 'Connexion sécurisée',
    subtitle: 'Pour protéger ton identité et vérifier ta majorité',
    nameLabel: "Comment veux-tu qu'on t'appelle ?",
    namePlaceholder: 'Ton prénom...',
    namePrivacy: 'Ce prénom reste sur ton appareil uniquement',
    nameRequired: 'Entre ton prénom pour continuer',
    btnConnect: 'Se connecter avec FranceConnect',
    btnContinue: 'Continuer',
    demoNote: 'Simulation — En production, redirection vers FranceConnect',
    why: {
      title: 'Pourquoi FranceConnect ?',
      reason1: 'Vérification de ta majorité',
      reason2: 'Aucun mot de passe à créer',
      reason3: 'Ton identité reste protégée',
    },
    badges: {
      encrypted: 'Chiffré',
      rgpd: 'RGPD',
      official: 'Officiel',
    },
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
