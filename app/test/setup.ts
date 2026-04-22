import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Capacitor pour les tests unitaires (environnement jsdom, pas mobile)
vi.mock('../lib/platform', () => ({
  isCapacitor: () => false,
}));

// Mock next/navigation si utilisé dans les composants
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
}));
