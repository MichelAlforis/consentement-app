# Système de thèmes × isAdult — 8 univers visuels

> **Décision** : Diverger l'expérience visuelle complète selon l'âge, le niveau de chaleur et le statut premium.
> **Déclencheur** : Audit DA du 2026-05-15 — un seul thème pour tous les profils est inadapté (mineur vs adulte explicite = même rendu).
> **Contexte visuel** : 8 maquettes complètes validées (home + baromètre + drawer + social + bottom nav).

---

## Contexte

L'app Consentement propose un seul système visuel indifférencié. Un ado de 14 ans et un adulte en mode BDSM voient le même rendu. Ce n'est pas viable :

- **App Store** exige un rendu mineur safe — le contenu adulte doit être gated visuellement
- **Rétention adulte** — un thème "sombre luxe" générique ne crée pas l'engagement émotionnel d'un univers signé
- **Progression** — les thèmes deviennent une récompense déblocable (heatLevel, premium)

La solution : **8 univers complets** organisés en 4 familles, débloqués selon `isAdult` + `heatLevel` + `isPremium`.

---

## Les 8 thèmes

### Famille 1 — Pré-ados / Jeunes adultes (`isAdult === false`)

| | Candy Pulse | Cosmic Consent |
|---|---|---|
| **Ambiance** | Kawaii sticker, fun coloré | Mystique spatial, émotionnel |
| **Fond** | `#fff0f8` blanc rosé | `#0d0520` violet nuit |
| **Accent** | `#ec4899` rose vif | `#818cf8` violet néon |
| **Secondary** | `#a78bfa` lavande | `#c084fc` mauve |
| **Surface** | `#ffe4f0` | `#1a0a3a` |
| **Texte** | `#3d1a2e` | `#e0d9ff` |
| **Effets** | aucun | shimmer `#818cf8` |
| **Jauge pivot** | ♥ argent | ⭐ violette |
| **Gradient jauge** | Arc-en-ciel pastel | Bleu→violet→rose néon |
| **Onglet social** | Discuss | Univers |
| **Stats header** | Communication · Désir · Confiance | Connexion · Désir · Confiance |
| **Labels confort** | Pas ok / Hmm... / Pourquoi pas / Oui 🔥 | Pas ok / Peut-être / On voit / Grave oui 🔥 |
| **Signature** | "Ton consentement, ton pouvoir." | "Respecte-toi. Respecte l'autre." |
| **Tagline** | FUN · COLORÉ · POSITIF | RÊVEUR · SPIRITUEL · ÉMOTIONNEL |

### Famille 2 — Adultes (`isAdult === true`, heatLevel ≥ 1)

| | Velvet Heat | Neo Desire |
|---|---|---|
| **Ambiance** | Sensuel luxe chaud, élégant | Cyberpunk désirable, énergique |
| **Fond** | `#100808` brun très sombre | `#080810` noir tech |
| **Accent** | `#c9722a` bronze cuivré | `#ff2d6e` rose néon |
| **Secondary** | `#8b1a1a` bordeaux sombre | `#9d00ff` violet électrique |
| **Surface** | `#1e0e0e` | `#12121e` |
| **Texte** | `#f0e8e0` | `#f0eaff` |
| **Effets** | grain | shimmer `#ff2d6e` |
| **Jauge pivot** | 🔥 cuivre | ♥ rose néon |
| **Gradient jauge** | Bronze→rouge brique (chaud) | Bleu→violet→rose néon |
| **Onglet social** | Conversations | Chat |
| **Stats header** | Intimité · Désir · Connexion | Connexion · Désir · Intensité |
| **Labels confort** | Pas envie / Curieux / Envie / Très chaud | Pas envie / Curieux / Envie / Très chaud |
| **Signature** | "Ton consentement, tes règles, ta décision." | "Tes règles. Ton corps. Ton pouvoir. ⚡" |
| **Tagline** | CHALEUREUX · ÉLÉGANT · SÉDUISANT | DARK · ÉNERGÉTIQUE · MODERNE |

### Famille 3 — Sexuellement explicites (`isAdult === true`, heatLevel ≥ 2, explicitMode ON)

| | Red Room | Raw Signal |
|---|---|---|
| **Ambiance** | Dark érotique, rouge sang | Industriel brut, sans filtre |
| **Fond** | `#0a0000` noir/rouge | `#0d0d0d` béton |
| **Accent** | `#cc0000` rouge sang | `#ff4400` orange brûlant |
| **Secondary** | `#660000` bordeaux profond | `#888888` gris industriel |
| **Surface** | `#140000` | `#1a1a1a` |
| **Texte** | `#ffcccc` | `#e0e0e0` |
| **Effets** | grain + shimmer `#cc0000` | grain |
| **Jauge pivot** | ♥ diable rouge (XXX supprimé App Store) | ⊙ cercle rouge + ⚠️ |
| **Labels arc jauge** | NON ARRÊT / CURIEUX / EXCITÉ / À FOND | NON / OK / TRÈS CHAUD + HARD LIMIT / SOFT LIMIT / CONSENTI |
| **Icônes latérales** | Sexe oral · Pénétration · BDSM · Jeux de pouvoir · Fétishes | BDSM · Exhibition · Sexting · Fétishes · Sexe anal |
| **Onglet social** | Salon | Room |
| **Stats header** | Coltation · Domination · Soumission | Pulsion · Libido · Dominance |
| **Labels confort** | Stop / Peut-être / Je veux / À fond 🔥 | Pas question / Limite / J'aime ça / À fond & |
| **Drawer** | "Red Room — Accès privé" + stamp 18+ | "Signal Room — Accès restreint 18+" + RESTRICTED |
| **Signature** | "Rien sans accord explicite." | "Sans consentement, STOP. ⚠️" |
| **Tagline** | EXPLICITE · ASSUMÉ · PROVOCANT | BRUT · HARD · SANS FILTRE |

### Famille 4 — Premium (`isPremium === true`)

| | Obsidian Gold | Ivory Ritual |
|---|---|---|
| **Ambiance** | Ultra-luxe horlogerie, noir/or | Rituel spa, ivoire minimaliste |
| **isAdult requis** | true | false OU true |
| **Fond** | `#000000` noir absolu | `#faf7f2` crème ivoire |
| **Accent** | `#c9a84c` or métallique | `#b07d6a` or rose |
| **Secondary** | `#8a6e2a` or sombre | `#8c7860` brun taupe |
| **Surface** | `#0f0e0a` | `#f0ece4` |
| **Texte** | `#f0ece4` | `#3d2a1e` |
| **Effets** | shimmer `#c9a84c` | grain |
| **Jauge pivot** | 💎 diamant or | 🌸 fleur ivoire |
| **Gradient jauge** | Engrenages horlogerie animés (rotation lente) | Beige→taupe→rose doux |
| **Icônes latérales** | — | DÉSIRS · LIMITES · COMMUNICATION · ACCORD · INTIMITÉ |
| **Onglet social** | Messages | Messages |
| **Stats header** | Harmonie · Désir · Connexion | Harmonie · Désir · Intimité |
| **Labels confort** | Pas aligné / Explorons / Envie / Parfait ✦ | Pas aligné / Pleine conscience / J'aimerais / Oui ✦ |
| **Drawer** | "L'espace sacré — Connexion douce" + lauriers | "Sanctuaire — Toi & Moi — Connexion douce" |
| **Signature** | "Exigence. Respect. Exclusivité." | "Intimité. Confiance. Connexion." |
| **Tagline** | LUXE · EXCLUSIF · PRESTIGE | DOUX · MINIMALISTE · RAFFINÉ |

---

## Matrice unlock

> Thème sélectionnable via **onboarding** (step après saisie de l'âge) et **paramètres** (modifiable à tout moment).

```
isAdult === false
  ├── Pool de base (forcé)   : Candy Pulse, Cosmic Consent
  ├── + isPremium            : + Ivory Ritual
  └── Sélecteur thème        : 2–3 options selon premium

isAdult === true
  ├── heatLevel ≥ 1 (défaut) : Velvet Heat, Neo Desire
  ├── heatLevel ≥ 2
  │   + explicitMode ON      : + Red Room, Raw Signal
  └── isPremium              : + Obsidian Gold, Ivory Ritual

Règles de lock
  - isAdult === false → ThemeContext ignore le store settings, force le pool mineur
  - explicitMode ne peut s'activer que si isAdult === true && heatLevel >= 2
  - isPremium est orthogonal à l'âge (Ivory Ritual accessible aux mineurs premium)
```

---

## Variants du Baromètre du Hot

Le composant `HeatThermometer` reçoit un prop `variant` calculé depuis le thème actif.

| Variant | Thèmes | Labels arc | Icônes latérales |
|---------|--------|------------|------------------|
| `minor` | Candy Pulse, Cosmic Consent | Emojis graduels | — |
| `adult` | Velvet Heat, Neo Desire | NOPE → HOT (5 paliers chaleur) | — |
| `explicit` | Red Room, Raw Signal | NON ARRÊT / CURIEUX / EXCITÉ / À FOND | Pratiques (BDSM, etc.) |
| `premium` | Obsidian Gold, Ivory Ritual | NOPE → HOT (élégant) | Ivory : DÉSIRS / LIMITES / COMMUNICATION / ACCORD / INTIMITÉ |

---

## Composants à créer / modifier

| Composant | Action | Détail |
|-----------|--------|--------|
| `app/types/theme.ts` | Ajouter 8 thèmes + type `ThemeId` | candy-pulse · cosmic-consent · velvet-heat · neo-desire · red-room · raw-signal · obsidian-gold · ivory-ritual |
| `app/context/ThemeContext.tsx` | Lock pool + override forcé mineur | `resolveAvailableThemes(isAdult, heatLevel, isPremium)` |
| `app/components/ui/HeatThermometer.tsx` | Prop `variant` + 4 branches de rendu | Supprimer "XXX" dans explicit → ♥ diable uniquement |
| `app/components/ui/ThemedTabBar.tsx` | Labels onglets dynamiques par thème | `tabLabels` dans chaque thème token |
| `app/components/ui/ThemeSelector.tsx` | Pool filtré + intégré onboarding + paramètres | Afficher les thèmes disponibles avec preview miniature |
| `app/components/screens/MoiScreen.tsx` | Dériver `variant` et le passer au thermomètre | `getThermometerVariant(themeId): ThermometerVariant` |
| Onboarding step thème | Nouveau step après saisie âge | Pool immédiatement filtré selon `isAdult` |

---

## Sprints

| Sprint | Titre | Dépendances | Statut |
|--------|-------|-------------|--------|
| **A** | Tokens des 8 thèmes dans `theme.ts` + type `ThemeId` | — | 🔲 |
| **B** | `resolveAvailableThemes()` dans ThemeContext — lock pool + override mineur | Sprint A | 🔲 |
| **C** | `ThemedTabBar` — labels dynamiques par thème | Sprint A | 🔲 |
| **D** | `ThemeSelector` filtré — intégré onboarding + paramètres | Sprints B–C | 🔲 |
| **E** | Variant `minor` HeatThermometer (Candy Pulse + Cosmic Consent) | Sprint B | 🔲 |
| **F** | Variant `adult` HeatThermometer (Velvet Heat + Neo Desire) | Sprint B | 🔲 |
| **G** | Variant `explicit` HeatThermometer — labels arc + icônes pratiques (sans XXX) | Sprint B | 🔲 |
| **H** | Variant `premium` HeatThermometer — Obsidian Gold (engrenages) + Ivory Ritual | Sprint B | 🔲 |
| **I** | Tests visuels cross-thèmes + haptics + App Store review | Sprints E–H | 🔲 |

---

## Décisions actées

| # | Question | Décision | Date |
|---|----------|----------|------|
| 1 | Sélection du thème — onboarding ou paramètres ? | **Les deux** — step après saisie âge + modifiable dans paramètres | 2026-05-15 |
| 2 | Red Room "XXX" sur la jauge — garder pour App Store ? | **Supprimé** — ♥ diable rouge uniquement | 2026-05-15 |
| 3 | Premium accessible aux mineurs ? | **Oui** — Ivory Ritual disponible si `isPremium && !isAdult` | 2026-05-15 |
| 4 | Validation contenu éditorial pool mineur | **Avocat fondateur** — tous défis/textes du pool mineur soumis à relecture juridique | 2026-05-15 |

---

## Questions ouvertes

- [ ] **Icônes de navigation** — style change selon le thème ? (arrondies Candy vs sharp Raw Signal vs outlined Ivory)
- [ ] **Labels arc explicit** — NON ARRÊT / CURIEUX / EXCITÉ / À FOND remplacent-ils les paliers de chaleur (1→5) ou s'y superposent-ils ?
- [ ] **Raw Signal double lecture** — deux rings concentriques sur l'arc (NON/OK/TRÈS CHAUD + HARD LIMIT/SOFT LIMIT/CONSENTI) ou un seul anneau avec les deux labels ?
- [ ] **Ivory Ritual labels latéraux** — DÉSIRS / LIMITES / COMMUNICATION / ACCORD / INTIMITÉ sont-ils cliquables / scrollables ?
- [ ] **Obsidian Gold engrenages** — animation rotation lente en idle ou déclenchée par interaction ?
- [ ] **Stats header** — les 3 métriques (Pulsion/Libido/Dominance pour Raw Signal…) sont-elles calculées algorithmiquement ou saisies par l'utilisateur ?
- [ ] **Onboarding step thème** — l'utilisateur peut-il passer cette étape (skip) ou est-elle obligatoire ?
