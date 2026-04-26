# Cartes à tirer

**Statut :** ✅ Livré  
**Version :** 2.0  
**Accès :** Premium — adultes et tous âges (contenu adulte filtré par âge)  
**Date :** 2026-04-22

---

## Concept

Jeu de tirage de cartes solo ou à deux. Le joueur choisit un paquet (ou laisse le hasard décider), puis tire une carte qui s'anime en flip 3D. La carte reste affichée jusqu'à ce que le joueur décide de passer à la suivante — pas de timer, pas de pression.

Contrairement au dé, il n'y a pas de vote : le jeu déclenche une **conversation**, pas une action. La carte est un prétexte au dialogue. L'autre réagit librement, à son rythme.

Le premium se justifie par le volume de contenu (84 cartes), la profondeur des questions, les cartes adultes, et les fonctionnalités de séance (anti-répétition, progression émotionnelle, favoris, écran de fin).

---

## Mécanique

### Mode Solo
1. Choisir "Solo" + un paquet (ou aléatoire)
2. Appuyer sur "Tirer une carte" / "Commencer · N cartes"
3. La carte apparaît face cachée (dos coloré) → flip 3D automatique → texte révélé
4. Lire, réfléchir, noter — à son propre rythme
5. "Nouvelle carte" → flip retour + nouvelle carte → flip révélation

### Mode À deux
1. Choisir "À deux" + un paquet
2. Tirer la carte — elle s'affiche pour les deux en même temps
3. Lire ensemble
4. L'autre réagit librement, sans règle, sans timer
5. La conversation peut durer 2 minutes ou 20 — c'est voulu

**Différence fondamentale avec le dé :** pas de vote séquentiel, pas d'écran rideau. Les deux voient la carte en même temps et réagissent ensemble. Le consentement ici est dans l'ouverture de la conversation, pas dans la décision d'action.

---

## Modes de session

### Mode Séance (✦ Séance)
- Taille choisie : **5 cartes** ou **10 cartes**
- **Anti-répétition complet** : aucune carte ne revient dans la même session
- **Progression émotionnelle** en mode aléatoire (voir ci-dessous)
- **Barre de progression** : points animés indiquant la position dans la séance
- Sur la dernière carte, le bouton "Nouvelle carte" se transforme en **"Terminer la séance"** (vert)
- Mène à un **écran de fin** avec récap des paquets explorés et message d'insight

### Mode Libre (∞ Libre)
- Tirage infini sans limite de cartes
- Anti-répétition sur les 10 dernières cartes (pool de `drawnIds`, reset au redémarrage)
- Pas d'écran de fin — le joueur s'arrête quand il le souhaite
- Disponible directement, ou via "Continuer en mode libre" depuis l'écran de fin

---

## Progression émotionnelle

En mode **Séance aléatoire**, les cartes sont sélectionnées selon une progression en trois temps :

| Phase | Position dans la séance | Paquets favorisés |
|-------|------------------------|-------------------|
| Entrée en matière | 0 → 35 % | Profondeur 1–2 (Osez, Défi, Parlez, Et si…) |
| Milieu | 35 → 65 % | Tous les paquets |
| Profondeur | 65 → 100 % | Profondeur 2–3 (Parlez, Et si…, Vérité, Douceur) |

```ts
const DECK_DEPTH: Record<number, 1 | 2 | 3> = { 1: 1, 4: 1, 2: 2, 3: 2, 5: 3, 6: 3 };
```

La progression ne s'applique qu'en mode aléatoire (si un paquet spécifique est choisi, toutes les profondeurs sont disponibles dès le départ).

---

## Favoris

Le bouton ❤️ apparaît sous chaque carte révélée. Il permet de marquer la carte comme favorite.

- Persisté en **localStorage** sous la clé `consentement_card_favorites` (tableau d'IDs)
- Le compteur de favoris s'affiche dans le header de l'écran de sélection
- L'écran de fin affiche le nombre de favoris accumulés sur la session

---

## Écran de fin (mode Séance)

Affiché après la dernière carte de la séance. Fond cinématique via `GameEndCinematic` (orbes + particules R3F, voir `docs/jeux/EndScreen.md`).

### Layout complet (ordre d'affichage)

1. `Sparkles` icon animé (spring bounce)
2. **"Belle séance !"** + stats (N cartes · N paquets explorés · N favoris)
3. **Badges paquets explorés** : catégories rencontrées avec gradient couleur
4. **CardUnlockReveal** — si des cartes collector ont été gagnées (voir ci-dessous)
5. **Message d'insight contextuel** :
   - Si Vérité ou Douceur explorés → "Vous avez osé aller dans les sujets profonds."
   - Si Parlez ou Et si… → "Bonne séance. Les paquets Vérité et Douceur vous attendent…"
   - Sinon → "Belle entrée en matière — essayez le mode aléatoire pour explorer toutes les nuances."
6. **[Nouvelle séance]** → reset complet, retour sélection *(primary CTA)*
7. **[Continuer en mode libre]** → mode libre avec deck actuel *(secondary)*
8. **[Voir ma collection →]** → navigue vers `hall-of-cards` *(tertiary, visible si gainedCards > 0)*

### CardUnlockReveal — révélation de cartes collector

Composant dans `CardGame/index.tsx` qui anime les cartes collector gagnées en fin de séance.

**Timeline d'animation :**
```
t = 300ms         → carte 0 apparaît (scale 0.72 → 1, opacity 0 → 1)
t = 300 + 800ms   → carte 0 s'auto-retourne (dos → face)
t = 1400ms        → hint apparaît (juste après le 1er flip — pas en dernier)
t = 850ms         → carte 1 apparaît (stagger +550ms par carte)
t = 850 + 800ms   → carte 1 s'auto-retourne
```

Tap sur une carte → `vibrate('light')` + toggle flip (retourner dans les deux sens). `whileTap={{ scale: 0.94 }}` donne un retour visuel immédiat.

**Hint contextuel :**
- 2 cartes ou moins : *"Touche une carte pour la retourner"*
- 3+ cartes : *"Glisse pour voir toutes les cartes · Touche pour retourner"*
- Opacity `0.50` (vs 0.25 avant — plus lisible)

**Taille dynamique des cartes :**

| Cartes gagnées | `size` | Hauteur | Layout |
|---|---|---|---|
| 1 | 160 px | 240 px | centré |
| 2 | 150 px | 225 px | centré, gap-4 |
| 3+ | 140 px | 210 px | scroll horizontal snap |

**Règle mobile — taille minimale 140 px :** en dessous, le texte canvas descend sous 13 px — illisible sur smartphone. Pour 3+ cartes, le layout passe en scroll horizontal (`overflow-x-auto snap-x snap-mandatory`) avec 2 cartes visibles et le bord du 3e pour signaler le scroll. `scrollbarWidth: none` masque la scrollbar native iOS/Android.

**i18n — namespace `flipReveal` (fr/en/es) :**

| Clé | FR | EN | ES |
|---|---|---|---|
| `cardUnlockedLabel` | Carte débloquée | Card unlocked | Carta desbloqueada |
| `cardsUnlockedLabel` | `{count}` cartes débloquées | `{count}` cards unlocked | `{count}` cartas desbloqueadas |
| `hintTap` | Touche une carte pour la retourner | Tap a card to flip it | Toca una carta para voltearla |
| `hintScroll` | Glisse pour voir toutes les cartes · Touche pour retourner | Swipe to see all cards · Tap to flip | Desliza para ver todas las cartas · Toca para voltear |

**Quand des cartes sont gagnées :**
`computeGainedCards()` est appelé dans `handleGoToEnd()` avec `sessionMode`, `cardCount`, `seanceSize`, `sessionThemes`, `sessionCount` (après incrément), `ownedIds`, `favorites`, `isPremium`. La logique de gain est dans `app/lib/computeGainedCards.ts` (voir `docs/jeux/card-gain-session.md`).

---

## Les 6 paquets

Les paquets partagent exactement le même système de catégories que le dé (`DICE_CATEGORIES`) : même nom, même emoji, même gradient couleur.

| Paquet | Emoji | Couleur | Ton | Profondeur |
|--------|-------|---------|-----|------------|
| Osez | 🎭 | Amber `#f59e0b → #d97706` | Actions légères à faire sur le moment | 1 |
| Parlez | 💬 | Violet `#8b5cf6 → #7c3aed` | Questions sur soi, l'autre, la relation | 2 |
| Et si… | 🤔 | Rose `#ec4899 → #db2777` | Scénarios imaginaires à débattre | 2 |
| Défi | 🎯 | Bleu `#3b82f6 → #2563eb` | Mini-challenges créatifs ou rigolos | 1 |
| Vérité | ✨ | Vert `#10b981 → #059669` | Questions honnêtes sur les limites et besoins | 3 |
| Douceur | ❤️ | Bordeaux `#be123c → #9f1239` | Moments de tendresse guidés | 3 |

Un 7ème choix **"Aléatoire"** mélange toutes les cartes disponibles — identifié par un dégradé arc-en-ciel et l'icône Shuffle.

---

## Contenu

**84 cartes au total** — 14 par paquet × 6 paquets

| Audience | Cartes par paquet | Total |
|----------|------------------|-------|
| Tous âges (`ageGate: 'all'`) | 10 | 60 |
| Adultes (`ageGate: 'adult'`) | 4 | 24 |

Les cartes adultes sont signalées discrètement sur la face révélée par un badge `✦` en bas-droite.

### Exemples par paquet

**🎭 Osez** (tous âges)
- "Regardez-vous dans les yeux en silence pendant 30 secondes. Premier qui rigole a perdu."
- "Inventez un geste secret que vous serez les seuls à connaître. Utilisez-le avant la fin de la soirée."

**🎭 Osez** (adultes)
- "Décrivez à voix haute ce que vous aimeriez faire ensemble ce soir — sans filtre, sans honte."
- "Chuchotez à l'autre quelque chose que vous n'avez jamais osé dire à voix normale."

**💬 Parlez** (tous âges)
- "Quelle est la chose que l'autre fait inconsciemment qui vous rend toujours heureux·se ?"
- "Qu'est-ce que vous n'osez pas demander à l'autre depuis longtemps ?"

**🤔 Et si…** (tous âges)
- "Et si vous deviez décrire votre relation avec une météo — il fait quel temps ?"
- "Et si on vous interviewait dans 20 ans sur votre relation — qu'est-ce qu'on dirait ?"

**🎯 Défi** (tous âges)
- "Dessinez le portrait de l'autre en moins de 60 secondes — montrez le résultat sans rougir."
- "Inventez une danse à deux, maintenant. Nommez-la. Répétez-la 2 fois."

**✨ Vérité** (tous âges)
- "Qu'est-ce qui vous fait dire 'non' immédiatement, sans hésiter ?"
- "Vous sentez-vous libre de dire 'non' à l'autre ? Qu'est-ce qui vous en empêche parfois ?"

**✨ Vérité** (adultes)
- "Qu'est-ce que vous aimeriez essayer — quelque chose que vous n'avez jamais osé demander ?"
- "Quelle est votre limite absolue — quelque chose que vous ne feriez jamais, même si on vous le demandait ?"

**❤️ Douceur** (tous âges)
- "Prenez-vous dans les bras pendant 60 secondes. En silence. Chronométrez."
- "Restez en silence avec l'autre pendant 2 minutes complètes. Juste être là, ensemble."

**❤️ Douceur** (adultes)
- "Montrez à l'autre comment vous aimez être touché·e — guidez doucement sa main."
- "Dites à l'autre ce qui vous rend le plus à l'aise dans l'intimité, et ce dont vous avez besoin pour vous sentir bien."

---

## Technique

### Composants

| Fichier | Rôle |
|---------|------|
| `app/components/screens/CardGameScreen.tsx` | Écran de jeu complet — 3 étapes, flip 3D, séance, favoris |
| `app/data/index.ts` | `CardData` interface + `cardData` (84 entrées) |
| `app/types/index.ts` | `'jeu-cartes'` ajouté au type `Screen` |

### États du jeu (`CardStep`)

```
pick → playing
         ↓
    drawNewCard (boucle interne — pas de changement d'étape)
         ↓
    end (séance uniquement) → pick (reset)
         ↓
    reset → pick
```

Pas d'états intermédiaires complexes : le jeu n'a que trois écrans. Le flip est géré par un booléen `isRevealed` + des `setTimeout` synchronisés.

### Animation flip 3D — points clés

La carte est un conteneur `preserve-3d` avec deux faces absolues (`inset-0`) :

```
parent: transformStyle: 'preserve-3d', rotateY animé (0 → 180)
  ├── dos (backfaceVisibility: hidden)   ← visible quand rotateY = 0
  └── face (backfaceVisibility: hidden, transform: rotateY(180deg)) ← visible quand rotateY = 180
```

**Règle critique (même que le dé) :** aucun `filter` CSS sur un enfant du conteneur `preserve-3d`. Un `filter: drop-shadow` sur l'emoji créait un stacking context qui désactivait `backfaceVisibility: hidden` → les deux faces devenaient visibles simultanément (texte blanc sur fond blanc). Utiliser `textShadow` à la place si une ombre est nécessaire.

#### Séquence "Nouvelle carte"

```
isAnimating = true
isRevealed = false          → rotateY revient à 0 (flip dos, 480ms)
  setTimeout 480ms:
    currentCard = newCard   → contenu swappé pendant que le dos est visible
    isRevealed = true       → rotateY repart à 180 (flip face, 550ms)
    setTimeout 550ms:
      isAnimating = false
```

Le contenu est toujours swappé **pendant** que le dos est visible, jamais pendant la transition — l'utilisateur ne voit jamais le changement de texte.

Le swap utilise un pattern de mise à jour fonctionnelle pour éviter les closures périmées :

```ts
setDrawnIds(prev => {
  const newCard = pickCard(cardCount, prev, sessionMode);
  setCurrentCard(newCard);
  setDrawnIds([...prev, newCard.id]);
  // ...
  return prev;
});
```

#### Séquence "Première carte"

```
startPlaying()
  currentCard = pickCard()
  isRevealed = false         → carte affichée dos
  step = 'playing'
  setTimeout 350ms:
    isRevealed = true        → flip automatique vers la face
```

Le délai de 350ms laisse l'animation d'entrée de l'écran (`playing`) se terminer avant que le flip démarre.

### Design de la carte

**Dos (paquet fermé) :**
- Gradient catégorie plein fond
- Pattern de points CSS : `radial-gradient(circle, rgba(255,255,255,0.22) 2px, transparent 2px)` / `20px 20px`
- Pips en coins : emoji catégorie en `text-white/35`, le coin bas-droit est `rotate(180deg)` (convention cartes de jeu)
- Contenu centré : **nom** (text-2xl, font-black) → **emoji** (text-7xl) → **"Cartes à tirer"** (text-white/45)
- Ombres via `boxShadow` uniquement (jamais `filter`)

**Face (carte révélée) :**
- Fond blanc `#ffffff`, bordure `1.5px solid #f0f0f0`
- Bande de couleur catégorie en haut (2.5px) et en bas (1.5px)
- Badge catégorie : carré arrondi avec gradient + emoji (11×11, rounded-2xl)
- Texte de la carte : `text-gray-800`, `font-semibold`, `text-[15px]`, centré
- Badge adulte `✦` discret en bas-droite si `ageGate === 'adult'`

### Filtrage du contenu

```ts
const available = useMemo(() => cardData.filter(c => {
  if (c.ageGate === 'all') return true;
  if (c.ageGate === 'adult') return isAdult;
  return false;
}), [isAdult]);
```

Le paquet "Aléatoire" tire dans tout `available`. Un paquet spécifique filtre en plus par `c.deck === selectedDeck`. Si le pool est vide (ne devrait pas arriver), fallback sur tout `available`.

La carte précédente est exclue du pool via le tableau `drawnIds` (comparaison par `id`) — anti-répétition complet sur toute la séance.

### Favoris

```ts
const FAV_KEY = 'consentement_card_favorites';
function loadFavs(): string[] { /* localStorage.getItem */ }
function saveFavs(ids: string[]) { /* localStorage.setItem */ }
```

Le state `favorites` est initialisé depuis localStorage au montage (`useState(loadFavs)`). La sauvegarde est synchrone à chaque toggle pour éviter la perte en cas de fermeture brutale.

### Gestion des timers

```ts
const animTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
```

Tous les `setTimeout` sont trackés et annulés dans `clearTimers()`, appelé dans `reset()` et au démontage (`useEffect` cleanup). Évite les mises à jour d'état sur un composant démonté.

---

## Décisions de conception

**Pourquoi pas de vote (contrairement au dé) ?**
Les cartes déclenchent des questions et des conversations, pas des actions à effectuer ensemble. Le consentement n'est pas la décision de "faire ou ne pas faire" — c'est l'ouverture au dialogue. Le vote serait hors-sujet et alourdirait le jeu sans valeur ajoutée.

**Pourquoi la carte reste affichée jusqu'à ce que le joueur la ferme ?**
Insight UX fondateur : une question sur les limites ou les besoins peut prendre 2 minutes comme 20. Un timer crée exactement la pression que le jeu cherche à éliminer. Le joueur est maître du rythme.

**Pourquoi deux modes (Séance / Libre) ?**
La Séance structure l'expérience pour les utilisateurs qui veulent une soirée cadencée — un début, un rythme progressif, une fin. Le mode Libre répond au besoin opposé : tirer des cartes au fil de la conversation, sans s'engager sur un nombre. Les deux usages sont légitimes.

**Pourquoi la progression émotionnelle en mode aléatoire ?**
Commencer par Vérité adulte avec des inconnus crée de la résistance. La progression light → profond reproduit la dynamique naturelle d'une vraie conversation — on se chauffe avant d'aller au fond des choses. C'est invisible pour l'utilisateur, mais il le ressent.

**Pourquoi les favoris en localStorage et non en base ?**
Pas de compte requis pour jouer — l'app est utilisable sans auth. localStorage est suffisant pour une utilisation personnelle sur un seul appareil. Une sync cloud serait une évolution post-v1.

**Pourquoi réutiliser `DICE_CATEGORIES` plutôt que créer un nouveau système ?**
Les 6 catégories sont déjà connues des joueurs du dé. Réutiliser les mêmes noms, emojis et couleurs crée une cohérence de langage dans toute l'app. Le Jeu de l'oie utilise le même code couleur pour la même raison.

**Pourquoi le paquet "Aléatoire" par défaut ?**
Réduire la friction d'entrée. Un utilisateur qui veut juste jouer n'a pas à choisir un paquet. Choisir un paquet est une décision intentionnelle — utile quand on veut orienter la soirée vers un ton précis (Douceur vs. Défi).

**Pourquoi premium (et non gratuit comme le dé) ?**
Volume et profondeur : 84 cartes dont 24 adultes représentent un contenu éditorial significatif. La séance structurée avec progression, favoris et écran de fin offre une expérience complète qui justifie l'abonnement. La barrière premium filtre aussi naturellement vers des utilisateurs qui ont une intention de jeu sérieuse — contexte dans lequel les cartes Vérité et Douceur adultes ont leur pleine valeur.

---

## Évolutions prévues

- [ ] Mode "soirée" : plusieurs joueurs à tour de rôle — chaque joueur pioche sa propre carte
- [ ] Vue favoris : revoir les cartes marquées ❤️ en dehors d'une séance
- [ ] Historique de session : voir les cartes tirées (reset à la fermeture)
- [ ] Paquets thématiques supplémentaires (ex: "Première fois", "Après une dispute", "Anniversaire")
- [ ] Cartes personnalisées : les utilisateurs créent leurs propres cartes dans un paquet privé
- [ ] Export PDF : imprimer un paquet pour jouer hors-ligne
- [ ] Sync favoris sur le compte utilisateur (post-auth)
