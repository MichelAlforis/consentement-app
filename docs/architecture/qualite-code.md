# Qualité code — portes de contrôle

## Ce qui est en place

### Pre-push hook local (`.githooks/pre-push`)

Activé automatiquement via le script `prepare` à chaque `npm install`.
Ordre imposé : lint → build → tsc.

```
npm run lint            # ESLint — rapide (~10s)
npm run build           # next build — génère .next/types/ requis par tsc
./node_modules/.bin/tsc --noEmit   # vérification TypeScript finale
```

> `.next/types/**/*.ts` est inclus dans `tsconfig.json` (intégration App Router).
> `tsc --noEmit` ne peut donc tourner qu'après un `next build`.

### CI GitHub Actions (`.github/workflows/ci.yml`)

Déclenché sur push et PR vers `main`. Même séquence que le hook local.

```
npm ci → lint → build → tsc
```

### Routes de test isolées

Les pages `/minimal-test`, `/dice-test`, `/plateau-test`, `/card-collector-test`
retournent `null` en production via un guard placé après tous les hooks React :

```tsx
if (process.env.NODE_ENV !== 'development') return null;
```

Next.js évalue `process.env.NODE_ENV` à la compilation — en `next build` (production),
ces pages sont vides. En `next dev`, elles fonctionnent normalement.

### Dépendances directes

`zustand` est déclaré en dépendance directe dans `package.json` (pas de dépendance transitive).

---

## Tests unitaires (vitest)

Lancés avec `npm run test:unit` (run unique) ou `npm test` (watch).
Environnement : jsdom + `@testing-library/react`.
Setup global : `app/test/setup.ts` (mock Capacitor + next/navigation).

### Couverture actuelle

| Fichier test | Ce qui est testé |
|---|---|
| `lib/heatLevel.test.ts` | `computeHeatPoints`, paliers, progress, `pointsToNextLevel` |
| `lib/progressLevel.test.ts` | niveaux Découverte / Apprentissage / Maîtrise |
| `lib/computeGainedCards.test.ts` | gain de cartes par module |
| `lib/computeModuleGain.test.ts` | points par module (easy/medium/hard) |
| `lib/heatGate.test.ts` | gate palier 2 explicit |
| `lib/sampleCard.test.ts` | sampling pool cartes |
| `lib/accessControl.test.ts` | règles d'accès par age/palier |
| `lib/useModuleComplete.test.ts` | hook completion module |
| `lib/logger.test.ts` | logger singleton |
| `i18n/i18n.test.ts` | clés présentes dans les 3 locales |
| `config/navigationInvariants.test.ts` | routes ↔ screenMeta en sync, legacy redirects, requiresAdult |
| `modules.test.ts` | cohérence modules.ts |
| `components/screens/OnboardingWizard.test.tsx` | auto-advance langue, haptics cards âge, thème pré-sélectionné, step dots |

### Stratégie de mock — OnboardingWizard

Tous les contextes React (`useTheme`, `useLanguage`, `useTranslation`, `useHaptics`) et les stores Zustand
sont mockés via `vi.hoisted()` + `vi.mock()`. `framer-motion` est remplacé par des wrappers HTML nus
pour isoler le comportement de rendu des animations. Les timers sont faux (`vi.useFakeTimers`) pour
tester le `setTimeout(onNext, 300)` de la sélection de langue sans attendre.

---

## Limites connues

- Le pre-push hook est **lent** : `next build` dure 1–3 min. Un push simple déclenche un build complet.
- `tsc --noEmit` est **redondant** après `next build` qui type-check déjà en interne.
- Les pages de test sont dans le **bundle de production** (fichiers statiques générés, mais vides).
- La CI ne lance **pas les tests unitaires** (`vitest run`) — à ajouter dans `.github/workflows/ci.yml`.
