# Jeu de l'Oie du Consentement

**Statut :** ✅ Livré  
**Version :** 1.0  
**Accès :** Premium uniquement — adultes  
**Date :** 2026-04-22

---

## Concept

Jeu de plateau tour par tour pour 2 joueurs sur 1 téléphone. Le dé 3D existant détermine combien de cases avancer. La case d'arrivée déclenche une activité — question, défi, moment de tendresse.

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
| 💜 Complicité | 1 | Activité Douceur imposée |
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

---

## Mécanique tour par tour

1. L'écran affiche **"C'est ton tour, [Prénom]"**
2. Le joueur actif lance le dé 3D (même composant que Le Dé du Consentement)
3. Le pion avance — la case de destination s'illumine
4. L'overlay de la case s'affiche selon son type
5. "Continuer" → tour du joueur suivant

### Cases spéciales — comportement détaillé

**🔴 Pause**
Overlay obligatoire avec une des 8 activités Pause. Pas de vote — juste un moment de connexion imposé.

**⭐ Chance**
Overlay "+2 cases bonus". Le joueur avance encore 2 cases et atterrit sur une nouvelle case (avec son activité propre).

**🤝 Accord**
Sous-flux en 5 étapes :
1. Présentation de l'activité + "Voter en secret"
2. **Joueur 1 vote** (Oui / Non) — en privé
3. Écran rideau — "Passe le téléphone à [Joueur 2]"
4. **Joueur 2 vote** (Oui / Non) — sans voir le vote de J1
5. Révélation : si les deux Oui → accord compté ; si un Non → "pas de souci, on passe" — **personne ne recule**

**💜 Complicité**
Pioche aléatoire dans les activités **Douceur** (face 6 du dé). Activité imposée avant de passer la main.

---

## Setup — sélection des joueurs

Deux écrans séquentiels avant la partie :

1. **Joueur 1** : saisie du prénom + choix du pion parmi 6 emojis (🦊🐼🦋🌙🌟🎲)
2. **Joueur 2** : idem — le pion déjà choisi par J1 n'est plus disponible

---

## Progression et fin

- **Pas de score** — le but est d'arriver ensemble
- **Compteur d'accords** visible en bas de l'écran de jeu, récapitulé sur l'écran de fin
- La partie se termine quand un pion atteint la case 23 (🏁 Arrivée)

---

## Contenu

### Activités des cases normales

Réutilise directement `diePractices` depuis `app/data/index.ts` :
- 36 activités × filtrage `ageGate`
- Comme c'est Premium, `isPremium = true` est passé hardcodé → toutes les activités adultes sont accessibles

### Activités Pause (8)

Moments de connexion sans enjeu :
- "Dites-vous quelque chose que vous n'avez pas encore dit ce soir."
- "Regardez-vous dans les yeux pendant 10 secondes, en silence."
- "Chacun·e dit comment il·elle se sent en ce moment. En un mot."
- *(+ 5 autres dans `PAUSE_ACTIVITIES`)*

### Activités Accord (8)

Actions concrètes nécessitant le double accord :
- "Échangez un massage de 1 minute chacun·e."
- "Faites-vous un câlin de 30 secondes."
- "Fermez les yeux et tenez-vous la main pendant 20 secondes."
- *(+ 5 autres dans `ACCORD_ACTIVITIES`)*

---

## Technique

### Fichiers

| Fichier | Rôle |
|---------|------|
| `app/data/goose-game.ts` | Définition du plateau, activités Pause/Accord, helpers localStorage |
| `app/components/screens/GooseGameScreen.tsx` | Composant complet — guard premium + wrapper + jeu |
| `app/data/index.ts` | `DICE_CATEGORIES` + `diePractices` — réutilisés sans modification |
| `app/components/ui/Dice3D.tsx` | Dé 3D partagé avec Le Dé du Consentement |

### Architecture du composant

```
GooseGameScreen          ← guard isPremium (écran 🔒 si false)
  └── GooseGameInner     ← tous les hooks + state machine
        ├── BoardGrid    ← grille 6×4 serpentin
        │     └── BoardCell × 24
        ├── SetupPlayer  ← nom + emoji (réutilisé pour J1 et J2)
        ├── Legend       ← légende des cases spéciales
        └── Overlay      ← slide-up pour toutes les activités
```

### Machine à états — phases

```
'intro'     → 'setup-p1' → 'setup-p2' → 'playing' → 'end'
```

### Machine à états — étapes de tour (`TurnStep`)

```
'roll'
  ↓ (tap Lancer)
'rolling'
  ↓ (onRollComplete — 1.7s)
  ├── 'normal'          → Continuer → next player → 'roll'
  ├── 'pause'           → Continuer → next player → 'roll'
  ├── 'complicite'      → Continuer → next player → 'roll'
  ├── 'chance'          → Avancer +2 → reprocessSquare → (normal|pause|...)
  └── 'accord-intro'
        ↓ Voter en secret
       'accord-p1'      → vote J1
        ↓
       'accord-hidden'  → passe le téléphone
        ↓
       'accord-p2'      → vote J2
        ↓
       'accord-result'  → Continuer → next player → 'roll'
```

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

`handleRollComplete` s'exécute 1.7s après le lancement — les valeurs d'état peuvent être périmées dans une closure React. Solution :

```typescript
const gameRef = useRef({ pos0, pos1, curPlayer, accordsCount, p1, p2 });
useEffect(() => { gameRef.current = { pos0, pos1, curPlayer, accordsCount, p1, p2 }; });
// ↑ pas de deps[] → se met à jour après chaque render

const diceRef = useRef(diceResult);
// écrit de façon synchrone dans handleRoll, lu dans handleRollComplete
```

---

## Décisions de conception

**Pourquoi les cases Accord ne font pas reculer ?**  
Pénaliser le "non" crée une pression pour dire oui. L'absence de pénalité est la mécanique même du consentement libre.

**Pourquoi réutiliser le dé du Consentement ?**  
Cohérence visuelle — les joueurs reconnaissent les couleurs/catégories. Le plateau est une extension narrative du dé, pas un jeu séparé.

**Pourquoi le vote Accord est-il anonyme ?**  
Même logique que le mode Duo du Dé : si l'on sait qui a dit non, la pression sociale revient. L'anonymat protège la liberté de refus.

**Pourquoi Premium ?**  
Le jeu suppose que les deux joueurs sont en contexte intime et adulte. Les activités Accord et Complicité sont conçues pour des couples — pas adapté à un public mineur.

---

## Évolutions prévues

- [ ] Plateau avancé Premium — 36 cases avec cases adultes débloquées
- [ ] Animation de déplacement du pion (trajet case par case)
- [ ] Historique de la partie affiché sur l'écran de fin
- [ ] Lien "Rejouer avec le Dé" depuis l'écran de fin
