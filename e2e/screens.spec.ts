import { test, expect } from '@playwright/test';

// Tests visuels des écrans principaux en simulation mobile.
// Injecte le localStorage AVANT le premier render React (addInitScript)
// pour que les stores zustand-persist démarrent directement dans le bon état.
//
// Stabilité : on attend le data-testid de l'écran cible plutôt qu'un délai fixe
// — évite les faux positifs liés au splash screen (600ms hardcodé dans AppShell)
// et aux variations de vitesse de rendu.
//
// Mode serial — évite les crashs Three.js cross-workers sur les tests qui suivent.

test.describe.configure({ mode: 'serial' });

// ── State constants ────────────────────────────────────────────────────────────

const ADULT_AUTH    = JSON.stringify({ state: { isAdult: true, userName: 'Test', pronouns: null, isAuthenticated: true }, version: 0 });
const MODULES_DONE  = JSON.stringify({ state: { completedModules: [], onboardingStatus: 'completed' }, version: 1 });
const SETTINGS_WARM = JSON.stringify({ state: { themeMode: 'warm', explicitMode: false }, version: 0 });

// ── Onboarding (état vide — premier lancement) ─────────────────────────────────

test.describe('Visual — Onboarding', () => {
  test.skip(({ browserName }) => browserName === 'webkit', 'webkit — run: npx playwright install webkit');

  test('onboarding · step 1 langue', async ({ page }) => {
    // Aucune injection — localStorage vide = premier lancement
    await page.goto('/');
    await page.locator('[data-testid="screen-onboarding"]').waitFor({ state: 'visible' });
    // Laisse l'animation d'entrée framer-motion se terminer (300ms)
    await page.waitForTimeout(350);
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
    await page.locator('[data-testid="screen-home"]').waitFor({ state: 'visible' });
    await page.waitForTimeout(350);
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
    await page.locator('[data-testid="screen-home"]').waitFor({ state: 'visible' });

    await page.getByRole('button', { name: /apprendre/i }).click();
    await page.locator('[data-testid="screen-apprendre"]').waitFor({ state: 'visible' });
    await page.waitForTimeout(350);

    const shot = await page.screenshot({ fullPage: false });
    expect(shot).toMatchSnapshot('apprendre-adult-modules.png');
  });
});
