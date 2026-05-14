export const RADIUS = {
  dot:         3,   // depth indicator dots
  xs:          4,
  sm:          6,   // rarity badge pill
  badge:      12,   // deck card-count badge
  cardCompact: 14,  // CollectorCardFace compact
  cardMini:   16,   // CollectorCardFace mini
  cardInner:  17,   // specular highlight inset (DiceRenderer)
  input:      18,   // text inputs, CTA buttons
  card:       20,   // main card face (×11 usages)
  pill:      999,   // full circle
} as const;

export const SPACE = {
  xs:   4,
  sm:   8,
  md:  12,
  lg:  16,
  xl:  20,
  '2xl': 24,
} as const;

export const TYPE = {
  xs:    9,
  sm:   11,
  base: 14,
  md:   16,
  lg:   20,
  xl:   24,
} as const;
