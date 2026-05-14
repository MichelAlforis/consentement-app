export interface LexiqueEntry {
  id: string;
  niveau: 'debutant' | 'intermediaire' | 'expert';
  categorie: 'juridique' | 'pratique' | 'emotionnel' | 'medical';
}

export const lexiqueConsentEntries: LexiqueEntry[] = [
  { id: 'lex-001', niveau: 'debutant',      categorie: 'juridique'   },
  { id: 'lex-002', niveau: 'debutant',      categorie: 'pratique'    },
  { id: 'lex-003', niveau: 'debutant',      categorie: 'pratique'    },
  { id: 'lex-004', niveau: 'debutant',      categorie: 'emotionnel'  },
  { id: 'lex-005', niveau: 'debutant',      categorie: 'juridique'   },
  { id: 'lex-006', niveau: 'debutant',      categorie: 'juridique'   },
  { id: 'lex-007', niveau: 'debutant',      categorie: 'emotionnel'  },
  { id: 'lex-008', niveau: 'debutant',      categorie: 'pratique'    },
  { id: 'lex-009', niveau: 'debutant',      categorie: 'emotionnel'  },
  { id: 'lex-010', niveau: 'intermediaire', categorie: 'juridique'   },
  { id: 'lex-011', niveau: 'intermediaire', categorie: 'emotionnel'  },
  { id: 'lex-012', niveau: 'intermediaire', categorie: 'juridique'   },
  { id: 'lex-013', niveau: 'intermediaire', categorie: 'pratique'    },
  { id: 'lex-014', niveau: 'intermediaire', categorie: 'pratique'    },
  { id: 'lex-015', niveau: 'intermediaire', categorie: 'emotionnel'  },
  { id: 'lex-016', niveau: 'intermediaire', categorie: 'juridique'   },
  { id: 'lex-017', niveau: 'expert',        categorie: 'pratique'    },
  { id: 'lex-018', niveau: 'expert',        categorie: 'emotionnel'  },
  { id: 'lex-019', niveau: 'expert',        categorie: 'medical'     },
  { id: 'lex-020', niveau: 'expert',        categorie: 'juridique'   },
];
