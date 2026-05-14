export const scenariosQuotidiens = {
  scenariosQuotidiens: {
    scenarios: {
      title: 'Scénarios du quotidien',
      subtitle: 'Pas de bonne réponse unique — juste des vraies situations à explorer.',
      labelChoix: 'Que fais-tu ?',
      labelConsequence: 'Ce qui se passe',
      btnNext: 'Scénario suivant',
      btnDone: 'Terminer — Voir ma carte',
      progress: '{current} / {total}',
      0: {
        situation: 'Tu es chez quelqu\'un que tu viens de rencontrer. L\'ambiance est bonne, vous vous embrassez. Il ou elle commence à défaire tes vêtements. Tu n\'as pas vraiment envie d\'aller plus loin ce soir, mais tu ne sais pas comment le dire sans "casser l\'ambiance".',
        c0: {
          texte: 'Tu te laisses faire — de toute façon c\'est agréable.',
          consequence: 'Continuer sans envie réelle, c\'est mettre ton propre bien-être en parenthèse. Le consentement, c\'est aussi ton désir — pas juste l\'absence de refus. Sur le long terme, ça peut créer des situations où tu te sens utilisé·e.',
        },
        c1: {
          texte: 'Tu dis : "Attends, je voudrais qu\'on ralentisse un peu."',
          consequence: 'C\'est la meilleure option. Simple, direct, sans dramatiser. Une personne qui te respecte s\'arrêtera immédiatement. Si elle insiste malgré ça, c\'est une information importante sur elle.',
        },
        c2: {
          texte: 'Tu t\'inventes une excuse (mal à la tête, heure tardive).',
          consequence: 'Ça marche à court terme, mais ça ne t\'entraîne pas à communiquer clairement. Et si l\'autre pense que c\'est "juste ce soir", ça peut créer des malentendus pour la prochaine fois.',
        },
        c3: {
          texte: 'Tu continues et tu espères que ça se passe bien.',
          consequence: 'Espérer que ça passe plutôt que de le dire, c\'est mettre ton bien-être en pause. Ce n\'est pas une question de courage — c\'est une habitude qui s\'apprend. Commencer par "attends" suffit.',
        },
      },
      1: {
        situation: 'Tu es avec ton/ta partenaire depuis plusieurs mois. Ce soir, tu es fatigué·e et tu n\'as pas envie. Il ou elle commence à se rapprocher. Quand tu dis que tu n\'as pas envie, il ou elle répond : "Mais on n\'a pas été intimes depuis une semaine, tu ne m\'aimes plus ?"',
        c0: {
          texte: 'Tu cèdes pour éviter le conflit.',
          consequence: 'Céder régulièrement par peur du conflit, c\'est enseigner à l\'autre que ton "non" est négociable. Ça crée un déséquilibre dans la relation qui peut devenir toxique avec le temps.',
        },
        c1: {
          texte: 'Tu dis calmement : "Je t\'aime, mais là j\'ai vraiment besoin de dormir."',
          consequence: 'Séparer amour et envie sexuelle, c\'est sain. Dans une relation équilibrée, l\'autre comprend que ton "non" ce soir ne remet pas la relation en question. Si ce message est difficile à recevoir, c\'est un sujet à aborder ensemble.',
        },
        c2: {
          texte: 'Tu reproches à l\'autre de faire pression.',
          consequence: 'La pression était réelle, mais transformer ça en reproche frontal peut bloquer la conversation. Exprimer ton ressenti en "je" ("je me sens obligé·e") est souvent plus efficace qu\'une accusation directe.',
        },
        c3: {
          texte: 'Tu acceptes mais en le/la faisant culpabiliser.',
          consequence: 'Accepter à contrecœur tout en faisant peser la culpabilité ne résout rien. Les deux personnes restent insatisfaites — l\'une a eu ce qu\'elle voulait, mais sans un vrai "oui".',
        },
      },
      2: {
        situation: 'Tu es à une fête. Quelqu\'un que tu trouves attirant·e t\'a beaucoup parlé toute la soirée. Vous avez tous les deux bien bu. À la fin, il ou elle te propose de rentrer ensemble. Tu te sens attiré·e, mais aussi un peu flou·e dans ta tête.',
        c0: {
          texte: 'Tu acceptes — l\'ambiance était bonne, et tu en avais envie plus tôt.',
          consequence: 'L\'envie ressentie en début de soirée était réelle, mais l\'alcool brouille la capacité à décider librement. Ni toi ni l\'autre ne pouvez donner un consentement valable dans cet état. Ce n\'est pas une condamnation — c\'est une protection pour les deux.',
        },
        c1: {
          texte: 'Tu proposes d\'échanger vos numéros et de vous revoir sobres.',
          consequence: 'Meilleure décision. Si l\'attirance est réelle, elle sera encore là demain. Vous pourrez alors décider librement, sans flou. Une personne qui refuse cette idée "parce que c\'est le moment" mérite qu\'on s\'interroge sur ses motivations.',
        },
        c2: {
          texte: 'Tu pars sans rien dire — mieux vaut éviter le risque.',
          consequence: 'Partir est une option valable, mais sans explication ça peut être confus pour l\'autre. Si tu te sens trop mal à l\'aise pour parler, c\'est souvent un signal que la situation n\'est pas sûre — écoute ce signal.',
        },
        c3: {
          texte: 'Tu rentres avec lui/elle mais tu décides de "ne rien faire".',
          consequence: 'Les bonnes intentions ne suffisent pas quand les deux personnes sont alcoolisées. La ligne entre "on ne fait rien" et "on finit par faire quelque chose" devient floue. La décision la plus sûre se prend toujours quand on est sobre.',
        },
      },
      3: {
        situation: 'Tu embrasses quelqu\'un que tu aimes bien. L\'ambiance est bonne. Tu commences à aller plus loin. L\'autre ne dit rien, ne résiste pas — mais tu remarques qu\'il ou elle ne participe pas vraiment : corps passif, regard ailleurs.',
        c0: {
          texte: 'Tu continues — s\'il ou elle ne dit pas non, c\'est ok.',
          consequence: 'Le silence n\'est pas un consentement. Une personne peut être tétanisée, embarrassée ou incapable de s\'exprimer dans l\'instant. Continuer en interprétant le silence comme un accord, c\'est prendre un risque sérieux — moral et légal.',
        },
        c1: {
          texte: 'Tu t\'arrêtes et tu demandes : "Ça va ? Tu as envie qu\'on continue ?"',
          consequence: 'Geste parfait. Quelques secondes pour vérifier changent tout. Si l\'autre dit oui avec enthousiasme, vous continuez. Sinon, vous avez évité quelque chose dont l\'un de vous n\'avait pas envie. C\'est ça, communiquer.',
        },
        c2: {
          texte: 'Tu t\'arrêtes, mais tu attends que l\'autre reprenne l\'initiative.',
          consequence: 'S\'arrêter est bien, mais le silence persistant ne règle pas le malaise. Poser la question directement est beaucoup plus efficace qu\'attendre en silence.',
        },
        c3: {
          texte: 'Tu ralentis et tu espères que l\'atmosphère change.',
          consequence: 'Ralentir montre que tu as capté quelque chose, c\'est un instinct sain. Mais sans communication, les deux personnes restent dans le flou. L\'autre ne sait pas que tu as remarqué son malaise.',
        },
      },
    },
  },
};
