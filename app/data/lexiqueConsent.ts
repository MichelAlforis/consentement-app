export interface LexiqueEntry {
  id: string;
  niveau: 'debutant' | 'intermediaire' | 'expert';
  categorie: 'juridique' | 'pratique' | 'emotionnel' | 'medical';
  palier: 1 | 2 | 3;
  rarity: 'common' | 'rare' | 'unique';
}

export const lexiqueConsentEntries: LexiqueEntry[] = [
  // ── Palier 1 — heat-1 (débutant) ─────────────────────────────────────────
  { id: 'lex-001', niveau: 'debutant',      categorie: 'juridique',  palier: 1, rarity: 'common' },
  { id: 'lex-002', niveau: 'debutant',      categorie: 'pratique',   palier: 1, rarity: 'common' },
  { id: 'lex-003', niveau: 'debutant',      categorie: 'pratique',   palier: 1, rarity: 'rare'   },
  { id: 'lex-004', niveau: 'debutant',      categorie: 'emotionnel', palier: 1, rarity: 'rare'   },
  { id: 'lex-005', niveau: 'debutant',      categorie: 'juridique',  palier: 1, rarity: 'common' },
  { id: 'lex-006', niveau: 'debutant',      categorie: 'juridique',  palier: 1, rarity: 'common' },
  { id: 'lex-007', niveau: 'debutant',      categorie: 'emotionnel', palier: 1, rarity: 'rare'   },
  { id: 'lex-008', niveau: 'debutant',      categorie: 'pratique',   palier: 1, rarity: 'common' },
  { id: 'lex-009', niveau: 'debutant',      categorie: 'emotionnel', palier: 1, rarity: 'rare'   },
  // ── Palier 2 — heat-2 (intermédiaire) ────────────────────────────────────
  { id: 'lex-010', niveau: 'intermediaire', categorie: 'juridique',  palier: 2, rarity: 'common' },
  { id: 'lex-011', niveau: 'intermediaire', categorie: 'emotionnel', palier: 2, rarity: 'rare'   },
  { id: 'lex-012', niveau: 'intermediaire', categorie: 'juridique',  palier: 2, rarity: 'common' },
  { id: 'lex-013', niveau: 'intermediaire', categorie: 'pratique',   palier: 2, rarity: 'rare'   },
  { id: 'lex-014', niveau: 'intermediaire', categorie: 'pratique',   palier: 2, rarity: 'unique' },
  { id: 'lex-015', niveau: 'intermediaire', categorie: 'emotionnel', palier: 2, rarity: 'rare'   },
  { id: 'lex-016', niveau: 'intermediaire', categorie: 'juridique',  palier: 2, rarity: 'common' },
  // ── Palier 3 — heat-3 (expert) ────────────────────────────────────────────
  { id: 'lex-017', niveau: 'expert',        categorie: 'pratique',   palier: 3, rarity: 'unique' },
  { id: 'lex-018', niveau: 'expert',        categorie: 'emotionnel', palier: 3, rarity: 'rare'   },
  { id: 'lex-019', niveau: 'expert',        categorie: 'medical',    palier: 3, rarity: 'common' },
  { id: 'lex-020', niveau: 'expert',        categorie: 'juridique',  palier: 3, rarity: 'unique' },
];
