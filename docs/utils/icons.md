# Système d'icônes — DynamicIcon

> Mis à jour : 2026-04-23  
> Statut : **Level 2 terminé** — migration Emoji → Lucide complète (hors scope R3F)

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
| `PAWN_EMOJIS` (🦊🐼🦋🌙🌟🎲) | Choix de pion joueur — sera remplacé par des avatars R3F |
| `CONFETTI_EMOJIS` (❤️✨🎉💜🌟🤝) | Particules de confetti — scope cinématique R3F future |
| `theme.emoji` dans `theme.ts` | Identifiant décoratif du système de thèmes (🌅🌙✨🤍🌈) |
| `player.emoji` dans GooseGame | Pion actif — lié à `PAWN_EMOJIS` |

---

## Types impactés

Tous ces types ont eu `emoji: string` → `iconName: string` :

| Type | Fichier |
|---|---|
| `ComfortItem` | `app/types/index.ts` |
| `ComfortCategory` | `app/types/index.ts` |
| `ComfortLevel` | `app/types/index.ts` |
| `ConsentPrinciple` | `app/types/index.ts` — champ supprimé (code mort) |
| `DiceFace` | `app/game-engine/dice/types.ts` |
| `CardConfig` | `app/game-engine/cards/types.ts` |
| `SquareVisual` | `app/data/goose-game.ts` |
| `Zone` | `app/data/goose-game.ts` |
| `SquareConfig` | `app/game-engine/board/types.ts` |
| `LegendEntry` | `app/game-engine/board/BoardRenderer.tsx` |

---

## Fonction renommée

`getSquareEmoji()` → `getSquareIconName()` dans `app/data/goose-game.ts`.  
Retourne un `string` (nom Lucide) à passer à `<DynamicIcon name={…} />`.

---

## DiceCanvas (WebGL futur)

`DiceCanvas.tsx` est le renderer R3F/WebGL, activé uniquement avec `renderer='webgl'` sur `DiceRenderer`.  
La canvas 2D ne peut pas rendre des composants React — le `ctx.fillText(face.emoji)` a été retiré.  
La face affiche uniquement le label en police large centré. À remplacer par une texture SVG embarquée lors du travail R3F.
