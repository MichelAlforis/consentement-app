export const data = {
  comfort: {
    tenderness: {
      title: 'Ternura',
      description: 'Intimidad emocional y contacto suave',
      items: {
        kisses: 'Besos',
        cuddles: 'Abrazos',
        massage: 'Masajes',
        words: 'Palabras dulces',
        holding: 'Cogerse de la mano',
        sleeping: 'Dormir juntos',
      },
    },
    intensity: {
      title: 'Intensidad',
      description: 'Ritmo y nivel de intimidad',
      items: {
        slow: 'Tomárselo con calma',
        spontaneous: 'Espontaneidad',
        lights: 'Con la luz encendida',
        talking: 'Hablar durante',
        'eye-contact': 'Contacto visual',
        guidance: 'Guiarse mutuamente',
      },
    },
    trust: {
      title: 'Confianza',
      description: 'Prácticas que requieren comunicación reforzada',
      items: {
        blindfold: 'Ojos vendados',
        restraint: 'Inmovilización suave',
        roleplay: 'Juegos de rol',
        power: 'Dinámica de poder',
        toys: 'Accesorios',
        filming: 'Fotos/Vídeos',
      },
    },
  },

  levels: ["No", "Ahora no", "Curioso/a", "Cómodo/a", "Me encanta"] as [string, string, string, string, string],

  principles: [
    { title: 'Continuo', text: 'Puede retirarse en cualquier momento. Un "sí" puede convertirse en un "no".' },
    { title: 'Explícito', text: 'El silencio o la ausencia de "no" no significa "sí".' },
    { title: 'Específico', text: 'Aceptar una cosa no significa aceptar todo.' },
    { title: 'Libre', text: 'Sin presión, sin chantaje, sin manipulación.' },
    { title: 'Informado', text: 'Debes entender aquello a lo que consientes.' },
  ] as { title: string; text: string }[],

  helpResources: [
    { name: 'Fil Santé Jeunes', desc: 'Anónimo y gratuito' },
    { name: 'Violences Femmes Info', desc: '24h/24' },
    { name: 'Planning Familial', desc: 'Sexualidad, anticoncepción' },
  ] as { name: string; desc: string }[],

  quiz: [
    {
      question: "Alguien no dice nada y no se resiste. ¿Significa que está de acuerdo?",
      options: ["Sí, el silencio es sí", "No, el silencio no es consentimiento", "Depende de la situación", "Sí si os conocéis bien"],
      explanation: "El silencio no significa sí. El consentimiento debe expresarse claramente. Una persona puede estar paralizada por el miedo o la sorpresa sin poder hablar.",
    },
    {
      question: "Dijiste que sí anoche. ¿Puedes cambiar de opinión esta mañana?",
      options: ["No, ya dijiste que sí", "Sí, siempre se puede cambiar de opinión", "No, ya es demasiado tarde", "Depende de lo que hubieras aceptado"],
      explanation: "El consentimiento es continuo. Se puede decir no en cualquier momento, aunque antes hayas dicho sí. Nadie puede ser obligado a continuar algo que ya no quiere.",
    },
    {
      question: "Aceptar un beso, ¿significa aceptar qué más?",
      options: ["Todo lo que viene después", "Nada más que el beso", "Depende de quién sea", "Todo si estáis en pareja"],
      explanation: "Aceptar algo no significa aceptar otra cosa. Cada acto requiere su propio consentimiento. Un beso = solo un beso.",
    },
    {
      question: "Alguien te ofrece regalos para que hagas algo con él/ella. ¿Qué tipo de consentimiento es ese?",
      options: ["Es normal, es como un intercambio", "Es consentimiento bajo presión, por lo tanto no es válido", "Está bien si quieres hacer el intercambio", "Es solo amabilidad"],
      explanation: "Un consentimiento dado bajo presión, manipulación o intercambio no es un consentimiento verdadero. Debe ser libre, sin contraprestación.",
    },
    {
      question: "¿Puede dar consentimiento una persona borracha o drogada?",
      options: ["Sí, si dice que sí", "No, no está en condiciones de decidir", "Sí si está acostumbrada", "Depende de cuánto haya bebido"],
      explanation: "Una persona bajo la influencia del alcohol o las drogas no puede dar un consentimiento válido. Aprovecharse de ese estado se considera agresión sexual por la ley.",
    },
    {
      question: "En el porno, los actores gritan de placer todo el tiempo. ¿Es así en la vida real?",
      options: ["Sí, así es cuando está bien", "No, es actuación para las cámaras", "Sí si se hacen las cosas bien", "Depende de las personas"],
      explanation: "El porno es una película con actores que juegan un papel. Los sonidos, las reacciones y los cuerpos están escenificados. La intimidad real es muy diferente y mucho más variada.",
    },
    {
      question: "En Francia, ¿cuál es la edad legal del consentimiento sexual?",
      options: ["13 años", "14 años", "15 años", "18 años"],
      explanation: "En Francia, la edad legal del consentimiento es 15 años. Por debajo de esa edad, cualquier acto sexual con un adulto es un delito, aunque el menor diga que sí — su palabra no puede constituir consentimiento legal.",
    },
    {
      question: "¿Un chico que fue forzado también puede ser víctima de agresión sexual?",
      options: ["No, los chicos no pueden ser víctimas", "Sí, cualquiera puede ser víctima", "Solo si era un adulto", "Sí pero es raro"],
      explanation: "Cualquiera puede ser víctima de una agresión sexual, independientemente del género. Los chicos y los hombres también están involucrados.",
    },
  ] as { question: string; options: string[]; explanation: string }[],

  pornoVsRealite: [
    {
      porno: "Los actores hacen cosas sin hablar de ello antes",
      realite: "Las relaciones reales comienzan con comunicación, preguntas y acuerdo mutuo",
      explication: "En la vida real, hablar antes, durante y después es normal y necesario. No es raro — es respeto.",
    },
    {
      porno: "Todos parecen amar todo, todo el tiempo",
      realite: "Cada persona tiene límites, preferencias, cosas que no le gustan",
      explication: "Los actores juegan un papel. En la realidad, puedes gustar ciertas cosas y no otras. Decir no a algo es completamente normal.",
    },
    {
      porno: "El rechazo o la duda suelen ignorarse",
      realite: "Un no o una duda siempre debe respetarse, de inmediato",
      explication: "Ignorar un rechazo es una agresión. En la vida real, la menor duda debe hacer parar todo de inmediato.",
    },
    {
      porno: "Algunos actos parecen fáciles y sin dolor",
      realite: "Algunos actos requieren preparación, suavidad y pueden doler si se hacen mal",
      explication: "La pornografía no muestra la preparación, los productos necesarios ni el posible dolor. Imitar mal lo que se ve puede causar daño.",
    },
    {
      porno: "Algunas escenas parecen normales en pantalla",
      realite: "Algunos actos reproducidos fuera de un contexto consentido son delitos",
      explication: "Lo que se filma con actores adultos que dan su consentimiento en un contexto legal no puede reproducirse libremente. Forzar a alguien es un delito, independientemente de lo que hayas visto en una película.",
    },
    {
      porno: "No hace falta hablar, todo se entiende",
      realite: "La comunicación es la base de toda relación sexual sana",
      explication: "En la realidad, verificar que el otro está bien, hacer preguntas, preguntar qué le gusta — eso es lo que hace que sea bueno para los dos.",
    },
  ] as { porno: string; realite: string; explication: string }[],

  loi: [
    {
      titre: "La edad legal del consentimiento",
      contenu: "En Francia, la edad legal del consentimiento sexual es 15 años. Por debajo de esa edad, ningún acto sexual con un adulto puede ser legal, aunque el joven diga que está de acuerdo.",
    },
    {
      titre: "Lo que arriesga el adulto",
      contenu: "Un adulto que tiene relaciones sexuales con un menor de 15 años puede ser condenado a hasta 20 años de prisión. Si el adulto es un padre, profesor o figura de autoridad, las penas son aún más severas.",
    },
    {
      titre: "¿Y entre adolescentes?",
      contenu: "Cuando ambas personas tienen menos de 18 años y una diferencia de edad razonable, la ley es más flexible. Pero el consentimiento sigue siendo obligatorio. Forzar a alguien o ignorar un rechazo es una infracción, independientemente de la edad.",
    },
    {
      titre: "Fotos y vídeos",
      contenu: "Tomar, compartir o poseer fotos o vídeos de carácter sexual de un menor es un delito grave — aunque el menor haya dicho que sí, aunque sea él quien haya enviado la foto. Es la ley.",
    },
    {
      titre: "El silencio no es un sí",
      contenu: "La ley francesa es clara: la ausencia de resistencia no constituye consentimiento. Una persona que no dice nada, que está bajo presión, intimidada o bajo la influencia del alcohol no puede consentir.",
    },
    {
      titre: "Si viviste algo",
      contenu: "Si viviste algo que te puso incómodo/a o que crees que fue una agresión, puedes hablarlo. Nunca es tu culpa. Hay profesionales para escucharte sin juzgarte.",
    },
  ] as { titre: string; contenu: string }[],

  diceCategories: {
    1: 'Atrévete',
    2: 'Habla',
    3: '¿Y si…?',
    4: 'Desafío',
    5: 'Verdad',
    6: 'Suavidad',
  } as Record<number, string>,
} as const;
