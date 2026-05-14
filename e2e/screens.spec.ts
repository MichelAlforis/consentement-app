import { test, expect } from '@playwright/test';

// Tests visuels des écrans principaux en simulation mobile.
// Injecte le localStorage AVANT le premier render React (addInitScript)
// pour que les stores zustand-persist démarrent directement dans le bon état.
//
// Mode serial — évite les crashs Three.js cross-workers sur les tests qui suivent.
// toMatchSnapshot — crée les snapshots de référence au premier run, compare ensuite.

test.describe.configure({ mode: 'serial' });

// ── Helpers ────────────────────────────────────────────────────────────────────

const ADULT_AUTH    = JSON.stringify({ state: { isAdult: true, userName: 'Test', pronouns: null, isAuthenticated: true }, version: 0 });
const MODULES_DONE  = JSON.stringify({ state: { completedModules: [], onboardingStatus: 'completed' }, version: 1 });
const SETTINGS_WARM = JSON.stringify({ state: { themeMode: 'warm', explicitMode: false }, version: 0 });

const SETTLE = 700; // ms — laisse les animations framer-motion terminer (300-400 ms typique)

// ── Onboarding (état vide — premier lancement) ─────────────────────────────────

test.describe('Visual — Onboarding', () => {
  test.skip(({ browserName }) => browserName === 'webkit', 'webkit — run: npx playwright install webkit');

  test('onboarding · step 1 langue', async ({ page }) => {
    // Aucune injection — localStorage vide = premier lancement
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(SETTLE);
    const shot = await page.screenshot({ fullPage: false });
    expect(shot).toMatchSnapshot('onboarding-language-step.png');
  });
});

// ── Home screen ────────────────────────────────────────────────────────────────

test.describe('Visual — Home', () => {
  test.skip(({ browserName }) => browserName === 'webkit', 'webkit — run: npx playwright install webkit');

  test('home · adulte · niveau découverte', async ({ page }) => {
    await page.addInitScript(({ auth, modules, settings }) => {
      localStorage.setItem('consentement-auth', auth);
      localStorage.setItem('consentement-modules', modules);
      localStorage.setItem('consentement-settings', settings);
    }, { auth: ADULT_AUTH, modules: MODULES_DONE, settings: SETTINGS_WARM });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(SETTLE);
    const shot = await page.screenshot({ fullPage: false });
    expect(shot).toMatchSnapshot('home-adult-discovery.png');
  });
});

// ── Apprendre screen ───────────────────────────────────────────────────────────

test.describe('Visual — Apprendre', () => {
  test.skip(({ browserName }) => browserName === 'webkit', 'webkit — run: npx playwright install webkit');

  test('apprendre · adulte · liste modules', async ({ page }) => {
    await page.addInitScript(({ auth, modules, settings }) => {
      localStorage.setItem('consentement-auth', auth);
      localStorage.setItem('consentement-modules', modules);
      localStorage.setItem('consentement-settings', settings);
    }, { auth: ADULT_AUTH, modules: MODULES_DONE, settings: SETTINGS_WARM });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(SETTLE);

    // Clic sur l'onglet Apprendre
    await page.getByRole('button', { name: /apprendre/i }).click();
    await page.waitForTimeout(SETTLE);

    const shot = await page.screenshot({ fullPage: false });
    expect(shot).toMatchSnapshot('apprendre-adult-modules.png');
  });
});
