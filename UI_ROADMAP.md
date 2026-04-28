# UI Engineering — Plan de progression

> Généré 2026-04-28 — Mis à jour 2026-04-28 — À supprimer une fois les tâches intégrées dans les sprints.

---

## Ordre d'exécution

```
1. IconName typé
2. CARD_LAYOUT propre (corrections optiques comme tokens)
3. motion.ts (timings centralisés)
4. tokens.ts minimal (RADIUS, SPACE, TYPE_SCALE)
5. iconPaths.ts (source unique paths)
6. visual regression 12 captures
7. grain partagé (OffscreenCanvas unique)
8. CSS modules (seulement après tokens en place)
9. icon multi-renderer (renderIconDOM + renderIconCanvas)
10. Figma → tokens pipeline
```

---

## Court terme — 1 à 2 semaines ✅ TERMINÉ

### 1. Typer `iconName` en `IconName` ✅
- [x] Exporter `type IconName = keyof typeof ICON_MAP` depuis `app/utils/iconFromName.tsx`
- [x] Remplacer `iconName: string` partout (Card, CardConfig, GainedCard, DiceFace, SquareConfig, Player, types UI…)
- [x] Cascade complète résolue — 0 erreur TypeScript

### 2. Intégrer les corrections optiques dans CARD_LAYOUT ✅
- [x] Ajouter `iconCenterYDOM: 0.45` et `panelTopDOM: 0.66` dans `CARD_LAYOUT`
- [x] Remplacer les `+ 2` et `+ 1` inline dans `CSSCardFallback`

### 3. Centraliser les timings d'animation ✅
- [x] Créer `app/constants/motion.ts` avec `DURATION`, `STAGGER` et `EASING`
- [x] Remplacer toutes les valeurs hardcodées dans `CollectorCardCanvas`, `CardRenderer`, `FlipRevealOverlay`

### 4. Extraire ICON_NODES vers `iconPaths.ts` ✅
- [x] Créer `app/utils/iconPaths.ts` — 19 icônes (union CollectorCardCanvas + Board), source unique
- [x] Supprimer `ICON_NODES` de `CollectorCardCanvas.tsx` et `Board.tsx`

---

## Moyen terme — 1 à 2 mois

### 5. Design tokens complets (spacing + radius + typography)
- [ ] Créer `app/constants/tokens.ts` : `RADIUS`, `SPACE`, `TYPE_SCALE`
- [ ] Audit des valeurs hardcodées : radius (16/14/20/10/18/22), spacings en px
- [ ] Migration progressive — commencer par les composants cartes

### 6. Visual regression basique avec Playwright
Démarrer petit, étendre quand le pipeline est stable.
- [ ] Phase 1 : 3 rarities × 2 tailles × 2 thèmes = **12 captures**
- [ ] Phase 2 (pipeline stable) : extension à 3 rarities × 3 tailles × 5 thèmes = 45 captures
- [ ] Intégrer dans CI ou script local pre-push
- [ ] Priorité : CollectorCardFace + CollectorCardCanvas

### 7. Unifier le grain
- [ ] Supprimer la boucle pixel-par-pixel dans `makeFaceTexture()`
- [ ] Remplacer par une texture de bruit pré-générée partagée (OffscreenCanvas unique)
- [ ] Vérifier la cohérence visuelle DOM ↔ Canvas

### 8. CSS modules pour composants leaf stables
À faire APRÈS tokens.ts — sinon on migre des magic numbers dans des fichiers .module.css.
- [ ] Identifier composants avec inline styles statiques (pas thème-dépendants)
- [ ] Migrer : badges, boutons, layout wrappers
- [ ] Supprimer les `as React.CSSProperties` devenus inutiles

---

## Long terme — 3 à 6 mois

### 9. Icon system multi-renderer
Deux renderers explicites — pas une API unifiée avec `ctx | null` (trop magique).

```typescript
// Deux fonctions distinctes, intention claire
renderIconDOM(name: IconName, props: { size: number; color: string }): ReactElement
renderIconCanvas(name: IconName, ctx: CanvasRenderingContext2D, options: { x: number; y: number; size: number; color: string }): void
```

- [ ] Concevoir les deux APIs séparément
- [ ] Implémenter `renderIconCanvas` depuis les paths Lucide (pas de duplication)
- [ ] Supprimer ICON_NODES complètement

### 10. Typographic scale mathématique
- [ ] Choisir un ratio (1.25 Major Third ou 1.333 Perfect Fourth)
- [ ] Définir 6 steps dans `TYPE_SCALE`
- [ ] Contraindre tous les `textFont`/`nameFont` dans SIZE aux valeurs du scale

### 11. Figma → tokens pipeline (minimal)
- [ ] Export JSON des couleurs depuis Figma
- [ ] Script de génération de `theme.ts` depuis le JSON
- [ ] Zéro valeur de couleur écrite à la main dans le code

### 12. Choreography system
```typescript
MOTION.stagger(index, 'card')  // delay calculé, pas hardcodé
```
- [ ] Définir les familles d'animation (card, list, overlay)
- [ ] Remplacer les `delay: 0.1` hardcodés

---

## Exercices à faire (dans l'ordre)

1. **Sync renderer** — Screenshot côte à côte CSS fallback vs R3F, mesure pixel les écarts résiduels
2. **Hiérarchie gris** — CollectorCardFace en niveaux de gris : la hiérarchie tient-elle sans couleur ?
3. **Reproduce Stripe layout** — Une section hero Stripe avec uniquement des tokens (zéro valeur hardcodée)
4. **Icon multi-renderer** — Écrire `renderIconCanvas()` pour `Heart` uniquement, valider la parité visuelle
5. **Animation budget** — Timeline de toutes les durées actuelles, trouver la logique cachée (ou l'absence de logique)

---

## Niveau cible (mesurable)

- `iconName: IconName` — typo = erreur de compilation
- Changer `RADIUS.card` change **toutes** les cartes (DOM + Canvas)
- Changer `DURATION.cardFlip` change **toutes** les animations de flip
- Visual regression CI : 45 screenshots verts avant tout merge
- Un nouveau développeur comprend le système de rendu en 30 minutes (CARD_LAYOUT + iconPaths + tokens)
