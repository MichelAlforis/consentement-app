import { ui } from './ui';
import { onboarding } from './onboarding';
import { home } from './home';
import { spaces } from './spaces';
import { education } from './education';
import { games } from './games';
import { data } from './data';
import { quizMultiLevel } from './quizMultiLevel';
import { pratiquesBase } from './pratiquesBase';
import { lexiqueConsent } from './lexiqueConsent';
import { scenariosQuotidiens } from './scenariosQuotidiens';

export const fr = { ...ui, ...onboarding, ...home, ...spaces, ...education, ...games, ...data, ...quizMultiLevel, ...pratiquesBase, ...lexiqueConsent, ...scenariosQuotidiens };
export type Translations = typeof fr;
