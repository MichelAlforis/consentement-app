# Assets graphiques — Consentement App

> Sources graphiques de l'app. Formats de travail (Figma exports, PSD, AI).
> Les fichiers prêts pour le code vont dans `public/` (web) ou `ios/` `android/` (natif).

---

## Structure

```
image/
├── brand/                    Identité visuelle
│   ├── logo/                 Logo principal, variantes (blanc, sombre, monochrome)
│   ├── colors/               Palette officielle (swatches, tokens)
│   └── typography/           Polices, hiérarchie typographique
│
├── cards/                    Card Collector — assets visuels
│   ├── backs/                Dos de carte (commun aux 2 decks)
│   ├── templates/            Gabarits face Deck A et Deck B (PSD/Figma)
│   ├── deck-a/               Deck non-explicite
│   │   ├── common/           Cartes communes
│   │   ├── rare/             Cartes rares (effet shimmer)
│   │   └── unique/           Cartes uniques (effet foil/holographique)
│   └── deck-b/               Deck explicite — app adulte
│       ├── common/
│       ├── rare/
│       └── unique/
│
├── stores/                   Assets stores (soumission App Store + Google Play)
│   ├── app-store/
│   │   ├── icon/             1024×1024 PNG (sans arrondi — Apple arrondit)
│   │   ├── screenshots/      6.7" iPhone + 12.9" iPad
│   │   └── preview/          Vidéo preview 30s (optionnel)
│   └── google-play/
│       ├── icon/             512×512 PNG
│       ├── screenshots/      Phone + Tablet
│       └── feature-graphic/  1024×500 PNG
│
├── marketing/                Communication externe
│   ├── social/               Posts Instagram, stories, réseaux
│   └── press-kit/            Logo HD, screenshots presse, biographie app
│
└── in-app/                   Illustrations et badges utilisés dans l'app
    ├── onboarding/           Illustrations écrans d'intro
    ├── badges/               Badges rareté, achievements
    └── illustrations/        Visuels divers (modules éducatifs, etc.)
```

---

## Priorités graphiques

### 1. Cards (urgent — bloque le Hall of Cards)
- [ ] Dos de carte — design identitaire (commun Deck A + B)
- [ ] Gabarit face Deck A — palette froide/neutre
- [ ] Gabarit face Deck B — palette chaude/profonde
- [ ] Effet rareté `rare` — bordure animée / shimmer
- [ ] Effet rareté `unique` — holographique / foil

### 2. Stores (nécessaire avant soumission)
- [ ] Icône app 1024×1024 (App Store)
- [ ] Icône app 512×512 (Google Play)
- [ ] Screenshots iPhone 6.7"
- [ ] Feature graphic Google Play 1024×500

### 3. Brand
- [ ] Logo final vectoriel
- [ ] Palette couleurs officielle

---

## Formats recommandés

| Usage | Format |
|---|---|
| Cartes (textures R3F) | PNG 512×768, fond transparent |
| Icônes app | PNG 1024×1024 |
| Screenshots stores | PNG natif device |
| Social | PNG/JPG 1080×1080 ou 1080×1920 |
| Travail | Figma / SVG / PSD |
