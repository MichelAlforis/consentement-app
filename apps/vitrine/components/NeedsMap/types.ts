export type PersonKey = 'A' | 'B';

export interface NeedNodeData {
  [key: string]: unknown;
  label: string;
  person: PersonKey;
  note: string;
  /** 0-100 : à quel point ce besoin est comblé en ce moment, de l'avis de la personne concernée. */
  satisfaction: number;
  /** injecté au rendu, dérivé des liens entrants — pas persisté */
  incomingSupport?: number | null;
  /** injecté au rendu depuis personNames — pas persisté */
  personName?: string;
}

export interface StrengthEdgeData {
  [key: string]: unknown;
  /** 1 = lien faible, 2 = moyen, 3 = fort */
  strength: 1 | 2 | 3;
  label?: string;
  /** injecté au rendu depuis le nœud source — pas persisté */
  sourceSatisfaction?: number;
}

export interface PersonNames {
  A: string;
  B: string;
}

export interface SavedMap {
  version: 1;
  personNames: PersonNames;
  nodes: { id: string; position: { x: number; y: number }; data: NeedNodeData }[];
  edges: { id: string; source: string; target: string; data: StrengthEdgeData }[];
}
