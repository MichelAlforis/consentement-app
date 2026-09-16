export type Owner = 'A' | 'B';
export type NodeKind = 'besoin' | 'capacite' | 'reponse';

export interface CarteNode {
  id: string;
  owner: Owner;
  kind: NodeKind;
  title: string;
  note: string;
  sat: number;
  sent?: number | null;
  x: number;
  y: number;
}

export interface CarteEdge {
  from: string;
  to: string;
}

export interface Manque {
  casse: string;
  plus: string;
  dit?: string;
  ditLock?: boolean;
  ditBy?: string;
}

export interface LogEntry {
  t: number;
  w: Owner | null;
  n: string;
  f: string;
  v: string | number;
}

export type View = { kind: 'map' } | { kind: 'node'; id: string } | { kind: 'edge'; i: number };

export interface CarteDoc {
  nodes: CarteNode[];
  edges: CarteEdge[];
  swapped: boolean;
  preambule: string;
  engA: string[];
  engB: string[];
  signA: string;
  signB: string;
  profilA: string;
  profilB: string;
  travailA: string[];
  travailB: string[];
  alertes: string[];
  rouges: string[];
  manques: Record<string, Manque>;
  log: LogEntry[];
}

export interface CarteState extends CarteDoc {
  me: Owner | null;
  view: View;
  linking: string | null;
  pickSource: boolean;
  drag: { id: string; dx: number; dy: number; sx: number; sy: number } | null;
  zoom: 'fit' | 'full';
  drafts: Record<string, string>;
  lastAdded: string | null;
  wig: boolean;
  fx: boolean;
  saveMsg: string;
  frameW: number;
}
