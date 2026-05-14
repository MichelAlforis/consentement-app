export interface QuizQuestion {
  id: string;
  correctIndex: 0 | 1 | 2 | 3;
}

export const zonesGrisesQuiz: QuizQuestion[] = [
  { id: 'zones-q1', correctIndex: 2 },
  { id: 'zones-q2', correctIndex: 1 },
  { id: 'zones-q3', correctIndex: 0 },
  { id: 'zones-q4', correctIndex: 3 },
  { id: 'zones-q5', correctIndex: 1 },
  { id: 'zones-q6', correctIndex: 2 },
];
