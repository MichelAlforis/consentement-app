export const DURATION = {
  fast:            0.22,
  normal:          0.28,
  medium:          0.40,
  cardFlipCommon:  0.52,
  cardFlipRare:    0.62,
  cardFlipUnique:  0.70,
  cardFlipCSS:     0.60,  // CSS fallback — DOM légèrement plus lent que R3F
  cardReveal:      0.65,
  staggerItem:     0.25,
} as const;

export const STAGGER = {
  item: 0.035,
} as const;

export const EASING = {
  cardFlip: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  standard: [0.4,  0,    0.2,  1] as [number, number, number, number],
};
