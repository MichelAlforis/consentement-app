export const home = {
  homeMinor: {
    badge: 'Espacio Joven',
    title: 'Lo que no te enseñan en la escuela',
    subtitle: 'Sin tabúes. Sin juicios. Solo información real.',
    privacy: 'Este espacio es 100% privado',
    cards: {
      learn: {
        title: 'Comprender',
        desc: 'Porno, quiz y la ley — información real',
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
        title: 'Porno vs. Realidad',
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
      consentCheck: { title: 'Antes de empezar', desc: 'Aseguraros de que los dos estáis listos' },
    },
    privacy: 'Tus datos están cifrados y puedes eliminarlos en cualquier momento.',
  },
} as const;
