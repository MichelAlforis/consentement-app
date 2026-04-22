import { ui } from './ui';
import { onboarding } from './onboarding';
import { home } from './home';
import { spaces } from './spaces';
import { education } from './education';
import { games } from './games';
import { data } from './data';

export const fr = { ...ui, ...onboarding, ...home, ...spaces, ...education, ...games, ...data };
export type Translations = typeof fr;
