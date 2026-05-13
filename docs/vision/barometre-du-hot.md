# Baromètre du Hot — Spec technique

> Dernier état : 2026-05-13 · Statut : **implémenté V1**

---

## Concept

Le Baromètre du Hot est le système nerveux de progression globale de l'app. Il remplace la lecture sèche `ownedCards + completedModules` par une métaphore thermique émotionnellement engageante. Plus l'utilisateur apprend et joue, plus son baromètre monte — et plus des contenus avancés se débloquent.

---

## 5 Paliers

| # | Nom | Seuil (pts) | Ce qui se débloque |
|---|-----|-------------|-------------------|
| 1 | 🔵 Tiède | 0 | Contenu de base (état par défaut) |
| 2 | 🟡 Chaud | 12 | Contenu explicite (remplace le toggle manuel) |
| 3 | 🟠 Ardent | 40 | Mode Scénario (V2) |
| 4 | 🔴 Brûlant | 80 | Gamme Kamasutra (V2) |
| 5 | ⚪ Incandescent | 130 | Cartes Expert (V2) |

> Palier 2 atteignable en 1 soirée (ex : module-de-base 3pts + 9 cartes common = 12pts).
> Palier 3 requiert un engagement multi-sessions.

---

## Système de points

### Modules éducatifs

| Module | Palier difficulté | Points |
|--------|-------------------|--------|
| `module-de-base` / `-mineur` | intro | 3 |
| `porno-vs-realite` / `-mineur` | easy | 2 |
| `quiz-consentement` / `-mineur` | easy | 2 |
| `loi-consentement` / `-mineur` | medium | 5 |
| `duo-flow` | medium | 5 |
| `accompagnement-mineur` | medium | 5 |
| `module-pratiques-adultes` | hard | 10 |

### Cartes possédées

| Rareté | Points par carte |
|--------|-----------------|
| common | 1 |
| rare | 2 |
| unique | 5 |

### Séances de jeu

- **CardGame** : 1 pt par séance complète (bouton "Quitter")
- **GooseGame** : 1 pt par partie (arrivée case 23)
- **DiceGame** : 1 pt par session (bouton "Quitter" après au moins 1 lancer)

### Lexique (V2)
- +1 pt par mot débloqué — non implémenté en V1

---

## Architecture technique

### Logique pure
`app/lib/heatLevel.ts`

```typescript
computeHeatPoints(input: HeatInput): number
getHeatLevel(points: number): HeatLevel     // 1|2|3|4|5
getHeatLevelFromInput(input: HeatInput): HeatLevel
pointsToNextLevel(points: number): number | null
heatLevelProgress(points: number): number   // 0–1 (% dans le palier)
```

Couverture tests : **25 cas** dans `app/lib/heatLevel.test.ts`

### Gate des fonctionnalités
`app/lib/heatGate.ts`

```typescript
isHeatUnlocked(feature: HeatGatedFeature, level: HeatLevel): boolean
requiredLevel(feature: HeatGatedFeature): HeatLevel
```

Features : `'explicit'` (palier 2) · `'scenarios'` (3) · `'kamasutra'` (4) · `'expert-cards'` (5)

### Sources de données (stores existants, non modifiés)

| Donnée | Store | Clé localStorage |
|--------|-------|-----------------|
| `completedModules` | `moduleProgressStore` | `consentement-modules` |
| `ownedCards` | `unlockStore` | `consentement-unlocks` |
| `sessionCount` | `unlockStore` | `consentement-unlocks` |

> Le niveau de chaleur est **dérivé** — pas de store séparé.

---

## Visualisation — HeatThermometer

`app/components/ui/HeatThermometer.tsx`

- **Thermomètre vertical** : tube 18×96px + bulbe 28px
- **Fill animé** bottom → top via Framer Motion v11 (`DURATION.medium`, `EASING.standard`)
- **Couleur par palier** : bleu → amber → orange → rouge → or+shimmer (Incandescent)
- **Props** : `{ points: number; compact?: boolean }`
- **compact** : version sans détail (utilisée dans l'en-tête Home)
- **prefers-reduced-motion** : animation désactivée, hauteur statique
- **ARIA** : `role="meter"`, `aria-valuenow`, `aria-valuemin/max`

### Couleurs fixes (indépendantes du thème)

| Palier | Couleur | Hex |
|--------|---------|-----|
| Tiède | Bleu | `#60a5fa` |
| Chaud | Amber | `#f59e0b` |
| Ardent | Orange | `#f97316` |
| Brûlant | Rouge | `#ef4444` |
| Incandescent | Or + shimmer | `#fbbf24 → #ffffff` |

---

## Intégration HomeScreen

`HeatBar` : sous-composant local qui lit les 3 stores et rend `<HeatThermometer compact />`.
Placé **après** `<GreetingCard>` / `<MinorBadge>`, dans les 3 niveaux (Découverte, Apprentissage, Maîtrise).

`HeatGatedExplicitMode` : remplace `<ExplicitModeToggle>` pour les adultes.
- Palier >= 2 → affiche le toggle normal
- Palier 1 → affiche un placeholder verrouillé avec pts manquants

---

## Roadmap gates V2

| Palier | Gate | Écran | Priorité |
|--------|------|-------|---------|
| 3 — Ardent | Mode Scénario | à créer | Sprint 20+ |
| 4 — Brûlant | Gamme Kamasutra | à créer | Sprint 25+ |
| 5 — Incandescent | Cartes Expert (depth 3) | `hall-of-cards` | Sprint 25+ |

---

## Test manuel

1. Lancer l'app sur simulateur iOS ou web
2. Compléter `module-de-base` → baromètre doit monter (3pts)
3. Gagner 9 cartes common → palier 2 atteint (12pts), toggle explicit débloqué
4. Vérifier l'animation du fill thermomètre (bottom → top)
5. Switcher de thème → vérifier que le fond et le texte s'adaptent
6. Activer `prefers-reduced-motion` → fill statique sans animation
7. Jouer au DiceGame, quitter → `sessionCount` incrémenté dans DevTools
8. Finir une partie GooseGame (case 23) → `sessionCount` +1
