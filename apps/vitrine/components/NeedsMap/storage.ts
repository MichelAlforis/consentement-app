import type { Node, Edge } from '@xyflow/react';
import type { NeedNodeData, StrengthEdgeData, PersonNames, SavedMap } from './types';

const STORAGE_KEY = 'ouiclair-notre-carte-v1';

export function loadSavedMap(): SavedMap | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null;
    return parsed as SavedMap;
  } catch {
    return null;
  }
}

export function saveMap(personNames: PersonNames, nodes: Node<NeedNodeData>[], edges: Edge<StrengthEdgeData>[]) {
  try {
    const payload: SavedMap = {
      version: 1,
      personNames,
      nodes: nodes.map((n) => ({ id: n.id, position: n.position, data: n.data })),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, data: (e.data ?? { strength: 2 }) as StrengthEdgeData })),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // stockage indisponible (navigation privée, quota...) — on continue sans persister
  }
}

export function clearSavedMap() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignoré
  }
}

export function downloadMap(personNames: PersonNames, nodes: Node<NeedNodeData>[], edges: Edge<StrengthEdgeData>[]) {
  const payload: SavedMap = {
    version: 1,
    personNames,
    nodes: nodes.map((n) => ({ id: n.id, position: n.position, data: n.data })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, data: (e.data ?? { strength: 2 }) as StrengthEdgeData })),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notre-carte-des-besoins-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseImportedMap(raw: string): SavedMap | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges) || !parsed.personNames) {
      return null;
    }
    return parsed as SavedMap;
  } catch {
    return null;
  }
}
