// BARREL — ne jamais transformer en export * glob (R7)
import { games } from './games';
import { moduleDeBase } from './moduleDeBase';
import { pratiquesBase } from './pratiquesBase';
import { pratiquesAvancees } from './pratiquesAvancees';
import { pratiquesExplicit } from './pratiquesExplicit';
import { lexiqueConsent } from './lexiqueConsent';
import { scenariosQuotidiens } from './scenariosQuotidiens';
import { bdsmConsent } from './bdsmConsent';
import { sexting } from './sexting';
import { pressionManip } from './pressionManip';
import { ruptureHarcele } from './ruptureHarcele';
import { contentNonConsenti } from './contentNonConsenti';
import { zonesGrises } from './zonesGrises';
import { lgbtqConsent } from './lgbtqConsent';
import { alcoolConsent } from './alcoolConsent';

export const fr = {
  ...games,
  ...moduleDeBase,
  ...pratiquesBase,
  ...pratiquesAvancees,
  ...pratiquesExplicit,
  ...lexiqueConsent,
  ...scenariosQuotidiens,
  ...bdsmConsent,
  ...sexting,
  ...pressionManip,
  ...ruptureHarcele,
  ...contentNonConsenti,
  ...zonesGrises,
  ...lgbtqConsent,
  ...alcoolConsent,
  ficheSection: {
    definition: 'Définition',
    consentement: 'Consentement',
    loi: 'Ce que dit la loi',
    question: 'Question à se poser',
  },
  nav: {
    previous: 'Précédent',
    next: 'Suivant',
    finish: 'Terminer',
  },
  premium: {
    gateMessage: 'Ce contenu est réservé aux membres Premium',
    unlockCta: 'Débloquer Premium',
    title: 'Passer à Premium',
    subtitle: 'Accédez à tout le contenu exclusif, sans limites.',
    cta: 'Commencer — 4,99 € / mois',
    purchasing: 'Traitement en cours…',
    restore: 'Restaurer mes achats',
    restoring: 'Restauration…',
    errorTitle: 'Achat impossible',
    errorMessage: "L'achat n'a pas pu aboutir. Vérifie ta connexion ou réessaie.",
    restoreErrorTitle: 'Restauration impossible',
    restoreErrorMessage: 'Aucun achat trouvé pour ce compte.',
    features: [
      { label: 'Contenu explicite débloqué' },
      { label: 'Toutes les positions Kamasutra' },
      { label: 'Jeux premium sans restriction' },
      { label: 'Nouvelles cartes chaque mois' },
    ],
  },
};

export type FrTranslations = typeof fr;
