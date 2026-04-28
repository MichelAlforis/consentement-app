import { test, expect } from '@playwright/test';

// Phase 1 : 3 rarités × 2 états × 2 modes renderer = 12 captures
// Phase 2 : étendre à 3 rarités × 2 tailles × 2 thèmes quand la page sandbox supporte les params URL

const RARITIES = ['common', 'rare', 'unique'] as const;

test.describe('Visual regression — Collector cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/card-collector-test');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600); // Three.js warm-up
  });

  // ── WebGL renderer ────────────────────────────────────────────────────────────

  for (const rarity of RARITIES) {
    test(`WebGL · ${rarity} · dos`, async ({ page }) => {
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      await expect(slot).toHaveScreenshot(`card-${rarity}-webgl-back.png`);
    });

    test(`WebGL · ${rarity} · face`, async ({ page }) => {
      await page.getByRole('button', { name: /flip toutes/i }).click();
      await page.waitForTimeout(750); // animation flip
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      await expect(slot).toHaveScreenshot(`card-${rarity}-webgl-face.png`);
    });
  }

  // ── CSS fallback renderer ─────────────────────────────────────────────────────

  for (const rarity of RARITIES) {
    test(`CSS fallback · ${rarity} · dos`, async ({ page }) => {
      await page.getByRole('button', { name: /webgl/i }).click();
      await page.waitForTimeout(200);
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      await expect(slot).toHaveScreenshot(`card-${rarity}-css-back.png`);
    });

    test(`CSS fallback · ${rarity} · face`, async ({ page }) => {
      await page.getByRole('button', { name: /webgl/i }).click();
      await page.getByRole('button', { name: /flip toutes/i }).click();
      await page.waitForTimeout(750);
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      await expect(slot).toHaveScreenshot(`card-${rarity}-css-face.png`);
    });
  }
});
