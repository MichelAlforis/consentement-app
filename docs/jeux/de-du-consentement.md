# Le Dé du Consentement

**Statut :** ✅ Livré  
**Version :** 1.0  
**Accès :** Gratuit — tous publics (contenu adulte filtré par âge)  
**Date :** 2026-04-22

---

## Concept

Jeu de tirage aléatoire solo ou à deux. Le dé 3D détermine la catégorie, puis pioche une activité dans cette catégorie. Le résultat est toujours une surprise — c'est le hasard qui brise la glace, pas les joueurs.

Le consentement n'est pas enseigné : il est *joué*. La mécanique du vote caché (mode duo) rend le "non" naturel et sans pression, sans qu'on ait besoin de l'expliquer.

---

## Mécanique

### Mode Solo
1. Choisir "Solo"
2. Lancer le dé → animation 3D → catégorie révélée
3. Lire l'activité → réfléchir, noter, explorer

### Mode Duo (séquentiel sur un seul téléphone)
1. Choisir "À deux"
2. Lancer le dé → catégorie + activité révélées
3. Personne 1 vote en secret (Oui / Non)
4. Écran rideau → passer le téléphone
5. Personne 2 vote en secret
6. Révélation :
   - **Les deux Oui** → "Go ! Vous êtes tous les deux partant·e·s !"
   - **Un Non** → "Pas cette fois" + note anonyme (on ne sait pas qui a dit non)

**Principe clé :** l'anonymat du non protège chaque personne. Personne n'a à se justifier.

---

## Les 6 catégories

| Face | Catégorie | Emoji | Couleur | Ton |
|------|-----------|-------|---------|-----|
| 1 | Osez | 🎭 | Amber `#f59e0b → #d97706` | Actions courtes à faire ensemble |
| 2 | Parlez | 💬 | Violet `#8b5cf6 → #7c3aed` | Questions à se dire |
| 3 | Et si… | 🤔 | Rose `#ec4899 → #db2777` | Scénarios imaginaires |
| 4 | Défi | 🎯 | Bleu `#3b82f6 → #2563eb` | Mini-challenges rigolos |
| 5 | Vérité | ✨ | Vert `#10b981 → #059669` | Questions honnêtes sur les limites |
| 6 | Douceur | ❤️ | Bordeaux `#be123c → #9f1239` | Moments de tendresse guidés |

---

## Contenu

**36 activités au total** — 6 par catégorie × 6 catégories

| Audience | Activités par catégorie | Total |
|----------|------------------------|-------|
| Tous âges (`ageGate: 'all'`) | 4 | 24 |
| Adultes (`ageGate: 'adult'`) | 2 | 12 |

Exemples par catégorie :

**Osez** (tous)
- "Regardez-vous dans les yeux en silence pendant 30 secondes. Premier qui rigole a perdu. 👀"
- "Inventez un geste secret que vous serez les seuls à connaître."

**Parlez** (tous)
- "Dites une chose que vous n'osez jamais dire normalement."
- "Qu'est-ce que l'autre fait inconsciemment qui vous rend heureux·se ?"

**Et si…** (tous)
- "Et si vous deviez décrire votre relation avec une météo — il fait quel temps ?"
- "Et si vous pouviez avoir un super-pouvoir de couple — ça serait lequel ?"

**Défi** (tous)
- "Faites rire l'autre en 20 secondes max — sans le/la toucher. Chrono !"
- "Mimez une scène d'un film culte. L'autre doit deviner lequel en moins de 5 essais."

**Vérité** (tous)
- "Qu'est-ce qui vous fait dire 'non' immédiatement, sans hésiter ?"
- "Qu'est-ce que vous n'avez jamais osé demander à l'autre ?"

**Douceur** (tous)
- "Prenez-vous dans les bras pendant 60 secondes. En silence. Chronométrez."
- "Laissez l'autre décider d'une chose qu'on fait ensemble ce soir — sans négocier, sans refuser."

---

## Technique

### Composants

| Fichier | Rôle |
|---------|------|
| `app/game-engine/dice/DiceCanvas.tsx` | Cube R3F WebGL PBR — rendu, animation, faces colorées |
| `app/game-engine/dice/DiceRenderer.tsx` | Interface publique — bascule `css`/`webgl`, prop `size` |
| `app/game-engine/dice/useDiceEngine.ts` | Logique tirage — anti-répétition, haptiques |
| `app/components/screens/DiceGame/index.tsx` | Écran de jeu complet — 7 états |
| `app/data/index.ts` | `DICE_CATEGORIES` + `diePractices` (36 entrées) |

### États du jeu (`GameMode`)

```
pick → rolling → practice → (solo: fin)
                           → (duo: duo-p1 → duo-hidden → duo-p2 → duo-reveal)
```

### Dé 3D — points clés

- `RoundedBoxGeometry` de **three-stdlib** (hérite BoxGeometry → 6 groupes, `radius=0.08`)
- 6 `MeshPhysicalMaterial` : canvas texture par face (gradient + emoji + label centré)
- Éclairage : 2 `PointLight` doux + `Environment preset="studio"` (IBL ambient)
- Rotation cumulative via `useRef` : évite le snap-back entre les lancers
- Chaque lancer ajoute 1080°X + 720°Y avant l'angle cible → tourne toujours dans le même sens
- Ease `cubic-bezier(0.22, 0.61, 0.36, 1)` calculée manuellement (pas Framer Motion en R3F)

### Animation du titre catégorie

Quand le dé s'arrête, le badge catégorie tombe avec un spring bounce :
```ts
initial={{ opacity: 0, y: -40, rotate: -6, scale: 1.2 }}
animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
transition={{ type: 'spring', stiffness: 320, damping: 18 }}
```

### Filtrage du contenu

```ts
const available = useMemo(() => diePractices.filter(p => {
  if (p.ageGate === 'all') return true;
  if (p.ageGate === 'adult') return isAdult;
  if (p.ageGate === 'premium') return isAdult && isPremium;
  return false;
}), [isAdult, isPremium]);
```

Le lancer tire la face en premier, puis filtre les activités par face :
```ts
const face = (Math.floor(Math.random() * 6) + 1) as 1|2|3|4|5|6;
const pool = available.filter(p => p.face === face);
// fallback sur tout available si la catégorie est vide
```

---

## Décisions de conception

**Pourquoi le vote est anonyme ?**
Si on sait qui a dit non, la pression sociale reprend le dessus. L'anonymat est la mécanique qui rend le "non" réellement libre — c'est le consentement appliqué à la mécanique du jeu lui-même.

**Pourquoi le dé détermine la catégorie (pas juste l'activité) ?**
Le hasard de la catégorie donne une légitimité externe au type d'activité proposée. "C'est le dé qui a choisi Vérité" est moins intimidant que "je t'ai posé une question difficile".

**Pourquoi 6 catégories correspondant aux 6 faces ?**
Cohérence visuelle et mémorisation : chaque couleur de face = une humeur de jeu. Les joueurs apprennent rapidement "bordeaux = tendresse, bleu = défi". Le plateau du Jeu de l'oie réutilisera ce même code couleur.

---

## Évolutions prévues

- [ ] Historique des tirages de la session (pas de persistence — reset à chaque fermeture)
- [ ] Mode "soirée" : plusieurs joueurs à tour de rôle (3+)
- [ ] Cartes adultes premium supplémentaires (6 → 8 par catégorie)
- [ ] Lien vers le Jeu de l'oie depuis l'écran de fin de partie
