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

export const en = {
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
    definition: 'Definition',
    consentement: 'Consent',
    loi: 'What the law says',
    question: 'Question to ask yourself',
  },
  nav: {
    previous: 'Previous',
    next: 'Next',
    finish: 'Finish',
  },
  premium: {
    gateMessage: 'This content is reserved for Premium members',
    unlockCta: 'Unlock Premium',
    title: 'Go Premium',
    subtitle: 'Access all exclusive content, without limits.',
    cta: 'Start — €4.99 / month',
    purchasing: 'Processing…',
    restore: 'Restore purchases',
    restoring: 'Restoring…',
    errorTitle: 'Purchase failed',
    errorMessage: 'The purchase could not be completed. Check your connection or try again.',
    restoreErrorTitle: 'Restore failed',
    restoreErrorMessage: 'No purchases found for this account.',
    features: [
      { label: 'Explicit content unlocked' },
      { label: 'All Kamasutra positions' },
      { label: 'Premium games without restriction' },
      { label: 'New cards every month' },
    ],
  },
};

export type EnTranslations = typeof en;
