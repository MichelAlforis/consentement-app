// Source de vérité unique pour le grain cinématographique feTurbulence.
// ThemeEffects (CSS background-image) et CollectorCardCanvas (texture Canvas 2D)
// partagent le même SVG — stitchTiles='stitch' → tuile 256×256 sans couture.

const GRAIN_SVG_256 =
  `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">` +
  `<filter id="n">` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>` +
  `<feColorMatrix type="saturate" values="0"/>` +
  `</filter>` +
  `<rect width="100%" height="100%" filter="url(#n)"/>` +
  `</svg>`;

// URL encodée pour usage CSS (background-image dans ThemeEffects)
export const GRAIN_CSS_URL =
  `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG_256)}")`;

let cached: HTMLCanvasElement | null = null;

export function getGrainCanvas(): HTMLCanvasElement | null {
  return cached;
}

export function initGrain(): void {
  if (cached || typeof document === 'undefined') return;
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement('canvas');
    cv.width = 256;
    cv.height = 256;
    cv.getContext('2d')!.drawImage(img, 0, 0);
    cached = cv;
  };
  img.src = 'data:image/svg+xml,' + encodeURIComponent(GRAIN_SVG_256);
}
