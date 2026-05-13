export const home = {
  tabs: {
    home: 'Inicio',
    learn: 'Aprender',
    play: 'Jugar',
    me: 'Yo',
  },

  homeMinor: {
    badge: 'Espacio Joven',
    title: 'Lo que no te enseñan en la escuela',
    subtitle: 'Sin tabúes. Sin juicios. Solo información real.',
    privacy: 'Este espacio es 100% privado',
    cards: {
      learn: {
        title: 'Comprender',
        desc: 'Sexualidad, quiz y la ley — información real',
      },
      guide: {
        title: 'Tengo preguntas',
        desc: 'Preguntas para hacerte. Sin juicios.',
      },
      help: {
        title: 'Ayuda y Urgencias',
        desc: 'Números gratuitos, anónimos, 24h/24',
      },
      games: {
        title: 'Juegos',
        desc: '1 gratis · 2 juegos premium',
      },
    },
    resources: {
      porno: {
        title: 'Sexo vs. Realidad',
        desc: 'Lo que las películas no te muestran',
        tag: 'Esencial',
      },
      quiz: {
        title: 'Quiz Consentimiento',
        desc: '8 preguntas para comprobar lo que sabes',
        tag: 'Quiz',
      },
      loi: {
        title: 'La ley y el consentimiento',
        desc: 'Tus derechos, edad legal, qué es un delito',
        tag: 'Importante',
      },
    },
  },

  homeAdult: {
    greeting: 'Hola {name}',
    subtitle: 'Explora tu perfil de comodidad o conéctate con tu pareja.',
    menu: {
      personal: { title: 'Mi Espacio', desc: 'Explorar mis zonas de comodidad' },
      duo: { title: 'Nuestro Espacio', desc: 'Dialogar con mi pareja' },
      games: { title: 'Juegos', desc: '1 gratis · 2 juegos premium' },
      resources: { title: 'Recursos', desc: 'Guías e información' },
    },
    collection: {
      title: 'Mi Colección',
      empty: 'Completa un módulo para desbloquear tus primeras cartas',
      count: '{owned} / {total} cartas desbloqueadas',
    },
    privacy: 'Tus datos están cifrados y puedes eliminarlos en cualquier momento.',
  },

  homeV3: {
    discovery: {
      ctaAdult: 'Empieza tu camino',
      ctaMinor: 'Explora los módulos',
      ctaDesc: 'Cada módulo completado desbloquea cartas',
      fomoTitle: 'Tu colección te espera',
      fomoDesc: 'Módulo base → 24 cartas · Quiz → 1 carta · Ley → 1 rara…',
    },
    learning: {
      progressLabel: 'Progreso',
      moduleCount: '{progress} / {total} módulos',
      cardsOne: '1 carta desbloqueada',
      cardsPlural: '{count} cartas desbloqueadas',
      nextModuleLabel: 'Próximo módulo',
    },
    mastery: {
      collectionOne: '1 carta desbloqueada',
      collectionPlural: '{count} cartas desbloqueadas',
      rareOne: '1 rara',
      rarePlural: '{count} raras',
      uniqueOne: '1 única',
      uniquePlural: '{count} únicas',
      viewCollection: 'Ver tu colección →',
      duoTitle: 'Nuestro Espacio',
      duoDesc: 'Juega con tus cartas desbloqueadas en pareja',
      goFurther: 'Ir más lejos',
    },
    modules: {
      'porno-vs-realite': 'Sexo vs. Realidad',
      'quiz-consentement': 'Quiz Consentimiento',
      'loi-consentement': 'La ley y el consentimiento',
      'duo-flow': 'Duo Flow',
      'accompagnement-mineur': 'Tengo preguntas',
    },
  },

  heat: {
    tiede: 'Tibio',
    chaud: 'Caliente',
    ardent: 'Ardiente',
    brulant: 'Ardiendo',
    incandescent: 'Incandescente',
    points_to_next: '{n} pts para {palier}',
    max_reached: 'Nivel máximo alcanzado',
    palierUp: '¡Nivel {palier} alcanzado!',
    palierUp_cta: 'Continuar',
    palierUp_explicit: 'El contenido explícito está ahora desbloqueado 🔥',
    palierUp_scenarios: 'Modo Escenario — próximamente',
    palierUp_kamasutra: 'Gama Kamasutra — próximamente',
    palierUp_expert: 'Cartas Expertas — próximamente',
    fomo_scenarios: 'Modo Escenario',
    fomo_kamasutra: 'Gama Kamasutra',
    fomo_expert: 'Cartas Expertas',
    fomo_pts: '{n} pts para desbloquear',
  },
} as const;
