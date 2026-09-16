import type { Node, Edge } from '@xyflow/react';
import type { NeedNodeData, StrengthEdgeData, PersonNames } from './types';

export const DEFAULT_PERSON_NAMES: PersonNames = { A: 'Personne A', B: 'Personne B' };

export const SEED_NODES: Node<NeedNodeData>[] = [
  {
    id: 'a1',
    type: 'need',
    position: { x: 40, y: 60 },
    data: { label: 'Besoin (exemple)', person: 'A', note: "Clique sur ce nœud pour le renommer et préciser ce besoin.", satisfaction: 50 },
  },
  {
    id: 'a2',
    type: 'need',
    position: { x: 40, y: 280 },
    data: { label: 'Autre besoin', person: 'A', note: '', satisfaction: 50 },
  },
  {
    id: 'b1',
    type: 'need',
    position: { x: 520, y: 60 },
    data: { label: 'Besoin (exemple)', person: 'B', note: '', satisfaction: 50 },
  },
  {
    id: 'b2',
    type: 'need',
    position: { x: 520, y: 280 },
    data: { label: 'Autre besoin', person: 'B', note: '', satisfaction: 50 },
  },
];

export const SEED_EDGES: Edge<StrengthEdgeData>[] = [
  {
    id: 'a1-b1',
    source: 'a1',
    target: 'b1',
    type: 'strength',
    data: { strength: 3 },
  },
  {
    id: 'b2-a2',
    source: 'b2',
    target: 'a2',
    type: 'strength',
    data: { strength: 2 },
  },
];
