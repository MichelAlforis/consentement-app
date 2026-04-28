# AppLogo — composant logo SVG

## Fichier source

`app/components/ui/AppLogo.tsx`

## Description

Logo SVG inline de l'application : cœur dégradé + checkmark blanc + arc de cercle supérieur. Rendu via `motion.svg` (Framer Motion) pour supporter l'animation.

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `variant` | `'dark' \| 'light' \| 'theme'` | `'light'` | Palette de couleurs |
| `className` | `string` | — | Classes CSS/Tailwind pour contrôler la taille et le positionnement |
| `animated` | `boolean` | `false` | Active une animation `scale + rotate` en boucle (5,5 s) |
| `height` | `number` | — | Taille explicite en px (rétrocompat — préférer `className`) |

## Taille — règle à respecter

**Utiliser `className` avec des classes Tailwind, pas `height={X}`.**

Le SVG utilise `width="100%"` / `height="100%"` par défaut ; les classes CSS prennent la main sur les attributs de présentation SVG.

```tsx
// ✅ Correct
<AppLogo className="w-16 h-16" variant="theme" />

// ✅ Responsive possible
<AppLogo className="w-1/4 aspect-square" variant="theme" />

// ❌ Hardcodé — éviter
<AppLogo height={64} variant="theme" />
```

## Variantes

### `dark` — sur fond sombre
Dégradé violet clair → violet moyen. Fond rect semi-transparent blanc 8 %. Utilisé sur SplashScreen, PremiumScreen.

### `light` — sur fond clair / neutre
Dégradé rose → violet → teal. Fond rect blanc 78 %. Utilisé sur WelcomeScreen, LanguageScreen, OnboardingWizard.

### `theme` — couleurs du thème actif
Les stops du dégradé lisent `colors.accent`, `colors.premium`, `colors.success` depuis `ThemeContext`. Le logo suit automatiquement le thème choisi par l'utilisateur. Utilisé partout dans l'app une fois le thème sélectionné.

## Animation

`animated={true}` déclenche :
- `scale: [1, 1.04, 1]`
- `rotate: [0, -1.5°, 0, 1.5°, 0]`
- Durée : 5,5 s, loop infini, `easeInOut`

À utiliser pour les moments d'attention brand (splash, welcome, fin de révélation duo). **Ne pas doubler l'animation** : si un `motion.div` parent anime déjà `scale`, passer `animated={false}` sur le logo.

```tsx
// ✅ Logo animé seul
<AppLogo className="w-20 h-20" variant="theme" animated />

// ✅ Conteneur anime, logo statique
<motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>
  <AppLogo className="w-20 h-20" variant="theme" animated={false} />
</motion.div>

// ❌ Double animation — à éviter
<motion.div animate={{ scale: [1, 1.1, 1] }}>
  <AppLogo className="w-20 h-20" variant="theme" animated />
</motion.div>
```

## Usages dans l'app

| Écran | Taille | Variante | Animé |
|---|---|---|---|
| SplashScreen | `w-[7.5rem] h-[7.5rem]` | `dark` | ✅ |
| WelcomeScreen | `w-44 h-44` | `light` | ✅ |
| LanguageScreen | `w-20 h-20` | `light` | ✗ |
| OnboardingWizard (step 1) | `w-[4.5rem] h-[4.5rem]` | `light` | ✗ |
| OnboardingWizard (step final) | `w-36 h-36` | `light` | ✅ |
| OnboardingWizard (personal intro) | `w-14 h-14` | `theme` | ✗ |
| PersonalIntroScreen | `w-16 h-16` | `theme` | ✗ |
| ThemeSelectScreen | `w-20 h-20` | `theme` | ✅ |
| Header (top bar) | `w-10 h-10` | `theme` | ✗ |
| HomeScreen (GreetingCard) | `w-10 h-10` | `theme` | ✅ |
| MoiScreen (brand card) | `w-14 h-14` | `theme` | ✗ |
| PremiumScreen | `w-24 h-24` | `dark` | ✗ |
| DuoWaitingStep (logo pulsant) | `w-20 h-20` | `theme` | ✗ (conteneur pulse) |
| DuoConnectedStep | `w-16 h-16` | `theme` | ✅ |
| DuoReadyStep (entre avatars) | `w-9 h-9` | `theme` | conditionnel (`bothReady`) |
| DuoSummaryStep | `w-16 h-16` | `theme` | ✅ |
| DuoRevealStep (fin révélation) | `w-12 h-12` | `theme` | ✅ |

## Ce qui n'utilise PAS AppLogo — intentionnel

Les `Heart` de lucide-react restent dans :
- **CardGame** — icône favoris (♥), sémantique fonctionnelle
- **GooseGameScreen** — case Complicité du plateau, icône de gameplay
- **HelpScreen** — icône de bienveillance (`text-blue-500`)
- **DuoRevealStep** — compteur de zones compatibles inline dans le texte
