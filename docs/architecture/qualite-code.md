# Qualité code — portes de contrôle

## Architecture des portes

```
commit  →  pre-commit  : lint-staged (fichiers modifiés uniquement, ~3s)
push    →  pre-push    : tsc.check + build (~15s + build)
CI      →  ci.yml      : lint + tests + tsc.check + build (complet, autoritaire)
```

Les hooks locaux activent automatiquement via `"prepare"` dans `package.json`
(appelé à chaque `npm install`). Activation manuelle : `git config core.hooksPath .githooks`.

---

## Pre-commit (`.githooks/pre-commit`)

```sh
./node_modules/.bin/lint-staged
```

Config dans `package.json` :
```json
"lint-staged": {
  "*.{ts,tsx}": "eslint --max-warnings=0"
}
```

Lint uniquement les fichiers **stagés** — feedback immédiat à chaque commit, <3s en pratique.

---

## Pre-push (`.githooks/pre-push`)

```sh
# 1. TypeScript — standalone grâce à tsconfig.check.json
./node_modules/.bin/tsc --noEmit --project tsconfig.check.json

# 2. Build static Next.js
npm run build
```

### Pourquoi `tsconfig.check.json` ?

`tsconfig.json` inclut `.next/types/**/*.ts` (intégration App Router Next.js).
Sans build préalable, `.next/types/` n'existe pas et `tsc` échoue.

`tsconfig.check.json` étend `tsconfig.json` en excluant `.next` et `out`,
rendant `tsc` autonome (~15s, sans dépendance sur un build préalable).

### Workaround Next.js 15.x

`next build` en mode `output: 'export'` peut retourner un exit code non-nul
sur "Collecting build traces" même quand l'export est réussi.
Le pre-push et la CI vérifient la présence de `out/index.html` comme artefact réel.

---

## CI GitHub Actions (`.github/workflows/ci.yml`)

Déclenché sur push et PR vers `main`.

```
npm ci
→ lint          (ESLint complet)
→ test:unit     (vitest run, 275 tests)
→ tsc.check     (npx tsc --noEmit --project tsconfig.check.json)
→ build         (next build + vérification out/index.html)
```

### Cache

`.next/cache` est mis en cache entre les runs CI.
Clé : `runner.os + hash(package-lock.json) + hash(app/**/*.ts,tsx)`.
Réduit le build CI de ~50% sur les runs incrémentaux.

---

## Routes de test isolées

Les pages `/minimal-test`, `/dice-test`, `/plateau-test`, `/card-collector-test`
retournent `null` en production via un guard placé **après** tous les hooks React :

```tsx
if (process.env.NODE_ENV !== 'development') return null;
```

Next.js remplace `process.env.NODE_ENV` à la compilation —
en `next build` ces pages sont vides, en `next dev` elles fonctionnent normalement.

Les fichiers TS sont quand même compilés et les pages statiques générées (vides).
Pour les supprimer entièrement du bundle, il faudrait déplacer les composants
hors du dossier `app/` et les importer dans un outil de dev séparé (Storybook ou Vitest UI).

---

## Dépendances directes

`zustand` est déclaré en dépendance directe dans `package.json`.

---

## Tests unitaires (vitest)

Lancés avec `npm run test:unit` (run unique) ou `npm test` (watch).
Environnement : jsdom + `@testing-library/react`.
Setup global : `app/test/setup.ts` (mock Capacitor + next/navigation).

23 fichiers de test · 275 assertions · 8.5s

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
| `i18n/i18n.test.ts` | clés présentes dans les 3 locales, fallback FR |
| `config/navigationInvariants.test.ts` | routes ↔ screenMeta en sync, legacy redirects, requiresAdult |
| `modules.test.ts` | cohérence modules.ts |
| `components/screens/OnboardingWizard.test.tsx` | auto-advance langue, haptics cards âge, thème pré-sélectionné, step dots |
