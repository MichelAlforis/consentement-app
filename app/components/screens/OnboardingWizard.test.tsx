import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { OnboardingWizard } from './OnboardingWizard';

// ─── Mocks hoistés ────────────────────────────────────────────────────────────

const { mockVibrate, mockChangeLanguage, mockMarkOnboardingSkipped, mockUseTheme } = vi.hoisted(() => ({
  mockVibrate: vi.fn(),
  mockChangeLanguage: vi.fn(),
  mockMarkOnboardingSkipped: vi.fn(),
  mockUseTheme: vi.fn(),
}));

const mockColors = {
  accent: '#6366f1', accentLight: '#a5b4fc', accentGradient: '#6366f1',
  accentShadow: 'rgba(99,102,241,0.3)', secondary: '#8b5cf6', secondaryLight: '#c4b5fd',
  textPrimary: '#1a1a2e', textSecondary: '#374151', textMuted: '#6b7280',
  bgPrimary: '#fff', bgSecondary: '#e5e7eb', bgGradient: undefined,
  bgCard: '#f3f4f6', bgCardHover: '#e9eaf0', divider: '#e5e7eb', border: '#d1d5db',
  error: '#ef4444', success: '#22c55e', warning: '#f59e0b',
};

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, initial: _i, animate: _a, exit: _e, transition: _t, ...rest }: React.HTMLAttributes<HTMLDivElement> & {
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
    }) =>
      React.createElement('div', { className, style, ...rest }, children),
    button: ({ children, className, style, onClick, initial: _i, animate: _a, exit: _e, transition: _t, whileTap: _w, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
      whileTap?: unknown;
    }) =>
      React.createElement('button', { className, style, onClick, ...rest }, children),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

vi.mock('../../context/ThemeContext', () => ({
  useTheme: (...args: unknown[]) => mockUseTheme(...args),
}));

vi.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'fr', changeLanguage: mockChangeLanguage }),
}));

vi.mock('../../i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../game-engine/shared/useHaptics', () => ({
  useHaptics: () => ({ vibrate: mockVibrate }),
}));

vi.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({ setPronouns: vi.fn() }),
}));

vi.mock('../../stores/moduleProgressStore', () => ({
  useModuleProgressStore: (selector: (state: { markOnboardingSkipped: typeof mockMarkOnboardingSkipped }) => unknown) =>
    selector({ markOnboardingSkipped: mockMarkOnboardingSkipped }),
}));

vi.mock('../ui/AppLogo', () => ({
  AppLogo: () => React.createElement('div', { 'data-testid': 'app-logo' }),
}));

vi.mock('../ui', () => ({
  Button: ({ children, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    React.createElement('button', { onClick, ...rest }, children),
  Card: ({ children, onClick }: React.HTMLAttributes<HTMLDivElement>) =>
    React.createElement('div', { role: 'button', onClick, 'data-testid': 'card' }, children),
  IconBox: ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'icon-box' }, children),
}));

// ─── Util ─────────────────────────────────────────────────────────────────────

type WizardProps = React.ComponentProps<typeof OnboardingWizard>;

function renderWizard(props: Partial<WizardProps> = {}) {
  const defaults: WizardProps = {
    isAdult: null, isPremium: false,
    onSetAge: vi.fn(), onSelectTheme: vi.fn(), onAuth: vi.fn(), onNavigate: vi.fn(),
  };
  return render(<OnboardingWizard {...defaults} {...props} />);
}

/** Avance depuis le step 0 (langue) vers le step 1 (welcome-age). */
async function goToStep1() {
  fireEvent.click(screen.getByText('Français'));
  await act(async () => { vi.advanceTimersByTime(300); });
}

/** Avance jusqu'au step 2 (theme-select) en passant par langue → mineur. */
async function goToThemeStep() {
  await goToStep1();
  const [minorCard] = screen.getAllByTestId('card');
  fireEvent.click(minorCard);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OnboardingWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({ colors: mockColors, id: 'warm' });
  });

  // 1 — Auto-advance langue ───────────────────────────────────────────────────

  describe('LanguageStep — auto-advance', () => {
    it('avance vers welcome-age exactement à 300 ms, sans bouton Continuer', async () => {
      vi.useFakeTimers();
      renderWizard();

      expect(screen.queryByText('ageCheck.title')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Français'));

      await act(async () => { vi.advanceTimersByTime(299); });
      expect(screen.queryByText('ageCheck.title')).not.toBeInTheDocument();

      await act(async () => { vi.advanceTimersByTime(1); });
      expect(screen.getByText('ageCheck.title')).toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  // 2 — Haptics cards d'âge ──────────────────────────────────────────────────

  describe('WelcomeAgeStep — haptics', () => {
    it('appelle vibrate("light") sur la card mineur', async () => {
      vi.useFakeTimers();
      renderWizard();
      await goToStep1();

      const [minorCard] = screen.getAllByTestId('card');
      fireEvent.click(minorCard);

      expect(mockVibrate).toHaveBeenCalledWith('light');
      vi.useRealTimers();
    });

    it('appelle vibrate("light") sur la card adulte', async () => {
      vi.useFakeTimers();
      renderWizard();
      await goToStep1();

      const [, adultCard] = screen.getAllByTestId('card');
      fireEvent.click(adultCard);

      expect(mockVibrate).toHaveBeenCalledWith('light');
      vi.useRealTimers();
    });
  });

  // 3 — Thème pré-sélectionné ────────────────────────────────────────────────

  describe('ThemeSelectStep — thème actif visible', () => {
    it('affiche un contour accent sur la carte correspondant au thème actif (youth)', async () => {
      vi.useFakeTimers();
      // Simuler youth comme thème courant (cas mineur auto-sélectionné)
      mockUseTheme.mockReturnValue({ colors: mockColors, id: 'youth' });

      renderWizard({ isAdult: false });
      await goToThemeStep();

      // La carte youth doit avoir un outline non-transparent
      const youthBtn = screen.getByTestId('theme-card-youth');
      expect(youthBtn.style.outline).toContain('solid');
      expect(youthBtn.style.outline).not.toContain('transparent');

      // Les autres cartes doivent avoir un outline transparent
      const warmBtn = screen.getByTestId('theme-card-warm');
      expect(warmBtn.style.outline).toContain('transparent');

      vi.useRealTimers();
    });
  });

  // 4 — Step dots ────────────────────────────────────────────────────────────

  describe('Step dots', () => {
    it('affiche 4 dots pour un adulte (language → welcome-age → theme → auth)', () => {
      renderWizard({ isAdult: true });
      const dots = document.querySelectorAll('.h-2.rounded-full');
      expect(dots).toHaveLength(4);
    });

    it('affiche 3 dots pour un mineur (pas de step auth)', () => {
      renderWizard({ isAdult: false });
      const dots = document.querySelectorAll('.h-2.rounded-full');
      expect(dots).toHaveLength(3);
    });

    it('remplit les dots jusqu\'au step courant', async () => {
      vi.useFakeTimers();
      renderWizard({ isAdult: true });

      // Step 0 : dot 0 est accent (couleur différente des dots inactifs)
      let dots = document.querySelectorAll<HTMLElement>('.h-2.rounded-full');
      const accentColor = dots[0].style.background;
      const inactiveColor = dots[1].style.background;
      expect(accentColor).not.toBe(inactiveColor);
      expect(dots[1].style.background).toBe(inactiveColor);
      expect(dots[2].style.background).toBe(inactiveColor);

      // Avancer au step 1 : dots 0 et 1 sont accent, dot 2 inactif
      await goToStep1();

      dots = document.querySelectorAll<HTMLElement>('.h-2.rounded-full');
      expect(dots[0].style.background).toBe(accentColor);
      expect(dots[1].style.background).toBe(accentColor);
      expect(dots[2].style.background).toBe(inactiveColor);

      vi.useRealTimers();
    });
  });

  // 5 — Fin du wizard ────────────────────────────────────────────────────────

  describe('Fin du wizard', () => {
    it('appelle markOnboardingSkipped puis onNavigate("home") au dernier step (mineur)', async () => {
      vi.useFakeTimers();
      const onNavigate = vi.fn();
      renderWizard({ isAdult: false, onNavigate });

      // language → welcome-age → theme-select (dernier step pour un mineur)
      await goToThemeStep();

      // Cliquer une carte de thème → délai 200 ms → fin du wizard
      fireEvent.click(screen.getByTestId('theme-card-youth'));
      await act(async () => { vi.advanceTimersByTime(200); });

      expect(mockMarkOnboardingSkipped).toHaveBeenCalledOnce();
      expect(onNavigate).toHaveBeenCalledWith('home');

      vi.useRealTimers();
    });

    it('appelle onNavigate("home") via le bouton Passer', () => {
      const onNavigate = vi.fn();
      renderWizard({ onNavigate });

      fireEvent.click(screen.getByText('onboarding.skip'));

      expect(mockMarkOnboardingSkipped).toHaveBeenCalledOnce();
      expect(onNavigate).toHaveBeenCalledWith('home');
    });
  });
});
