export const onboarding = {
  welcome: {
    tagline: 'Aprender. Entender. Decidir.',
    description: "El porno no te enseña sobre el consentimiento. Estamos aquí para eso — sin tabúes, sin juicios.",
    pillars: {
      consent: 'Consentimiento',
      education: 'Educación',
      dialogue: 'Diálogo',
    },
    cta: 'Empezar',
    privacy: "100% privado — nada se registra sin tu consentimiento",
    appName: 'Consentement',
    legalBadge: 'Creado con un abogado penalista',
  },

  ageCheck: {
    title: '¿Cuántos años tienes?',
    subtitle: 'La experiencia se adapta a tu edad',
    minor: {
      title: "Tengo menos de 18 años",
      desc: 'Acceso educativo, sin cuenta requerida',
    },
    adult: {
      title: "Tengo 18 años o más",
      desc: 'Acceso completo con autenticación',
    },
    privacy: "Esta información permanece en tu dispositivo y nunca se comparte",
  },

  auth: {
    title: 'Inicio de sesión seguro',
    subtitle: 'Para proteger tu identidad y verificar tu edad',
    nameLabel: '¿Cómo quieres que te llamemos?',
    namePlaceholder: 'Tu nombre...',
    namePrivacy: 'Este nombre permanece solo en tu dispositivo',
    nameRequired: 'Ingresa tu nombre para continuar',
    btnConnect: 'Iniciar sesión con FranceConnect',
    btnContinue: 'Continuar',
    demoNote: 'Simulación — En producción, redirige a FranceConnect',
    why: {
      title: '¿Por qué FranceConnect?',
      reason1: 'Verificación de tu edad',
      reason2: 'Sin contraseña que crear',
      reason3: 'Tu identidad permanece protegida',
    },
    badges: {
      encrypted: 'Cifrado',
      rgpd: 'RGPD',
      official: 'Oficial',
    },
    pronounsLabel: 'Pronombres (opcional)',
    pronounOptions: {
      il: 'él',
      elle: 'ella',
      iel: 'elle',
      neutre: 'neutro',
    },
  },

  language: {
    title: 'Elige tu idioma',
    subtitle: 'Podrás cambiarlo en cualquier momento en ajustes',
    cta: 'Continuar',
  },

  personalIntro: {
    title: 'Tu espacio personal',
    subtitle: 'Dinos qué te corresponde. Podrás ajustarlo en cualquier momento.',
    tenderness: 'Ternura',
    intensity: 'Intensidad',
    trust: 'Confianza',
    ctaNow: 'Personalizar ahora',
    ctaLater: 'Configurar más tarde',
  },
  skip: 'Omitir',
} as const;
