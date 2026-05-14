export const pressionManip = {
  pressionManip: {
    quiz: {
      title: 'Pression & manipulation',
      subtitle: 'Reconnaître ce qui ressemble à du consentement mais n\'en est pas',
      scoreLabels: {
        excellent: 'Tu vois clair dans le jeu',
        good: 'Tu as de bons réflexes',
        notBad: 'Quelques zones à affiner',
        retry: 'Ces situations méritent qu\'on en parle',
      },

      // Version adulte
      0: {
        question: '"Si tu m\'aimais vraiment, tu le ferais." Cette phrase, c\'est :',
        options: {
          0: 'Une façon de tester l\'amour de l\'autre',
          1: 'Une demande romantique normale',
          2: 'Une forme de manipulation émotionnelle qui invalide le refus',
          3: 'Une blague à ne pas prendre au sérieux',
        },
        explanation: 'Conditionner l\'amour à un acte sexuel est une technique de manipulation classique. Un·e partenaire qui t\'aime accepte ton refus sans le mettre en doute.',
      },
      1: {
        question: 'Tu dis non. L\'autre continue à insister, gentiment mais sans arrêt. C\'est :',
        options: {
          0: 'De la persévérance — il/elle veut vraiment être avec toi',
          1: 'Du harcèlement, même si le ton est doux',
          2: 'Normal dans une relation de couple',
          3: 'Acceptable si ça finit par marcher',
        },
        explanation: 'L\'insistance répétée après un refus, même sans violence ni cri, est une forme de pression qui nie ton "non". La douceur du ton ne change pas la nature de l\'acte.',
      },
      2: {
        question: 'Quelqu\'un te dit : "De toute façon t\'as pas le choix si tu veux qu\'on reste ensemble."',
        options: {
          0: 'C\'est peut-être une maladresse — il/elle est juste stressé·e',
          1: 'C\'est excessif mais ça arrive dans les couples',
          2: 'C\'est une menace qui invalide tout consentement donné après',
          3: 'C\'est honnête — au moins tu sais où tu en es',
        },
        explanation: 'Un consentement donné sous menace (même implicite) n\'est pas libre. C\'est la définition même d\'un consentement vicié. Ce type de chantage affectif peut caractériser une infraction.',
      },
      3: {
        question: 'Tu hésites. L\'autre dit "je savais que tu finirais par dire oui" et continue.',
        options: {
          0: 'C\'est flatteur — il/elle te connaît bien',
          1: 'C\'est maladroit mais pas grave',
          2: 'C\'est une erreur, il suffit de le corriger',
          3: 'C\'est une violation — une hésitation n\'est pas un oui',
        },
        explanation: 'Interpréter une hésitation comme un accord est une manipulation consciente ou inconsciente. "Je ne sais pas" ou "peut-être" ne signifient pas "oui". Le doute se respecte, il ne s\'exploite pas.',
      },
      4: {
        question: 'Après un refus, l\'autre boude, fait la tête, ou pleure. Tu changes d\'avis. C\'est :',
        options: {
          0: 'Un geste d\'amour envers quelqu\'un qui souffre',
          1: 'Un consentement donné sous pression émotionnelle — pas vraiment libre',
          2: 'Normal, on fait des concessions dans une relation',
          3: 'Ta responsabilité si tu reviens sur ta décision',
        },
        explanation: 'Utiliser sa propre tristesse ou colère pour faire céder l\'autre est une forme de manipulation émotionnelle. Changer d\'avis par peur de la réaction de l\'autre, ce n\'est pas consentir librement.',
      },
      5: {
        question: 'Quelqu\'un dit oui mais son langage corporel dit clairement non. Que faire ?',
        options: {
          0: 'Continuer — il/elle a dit oui',
          1: 'Demander une confirmation verbale plus forte',
          2: 'S\'arrêter et demander ouvertement si tout va bien',
          3: 'Ignorer — les gestes sont moins fiables que les mots',
        },
        explanation: 'Le consentement se lit aussi dans le corps. Un visage crispé, une tension physique, un évitement du regard sont des signaux d\'alarme. S\'arrêter et demander est toujours la bonne réponse.',
      },

      // Version mineur (namespace partagé, on ajoute un suffixe mineur)
      mineur0: {
        question: '"Si tu m\'aimais, tu le ferais." Cette phrase te dit quoi ?',
        options: {
          0: 'Que cette personne tient vraiment à moi',
          1: 'Que c\'est une façon de tester notre relation',
          2: 'Que quelqu\'un qui m\'aime ne poserait pas cette question',
          3: 'Que je dois réfléchir à ma réponse',
        },
        explanation: 'Quelqu\'un qui t\'aime ne te mettra jamais son amour en otage pour obtenir quelque chose. Cette phrase, c\'est de la manipulation — même si la personne semble sincère.',
      },
      mineur1: {
        question: 'Tu dis non, l\'autre continue à demander. Qu\'est-ce que tu ressens le droit de faire ?',
        options: {
          0: 'Répéter ton refus autant de fois que nécessaire',
          1: 'Finir par céder pour que ça s\'arrête',
          2: 'T\'expliquer en détail pour justifier ton refus',
          3: 'Changer de sujet pour éviter le conflit',
        },
        explanation: 'Tu as le droit de dire non une fois, sans explication. Si l\'autre insiste, ça s\'appelle de la pression. Tu n\'as pas à justifier ton refus ni à l\'endurer en boucle.',
      },
      mineur2: {
        question: 'Quelqu\'un menace de rompre si tu ne fais pas ce qu\'il/elle demande.',
        options: {
          0: 'C\'est peut-être une erreur — il/elle est juste blessé·e',
          1: 'Je devrais peut-être faire un effort pour sauver la relation',
          2: 'C\'est du chantage affectif — ton non est valable quoi qu\'il arrive',
          3: 'C\'est normal, les couples se disputent',
        },
        explanation: 'Ton "non" ne disparaît pas parce que l\'autre menace de partir. Un·e partenaire qui utilise la rupture comme levier pour te forcer, ce n\'est pas quelqu\'un qui te respecte.',
      },
      mineur3: {
        question: 'Tu hésites et tu dis "je ne sais pas". L\'autre interprète ça comme un oui. C\'est :',
        options: {
          0: 'Normal, il/elle a voulu voir le bon côté',
          1: 'Une erreur de communication à corriger ensemble',
          2: 'Correct — une hésitation peut vouloir dire oui',
          3: 'Faux — "je ne sais pas" n\'est jamais un oui',
        },
        explanation: '"Je ne sais pas" ne veut pas dire oui. Ça veut dire : attends, j\'ai besoin de temps ou d\'en parler. Continuer comme si c\'était un accord, c\'est violer ton espace de décision.',
      },
      mineur4: {
        question: 'Après ton refus, l\'autre fait la tête ou pleure. Tu te sens coupable. C\'est :',
        options: {
          0: 'Normal, tu l\'as blessé·e',
          1: 'Un signal que tu devrais peut-être changer d\'avis',
          2: 'Une réaction émotionnelle de l\'autre dont tu n\'es pas responsable',
          3: 'Quelque chose à gérer en te montrant plus flexible',
        },
        explanation: 'La culpabilité que tu ressens est réelle — mais la réaction de l\'autre n\'est pas ta faute. Tu n\'es pas responsable des émotions que provoque ton "non" chez quelqu\'un d\'autre.',
      },
      mineur5: {
        question: 'Une personne dit oui mais son corps semble crispé et elle évite ton regard. Tu :',
        options: {
          0: 'Continues — elle a dit oui',
          1: 'Lui demandes une confirmation plus ferme',
          2: 'T\'arrêtes et tu lui demandes si tout va bien',
          3: 'Ignores — les mots comptent plus que les gestes',
        },
        explanation: 'Le corps parle aussi. Si le "oui" ne correspond pas à ce que tu vois, pose la question ouvertement. S\'arrêter et demander, c\'est toujours la bonne chose à faire.',
      },
    },
  },
};
