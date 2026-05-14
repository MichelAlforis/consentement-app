import { describe, expect, it } from 'vitest';
import { MODULES, getModuleSequence, getVisibleLearningModules, moduleAudience } from './data/modules';
import { ROUTES } from './lib/routes';

describe('modules registry', () => {
  it('only exposes sequenced modules with real screens', () => {
    for (const isAdult of [true, false] as const) {
      const sequence = getModuleSequence(isAdult);
      expect(sequence.length).toBeGreaterThan(0);
      for (const moduleConfig of sequence) {
        expect(moduleConfig.screen).not.toBeNull();
        expect(moduleConfig.screen ? ROUTES[moduleConfig.screen] : null).toBeTruthy();
        expect(moduleConfig.available[moduleAudience(isAdult)]).toBe(true);
      }
    }
  });

  it('keeps visible available modules navigable', () => {
    for (const moduleConfig of MODULES) {
      for (const audience of ['adult', 'minor'] as const) {
        const hasSequence = moduleConfig.sequence[audience] !== null;
        if (moduleConfig.available[audience] && hasSequence) {
          expect(moduleConfig.screen, `${moduleConfig.id}/${audience} should have a screen`).not.toBeNull();
        }
      }
    }
  });

  it('keeps multi-level quiz variants out of the Apprendre sequence', () => {
    expect(getVisibleLearningModules(true).map((module) => module.id)).not.toContain('quiz-d1');
    expect(getVisibleLearningModules(true).map((module) => module.id)).not.toContain('quiz-i1');
    expect(getVisibleLearningModules(true).map((module) => module.id)).not.toContain('quiz-e1');
  });
});
