'use client';

import AutoGrowTextarea from './AutoGrowTextarea';
import { CANVAS_H, CANVAS_W, COLORS, NODE_H, NODE_W } from './constants';
import type { useNotreCarte } from './useNotreCarte';
import type { CarteNode, Owner } from './types';

type Nc = ReturnType<typeof useNotreCarte>;

export default function MapView({ nc }: { nc: Nc }) {
  const { state, name, levels, nodeGeoms, scale } = nc;
  const k = scale();

  const hint = state.arranging
    ? state.moveSource
      ? 'Touche l’endroit où poser ce besoin · touche-le à nouveau pour annuler.'
      : 'Touche un besoin à déplacer, puis touche l’endroit où le poser.'
    : state.pickSource
      ? 'Touche un de tes besoins : le départ doit être à toi.'
      : state.linking
        ? "Touche le nœud d'arrivée."
        : k < 0.99
          ? 'Touche un nœud pour ouvrir sa page'
          : 'Fais glisser la carte pour te déplacer · touche un nœud pour sa page';

  const cardLine = (owner: Owner) => {
    const engKey = owner === 'A' ? 'engA' : 'engB';
    const travKey = owner === 'A' ? 'travailA' : 'travailB';
    const count = state.nodes.filter((n) => n.owner === owner).length;
    return `${count} besoins · ${state[engKey].length} engagements · ${state[travKey].length} points à travailler`;
  };
  const cardSign = (owner: Owner) => {
    const signKey = owner === 'A' ? 'signA' : 'signB';
    return state[signKey] ? 'Signé le ' + state[signKey] : 'Pas encore signé';
  };

  return (
    <div className="nc-gap" style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 13px', borderRadius: 9999, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>
            Privé · ouiclair.com/notre-carte
          </span>
          <button type="button" onClick={nc.switchIdentity} className="nc-hover-scale" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 9999, background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.3)', color: '#a78bfa', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            Ici, c&apos;est {state.me ? name(state.me) : ''} — changer
          </button>
        </div>
        <h1 className="nc-h1" style={{ margin: 0, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-.025em' }}>
          Notre carte.
          <br />
          <span style={{ background: 'linear-gradient(90deg,#a78bfa 0%,#ec4899 40%,#a78bfa 80%,#ec4899 100%)', backgroundSize: '300% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'nc-shimmer 7s ease infinite' }}>
            Ce qu&apos;il faut à l&apos;un pour donner à l&apos;autre.
          </span>
        </h1>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#94a3b8' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.A }} />
            {name('A')}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#94a3b8' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.B }} />
            {name('B')}
          </span>
          <button
            type="button"
            onClick={() => {
              nc.set({ swapped: !state.swapped });
              nc.flashWig();
            }}
            className="nc-hover-scale"
            style={{ background: 'none', border: '1px solid #2e1f46', borderRadius: 9999, color: '#64748b', fontSize: 12, padding: '11px 15px', cursor: 'pointer' }}
          >
            Inverser les rôles
          </button>
        </div>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="nc-toolbar" style={{ display: 'flex', gap: 6, paddingBottom: 2 }}>
          <ToolbarBtn onClick={nc.addNode} accent="violet">+ Besoin</ToolbarBtn>
          <ToolbarBtn onClick={nc.startLinking}>{state.pickSource || state.linking ? 'Annuler la flèche' : 'Tirer une flèche'}</ToolbarBtn>
          <ToolbarBtn onClick={() => { nc.set({ zoom: state.zoom === 'full' ? 'fit' : 'full' }); nc.flashWig(); }}>
            {state.zoom === 'full' ? "Vue d'ensemble" : 'Zoom 1:1'}
          </ToolbarBtn>
          <ToolbarBtn onClick={nc.toggleArrange} accent={state.arranging ? 'violet' : undefined}>
            {state.arranging ? 'Terminer' : 'Réorganiser au doigt'}
          </ToolbarBtn>
        </div>

        <div ref={nc.frameRef} className="nc-frame" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #2e1f46', borderRadius: 18, background: '#0d0714', backgroundImage: 'radial-gradient(circle,rgba(139,92,246,.12) 1px,transparent 1px)', backgroundSize: '32px 32px' }}>
          <div ref={nc.scalerRef} className="nc-scaler" style={{ width: CANVAS_W, height: CANVAS_H, transformOrigin: 'top left' }}>
            <div
              ref={nc.canvasRef}
              onClick={(e) => {
                if (e.target === e.currentTarget) nc.placeMoveTarget(e.clientX, e.clientY);
              }}
              style={{ position: 'relative', width: CANVAS_W, height: CANVAS_H, cursor: state.moveSource ? 'crosshair' : undefined }}
            >
              <div aria-hidden="true" style={{ position: 'absolute', left: 60, top: 80, width: 320, height: 320, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle,rgba(139,92,246,.16) 0%,transparent 70%)', animation: 'nc-drift-a 19s ease-in-out infinite' }} />
              <div aria-hidden="true" style={{ position: 'absolute', right: 20, bottom: 40, width: 300, height: 300, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle,rgba(236,72,153,.14) 0%,transparent 70%)', animation: 'nc-drift-b 23s ease-in-out infinite', animationDelay: '-9s' }} />
              <svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', inset: 0 }}>
                {nodeGeoms.map((g, i) => {
                  if (!g) return null;
                  const color = COLORS[g.a.owner];
                  const width = 1.2 + g.level * 3.4;
                  const opacity = 0.18 + g.level * 0.72;
                  const flow = g.level < 0.12 ? 0 : 0.12 + g.level * 0.5;
                  return (
                    <g key={i}>
                      <path d={g.d} fill="none" stroke={color} strokeWidth={width} strokeOpacity={opacity} strokeLinecap="round" style={{ pointerEvents: 'none' }} />
                      <path d={g.d} fill="none" stroke="#f8fafc" strokeWidth={2} strokeLinecap="round" strokeDasharray="2 16" strokeOpacity={flow} className="nc-flow-path" style={{ pointerEvents: 'none' }} />
                      <polygon points={g.head} fill={color} fillOpacity={opacity} style={{ pointerEvents: 'none' }} />
                      <path d={g.d} fill="none" stroke="transparent" strokeWidth={22} onClick={() => nc.goEdge(state.edges[i].id)} style={{ cursor: 'pointer', pointerEvents: 'stroke' }} />
                    </g>
                  );
                })}
              </svg>
              {nodeGeoms.map((g, i) => {
                if (!g) return null;
                const e = state.edges[i];
                const px = g.mx + g.nx * g.twin;
                const py = g.my + g.ny * g.twin;
                const pillLabel = g.filled ? 'lire' : state.me === g.a.owner ? 'à écrire' : 'à ' + name(g.a.owner);
                const color = COLORS[g.a.owner];
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => nc.goEdge(e.id)}
                    style={{
                      position: 'absolute', left: px, top: py, transform: 'translate(-50%,-50%)',
                      minWidth: 44, minHeight: 44, padding: '0 4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      background: 'none', border: 'none', cursor: 'pointer', zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: 9999,
                        background: g.filled ? color + '2b' : 'rgba(13,7,20,.9)',
                        border: `1px ${g.filled ? 'solid' : 'dashed'} ${g.filled ? color : 'rgba(255,255,255,.18)'}`,
                        color: g.filled ? '#f8fafc' : '#94a3b8', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap',
                        boxShadow: '0 4px 14px rgba(0,0,0,.45)',
                      }}
                    >
                      {pillLabel}
                    </span>
                  </button>
                );
              })}
              {state.nodes.map((n, idx) => (
                <NodeCard
                  key={n.id}
                  node={n}
                  idx={idx}
                  level={levels[n.id] ?? 0}
                  owner={name(n.owner)}
                  hot={state.linking === n.id || (state.pickSource && state.me === n.owner) || state.moveSource === n.id}
                  dim={state.pickSource && state.me !== n.owner}
                  pickable={state.arranging}
                  lastAdded={state.lastAdded === n.id}
                  wig={state.wig}
                  hidden={nc.satHidden(n)}
                  onDown={(e) => nc.startDrag(n, e)}
                  onClick={() => nc.onNodeClick(n)}
                />
              ))}
            </div>
          </div>
        </div>
        <span style={{ fontSize: 11, color: '#a78bfa' }}>{hint}</span>
      </section>

      <section className="nc-stack">
        <div className="nc-duo" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          <PersonCard owner="A" name={name('A')} line={cardLine('A')} sign={cardSign('A')} onOpen={() => nc.goPerson('A')} />
          <PersonCard owner="B" name={name('B')} line={cardLine('B')} sign={cardSign('B')} onOpen={() => nc.goPerson('B')} />
        </div>

        <SynthesisSection nc={nc} />

        <SimpleListSection
          title="Signaux d'alerte"
          count={state.alertes.length + ' signaux'}
          hint="Quand un de ces trucs arrive, la boucle est déjà cassée. On relit la carte."
          accent="amber"
          markerColor="#f59e0b"
          markerBg="rgba(245,158,11,.14)"
          marker="!"
          items={nc.listItems('alertes', false)}
          onAdd={() => nc.addListItem('alertes')}
        />
        <SimpleListSection
          title="Ce qui n'est pas négociable"
          count={state.rouges.length + ' limites'}
          hint="Pas une préférence. La limite en-dessous de laquelle la carte ne sert plus à rien."
          accent="pink"
          markerColor="#f472b6"
          markerBg="rgba(236,72,153,.14)"
          marker="—"
          items={nc.listItems('rouges', false)}
          onAdd={() => nc.addListItem('rouges')}
        />
      </section>

      <footer style={{ borderTop: '1px solid #2e1f46', paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <button type="button" onClick={nc.goHelp} className="nc-hover-right" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', color: '#94a3b8', borderRadius: 9999, padding: '11px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          Comment on s&apos;en sert →
        </button>
        <span style={{ fontSize: 11, color: '#64748b' }}>Gardé sur le serveur privé de la maison. Rien n&apos;est envoyé ailleurs.</span>
        <span style={{ fontSize: 11, color: '#64748b' }}>{name('A')} &amp; {name('B')} · ouiclair.com</span>
      </footer>
    </div>
  );
}

function ToolbarBtn({ children, onClick, accent }: { children: React.ReactNode; onClick: () => void; accent?: 'violet' }) {
  const style: React.CSSProperties =
    accent === 'violet'
      ? { background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.3)', color: '#a78bfa' }
      : { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', color: '#94a3b8' };
  return (
    <button type="button" onClick={onClick} className="nc-hover-tilt-r" style={{ ...style, borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}>
      {children}
    </button>
  );
}

function PersonCard({ owner, name, line, sign, onOpen }: { owner: Owner; name: string; line: string; sign: string; onOpen: () => void }) {
  const color = COLORS[owner];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="nc-card nc-hover-row"
      style={{ textAlign: 'left', borderRadius: 16, background: `linear-gradient(145deg, ${color}14, #1a1128 65%)`, border: `1px solid ${color}47`, cursor: 'pointer' }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
        <span style={{ flex: 1, fontSize: 17, fontWeight: 900, color: '#f8fafc' }}>{name}</span>
        <span style={{ fontSize: 11, color }}>▶</span>
      </span>
      <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 8, lineHeight: 1.5 }}>{line}</span>
      <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 4 }}>{sign}</span>
    </button>
  );
}

function SynthesisSection({ nc }: { nc: Nc }) {
  const { state, name } = nc;
  const byId: Record<string, CarteNode> = {};
  state.nodes.forEach((n) => (byId[n.id] = n));

  return (
    <details className="nc-card" style={{ borderRadius: 16, background: 'rgba(26,17,40,.5)', border: '1px solid #2e1f46' }}>
      <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
        <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>Synthèse</span>
          <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>{state.nodes.length} besoins · {state.edges.length} liens</span>
        </span>
      </summary>
      <div style={{ marginTop: 14 }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b' }}>Les besoins</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 9 }}>
          {state.nodes.map((n) => {
            const sentSet = n.sent != null;
            const hiddenRow = nc.satHidden(n);
            const changed = state.me === n.owner && n.sentSeen === false;
            const gap = sentSet ? n.sent! - (n.sat || 0) : null;
            const gapText = hiddenRow
              ? 'à ton tour de répondre'
              : changed
                ? 'réponse changée depuis ta dernière visite'
                : gap == null ? 'envoi pas encore donné' : gap > 12 ? gap + ' points d’écart — à reprendre' : gap < -12 ? Math.abs(gap) + ' points d’écart' : 'envoi et perception alignés';
            return (
              <button key={n.id} type="button" onClick={() => nc.goNode(n.id)} className="nc-hover-right" style={rowStyle}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>{n.title}</span>
                  <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 3 }}>{name(n.owner)} · {gapText}</span>
                </span>
                <span style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{hiddenRow ? '••' : n.sat + '%'}</span>
                  <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 3 }}>envoi {sentSet ? n.sent + '%' : '—'}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b' }}>Les liens</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 9 }}>
          {state.edges.map((e) => {
            const a = byId[e.from];
            const b = byId[e.to];
            if (!a || !b) return null;
            const filled = !!(e.possible.trim() || e.donne.trim());
            const owner = a.owner === b.owner ? 'chez ' + name(a.owner) : name(a.owner) + ' → ' + name(b.owner);
            return (
              <button key={e.id} type="button" onClick={() => nc.goEdge(e.id)} className="nc-hover-right" style={rowStyle}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#f8fafc', lineHeight: 1.35 }}>{a.title} → {b.title}</span>
                  <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 3 }}>{owner}</span>
                </span>
                <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {filled ? 'rempli' : 'à écrire par ' + name(a.owner)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </details>
  );
}

const rowStyle: React.CSSProperties = {
  width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
  padding: '12px 14px', borderRadius: 12, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(255,255,255,.07)', cursor: 'pointer',
};

function NodeCard({
  node, idx, level, owner, hot, dim, lastAdded, wig, hidden, pickable, onDown, onClick,
}: {
  node: CarteNode; idx: number; level: number; owner: string; hot: boolean; dim: boolean; lastAdded: boolean; wig: boolean; hidden: boolean; pickable: boolean;
  onDown: (e: React.PointerEvent) => void; onClick: () => void;
}) {
  const c = COLORS[node.owner];
  const glow = 0.06 + level * 0.5;
  const animClass = lastAdded ? 'nc-anim-land' : wig ? 'nc-anim-wiggle' : level > 0.45 ? 'nc-anim-breathe' : '';
  return (
    <div
      onPointerDown={onDown}
      onClick={onClick}
      className={`nc-node ${animClass}`}
      style={{
        position: 'absolute', left: node.x, top: node.y, width: NODE_W, height: NODE_H,
        padding: '10px 12px', borderRadius: 12, cursor: pickable ? 'pointer' : 'grab', userSelect: 'none', touchAction: 'none',
        display: 'flex', flexDirection: 'column',
        background: `linear-gradient(145deg, ${c}${Math.round(glow * 40).toString(16).padStart(2, '0')}, #1a1128 70%)`,
        border: `1px solid ${hot ? c : `rgba(255,255,255,${(0.07 + level * 0.2).toFixed(2)})`}`,
        boxShadow: hot ? `0 0 0 1px ${c}, 0 10px 40px rgba(0,0,0,.5)` : `0 0 ${(10 + level * 50).toFixed(0)}px ${c}${Math.round(level * 60).toString(16).padStart(2, '0')}`,
        opacity: dim ? 0.32 : 1,
        animationDelay: `${(idx * 0.35).toFixed(2)}s`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ width: 15, height: 15, borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c + '33', color: c, fontSize: 9, fontWeight: 800, flexShrink: 0 }}>
          1
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 8, fontWeight: 700, color: c, whiteSpace: 'nowrap' }}>{owner}</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25, color: '#f8fafc', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
        {node.title}
      </div>
      <div style={{ fontSize: 9.5, color: '#94a3b8', lineHeight: 1.45, marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, minHeight: 0 }}>
        {node.note}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#cbd5e1', width: 28, flexShrink: 0 }}>perçu</span>
          <div style={{ flex: 1, height: 6, borderRadius: 9999, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
            {!hidden && <div style={{ height: '100%', borderRadius: 9999, background: c, width: `${node.sat || 0}%` }} />}
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', width: 22, textAlign: 'right' }}>{hidden ? '••' : node.sat + '%'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 9, color: '#94a3b8', width: 28, flexShrink: 0 }}>envoi</span>
          <div style={{ flex: 1, height: 2, borderRadius: 9999, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 9999, background: COLORS[node.owner === 'A' ? 'B' : 'A'], width: `${node.sent ?? 0}%` }} />
          </div>
          <span style={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap', width: 24, textAlign: 'right' }}>{node.sent == null ? '—' : node.sent}</span>
        </div>
      </div>
    </div>
  );
}

function SimpleListSection({
  title, count, hint, accent, markerColor, markerBg, marker, items, onAdd,
}: {
  title: string; count: string; hint: string; accent: 'amber' | 'pink'; markerColor: string; markerBg: string; marker: string;
  items: { text: string; ro: boolean; onChange: (v: string) => void; onRemove: () => void }[]; onAdd: () => void;
}) {
  const border = accent === 'amber' ? 'rgba(245,158,11,.22)' : 'rgba(236,72,153,.22)';
  const bg = accent === 'amber' ? 'rgba(245,158,11,.05)' : 'rgba(236,72,153,.05)';
  const chev = accent === 'amber' ? '#f59e0b' : '#ec4899';
  return (
    <details className="nc-card" style={{ borderRadius: 16, background: `linear-gradient(145deg,${bg},#1a1128 60%)`, border: `1px solid ${border}` }}>
      <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
        <span className="nc-chev" style={{ color: chev, fontSize: 11 }}>▶</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{title}</span>
          <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>{count}</span>
        </span>
      </summary>
      <p style={{ margin: '14px 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{hint}</p>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, background: markerBg, color: markerColor }}>
              {marker}
            </span>
            <RemovableRow value={it.text} onChange={it.onChange} onRemove={it.onRemove} />
          </div>
        ))}
      </div>
      <button type="button" onClick={onAdd} className={`nc-hover-dashed nc-hover-dashed-${accent}`} style={dashedBtnStyle}>
        + Ajouter
      </button>
    </details>
  );
}

export function RemovableRow({ value, onChange, onRemove }: { value: string; onChange: (v: string) => void; onRemove: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flex: 1 }}>
      <TextareaAuto value={value} onChange={onChange} />
      <button type="button" onClick={onRemove} className="nc-hover-remove nc-icon-btn" title="Supprimer cette ligne" style={{ background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.25)', color: '#f472b6', cursor: 'pointer', fontSize: 13, borderRadius: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        ×
      </button>
    </div>
  );
}

function TextareaAuto({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <AutoGrowTextarea
      rows={2}
      value={value}
      onChange={onChange}
      style={{ flex: 1, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 8, padding: 8, color: '#94a3b8', fontSize: 16, lineHeight: 1.5 }}
    />
  );
}

export const dashedBtnStyle: React.CSSProperties = {
  marginTop: 10, background: 'none', border: '1px dashed #2e1f46', borderRadius: 9, color: '#64748b', padding: '10px 14px', fontSize: 12, cursor: 'pointer',
};
