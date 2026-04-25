# Palette de couleurs — Consentement App

> Màj 2026-04-25 · Référence authoritative pour tous les assets graphiques

---

## Couleurs fixes globales

Ces teintes sont immuables — elles définissent l'identité visuelle de l'app.

| Rôle | Hex | Usage |
|---|---|---|
| Violet profond | `#7c3aed` | Accent principal, halo, bordure rare |
| Violet clair | `#a855f7` | Gradient rare, badge |
| Lavande | `#a78bfa` | Symbole dos carte (mi-gradient) |
| Lavande claire | `#ddd6fe` | Symbole dos carte (haut) |
| Indigo sombre | `#4c1d95` | Halo extérieur |
| Or/ambre | `#f59e0b` | Rareté unique |
| Rouge-ambre | `#b45309` | Rareté unique accent |
| Rose | `#ec4899` | Rareté unique accent chaud |
| Bordeaux | `#92400e` | Badge unique |

---

## Fond de carte (dos)

Dégradé diagonal (top-left → bottom-right) en 3 stops :

```
#010007  →  #0c0920  →  #3b1f85
quasi-noir    indigo      violet saturé
```

L'écart volontaire entre les stops crée une profondeur lumineuse sans être plat.

---

## Symbole — dégradé (dos)

Le motif vectoriel "deux silhouettes en étreinte" utilise un dégradé vertical :

```
#ddd6fe  →  #a78bfa  →  #6d28d9
lavande     violet       indigo
(haut)      (milieu)     (bas)
opacity: 0.78
```

---

## Halo central (dos)

Dégradé radial centré — donne l'impression de lumière émanant du symbole :

```
#7c3aed  opacity 0.48  (centre)
#4c1d95  opacity 0.18  (55%)
#4c1d95  opacity 0     (bords)
```

---

## Bordure (dos)

Blanche dégradée — contraste net contre le fond violet :

```
rgba(255,255,255, 0.55)  →  rgba(255,255,255, 0.18)  →  rgba(255,255,255, 0.55)
top-left                     centre                        bottom-right
```

---

## Faces de carte — palettes par rareté

### Common
```css
gradient: linear-gradient(135deg, #1d4ed8, #3b82f6)
border:   #60a5fa
```

### Rare
```css
gradient: linear-gradient(135deg, #7c3aed, #a855f7)
border:   #c084fc
```

### Unique
```css
gradient: linear-gradient(135deg, #b45309, #f59e0b)
border:   #fcd34d
```

---

## Effets superposés (ordre de rendu)

Tous les éléments graphiques s'empilent dans cet ordre :

1. **Fond** — dégradé diagonal
2. **Grille diamants** — `rgba(255,255,255, 0.07)`, strokeWidth 0.8
3. **Halo** — radial violet centré
4. **Vignette** — radial noir vers les bords, opacity 0→0.72
5. **Spéculaire** — radial blanc haut-gauche, opacity 0.14→0
6. **Shimmer** — diagonal blanc doux, opacity 0→0.055→0.09→0
7. **Symbole** — path2D/SVG avec gradient top→bottom
8. **Texte** CONSENTEMENT — `rgba(255,255,255, 0.28)`, weight 800
9. **Bordure** — rect arrondi blanc dégradé

---

## Overlay effets PostProcessing (R3F)

| Effet | Paramètres |
|---|---|
| SelectiveBloom | intensity 1.20, threshold 0.30, smoothing 0.60 |
| Vignette | offset 0.40, darkness 0.50 |
| ContactShadows | opacity 0.45, blur 2.2, far 2.5 |
