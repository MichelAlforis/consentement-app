export const education = {
  learn: {
    title: 'Entender el consentimiento',
    subtitle: 'Los pilares de una relación sana y respetuosa',
    keyTakeaway: 'El consentimiento no es un contrato',
    keyText: "Es una conversación continua basada en el respeto mutuo.",
    further: {
      title: 'Para ir más lejos',
      item1: 'El consentimiento se aplica a cada situación',
      item2: 'Tu cuerpo siempre te pertenece',
      item3: 'Poner límites es una señal de fortaleza',
      item4: 'La comunicación es la clave',
    },
  },

  help: {
    title: '¿Necesitas ayuda?',
    subtitle: "No estás solo/a. Hay personas aquí para escucharte.",
    alsoTalk: {
      title: 'También puedes hablar con...',
      item1: 'Un adulto de confianza',
      item2: 'Un/a enfermero/a escolar',
      item3: 'Un/a orientador/a',
      item4: 'El médico de familia',
    },
    emergency: {
      title: 'En caso de emergencia',
      police: 'Policía',
      samu: 'Emergencias',
      sms: 'SMS',
    },
  },

  pornoVsRealiteScreen: {
    title: 'Porno vs. Realidad',
    subtitle: 'Lo que las películas no te muestran',
    intro: "El porno es una <strong>película de ficción</strong> rodada con actores. No muestra cómo funcionan las relaciones reales — ni el consentimiento, ni la comunicación, ni los límites.",
    inPorno: 'En el porno',
    inReality: 'En la realidad',
    closing: "La sexualidad real se construye con comunicación, respeto y consentimiento. No imitando una película.",
  },

  loiScreen: {
    title: 'La ley y el consentimiento',
    subtitle: 'Lo que arriesgas. Lo que te protege.',
    alert: {
      title: 'Punto clave para recordar',
      text: "En Francia, la edad legal del consentimiento es <strong>15 años</strong>. Por debajo de esta edad, ningún acto sexual con un adulto puede ser legal — aunque el joven diga que sí.",
    },
    source1: 'Contenido validado por nuestro cofundador, abogado en derecho penal.',
    source2: 'Código Penal francés — Artículos 222-22 y siguientes',
  },

  quizScreen: {
    title: 'Quiz',
    question: 'Pregunta {current} de {total}',
    correct: '✅ ¡Correcto!',
    incorrect: '❌ No del todo',
    validate: 'Validar',
    next: 'Siguiente pregunta',
    finish: 'Ver mi puntuación',
    restart: 'Reiniciar',
    score: '{score} respuesta{plural} correcta{plural} de {total}',
    adviceReread: 'Vuelve a leer los módulos Porno vs. Realidad y La Ley para entender mejor.',
    scoreLabels: {
      excellent: '¡Excelente!',
      good: '¡Bien!',
      notBad: 'No está mal',
      retry: 'A trabajar',
    },
  },

  accompagnement: {
    title: 'Quiero tener relaciones',
    subtitle: 'Preguntas que hacerse. Sin juicios.',
    intro: {
      text: "Es normal tener preguntas. Este espacio te guía — no para decirte qué hacer, sino para ayudarte a verificar que estás realmente listo/a.",
      note: "Te haremos algunas preguntas simples. Ninguna respuesta se registra.",
      cta: 'Empezar',
    },
    age: {
      question: '¿Cuántos años tienes?',
      under15: { title: 'Menos de 15 años', desc: "Tengo 14 o menos" },
      between: { title: '15, 16 o 17 años', desc: "Tengo entre 15 y 17 años" },
    },
    under15Alert: {
      title: '⚠️ Importante saber',
      text: "En Francia, la edad legal del consentimiento es <strong>15 años</strong>. Por debajo, cualquier relación sexual con un adulto es un delito — aunque digas que sí. Esta ley existe para protegerte.",
      sub: "Si tienes preguntas sobre tu sexualidad, tus sentimientos o una situación que te puso incómodo/a, hablar con un profesional puede ayudar mucho.",
    },
    talked: {
      question: '¿Has podido hablarlo con un adulto de confianza?',
      sub: "Un padre, un médico, una enfermera escolar… alguien en quien confíes.",
      yes: "Sí, lo he hablado",
      no: 'No, todavía no',
      noDec: 'Te daré recursos para ayudarte',
    },
    notTalkedYet: "No siempre es fácil hablarlo. Estos profesionales están formados para escuchar sin juzgar y guardan confidencialidad.",
    partnerOk: {
      question: '¿Tu pareja está realmente de acuerdo?',
      sub: 'No solo "no dijo que no" — sino realmente de acuerdo, libremente.',
      yes: "Sí, lo hemos hablado juntos",
      unsure: "No estoy seguro/a",
      unsureDec: "Si hay duda, no estamos listos/as",
    },
    resourcesNote: "Hablar con un profesional no te compromete a nada — es solo una conversación.",
    continueAnyway: 'Continuar de todas formas',
    guide: {
      ready: '✅ Pareces listo/a',
      readyDesc: "Has marcado las casillas importantes. Recuerda que el consentimiento es continuo — ambas personas deben sentirse cómodas en todo momento.",
      tip1: 'Podéis parar en cualquier momento',
      tip2: 'Decir no o "stop" debe respetarse de inmediato',
      tip3: 'Si algo duele, dilo',
      tip4: 'La primera vez raramente es como en las películas',
      backHome: 'Volver al inicio',
    },
    backHome: 'Volver',
  },
} as const;
