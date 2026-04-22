# Jeu de l'Oie du Consentement

**Statut :** ✅ Livré  
**Version :** 2.0  
**Accès :** Premium uniquement — adultes  
**Date :** 2026-04-22

---

## Concept

Jeu de plateau tour par tour pour 2 joueurs sur 1 téléphone. Le dé R3F WebGL PBR (même moteur que Le Dé du Consentement) détermine combien de cases avancer. La case d'arrivée déclenche une activité — question, défi, moment de tendresse.

Le consentement est intégré dans la mécanique même : certaines cases obligent **les deux joueurs à dire oui** pour que l'activité compte. Un "non" ne pénalise personne — on passe simplement. Le refus est sans friction.

---

## Plateau — 24 cases

### Répartition

| Type | Quantité | Description |
|------|----------|-------------|
| Normale | 16 | Couleur = catégorie du dé, tirage d'une activité |
| 🔴 Pause | 2 | Moment obligatoire : "dites-vous quelque chose" |
| ⭐ Chance | 2 | +2 cases bonus |
| 🤝 Accord | 2 | Les deux doivent dire OUI pour que ça compte |
| 💜 Complicité | 1 | Activité Douceur imposée + confetti |
| 🏁 Arrivée | 1 | Fin de partie |

### Disposition (serpentin 6×4)

```
[0 🚀][1   ][2 🔴][3   ]   →
[7   ][6   ][5 ⭐][4   ]   ←
[8   ][9   ][10  ][11🔴]   →
[15  ][14  ][13💜][12  ]   ←
[16⭐][17  ][18🤝][19  ]   →
[23🏁][22  ][21  ][20  ]   ←
```

Les cases normales suivent la rotation des 6 catégories du dé (faces 1→6 répétées).

### Zones narratives

Le plateau est découpé en 3 zones qui changent l'ambiance visuelle progressivement :

| Zone | Cases | Couleur | Fond d'écran |
|------|-------|---------|--------------|
| 🌱 Découverte | 0–7 | Vert `#4ade80` | Vert profond → nuit |
| 🌊 Intimité | 8–15 | Bleu `#60a5fa` | Bleu nuit → noir |
| ✨ Connexion | 16–23 | Violet `#c084fc` | Violet nuit → noir |

Le fond de l'écran de jeu change de gradient avec une transition CSS de 2 secondes à chaque changement de zone. Un indicateur (3 points + libellé) en bas du plateau montre la zone active.

---

## Mécanique tour par tour

1. L'écran affiche **"C'est ton tour, [Prénom]"**
2. Le joueur actif lance le dé 3D (même composant que Le Dé du Consentement)
3. Le pion **se déplace case par case** avec une animation et un retour haptique à chaque case
4. La case de destination s'illumine avec une pulsation blanche
5. L'overlay de la case s'affiche selon son type
6. "Continuer" → tour du joueur suivant

### Cases spéciales — comportement détaillé

**🔴 Pause**  
Overlay obligatoire avec une activité Pause tirée sans répétition depuis le pool de 12. Pas de vote — juste un moment de connexion imposé.

**⭐ Chance**  
Overlay "+2 cases bonus". Le joueur avance encore 2 cases (avec animation), puis atterrit sur une nouvelle case (avec son activité propre).

**🤝 Accord**  
Sous-flux en 5 étapes :
1. Présentation de l'activité + "Voter en secret"
2. **Joueur 1 vote** (Oui / Non) — en privé, vibration sur le bouton
3. Écran rideau — "Passe le téléphone à [Joueur 2]"
4. **Joueur 2 vote** (Oui / Non) — sans voir le vote de J1
5. Révélation :
   - Les deux Oui → confetti + vibration festive + accord compté
   - Un Non → **message anonyme** ("Un non a été dit — c'est le consentement qui fonctionne.") — **personne ne recule, personne n'est désigné**

**💜 Complicité**  
Pioche aléatoire dans les activités **Douceur** (face 6 du dé). Activité imposée + confetti avant de passer la main.

---

## Expérience — détails WOW

### Animation du pion case par case

Quand le dé indique N, le pion se déplace une case à la fois à 210 ms d'intervalle. Une vibration tactile de 30 ms accompagne chaque case. Arrivé à destination, une pulsation lumineuse (glow blanc) signale l'atterrissage pendant 380 ms avant que l'overlay apparaisse.

Techniquement : `animatingPos` (état React) surcharge temporairement la position réelle pour l'affichage uniquement. La position réelle n'est mise à jour qu'à la fin de l'animation, dans le callback `onDone`.

### Pacte d'ouverture

Après la sélection des joueurs, une phase `'pacte'` affiche les 3 engagements du jeu avec une animation en stagger :

1. "Un non est toujours respecté — sans question, sans pression."
2. "Ce que nous partageons ici reste entre nous."
3. "Nous pouvons faire une pause ou arrêter à tout moment."

Le bouton "On commence" n'apparaît qu'après que toutes les lignes aient été animées (délai calculé : `500 + nb_lignes × 500 + 400 ms`).

### Confetti

Un burst de 18 particules emoji (❤️ ✨ 🎉 💜 🌟 🤝) explose depuis le centre de l'écran et se disperse avec des positions, rotations et scales aléatoires. Déclenché sur :
- Accord double Oui
- Case Complicité
- Fin de partie (arrivée case 23)

Chaque déclenchement génère de nouveaux aléas via une clé `confettiKey` incrémentée (dépendance du `useMemo`).

### Retours haptiques (`navigator.vibrate`)

| Événement | Pattern |
|-----------|---------|
| Lancer du dé | 100 ms |
| Chaque case franchie | 30 ms |
| Case spéciale (Pause, Chance, Accord, Complicité) | [50, 30, 50] ms |
| Vote Accord (tap bouton) | [60, 40, 60, 40, 60] ms |
| Succès (Accord double Oui, Complicité, fin) | [80, 40, 80, 40, 120] ms |

Progressive enhancement — aucun effet si le navigateur ne supporte pas `vibrate`.

---

## Setup — sélection des joueurs

Deux écrans séquentiels avant le pacte :

1. **Joueur 1** : saisie du prénom + choix du pion parmi 6 emojis (🦊🐼🦋🌙🌟🎲)
2. **Joueur 2** : idem — le pion déjà choisi par J1 n'est plus disponible

---

## Progression et fin

- **Pas de score** — le but est d'arriver ensemble
- **Compteur d'accords** visible en bas de l'écran de jeu
- La partie se termine quand un pion atteint la case 23 (🏁 Arrivée)
- L'écran de fin affiche : pions des deux joueurs, nombre d'accords conclus, message de félicitations

---

## Contenu

### Activités des cases normales

Deux pools combinés par `getBoardActivitiesForFace(face, isAdult)` :

1. **`diePractices`** depuis `app/data/index.ts` — 36 activités partagées avec Le Dé du Consentement
2. **`EXTRA_BOARD_ACTIVITIES`** depuis `app/data/goose-game.ts` — 24 activités **exclusives au plateau**, inédites dans le dé :
   - 4 par face × 6 faces (dont 1 adulte par face pour les faces 1, 3, 5, 6)

Comme c'est Premium, `isAdult = true` est passé → toutes les activités adultes sont accessibles.

La pioche respecte un **anti-répétition** par `useRef<Set<string>>` : une activité ne peut pas être retirée deux fois avant que le pool entier ait été épuisé.

### Activités Pause (12)

Moments de connexion sans enjeu, anti-répétition activée :
- "Dites-vous quelque chose que vous n'avez pas encore dit ce soir."
- "Regardez-vous dans les yeux pendant 10 secondes, en silence."
- "Dites une chose que vous appréciez chez l'autre — maintenant."
- "Prenez-vous la main. Restez comme ça jusqu'au prochain lancer."
- *(+ 8 autres dans `PAUSE_ACTIVITIES`)*

### Activités Accord (12)

Actions concrètes nécessitant le double accord, anti-répétition activée :
- "Échangez un massage de 1 minute chacun·e."
- "Faites-vous un câlin de 30 secondes — sans lâcher avant le signal."
- "Fermez les yeux et tenez-vous la main pendant 20 secondes."
- "Dansez ensemble 30 secondes — même sans musique, même maladroitement."
- *(+ 8 autres dans `ACCORD_ACTIVITIES`)*

---

## Technique

### Fichiers

| Fichier | Rôle |
|---------|------|
| `app/data/goose-game.ts` | Plateau, zones, activités Pause/Accord/exclusives, helpers localStorage |
| `app/components/screens/GooseGameScreen/index.tsx` | Orchestrateur — guard premium + state machine + hooks |
| `app/data/index.ts` | `DICE_CATEGORIES` + `diePractices` — réutilisés sans modification |
| `app/game-engine/dice/DiceRenderer.tsx` | Dé R3F WebGL PBR — `renderer="webgl" size={200}` (même moteur que DiceGameScreen) |

### Architecture du composant

```
GooseGameScreen          ← guard isPremium (écran 🔒 si false)
  └── GooseGameInner     ← tous les hooks + state machine

Composants internes :
  ConfettiParticles      ← 18 particules Framer Motion (clé confettiKey)
  BoardCell              ← case individuelle avec layoutId pion
  BoardGrid              ← grille 6×4 serpentin
  Overlay                ← slide-up spring pour toutes les activités
  Legend                 ← légende des cases spéciales
  PacteScreen            ← phase pacte avec lignes en stagger
  SetupPlayer            ← saisie prénom + choix pion (réutilisé J1/J2)
```

### Machine à états — phases

```
'intro' → 'setup-p1' → 'setup-p2' → 'pacte' → 'playing' → 'end'
```

### Machine à états — étapes de tour (`TurnStep`)

```
'roll'
  ↓ (tap Lancer)
'rolling'
  ↓ (onRollComplete — 1.7 s)
  ├── 'normal'          → Continuer → next player → 'roll'
  ├── 'pause'           → Continuer → next player → 'roll'
  ├── 'complicite'      → confetti → Continuer → next player → 'roll'
  ├── 'chance'          → Avancer +2 → animatePawn → reprocessSquare
  └── 'accord-intro'
        ↓ Voter en secret
       'accord-p1'      → vote J1 (haptique)
        ↓
       'accord-hidden'  → passe le téléphone
        ↓
       'accord-p2'      → vote J2 (haptique)
        ↓
       'accord-result'  → [confetti si double Oui] → Continuer → next player → 'roll'
```

### Anti-répétition des activités

Trois `useRef<Set<string>>` distincts, jamais ré-initialisés entre les tours :

```typescript
const usedActivityIds = useRef<Set<string>>(new Set()); // cases normales
const usedPauseIds    = useRef<Set<string>>(new Set()); // cases Pause
const usedAccordIds   = useRef<Set<string>>(new Set()); // cases Accord
```

`pickNoRepeat(pool, usedIds)` filtre d'abord les ids déjà utilisés, tire dans le reste, et remet le Set à zéro si le pool entier est épuisé (cycle infini sans répétition consécutive).

### Persistance localStorage

**Clé :** `consentement_jeu_oie`

```typescript
interface SavedGooseGame {
  players: [{ name: string; emoji: string }, { name: string; emoji: string }];
  positions: [number, number];   // [pos_j1, pos_j2] — index 0-23
  currentPlayer: 0 | 1;
  accordsCount: number;
}
```

Sauvegarde à chaque déplacement de pion. L'écran intro propose "Reprendre la partie" si une sauvegarde existe. La sauvegarde est effacée à la fin de partie ou au démarrage d'une nouvelle.

### Pattern anti-stale closure

`handleRollComplete` s'exécute 1.7 s après le lancement. `animatePawn` peut durer jusqu'à `N × 210 + 380 ms` de plus. Les closures React sont potentiellement périmées à ces instants.

Solution :

```typescript
// gameRef — mis à jour après chaque render (sans deps[])
const gameRef = useRef({ pos0, pos1, curPlayer, accordsCount, p1, p2 });
useEffect(() => { gameRef.current = { pos0, pos1, curPlayer, accordsCount, p1, p2 }; });

// diceRef — écrit de façon synchrone dans handleRoll, lu dans handleRollComplete
const diceRef = useRef(diceResult);

// animTimerRef — permet d'annuler les setTimeout en vol si le composant est démonté
const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

---

## Décisions de conception

**Pourquoi les cases Accord ne font pas reculer ?**  
Pénaliser le "non" crée une pression pour dire oui. L'absence de pénalité est la mécanique même du consentement libre.

**Pourquoi le résultat Accord ne désigne-t-il pas qui a dit non ?**  
Révéler qui a voté Non recrée une pression sociale — la personne se sentirait obligée de se justifier. Le message générique ("Un non a été dit — c'est le consentement qui fonctionne.") traite le refus comme un résultat normal et collectif, pas comme une trahison individuelle.

**Pourquoi réutiliser le dé du Consentement ?**  
Cohérence visuelle — les joueurs reconnaissent les couleurs et catégories. Le plateau est une extension narrative du dé, pas un jeu séparé.

**Pourquoi des activités exclusives au plateau (`EXTRA_BOARD_ACTIVITIES`) ?**  
Les utilisateurs premium ont déjà accès au Dé. Pour que le Jeu de l'Oie ait une valeur propre, il doit proposer du contenu inédit — plus profond, plus contextualisé pour une soirée à deux.

**Pourquoi le Pacte d'ouverture ?**  
Poser le cadre avant de jouer change la nature de l'expérience. Le pacte n'est pas un disclaimer légal — c'est un rituel qui crée un espace sécurisé. Les lignes apparaissent une par une pour que chaque engagement soit lu, pas survolé.

**Pourquoi les zones narratives changent-elles le fond ?**  
L'ambiance visuelle accompagne l'intensité croissante du jeu. La zone Découverte est douce (vert), l'Intimité est plus profonde (bleu nuit), la Connexion est intérieure (violet). Le changement progressif est perçu inconsciemment — les joueurs sentent que la partie a évolué sans qu'on le leur annonce.

**Pourquoi Premium ?**  
Le jeu suppose que les deux joueurs sont en contexte intime et adulte. Les activités Accord et Complicité sont conçues pour des couples — pas adapté à un public mineur.

---

## Évolutions prévues

- [ ] Plateau avancé — 36 cases avec zones et cases adultes supplémentaires
- [ ] Historique de la partie affiché sur l'écran de fin
- [ ] Lien "Rejouer avec le Dé" depuis l'écran de fin
- [ ] Mode "soirée" à tour de rôle (3+ joueurs)
