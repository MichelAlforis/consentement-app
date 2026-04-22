export const home = {
  homeMinor: {
    badge: 'Espacio Joven',
    title: 'Lo que no te enseñan en la escuela',
    subtitle: 'Sin tabúes. Sin juicios. Solo información real.',
    section1: 'Entiende lo que ves',
    section2: 'Lo que dice la ley',
    section3: '¿Tienes preguntas?',
    privacy: 'Este espacio es 100% privado',
    modules: {
      porno: {
        title: 'Porno vs. Realidad',
        desc: 'Lo que muestra el porno y lo que es realmente',
        tag: 'Esencial',
      },
      quiz: {
        title: 'Quiz — Entiendo el consentimiento',
        desc: '8 preguntas para comprobar lo que sabes de verdad',
        tag: 'Gratis',
      },
      dice: {
        title: 'El Dado del Consentimiento',
        desc: 'Saca una actividad al azar y descubre qué implica el consentimiento',
        tag: 'Juego',
      },
      loi: {
        title: 'La ley y el consentimiento',
        desc: 'Edad legal, qué es un delito, tus derechos',
        tag: 'Importante',
      },
      guide: {
        title: 'Quiero tener relaciones',
        desc: 'Preguntas para hacerte antes. Sin juicios.',
      },
      help: {
        title: 'Ayuda y Recursos',
        desc: 'Números gratuitos, anónimos, disponibles 24h/24',
      },
    },
  },

  homeAdult: {
    greeting: 'Hola {name}',
    subtitle: 'Explora tu perfil de comodidad o conéctate con tu pareja.',
    menu: {
      personal: { title: 'Mi Espacio', desc: 'Explorar mis zonas de comodidad' },
      duo: { title: 'Nuestro Espacio', desc: 'Dialogar con mi pareja' },
      games: { title: 'Juegos', desc: 'Explorar el consentimiento jugando' },
      resources: { title: 'Recursos', desc: 'Guías e información' },
    },
    privacy: 'Tus datos están cifrados y puedes eliminarlos en cualquier momento.',
  },
} as const;
