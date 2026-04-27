import { describe, it, expect, beforeEach } from 'vitest';
import { useModuleProgressStore } from './moduleProgressStore';

const store = () => useModuleProgressStore.getState();

beforeEach(() => {
  store().reset();
  localStorage.clear();
});

describe('moduleProgressStore', () => {
  it('état initial : completedModules vide', () => {
    expect(store().completedModules).toEqual([]);
    expect(store().onboardingStatus).toBe('not_started');
  });

  it('markModuleComplete ajoute le module', () => {
    store().markModuleComplete('module-de-base');
    expect(store().completedModules).toContain('module-de-base');
  });

  it('markModuleComplete est idempotent — pas de doublon', () => {
    store().markModuleComplete('quiz-consentement');
    store().markModuleComplete('quiz-consentement');
    expect(store().completedModules.filter(id => id === 'quiz-consentement')).toHaveLength(1);
  });

  it("marquer deux modules différents — les deux sont présents", () => {
    store().markModuleComplete('module-de-base');
    store().markModuleComplete('loi-consentement');
    expect(store().completedModules).toContain('module-de-base');
    expect(store().completedModules).toContain('loi-consentement');
  });

  it("l'ordre d'insertion est préservé", () => {
    store().markModuleComplete('module-de-base');
    store().markModuleComplete('quiz-consentement');
    store().markModuleComplete('loi-consentement');
    expect(store().completedModules).toEqual([
      'module-de-base', 'quiz-consentement', 'loi-consentement',
    ]);
  });

  it('reset vide completedModules', () => {
    store().markModuleComplete('module-de-base');
    store().markOnboardingCompleted('module-de-base');
    store().markModuleComplete('loi-consentement');
    store().reset();
    expect(store().completedModules).toEqual([]);
    expect(store().onboardingStatus).toBe('not_started');
  });

  it('peut marquer un module après reset', () => {
    store().markModuleComplete('module-de-base');
    store().reset();
    store().markModuleComplete('quiz-consentement');
    expect(store().completedModules).toEqual(['quiz-consentement']);
  });

  it('markOnboardingCompleted marque le module et le statut completed', () => {
    store().markOnboardingCompleted('module-de-base-mineur');
    expect(store().completedModules).toEqual(['module-de-base-mineur']);
    expect(store().onboardingStatus).toBe('completed');
  });

  it("markOnboardingSkipped différencie le skip d'un module complété", () => {
    store().markOnboardingSkipped();
    expect(store().completedModules).toEqual([]);
    expect(store().onboardingStatus).toBe('skipped');
  });
});
