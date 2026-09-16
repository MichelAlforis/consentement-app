'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CANVAS_H, CANVAS_W, FIELD_LABELS, NODE_H, NODE_W } from './constants';
import { edgeGeom } from './geometry';
import { mergeDocs } from './merge';
import { currentOwner, fetchDoc, loginAs, ownerName, pb, saveDoc } from './pb';
import { buildSeedDoc } from './seed';
import type { CarteDoc, CarteNode, CarteState, LogEntry, Manque, Owner, View } from './types';

function docFromState(s: CarteState): CarteDoc {
  return {
    nodes: s.nodes,
    edges: s.edges,
    swapped: s.swapped,
    preambule: s.preambule,
    engA: s.engA,
    engB: s.engB,
    signA: s.signA,
    signB: s.signB,
    profilA: s.profilA,
    profilB: s.profilB,
    travailA: s.travailA,
    travailB: s.travailB,
    alertes: s.alertes,
    rouges: s.rouges,
    manques: s.manques,
    log: s.log,
  };
}

function parseHash(): View {
  const h = (typeof window !== 'undefined' ? window.location.hash || '' : '').replace(/^#/, '');
  if (h.indexOf('besoin-') === 0) return { kind: 'node', id: h.slice(7) };
  if (h.indexOf('lien-') === 0) return { kind: 'edge', id: h.slice(5) };
  if (h === 'moi-A' || h === 'moi-B') return { kind: 'person', who: h.slice(4) as Owner };
  if (h === 'aide') return { kind: 'help' };
  return { kind: 'map' };
}

const startsWithVowel = (s: string) => /^[aeiouyéèêAEIOUYÉÈÊ]/.test(s);
const elide = (name: string) => (startsWithVowel(name) ? `d'${name}` : `de ${name}`);

const INITIAL_DOC = buildSeedDoc();

function initialState(): CarteState {
  return {
    ...INITIAL_DOC,
    // Lecture synchrone : le composant n'est jamais rendu côté serveur
    // (chargé via un import dynamique ssr:false), donc pas de risque d'hydratation.
    me: pb.authStore.isValid ? currentOwner() : null,
    view: parseHash(),
    linking: null,
    pickSource: false,
    drag: null,
    zoom: typeof window !== 'undefined' && window.innerWidth < 768 ? 'full' : 'fit',
    drafts: {},
    lastAdded: null,
    wig: false,
    fx: false,
    saveMsg: '',
    frameW: 0,
    syncStatus: 'idle',
  };
}

export function useNotreCarte() {
  const [state, setState] = useState<CarteState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const docIdRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  const skipNextSaveRef = useRef(false);
  // Dernière version confirmée en commun avec le serveur : la base à partir
  // de laquelle on détecte "qu'est-ce que j'ai changé localement" pour fusionner
  // proprement avec ce que l'autre a pu écrire entre-temps.
  const baselineRef = useRef<CarteDoc | null>(null);
  const draggedRef = useRef(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const scalerRef = useRef<HTMLDivElement | null>(null);
  const focusEdgeRef = useRef<string | null>(null);
  const syncIdleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    stateRef.current = state;
  });

  const set = useCallback((patch: Partial<CarteState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const logged = useCallback((patch: Partial<CarteState>, target: string, field: string, value: string | number): Partial<CarteState> => {
    const st = stateRef.current;
    // Un champ vidé ne produit pas de ligne d'historique vide.
    if (typeof value === 'string' && !value.trim() && field !== 'lien' && field !== 'signe') return patch;
    const log = (st.log || []).slice();
    const now = Date.now();
    const last = log[log.length - 1];
    const val = typeof value === 'string' ? value.slice(0, 120) : value;
    if (last && last.n === target && last.f === field && last.w === st.me && now - last.t < 120000) {
      log[log.length - 1] = { ...last, t: now, v: val };
    } else {
      log.push({ t: now, w: st.me, n: target, f: field, v: val });
    }
    if (log.length > 400) log.splice(0, log.length - 400);
    return { ...patch, log };
  }, []);

  const setLogged = useCallback(
    (patch: Partial<CarteState>, target: string, field: string, value: string | number) => {
      set(logged(patch, target, field, value));
    },
    [logged, set]
  );

  // ── Identité ────────────────────────────────────────────────────────────
  const pickIdentity = useCallback(
    async (owner: Owner) => {
      await loginAs(owner);
      set({ me: owner });
    },
    [set]
  );

  const switchIdentity = useCallback(() => {
    set({ me: null });
  }, [set]);

  // ── Chargement + sauvegarde du document partagé ────────────────────────
  useEffect(() => {
    if (!state.me || loaded) return;
    let cancelled = false;
    (async () => {
      const found = await fetchDoc();
      if (cancelled) return;
      if (found) {
        docIdRef.current = found.id;
        baselineRef.current = found.doc;
        skipNextSaveRef.current = true;
        set(found.doc);
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [state.me, loaded, set]);

  useEffect(() => {
    if (!loaded || !docIdRef.current) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    const timer = setTimeout(async () => {
      const id = docIdRef.current;
      const baseline = baselineRef.current;
      if (!id || !baseline) return;
      clearTimeout(syncIdleTimerRef.current);
      set({ syncStatus: 'saving' });
      const localDoc = docFromState(stateRef.current);
      let toSave = localDoc;
      let ok = true;
      try {
        const fresh = await fetchDoc();
        if (fresh) toSave = mergeDocs(baseline, localDoc, fresh.doc);
      } catch {
        // hors-ligne ou requête échouée : on sauvegarde quand même notre version locale
      }
      await saveDoc(id, toSave).catch(() => {
        ok = false;
      });
      // Ce qui a pu être tapé pendant l'aller-retour réseau ne doit jamais être
      // écrasé par le résultat (devenu entre-temps périmé) qu'on s'apprêtait à écrire.
      const finalLocal = docFromState(stateRef.current);
      const finalMerged = mergeDocs(baseline, finalLocal, toSave);
      baselineRef.current = toSave;
      const stillDirty = JSON.stringify(finalMerged) !== JSON.stringify(toSave);
      skipNextSaveRef.current = !stillDirty;
      set({ ...finalMerged, syncStatus: ok ? 'synced' : 'idle' });
      if (ok) syncIdleTimerRef.current = setTimeout(() => set({ syncStatus: 'idle' }), 1800);
    }, 500);
    return () => clearTimeout(timer);
  }, [
    loaded,
    state.nodes,
    state.edges,
    state.swapped,
    state.preambule,
    state.engA,
    state.engB,
    state.signA,
    state.signB,
    state.profilA,
    state.profilB,
    state.travailA,
    state.travailB,
    state.alertes,
    state.rouges,
    state.manques,
    state.log,
    set,
  ]);

  // ── Synchro temps réel (l'autre a modifié la carte) ────────────────────
  useEffect(() => {
    if (!loaded || !docIdRef.current) return;
    const id = docIdRef.current;
    let unsub: (() => void) | undefined;
    pb.collection('notre_carte_docs')
      .subscribe(id, (e) => {
        if (e.action !== 'update') return;
        const server = e.record.doc as CarteDoc;
        const baseline = baselineRef.current;
        const merged = baseline ? mergeDocs(baseline, docFromState(stateRef.current), server) : server;
        baselineRef.current = merged;
        skipNextSaveRef.current = true;
        set(merged);
      })
      .then((fn) => {
        unsub = fn;
      })
      .catch(() => {});
    return () => {
      unsub?.();
    };
  }, [loaded, set]);

  // ── Routage par hash ─────────────────────────────────────────────────────
  useEffect(() => {
    const onRoute = () => set({ view: parseHash() });
    window.addEventListener('hashchange', onRoute);
    window.addEventListener('popstate', onRoute);
    return () => {
      window.removeEventListener('hashchange', onRoute);
      window.removeEventListener('popstate', onRoute);
    };
  }, [set]);

  const go = useCallback((view: View, hash: string) => {
    try {
      window.history.pushState(null, '', hash ? '#' + hash : window.location.pathname + window.location.search);
    } catch {
      // ignoré
    }
    set({ view, linking: null });
    window.scrollTo(0, 0);
  }, [set]);

  const goNode = useCallback((id: string) => go({ kind: 'node', id }, 'besoin-' + id), [go]);
  const goEdge = useCallback((id: string) => go({ kind: 'edge', id }, 'lien-' + id), [go]);
  const goPerson = useCallback((who: Owner) => go({ kind: 'person', who }, 'moi-' + who), [go]);
  const goHelp = useCallback(() => go({ kind: 'help' }, 'aide'), [go]);
  const goMap = useCallback(() => go({ kind: 'map' }, ''), [go]);

  // ── Petites animations de feedback ──────────────────────────────────────
  const burstTimers = useRef<{ fx?: ReturnType<typeof setTimeout>; msg?: ReturnType<typeof setTimeout> }>({});
  const burst = useCallback(
    (msg: string) => {
      set({ fx: false });
      clearTimeout(burstTimers.current.fx);
      clearTimeout(burstTimers.current.msg);
      setTimeout(() => set({ fx: true, saveMsg: msg }), 20);
      burstTimers.current.fx = setTimeout(() => set({ fx: false }), 1300);
      burstTimers.current.msg = setTimeout(() => set({ saveMsg: '' }), 2700);
    },
    [set]
  );

  const flashWig = useCallback(() => {
    set({ wig: true });
    setTimeout(() => set({ wig: false }), 680);
  }, [set]);

  // ── Glisser-déposer des nœuds ────────────────────────────────────────────
  const scale = useCallback(() => {
    const st = stateRef.current;
    if (st.zoom === 'full') return 1;
    const w = st.frameW || CANVAS_W;
    return Math.min(1, Math.max(0.42, w / CANVAS_W));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = stateRef.current.drag;
      if (!d) return;
      const k = scale();
      if (Math.abs(e.clientX - d.sx) > 4 || Math.abs(e.clientY - d.sy) > 4) draggedRef.current = true;
      const nodes = stateRef.current.nodes.map((n) =>
        n.id === d.id
          ? { ...n, x: Math.max(0, Math.min(CANVAS_W - NODE_W, (e.clientX - d.dx) / k)), y: Math.max(0, Math.min(CANVAS_H - NODE_H, (e.clientY - d.dy) / k)) }
          : n
      );
      set({ nodes });
    };
    const onUp = () => {
      if (stateRef.current.drag) set({ drag: null });
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [scale, set]);

  const startDrag = useCallback(
    (node: CarteNode, e: React.PointerEvent) => {
      const st = stateRef.current;
      if (st.linking || st.pickSource) return;
      draggedRef.current = false;
      const k = scale();
      set({ drag: { id: node.id, dx: e.clientX - node.x * k, dy: e.clientY - node.y * k, sx: e.clientX, sy: e.clientY } });
    },
    [scale, set]
  );

  // ── Mesure du cadre (zoom "ajusté") ──────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      const w = frameRef.current ? frameRef.current.clientWidth : 0;
      if (w) set({ frameW: w });
    };
    measure();
    window.addEventListener('resize', measure);
    let ro: ResizeObserver | undefined;
    if (frameRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(frameRef.current);
    }
    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [set]);

  useEffect(() => {
    const el = scalerRef.current;
    if (!el) return;
    const k = scale();
    el.style.setProperty('--nc-k', k.toFixed(3));
    el.style.marginBottom = (CANVAS_H * k - CANVAS_H).toFixed(0) + 'px';
    el.style.marginRight = (CANVAS_W * k - CANVAS_W).toFixed(0) + 'px';
  });

  const name = useCallback((owner: Owner) => {
    const swap = stateRef.current.swapped;
    const base = ownerName(owner);
    const other = ownerName(owner === 'A' ? 'B' : 'A');
    return swap ? other : base;
  }, []);

  /**
   * Tant que l'autre n'a pas donné son « envoi déclaré », il ne voit pas ce
   * que le porteur perçoit — pour répondre sans se caler sur son chiffre.
   */
  const satHidden = useCallback(
    (node: { owner: Owner; sent?: number | null }) => state.me !== node.owner && node.sent == null,
    [state.me]
  );

  // Un besoin porte directement son propre niveau : plus de propagation
  // multi-sauts depuis la simplification "capacité/don" → contenu du lien.
  const levels = useMemo(() => {
    const lvl: Record<string, number> = {};
    state.nodes.forEach((n) => { lvl[n.id] = (n.sat || 0) / 100; });
    return lvl;
  }, [state.nodes]);

  // Ce qu'apporte le lien entrant le mieux nourri, en direct (plus de relais).
  const incoming = useMemo(() => {
    const inc: Record<string, number> = {};
    state.edges.forEach((e) => {
      const v = levels[e.from] == null ? 0 : levels[e.from];
      if (inc[e.to] == null || v > inc[e.to]) inc[e.to] = v;
    });
    return inc;
  }, [state.edges, levels]);

  const trendFor = useCallback(
    (nodeId: string, currentSat: number) => {
      const points = (state.log || [])
        .filter((l) => l.n === nodeId && l.f === 'sat' && typeof l.v === 'number')
        .map((l) => ({ t: l.t, v: l.v as number }));
      if (!points.length || points[points.length - 1].v !== currentSat) points.push({ t: Date.now(), v: currentSat });
      if (points.length < 2) return { has: false, curve: '', line: '' };
      const t0 = points[0].t;
      const span = points[points.length - 1].t - t0;
      const curve = points
        .map((p, i) => {
          const x = span > 0 ? ((p.t - t0) / span) * 100 : i * (100 / (points.length - 1));
          return x.toFixed(1) + ',' + (38 - (p.v / 100) * 34).toFixed(1);
        })
        .join(' ');
      const line = `${points[0].v}% → ${points[points.length - 1].v}% · ${points.length} relevés depuis le ${new Date(points[0].t).toLocaleDateString('fr-FR')}`;
      return { has: true, curve, line };
    },
    [state.log]
  );

  const nodeGeoms = useMemo(() => {
    const byId: Record<string, CarteNode> = {};
    state.nodes.forEach((n) => (byId[n.id] = n));
    return state.edges.map((e) => {
      const a = byId[e.from];
      const b = byId[e.to];
      if (!a || !b) return null;
      const g = edgeGeom(a, b);
      const twin = state.edges.some((y) => y.from === e.to && y.to === e.from) ? 18 : 0;
      const filled = !!(e.possible.trim() || e.donne.trim());
      return { ...g, a, b, level: levels[e.from] ?? 0, filled, twin };
    });
  }, [state.edges, state.nodes, levels]);

  // ── Actions sur les nœuds ────────────────────────────────────────────────
  const addNode = useCallback(() => {
    const id = 'n' + Date.now();
    const n: CarteNode = { id, owner: stateRef.current.me ?? 'A', title: 'Nouveau besoin', note: '', sat: 50, sent: null, x: 252, y: 276 };
    setLogged({ nodes: stateRef.current.nodes.concat([n]) }, id, 'ajout', n.title);
    set({ lastAdded: id });
    setTimeout(() => set({ lastAdded: null }), 760);
    burst('Nœud ajouté ✓');
    goNode(id);
  }, [burst, goNode, set, setLogged]);

  const patchNode = useCallback(
    (id: string, patch: Partial<CarteNode>, field?: string) => {
      const next = { nodes: stateRef.current.nodes.map((m) => (m.id === id ? { ...m, ...patch } : m)) };
      if (field) {
        const value = (patch as Record<string, string | number>)[field];
        setLogged(next, id, field, value);
      } else {
        set(next);
      }
    },
    [set, setLogged]
  );

  const patchManque = useCallback(
    (id: string, field: 'casse' | 'plus', value: string) => {
      const next: Record<string, Manque> = { ...stateRef.current.manques };
      next[id] = { ...(next[id] || { casse: '', plus: '' }), [field]: value };
      setLogged({ manques: next }, id, field, value);
    },
    [setLogged]
  );

  const deleteNode = useCallback(
    (id: string, title: string) => {
      setLogged(
        {
          nodes: stateRef.current.nodes.filter((m) => m.id !== id),
          edges: stateRef.current.edges.filter((e) => e.from !== id && e.to !== id),
        },
        'doc',
        'suppr',
        title
      );
      goMap();
    },
    [goMap, setLogged]
  );

  // ── Tirer un lien : uniquement depuis un de ses propres besoins ─────────
  const startLinking = useCallback(() => {
    const st = stateRef.current;
    if (st.pickSource || st.linking) {
      set({ pickSource: false, linking: null });
    } else {
      set({ pickSource: true, linking: null });
      burst('Touche le départ');
    }
  }, [burst, set]);

  const onNodeClick = useCallback(
    (node: CarteNode) => {
      if (draggedRef.current) {
        draggedRef.current = false;
        return;
      }
      const st = stateRef.current;
      if (st.pickSource) {
        if (st.me !== node.owner) {
          burst('Pars d’un de tes besoins');
          return;
        }
        set({ pickSource: false, linking: node.id });
        burst("Touche l'arrivée");
        return;
      }
      if (st.linking && st.linking !== node.id) {
        const exists = st.edges.some((x) => x.from === st.linking && x.to === node.id);
        if (!exists) {
          const eid = 'e' + Date.now();
          setLogged({ edges: st.edges.concat([{ id: eid, from: st.linking, to: node.id, possible: '', donne: '' }]) }, st.linking, 'lien', '→ ' + node.title);
          burst('Flèche tirée ✓');
          focusEdgeRef.current = eid;
          set({ linking: null });
          goEdge(eid);
          return;
        }
        set({ linking: null });
        return;
      }
      goNode(node.id);
    },
    [burst, goEdge, goNode, set, setLogged]
  );

  const removeEdge = useCallback(
    (id: string, fromId: string, toTitle: string) => {
      setLogged({ edges: stateRef.current.edges.filter((e) => e.id !== id) }, fromId, 'lien', '− ' + toTitle);
    },
    [setLogged]
  );

  // ── Listes libres (engagements, travail perso, alertes, non-négociables) ─
  const listItems = useCallback((key: 'engA' | 'engB' | 'travailA' | 'travailB' | 'alertes' | 'rouges', locked: boolean) => {
    return stateRef.current[key].map((t, i) => ({
      text: t,
      ro: locked,
      onChange: (v: string) => {
        if (locked) return;
        const arr = stateRef.current[key].slice();
        arr[i] = v;
        setLogged({ [key]: arr } as Partial<CarteState>, 'doc', key, v);
      },
      onRemove: () => {
        if (locked) return;
        const arr = stateRef.current[key].slice();
        const gone = arr[i];
        arr.splice(i, 1);
        setLogged({ [key]: arr } as Partial<CarteState>, 'doc', key, '− ' + (gone || ''));
      },
    }));
  }, [setLogged]);

  const addListItem = useCallback(
    (key: 'engA' | 'engB' | 'travailA' | 'travailB' | 'alertes' | 'rouges') => {
      setLogged({ [key]: stateRef.current[key].concat(['']) } as Partial<CarteState>, 'doc', key, '+ une ligne');
    },
    [setLogged]
  );

  // ── Signature des engagements ────────────────────────────────────────────
  const sign = useCallback(
    (who: Owner) => {
      const st = stateRef.current;
      if (st.me !== who) {
        burst("Ce n'est pas ta signature");
        return;
      }
      const key = who === 'A' ? 'signA' : 'signB';
      const signing = !st[key];
      setLogged({ [key]: signing ? new Date().toLocaleDateString('fr-FR') : '' } as Partial<CarteState>, 'doc', 'signe', signing ? 'signé' : 'retirée');
      if (signing) burst('Signé ✓');
    },
    [burst, setLogged]
  );

  // ── Historique ───────────────────────────────────────────────────────────
  const formatWhen = (t: number) => {
    const d = new Date(t);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const history = useCallback(
    (filter: (l: LogEntry) => boolean) =>
      (state.log || [])
        .filter(filter)
        .slice()
        .reverse()
        .map((l, i) => ({
          key: l.t + '-' + i,
          when: formatWhen(l.t),
          who: l.w ? name(l.w) : 'Quelqu’un',
          what: FIELD_LABELS[l.f] || l.f,
          value: typeof l.v === 'string' ? (l.v.length > 90 ? l.v.slice(0, 90) + '…' : l.v) : String(l.v) + (l.f === 'sat' ? ' %' : ''),
        })),
    [state.log, name]
  );

  const resetToSeed = useCallback(() => {
    const seed = buildSeedDoc();
    setLogged({ ...seed, view: { kind: 'map' }, linking: null, drag: null, drafts: {} }, 'doc', 'ajout', 'réinitialisation');
    burst('Carte réinitialisée ✓');
  }, [burst, setLogged]);

  const setDraft = useCallback((nodeId: string, value: string) => {
    set({ drafts: { ...stateRef.current.drafts, [nodeId]: value } });
  }, [set]);

  const lockDit = useCallback(
    (node: CarteNode, draft: string) => {
      const st = stateRef.current;
      if (st.me === node.owner) {
        burst('C’est à ' + name(node.owner === 'A' ? 'B' : 'A') + ' de remplir');
        return;
      }
      const v = draft.trim();
      if (!v) return;
      const nextManques: Record<string, Manque> = { ...st.manques };
      nextManques[node.id] = {
        ...(nextManques[node.id] || { casse: '', plus: '' }),
        dit: v,
        ditLock: true,
        ditBy: name(st.me || (node.owner === 'A' ? 'B' : 'A')) + ' · ' + new Date().toLocaleDateString('fr-FR'),
      };
      const drafts = { ...st.drafts };
      delete drafts[node.id];
      setLogged({ manques: nextManques, drafts }, node.id, 'dit', v);
      burst('Écrit ✓');
    },
    [burst, name, setLogged]
  );

  const updateEdgeText = useCallback(
    (id: string, field: 'possible' | 'donne', value: string, canWrite: boolean) => {
      if (!canWrite) return;
      setLogged({ edges: stateRef.current.edges.map((y) => (y.id === id ? { ...y, [field]: value } : y)) }, id, field, value);
    },
    [setLogged]
  );

  return {
    state,
    loaded,
    frameRef,
    scalerRef,
    focusEdgeRef,
    name,
    satHidden,
    levels,
    incoming,
    trendFor,
    nodeGeoms,
    scale,
    set,
    pickIdentity,
    switchIdentity,
    goNode,
    goEdge,
    goPerson,
    goHelp,
    goMap,
    burst,
    flashWig,
    startDrag,
    addNode,
    patchNode,
    patchManque,
    deleteNode,
    startLinking,
    onNodeClick,
    removeEdge,
    listItems,
    addListItem,
    sign,
    history,
    resetToSeed,
    setDraft,
    lockDit,
    updateEdgeText,
    elide,
    startsWithVowel,
  };
}
