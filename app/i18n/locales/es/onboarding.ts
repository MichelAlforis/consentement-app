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
    legalSheet: {
      title: 'Validado por un abogado',
      role: 'Derecho penal · Especialista en consentimiento',
      bio: "Todos los contenidos educativos han sido revisados y validados por un abogado especializado en derecho penal del consentimiento. Nuestro compromiso: información fiable, exacta y jurídicamente defendible.",
      close: 'Cerrar',
    },
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
      desc: 'Acceso completo, personalización máxima',
    },
    privacy: "Esta información permanece en tu dispositivo y nunca se comparte",
  },

  auth: {
    title: '¿Cómo te llamamos?',
    subtitle: 'Un nombre es suficiente — permanece en tu dispositivo',
    nameLabel: '¿Cómo quieres que te llamemos?',
    namePlaceholder: 'Tu nombre...',
    namePrivacy: 'Este nombre permanece solo en tu dispositivo',
    nameRequired: 'Ingresa tu nombre para continuar',
    btnContinue: 'Continuar',
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
  next: 'Siguiente',
  finish: 'Entendido · Ver mis cartas',
} as const;
