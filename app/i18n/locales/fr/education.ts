export const education = {
  learn: {
    title: 'Comprendre le consentement',
    subtitle: "Les piliers d'une relation saine et respectueuse",
    keyTakeaway: "Le consentement n'est pas un contrat",
    keyText: "C'est une conversation continue, basée sur le respect mutuel.",
    further: {
      title: 'Pour aller plus loin',
      item1: "Le consentement s'applique à chaque situation",
      item2: "Ton corps t'appartient, toujours",
      item3: "Poser des limites est un signe de force",
      item4: "La communication est la clé",
    },
  },

  help: {
    title: "Besoin d'aide ?",
    subtitle: "Tu n'es pas seul·e. Des personnes sont là pour t'écouter.",
    alsoTalk: {
      title: 'Tu peux aussi parler à...',
      item1: 'Un adulte de confiance',
      item2: 'Un·e infirmier·e scolaire',
      item3: 'Un·e CPE',
      item4: 'Le médecin de famille',
    },
    emergency: {
      title: "En cas d'urgence",
      police: 'Police',
      samu: 'SAMU',
      sms: 'SMS',
    },
  },

  pornoVsRealiteScreen: {
    title: 'Sexe vs. Réalité',
    subtitle: 'Ce que les films ne te montrent pas',
    intro: "Les films pornographiques sont des <strong>fictions</strong> tournées avec des acteurs. Ils ne montrent pas comment les vraies relations se passent — ni le consentement, ni la communication, ni les limites.",
    inPorno: 'Dans les films adultes',
    inReality: 'Dans la réalité',
    closing: "La vraie sexualité, ça se construit avec communication, respect et consentement. Pas en imitant un film.",
    markRead: "J'ai lu — Voir ma carte",
  },

  loiScreen: {
    title: 'La loi & le consentement',
    subtitle: 'Ce que tu risques. Ce qui te protège.',
    alert: {
      title: 'À retenir absolument',
      text: "En France, l'âge légal du consentement est <strong>15 ans</strong>. En dessous de cet âge, aucun rapport sexuel avec un adulte ne peut être légal — même si le jeune dit oui.",
    },
    source1: 'Contenu validé par notre co-fondateur juriste en droit pénal.',
    source2: 'Code pénal français — Articles 222-22 et suivants',
    markRead: "J'ai lu — Voir ma carte",
    doneTitle: 'Module complété !',
    doneSub: 'Tu as parcouru tous les points juridiques.',
    seeCard: 'Voir ma carte',
  },

  quizScreen: {
    title: 'Quiz',
    question: 'Question {current} sur {total}',
    correct: 'Bonne réponse !',
    incorrect: 'Pas tout à fait',
    validate: 'Valider',
    next: 'Question suivante',
    finish: 'Voir mon score',
    restart: 'Recommencer',
    score: '{score} bonne{plural} réponse{plural} sur {total}',
    adviceReread: 'Relis les modules Sexe vs. Réalité et La Loi pour mieux comprendre.',
    seeCard: 'Voir ma carte',
    scoreLabels: {
      excellent: 'Excellent !',
      good: 'Bien !',
      notBad: 'Pas mal',
      retry: 'À retravailler',
    },
  },

  vraiFauxScreen: {
    progress: 'Idée {current} sur {total}',
    reveal: 'Découvrir la réalité',
    explainLabel: 'Pourquoi',
    next: 'Suivant',
    finish: 'Terminer',
    restart: 'Recommencer',
    seeCard: 'Voir ma carte',
    done: 'Module complété !',
  },

  accompagnementAdulte: {
    title: 'Tu traverses quelque chose ?',
    subtitle: 'Un espace confidentiel, sans jugement.',
    intro: {
      text: "Que tu aies vécu quelque chose de difficile, que tu t'interroges sur ton comportement ou que tu aies été témoin d'une situation, tu n'as pas à rester seul·e avec ça.",
      note: "Aucune information n'est enregistrée. Ce qui est dit ici reste ici.",
      cta: 'Continuer',
    },
    situation: {
      question: 'De quoi as-tu besoin ?',
      victim: {
        title: "J'ai vécu quelque chose qui m'a perturbé·e",
        desc: 'Une situation qui ne semblait pas normale, ou qui t\'a mis·e mal à l\'aise',
      },
      self: {
        title: 'Je m\'interroge sur mon propre comportement',
        desc: 'Je veux comprendre ou m\'améliorer',
      },
      witness: {
        title: 'J\'ai été témoin d\'une situation',
        desc: 'Je ne savais pas quoi faire ou je me pose des questions',
      },
    },
    victim: {
      message: "Ce que tu as vécu compte. Tu n'as pas à le minimiser. Des personnes formées peuvent t'écouter et t'aider à comprendre tes droits — sans te juger, sans te forcer à porter plainte.",
    },
    self: {
      message: "Le fait de te poser ces questions est déjà un premier pas. Parler à un professionnel peut t'aider à comprendre ce qui s'est passé et à agir autrement à l'avenir.",
    },
    witness: {
      message: "Tu peux faire quelque chose. Signaler, écouter, ou simplement orienter la personne vers les bonnes ressources — chaque geste compte.",
    },
    resources: {
      violences: 'Violences conjugales',
      violencesContact: '3919 — Gratuit, 24h/24, anonyme',
      suicide: 'Prévention du Suicide',
      suicideContact: '3114 — Disponible 24h/24, 7j/7',
      police: 'Police / Gendarmerie',
      signalement: 'Signaler en ligne',
      planning: 'Planning Familial',
      sexologue: 'Parler à un·e professionnel·le',
      sexologueDesc: 'Sexologue, thérapeute ou médecin — bientôt dans l\'app',
    },
  },

  accompagnement: {
    title: 'Je veux avoir un rapport',
    subtitle: 'Des questions à se poser. Sans jugement.',
    intro: {
      text: "C'est normal de se poser des questions. Cet espace te guide — pas pour te dire quoi faire, mais pour t'aider à vérifier que tu es vraiment prêt·e.",
      note: "On va te poser quelques questions simples. Aucune réponse n'est enregistrée.",
      cta: 'Commencer',
    },
    age: {
      question: 'Tu as quel âge ?',
      under15: { title: 'Moins de 15 ans', desc: "J'ai 14 ans ou moins" },
      between: { title: '15, 16 ou 17 ans', desc: "J'ai entre 15 et 17 ans" },
    },
    under15Alert: {
      title: 'Important à savoir',
      text: "En France, l'âge légal du consentement est <strong>15 ans</strong>. En dessous, tout rapport sexuel avec un adulte est un crime — même si tu dis oui. C'est la loi pour te protéger.",
      sub: "Si tu te poses des questions sur ta sexualité, sur ce que tu ressens ou sur une situation qui t'a mis·e mal à l'aise, parler à un professionnel peut vraiment aider.",
    },
    talked: {
      question: 'As-tu pu en parler à un adulte de confiance ?',
      sub: "Un parent, un médecin, une infirmière scolaire… quelqu'un en qui tu as confiance.",
      yes: "Oui, j'en ai parlé",
      no: 'Non, pas encore',
      noDec: 'Je te donne des ressources pour t\'aider',
    },
    notTalkedYet: "Ce n'est pas toujours facile d'en parler. Ces professionnels sont formés pour t'écouter sans te juger et gardent la confidentialité.",
    partnerOk: {
      question: "Ton ou ta partenaire est-il/elle vraiment d'accord ?",
      sub: "Pas juste \"il/elle n'a pas dit non\" — mais vraiment d'accord, librement ?",
      yes: "Oui, on en a parlé ensemble",
      unsure: "Je ne suis pas sûr·e",
      unsureDec: "Si c'est incertain, c'est qu'on n'est pas prêt·e",
    },
    resourcesNote: "Parler à un professionnel ne t'engage à rien — c'est juste une conversation.",
    continueAnyway: 'Continuer quand même',
    guide: {
      ready: 'Tu sembles prêt·e',
      readyDesc: "Tu as coché les cases importantes. Rappelle-toi que le consentement est continu — les deux personnes doivent rester à l'aise tout au long.",
      tip1: "Vous pouvez vous arrêter à n'importe quel moment",
      tip2: 'Dire non ou "stop" doit être respecté immédiatement',
      tip3: 'Si quelque chose fait mal, dites-le',
      tip4: 'La première fois est rarement comme dans les films',
      backHome: "Retour à l'accueil",
      seeCard: 'Voir ma carte',
    },
    backHome: 'Retour',
    filSanteJeunes: 'Fil Santé Jeunes',
    filSanteContact: '0 800 235 236 — Gratuit, anonyme',
    planningFamilial: 'Planning Familial',
    planningFamilialContact: '0 800 08 11 11 — Gratuit',
  },
} as const;
