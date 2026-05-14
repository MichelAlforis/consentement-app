export const zonesGrises = {
  zonesGrises: {
    quiz: {
      title: 'Zones grises',
      subtitle: 'Les situations où la réponse n\'est pas évidente',
      scoreLabels: {
        excellent: 'Tu navigues les zones grises avec clarté',
        good: 'Bonne intuition, quelques nuances',
        notBad: 'Ces situations sont complexes — c\'est normal',
        retry: 'Prenons le temps d\'y réfléchir ensemble',
      },
      0: {
        question: 'Vous avez tous les deux bu. Les deux semblez d\'accord. Quel est le bon choix ?',
        options: {
          0: 'Continuer — vous êtes dans le même état',
          1: 'Continuer si vous êtes en relation',
          2: 'Attendre d\'être sobre pour prendre cette décision — ou au moins vérifier sobrement',
          3: 'C\'est une zone grise sans bonne réponse',
        },
        explanation: 'Deux personnes ivres peuvent toutes les deux être dans un état qui empêche un consentement éclairé. "On était pareil" ne résout pas le problème — ça le double. Reporter à plus tard est toujours une option valide.',
      },
      1: {
        question: 'Tu as déjà dit oui à cette pratique avec cette personne, mais ce soir tu n\'as pas envie.',
        options: {
          0: 'C\'est compliqué de dire non maintenant — tu avais l\'habitude',
          1: 'Tu as le droit de dire non — chaque fois est indépendante',
          2: 'Il vaut mieux ne rien dire et que ça passe vite',
          3: 'C\'est injuste pour l\'autre si tu changes sans prévenir',
        },
        explanation: 'Le consentement n\'est jamais acquis par habitude. Chaque situation est une nouvelle décision. Dire non ce soir après avoir dit oui d\'autres fois est parfaitement légitime.',
      },
      2: {
        question: 'L\'autre dit "comme tu veux" d\'un ton neutre. C\'est suffisant pour continuer ?',
        options: {
          0: 'Non — "comme tu veux" n\'est pas un consentement enthousiaste',
          1: 'Oui — il/elle n\'a pas dit non',
          2: 'Oui si la relation est établie',
          3: 'Ça dépend du contexte',
        },
        explanation: '"Comme tu veux" signale souvent une absence d\'envie, pas une absence d\'objection. La différence entre "pas de refus" et "envie réelle" est le coeur du consentement enthousiaste.',
      },
      3: {
        question: 'Tu réalises après coup que l\'autre n\'était peut-être pas vraiment à l\'aise. Que faire ?',
        options: {
          0: 'Ne rien faire — tu ne pouvais pas le savoir',
          1: 'Attendre que l\'autre en parle s\'il/elle le souhaite',
          2: 'Oublier — ça ne sert à rien d\'y revenir',
          3: 'Vérifier avec l\'autre, même si c\'est inconfortable',
        },
        explanation: 'Rouvrir la conversation après coup demande du courage, mais peut changer beaucoup de choses pour l\'autre. "Est-ce que tu étais vraiment ok l\'autre soir ?" est une question qui montre que tu prends les choses au sérieux.',
      },
      4: {
        question: 'La personne n\'a pas dit non, mais elle a pleuré après. C\'est :',
        options: {
          0: 'Ses émotions — pas forcément lié à l\'acte',
          1: 'Un signal sérieux que quelque chose n\'allait pas, à prendre en compte',
          2: 'Normal dans certaines expériences intenses',
          3: 'Quelque chose à ignorer pour ne pas dramatiser',
        },
        explanation: 'Les larmes après un rapport peuvent signifier beaucoup de choses, dont une détresse réelle. Ne pas dramatiser ≠ ignorer. Prendre soin de l\'autre et lui demander comment il/elle va est toujours la bonne réponse.',
      },
      5: {
        question: 'Vous étiez tous les deux d\'accord au début, mais l\'un de vous a changé d\'avis en cours de route sans le dire.',
        options: {
          0: 'Tant que personne n\'a dit non, il n\'y a pas de problème',
          1: 'La personne qui a changé d\'avis aurait dû parler',
          2: 'Les deux ont une part de responsabilité — communication et vérification',
          3: 'Ce n\'est pas un problème, ça arrive',
        },
        explanation: 'La communication est partagée. L\'un peut avoir du mal à parler (dissociation, peur du conflit), l\'autre peut ne pas avoir vérifié. Les deux dimensions comptent — sans culpabiliser qui que ce soit pour une zone grise.',
      },
    },
  },
};
