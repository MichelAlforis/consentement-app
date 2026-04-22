export const data = {
  comfort: {
    tenderness: {
      title: 'Tendresse',
      description: 'Intimité émotionnelle et contact doux',
      items: {
        kisses: 'Baisers',
        cuddles: 'Câlins',
        massage: 'Massages',
        words: 'Mots doux',
        holding: 'Se tenir la main',
        sleeping: 'Dormir ensemble',
      },
    },
    intensity: {
      title: 'Intensité',
      description: "Rythme et niveau d'intimité",
      items: {
        slow: 'Prendre son temps',
        spontaneous: 'Spontanéité',
        lights: 'Lumières allumées',
        talking: 'Parler pendant',
        'eye-contact': 'Contact visuel',
        guidance: "Guider l'autre",
      },
    },
    trust: {
      title: 'Confiance',
      description: 'Pratiques nécessitant une communication renforcée',
      items: {
        blindfold: 'Yeux bandés',
        restraint: 'Immobilisation douce',
        roleplay: 'Jeux de rôle',
        power: 'Dynamique de pouvoir',
        toys: 'Accessoires',
        filming: 'Photos/Vidéos',
      },
    },
  },

  levels: ["Non", "Pas maintenant", "Curieux·se", "À l'aise", "J'adore"] as [string, string, string, string, string],

  principles: [
    { title: 'Continu', text: 'Il peut être retiré à tout moment. Un "oui" peut devenir un "non".' },
    { title: 'Explicite', text: "Le silence ou l'absence de \"non\" ne signifie pas \"oui\"." },
    { title: 'Spécifique', text: 'Accepter une chose ne veut pas dire accepter tout.' },
    { title: 'Libre', text: 'Sans pression, sans chantage, sans manipulation.' },
    { title: 'Éclairé', text: 'On doit comprendre ce à quoi on consent.' },
  ] as { title: string; text: string }[],

  helpResources: [
    { name: 'Fil Santé Jeunes', desc: 'Anonyme et gratuit' },
    { name: 'Violences Femmes Info', desc: '24h/24' },
    { name: 'Planning Familial', desc: 'Sexualité, contraception' },
  ] as { name: string; desc: string }[],

  quiz: [
    {
      question: "Quelqu'un ne dit rien et ne résiste pas. Est-ce que ça veut dire qu'il ou elle est d'accord ?",
      options: ["Oui, le silence c'est oui", "Non, le silence n'est pas un consentement", "Ça dépend de la situation", "Oui si on se connaît bien"],
      explanation: "Le silence ne veut pas dire oui. Le consentement doit être clairement exprimé. Une personne peut être paralysée par la peur ou la surprise sans pouvoir parler.",
    },
    {
      question: "Tu avais dit oui hier soir. Ce matin, tu peux changer d'avis ?",
      options: ["Non, t'as déjà dit oui", "Oui, on peut toujours changer d'avis", "Non, c'est trop tard", "Ça dépend de ce que tu avais accepté"],
      explanation: "Le consentement est continu. On peut dire non à n'importe quel moment, même si on avait dit oui avant. Personne ne peut être obligé à continuer quelque chose qu'il ne veut plus.",
    },
    {
      question: "Accepter un bisou, c'est accepter quoi d'autre ?",
      options: ["Tout ce qui vient après", "Rien de plus que le bisou", "Ça dépend de qui c'est", "Tout si on est en couple"],
      explanation: "Accepter quelque chose ne veut pas dire accepter autre chose. Chaque acte nécessite son propre consentement. Un bisou = seulement un bisou.",
    },
    {
      question: "Quelqu'un t'offre des cadeaux pour que tu fasses quelque chose avec lui/elle. C'est quoi ce consentement ?",
      options: ["C'est normal, c'est comme un échange", "C'est un consentement sous pression, donc pas valable", "C'est ok si t'as envie de faire l'échange", "C'est juste une gentillesse"],
      explanation: "Un consentement donné sous pression, manipulation ou échange n'est pas un vrai consentement. Il doit être libre, sans contrepartie.",
    },
    {
      question: "Une personne ivre ou défoncée peut-elle donner son consentement ?",
      options: ["Oui, si elle dit oui", "Non, elle n'est pas en état de décider", "Oui si elle a l'habitude", "Ça dépend de combien elle a bu"],
      explanation: "Une personne sous l'emprise d'alcool ou de drogues ne peut pas donner un consentement valable. Profiter de cet état est considéré comme une agression sexuelle par la loi.",
    },
    {
      question: "Dans le porno, les acteurs crient de plaisir tout le temps. C'est comme ça dans la vraie vie ?",
      options: ["Oui, c'est comme ça quand c'est bien", "Non, c'est du jeu d'acteur pour les caméras", "Oui si on fait bien les choses", "Ça dépend des personnes"],
      explanation: "Le porno est un film avec des acteurs qui jouent un rôle. Les sons, les réactions, les corps sont mis en scène. La vraie intimité est très différente et beaucoup plus variée.",
    },
    {
      question: "En France, quel est l'âge légal du consentement sexuel ?",
      options: ["13 ans", "14 ans", "15 ans", "18 ans"],
      explanation: "En France, l'âge légal du consentement est 15 ans. En dessous de cet âge, tout acte sexuel avec un adulte est un crime, même si le mineur dit oui — sa parole ne peut pas constituer un consentement légal.",
    },
    {
      question: "Un garçon qui a été forcé peut aussi être victime d'agression sexuelle ?",
      options: ["Non, les garçons ne peuvent pas être victimes", "Oui, n'importe qui peut être victime", "Seulement si c'était un adulte", "Oui mais c'est rare"],
      explanation: "N'importe qui peut être victime d'une agression sexuelle, peu importe le genre. Les garçons et les hommes sont aussi concernés.",
    },
  ] as { question: string; options: string[]; explanation: string }[],

  pornoVsRealite: [
    {
      porno: "Les acteurs font des choses sans jamais en parler avant",
      realite: "Les vraies relations commencent par une communication, des questions, un accord mutuel",
      explication: "Dans la vraie vie, parler avant, pendant et après est normal et nécessaire. Ce n'est pas bizarre, c'est du respect.",
    },
    {
      porno: "Tout le monde semble adorer tout, tout le temps",
      realite: "Chaque personne a des limites, des préférences, des choses qu'elle n'aime pas",
      explication: "Les acteurs jouent un rôle. Dans la réalité, on peut aimer certaines choses et pas d'autres. Dire non à quelque chose c'est tout à fait normal.",
    },
    {
      porno: "Le refus ou l'hésitation est souvent ignoré",
      realite: "Un non ou une hésitation doit toujours être respecté, immédiatement",
      explication: "Ignorer un refus est une agression. Dans la vraie vie, la moindre hésitation doit faire arrêter tout de suite.",
    },
    {
      porno: "Certains actes semblent faciles et sans douleur",
      realite: "Certains actes demandent préparation, douceur et peuvent faire mal si mal faits",
      explication: "La pornographie ne montre pas la préparation, les produits nécessaires ni la douleur possible. Mal imiter ce qu'on voit peut blesser.",
    },
    {
      porno: "Certaines scènes semblent normales à l'écran",
      realite: "Certains actes reproduits hors d'un cadre consenti sont des crimes",
      explication: "Ce qui est filmé avec des acteurs adultes consentants dans un contexte légal n'est pas reproductible librement. Forcer quelqu'un est un crime, peu importe ce qu'on a vu dans un film.",
    },
    {
      porno: "Pas besoin de parler, tout se comprend",
      realite: "La communication est la base de toute relation sexuelle saine",
      explication: "Dans la réalité, vérifier que l'autre est ok, poser des questions, demander ce qu'il ou elle aime — c'est ce qui fait que c'est bien pour les deux.",
    },
  ] as { porno: string; realite: string; explication: string }[],

  loi: [
    {
      titre: "L'âge légal du consentement",
      contenu: "En France, l'âge légal du consentement sexuel est fixé à 15 ans. En dessous de cet âge, aucun acte sexuel avec un adulte ne peut être légal, même si le ou la jeune dit qu'il ou elle est d'accord.",
    },
    {
      titre: "Ce que risque l'adulte",
      contenu: "Un adulte qui a un rapport sexuel avec un mineur de moins de 15 ans risque jusqu'à 20 ans de prison. Si l'adulte est un parent, professeur ou figure d'autorité, les peines sont encore plus lourdes.",
    },
    {
      titre: "Et entre adolescents ?",
      contenu: "Quand les deux personnes ont moins de 18 ans et un écart d'âge raisonnable, la loi est plus souple. Mais le consentement reste obligatoire. Forcer quelqu'un ou ignorer un refus est une infraction, peu importe l'âge.",
    },
    {
      titre: "Photos et vidéos",
      contenu: "Prendre, partager ou posséder des photos ou vidéos à caractère sexuel d'un mineur est un crime grave — même si le mineur a dit oui, même si c'est lui qui a envoyé la photo. C'est la loi.",
    },
    {
      titre: "Le silence n'est pas un oui",
      contenu: "La loi française est claire : l'absence de résistance ne constitue pas un consentement. Une personne qui ne dit rien, qui est sous pression, intimidée ou sous l'emprise d'alcool ne peut pas consentir.",
    },
    {
      titre: "Si tu as vécu quelque chose",
      contenu: "Si tu as vécu quelque chose qui t'a mis mal à l'aise ou que tu penses être une agression, tu peux en parler. Ce n'est jamais ta faute. Des professionnels sont là pour t'écouter sans te juger.",
    },
  ] as { titre: string; contenu: string }[],

  diceCategories: {
    1: 'Osez',
    2: 'Parlez',
    3: 'Et si…',
    4: 'Défi',
    5: 'Vérité',
    6: 'Douceur',
  } as Record<number, string>,
} as const;
