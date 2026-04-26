# Convergence visuelle — PlayingCard ↔ CollectorCard

**Statut :** 📋 Planifié  
**Date :** 2026-04-26  
**Fichiers concernés :**
- `app/components/screens/CardGame/PlayingCard.tsx`
- `app/game-engine/cards/CollectorCardCanvas.tsx`

---

## Contexte

L'application a deux systèmes de cartes qui utilisent des stacks différents pour des raisons légitimes :

| | PlayingCard | CollectorCard |
|---|---|---|
| **Rôle** | Outil de jeu — question à lire | Récompense — objet à collectionner |
| **Stack** | CSS + Framer Motion | R3F (Three.js) |
| **Taille** | 290px (quasi plein écran) | 140–160px (fin de séance) |
| **Interaction** | Swipe, drag, tilt pointer | Flip, gyroscope, bloom |
| **Texte** | CSS natif — lisibilité prioritaire | Canvas texture — rendu premium |

Ces deux stacks restent justifiés et ne seront pas unifiés. En revanche, leur **langage visuel diverge** au point de créer une rupture dans l'expérience — l'une est claire et légère, l'autre est sombre et premium.

---

## Delta actuel

| Propriété | PlayingCard | CollectorCard | Écart |
|---|---|---|---|
| Border radius | 28px | 14px | ❌ Important |
| Fond face | `colors.bgCard` (clair) | `card.gradient` sur `#0a0810` | ❌ Majeur |
| Couleur texte face | `colors.textPrimary` (sombre) | `#f1f3f5` (blanc) | ❌ Majeur |
| Ombre | `0 20px 56px ${cat.border}44` | ContactShadows géométrique | ⚠️ Mineur |
| Dos — pattern | Gradient catégorie + dots blancs | Midjourney + symbol logo | ⚠️ Visible |
| Dos — identité | Anonyme (icône + nom paquet) | Logo watermark app | ⚠️ Visible |
| Shimmer/foil | Foil pointer (screen blend) | Shimmer sweep + gyro radial | ✅ Même intention |
| Badge overlay | Gradient pill catégorie | Gradient pill rareté | ✅ Même forme |
| Depth signal | 3 dots colorés | Bloom ring + particles | ✅ Même sémantique |

---

## Ce qui est déjà convergent — ne pas toucher

- Les deux ont un **effet foil/shimmer** sur les objets de valeur (techniques différentes, intention identique)
- Les deux ont un **badge gradient arrondi** en overlay
- Les deux ont une **ombre teintée** par la couleur propre à la carte
- Les deux ont un **dos gradient** avec pattern de texture

---

## Plan de convergence — 3 sprints indépendants

### Sprint C1 — Border radius (1h)

**Objectif :** token de forme partagé  
**Valeur cible : 20px** (milieu entre 28px PlayingCard et 14px CollectorCard)

**Fichiers :**
- `PlayingCard.tsx` — `borderRadius: 28` → `20` (dos + face + DeckStack)
- `CollectorCardCanvas.tsx` — `makeRoundedCardGeometry(1, 1.5, 0.086)` → rayon proportionnel à ~20px écran
  - À 160px display, 0.086 unités = ~1.6px visuel → trop petit
  - Cible : rayon visuel ~12px → `r = 12 / (160 / 2) * 1 = 0.15` → `makeRoundedCardGeometry(1, 1.5, 0.15)`
- `CSSCardFallback` — `borderRadius: 14` → `20`
- `LightOverlay` — `borderRadius: 14` → `20`

**Risque :** faible. Changement cosmétique pur.

---

### Sprint C2 — Fond sombre PlayingCard (4-6h)

**Objectif :** unifier le registre visuel — les deux cartes vivent dans le même univers sombre et premium

**Avant :**
```tsx
// Face — fond clair adaptatif au thème
background: colors.bgCard   // blanc ou gris clair selon le thème
color: colors.textPrimary   // texte sombre
```

**Après :**
```tsx
// Face — fond sombre basé sur la couleur catégorie
background: buildFaceBg(cat.gradient)  // gradient sombre dérivé de la catégorie
color: 'rgba(255,255,255,0.92)'        // texte blanc
```

**`buildFaceBg(gradient)`** — fonction à créer :
```ts
function buildFaceBg(gradient: string): string {
  // Extrait la couleur du gradient catégorie, la désature et l'assombrit
  // Résultat : '#0f0c18 → ${catColor}22' (très sombre, teinté)
  const [c1] = parseGradient(gradient); // ex: '#f59e0b'
  return `linear-gradient(160deg, #0c0a16 0%, ${c1}18 100%)`;
}
```

**Autres ajustements côté face :**
- `colors.textPrimary` → `rgba(255,255,255,0.92)` (texte principal)
- `colors.textMuted` → `rgba(255,255,255,0.45)` (texte secondaire)
- `colors.border` → `rgba(255,255,255,0.10)` (bordure de la carte)
- Badge catégorie : fond gradient conservé, texte blanc déjà blanc ✓
- Depth dots : `d <= depth ? cat.border : 'rgba(255,255,255,0.15)'`
- Foil opacity : augmenter légèrement (screen blend sur fond sombre = plus visible)
- Stripes top/bottom → conserver (elles deviennent des accents de couleur sur fond sombre, comme la bordure CollectorCard)
- `boxShadow` face → `0 20px 56px ${cat.border}55, 0 4px 20px rgba(0,0,0,0.40)`

**Côté dos :** aucun changement (déjà gradient catégorie sur fond coloré)

**Risque :** moyen. Impact visuel majeur — prévoir test sur device et validation thème par thème (warm/calm/dark-luxury/nude/youth).

> **Note thème `youth` :** le foil est déjà désactivé (`foilTargetOpacity = 0`). Le fond sombre peut avoir une exception pour ce thème si les tests montrent un problème de lisibilité pour les 13-14 ans.

---

### Sprint C3 — Logo watermark sur le dos PlayingCard (2-3h)

**Objectif :** même identité visuelle sur les deux dos de cartes

**Avant :** PlayingCard dos = gradient catégorie + dots blancs + icône + nom  
**Après :** idem + watermark symbol logo en `position: absolute`, centré, opacity `0.05`

**Implémentation :**
Le `BACK_SYMBOL_PATH` est déjà disponible dans `CollectorCardCanvas.tsx`. Pour PlayingCard (CSS), le rendu SVG inline :

```tsx
// Dans le dos de PlayingCard, après le dot pattern
<svg
  viewBox="0 0 336 1044"
  style={{
    position: 'absolute',
    width: '45%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.05,
    pointerEvents: 'none',
  }}
>
  <path d={BACK_SYMBOL_PATH} fill="white" fillRule="evenodd" />
</svg>
```

**Import :** exporter `BACK_SYMBOL_PATH` depuis `CollectorCardCanvas.tsx` (actuellement `const` privée).

**Risque :** faible. Le watermark est subtil (opacity 0.05) — invisible si on ne le cherche pas, mais présent dans l'ADN visuel.

---

## Ordre recommandé

```
C1 (border radius)     → rapide, visible immédiatement, valide l'intent
C3 (watermark dos)     → rapide, faible risque, renforce l'identité
C2 (fond sombre face)  → plus long, impact visuel majeur, nécessite validation thèmes
```

C1 + C3 peuvent être fait dans la même session (2-3h).  
C2 est un sprint dédié avec test device obligatoire.

---

## Ce qu'on ne converge PAS

| Propriété | Raison |
|---|---|
| Tilt interaction | PlayingCard = pointer; CollectorCard = gyroscope. Contextes différents (jeu actif vs contemplation). |
| Alignement texte | PlayingCard = gauche (lisibilité de question longue); CollectorCard = centré (texte court, présentation). |
| Stack de rendu | CSS vs R3F — décision architecturale validée, les deux ont leurs raisons. |
| Taille | PlayingCard = 290px (plein écran); CollectorCard = 140-160px (révélation). Pas comparables. |
| Fond global Canvas | CollectorCard a `#0a0810` comme fond Canvas WebGL — non modifiable sans impact PostFX. |

---

## Tokens visuels partagés cibles

Après C1 + C2 + C3, les deux cartes partageront :

| Token | Valeur |
|---|---|
| Border radius | 20px |
| Fond face | Sombre (dark + couleur catégorie/rareté) |
| Texte face | Blanc `rgba(255,255,255,0.90–0.92)` |
| Ombre | Colorée par la couleur propre à la carte |
| Dos | Gradient + pattern + watermark symbol |
| Badge overlay | Gradient pill arrondi, texte blanc, typographie bold |
| Effet de profondeur | Foil / shimmer — même intention, déclinaisons techniques différentes |
