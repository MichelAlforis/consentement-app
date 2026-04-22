# Runbook — Consentement App

Application mobile (iOS/Android) éducative sur le consentement. Stack : Next.js 15 + Capacitor 8, déployée exclusivement sur App Store et Google Play.

---

## Prérequis

| Outil | Version minimale |
|-------|-----------------|
| Node.js | 18+ |
| npm | 10+ |
| Xcode | 15+ (iOS) |
| Android Studio | Hedgehog+ (Android) |
| Cocoapods | dernière stable (iOS) |

---

## Installation

```bash
git clone <repo>
cd consentement-app
npm install
cp .env.example .env.local
```

Éditer `.env.local` — seule variable requise en dev :

```
NEXT_PUBLIC_MOBILE=false
```

---

## Développement web

```bash
npm run dev          # http://localhost:3000 avec hot reload
```

Le mode web sert uniquement au développement UI. L'app cible finale est mobile uniquement.

### TypeScript

```bash
./node_modules/.bin/tsc --noEmit    # vérification statique sans build
```

### Lint & format

```bash
npm run lint            # ESLint (Next.js + TypeScript + Prettier compat)
npm run format          # Prettier en écriture
npm run format:check    # Prettier en lecture seule (CI)
```

---

## Build web (Vercel)

```bash
npm run build     # build Next.js standard
npm run start     # serveur de production local
```

Déploiement automatique sur **Vercel** à chaque push sur `main`. Variable CI requise : `VERCEL_OIDC_TOKEN` (générée par Vercel, ne pas committer).

---

## Build mobile (Capacitor)

La build mobile génère un export statique (`out/`) puis le synchronise dans les projets natifs iOS/Android.

### Première fois (initialisation)

```bash
npx cap add ios
npx cap add android
```

### Build & sync (à chaque changement web)

```bash
npm run build:mobile    # NEXT_PUBLIC_MOBILE=true next build && cap sync
```

Ce script :
1. Active l'export statique (`output: 'export'`)
2. Génère `out/`
3. Copie `out/` dans les projets natifs via `cap sync`

### Ouvrir dans l'IDE natif

```bash
npm run cap:ios        # ouvre Xcode
npm run cap:android    # ouvre Android Studio
```

Depuis Xcode / Android Studio, lancer la build et le déploiement sur device/simulateur.

### Cibles

| Plateforme | Version minimale |
|------------|-----------------|
| iOS | 13+ |
| Android | API 22 (Android 5.1) |

### App ID

```
fr.consentement.app
```

---

## Tests

### Unitaires (Vitest)

```bash
npm run test              # mode watch
npm run test:coverage     # rapport de couverture (v8, HTML dans coverage/)
```

- Environnement : `jsdom`
- Setup : `app/test/setup.ts` (mocks Capacitor + next/navigation)
- Fichiers : `app/**/*.{test,spec}.{ts,tsx}`

### E2E (Playwright)

```bash
npm run test:e2e        # headless, mobile Chrome + mobile Safari
npm run test:e2e:ui     # interface interactive
```

- Nécessite le serveur dev actif sur `http://localhost:3000` (lancé automatiquement)
- Profils de test : Pixel 5 (Chrome), iPhone 12 (Safari)
- Artifacts en cas d'échec : screenshot + vidéo dans `test-results/`

---

## Variables d'environnement

| Variable | Dev | Mobile build | CI | Description |
|----------|:---:|:---:|:---:|-------------|
| `NEXT_PUBLIC_MOBILE` | `false` | `true` | `false` | Active l'export statique Capacitor |
| `VERCEL_OIDC_TOKEN` | — | — | auto | Auth Vercel (généré, ne pas définir manuellement) |
| `NEXT_PUBLIC_SUPABASE_URL` | — | — | — | Backend (non actif) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | — | — | — | Backend (non actif) |
| `NEXT_PUBLIC_POSTHOG_KEY` | — | — | — | Analytics (non actif) |

---

## Architecture des répertoires

```
app/
├── components/       # Composants UI et écrans
├── context/          # ThemeContext, LanguageContext, ToastContext
├── data/             # Données statiques (jeux, contenus)
├── game-engine/      # Logique jeux (dé, cartes, jeu de l'oie)
├── hooks/            # Hooks custom (haptics, back button…)
├── i18n/             # Internationalisation (fr/en)
├── lib/              # Utilitaires (platform.ts : détection Capacitor)
├── stores/           # État global Zustand (auth, nav, settings, premium…)
├── test/             # Setup Vitest
├── types/            # Types TypeScript partagés
├── globals.css
├── layout.tsx        # Root layout Next.js
└── page.tsx          # Composant SPA principal (routing écrans)

android/              # Projet natif Android (Capacitor)
ios/                  # Projet natif iOS (Capacitor)
out/                  # Export statique (généré, gitignored)
e2e/                  # Tests Playwright
docs/                 # Documentation technique
```

---

## Flux de travail habituel

```
1. npm run dev                  # dev UI dans le navigateur
2. ./node_modules/.bin/tsc --noEmit  # vérification types
3. npm run lint                 # lint
4. npm run test                 # tests unitaires
5. git push → Vercel deploy     # preview web automatique
6. npm run build:mobile         # build Capacitor
7. npm run cap:ios / cap:android # ouvrir et distribuer
```

---

## Problèmes courants

### `NEXT_PUBLIC_MOBILE` oublié → `out/` absent

Symptôme : `cap sync` échoue avec "web asset directory does not exist".  
Cause : build Next.js sans `output: 'export'`.  
Fix : utiliser `npm run build:mobile`, pas `npm run build`.

### Hot reload cassé sur simulateur

Capacitor sert les assets depuis `out/` (statique). Pour du vrai hot reload en dev mobile, configurer `server.url` dans `capacitor.config.ts` pour pointer vers `http://localhost:3000`. Ne pas committer cette modification.

### Erreur CocoaPods sur iOS

```bash
cd ios && pod install --repo-update
```

### `tsc --noEmit` non trouvé

```bash
./node_modules/.bin/tsc --noEmit
```

`npx tsc` peut échouer si nvm n'est pas initialisé dans le shell courant.
