# Système d'icônes — DynamicIcon

> Mis à jour : 2026-04-27  
> Statut : **Migration complète** — zéro emoji dans l'UI rendue (drapeaux langue conservés, voir ci-dessous)

---

## Pourquoi Lucide et non des emojis

| Critère | Emojis | Lucide |
|---|---|---|
| Rendu cross-platform | Variable (iOS ≠ Android) | Identique partout |
| Thème / couleur CSS | Impossible | `color`, `stroke` hérités |
| Taille précise | Dépend de la police | `size` prop en px |
| Tree-shaking | N/A | Par import nommé |
| Accessibilité | Opaque pour les lecteurs d'écran | `aria-hidden` par défaut |

---

## Architecture

```
app/
  utils/
    iconFromName.tsx     ← DynamicIcon + ICON_MAP explicite
```

### `DynamicIcon`

```tsx
import { DynamicIcon } from '../../utils/iconFromName';

<DynamicIcon name="Heart" size={24} color="#f43f5e" className="shrink-0" />
```

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `name` | `string` | — | Nom Lucide exact (ex. `"Heart"`) |
| `size` | `number` | `20` | Taille px (width = height) |
| `color` | `string` | hérite CSS | Couleur stroke |
| `className` | `string` | — | Classes Tailwind |

Fallback : si `name` n'est pas dans le map → `Heart` (silencieux, pas d'erreur).

### `ICON_MAP`

Import explicite de 37 icônes — tree-shaking préservé (pas de `import *`).  
Pour ajouter une icône : l'ajouter à l'import ET à l'objet `ICON_MAP`.

```tsx
// app/utils/iconFromName.tsx
import { Heart, Flame, /* ... */ NouvelleIcone } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Flame, /* ... */ NouvelleIcone,
};
```

---

## Correspondances emoji → Lucide

### Zones de confort (comfortCategories / comfortLevels)

| Contexte | Emoji retiré | iconName |
|---|---|---|
| Catégorie Tendresse | 🌸 | `Heart` |
| Catégorie Intensité | 🔥 | `Flame` |
| Catégorie Confiance | ⛓️ | `ShieldCheck` |
| Baisers | 💋 | `Heart` |
| Câlins | 🤗 | `Smile` |
| Massages | ✨ | `Sparkles` |
| Mots doux | 💬 | `MessageCircle` |
| Se tenir la main | 🤝 | `Handshake` |
| Dormir ensemble | 😴 | `Moon` |
| Prendre son temps | 🐢 | `Clock` |
| Spontanéité | ⚡ | `Zap` |
| Lumières allumées | 💡 | `Lightbulb` |
| Parler pendant | 🗣️ | `MessageSquare` |
| Contact visuel | 👁️ | `Eye` |
| Guider l'autre | 🧭 | `Compass` |
| Yeux bandés | 🙈 | `EyeOff` |
| Immobilisation douce | 🎀 | `Link2` |
| Jeux de rôle | 🎭 | `Layers` |
| Dynamique de pouvoir | 👑 | `Crown` |
| Accessoires | 🎁 | `Gift` |
| Photos/Vidéos | 📵 | `PhoneOff` |
| Niveau 0 — Non | 🚫 | `XCircle` |
| Niveau 1 — Pas maintenant | ⏸️ | `Pause` |
| Niveau 2 — Curieux·se | 🤔 | `HelpCircle` |
| Niveau 3 — À l'aise | ✅ | `CheckCircle` |
| Niveau 4 — J'adore | 💜 | `Heart` |

### Dé (DICE_CATEGORIES / DiceFace)

| Face | Emoji retiré | iconName |
|---|---|---|
| 1 — Osez | 🎭 | `Layers` |
| 2 — Parlez | 💬 | `MessageCircle` |
| 3 — Et si… | 🤔 | `HelpCircle` |
| 4 — Défi | 🎯 | `Target` |
| 5 — Vérité | ✨ | `Sparkles` |
| 6 — Douceur | ❤️ | `Heart` |

### Jeu de l'Oie (SQUARE_VISUAL / ZONES)

| Case / Zone | Emoji retiré | iconName |
|---|---|---|
| Départ | 🚀 | `Rocket` |
| Chance | ⭐ | `Star` |
| Pause | ⏸️ | `Pause` |
| Accord | 🤝 | `Handshake` |
| Complicité | 💜 | `Heart` |
| Arrivée | 🏁 | `Flag` |
| Zone Découverte | 🌱 | `Leaf` |
| Zone Intimité | 🌊 | `Waves` |
| Zone Connexion | ✨ | `Sparkles` |

### Jeu de l'Oie — UI (overlays / phases)

| Composant | Emoji retiré | Remplacement |
|---|---|---|
| `ChanceOverlay` — icône centrale | ⭐ | `Star` fill blanc |
| `LockedCard` — cadenas | 🔒 | `Lock` Lucide |
| `PacteScreen` — 3 items | 🤝🔒⏸️ | `Handshake Lock Pause` via `DynamicIcon` |
| `AccordFlow` — avatar joueur | emoji pion | `DynamicIcon name={player.pawn}` |
| `PacteScreen` — avatar joueur | emoji pion | `DynamicIcon name={player.pawn}` |
| `EndScreen` — avatar joueur | emoji pion | `DynamicIcon name={player.pawn}` |
| `SetupPlayer` — indicateur joueur | 1️⃣ 2️⃣ | Badge circulaire numérique |
| `SetupPlayer` — sélecteur pion | 🦊🐼🦋🌙🌟🎲 | `DynamicIcon` depuis `PAWN_ICONS` |
| `index.tsx` — pion actif tour | emoji pion | `DynamicIcon name={activePawn}` |

### Duo

| Composant | Emoji retiré | Remplacement |
|---|---|---|
| `DuoRevealStep` — fin de révélation | 💜 | `Heart size={40} fill="#a855f7"` |
| `DuoBumpStep` — succès connexion | ✓ | `Check size={40} strokeWidth={3} color="white"` |

### Confetti

| Composant | Emojis retirés | Remplacement |
|---|---|---|
| `ConfettiParticles` | ❤️✨🎉💜🌟🤝 | `Heart Sparkles Star Zap Flame Handshake` avec couleurs hex |

### Écrans éducatifs

| Écran | Emoji retiré | iconName / composant |
|---|---|---|
| LoiConsentement — Âge légal | 📅 | `Calendar` |
| LoiConsentement — Risques adulte | ⚠️ | `AlertTriangle` |
| LoiConsentement — Ados | 👥 | `Users` |
| LoiConsentement — Photos/vidéos | 📱 | `Smartphone` |
| LoiConsentement — Silence ≠ oui | 🔕 | `BellOff` |
| LoiConsentement — Si tu as vécu | 🆘 | `LifeBuoy` |
| PornoVsRealite — Communication | 🎬 | `Film` |
| PornoVsRealite — Rôles | 🎭 | `Layers` |
| PornoVsRealite — Refus | 💪 | `ShieldAlert` |
| PornoVsRealite — Préparation | 🧴 | `AlertCircle` |
| PornoVsRealite — Légalité | ⚖️ | `Scale` |
| PornoVsRealite — Parole | 💬 | `MessageCircle` |
| PornoVsRealite — Conseil | 💡 | `Lightbulb` (inline) |

---

## Scope — ce qui est conservé en emoji

| Élément | Raison |
|---|---|
| `lang.flag` dans `LanguageScreen` | Drapeaux nationaux (🇫🇷🇬🇧🇪🇸) — pas d'équivalent Lucide ; rendu correct sur iOS 13+ / Android API 22+ |
| Contenu éditorial dé (`index.ts`) | `👀 😄` dans les textes de pratiques — contenu, pas icône |

### Migré (2026-04-27)

| Élément | → |
|---|---|
| `theme.emoji` (🌅🌙✨🤍🌈) dans `ThemeSelectScreen` | Grille 2×2 de pastilles `themePreviewColors` |
| `Theme.emoji: string` dans l'interface | Champ supprimé |
| `DuoBumpStep` — ✓ unicode `text-4xl` | `Check size={40} strokeWidth={3}` |

### Migré (2026-04-26)

| Élément | → |
|---|---|
| `PAWN_EMOJIS` → `PAWN_ICONS` | `['Zap','Leaf','Wind','Moon','Star','Dice5']` |
| `Player.emoji` → `Player.pawn` | stocke un nom d'icône Lucide |
| `CONFETTI_EMOJIS` → `CONFETTI_ITEMS` | objets `{ icon, color }`, rendu via `DynamicIcon` |
| `PawnSvg` — `<text>{emoji}` | `<foreignObject>` + `DynamicIcon` dans le SVG |
| Clé de sauvegarde | `consentement_jeu_oie` → `consentement_jeu_oie_v2` (invalidation localStorage) |

---

## Résidu à migrer (game-engine générique)

`BoardPlayerState.emoji` et `boardConfig.pawnEmojis` dans `app/game-engine/board/` sont encore en `string` emoji. Non bloquant (le GooseGame passe par ses propres types), à nettoyer lors du prochain travail sur le game-engine générique.

---

## Types impactés

Tous ces types ont eu `emoji: string` → `iconName: string` (ou `pawn: string`) :

| Type | Fichier | Champ |
|---|---|---|
| `ComfortItem` | `app/types/index.ts` | `iconName` |
| `ComfortCategory` | `app/types/index.ts` | `iconName` |
| `ComfortLevel` | `app/types/index.ts` | `iconName` |
| `ConsentPrinciple` | `app/types/index.ts` | supprimé (code mort) |
| `DiceFace` | `app/game-engine/dice/types.ts` | `iconName` |
| `CardConfig` | `app/game-engine/cards/types.ts` | `iconName` |
| `SquareVisual` | `app/data/goose-game.ts` | `iconName` |
| `Zone` | `app/data/goose-game.ts` | `iconName` |
| `SquareConfig` | `app/game-engine/board/types.ts` | `iconName` |
| `LegendEntry` | `app/game-engine/board/BoardRenderer.tsx` | `iconName` |
| `Player` | `app/components/screens/GooseGameScreen/types.ts` | `pawn` (nom Lucide) |
| `SavedGooseGame` | `app/data/goose-game.ts` | `pawn` |
| `Theme` | `app/types/theme.ts` | champ `emoji` supprimé |

---

## Fonction renommée

`getSquareEmoji()` → `getSquareIconName()` dans `app/data/goose-game.ts`.  
Retourne un `string` (nom Lucide) à passer à `<DynamicIcon name={…} />`.

---

## DiceCanvas (WebGL futur)

`DiceCanvas.tsx` est le renderer R3F/WebGL, activé uniquement avec `renderer='webgl'` sur `DiceRenderer`.  
La canvas 2D ne peut pas rendre des composants React — le `ctx.fillText(face.emoji)` a été retiré.  
La face affiche uniquement le label en police large centré. À remplacer par une texture SVG embarquée lors du travail R3F.
