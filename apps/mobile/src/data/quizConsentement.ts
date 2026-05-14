// TODO Phase 5D: stubs (3 questions). Remplacer par contenu
// pédagogique réel (15+ questions attendues selon V3) lors du
// sprint contenu Phase 5D. Format : voir QuizQuestion interface.

export interface QuizQuestion {
  id: string;
  questionKey: string;
  optionKeys: string[];
  correct: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q0', questionKey: 'quiz.q0.question', optionKeys: ['quiz.q0.opt0', 'quiz.q0.opt1'], correct: 0 },
  { id: 'q1', questionKey: 'quiz.q1.question', optionKeys: ['quiz.q1.opt0', 'quiz.q1.opt1'], correct: 1 },
  { id: 'q2', questionKey: 'quiz.q2.question', optionKeys: ['quiz.q2.opt0', 'quiz.q2.opt1'], correct: 0 },
];
