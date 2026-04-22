# Système de Thèmes — Documentation

## Vue d'ensemble

L'app dispose d'un système de thèmes dynamiques qui change **toutes** les couleurs et les effets visuels de l'interface : fonds, textes, cartes, boutons, dégradés, animations, transitions. Le thème est propagé via un React Context (`ThemeContext`) accessible depuis n'importe quel composant.

---

## Thèmes disponibles

| ID | Nom | Accès | Description |
|----|-----|-------|-------------|
| `warm` | Chaleureux 🌅 | Gratuit | Tons chauds — terracotta, pêche, corail |
| `calm` | Apaisant 🌙 | Gratuit | Tons froids — bleu nuit, ardoise, lavande |
| `dark-luxury` | Sombre & Luxe ✨ | **Premium** | Noir profond, or, bordeaux + shimmer doré |
| `nude` | Nude & Doux 🤍 | **Premium** | Crème, taupe, nude + grain cinématographique |
| `youth` | Jeunesse 🌈 | Auto (mineurs) | Coloré, lumineux — interface 13-17 ans |

Le thème `youth` est appliqué automatiquement quand l'utilisateur sélectionne le mode mineur. Il ne peut pas être choisi manuellement.

---

## Architecture

```
app/
├── layout.tsx                       # Inter (next/font/google) — typographie globale
├── types/theme.ts                  # ThemeColors, ThemeEffects, Theme, 5 définitions
├── context/ThemeContext.tsx         # ThemeProvider + useTheme() hook
├── hooks/useAppState.ts             # État thème (themeMode, selectTheme, localStorage)
└── components/
    ├── ui/
    │   ├── ThemeEffects.tsx         # GrainOverlay, ShimmerLayer, PreviewShimmer
    │   ├── MenuCard.tsx             # useTheme() — shimmer premium intégré
    │   ├── Card.tsx                 # useTheme() — glow/inner border premium
    │   ├── Button.tsx               # useTheme() — gradients via thème
    │   ├── ComfortSlider.tsx        # useTheme() — couleurs inactives via bgSecondary
    │   ├── QRCode.tsx               # useTheme() — modules, cadre, anneau pulsé
    │   └── Header.tsx               # theme via prop (au-dessus du Provider)
    ├── duo/
    │   ├── DuoNavBar.tsx            # useTheme() — barre de progression étapes
    │   ├── DuoBumpStep.tsx          # useTheme()
    │   ├── DuoConnectedStep.tsx     # useTheme()
    │   ├── DuoFillingStep.tsx       # useTheme()
    │   ├── DuoReadyStep.tsx         # useTheme()
    │   ├── DuoPactStep.tsx          # useTheme()
    │   ├── DuoRevealStep.tsx        # useTheme()
    │   ├── DuoSummaryStep.tsx       # useTheme()
    │   └── DuoWaitingStep.tsx       # useTheme()
    └── screens/
        ├── HomeAdultScreen.tsx      # useTheme()
        ├── PersonalSpaceScreen.tsx  # useTheme()
        ├── GamesHubScreen.tsx       # useTheme()
        ├── HelpScreen.tsx           # useTheme()
        ├── LearnScreen.tsx          # useTheme()
        ├── PremiumScreen.tsx        # useTheme()
        ├── QuizConsentementScreen.tsx # useTheme()
        ├── LoiConsentementScreen.tsx  # useTheme()
        ├── PornoVsRealiteScreen.tsx   # useTheme()
        ├── DiceGameScreen.tsx       # useTheme() — textes/fonds ; identité amber conservée
        ├── CardGameScreen.tsx       # useTheme() — textes/fonds ; identité violet conservée
        └── ThemeSelectScreen.tsx    # Previews animées pour thèmes premium
```

### Flux du thème

```
useAppState (themeMode state + localStorage)
    ↓
page.tsx → <ThemeProvider theme={theme}>
    ↓
useTheme() → { colors, effects } dans n'importe quel composant enfant
```

---

## Interface ThemeColors (28 propriétés)

```typescript
interface ThemeColors {
  bgPrimary, bgSecondary, bgGradient, bgCard, bgCardHover  // Fonds
  accent, accentLight, accentGradient, accentShadow         // Accent principal
  secondary, secondaryLight, secondaryGradient              // Accent secondaire
  textPrimary, textSecondary, textMuted                     // Textes
  border, divider                                           // UI
  success, warning, error                                   // Statuts
  comfortNo, comfortWait, comfortCurious, comfortOk, comfortLove  // Slider confort
}
```

---

## Interface ThemeEffects (effets visuels premium)

```typescript
interface ThemeEffects {
  shimmer: boolean;                              // Reflet diagonal animé
  shimmerColor: string;                          // Couleur du shimmer (hex)
  grain: boolean;                                // Grain cinématographique pleine page
  pageTransition: 'slide' | 'fade' | 'drift';   // Type de transition entre écrans
  cardGlow: string | null;                       // Halo lumineux autour des cartes
  cardInnerBorder: string | null;                // Liseré intérieur sur les cartes
}
```

### Effets par thème

| Thème | shimmer | grain | pageTransition | cardGlow | cardInnerBorder |
|-------|---------|-------|----------------|----------|-----------------|
| warm | ✗ | ✗ | `slide` | — | — |
| calm | ✗ | ✗ | `slide` | — | — |
| **dark-luxury** | ✓ or `#c9a84c` | ✗ | `fade` | or 7% | or 22% |
| **nude** | ✗ | ✓ | `drift` | — | taupe 18% |
| youth | ✗ | ✗ | `slide` | — | — |

---

## Couleurs par thème

### Warm 🌅
| Rôle | Valeur |
|------|--------|
| accent | `#e07a5f` Terracotta |
| secondary | `#8fb996` Sauge |
| bgGradient | Crème → Pêche clair |
| textPrimary | `#3d3d3d` |

### Calm 🌙
| Rôle | Valeur |
|------|--------|
| accent | `#5c6ac4` Indigo |
| secondary | `#9d8cd9` Lavande |
| bgGradient | Gris clair → Gris bleuté |
| textPrimary | `#2d3142` |

### Dark Luxury ✨ (Premium)
| Rôle | Valeur |
|------|--------|
| accent | `#c9a84c` Or |
| secondary | `#8b1a3a` Bordeaux |
| bgGradient | `#0f0d0e` → `#1e1520` Noir |
| bgCard | `rgba(30,24,28,0.95)` Noir chaud |
| textPrimary | `#f0ece4` Crème |
| textMuted | `#8a8078` Gris chaud — contraste 5:1 sur `#0f0d0e` (WCAG AA ✓) |

### Nude 🤍 (Premium)
| Rôle | Valeur |
|------|--------|
| accent | `#b07d6a` Nude rosé |
| secondary | `#8c7860` Taupe |
| bgGradient | Crème → Ivoire |
| textPrimary | `#2e2420` Brun foncé |

---

## Composants d'effets — ThemeEffects.tsx

### `<GrainOverlay />`
Overlay fixe pleine page avec texture fractalNoise SVG. `mixBlendMode: overlay`, opacité 3.8%. Rendu uniquement si `effects.grain === true` (nude). Placé dans `page.tsx` après le contenu principal.

### `<ShimmerLayer color />`
Reflet diagonal animé (`-120% → 350%`, 3.2s, repeat toutes les ~9s). Positionné `absolute inset-0` dans `Card` et `MenuCard`. Activé sur les variants `elevated`, `default` (Card) et `accent`, `secondary` (MenuCard) quand `effects.shimmer === true`.

### `<PreviewShimmer color />`
Identique à `ShimmerLayer` mais avec cycle plus court (2.8s, repeat delay 3.5s). Utilisé exclusivement dans `ThemeSelectScreen` sur les cartes premium verrouillées pour montrer l'effet avant achat.

---

## Transitions de page

Configurées dans `page.tsx` via `theme.effects.pageTransition` :

| Type | Thème | Comportement |
|------|-------|-------------|
| `slide` | warm, calm, youth | `x: ±20px` + opacity — 0.3s |
| `fade` | dark-luxury | opacity seule — 0.45s easeInOut (cinématographique) |
| `drift` | nude | `y: 14px → 0` + opacity — 0.75s easing exponentiel (respiratoire) |

---

## Previews animées dans ThemeSelectScreen

Les thèmes premium verrouillés sont affichés à **pleine intensité** (pas de dimming) avec :

**Dark Luxury verrouillé :**
- `<PreviewShimmer color="#c9a84c" />` en continu
- Overlay sombre (`rgba(0,0,0,0.45)`)
- Badge doré avec `backdrop-blur` et border or

**Nude verrouillé :**
- Animation `scale: 1 ↔ 1.008` cycle 4s (respiration lente)
- Overlay crème translucide (`rgba(255,255,255,0.18)`)
- Badge taupe avec border rosé

---

## Utilisation dans les composants

```typescript
import { useTheme } from '../../context/ThemeContext';

function MonComposant() {
  const { colors, effects } = useTheme();

  return (
    <div style={{ background: colors.bgCard, color: colors.textPrimary }}>
      {effects.shimmer && <ShimmerLayer color={effects.shimmerColor} />}
    </div>
  );
}
```

### Règle absolue

```typescript
// ❌ Hardcodé — ignore le thème
<div className="bg-white text-gray-800 border-gray-100">

// ✅ Via thème
<div style={{ background: colors.bgCard, color: colors.textPrimary, border: `1px solid ${colors.border}` }}>
```

---

## Variants des composants UI

### MenuCard

| Variant | Couleur | Shimmer premium |
|---------|---------|-----------------|
| `accent` | `accentGradient` | ✓ si `effects.shimmer` |
| `secondary` | `secondaryGradient` | ✓ si `effects.shimmer` |
| `amber` | Orange fixe (jeux) | ✗ |
| `green` | Vert fixe (santé) | ✗ |
| `default` | `bgCard` + `border` | ✗ |

### Card

| Variant | Couleur | Effets premium |
|---------|---------|----------------|
| `default` | `bgCard` + `border` | glow + inner border si `effects.cardGlow/cardInnerBorder` |
| `elevated` | `bgCard` + ombre | glow + inner border + shimmer si `effects.shimmer` |
| `accent` | `accentGradient` | — |
| `secondary` | `secondaryGradient` | — |
| `warning` | `warning` transparent | — |
| `success` | `success` transparent | — |

---

## Persistance

Clé localStorage : `consentement_theme`. Restauré au démarrage via `useAppState`.

---

## Accès Premium

Les thèmes `dark-luxury` et `nude` sont verrouillés derrière `isPremium`. Cliquer sur une carte verrouillée dans `ThemeSelectScreen` redirige vers `/premium` (page de simulation de paiement). Après activation, l'utilisateur retourne sur `ThemeSelectScreen` avec les thèmes déverrouillés.

---

## Ajouter un nouveau thème

1. Implémenter `ThemeColors` + `ThemeEffects` dans `app/types/theme.ts`
2. Ajouter au `Record<ThemeMode, Theme>` et au type union `ThemeMode`
3. Ajouter `themePreviewColors` et `themeGradients` dans `ThemeSelectScreen`
4. Ajouter dans `freeThemes` ou `premiumThemes` selon l'accès
5. Si effets spéciaux : ajouter les composants correspondants dans `ThemeEffects.tsx`
