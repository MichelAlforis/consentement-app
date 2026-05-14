
export interface QuizQuestion {
  id: string;
  correctIndex: 0 | 1 | 2 | 3;
}

export const pressionManipQuiz: QuizQuestion[] = [
  { id: 'pression-q1', correctIndex: 2 },
  { id: 'pression-q2', correctIndex: 0 },
  { id: 'pression-q3', correctIndex: 1 },
  { id: 'pression-q4', correctIndex: 3 },
  { id: 'pression-q5', correctIndex: 0 },
  { id: 'pression-q6', correctIndex: 2 },
];
