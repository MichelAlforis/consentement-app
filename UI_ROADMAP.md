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

## Moyen terme — 1 à 2 mois ✅ TERMINÉ

### 5. Design tokens complets (spacing + radius + typography) ✅
- [x] Créer `app/constants/tokens.ts` : `RADIUS`, `SPACE`, `TYPE`
- [x] Audit des valeurs hardcodées : radius 20 (×11) → `RADIUS.card`, 12 → `RADIUS.badge`, 3 → `RADIUS.dot`
- [x] Migration appliquée sur CardRenderer, CollectorCardCanvas, FlipRevealOverlay

### 6. Visual regression basique avec Playwright ✅
- [x] Phase 1 : 3 rarités × 2 états (dos/face) × 2 renderers (WebGL/CSS) = **12 captures**
- [x] Spec créée dans `e2e/visual-regression.spec.ts`
- [x] `data-testid="card-{rarity}"` ajouté à CardSlot dans la sandbox
- [ ] Phase 2 (pipeline stable) : étendre à tailles + thèmes via params URL sandbox

### 7. Unifier le grain ✅
- [x] Supprimer la boucle pixel-par-pixel dans `makeFaceTexture()`
- [x] `getSharedGrain(w, h)` : cache `Map<string, HTMLCanvasElement>`, généré une fois par session
- [x] `ctx.drawImage(getSharedGrain(...))` — même visuel, O(1) au lieu de O(n*m)

### 8. CSS modules pour composants leaf stables ✅
- [x] `CardRenderer.module.css` : layout container/perspective/flipper/face/badge
- [x] Inline styles réduits aux valeurs thème-dépendantes (background, border, boxShadow)
- [x] `RADIUS.*` tokens appliqués partout — plus de magic numbers `20`/`12`/`3`

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

## Lacunes identifiées — à planifier

### A. Tests de logique
- [ ] `useGooseGame` : couvrir les transitions d'état (accord → résultat, chance → rebond, fin de partie)
- [ ] `computeGainedCards` : cas limites (pool vide, doublons, rarity distribution)
- [ ] Outil suggéré : Vitest (compatible Next.js, pas besoin de browser)

### B. Accessibilité
- [ ] Focus trap sur tous les overlays (`FlipRevealOverlay`, `AccordFlow`, `ActivityOverlay`)
- [ ] Labels ARIA sur les boutons icône (pions, dés, cartes)
- [ ] Vérification contrast ratio des 3 thèmes — cible WCAG AA
- [ ] Bloquant App Store si non traité (Apple review peut rejeter)

### C. i18n — complétion
- [ ] Identifier les écrans non migrés (cf. liste dans mémoire projet)
- [ ] Aucun texte en dur dans le JSX hors tests

### D. Onboarding
- [ ] Documenter et committer les changements en cours (`AppShell`, `RouteRenderer`, `OnboardingScreenLoader`)
- [ ] Dots de progression : tester adult vs minor (longueur de liste différente)
- [ ] Skeleton loader `OnboardingScreenLoader` : valider le timing avec le lazy load réel

### E. Budget performance mobile
- [ ] Définir des cibles : LCP < 2s, frame budget R3F ≥ 30fps sur Android API 22
- [ ] Mesurer la taille du bundle R3F (Three.js pèse lourd)
- [ ] Tester sur device bas de gamme avant App Store submission

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
