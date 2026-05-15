export interface QuizQuestion {
  id: string;
  questionKey: string;
  optionKeys: string[];
  correct: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q0',  questionKey: 'quiz.q0.question',  optionKeys: ['quiz.q0.opt0', 'quiz.q0.opt1', 'quiz.q0.opt2', 'quiz.q0.opt3'],  correct: 0 },
  { id: 'q1',  questionKey: 'quiz.q1.question',  optionKeys: ['quiz.q1.opt0', 'quiz.q1.opt1', 'quiz.q1.opt2', 'quiz.q1.opt3'],  correct: 1 },
  { id: 'q2',  questionKey: 'quiz.q2.question',  optionKeys: ['quiz.q2.opt0', 'quiz.q2.opt1', 'quiz.q2.opt2', 'quiz.q2.opt3'],  correct: 1 },
  { id: 'q3',  questionKey: 'quiz.q3.question',  optionKeys: ['quiz.q3.opt0', 'quiz.q3.opt1', 'quiz.q3.opt2', 'quiz.q3.opt3'],  correct: 1 },
  { id: 'q4',  questionKey: 'quiz.q4.question',  optionKeys: ['quiz.q4.opt0', 'quiz.q4.opt1', 'quiz.q4.opt2', 'quiz.q4.opt3'],  correct: 1 },
  { id: 'q5',  questionKey: 'quiz.q5.question',  optionKeys: ['quiz.q5.opt0', 'quiz.q5.opt1', 'quiz.q5.opt2', 'quiz.q5.opt3'],  correct: 1 },
  { id: 'q6',  questionKey: 'quiz.q6.question',  optionKeys: ['quiz.q6.opt0', 'quiz.q6.opt1', 'quiz.q6.opt2', 'quiz.q6.opt3'],  correct: 1 },
  { id: 'q7',  questionKey: 'quiz.q7.question',  optionKeys: ['quiz.q7.opt0', 'quiz.q7.opt1', 'quiz.q7.opt2', 'quiz.q7.opt3'],  correct: 1 },
  { id: 'q8',  questionKey: 'quiz.q8.question',  optionKeys: ['quiz.q8.opt0', 'quiz.q8.opt1', 'quiz.q8.opt2', 'quiz.q8.opt3'],  correct: 1 },
  { id: 'q9',  questionKey: 'quiz.q9.question',  optionKeys: ['quiz.q9.opt0', 'quiz.q9.opt1', 'quiz.q9.opt2', 'quiz.q9.opt3'],  correct: 1 },
  { id: 'q10', questionKey: 'quiz.q10.question', optionKeys: ['quiz.q10.opt0', 'quiz.q10.opt1', 'quiz.q10.opt2', 'quiz.q10.opt3'], correct: 1 },
  { id: 'q11', questionKey: 'quiz.q11.question', optionKeys: ['quiz.q11.opt0', 'quiz.q11.opt1', 'quiz.q11.opt2', 'quiz.q11.opt3'], correct: 1 },
  { id: 'q12', questionKey: 'quiz.q12.question', optionKeys: ['quiz.q12.opt0', 'quiz.q12.opt1', 'quiz.q12.opt2', 'quiz.q12.opt3'], correct: 1 },
  { id: 'q13', questionKey: 'quiz.q13.question', optionKeys: ['quiz.q13.opt0', 'quiz.q13.opt1', 'quiz.q13.opt2', 'quiz.q13.opt3'], correct: 1 },
  { id: 'q14', questionKey: 'quiz.q14.question', optionKeys: ['quiz.q14.opt0', 'quiz.q14.opt1', 'quiz.q14.opt2', 'quiz.q14.opt3'], correct: 1 },
];
