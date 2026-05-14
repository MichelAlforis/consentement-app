import type { EffectiveModuleId } from '../modules';

export type TopicId = string;

export type PreferenceAnswer =
  | 'curious'           // Curieux·se
  | 'comfortable'       // À l'aise
  | 'not-for-me'        // Pas pour moi
  | 'want-to-explore'   // Je veux explorer
  | 'no-comment';       // Je préfère ne pas répondre

export const POSITIVE_ANSWERS: ReadonlySet<PreferenceAnswer> = new Set([
  'curious',
  'comfortable',
  'want-to-explore',
]);

export interface TopicDefinition {
  id: TopicId;
  moduleGate: EffectiveModuleId;
  /** ID dans lexiqueConsentEntries — absent pour les topics pratiques */
  lexiqueTermId?: string;
  /** true = une question "comment tu te sens" apparaît dans MoiScreen */
  hasPreferenceQuestion: boolean;
  /** pts chaleur crédités quand la préférence est donnée */
  heatOnPreference: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Registre
// ─────────────────────────────────────────────────────────────────────────────

export const TOPIC_REGISTRY: TopicDefinition[] = [

  // ── Pratiques de base (gate: pratiques-base) ──────────────────────────────
  // Ces topics génèrent des questions Moi — pas encore de terme lexique associé
  { id: 'topic-fellation',             moduleGate: 'pratiques-base', hasPreferenceQuestion: true,  heatOnPreference: 1 },
  { id: 'topic-cunnilingus',           moduleGate: 'pratiques-base', hasPreferenceQuestion: true,  heatOnPreference: 1 },
  { id: 'topic-masturbation-mutuelle', moduleGate: 'pratiques-base', hasPreferenceQuestion: true,  heatOnPreference: 1 },
  { id: 'topic-penetration',           moduleGate: 'pratiques-base', hasPreferenceQuestion: true,  heatOnPreference: 1 },
  { id: 'topic-sodomie',               moduleGate: 'pratiques-base', hasPreferenceQuestion: true,  heatOnPreference: 1 },

  // ── Lexique consentement — palier 1 (gate: quiz-consentement) ────────────
  { id: 'topic-lex-001', moduleGate: 'quiz-consentement', lexiqueTermId: 'lex-001', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Consentement
  { id: 'topic-lex-002', moduleGate: 'quiz-consentement', lexiqueTermId: 'lex-002', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Refus
  { id: 'topic-lex-003', moduleGate: 'quiz-consentement', lexiqueTermId: 'lex-003', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Safeword
  { id: 'topic-lex-004', moduleGate: 'quiz-consentement', lexiqueTermId: 'lex-004', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Limites personnelles
  { id: 'topic-lex-007', moduleGate: 'quiz-consentement', lexiqueTermId: 'lex-007', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Pression
  { id: 'topic-lex-008', moduleGate: 'quiz-consentement', lexiqueTermId: 'lex-008', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Communication
  { id: 'topic-lex-009', moduleGate: 'quiz-consentement', lexiqueTermId: 'lex-009', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Confiance

  // ── Lexique consentement — palier 1 (gate: loi-consentement) ─────────────
  { id: 'topic-lex-005', moduleGate: 'loi-consentement', lexiqueTermId: 'lex-005', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Viol
  { id: 'topic-lex-006', moduleGate: 'loi-consentement', lexiqueTermId: 'lex-006', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Agression sexuelle

  // ── Lexique consentement — palier 2 (gate: loi-consentement) ─────────────
  { id: 'topic-lex-010', moduleGate: 'loi-consentement', lexiqueTermId: 'lex-010', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Coercition
  { id: 'topic-lex-011', moduleGate: 'loi-consentement', lexiqueTermId: 'lex-011', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Manipulation
  { id: 'topic-lex-012', moduleGate: 'loi-consentement', lexiqueTermId: 'lex-012', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Harcèlement sexuel
  { id: 'topic-lex-013', moduleGate: 'loi-consentement', lexiqueTermId: 'lex-013', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Consentement enthousiaste
  { id: 'topic-lex-014', moduleGate: 'loi-consentement', lexiqueTermId: 'lex-014', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Révocabilité
  { id: 'topic-lex-015', moduleGate: 'loi-consentement', lexiqueTermId: 'lex-015', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Vulnérabilité
  { id: 'topic-lex-016', moduleGate: 'loi-consentement', lexiqueTermId: 'lex-016', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Consentement éclairé

  // ── Lexique consentement — palier 3 (gate: scenarios-quotidiens) ──────────
  { id: 'topic-lex-017', moduleGate: 'scenarios-quotidiens', lexiqueTermId: 'lex-017', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Zone grise
  { id: 'topic-lex-018', moduleGate: 'loi-consentement',     lexiqueTermId: 'lex-018', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Dynamique de pouvoir
  { id: 'topic-lex-019', moduleGate: 'loi-consentement',     lexiqueTermId: 'lex-019', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Consentement informé
  { id: 'topic-lex-020', moduleGate: 'loi-consentement',     lexiqueTermId: 'lex-020', hasPreferenceQuestion: false, heatOnPreference: 0 }, // Délai de prescription

  // ── Pratiques divergentes (gate: à créer) ─────────────────────────────────
  // { id: 'topic-voyeurisme',     moduleGate: 'pratiques-divergentes', hasPreferenceQuestion: true, heatOnPreference: 1 },
  // { id: 'topic-exhibitionnisme', moduleGate: 'pratiques-divergentes', hasPreferenceQuestion: true, heatOnPreference: 1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// API interne — les écrans et stores n'accèdent PAS au tableau directement
// ─────────────────────────────────────────────────────────────────────────────

const _byId: Record<TopicId, TopicDefinition> =
  Object.fromEntries(TOPIC_REGISTRY.map((t) => [t.id, t]));

const _byLexiqueTermId: Record<string, TopicDefinition> =
  Object.fromEntries(
    TOPIC_REGISTRY.filter((t) => t.lexiqueTermId != null)
      .map((t) => [t.lexiqueTermId!, t])
  );

const _byModuleGate: Record<string, TopicDefinition[]> =
  TOPIC_REGISTRY.reduce<Record<string, TopicDefinition[]>>((acc, t) => {
    (acc[t.moduleGate] ??= []).push(t);
    return acc;
  }, {});

export function getTopicById(id: TopicId): TopicDefinition | undefined {
  return _byId[id];
}

export function getTopicByLexiqueTermId(termId: string): TopicDefinition | undefined {
  return _byLexiqueTermId[termId];
}

export function getTopicsByModuleGate(moduleId: string): TopicDefinition[] {
  return _byModuleGate[moduleId] ?? [];
}

/** Topics dont le moduleGate figure dans completedModules */
export function getAvailableTopics(completedModules: string[]): TopicDefinition[] {
  const done = new Set(completedModules);
  return TOPIC_REGISTRY.filter((t) => done.has(t.moduleGate));
}

/** Topics disponibles qui ont une question préférence (pour MoiScreen) */
export function getPreferenceTopics(completedModules: string[]): TopicDefinition[] {
  return getAvailableTopics(completedModules).filter((t) => t.hasPreferenceQuestion);
}
