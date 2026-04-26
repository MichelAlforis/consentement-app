# Cinématiques de fin de partie

**Statut :** ✅ Level 2 livré  
**Composant :** `GameEndCinematic`  
**Portée :** GooseGame · CardGame · DiceGame  
**Date :** 2026-04-23

---

## Rôle

L'écran de fin est le seul moment du jeu où les deux joueurs lisent le même écran en même temps. C'est la conclusion émotionnelle de la session — pas un "game over", mais un atterrissage. La cinématique en couche background amplifie cette résonance sans rivaliser avec les stats et les boutons qui restent au premier plan.

---

## Niveaux d'implémentation

### Level 1 — Framer Motion seul

**Ce qui existe :** animations d'entrée Framer Motion sur chaque bloc UI (opacity + y + scale + spring).

**Limites :**
- Fond statique (gradient CSS fixe)
- Zéro particule, zéro profondeur de champ
- L'émotion repose entièrement sur le texte

**Fichiers concernés :**
| Jeu | Fichier |
|-----|---------|
| GooseGame | `app/components/screens/GooseGameScreen/phases/EndScreen.tsx` |
| CardGame | `app/components/screens/CardGame/index.tsx` (bloc `s.step === 'end'`) |
| DiceGame | `app/components/screens/DiceGame/index.tsx` (bloc `mode === 'duo-reveal'`) |

Toutes les animations Level 1 restent actives au Level 2 — la cinématique s'y superpose, elle ne les remplace pas.

---

### Level 2 — GameEndCinematic (R3F + Drei)

**Fichier :** `app/game-engine/shared/GameEndCinematic.tsx`

**Principe :** un `<Canvas>` R3F positionné en `position: absolute; inset: 0; z-index: 0; pointer-events: none` derrière l'UI. Le contenu UI est dans un `<div className="relative z-10">` qui le fait passer devant.

#### Architecture de la scène

```
CinematicScene
├── ambientLight (intensity 0.05)
├── CentralBlob              → Float + MeshDistortMaterial (blob organique qui pulse)
├── Orb × 2–4               → Float + meshStandardMaterial emissive + pointLight embarquée
└── Sparkles × 1–2 passes   → GPU particles (Drei), primary + secondary color
```

#### API publique

```tsx
<GameEndCinematic
  primaryColor="#c084fc"    // couleur dominante (orbes, blob, particules)
  secondaryColor="#60a5fa"  // couleur secondaire (orbes alternées, 2e passe Sparkles)
  intensity="high"          // 'low' | 'medium' | 'high'
/>
```

#### Table des intensités

| intensity | Sparkles (primary) | Sparkles (secondary) | Orbes | distortAmp | distortSpeed |
|-----------|-------------------|---------------------|-------|-----------|-------------|
| `low`     | 40                | 0                   | 2     | 0.22      | 1.0         |
| `medium`  | 80                | 25                  | 3     | 0.32      | 1.5         |
| `high`    | 120               | 40                  | 4     | 0.44      | 2.2         |

Max 120 particules — seuil GPU mobile testé sur le dé Level 2.

#### Contraintes mobile respectées

- `dpr={[1, 1.5]}` — jamais plus de 1.5× le DPR natif
- `AdaptiveDpr pixelated` — réduit automatiquement si le GPU décroche (< 30 fps)
- `frameloop="always"` — boucle continue nécessaire pour Float + Sparkles animés
- `powerPreference: 'low-power'` — réduit la pression GPU sur iOS, évite le context loss sous charge thermique
- Géométrie sphère centrale : 32×32 segments (blob) / 12×12 (orbes) — budget poly mobile
- Même pattern que `DiceCanvas.tsx` — validé sur iOS 13+ / Android API 22+

#### Correctif iOS — mount différé + CanvasBoundary (2026-04-23)

**Symptôme :** sur iOS Capacitor, l'écran devenait vide après la dernière carte — aucune cinématique, aucune UI.

**Cause :** AnimatePresence swap les vues de façon synchrone. Au moment du mount de `GameEndCinematic`, le parent `position: relative` n'a pas encore ses dimensions calculées par le moteur de layout WebKit. R3F recevait un Canvas 0×0, lançait une exception, et React démontait toute la branche faute d'error boundary → écran blanc.

**Correction en deux couches :**

```tsx
// 1. Mount différé — 60ms pour laisser WebKit finir son layout
const [mounted, setMounted] = useState(false);
useEffect(() => {
  const t = setTimeout(() => setMounted(true), 60);
  return () => clearTimeout(t);
}, []);

// 2. Error boundary — WebGL failure → null, l'UI reste visible
class CanvasBoundary extends Component<...> {
  static getDerivedStateFromError() { return { crashed: true }; }
  render() { return this.state.crashed ? null : this.props.children; }
}
```

La cinématique est un bonus visuel : si WebGL est indisponible ou plante, l'overlay sombre et l'UI (stats, boutons) restent intacts.

---

### Level 3 — Effets avancés (prévu)

Nécessiterait `@react-three/postprocessing` (non installé).

| Effet | Package | Impact visuel | Impact perf |
|-------|---------|--------------|-------------|
| Bloom | postprocessing | Halo lumineux sur orbes et blob | +2–4 ms/frame |
| DepthOfField | postprocessing | Blur doux en bordure de scène | +3 ms/frame |
| Géométrie spécifique par jeu | — | Rectangles (CardGame), burst unique (DiceGame) | négligeable |
| Burst d'entrée one-shot | R3F useFrame | Explosion de particules au mount, puis loop ambiant | — |

Le Level 3 n'est pertinent que si les tests sur devices cibles (iPhone SE 2, Moto G5) confirment la marge thermique disponible.

---

## Déclinaison par jeu

### GooseGame

```tsx
<GameEndCinematic
  primaryColor="#c084fc"
  secondaryColor="#60a5fa"
  intensity={accordsCount >= 4 ? 'high' : accordsCount >= 2 ? 'medium' : 'low'}
/>
```

- Violet `#c084fc` = couleur de la Zone 3 (intimité) — cohérence visuelle avec la légende du plateau
- Intensité proportionnelle aux accords : plus le voyage a été profond, plus la fête est grande
- Fond conservé : `linear-gradient(180deg, #1a0838 0%, #060512 100%)`

### CardGame

```tsx
<GameEndCinematic
  primaryColor={colors.accent}   // dépend du thème actif
  secondaryColor="#60a5fa"
  intensity="medium"
  darkOverlay
/>
```

- `colors.accent` adapte la cinématique au thème sans condition — warm = corail, calm = bleu ardoise, dark-luxury = or, etc.
- Intensité fixe `medium` : le CardGame n'a pas de score, donc pas de graduation
- `darkOverlay` : assombrit le fond pour que les cartes collector blanches/colorées ressortent

**Spécificité CardGame** : l'écran de fin contient un `CardUnlockReveal` qui affiche les cartes collector gagnées en séance (stagger 550ms, auto-flip à 800ms, tap-to-toggle). Voir `docs/jeux/cartes-a-tirer.md` section "Écran de fin".

### DiceGame (duo-reveal)

```tsx
<GameEndCinematic
  primaryColor={bothYes ? '#22c55e' : '#94a3b8'}
  secondaryColor={bothYes ? '#60a5fa' : '#64748b'}
  intensity={bothYes ? 'high' : 'low'}
/>
```

- `bothYes` → vert célébration, haute densité — le "oui" des deux mérite une fête
- `!bothYes` → ardoise neutre, basse densité — l'écran reste présent sans amplifier le sentiment de refus
- Note : duo-reveal n'est pas un "vrai" end screen — il apparaît après chaque round. La cinématique s'y adapte : légère et non-blocante.

---

## Structure stacking dans les écrans

Même pattern pour les trois jeux :

```tsx
{/* wrapper avec position relative */}
<motion.div className="relative" style={{ background: '...' }}>

  {/* couche 0 : cinématique (position absolute, z-index 0, pointer-events none) */}
  <GameEndCinematic primaryColor="..." secondaryColor="..." intensity="..." />

  {/* couche 1 : UI (position relative, z-index 10) */}
  <div className="relative z-10 ...">
    {/* stats, boutons, messages */}
  </div>

</motion.div>
```

---

## Décisions de conception

**Pourquoi R3F et pas Framer Motion / CSS ?**
`<Sparkles>` de Drei génère les particules en GPU (une seule draw call, shader natif). L'équivalent CSS/canvas 2D demanderait 80–120 `<div>` animés individuellement — trop lourd sur mobile milieu de gamme. Le blob `MeshDistortMaterial` est impossible en CSS. R3F est déjà dans le bundle (dé Level 2), donc coût d'ajout = 0.

**Pourquoi `pointer-events: none` sur le Canvas ?**
L'écran de fin a des boutons tactiles. Sans cela, le Canvas intercepterait tous les touchers, rendant les boutons inopérants sur mobile.

**Pourquoi pas de `Suspense` explicite autour de la scène ?**
R3F gère son propre `Suspense` interne. Aucun asset externe (texture, HDRI) n'est chargé — tout est procédural. La scène monte instantanément.

**Pourquoi `frameloop="always"` et pas `"demand"` ?**
`Float` et `Sparkles` animent en continu. Avec `"demand"`, R3F ne re-rendrait que sur événement React — la scène serait figée. `AdaptiveDpr` compense le coût énergétique.

---

## Évolutions prévues

- [ ] Level 3 : Bloom postprocessing (conditionnel si perf OK sur target devices)
- [ ] Burst d'entrée one-shot au mount (useRef + useFrame, fade vers loop ambiant à t=1.5s)
- [ ] Géométrie cartes pour CardGame (box rectangulaire en lieu de sphère orbe)
- [ ] Lien GooseGame → CardGame depuis l'EndScreen (CTA contextuel)
