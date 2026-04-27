# Onboarding — Implémentation complète

> Dernière mise à jour : 2026-04-27 — **IMPLÉMENTÉ** ✅

---

## Vision

L'onboarding est la **première impression de l'app**. Il doit :
- Être court (< 2 min), jamais bloquant
- Personnaliser l'expérience avant d'entrer dans l'app (langue, âge, thème, nom)
- Être **intégralement modifiable** depuis les Paramètres
- Protéger les mineurs dès la sélection d'âge

---

## Flux implémenté

```
[SPLASH]
  Logo animé centré — pendant hydratation stores (isHydrated === false)
  AnimatePresence + fade-out automatique
  ↓
[1] LanguageScreen  ← point d'entrée (navigationStore default = 'language')
  Choix FR / EN / ES — langue pré-sélectionnée selon navigator
  CTA "Continuer" → navigateTo('welcome')
  ↓
[2] WelcomeScreen
  Logo animé + tagline + 3 piliers + CTA "Commencer"
  CTA → navigateTo('age-check')
  ↓
[3] AgeCheckScreen
  Mineur → handleAgeSelect(false) + selectTheme('youth') → navigateTo('theme-select')
  Adulte → handleAgeSelect(true) → navigateTo('theme-select')
  ↓
[4] ThemeSelectScreen
  Mineur : youth (pré-sélectionné) + warm + calm  (sans section premium)
  Adulte : warm + calm + dark-luxury (🔒) + nude (🔒)
  Sélection → selectTheme(mode)
    si !hasOnboarded → adulte : navigateTo('auth') / mineur : navigateTo('onboarding-slides')
    si hasOnboarded  → goBack()
  ↓ adulte                          ↓ mineur
[5a] AuthScreen                    [5b] → step 6 directement
  Bouton initial → révèle le formulaire
  Input prénom (autoFocus)
  Pills pronoms optionnels : il/lui · elle · iel · neutre
  Continuer → setPronouns() + handleAuth(name)
    si !hasOnboarded → navigateTo('personal-intro')
    si hasOnboarded  → navigateTo('home')
  ↓
[6] PersonalIntroScreen  (adultes uniquement)
  3 sliders : Tendresse · Intensité · Confiance (0–4, défaut = 2)
  "Personnaliser maintenant" → save + navigateTo('onboarding-slides')
  "Configurer plus tard"    → navigateTo('onboarding-slides') sans sauvegarder
  ↓
[7] OnboardingSlides  (route 'onboarding-slides' → ModuleDeBaseScreen)
  4 slides adultes / 4 slides mineurs (isAdult prop)
  "Passer pour l'instant" → markOnboardingSkipped() → navigateTo('home')
  Dernier slide → onNavigate('hall-of-cards') (comportement interne ModuleDeBase)
  ↓
[8] HomeScreen
  Redirect AppShell : home + !hasOnboarded → onboarding-slides
  home + hasOnboarded → HomeScreen toujours rendu directement
```

### Redirect utilisateur de retour

Au lancement, `navigationStore.currentScreen` repart toujours à `'language'` (non persisté).  
AppShell détecte `history.length === 0` (lancement initial) et redirige :
- `isAdult === true` + `userName` → **home**
- `isAdult === false` + `themeMode` → **home**
- Sinon → reste sur **language** (premier lancement)

---

## SplashScreen

**Fichier :** `app/components/app/SplashScreen.tsx`

- Fond : `#0a0a0f` (noir absolu avant que le thème soit connu)
- Logo : `<AppLogo height={140} variant="dark" animated />`
- Animation de sortie : `opacity: 0, scale: 0.96` via `AnimatePresence` dans AppShell
- Condition : `!isHydrated` (flag Zustand sur authStore)

```tsx
// AppShell — priorité 1
if (!isHydrated) {
  return (
    <AnimatePresence>
      <SplashScreen />
    </AnimatePresence>
  );
}
```

---

## Fichiers créés / modifiés

### Nouveaux fichiers

| Fichier | Description |
|---------|-------------|
| `app/components/app/SplashScreen.tsx` | Logo animé pendant hydratation |
| `app/components/screens/LanguageScreen.tsx` | Choix de langue — premier écran |
| `app/components/screens/PersonalIntroScreen.tsx` | Intro profil perso (adultes, étape 6) |

### Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `app/stores/navigationStore.ts` | `currentScreen` default → `'language'` |
| `app/stores/authStore.ts` | Ajout `pronouns: string \| null` + `setName()` + `setPronouns()` |
| `app/stores/index.ts` | `resetAllData()` inclut `pronouns: null` |
| `app/types/index.ts` | Ajout `'language'`, `'onboarding-slides'`, `'personal-intro'` au type Screen |
| `app/config/screenMeta.ts` | `header: 'hidden'` pour language, onboarding-slides, personal-intro |
| `app/routes.ts` | Lazy imports + routes pour LanguageScreen, PersonalIntroScreen ; `onboarding-slides` → ModuleDeBaseScreen |
| `app/components/app/AppShell.tsx` | SplashScreen ; redirect retour ; guard home→onboarding-slides |
| `app/components/app/RouteRenderer.tsx` | SCREEN_RENDERS exhaustif avec toutes les nouvelles routes |
| `app/components/screens/ThemeSelectScreen.tsx` | Filtrage thèmes mineur/adulte ; `isAdult` prop |
| `app/components/screens/AuthScreen.tsx` | Champ pronoms optionnel |
| `app/components/screens/SettingsScreen.tsx` | Refacto 4 sections + ResetModal |
| `app/i18n/locales/*/onboarding.ts` | Clés language, personalIntro (fr/en/es) |
| `app/i18n/locales/*/ui.ts` | Clés settings.* complètes (fr/en/es) |

---

## Paramètres — Exposition complète

Tous les choix faits à l'onboarding sont modifiables depuis `SettingsScreen`.

```
SettingsScreen (4 sections)
  ├── MON PROFIL
  │     ├── Prénom         input éditable → onBlur → authStore.setName()
  │     ├── Pronoms        pills il·elle·iel·neutre → authStore.setPronouns()
  │     └── Mon espace perso → navigateTo('personal-space')  [adultes only]
  │
  ├── APPARENCE
  │     ├── Langue         LanguagePicker inline (FR · EN · ES)
  │     └── Thème          → navigateTo('theme-select')
  │
  ├── CONTENU
  │     ├── Mode explicite ExplicitModeToggle  [adultes only]
  │     └── Revoir l'intro markOnboardingSkipped() + navigateTo('onboarding-slides')
  │
  └── APP
        ├── Aide & Urgences → navigateTo('help')
        ├── Premium        → navigateTo('premium') si non premium ; CheckCircle sinon
        └── Réinitialiser  resetAllData() — ResetModal AnimatePresence bottom-sheet
```

---

## i18n — Architecture

Les clés sont plates dans chaque locale (`fr = { ...ui, ...onboarding, ...home, ... }`).

### Clés ajoutées — `onboarding.ts`

```ts
language: { title, subtitle, cta }
personalIntro: { title, subtitle, ctaNow, ctaLater }
auth: { pronounsLabel, pronounOptions: { il, elle, iel, neutre } }
```

### Clés ajoutées — `ui.ts` (namespace settings)

```ts
settings.sections: { profile, appearance, content, app }
settings.profile: { name, namePlaceholder, pronouns, pronounsOptional,
                    pronounOptions.{il,elle,iel,neutre},
                    personalSpace, personalSpaceDesc }
settings.language: { title, desc }
settings.theme:    { title, desc }
settings.explicit: { title, desc }
settings.replayIntro: { title, desc }
settings.help:     { title, desc }
settings.premium:  { title, desc }
settings.premiumActive: { title, desc }
settings.reset:    { title, desc, confirm, cta, cancel }
```

---

## Notes d'architecture

- **`navigationStore` n'est pas persisté** → `currentScreen` repart toujours à `'language'` au lancement. C'est le mécanisme qui fait de `language` le vrai point d'entrée.
- **`history.length === 0`** distingue "lancement initial sur language" de "naviguée depuis settings" — seul le premier cas déclenche le redirect retour.
- **`hasOnboarded`** = `onboardingStatus !== 'not_started'` — utilisé dans theme-select et auth pour distinguer onboarding vs. settings.
- **`ThemeSelectScreen`** sert dans les deux contextes : onboarding (forward) et settings (goBack). La prop `hasOnboarded` dans ctx détermine le comportement.
- **`SCREEN_RENDERS`** est un `Record<Screen, ...>` → TypeScript enforce l'exhaustivité : ajouter un Screen sans render entry est une erreur de compilation.
