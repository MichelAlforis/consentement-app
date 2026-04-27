# Logo — Système de design complet

> Màj 2026-04-27 · Référence authoritative pour l'intégration et l'animation du logo

---

## 1. Le symbole

Le logo de Consentement représente **deux silhouettes debout, face à face**, dont les corps courbés forment ensemble un cœur. Cette dualité est le cœur sémantique de l'app : deux êtres, un accord mutuel.

- **Fichier source** : `image/brand/logo/symbol.svg`
- **ViewBox** : `0 0 336 1044` (portrait, ratio ≈ 1:3.1)
- **Fill natif** : `#000` — toujours remplacé par gradient ou tint à l'usage
- **Règle** : ne jamais utiliser le SVG en noir plat dans l'app

---

## 2. Palette du logo — alignement avec le dos de carte

Le symbole SVG est **le même asset** que celui gravé sur le dos des cartes de collection. Les couleurs sont donc fixes et partagées avec `palette.md`.

### Variant sombre (fonds noirs, dos de carte, PremiumScreen)

| Couche | Couleur | Opacity |
|---|---|---|
| Stop haut | `#ddd6fe` (lavande) | — |
| Stop milieu | `#a78bfa` (violet) | — |
| Stop bas | `#6d28d9` (indigo profond) | — |
| Opacity globale | — | `0.78` |

Dégradé SVG : `linearGradient` vertical, angle `0°` (top → bottom).

### Variant clair (fonds blancs/crème, WelcomeScreen, mode light)

| Couche | Couleur |
|---|---|
| Stop haut | `#7c3aed` |
| Stop milieu | `#a855f7` |
| Stop bas | `#5b21b6` |

Opacity : `1.0` — contour plus soutenu pour la lisibilité sur fond clair.

### Variant thème (adaptatif)

Sur les thèmes Warm, Calm, Nude, Youth : utiliser `colors.premium` (stop haut) → `colors.accent` (stop bas). Cela garantit que le logo "vit" dans la charte du thème actif sans jamais casser la cohérence.

```ts
// Exemple d'usage dans un composant React
const logoGradient = [colors.premiumLight, colors.premium, colors.accent]
```

---

## 3. Règles d'usage

### Tailles minimales

| Contexte | Hauteur min | Hauteur recommandée |
|---|---|---|
| WelcomeScreen (hero) | 140px | 180px |
| PremiumScreen (hero) | 160px | 220px |
| Écran Moi (brand card) | 48px | 64px |
| Header | ❌ interdit | trop détaillé < 40px |
| TabBar / icônes | ❌ interdit | illisible à cette échelle |

### Zones d'exclusion

Prévoir un espace vide autour du logo égal à **1/4 de sa hauteur** sur tous les côtés. Le logo ne doit jamais toucher un autre élément graphique.

### Fond recommandé

- **Sombre** : fond `#0c0920` → `#3b1f85` (identique dos de carte) — rendu premium immédiat
- **Clair** : fond blanc pur ou `colors.bgPrimary` — variant clair du gradient
- **Gradient** : le logo dégradé violet fonctionne sur les fonds violet/lavande à condition que l'opacité du fond soit < 0.5

### Ce qu'on ne fait pas

- ❌ Logo noir `#000` sur fond clair (réservé aux fichiers d'impression)
- ❌ Logo blanc plat `#fff` (trop plat, sans âme)
- ❌ Logo redimensionné librement en largeur (ratio portrait fixe)
- ❌ Logo dans le header ou la tab bar (illisible)

---

## 4. Intégration technique — composant `AppLogo`

Le logo est rendu via un `<svg>` inline avec un `<linearGradient>` SVG interne. Pas d'`<img>` : ça permet d'animer les stops et de contrôler la couleur via props.

```tsx
// app/components/ui/AppLogo.tsx — structure cible
<svg viewBox="0 0 336 1044" style={{ height }}>
  <defs>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stopColor={topColor} />
      <stop offset="45%"  stopColor={midColor} />
      <stop offset="100%" stopColor={botColor} />
    </linearGradient>
  </defs>
  <path fill="url(#logoGrad)" fillOpacity={opacity} fillRule="evenodd" d="..." />
</svg>
```

Props attendues :
- `height` — number (px)
- `variant` — `'dark' | 'light' | 'theme'`
- `colors` — optionnel, override du gradient (pour variant `'theme'`)
- `animated` — boolean (active l'animation morphing, voir §5)

---

## 5. Animation — Spécification

### Concept

> "Les deux corps s'entremêlent pour former un cœur, puis se séparent doucement, en boucle infinie."

Le logo est déjà à l'état **fusionné** (cœur complet). L'animation part de cet état, sépare les deux silhouettes, puis les refond. Le cœur est le moment de "repos" expressif — l'état stable, l'accord trouvé.

### Décomposition en phases (durée totale : 5s / boucle)

| Phase | Durée | État | Easing |
|---|---|---|---|
| **0 — Repos** | 1.2s | Logo complet, cœur visible, glow doux | — |
| **1 — Séparation** | 0.8s | Les deux moitiés s'écartent (+X / −X) | `easeInOut` |
| **2 — Pause séparée** | 0.8s | Corps distincts, tension visuelle | — |
| **3 — Rapprochement** | 1.0s | Convergence vers le centre | `easeInOut` |
| **4 — Fusion** | 0.2s | Légère overshoot scale (1→1.04→1) | `spring` |

### Technique — Split clip-path

Deux copies du SVG superposées, chacune masquée par un `clipPath` :

```
SVG gauche  : clip [0, 0, 168, 1044]   → silhouette de gauche
SVG droite  : clip [168, 0, 336, 1044] → silhouette de droite
```

En phase "séparée" : `translateX(-deltaX)` sur gauche, `translateX(+deltaX)` sur droite.
En phase "fusionnée" : `translateX(0)` sur les deux → les deux clips s'alignent → logo complet.

### Paramètres Framer Motion

```ts
const DELTA = 18 // px d'écartement (ajuster selon la taille affichée)
const LOOP_DURATION = 5 // secondes

// Keyframes translateX pour chaque moitié (symétriques)
const leftX  = [0, -DELTA, -DELTA, 0, 0]
const rightX = [0, +DELTA, +DELTA, 0, 0]
const times  = [0, 0.24, 0.40, 0.60, 1.0]
```

### Effets synchronisés

- **Glow** : `boxShadow` violet (`rgba(124,58,237,0.5)`) au maximum en phase "fusion", s'efface en phase "séparée"
- **Opacity globale** : 0.78 en séparation → 1.0 en fusion (les corps "s'illuminent" en se rejoignant)
- **Scale subtil** : 1.0 → 1.03 pendant la fusion, retour spring

### Variante simple (fallback performance)

Si l'appareil est faible (`prefers-reduced-motion` ou batterie basse) :
- Remplacer par la **Respiration** seule : scale `1 → 1.03 → 1` sur 3s, glow pulsé

```ts
const breathVariant = {
  animate: {
    scale: [1, 1.03, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
}
```

---

## 6. Écrans d'intégration — roadmap

| Écran | Priorité | Taille | Variant | Animé |
|---|---|---|---|---|
| `WelcomeScreen` | **P0** | 180px | `light` | Oui (morphing) |
| `PremiumScreen` | **P1** | 220px | `dark` | Oui (respiration) |
| `MoiScreen` (brand card) | **P2** | 56px | `theme` | Non |
| Splash Capacitor | P3 | native | — | Non (natif) |

---

## 7. Cohérence avec le dos de carte

Le symbole sur le dos de `CollectorCardCanvas` utilise exactement ce même gradient (variant sombre). La règle : **le logo standalone dans l'app doit toujours être reconnaissable comme la même entité que le symbole de la carte**. C'est le fil graphique invisible qui relie l'identité de marque à l'expérience de jeu.

Référence : `docs/graphisme/palette.md` §Symbole — dégradé (dos).
