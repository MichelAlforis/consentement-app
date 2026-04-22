import '@testing-library/jest-dom';

// Mock Capacitor pour les tests unitaires (environnement jsdom, pas mobile)
jest.mock('../lib/platform', () => ({
  isCapacitor: () => false,
}));

// Mock next/navigation si utilisé dans les composants
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  usePathname: () => '/',
}));
