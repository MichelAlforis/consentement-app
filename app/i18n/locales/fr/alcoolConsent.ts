export const alcoolConsent = {
  alcoolConsent: {
    quiz: {
      title: 'Alcool & consentement',
      subtitle: 'Ce que l\'alcool change (vraiment)',
      scoreLabels: {
        excellent: 'Tu maîtrises le sujet',
        good: 'Bonne base, continue',
        notBad: 'Quelques zones grises',
        retry: 'À retravailler',
      },
      0: {
        question: 'Quelqu\'un a bu et dit "oui". Ce consentement est-il valable ?',
        options: {
          0: 'Oui, il/elle a quand même dit oui',
          1: 'Non, une personne ivre ne peut pas consentir valablement',
          2: 'Ça dépend de combien il/elle a bu',
          3: 'Oui si c\'est une relation longue durée',
        },
        explanation: 'Le consentement doit être libre et éclairé. Sous l\'influence de l\'alcool, le jugement est altéré — même un "oui" n\'est pas valable légalement ni éthiquement.',
      },
      1: {
        question: 'Tu as bu, tu regrettes ce qui s\'est passé. Peut-il y avoir eu agression ?',
        options: {
          0: 'Oui, si tu n\'étais pas en état de consentir librement',
          1: 'Non, tu étais conscient·e et tu as dit oui',
          2: 'Non, l\'alcool ne change rien à la responsabilité',
          3: 'Ça dépend si tu as résisté ou non',
        },
        explanation: 'Profiter de l\'état d\'ivresse d\'une personne est une circonstance aggravante dans le droit pénal français. Le regret seul ne suffit pas — mais l\'incapacité à consentir, oui.',
      },
      2: {
        question: 'Votre soirée commence bien. Ton/ta partenaire boit beaucoup. Que faire ?',
        options: {
          0: 'Continuer — il/elle a l\'habitude de boire',
          1: 'Rien de particulier, c\'est une décision adulte',
          2: 'Vérifier qu\'il/elle est toujours à l\'aise avant de continuer',
          3: 'Stopper automatiquement — impossible de continuer',
        },
        explanation: 'La vigilance est une responsabilité partagée. Vérifier verbalement ("Tu es ok ? Tu veux qu\'on continue ?") est la bonne pratique — pas paranoïaque, juste respectueux.',
      },
      3: {
        question: 'Une personne répond à peine, les yeux mi-clos. Elle a dit "ouais" tout à l\'heure.',
        options: {
          0: 'C\'est ok, elle a dit oui',
          1: 'C\'est suffisant si la relation est établie',
          2: 'On attends de voir comment elle évolue',
          3: 'Stop. Elle n\'est clairement pas en état de consentir maintenant',
        },
        explanation: 'Le consentement doit être actif et présent au moment de l\'acte. Un "oui" dit 20 minutes avant ne couvre pas ce qui se passe maintenant.',
      },
      4: {
        question: 'Après une soirée, tu n\'es pas sûr·e que l\'autre était vraiment ok. Tu fais quoi ?',
        options: {
          0: 'Rien, ça s\'est passé, c\'est fini',
          1: 'Tu minimises — tu avais probablement l\'air consentant·e',
          2: 'Tu l\'évites pour ne pas avoir la conversation',
          3: 'Tu en parles franchement, même si c\'est inconfortable',
        },
        explanation: 'Les conversations après coup sont difficiles mais nécessaires. "Est-ce que tu étais ok hier ?" est une question qui peut changer beaucoup de choses pour l\'autre.',
      },
      5: {
        question: 'Servir de l\'alcool à quelqu\'un pour le/la rendre plus "disponible", c\'est :',
        options: {
          0: 'Une technique de séduction classique',
          1: 'Douteux mais pas illégal',
          2: 'Incorrect seulement si on force à boire',
          3: 'Une forme de manipulation qui peut constituer une agression',
        },
        explanation: 'Administrer volontairement une substance pour altérer le consentement est un délit en droit français, même si la personne "accepte" de boire. L\'intention de profiter de l\'état est ce qui est réprimé.',
      },
    },
    loi: {
      title: 'Alcool & droit',
      subtitle: 'Ce que dit la loi française',
      alert: {
        title: 'Principe fondamental',
        text: 'Le Code pénal français reconnaît explicitement l\'état d\'ivresse comme circonstance empêchant le consentement. Profiter de cet état est une infraction pénale — qu\'il y ait eu "oui" ou non.',
      },
      source1: 'Sources : Code pénal art. 222-22, 222-22-1 · Jurisprudence Cour de cassation',
      source2: 'Mis à jour : janvier 2026 — consulter un juriste pour les cas individuels',
      0: {
        titre: 'Ivresse et incapacité à consentir',
        contenu: 'Une personne en état d\'ivresse avancée est considérée hors d\'état de consentir librement. Avoir un rapport sexuel avec elle dans cet état constitue un viol ou une agression sexuelle (art. 222-22 CP), même sans violence physique.',
      },
      1: {
        titre: 'Circonstance aggravante reconnue',
        contenu: 'Depuis 2021, la loi précise explicitement que la "particulière vulnérabilité due à l\'état d\'ivresse" est une circonstance aggravante des infractions sexuelles. Les peines sont alourdies.',
      },
      2: {
        titre: 'Administrer une substance pour obtenir un rapport',
        contenu: 'Faire boire quelqu\'un dans l\'intention de profiter de son état est un acte délibéré qui aggrave encore la qualification pénale. Cela s\'applique aussi aux drogues du viol (GHB, benzodiazépines).',
      },
      3: {
        titre: 'Le "elle n\'a pas dit non" ne suffit pas',
        contenu: 'La loi française ne demande plus à la victime de prouver qu\'elle a résisté. Si la personne était dans un état qui l\'empêchait de consentir, l\'infraction est caractérisée — même sans "non" explicite.',
      },
      4: {
        titre: 'Dépôt de plainte après une soirée',
        contenu: 'Il est possible de porter plainte même des jours après les faits. Les analyses toxicologiques peuvent détecter la présence de substances jusqu\'à 72h. Conserver les preuves : messages, témoignages, examens médicaux.',
      },
      5: {
        titre: 'Si tu as un doute sur une situation passée',
        contenu: 'Le Planning Familial (0800 08 11 11, gratuit) et le 3919 (Violences Femmes Info) offrent une écoute confidentielle et peuvent orienter vers des juristes spécialisés, sans obligation de dépôt de plainte.',
      },
    },
  },
};
