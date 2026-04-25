# Roadmap visuelle — Plan d'amélioration 3 niveaux

> Màj 2026-04-25 · 6 sujets × 3 niveaux = 18 chantiers

> **L1** = polish/quick wins (1–4h) · **L2** = feature significative (demi-journée) · **L3** = effet signature (1–3 jours)

---

## 1. Dos de carte

**L1 — Polish**
- Grain SVG : `feTurbulence` + `feDisplacementMap` pour aligner la texture des deux renderers
- Fine-tune symbole : tester opacity 0.65 vs 0.82, ajuster zone de rendu pour centrage vertical exact
- Grille diamants : cellule 10% au lieu de 8.8% — moins dense, plus aéré

**L2 — Effet matière**
- Shimmer animé : `@keyframes` sur l'offset du dégradé shim (SVG) ou `useFrame` (R3F) — effet satin en mouvement lent
- Double bordure : bordure intérieure fine `rgba(255,255,255,0.06)` — profondeur premium

**L3 — Foil iridescent**
- Shader WebGL custom : uniform `u_tilt` nourri par gyroscope/pointermove → shift de teinte HSL selon l'angle — effet carte holographique physiquement plausible

---

## 2. Face de carte

**L1 — Lisibilité**
- Icône : `iconR * 1.4` → `iconR * 1.6`, repositionner séparateur en conséquence
- Texte : font-weight 700 → 600, lineHeight 1.35 → 1.45, padding latéral `0.14` → `0.18`
- Common : bordure 5px → 2.5px (paraît lourde vs rare/unique)

**L2 — Background per-rarity**
- Common : motif vague géométrique (arcs `ctx.arc` en boucle, opacity très basse)
- Rare : nébuleuse radiale violet/indigo (3 cercles superposés, `source-over`)
- Unique : texture flamme Canvas 2D animée (update texture à chaque flip)

**L3 — Illustration générative**
- Seed depuis le texte de la carte → dessin procédural Canvas 2D unique (Lissajous, fractale légère) — chaque carte est visuellement unique même dans la même rareté

---

## 3. Animation

**L1 — Physique + feedback**
- Flip speeds per rarity : common 0.52s, rare 0.62s, unique 0.70s — chaque rareté a son rythme
- Haptics à `triggerFlip()` via `useHaptics()` : medium impact départ, light à l'atterrissage
- Wobble Z : `0.06 rad` → `0.04 rad` — moins théâtral

**L2 — Entrée scène**
- Reveal animation : carte entre par le bas (`position.y = -3 → 0`), `easeOutCubic` 0.4s, au mount
- Idle float rare : `sin(t * 0.8) * 0.015` sur `position.y` (moins amplifié que unique)

**L3 — Pack opening**
- Séquence cinématique booster : cartes dos caméra → flash lumière → flip en cascade avec delay index → particules burst R3F au flip unique

---

## 4. Rarités

**L1 — Différenciation immédiate**
- Common : retirer overlay `rgba(20,30,60,0.08)` — teinte bleue indésirable
- Rare : halo pulsé idle (`sin(t)` sur intensité du `pointLight`, amplitude 0.06)
- Unique : particles emitter simple (12 points dorés orbitant, `THREE.Points`)

**L2 — Aura et matière**
- Rare : second glow ring animé (opacity `0.12 + sin(t*1.4)*0.06`) — respiration
- Unique : shader iridescent sur glow ring (gradient arc-en-ciel rotation lente)
- Badge rareté : fade-in au flip (scale 0.8 → 1.0, 0.3s)

**L3 — Effets physiquement basés**
- `MeshPhysicalMaterial` sur face unique : `iridescence: 1`, `iridescenceIOR: 1.3`, `metalness: 0.1` — foil arc-en-ciel réel réagissant aux lumières de scène

---

## 5. Card Collector (meta-jeu)

**L1 — État persistant**
- `unlockStore` localStorage : `gainedCards: GainedCard[]`, `seenCardIds: Set<string>`
- Badge "NEW" sur cartes non vues (dot rouge, disparaît au premier flip)
- Compteur global `x/N cartes` dans l'UI

**L2 — Grille collection**
- Écran `/collection` : grille 3 colonnes, locked (`LockedCard`) / unlocked / new
- Filtres par rareté (chips Common / Rare / Unique)
- Tap → flip reveal plein écran (modal R3F isolé)

**L3 — Progression gamifiée**
- Sets thématiques : débloquer les 3 common d'un thème → bonus ou carte secrète
- Streak journalier : 3 jours consécutifs → rare garantie
- Partage social : snapshot PNG Canvas 2D de la collection → partage natif Capacitor

---

## 6. Assets stores

**L1 — Icône**
- Générer icône 1024×1024 depuis le symbole vectoriel en Canvas 2D (même palette que CardBack) → `image/stores/icon-1024.png`
- Variante fond clair pour adaptive icon Google Play

**L2 — Screenshots**
- Simulateur iPhone 16 Pro → 3 screenshots : accueil, plateau, collection
- Feature graphic Google Play 1024×500 : bannière fond Midjourney + carte R3F flottante

**L3 — Preview vidéo App Store**
- Capture cinématique pack opening → vidéo 30s
- Motion design texte "Jouez. Découvrez. Connectez."
- Export H.264 MP4, portrait 9:16

---

## Priorité recommandée

| Sujet | L1 | L2 | L3 |
|---|---|---|---|
| Dos de carte | ✅ fait + grain | shimmer animé | foil shader |
| Face de carte | icône + texte | bg per-rarity | génératif |
| Animation | speeds + wobble | reveal + float | pack opening |
| Rarités | common overlay + pulse | second ring | MeshPhysical |
| Card Collector | unlockStore | /collection | gamification |
| Assets stores | icône 1024 | screenshots | vidéo |
