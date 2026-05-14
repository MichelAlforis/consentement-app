// Quiz multi-niveaux — indices des bonnes réponses (0–3)
// Texte dans i18n/locales/{locale}/quizMultiLevel.ts
// Clés : t(`quizMl.${tier}.v${v}.${idx}.q|o.${i}|x`)
export type QuizTier = 'd' | 'i' | 'e';

export const QUIZ_ML_QUESTIONS_COUNT = 6;

// [tier][variantIndex 0-2][questionIndex 0-5] = correctIndex (0-3)
export const QUIZ_ML_CORRECT: Record<QuizTier, readonly [number, number, number, number, number, number][]> = {
  d: [
    [0, 0, 1, 2, 3, 0], // variant 1 — Les bases du consentement
    [0, 1, 2, 1, 0, 3], // variant 2 — Communication & limites
    [2, 3, 0, 1, 3, 2], // variant 3 — Situations du quotidien
  ],
  i: [
    [1, 2, 0, 3, 1, 2], // variant 1 — Manipulations & pressions
    [0, 1, 2, 3, 2, 0], // variant 2 — Alcool, drogues & consentement
    [2, 1, 0, 3, 2, 1], // variant 3 — Droit & légalité
  ],
  e: [
    [0, 2, 1, 2, 3, 1], // variant 1 — BDSM & consentement
    [2, 1, 0, 3, 1, 2], // variant 2 — Numérique & intimité
    [0, 3, 1, 2, 3, 2], // variant 3 — Zones grises & situations complexes
  ],
} as const;

export type QuizModuleId =
  | 'quiz-d1' | 'quiz-d2' | 'quiz-d3'
  | 'quiz-i1' | 'quiz-i2' | 'quiz-i3'
  | 'quiz-e1' | 'quiz-e2' | 'quiz-e3';

export function quizModuleId(tier: QuizTier, variantIndex: number): QuizModuleId {
  const v = variantIndex + 1;
  return `quiz-${tier}${v}` as QuizModuleId;
}
