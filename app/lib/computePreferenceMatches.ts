import { POSITIVE_ANSWERS } from '../data/topicRegistry';
import type { TopicId, PreferenceAnswer } from '../data/topicRegistry';

/**
 * Retourne les topicIds où les deux partenaires ont une réponse positive.
 * Toutes les non-réponses (not-for-me, no-comment, absent) restent privées
 * et indiscernables — seuls les matches positifs sont révélés.
 */
export function computePreferenceMatches(
  myAnswers: Record<string, PreferenceAnswer>,
  partnerAnswers: Record<string, string> | undefined,
): TopicId[] {
  if (!partnerAnswers) return [];
  return Object.keys(myAnswers).filter((id) =>
    POSITIVE_ANSWERS.has(myAnswers[id]) &&
    POSITIVE_ANSWERS.has(partnerAnswers[id] as PreferenceAnswer)
  );
}
