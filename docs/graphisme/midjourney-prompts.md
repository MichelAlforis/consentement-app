# Midjourney — Prompts DA · Consentement App

> Directeur artistique : Claude  
> Mise à jour : 2026-04-24  
> Usage : assets stores, marketing, références visuelles — **pas d'images dans le code** (CanvasTexture/SVG uniquement en runtime)

---

## Identité visuelle

**Palette fixe**
- Violet profond `#1e1b2e` / `#8b5cf6`  
- Prune/bordeaux `#4a0522` / `#ec4899`  
- Or chaud `#f59e0b`  
- Neutre clair `#f0ebe0`

**Mots-clés DA récurrents** (à inclure dans tous les prompts)
```
intimate, elegant, modern couple, soft lighting, no faces, abstract connection,
premium app aesthetic, dark moody, couples wellness
```

---

## 1. Icône App (1024×1024 — App Store + Google Play)

### Option A — Abstracte géométrique
```
Abstract heart-handshake symbol, two interlocking circles forming a heart shape,
deep purple and violet gradient background #1e1b2e to #4a1090,
subtle golden shimmer accent, minimalist, centered composition,
app icon design, no text, smooth edges, premium feel,
--ar 1:1 --style raw --v 6.1 --q 2
```

### Option B — Forme organique
```
Two curved lines intertwining into a heart knot, dark indigo background,
iridescent purple glow, soft bloom light effect, centered,
luxury wellness app icon, no text, ultra clean,
--ar 1:1 --style raw --v 6.1 --q 2
```

### Option C — Symbolique minimaliste
```
Single glowing heart outline on very dark purple background,
thin golden border ring, subtle radial light bloom,
app icon for couples intimacy app, no text, 8K sharp,
--ar 1:1 --style raw --v 6.1 --q 2
```

---

## 2. Screenshots App Store (6.7" iPhone — 1290×2796)

### Écran d'accueil / hero
```
Smartphone floating in dark space showing a beautiful purple card UI interface,
dark luxury aesthetic, soft rim lighting, depth of field background,
premium mobile app screenshot style, no real person, cinematic,
--ar 9:19.5 --style raw --v 6.1 --q 2
```

### Ambiance couple — sans visages
```
Two hands gently touching, dark moody background, warm golden bokeh lights,
intimate connection, no faces visible, close-up, cinematic photography,
couples wellness, clean aesthetic, no text,
--ar 9:16 --style raw --v 6.1
```

### Décor chambre luxury
```
Cozy romantic bedroom scene, candles, low key lighting, dark warm tones,
purple and rose color grading, no people, top-down or side angle,
premium lifestyle, app marketing background,
--ar 9:19.5 --style raw --v 6.1
```

---

## 3. Feature Graphic Google Play (1024×500)

```
Wide format dark luxury banner, abstract purple waves and golden particles,
two hearts orbit motif, deep space atmosphere, subtle gradient left to right
from #1e1b2e to #4a0522, no text no people, premium wellness brand,
--ar 2:1 --style raw --v 6.1 --q 2
```

---

## 4. Assets marketing social (Instagram 1080×1080)

### Teaser app
```
Elegant floating cards with purple gradient glow, dark background,
scattered playing card collector aesthetic, luxury intimacy game,
no text visible on cards, cinematic render, premium,
--ar 1:1 --style raw --v 6.1
```

### Story 9:16
```
Vertical cinematic composition, two silhouettes facing each other,
no faces, golden backlight, deep purple atmosphere, emotional connection,
premium wellness app marketing, couples intimacy, intimate mood,
--ar 9:16 --style raw --v 6.1
```

### Concept "désir + connexion" (Deck B teaser)
```
Abstract flame and rose petals, dark bordeaux and rose gold tones,
sensual but not explicit, luxury editorial, couples desire,
no nudity, elegant, premium lifestyle brand aesthetic,
--ar 1:1 --style raw --v 6.1
```

---

## 5. Références visuelles cartes (non utilisées en code)

> Ces prompts génèrent des **références DA** pour guider le design Canvas — pas d'import direct.

### Dos de carte — référence motif textile
```
Dark purple velvet card back texture, subtle diamond geometric pattern,
gold accent border, heart symbol center, premium playing card back design,
luxury game, no text, close-up flat lay, studio lighting,
--ar 2:3 --style raw --v 6.1 --q 2
```

### Face Deck A — palette froide référence
```
Premium tarot card face, cool indigo and lavender color palette,
minimalist illustration, sacred geometry background subtle,
educational intimacy wellness theme, elegant typography space,
no explicit content, premium card game art,
--ar 2:3 --style raw --v 6.1
```

### Face Deck B — palette chaude référence
```
Premium tarot card face, deep bordeaux and rose gold color palette,
subtle romantic motifs, warm candle glow effect, desire theme,
elegant and sensual but tasteful, not explicit, luxury adult game card art,
--ar 2:3 --style raw --v 6.1
```

### Effet holographique unique — référence
```
Holographic foil playing card, iridescent rainbow shimmer,
dark background, premium collector card, special edition,
rainbow light refraction, ultra detailed material render,
--ar 2:3 --style raw --v 6.1 --q 2
```

---

## 6. Onboarding / Illustrations in-app

### Illustration connexion (depth 1)
```
Abstract illustration of two overlapping circles of light,
soft purple and blue tones, emotional warmth, connection concept,
no people, minimal geometric art style, app illustration,
--ar 1:1 --style raw --v 6.1
```

### Illustration désir (depth 2–3, deck B)
```
Abstract warm light curves intertwining, rose and amber tones,
sensual energy concept, no explicit content, elegant motion blur,
premium lifestyle illustration, app onboarding art,
--ar 1:1 --style raw --v 6.1
```

---

## Notes DA

- **Toujours** ajouter `--style raw` pour éviter le style Midjourney générique
- **Éviter** les visages (politique stores + universalité du produit)
- **Tester** `--chaos 15` si les résultats sont trop sages
- **Seed utile** : noter le seed des générations approuvées pour cohérence de série
- Les versions finales stores (icône, screenshots) → format PNG → `image/stores/`
- Les références visuelles cartes → `image/cards/templates/`
