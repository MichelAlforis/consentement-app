# Hall of Cards — Migration R3F

> **Décision** : Remplacer la galerie CSS scroll-snap + Framer Motion par une scène React Three Fiber complète.  
> **Déclencheur** : Rendu CSS jugé trop mécanique, pas cohérent avec l'ambiance premium de CollectorCardCanvas.  
> **Contrainte** : Capacitor WebView iOS 13+ / Android API 22+ — pas de WebGL 2.0 garanti, perf mobile critique.

---

## Audit — Chiffres clés

| Fichier | Lignes | Tech actuelle | Verdict |
|---|---|---|---|
| `HallOfCardsScreen.tsx` | 375 | Framer Motion + CSS scroll | 🔴 À remplacer |
| `CollectorCardCanvas.tsx` | 1247 | R3F + Canvas 2D | 🟡 Refactor requis |
| `CardFullscreenOverlay.tsx` | 184 | FM + R3F | 🟢 Réutilisable |
| `FlipRevealOverlay.tsx` | 230 | FM + CSS 3D | 🟢 OK, optionnel migrer |
| `cards-collector.ts` | 372 | Data pure | 🟢 Zéro changement |
| `unlockStore.ts` | 128 | Zustand persist | 🟡 Bug sync à corriger |
| `revealStore.ts` | 16 | Zustand ephemeral | 🟡 Bug sync à corriger |
| `useNormalizedPointer.ts` | 42 | Hook React | 🟢 Réutilisable tel quel |

---

## Problèmes identifiés (bloquants ou dettes)

### Critique

1. **revealStore/unlockStore désynchronisés** — `clearPending()` appelé en fin de `FlipRevealOverlay` mais si l'utilisateur ferme le modal avant la fin, les cartes `pendingIds` disparaissent sans être ajoutées à `ownedCards`. Risque de perte de cartes réelles.

2. **CollectorCardCanvas monolithique (1247 lignes)** — Mélange texture generation, R3F mesh, animations, post-processing, CSS fallback. Impossible à réutiliser dans la scène Hall sans extraire les concerns.

### Important

3. **GPU tier detection fragile** — `useGpuTier()` basé sur vendor strings, peut échouer sur certains WebViews Android.

4. **Permission gyroscope demandée 2×** — Une fois dans `CardFullscreenOverlay`, une fois dans `LightOverlay`. À centraliser dans un store ou hook singleton.

5. **Texture `makeFaceTexture()` recompilée à chaque render** — Pas de cache basé sur card ID. Sur 100+ cartes en scène, perf critique.

6. **Pas de `THREE.dispose()`** — Textures et matériaux non nettoyés à l'unmount. Memory leak progressif.

### Mineur

7. `toGainedCard()` appelé à chaque render pour chaque section sans `useMemo`.  
8. `drawFromPool()` ignore la profondeur (peut sortir des cartes Deck B hors contexte).  
9. `anim.current` mutation non reactive dans CollectorCardCanvas (pattern fragile).

---

## Architecture cible

```
HallOfCardsScreen (refait)
  └── <Canvas>                         ← scène R3F unique
        ├── <HallCameraRig>            ← drag/swipe = caméra qui glisse en X
        ├── <ThemeRow position={[x,0,0]}>   ← une ligne par thème
        │     ├── <CardPlane>          ← carte possédée (texture + tilt gyro)
        │     └── <LockedCardPlane>    ← carte verrouillée (dark + lock icon)
        ├── <HallEnvironment>          ← ambient light, env map, post-FX
        └── <HallUI>                   ← HTML overlay (progress bars, badges) via <Html>
  
CardFullscreenOverlay (inchangé)       ← zoom sur CollectorCardCanvas existant
FlipRevealOverlay (inchangé)           ← révélation CSS FM, ok
```

**Principes :**
- Le fullscreen overlay (CollectorCardCanvas) **reste intact** — seule la galerie migre
- Les textures sont **générées une fois par card ID** et mises en cache dans un module-level Map
- Le tilt gyro dans la galerie = effet subtil ambiant (camera drift 1-2°), pas par carte
- Post-FX : Bloom léger uniquement sur cartes Unique (comme en fullscreen)

---

## Plan de migration — 5 Sprints

### Sprint A — Prérequis bloquants *(1 sprint)*

**Objectif :** Corriger les bugs critiques avant de toucher à l'architecture.

| Tâche | Fichier | Notes |
|---|---|---|
| Fix sync revealStore/unlockStore | `revealStore.ts`, `FlipRevealOverlay.tsx` | Persister pendingIds ou committer immédiatement à l'unlock |
| Centraliser permission gyro | Nouveau `useGyroPermission.ts` | Singleton, demande une seule fois, expose state global |
| Ajouter `THREE.dispose()` à l'unmount | `CollectorCardCanvas.tsx` | Évite les memory leaks sur navigation |
| Cache texture par card ID | `CollectorCardCanvas.tsx` | `Map<string, THREE.Texture>` module-level |

**Livrable :** Bugs résolus, base saine pour la migration.

---

### Sprint B — Extraction CollectorCardCanvas *(1-2 sprints)*

**Objectif :** Découper le monolithe en modules réutilisables.

```
game-engine/cards/
  ├── CollectorCardCanvas.tsx       ← orchestrateur (simplifié)
  ├── useCardTexture.ts             ← génération + cache texture (Canvas 2D)
  ├── CardMesh.tsx                  ← PlaneGeometry arrondie + material
  ├── CardAnimations.ts             ← reveal, flip, bounce, idle (useFrame)
  ├── CardRarityFX.tsx              ← particules unique, glow rare
  └── CardPostFX.tsx                ← Bloom, Vignette, Error boundary
```

| Tâche | Notes |
|---|---|
| Extraire `useCardTexture(card, rarity)` | Retourne `{ faceTexture, backTexture }` avec cache |
| Extraire `CardMesh.tsx` | Reçoit textures en props, gère material + geometry |
| Extraire `CardAnimations.ts` | `useRevealAnim`, `useFlipAnim`, `useIdleAnim` |
| Extraire `CardRarityFX.tsx` | Particules unique + glow ring rare |

**Livrable :** `CardMesh` importable dans la future scène Hall sans embarquer tout CollectorCardCanvas.

---

### Sprint C — Scène Hall R3F *(2 sprints)*

**Objectif :** Construire la nouvelle galerie 3D.

```typescript
// Structure cible HallScene.tsx
<Canvas frameloop="demand" dpr={[1, 1.5]}>
  <HallCameraRig>      {/* drag X = scroll entre thèmes */}
  <HallEnvironment />  {/* ambient + directional light */}
  {THEME_CATEGORIES.map((theme, i) => (
    <ThemeRow key={theme} offsetX={i * ROW_SPACING}>
      {cardsForTheme.map(card => (
        owned
          ? <CardPlane card={card} onClick={openFullscreen} />
          : <LockedCardPlane card={card} />
      ))}
    </ThemeRow>
  ))}
  <EffectComposer>
    <Bloom luminanceThreshold={0.8} intensity={0.4} />
  </EffectComposer>
</Canvas>
```

| Tâche | Notes |
|---|---|
| `HallCameraRig.tsx` | `useSpring` + `useDrag` (use-gesture) pour déplacer la caméra en X |
| `CardPlane.tsx` | Réutilise `CardMesh` + `useCardTexture` + tilt gyro subtil |
| `LockedCardPlane.tsx` | Dos de carte sombre + icône lock en `<Html>` overlay |
| `ThemeRow.tsx` | Layout des cartes en ligne, espacement |
| `HallEnvironment.tsx` | Lumières + env map + post-FX conditionnels par GPU tier |
| Raycast tap → fullscreen | `onClick` sur CardPlane → ouvre CardFullscreenOverlay existant |

**Livrable :** Nouvelle galerie R3F fonctionnelle, CSS Hall retiré.

---

### Sprint D — Performance & Polish *(1 sprint)*

**Objectif :** Tenir 60fps sur mid-range Android WebView.

| Tâche | Technique |
|---|---|
| LOD (Level of Detail) | Cartes hors viewport → texture basse résolution ou quad simple |
| Frustum culling | Ne pas rendre les cartes hors du frustum caméra |
| Texture atlas | Regrouper les textures communes (dos, lock icon) en atlas |
| `frameloop="demand"` + invalidate | Ne render que sur interaction/animation active |
| Tilt gyro hall = camera drift | 1-2° ambient sur tout le hall, pas par carte (1 `useFrame` global) |
| Benchmark Capacitor | Test sur iPhone 13 + Pixel 6 (appareils cibles minimum) |

---

### Sprint E — Nettoyage & Régression *(0.5 sprint)*

| Tâche | Notes |
|---|---|
| Supprimer HallOfCardsScreen.tsx CSS | Remplacé par HallScene |
| Vérifier FlipRevealOverlay intact | Regression test révélation cartes |
| Vérifier CardFullscreenOverlay intact | Regression test fullscreen |
| Mettre à jour i18n si nouveaux strings | Sections / labels Hall |
| Mettre à jour MEMORY.md + docs | project_collector_card_status.md |

---

## Estimation globale

| Sprint | Effort estimé | Priorité |
|---|---|---|
| A — Prérequis bloquants | 3-4 jours | **Immédiat** (bugs prod) |
| B — Extraction CollectorCardCanvas | 4-5 jours | Avant Sprint C |
| C — Scène Hall R3F | 7-10 jours | Cœur de la migration |
| D — Performance & Polish | 3-4 jours | Avant release |
| E — Nettoyage | 1-2 jours | Dernier |
| **Total** | **~20-25 jours** | |

---

## Ce qui NE change pas

- `cards-collector.ts` — données intactes
- `CardFullscreenOverlay.tsx` — overlay fullscreen inchangé
- `FlipRevealOverlay.tsx` — révélation inchangée
- `unlockStore.ts` / `revealStore.ts` — logique métier (sauf fix sync Sprint A)
- `useNormalizedPointer.ts` — hook réutilisé
- Tout le système de thèmes, heat, modules

---

## Risques

| Risque | Probabilité | Mitigation |
|---|---|---|
| Perf WebView Android bas de gamme | Haute | LOD + `frameloop="demand"` + GPU tier gate |
| Complexité `HallCameraRig` (touch vs scroll) | Moyenne | Prototype isolé avant intégration |
| Régression FlipRevealOverlay | Faible | Scénarios manuels + Playwright |
| WebGL non disponible (vieux Android) | Faible | Fallback vers CSS Hall (conserver en backup 3 mois) |
