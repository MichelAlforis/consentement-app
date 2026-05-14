import type { TopicId } from './topicRegistry';

export interface LexiqueEntry {
  id: string;
  niveau: 'debutant' | 'intermediaire' | 'expert';
  categorie: 'juridique' | 'pratique' | 'emotionnel' | 'medical';
  palier: 1 | 2 | 3;
  rarity: 'common' | 'rare' | 'unique';
  /** Lien vers TOPIC_REGISTRY — absent si aucun topic associé */
  topicId?: TopicId;
}

export const lexiqueConsentEntries: LexiqueEntry[] = [
  // ── Palier 1 — heat-1 (débutant) ─────────────────────────────────────────
  { id: 'lex-001', niveau: 'debutant',      categorie: 'juridique',  palier: 1, rarity: 'common', topicId: 'topic-lex-001' }, // Consentement
  { id: 'lex-002', niveau: 'debutant',      categorie: 'pratique',   palier: 1, rarity: 'common', topicId: 'topic-lex-002' }, // Refus
  { id: 'lex-003', niveau: 'debutant',      categorie: 'pratique',   palier: 1, rarity: 'rare',   topicId: 'topic-lex-003' }, // Safeword
  { id: 'lex-004', niveau: 'debutant',      categorie: 'emotionnel', palier: 1, rarity: 'rare',   topicId: 'topic-lex-004' }, // Limites personnelles
  { id: 'lex-005', niveau: 'debutant',      categorie: 'juridique',  palier: 1, rarity: 'common', topicId: 'topic-lex-005' }, // Viol
  { id: 'lex-006', niveau: 'debutant',      categorie: 'juridique',  palier: 1, rarity: 'common', topicId: 'topic-lex-006' }, // Agression sexuelle
  { id: 'lex-007', niveau: 'debutant',      categorie: 'emotionnel', palier: 1, rarity: 'rare',   topicId: 'topic-lex-007' }, // Pression
  { id: 'lex-008', niveau: 'debutant',      categorie: 'pratique',   palier: 1, rarity: 'common', topicId: 'topic-lex-008' }, // Communication
  { id: 'lex-009', niveau: 'debutant',      categorie: 'emotionnel', palier: 1, rarity: 'rare',   topicId: 'topic-lex-009' }, // Confiance
  // ── Palier 2 — heat-2 (intermédiaire) ────────────────────────────────────
  { id: 'lex-010', niveau: 'intermediaire', categorie: 'juridique',  palier: 2, rarity: 'common', topicId: 'topic-lex-010' }, // Coercition
  { id: 'lex-011', niveau: 'intermediaire', categorie: 'emotionnel', palier: 2, rarity: 'rare',   topicId: 'topic-lex-011' }, // Manipulation
  { id: 'lex-012', niveau: 'intermediaire', categorie: 'juridique',  palier: 2, rarity: 'common', topicId: 'topic-lex-012' }, // Harcèlement sexuel
  { id: 'lex-013', niveau: 'intermediaire', categorie: 'pratique',   palier: 2, rarity: 'rare',   topicId: 'topic-lex-013' }, // Consentement enthousiaste
  { id: 'lex-014', niveau: 'intermediaire', categorie: 'pratique',   palier: 2, rarity: 'unique', topicId: 'topic-lex-014' }, // Révocabilité
  { id: 'lex-015', niveau: 'intermediaire', categorie: 'emotionnel', palier: 2, rarity: 'rare',   topicId: 'topic-lex-015' }, // Vulnérabilité
  { id: 'lex-016', niveau: 'intermediaire', categorie: 'juridique',  palier: 2, rarity: 'common', topicId: 'topic-lex-016' }, // Consentement éclairé
  // ── Palier 3 — heat-3 (expert) ────────────────────────────────────────────
  { id: 'lex-017', niveau: 'expert',        categorie: 'pratique',   palier: 3, rarity: 'unique', topicId: 'topic-lex-017' }, // Zone grise
  { id: 'lex-018', niveau: 'expert',        categorie: 'emotionnel', palier: 3, rarity: 'rare',   topicId: 'topic-lex-018' }, // Dynamique de pouvoir
  { id: 'lex-019', niveau: 'expert',        categorie: 'medical',    palier: 3, rarity: 'common', topicId: 'topic-lex-019' }, // Consentement informé
  { id: 'lex-020', niveau: 'expert',        categorie: 'juridique',  palier: 3, rarity: 'unique', topicId: 'topic-lex-020' }, // Délai de prescription
];
