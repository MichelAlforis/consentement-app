# Roadmap visuelle — Plan d'amélioration 3 niveaux

> Màj 2026-04-25 (v2) · 6 sujets × 3 niveaux = 18 chantiers
> ✅ = livré · ⬜ = à faire

> **L1** = polish/quick wins (1–4h) · **L2** = feature significative (demi-journée) · **L3** = effet signature (1–3 jours)

---

## 1. Dos de carte

**L1 — Polish**
- ✅ Grain SVG : `feTurbulence fractalNoise` opacity 0.032 — aligne la texture avec le renderer Canvas 2D
- ⬜ Fine-tune symbole : tester opacity 0.65 vs 0.82, ajuster zone de rendu pour centrage vertical exact
- ✅ Grille diamants : cellule 10% au lieu de 8.8% — moins dense, plus aéré

**L2 — Effet matière**
- ⬜ Shimmer animé : `@keyframes` sur l'offset du dégradé shim (SVG) ou `useFrame` (R3F) — effet satin en mouvement lent
- ⬜ Double bordure : bordure intérieure fine `rgba(255,255,255,0.06)` — profondeur premium

**L3 — Foil iridescent**
- ⬜ Shader WebGL custom : uniform `u_tilt` nourri par gyroscope/pointermove → shift de teinte HSL selon l'angle — effet carte holographique physiquement plausible

---

## 2. Face de carte

**L1 — Lisibilité**
- ✅ Icône : `iconR * 1.4` → `iconR * 1.6`, sepY recalculé (`iconR * 1.72`)
- ✅ Texte : font-weight 500, padding latéral `0.18`, lineHeight `0.134`
- ✅ Common : bordure 5px → 2.5px (rare/unique gardent 5px pour le Bloom)
- ✅ Common : overlay `rgba(20,30,60,0.08)` supprimé — couleur native respire

**L2 — Background per-rarity**
- ✅ Common : arcs concentriques géométriques depuis bas-centre, opacity 0.04
- ✅ Rare : nébuleuse radiale indigo/violet — 3 blobs superposés asymétriques
- ✅ Unique : gradient flamme chaud bas + 5 tendrilles sinusoïdaux Canvas 2D

**L3 — Illustration générative**
- ⬜ Seed depuis le texte de la carte → dessin procédural Canvas 2D unique (Lissajous, fractale légère) — chaque carte visuellement unique dans la même rareté

---

## 3. Animation

**L1 — Physique + feedback**
- ✅ Flip speeds per rarity : common 0.52s / rare 0.62s / unique 0.70s
- ✅ Wobble Z : `0.06 rad` → `0.04 rad`
- ⬜ Haptics à `triggerFlip()` via `useHaptics()` : medium impact départ, light à l'atterrissage

**L2 — Entrée scène**
- ⬜ Reveal animation : carte entre par le bas (`position.y = -3 → 0`), `easeOutCubic` 0.4s, au mount
- ⬜ Idle float rare : ✅ **livré** — `sin(t * 0.8) * 0.015` sur `position.y`

**L3 — Pack opening**
- ⬜ Séquence cinématique booster : cartes dos caméra → flash lumière → flip en cascade avec delay index → particules burst R3F au flip unique

---

## 4. Rarités

**L1 — Différenciation immédiate**
- ✅ Common : overlay `rgba(20,30,60,0.08)` supprimé
- ✅ Rare : `pointLight` pulsé `useFrame` — intensité `0.26 ± 0.08 × sin(Date.now() * 0.0014)`
- ✅ Rare : flottement vertical idle `sin(t * 0.8) * 0.015`
- ✅ Unique : particles emitter (`THREE.Points`, 12 points dorés, rotation 0.22 rad/s, pulse opacity)

**L2 — Aura et matière**
- ⬜ Rare : second glow ring animé (opacity `0.12 + sin(t*1.4)*0.06`) — respiration
- ⬜ Unique : shader iridescent sur glow ring (gradient arc-en-ciel rotation lente)
- ⬜ Badge rareté : fade-in au flip (scale 0.8 → 1.0, 0.3s)

**L3 — Effets physiquement basés**
- ⬜ `MeshPhysicalMaterial` sur face unique : `iridescence: 1`, `iridescenceIOR: 1.3`, `metalness: 0.1`

---

## 5. Card Collector (meta-jeu)

**L1 — État persistant**
- ⬜ `unlockStore` localStorage : `gainedCards: GainedCard[]`, `seenCardIds: Set<string>`
- ⬜ Badge "NEW" sur cartes non vues (dot rouge, disparaît au premier flip)
- ⬜ Compteur global `x/N cartes` dans l'UI

**L2 — Grille collection**
- ⬜ Écran `/collection` : grille 3 colonnes, locked / unlocked / new
- ⬜ Filtres par rareté (chips Common / Rare / Unique)
- ⬜ Tap → flip reveal plein écran (modal R3F isolé)

**L3 — Progression gamifiée**
- ⬜ Sets thématiques : débloquer les 3 common d'un thème → bonus ou carte secrète
- ⬜ Streak journalier : 3 jours consécutifs → rare garantie
- ⬜ Partage social : snapshot PNG Canvas 2D → partage natif Capacitor

---

## 6. Assets stores

**L1 — Icône**
- ✅ Icône App Store 1024×1024 → `image/stores/app-store/icon/icon-1024.png`
- ✅ Icône Google Play 512×512 → `image/stores/google-play/icon/icon-512.png`
- ⬜ Variante fond clair pour adaptive icon Google Play (optionnel)

**L2 — Screenshots**
- ✅ Fonds Midjourney générés — 3 screenshots App Store + feature graphic Google Play
- ⬜ Montage Figma : texte + mockup simulateur sur chaque fond (voir `assets-pipeline.md`)
- ⬜ Screenshots Google Play (optionnel — même fonds réutilisables)

**L3 — Preview vidéo App Store**
- ⬜ Capture cinématique pack opening → vidéo 30s H.264 MP4 portrait 9:16

---

## Tableau de bord

| Sujet | L1 | L2 | L3 |
|---|---|---|---|
| Dos de carte | 2/3 ✅ | ⬜ | ⬜ |
| Face de carte | 4/4 ✅ | 3/3 ✅ | ⬜ |
| Animation | 2/3 ✅ | 1/2 ✅ (idle rare) | ⬜ |
| Rarités | 4/4 ✅ | ⬜ | ⬜ |
| Card Collector | ⬜ | ⬜ | ⬜ |
| Assets stores | 2/3 ✅ | fonds ✅ · Figma ⬜ | ⬜ |
