# Pipeline assets — Génération et organisation

> Màj 2026-04-25 — icônes ✅ · screenshots fonds ✅ · feature graphic ✅ · montage Figma ⬜

---

## Règle fondamentale

> **Aucune image bitmap dans le code runtime.** Toutes les textures sont générées en Canvas 2D ou SVG inline. Les images Midjourney sont uniquement pour les stores et le marketing.

---

## Assets générés en code (runtime)

| Asset | Fichier | Technique | Taille |
|---|---|---|---|
| Dos de carte SVG | `CardBack.tsx` | SVG inline React | — |
| Texture dos R3F | `makeBackTexture()` dans `CollectorCardCanvas.tsx` | Canvas 2D → CanvasTexture | 512×768 |
| Texture face R3F | `makeFaceTexture()` dans `CollectorCardCanvas.tsx` | Canvas 2D → CanvasTexture | 512×768 |
| Icônes Lucide | `drawIconNodes()` / `buildIconTexture()` | Path2D Canvas 2D | 128×128 |
| Carte verrouillée | `LockedCard.tsx` | CSS pur | — |
| Dé 3D | `BoardDice3D` | R3F + PBR | — |

---

## Assets Midjourney (hors code)

Voir [midjourney-prompts.md](midjourney-prompts.md) pour les prompts complets.

### Organisation `image/`

```
image/
├── brand/
│   └── logo/
│       ├── logo.png                        — N&B original (Midjourney)
│       ├── Apple.png                       — master icône iOS (couleurs DA) ✅
│       ├── Android.png                     — master icône Android (couleurs DA) ✅
│       └── symbol.svg                      — tracé vectoriel symbole ✅
│
├── stores/
│   ├── app-store/
│   │   ├── icon/
│   │   │   └── icon-1024.png ✅            — App Store (1024×1024, squircle iOS)
│   │   ├── screenshots/
│   │   │   ├── screenshot-1-hands.png ✅   — fond : mains bokeh doré
│   │   │   ├── screenshot-2-bedroom.png ✅ — fond : bougie chambre violet
│   │   │   └── screenshot-3-auras.png ✅   — fond : auras translucides violet/bleu
│   │   └── preview/                        — ⬜ vidéo optionnelle (L3)
│   └── google-play/
│       ├── icon/
│       │   ├── icon-1024.png ✅            — source master
│       │   └── icon-512.png ✅             — Google Play (512×512)
│       ├── feature-graphic/
│       │   └── feature-graphic.png ✅      — fond : particules or sur bordeaux
│       └── screenshots/                    — ⬜ à générer (optionnel)
│
├── cards/
│   └── templates/                          — références DA (jamais importées en code)
│       ├── card-back-reference.png ✅      — dos : velvet diamants violet/or
│       ├── deck-a-face-reference.png ✅    — face Deck A : glow centré froid indigo
│       ├── deck-b-face-reference.png ✅    — face Deck B : glow chaud bordeaux/rose
│       └── unique-foil-reference.png ✅    — unique : foil iridescent arc-en-ciel
│
└── marketing/                              — ⬜ social, presse
```

---

## Pipeline symbole vectoriel

Le motif central "deux silhouettes" a été vectorisé en plusieurs étapes :

```
1. Génération Midjourney
   → PNG 2048px, fond blanc/transparent

2. Auto-trace Inkscape (ou potrace)
   → SVG brut ~120KB, nombreux subpaths

3. Filtre subpaths
   → Garder seulement les 1-2 plus grands paths
   → 8.1KB (2 paths) ou 7.2KB (1 path)

4. Optimisation SVGO
   → Options : precision 1, removeViewBox false
   → Résultat final utilisé

5. Embedding inline
   → Copier le "d=" dans SYMBOL_PATH / BACK_SYMBOL_PATH
   → Ajouter // prettier-ignore avant la constante
```

> **Format path** : viewBox `0 0 336 1044` — conserver ces dimensions pour le centrage.

---

## Icônes Lucide — pipeline Path2D

Les icônes des cartes sont dessinées à la main via `drawIconNodes()` qui accepte les mêmes noeuds SVG que Lucide :

```ts
const ICON_NODES: Record<string, SvgNode[]> = {
  MessageCircle: [['path', { d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' }]],
  Crown: [['path', { d: '...' }]],
  // ...
}
```

Pour ajouter une nouvelle icône :
1. Copier le SVG depuis lucide.dev (ou la source)
2. Extraire les noeuds `path`, `circle`, `rect`, `polygon`, `line`
3. Ajouter l'entrée dans `ICON_NODES`

Taille de rendu : `sizePx / 24` (Lucide utilise viewBox `0 0 24 24`).

---

## Canvas texture — bonnes pratiques

- Résolution recommandée : `512` (→ 512×768) — bon équilibre qualité/mémoire
- Toujours appeler `tex.needsUpdate = true` après création
- Jamais de `shadowBlur` sur Path2D complexe (freeze garanti sur 7KB+)
- Grain : bands horizontales `sin()` + highlights aléatoires (même technique que Pawn3D)

---

## Montage Figma — Screenshots stores

Les fonds sont générés. Il reste à composer les screenshots finaux dans Figma avant soumission.

### Ce qui manque par screenshot

| Screenshot | Fond | Texte titre | Mockup app | Statut |
|---|---|---|---|---|
| 1 — Mains | `screenshot-1-hands.png` ✅ | "Explorez ensemble" | ⬜ | ⬜ |
| 2 — Chambre | `screenshot-2-bedroom.png` ✅ | "À votre rythme" | ⬜ | ⬜ |
| 3 — Auras | `screenshot-3-auras.png` ✅ | "Connectez-vous" | ⬜ | ⬜ |
| Feature graphic | `feature-graphic.png` ✅ | Logo + tagline | — | ⬜ |

### Specs Figma

- **Frame App Store** : 1290×2796 px — exporter PNG @1x
- **Frame Google Play** : 1024×500 px — exporter PNG @1x
- **Police** : SF Pro Display (iOS) ou Inter — bold, blanc, ombre légère
- **Mockup** : screenshot du simulateur iPhone 16 Pro dans un device frame transparent
- **Texte** : positionné dans le tiers supérieur, au-dessus du mockup

### Device frame

Télécharger le device frame iPhone 16 Pro sur [Apple Design Resources](https://developer.apple.com/design/resources/) — fichier Sketch/Figma officiel.

---

## Formats exports stores

| Store | Asset | Format | Dimensions |
|---|---|---|---|
| App Store | Icône | PNG, sans transparence | 1024×1024 |
| App Store | Screenshots | PNG | 1290×2796 (6.7") |
| Google Play | Icône | PNG | 512×512 |
| Google Play | Feature graphic | PNG/JPEG | 1024×500 |
| Google Play | Screenshots | PNG | variable |
