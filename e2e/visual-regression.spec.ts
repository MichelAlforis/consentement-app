import { test, expect } from '@playwright/test';

// CSS renderer uniquement — WebGL (rAF permanent) jamais stable en headless.
// Mode serial — évite les crashs Three.js cross-workers qui ferment les pages voisines.
// page.screenshot({ clip }) + toMatchSnapshot — bypass la double-capture de stabilité
// de toHaveScreenshot qui échoue sur les éléments avec preserve-3d / transform GPU.

test.describe.configure({ mode: 'serial' });

const RARITIES = ['common', 'rare', 'unique'] as const;

test.describe('Visual regression — Collector cards (CSS renderer)', () => {
  test.skip(({ browserName }) => browserName === 'webkit', 'webkit — run: npx playwright install webkit');

  test.beforeEach(async ({ page }) => {
    // ?renderer=css → useEffect set useFallback:true, Three.js ne monte pas durablement
    await page.goto('/card-collector-test?renderer=css');
    await page.waitForLoadState('networkidle');
    // Attendre que le canvas Three.js (montage initial) disparaisse
    await page.waitForFunction(() => !document.querySelector('canvas'), { timeout: 5_000 }).catch(() => {});
    await page.waitForTimeout(400);
  });

  for (const rarity of RARITIES) {
    test(`${rarity} · dos`, async ({ page }) => {
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      await slot.waitFor({ state: 'visible' });
      const box = await slot.boundingBox();
      // page.screenshot + clip — pas de vérification de stabilité GPU/3D
      const shot = await page.screenshot({ clip: box! });
      expect(shot).toMatchSnapshot(`card-${rarity}-css-back.png`);
    });

    test(`${rarity} · face`, async ({ page }) => {
      await page.getByRole('button', { name: /flip toutes/i }).click();
      await page.waitForTimeout(800); // animation flip CSS 0.6s
      const slot = page.locator(`[data-testid="card-${rarity}"]`);
      const box = await slot.boundingBox();
      const shot = await page.screenshot({ clip: box! });
      expect(shot).toMatchSnapshot(`card-${rarity}-css-face.png`);
    });
  }
});
