import { test, expect } from '@playwright/test';

// WebGL (Three.js) non testable en headless :
// le canvas tourne en requestAnimationFrame continu → "waiting for stable" n'aboutit jamais.
// Les tests couvrent le renderer CSS (CSSFallbackPreview) via ?renderer=css.
// Phase 2 : étendre à d'autres tailles/thèmes via params URL supplémentaires.

const RARITIES = ['common', 'rare', 'unique'] as const;

test.describe('Visual regression — Collector cards (CSS renderer)', () => {
  // webkit non installé par défaut — run: npx playwright install webkit
  test.skip(({ browserName }) => browserName === 'webkit', 'webkit non installé — npx playwright install webkit');

  test.beforeEach(async ({ page }) => {
    // ?renderer=css charge la page directement en CSS fallback, sans démontage Three.js
    await page.goto('/card-collector-test?renderer=css');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // laisser les animations d'entrée Framer Motion se terminer
  });

  for (const rarity of RARITIES) {
    test(`${rarity} · dos`, async ({ page }) => {
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      await expect(slot).toHaveScreenshot(`card-${rarity}-css-back.png`, { timeout: 10_000 });
    });

    test(`${rarity} · face`, async ({ page }) => {
      await page.getByRole('button', { name: /flip toutes/i }).click();
      await page.waitForTimeout(800); // animation flip CSS (0.6s)
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      await expect(slot).toHaveScreenshot(`card-${rarity}-css-face.png`, { timeout: 10_000 });
    });
  }
});
