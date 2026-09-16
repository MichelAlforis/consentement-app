import type { CarteDoc, CarteEdge, CarteNode, LogEntry, Manque } from './types';

const changed = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b);

/**
 * Fusionne un tableau identifié par id à partir d'une base commune (le dernier
 * état connu des deux côtés). Un élément non modifié localement depuis la base
 * cède la place à la version serveur ; sinon la version locale l'emporte.
 * Une suppression n'est respectée que si l'autre côté n'a pas, entre-temps,
 * modifié le même élément (l'écriture l'emporte toujours sur la suppression,
 * pour ne jamais faire disparaître silencieusement ce que quelqu'un a écrit).
 */
function mergeArrayById<T extends { id: string }>(baseline: T[], local: T[], server: T[]): T[] {
  const baseMap = new Map(baseline.map((x) => [x.id, x]));
  const localMap = new Map(local.map((x) => [x.id, x]));
  const serverMap = new Map(server.map((x) => [x.id, x]));
  const ids = new Set<string>([...localMap.keys(), ...serverMap.keys()]);
  const merged = new Map<string, T>();

  ids.forEach((id) => {
    const b = baseMap.get(id);
    const l = localMap.get(id);
    const s = serverMap.get(id);
    if (l && s) {
      merged.set(id, changed(b, l) ? l : s);
    } else if (l && !s) {
      if (!b || changed(b, l)) merged.set(id, l); // nouveau, ou modifié après suppression distante
    } else if (!l && s) {
      if (!b || changed(b, s)) merged.set(id, s); // nouveau, ou modifié après ma suppression
    }
  });

  const order = local.map((x) => x.id).concat(server.map((x) => x.id).filter((id) => !localMap.has(id)));
  const seen = new Set<string>();
  const out: T[] = [];
  order.forEach((id) => {
    if (seen.has(id) || !merged.has(id)) return;
    seen.add(id);
    out.push(merged.get(id)!);
  });
  return out;
}

/** Une fois « ce que l'autre en dit » verrouillé, le verrou gagne toujours. */
function mergeManques(baseline: Record<string, Manque>, local: Record<string, Manque>, server: Record<string, Manque>): Record<string, Manque> {
  const ids = new Set([...Object.keys(local), ...Object.keys(server)]);
  const out: Record<string, Manque> = {};
  ids.forEach((id) => {
    const b = baseline[id];
    const l = local[id];
    const s = server[id];
    if (l && s) {
      if (s.ditLock && !l.ditLock) { out[id] = s; return; }
      if (l.ditLock && !s.ditLock) { out[id] = l; return; }
      out[id] = changed(b, l) ? l : s;
    } else {
      out[id] = l ?? s;
    }
  });
  return out;
}

/** Union des deux historiques (jamais un remplacement) : personne ne perd ses lignes. */
function mergeLog(local: LogEntry[], server: LogEntry[]): LogEntry[] {
  const key = (l: LogEntry) => `${l.t}|${l.w}|${l.n}|${l.f}`;
  const byKey = new Map<string, LogEntry>();
  [...server, ...local].forEach((l) => byKey.set(key(l), l));
  return Array.from(byKey.values())
    .sort((a, b) => a.t - b.t)
    .slice(-400);
}

function mergeField<T>(baseline: T, local: T, server: T): T {
  return changed(baseline, local) ? local : server;
}

/** Fusionne trois versions d'un même document à partir d'une base commune. */
export function mergeDocs(baseline: CarteDoc, local: CarteDoc, server: CarteDoc): CarteDoc {
  return {
    nodes: mergeArrayById<CarteNode>(baseline.nodes, local.nodes, server.nodes),
    edges: mergeArrayById<CarteEdge>(baseline.edges, local.edges, server.edges),
    manques: mergeManques(baseline.manques, local.manques, server.manques),
    log: mergeLog(local.log, server.log),
    swapped: mergeField(baseline.swapped, local.swapped, server.swapped),
    preambule: mergeField(baseline.preambule, local.preambule, server.preambule),
    engA: mergeField(baseline.engA, local.engA, server.engA),
    engB: mergeField(baseline.engB, local.engB, server.engB),
    signA: mergeField(baseline.signA, local.signA, server.signA),
    signB: mergeField(baseline.signB, local.signB, server.signB),
    profilA: mergeField(baseline.profilA, local.profilA, server.profilA),
    profilB: mergeField(baseline.profilB, local.profilB, server.profilB),
    travailA: mergeField(baseline.travailA, local.travailA, server.travailA),
    travailB: mergeField(baseline.travailB, local.travailB, server.travailB),
    alertes: mergeField(baseline.alertes, local.alertes, server.alertes),
    rouges: mergeField(baseline.rouges, local.rouges, server.rouges),
  };
}
