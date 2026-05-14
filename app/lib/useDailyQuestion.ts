import { useMemo } from 'react';

const QUESTION_COUNT = 15;

/** Retourne un index stable pour la journée (change à minuit) */
function getDailyIndex(): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % QUESTION_COUNT;
}

/**
 * Retourne la clé i18n de la question du jour.
 * Ex : 'dailyQ.q3'
 */
export function useDailyQuestion(): string {
  return useMemo(() => `dailyQ.q${getDailyIndex()}`, []);
}
