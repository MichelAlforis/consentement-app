# Système de Thèmes — Documentation

## Vue d'ensemble

L'app dispose d'un système de thèmes dynamiques qui change **toutes** les couleurs de l'interface : fonds, textes, cartes, boutons, dégradés. Le thème est propagé via un React Context (`ThemeContext`) accessible depuis n'importe quel composant.

---

## Thèmes disponibles

| ID | Nom | Accès | Description |
|----|-----|-------|-------------|
| `warm` | Chaleureux 🌅 | Gratuit | Tons chauds — terracotta, pêche, corail |
| `calm` | Apaisant 🌙 | Gratuit | Tons froids — bleu nuit, ardoise, lavande |
| `dark-luxury` | Sombre & Luxe ✨ | **Premium** | Noir profond, or, bordeaux |
| `nude` | Nude & Doux 🤍 | **Premium** | Crème, taupe, nude minimaliste |
| `youth` | Jeunesse 🌈 | Auto (mineurs) | Coloré, lumineux — interface 13-17 ans |

Le thème `youth` est appliqué automatiquement quand l'utilisateur sélectionne le mode mineur. Il ne peut pas être choisi manuellement.

---

## Architecture

```
app/
├── types/theme.ts              # Interface ThemeColors, Theme, définitions des 5 thèmes
├── context/ThemeContext.tsx    # ThemeProvider + useTheme() hook
├── hooks/useAppState.ts        # Gestion de l'état thème (themeMode, selectTheme)
└── components/
    ├── ui/
    │   ├── MenuCard.tsx        # Cartes de navigation — utilise useTheme()
    │   ├── Card.tsx            # Cartes contenu — utilise useTheme()
    │   └── Header.tsx          # En-tête — utilise theme via prop
    └── screens/
        ├── HomeAdultScreen.tsx # Écran accueil adulte — utilise useTheme()
        └── ThemeSelectScreen.tsx # Sélecteur de thème
```

### Flux du thème

```
useAppState (themeMode state + localStorage)
    ↓
page.tsx → <ThemeProvider theme={theme}>
    ↓
useTheme() dans n'importe quel composant enfant
```

---

## Interface ThemeColors

Chaque thème expose 28 propriétés de couleur :

```typescript
interface ThemeColors {
  // Fonds
  bgPrimary: string;       // Fond principal
  bgSecondary: string;     // Fond secondaire
  bgGradient: string;      // Dégradé de fond de l'app
  bgCard: string;          // Fond des cartes
  bgCardHover: string;     // Fond des cartes au survol

  // Accent (couleur principale du thème)
  accent: string;          // Couleur brute
  accentLight: string;     // Version claire
  accentGradient: string;  // Dégradé CSS
  accentShadow: string;    // Ombre rgba

  // Secondaire (deuxième couleur du thème)
  secondary: string;
  secondaryLight: string;
  secondaryGradient: string;

  // Texte
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // UI
  border: string;
  divider: string;

  // Statut
  success: string;
  warning: string;
  error: string;

  // Niveaux de confort (ComfortSlider)
  comfortNo: string;
  comfortWait: string;
  comfortCurious: string;
  comfortOk: string;
  comfortLove: string;
}
```

---

## Couleurs par thème

### Warm 🌅
| Rôle | Valeur |
|------|--------|
| accent | `#e07a5f` Terracotta |
| accentGradient | Terracotta → Pêche |
| secondary | `#8fb996` Sauge |
| bgGradient | Crème → Pêche clair |
| textPrimary | `#3d3d3d` |

### Calm 🌙
| Rôle | Valeur |
|------|--------|
| accent | `#5c6ac4` Indigo |
| accentGradient | Indigo → Bleu ardoise |
| secondary | `#9d8cd9` Lavande |
| bgGradient | Gris clair → Gris bleuté |
| textPrimary | `#2d3142` |

### Dark Luxury ✨ (Premium)
| Rôle | Valeur |
|------|--------|
| accent | `#c9a84c` Or |
| accentGradient | Or → Or clair |
| secondary | `#8b1a3a` Bordeaux |
| secondaryGradient | Bordeaux → Rose profond |
| bgGradient | `#0f0d0e` → `#1e1520` Noir |
| bgCard | `rgba(30,24,28,0.95)` Noir chaud |
| textPrimary | `#f0ece4` Crème |

### Nude 🤍 (Premium)
| Rôle | Valeur |
|------|--------|
| accent | `#b07d6a` Nude rosé |
| accentGradient | Nude → Vieux rose |
| secondary | `#8c7860` Taupe |
| bgGradient | Crème → Ivoire |
| textPrimary | `#2e2420` Brun foncé |

---

## Utilisation dans les composants

### Accéder au thème

```typescript
import { useTheme } from '../../context/ThemeContext';

function MonComposant() {
  const { colors } = useTheme();

  return (
    <div style={{ background: colors.bgCard, color: colors.textPrimary }}>
      ...
    </div>
  );
}
```

### Ne jamais hardcoder les couleurs

```typescript
// ❌ Mauvais — ignore le thème
<div className="bg-white text-gray-800 border-gray-100">

// ✅ Bon — suit le thème
<div style={{ background: colors.bgCard, color: colors.textPrimary, border: `1px solid ${colors.border}` }}>
```

---

## Variants des composants UI

### MenuCard

| Variant | Couleur | Usage |
|---------|---------|-------|
| `accent` | `accentGradient` du thème | Action principale (Mon Espace) |
| `secondary` | `secondaryGradient` du thème | Action secondaire (Notre Espace) |
| `amber` | Orange fixe | Jeux (sémantique) |
| `green` | Vert fixe | Santé/Sécurité (sémantique) |
| `default` | `bgCard` + `border` du thème | Liens neutres |

### Card

| Variant | Couleur | Usage |
|---------|---------|-------|
| `default` | `bgCard` + `border` | Contenu standard |
| `elevated` | `bgCard` + ombre | Contenu mis en avant |
| `accent` | `accentGradient` | Bloc accent |
| `secondary` | `secondaryGradient` | Bloc secondaire |
| `warning` | `warning` transparent | Alertes douces |
| `success` | `success` transparent | Confirmations |

---

## Persistance

Le thème sélectionné est sauvegardé dans `localStorage` sous la clé `consentement_theme`. Il est restauré automatiquement au démarrage via `useAppState`.

---

## Accès Premium

Les thèmes `dark-luxury` et `nude` sont verrouillés derrière l'abonnement premium (`isPremium`). Cliquer dessus dans `ThemeSelectScreen` redirige vers la page de souscription (`/premium`).

Après activation du premium, l'utilisateur est renvoyé sur `ThemeSelectScreen` avec les thèmes déverrouillés.

---

## Ajouter un nouveau thème

1. Définir les couleurs dans `app/types/theme.ts` en implémentant `ThemeColors`
2. Ajouter le thème dans `themes: Record<ThemeMode, Theme>`
3. Ajouter le `ThemeMode` dans le type union
4. Ajouter la preview dans `ThemeSelectScreen` (`themePreviewColors`, `themeGradients`)
5. Décider si le thème est gratuit ou premium (`freeThemes` / `premiumThemes`)
