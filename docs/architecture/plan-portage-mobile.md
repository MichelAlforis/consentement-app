# Plan de portage mobile — iOS & Android
*Audit réalisé le 2026-04-22*

---

## Résumé exécutif

L'application est un SPA Next.js 14 (App Router, client-only), sans backend, avec un routeur maison, de la persistance via `localStorage`, et des animations Framer Motion. La structure est déjà très proche d'une app mobile (écrans empilés, safe-area, design téléphone). **Recommandation : portage via Capacitor.js**, qui enveloppe le WebApp dans une WebView native sans réécriture. React Native est possible mais représente une réécriture majeure.

---

## Choix de la stratégie

### Option A — Capacitor ✅ Recommandé

| Critère | Évaluation |
|---|---|
| Effort | Faible (1–2 semaines) |
| Code à modifier | < 5 fichiers critiques |
| Réutilisation du code | ~95 % |
| Risque | Faible |
| Accès APIs natives | Via plugins Capacitor |
| App Store / Play Store | Oui (review standard) |

**Principe :** `next build` génère des fichiers statiques → Capacitor les embarque dans une WKWebView (iOS) / WebView (Android).

### Option B — React Native ❌ Non recommandé pour l'instant

| Critère | Évaluation |
|---|---|
| Effort | Très élevé (3–6 mois) |
| Code à réécrire | ~80 % (CSS, animations, routing, localStorage, 3D) |
| Risque | Élevé |
| Avantage net vs Capacitor | Performances animations fluides (RN Reanimated) |

> À considérer seulement si les performances 3D (dés, cartes) sont jugées insuffisantes après tests Capacitor sur les appareils cibles.

---

## Audit des blocages — Capacitor

### 🔴 Bloquants (à corriger avant le premier build)

#### 1. `navigator.clipboard` non sécurisé
**Fichier :** [app/components/screens/DuoSpaceScreen.tsx](../app/components/screens/DuoSpaceScreen.tsx) ligne ~114
```ts
await navigator.clipboard.writeText(generatedCode); // pas de try/catch
```
**Problème :** L'API Clipboard requiert HTTPS + geste utilisateur. Dans WKWebView iOS elle peut échouer silencieusement ou lever une exception non interceptée.
**Fix :** Installer `@capacitor/clipboard` et remplacer par :
```ts
import { Clipboard } from '@capacitor/clipboard';
await Clipboard.write({ string: generatedCode });
```

#### 2. Bouton retour Android non géré
**Fichier :** [app/page.tsx](../app/page.tsx) — aucun listener `backButton`
**Problème :** Sur Android, le bouton retour physique/gesture quitte l'app au lieu de naviguer en arrière dans le routeur maison.
**Fix :** Ajouter dans `page.tsx` ou `useAppState.ts` :
```ts
import { App } from '@capacitor/app';
App.addListener('backButton', () => goBack());
```

#### 3. Flash de ThemeSelectScreen au démarrage
**Fichier :** [app/page.tsx](../app/page.tsx) lignes ~61
```ts
if (!themeMode || !theme) return <ThemeSelectScreen />;
```
**Problème :** `localStorage` est lu dans `useEffect` (asynchrone). Avant ce premier cycle, le thème est `null` → l'écran de sélection de thème s'affiche une fraction de seconde. Sur mobile c'est visible.
**Fix :** Ajouter un état `isHydrated` initialisé à `false`, afficher un écran de splash (couleur noire ou logo) jusqu'à ce que la lecture localStorage soit terminée.

---

### 🟠 Importants (UX dégradée sans correction)

#### 4. `navigator.vibrate` — silencieux sur iOS
**Fichiers :**
- [app/game-engine/shared/useHaptics.ts](../app/game-engine/shared/useHaptics.ts) lignes 6–8
- [app/components/screens/GooseGameScreen/utils.ts](../app/components/screens/GooseGameScreen/utils.ts) lignes 1–4

**Problème :** L'API `vibrate` Web n'existe pas sur iOS (WKWebView). Les gardes `'vibrate' in navigator` empêchent le crash mais le feedback haptique est perdu sur tous les iPhones — or les jeux (dés, oie) s'appuient dessus.
**Fix :** Remplacer par `@capacitor/haptics` :
```ts
import { Haptics, ImpactStyle } from '@capacitor/haptics';
await Haptics.impact({ style: ImpactStyle.Medium });
```

#### 5. `backdrop-filter: blur` — jank Android
**Fichiers :**
- [app/components/ui/Header.tsx](../app/components/ui/Header.tsx) lignes 21, 32 (`backdrop-blur-xl`, `backdrop-blur`)
- [app/globals.css](../app/globals.css) ligne 25 (`.glass`)
- WelcomeScreen, GamesHubScreen, DuoNavBar, ThemeSelectScreen

**Problème :** `backdrop-filter: blur` est très coûteux en GPU sur Android mid-range. Le Header s'affiche à chaque écran.
**Fix recommandé :** Remplacer le blur par un fond opaque semi-transparent sur Android. Utiliser un plugin Capacitor ou un `userAgent` check pour désactiver le blur conditionnellement :
```ts
const isAndroid = Capacitor.getPlatform() === 'android';
```

#### 6. Hover CSS — states collants sur iOS
**Problème :** Les classes Tailwind `hover:` et Framer Motion `whileHover` ne correspondent à rien sur les écrans tactiles. Sur iOS les states hover se "collent" après un tap.
**Fichiers concernés :** Button.tsx, Card.tsx, MenuCard.tsx, CardGameScreen.tsx (20+ usages)
**Fix :** Remplacer `whileHover` par `whileTap` ou utiliser `@media (hover: hover)` pour les classes CSS.

#### 7. `WebkitBackfaceVisibility` manquant sur CardRenderer
**Fichier :** [app/game-engine/cards/CardRenderer.tsx](../app/game-engine/cards/CardRenderer.tsx) lignes 48, 78
**Problème :** Le préfixe webkit est présent dans DiceRenderer et CardGameScreen mais absent dans CardRenderer, ce qui peut provoquer un artefact de flip de carte sur iOS (la face arrière visible pendant la rotation).
**Fix :** Ajouter `WebkitBackfaceVisibility: 'hidden'` aux deux styles concernés.

---

### 🟡 Mineurs (polish, pas bloquants)

#### 8. Barre de démo en production
**Fichier :** [app/page.tsx](../app/page.tsx) lignes ~242–294
**Problème :** La barre de navigation de démo (boutons pour switcher d'écran) ne doit pas apparaître dans le build App Store.
**Fix :** Conditionner à `process.env.NODE_ENV === 'development'` ou supprimer.

#### 9. Emojis — rendu inconsistant iOS/Android
**Problème :** Les emojis sont utilisés comme contenu visuel principal (pions, faces de dés, confettis, icônes de catégories). Le rendu varie significativement entre iOS (Apple emojis) et Android (Google/Samsung emojis). Le jeu de l'oie et le jeu de dés sont particulièrement exposés.
**Fix optionnel :** Intégrer [Twemoji](https://github.com/twitter/twemoji) pour un rendu uniforme cross-platform.

#### 10. `autoFocus` sur les inputs
**Fichiers :** AuthScreen.tsx ligne ~69, DuoSpaceScreen.tsx ligne ~540
**Problème :** Sur mobile, `autoFocus` déclenche l'ouverture du clavier immédiatement, ce qui remonte le contenu et peut casser les layouts `min-h-dvh`.
**Fix :** Retirer `autoFocus` ou le déclencher uniquement après un délai.

#### 11. Filtre SVG `feTurbulence` (thème Nude)
**Fichier :** [app/components/ui/ThemeEffects.tsx](../app/components/ui/ThemeEffects.tsx) lignes 11–14
**Problème :** Le filtre grain SVG avec `feTurbulence` est composité par GPU + `mixBlendMode: 'overlay'`. Sur les anciens iPhones cela peut consommer de la batterie.
**Fix :** Remplacer par une image PNG grain statique (plus performant).

---

## Ce qui fonctionne déjà parfaitement

- **localStorage** — fonctionne nativement dans WKWebView et WebView Android. Toute la couche de persistance est réutilisable sans modification.
- **Framer Motion** — fonctionne dans le WebView. Animations fluides sur appareils récents.
- **CSS 3D transforms** (`preserve-3d`, `perspective`, dés, cartes) — supporté par les engines WebKit/Chromium embarqués.
- **Police système** (`-apple-system`, `Roboto`) — parfaitement optimisée pour chaque plateforme.
- **Icônes Lucide** (SVG inline) — aucun CDN, aucune dépendance réseau.
- **Aucune requête réseau** — l'app est 100% offline-capable. Idéal pour une app mobile.
- **Safe-area** — `env(safe-area-inset-*)` déjà référencé dans `globals.css`, `viewportFit: 'cover'` déjà dans `layout.tsx`. Le notch iOS et la barre de gestes Android sont déjà pris en compte.
- **Routeur maison** — compatible Capacitor sans modification (sauf le bouton retour Android, cf. point 2).

---

## Plan d'implémentation Capacitor

### Phase 1 — Setup (jour 1)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init "Consentement" "fr.consentement.app" --web-dir out
```

Configurer `next.config.js` pour l'export statique :
```js
output: 'export',
images: { unoptimized: true },
```

Créer `capacitor.config.ts` :
```ts
import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'fr.consentement.app',
  appName: 'Consentement',
  webDir: 'out',
  ios: { contentInset: 'always' },
  android: { backgroundColor: '#000000' },
};
export default config;
```

```bash
npx cap add ios
npx cap add android
```

### Phase 2 — Corrections bloquantes (jours 2–3)

1. **Clipboard** — installer `@capacitor/clipboard`, patcher `DuoSpaceScreen.tsx`
2. **Back button Android** — ajouter listener dans `useAppState.ts`
3. **Splash screen hydration** — ajouter état `isHydrated` dans `useAppState.ts`, afficher un splash

Installer les plugins nécessaires :
```bash
npm install @capacitor/clipboard @capacitor/haptics @capacitor/app @capacitor/splash-screen
```

### Phase 3 — Corrections importantes (jours 4–5)

4. **Haptics** — refactorer `useHaptics.ts` pour utiliser `@capacitor/haptics`
5. **Hover → Tap** — remplacer `whileHover` par `whileTap` dans Button, Card, MenuCard
6. **WebkitBackfaceVisibility** — patcher `CardRenderer.tsx`
7. **Démo nav bar** — conditionner à `NODE_ENV`
8. **backdrop-filter Android** — désactiver le blur sur `Capacitor.getPlatform() === 'android'`

### Phase 4 — Build & test (jours 6–7)

```bash
npm run build
npx cap sync
npx cap open ios     # Xcode
npx cap open android # Android Studio
```

**Appareils de test prioritaires :**
- iOS : iPhone SE 2e gen (petit écran, A13), iPhone 14 (écran récent)
- Android : Samsung Galaxy A54 (mid-range, Android 13), Pixel 6 (référence)

**Checklist de test :**
- [ ] Démarrage froid : pas de flash ThemeSelectScreen
- [ ] Thème persisté après fermeture/réouverture
- [ ] Navigation retour Android (bouton et geste)
- [ ] Jeu de dés : vibration haptique iOS
- [ ] Duo Space : copie du code de liaison
- [ ] Jeu de l'oie : sauvegarde persist entre sessions
- [ ] Jeu de cartes : flip des cartes (iOS, pas d'artefact)
- [ ] Tous les thèmes : rendu premium (shimmer, grain)
- [ ] Safe area : notch iPhone et barre navigation Android

### Phase 5 — App Store / Play Store (semaine 2)

**iOS (App Store)**
- Compte Apple Developer (99€/an)
- Assets requis : icône app 1024×1024 px, screenshots iPhone 6.5"
- Capacitor génère le projet Xcode → archive → TestFlight → Review
- Points d'attention review Apple : catégorie "Éducation", contenu pour mineurs → vérifier conformité COPPA/RGPD dans la description

**Android (Play Store)**
- Compte Google Play (25$ one-time)
- Assets requis : icône 512×512, feature graphic 1024×500, screenshots
- `npx cap build android --release` → APK/AAB signé
- Points d'attention : `targetSdkVersion` 34 minimum pour 2024+

---

## Dépendances à ajouter (résumé)

```json
{
  "@capacitor/core": "^6.0.0",
  "@capacitor/cli": "^6.0.0",
  "@capacitor/ios": "^6.0.0",
  "@capacitor/android": "^6.0.0",
  "@capacitor/app": "^6.0.0",
  "@capacitor/clipboard": "^6.0.0",
  "@capacitor/haptics": "^6.0.0",
  "@capacitor/splash-screen": "^6.0.0"
}
```

---

## Risques et mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Review Apple refusée (contenu mineur) | Moyenne | Élevé | Documenter le contrôle parental, catégorie 17+ ou Éducation |
| Performances Android mid-range | Moyenne | Moyen | Désactiver backdrop-blur Android, profiler avec Chrome DevTools remote |
| Framer Motion jank sur vieux iPhone | Faible | Faible | Réduire `duration` des animations, tester sur iPhone SE |
| `localStorage` quota dépassé | Très faible | Faible | Les saves sont légères (~2 KB max) |
| Rejet App Store — IAP non natif | Moyenne | Élevé | Le système premium actuel (flag `isPremium`) devra utiliser StoreKit 2 (iOS) / Google Play Billing pour être conforme aux guidelines |

> **Point critique App Store :** Apple exige que les achats intégrés passent par StoreKit 2 (commission 30%). Le flag `isPremium` actuel devra être connecté à `@capawesome/capacitor-purchases` ou `RevenueCat` (déjà mentionné dans `docs/vision/roadmap.md`).

---

## Estimation effort total

| Phase | Durée estimée |
|---|---|
| Setup Capacitor | 0.5 jour |
| Corrections bloquantes | 2 jours |
| Corrections importantes | 2 jours |
| Build + tests appareils | 2 jours |
| Soumission stores + assets | 2 jours |
| **Total** | **~8–9 jours développeur** |
