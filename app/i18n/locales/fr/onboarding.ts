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
  },
} as const;
