import type { IconName } from '../utils/iconFromName';

export interface QuizQuestion {
  id: string;
  correctIndex: 0 | 1 | 2 | 3;
}

export interface LoiItem {
  id: string;
  iconName: IconName;
  important: boolean;
}

export const alcoolConsentQuiz: QuizQuestion[] = [
  { id: 'alcool-q1', correctIndex: 1 },
  { id: 'alcool-q2', correctIndex: 0 },
  { id: 'alcool-q3', correctIndex: 2 },
  { id: 'alcool-q4', correctIndex: 1 },
  { id: 'alcool-q5', correctIndex: 3 },
  { id: 'alcool-q6', correctIndex: 0 },
];

export const alcoolConsentLoiPoints: LoiItem[] = [
  { id: 'alcool-loi1', iconName: 'ShieldCheck', important: true },
  { id: 'alcool-loi2', iconName: 'Zap',         important: false },
  { id: 'alcool-loi3', iconName: 'Clock',        important: false },
  { id: 'alcool-loi4', iconName: 'Eye',          important: false },
  { id: 'alcool-loi5', iconName: 'Handshake',    important: false },
  { id: 'alcool-loi6', iconName: 'Lightbulb',    important: false },
];
