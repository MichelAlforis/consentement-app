import { test, expect } from '@playwright/test';

// CSS renderer uniquement — WebGL (rAF permanent) jamais stable en headless.
// Mode serial — évite les crashs Three.js cross-workers qui ferment les pages voisines.
// addInitScript — pose __VR_CSS_MODE__ AVANT le premier render React, Three.js ne monte jamais.
// page.screenshot({ clip }) + toMatchSnapshot — bypass la double-capture de stabilité
// de toHaveScreenshot qui échoue sur les éléments avec preserve-3d / transform GPU.

test.describe.configure({ mode: 'serial' });

const RARITIES = ['common', 'rare', 'unique'] as const;

test.describe('Visual regression — Collector cards (CSS renderer)', () => {
  test.skip(({ browserName }) => browserName === 'webkit', 'webkit — run: npx playwright install webkit');

  test.beforeEach(async ({ page }) => {
    // Flag posé avant que React tourne — useState lazy initializer le lit au premier render
    await page.addInitScript(() => {
      (window as Record<string, unknown>).__VR_CSS_MODE__ = true;
    });
    await page.goto('/card-collector-test');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  for (const rarity of RARITIES) {
    test(`${rarity} · dos`, async ({ page }) => {
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      await slot.waitFor({ state: 'visible' });
      const shot = await slot.screenshot();
      expect(shot).toMatchSnapshot(`card-${rarity}-css-back.png`);
    });

    test(`${rarity} · face`, async ({ page }) => {
      await page.getByRole('button', { name: /flip toutes/i }).click();
      await page.waitForTimeout(800); // animation flip CSS 0.6s
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      const shot = await slot.screenshot();
      expect(shot).toMatchSnapshot(`card-${rarity}-css-face.png`);
    });
  }
});
