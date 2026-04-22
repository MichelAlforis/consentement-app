# Portage mobile — État d'avancement
*Dernière mise à jour : 2026-04-22*

---

## Ce qui est déjà intégré dans le code

### Infrastructure Capacitor
- [x] Packages installés : `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`, `@capacitor/app`, `@capacitor/clipboard`, `@capacitor/haptics`, `@capacitor/splash-screen`
- [x] [capacitor.config.ts](../capacitor.config.ts) créé (`appId: fr.consentement.app`)
- [x] [next.config.js](../next.config.js) — mode export statique activable via `NEXT_PUBLIC_MOBILE=true`
- [x] [package.json](../package.json) — scripts ajoutés : `build:mobile`, `cap:sync`, `cap:ios`, `cap:android`
- [x] [app/lib/platform.ts](../app/lib/platform.ts) — détection Capacitor à l'exécution (`isCapacitor()`, `getPlatform()`)

### Corrections de compatibilité mobile
- [x] **Haptics iOS** — [app/game-engine/shared/useHaptics.ts](../app/game-engine/shared/useHaptics.ts) utilise `@capacitor/haptics` sur iOS, fallback `navigator.vibrate` sur Android/web
- [x] **Haptics GooseGame** — [GooseGameScreen/utils.ts](../app/components/screens/GooseGameScreen/utils.ts) idem
- [x] **Clipboard iOS** — [DuoSpaceScreen.tsx](../app/components/screens/DuoSpaceScreen.tsx) utilise `@capacitor/clipboard` dans Capacitor, fallback `navigator.clipboard` sur web
- [x] **Back button Android** — [useAppState.ts](../app/hooks/useAppState.ts) intercepte `App.addListener('backButton')` via `@capacitor/app`
- [x] **Flash au démarrage** — [page.tsx](../app/page.tsx) attend `isHydrated` avant le premier rendu (écran noir plutôt que ThemeSelectScreen)
- [x] **Barre de démo** — [page.tsx](../app/page.tsx) visible uniquement en `NODE_ENV === 'development'`, absente des builds de production
- [x] **Hover tactile** — `whileHover` sans déplacement `y` dans [Card.tsx](../app/components/ui/Card.tsx) et [MenuCard.tsx](../app/components/ui/MenuCard.tsx)

---

## Étapes restantes avant le premier build mobile

### Étape 1 — Générer les projets natifs
> Prérequis : Xcode installé (Mac), Android Studio installé

```bash
# Premier build statique
npm run build:mobile

# Initialiser les plateformes (une seule fois)
npx cap add ios
npx cap add android
```

Résultat : les dossiers `ios/` et `android/` apparaissent à la racine du projet.

---

### Étape 2 — Assets visuels obligatoires

#### Icône de l'app
- Format source : PNG 1024×1024 px, fond opaque (pas de transparence)
- L'outil [capacitor-assets](https://github.com/ionic-team/capacitor-assets) génère toutes les tailles automatiquement :
```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --ios --android
```

#### Splash screen
- PNG 2732×2732 px (iOS) et 1920×1920 px (Android)
- Fond : `#0a0a0f` (couleur de splash actuelle dans le code)
- Placer dans `resources/splash.png` avant de lancer `capacitor-assets`

---

### Étape 3 — Configuration iOS (Xcode)

```bash
npm run cap:ios   # ouvre Xcode
```

Dans Xcode :
1. **Bundle Identifier** : vérifier `fr.consentement.app`
2. **Signing** : connecter le compte Apple Developer, sélectionner le certificat
3. **Info.plist** — ajouter les clés de permission :
   - `NSPasteboardUsageDescription` → `"Copier le code de liaison Duo"`
   - `NSPhotoLibraryUsageDescription` → (si capture d'écran future)
4. **Capabilities** → activer `Push Notifications` quand Firebase sera intégré

---

### Étape 4 — Configuration Android (Android Studio)

```bash
npm run cap:android   # ouvre Android Studio
```

Dans `android/app/src/main/AndroidManifest.xml` :
- Vérifier que `android:targetSdkVersion` est ≥ 34 (exigé par le Play Store depuis août 2024)
- Vérifier la permission `VIBRATE` (ajoutée automatiquement par Capacitor Haptics)

---

### Étape 5 — Test sur simulateurs

```bash
# iOS : simulateur dans Xcode
# Android : AVD Manager dans Android Studio
```

**Checklist minimum avant toute soumission :**
- [ ] Démarrage froid sans flash blanc
- [ ] Thème persisté après fermeture/réouverture de l'app
- [ ] Bouton retour Android ne quitte pas l'app
- [ ] Haptics sur iPhone (jeu de dés, jeu de l'oie)
- [ ] Copie du code Duo sur iOS
- [ ] Flip des cartes sans artefact visuel
- [ ] Safe area correcte (notch iPhone, barre Android)
- [ ] Barre de démo absente

---

### Étape 6 — Comptes stores (à créer si pas encore fait)

| Store | Coût | Lien |
|---|---|---|
| Apple Developer Program | 99 €/an | developer.apple.com/programs |
| Google Play Console | 25 $ one-time | play.google.com/console |

---

### Étape 7 — Achats intégrés (bloquant App Store)

> Apple **refuse** les achats qui contournent StoreKit. Le flag `isPremium` actuel doit passer par les stores natifs.

Intégration recommandée : **RevenueCat** (déjà dans la roadmap)

```bash
npm install @revenuecat/purchases-capacitor
```

- Crée les produits dans App Store Connect et Google Play Console
- Remplace `activatePremium()` par `Purchases.purchasePackage(...)`
- Gère automatiquement les restaurations d'achat

---

### Étape 8 — Soumission

#### iOS
1. Archive dans Xcode → `Product > Archive`
2. Upload via Xcode Organizer ou `xcrun altool`
3. TestFlight (beta interne puis externe)
4. Soumettre à la review Apple (délai : 1–3 jours)

#### Android
```bash
cd android && ./gradlew bundleRelease
```
1. Signer l'AAB avec une keystore (à créer une fois, à conserver précieusement)
2. Upload dans Google Play Console → test interne → beta → production

---

## Points d'attention pour la review Apple

Le contenu de l'app (consentement, sexualité) nécessite :
- **Catégorie** : Éducation ou Santé & Remise en forme
- **Âge minimum** : 17+ (contenu pour adultes dans le mode adulte)
- **Description claire** du système de contrôle mineur/adulte
- Si des mineurs peuvent télécharger l'app : conformité RGPD/COPPA requise (pas de données collectées sans consentement parental)

---

## Résumé — Ce qui manque

```
✅ Code Capacitor intégré
✅ Corrections de compatibilité mobile

⏳ Générer ios/ et android/  →  npx cap add ios && npx cap add android
⏳ Icône + splash screen     →  fichiers PNG à créer
⏳ Comptes Apple / Google    →  à créer si absent
⏳ Achats intégrés (IAP)     →  RevenueCat à intégrer avant App Store
⏳ Test sur appareils réels  →  simulateurs puis vrais téléphones
⏳ Soumission stores         →  quand tout le dessus est coché
```
