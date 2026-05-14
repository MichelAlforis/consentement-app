export interface QuizQuestion {
  id: string;
  correctIndex: 0 | 1 | 2 | 3;
}

export const pratiquesExplicitQuiz: QuizQuestion[] = [
  { id: 'pratiques-q1', correctIndex: 3 },
  { id: 'pratiques-q2', correctIndex: 1 },
  { id: 'pratiques-q3', correctIndex: 0 },
  { id: 'pratiques-q4', correctIndex: 2 },
  { id: 'pratiques-q5', correctIndex: 1 },
  { id: 'pratiques-q6', correctIndex: 3 },
];
