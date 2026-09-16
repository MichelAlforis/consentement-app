'use client';

import { useState } from 'react';
import { CANVAS_H, CANVAS_W, COLORS, KINDS, NODE_H, NODE_W } from './constants';
import type { useNotreCarte } from './useNotreCarte';
import type { CarteNode } from './types';
import AutoGrowTextarea from './AutoGrowTextarea';

type Nc = ReturnType<typeof useNotreCarte>;

export default function MapView({ nc }: { nc: Nc }) {
  const { state, name, levels, incoming, nodeGeoms, scale } = nc;
  const besoinNodes = state.nodes.filter((n) => n.kind === 'besoin');
  const k = scale();

  const hint = state.pickSource
    ? 'Touche le nœud de départ.'
    : state.linking
      ? "Touche le nœud d'arrivée."
      : k < 0.99
        ? 'Touche un nœud pour ouvrir sa page'
        : 'Fais glisser la carte pour te déplacer · touche un nœud pour sa page';

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
        <details style={{ border: '1px solid #2e1f46', borderRadius: 14, background: 'rgba(26,17,40,.5)', overflow: 'hidden' }}>
          <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', minHeight: 44, fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
            <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
            Le préambule
          </summary>
          <div style={{ padding: '0 16px 16px' }}>
            <AutoGrowTextarea
              rows={4}
              value={state.preambule}
              onChange={(v) => nc.set({ preambule: v })}
              style={{ width: '100%', background: 'rgba(13,7,20,.5)', border: '1px solid #2e1f46', borderRadius: 10, padding: 12, color: '#94a3b8', fontSize: 16, lineHeight: 1.6 }}
            />
          </div>
        </details>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="nc-toolbar" style={{ display: 'flex', gap: 6, paddingBottom: 2 }}>
          <ToolbarBtn onClick={() => nc.addNode('besoin')} accent="violet">+ Besoin</ToolbarBtn>
          <ToolbarBtn onClick={() => nc.addNode('capacite')}>+ Étape</ToolbarBtn>
          <ToolbarBtn onClick={() => nc.addNode('reponse')} accent="pink">+ Don</ToolbarBtn>
          <ToolbarBtn onClick={nc.startLinking}>{state.pickSource || state.linking ? 'Annuler la flèche' : 'Tirer une flèche'}</ToolbarBtn>
          <ToolbarBtn onClick={() => { nc.set({ zoom: state.zoom === 'full' ? 'fit' : 'full' }); nc.flashWig(); }}>
            {state.zoom === 'full' ? "Vue d'ensemble" : 'Zoom 1:1'}
          </ToolbarBtn>
        </div>

        <div ref={nc.frameRef} className="nc-frame" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #2e1f46', borderRadius: 18, background: '#0d0714', backgroundImage: 'radial-gradient(circle,rgba(139,92,246,.12) 1px,transparent 1px)', backgroundSize: '32px 32px' }}>
          <div ref={nc.scalerRef} style={{ width: CANVAS_W, height: CANVAS_H, transformOrigin: 'top left' }}>
            <div style={{ position: 'relative', width: CANVAS_W, height: CANVAS_H }}>
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
                      <path d={g.d} fill="none" stroke="transparent" strokeWidth={22} onClick={() => nc.goEdge(i)} style={{ cursor: 'pointer', pointerEvents: 'stroke' }} />
                    </g>
                  );
                })}
              </svg>
              {state.nodes.map((n, idx) => (
                <NodeCard
                  key={n.id}
                  node={n}
                  idx={idx}
                  level={levels[n.id] ?? 0}
                  incomingSupport={incoming[n.id]}
                  owner={name(n.owner)}
                  hot={state.linking === n.id || state.pickSource}
                  lastAdded={state.lastAdded === n.id}
                  wig={state.wig}
                  onDown={(e) => nc.startDrag(n, e)}
                  onClick={() => nc.onNodeClick(n)}
                />
              ))}
            </div>
          </div>
        </div>
        <span style={{ fontSize: 11, color: '#a78bfa' }}>{hint}</span>
        <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
          L&apos;épaisseur d&apos;une flèche, c&apos;est <strong style={{ color: '#94a3b8' }}>la perception</strong> — jamais l&apos;effort déclaré. Plus elle est épaisse, plus l&apos;autre peut recevoir ; quand elle s&apos;éteint, la suite de la chaîne n&apos;a plus de quoi passer.
        </p>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <h2 className="nc-h2" style={{ margin: '0 0 5px', fontWeight: 900, letterSpacing: '-.02em' }}>Les besoins, un par un.</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Chaque besoin a sa page. Touche-le sur la carte, ou ici.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {besoinNodes.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => nc.goNode(b.id)}
              className="nc-hover-lift"
              style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, background: '#1a1128', border: '1px solid #2e1f46', cursor: 'pointer' }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[b.owner], flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>{b.title}</span>
                <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 3 }}>
                  {name(b.owner)} perçoit <strong style={{ color: '#f8fafc' }}>{b.sat}%</strong> · envoi déclaré {b.sent == null ? 'pas encore répondu' : b.sent + '%'}
                </span>
              </span>
              <span style={{ fontSize: 11, color: '#8b5cf6' }}>▶</span>
            </button>
          ))}
        </div>
      </section>

      <section className="nc-stack">
        <TravailSection nc={nc} />
        <EngagementsSection nc={nc} />
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
          marker="×"
          items={nc.listItems('rouges', false)}
          onAdd={() => nc.addListItem('rouges')}
        />
        <HistoriqueSection nc={nc} />
        <AideSection nc={nc} />
      </section>

      <footer style={{ borderTop: '1px solid #2e1f46', paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#64748b' }}>Gardé sur le serveur privé de la maison. Rien n&apos;est envoyé ailleurs.</span>
        <span style={{ fontSize: 11, color: '#64748b' }}>{name('A')} &amp; {name('B')} · ouiclair.com</span>
      </footer>
    </div>
  );
}

function ToolbarBtn({ children, onClick, accent }: { children: React.ReactNode; onClick: () => void; accent?: 'violet' | 'pink' }) {
  const styles: Record<string, React.CSSProperties> = {
    violet: { background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.3)', color: '#a78bfa' },
    pink: { background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.28)', color: '#f472b6' },
    default: { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', color: '#94a3b8' },
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={accent === 'pink' ? 'nc-hover-tilt-l' : 'nc-hover-tilt-r'}
      style={{ ...styles[accent ?? 'default'], borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}
    >
      {children}
    </button>
  );
}

function NodeCard({
  node,
  idx,
  level,
  incomingSupport,
  owner,
  hot,
  lastAdded,
  wig,
  onDown,
  onClick,
}: {
  node: CarteNode;
  idx: number;
  level: number;
  incomingSupport?: number;
  owner: string;
  hot: boolean;
  lastAdded: boolean;
  wig: boolean;
  onDown: (e: React.PointerEvent) => void;
  onClick: () => void;
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
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: NODE_W,
        height: NODE_H,
        padding: '10px 12px',
        borderRadius: 12,
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(145deg, ${c}${Math.round(glow * 40).toString(16).padStart(2, '0')}, #1a1128 70%)`,
        border: `1px solid ${hot ? c : `rgba(255,255,255,${(0.07 + level * 0.2).toFixed(2)})`}`,
        boxShadow: hot ? `0 0 0 1px ${c}, 0 10px 40px rgba(0,0,0,.5)` : `0 0 ${(10 + level * 50).toFixed(0)}px ${c}${Math.round(level * 60).toString(16).padStart(2, '0')}`,
        animationDelay: `${(idx * 0.35).toFixed(2)}s`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ width: 15, height: 15, borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c + '33', color: c, fontSize: 9, fontWeight: 800, flexShrink: 0 }}>
          {KINDS[node.kind].num}
        </span>
        <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {KINDS[node.kind].label}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 8, fontWeight: 700, color: c, whiteSpace: 'nowrap' }}>{owner}</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25, color: '#f8fafc', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
        {node.title}
      </div>
      <div style={{ fontSize: 9.5, color: '#94a3b8', lineHeight: 1.45, marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, minHeight: 0 }}>
        {node.note}
      </div>
      {node.kind === 'besoin' && (
        <div style={{ marginTop: 'auto', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#cbd5e1', width: 28, flexShrink: 0 }}>perçu</span>
            <div style={{ flex: 1, height: 6, borderRadius: 9999, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 9999, background: c, width: `${node.sat || 0}%` }} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', width: 22, textAlign: 'right' }}>{node.sat}%</span>
          </div>
          {typeof incomingSupport === 'number' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 9, color: '#94a3b8', width: 28, flexShrink: 0 }}>chaîne</span>
              <div style={{ flex: 1, height: 2, borderRadius: 9999, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 9999, background: '#f8fafc', width: `${Math.round(incomingSupport * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TravailSection({ nc }: { nc: Nc }) {
  const { state } = nc;
  return (
    <details className="nc-card" style={{ borderRadius: 16, background: 'linear-gradient(145deg,rgba(139,92,246,.05),#1a1128 60%)', border: '1px solid rgba(139,92,246,.2)' }}>
      <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
        <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>Ce que chacun travaille seul</span>
          <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>{state.travailA.length + state.travailB.length} points, deux colonnes</span>
        </span>
      </summary>
      <p style={{ margin: '14px 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
        Ce qui ne se règle pas en réunion de couple. À relire avec son thérapeute, pas à se jeter à la figure.
      </p>
      <div className="nc-duo" style={{ marginTop: 14 }}>
        <TravailColumn nc={nc} owner="A" profilKey="profilA" travailKey="travailA" placeholder="Ce que tu vois chez lui, et qu'il ne peut pas réparer à ta place" />
        <TravailColumn nc={nc} owner="B" profilKey="profilB" travailKey="travailB" placeholder="Ce que tu vois chez elle — ta lecture, pas un diagnostic" />
      </div>
    </details>
  );
}

function TravailColumn({
  nc,
  owner,
  profilKey,
  travailKey,
  placeholder,
}: {
  nc: Nc;
  owner: 'A' | 'B';
  profilKey: 'profilA' | 'profilB';
  travailKey: 'travailA' | 'travailB';
  placeholder: string;
}) {
  const { state, name } = nc;
  const items = nc.listItems(travailKey, false);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
        <span style={{ width: 9, height: 9, borderRadius: 3, background: COLORS[owner] }} />
        <span style={{ fontSize: 13, fontWeight: 800 }}>{name(owner)}</span>
      </div>
      <AutoGrowTextarea
        rows={2}
        value={state[profilKey]}
        onChange={(v) => nc.set({ [profilKey]: v } as Partial<typeof state>)}
        placeholder={placeholder}
        style={{ width: '100%', marginBottom: 10, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 8, padding: 9, color: owner === 'A' ? '#a78bfa' : '#f472b6', fontSize: 16, lineHeight: 1.55 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <RemovableRow key={i} value={it.text} onChange={it.onChange} onRemove={it.onRemove} />
        ))}
      </div>
      <button type="button" onClick={() => nc.addListItem(travailKey)} className={`nc-hover-dashed nc-hover-dashed-${owner === 'A' ? 'violet' : 'pink'}`} style={dashedBtnStyle}>
        + Ajouter
      </button>
    </div>
  );
}

function EngagementsSection({ nc }: { nc: Nc }) {
  const { state } = nc;
  const signedCount = (state.signA ? 1 : 0) + (state.signB ? 1 : 0);
  return (
    <details className="nc-card" style={{ borderRadius: 16, background: 'linear-gradient(145deg,rgba(139,92,246,.05),#1a1128 60%)', border: '1px solid rgba(139,92,246,.2)' }}>
      <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
        <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>Ce à quoi on s&apos;engage</span>
          <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>{state.engA.length + state.engB.length} engagements · {signedCount}/2 signés</span>
        </span>
      </summary>
      <div className="nc-duo" style={{ marginTop: 16 }}>
        <EngagementColumn nc={nc} owner="A" engKey="engA" signKey="signA" />
        <EngagementColumn nc={nc} owner="B" engKey="engB" signKey="signB" />
      </div>
    </details>
  );
}

function EngagementColumn({ nc, owner, engKey, signKey }: { nc: Nc; owner: 'A' | 'B'; engKey: 'engA' | 'engB'; signKey: 'signA' | 'signB' }) {
  const { state, name } = nc;
  const items = nc.listItems(engKey, false);
  const canSign = state.me === owner;
  const signed = !!state[signKey];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <span style={{ width: 9, height: 9, borderRadius: 3, background: COLORS[owner] }} />
        <span style={{ fontSize: 13, fontWeight: 800 }}>{name(owner)}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: COLORS[owner] + '24', color: owner === 'A' ? '#a78bfa' : '#f472b6' }}>✓</span>
            <RemovableRow value={it.text} onChange={it.onChange} onRemove={it.onRemove} />
          </div>
        ))}
        {engKey === 'engB' && state.engB.length === 0 && (
          <p style={{ margin: 0, padding: '10px 0', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Rien ici pour l&apos;instant. Cette colonne s&apos;écrit d&apos;elle-même, quand elle voudra.</p>
        )}
      </div>
      <button type="button" onClick={() => nc.addListItem(engKey)} className={`nc-hover-dashed nc-hover-dashed-${owner === 'A' ? 'violet' : 'pink'}`} style={dashedBtnStyle}>
        + Ajouter un engagement
      </button>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        {signed ? (
          <span style={{ fontSize: 11, color: owner === 'A' ? '#a78bfa' : '#f472b6', fontWeight: 700, animation: 'nc-stamp .55s cubic-bezier(.2,1.5,.4,1) both' }}>
            Signé le {state[signKey]}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: '#64748b' }}>Non signé</span>
        )}
        {canSign && (
          <button type="button" onClick={() => nc.sign(owner)} className="nc-hover-scale-rot" style={{ background: COLORS[owner] + '1f', border: `1px solid ${COLORS[owner]}66`, color: owner === 'A' ? '#a78bfa' : '#f472b6', borderRadius: 9999, padding: '10px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {signed ? 'Retirer' : 'Signer'}
          </button>
        )}
      </div>
    </div>
  );
}

function SimpleListSection({
  title,
  count,
  hint,
  accent,
  markerColor,
  markerBg,
  marker,
  items,
  onAdd,
}: {
  title: string;
  count: string;
  hint: string;
  accent: 'amber' | 'pink';
  markerColor: string;
  markerBg: string;
  marker: string;
  items: { text: string; ro: boolean; onChange: (v: string) => void; onRemove: () => void }[];
  onAdd: () => void;
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

function HistoriqueSection({ nc }: { nc: Nc }) {
  const items = nc.history(() => true).slice(0, 60);
  return (
    <details className="nc-card" style={{ borderRadius: 16, background: 'rgba(26,17,40,.5)', border: '1px solid #2e1f46' }}>
      <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
        <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>Tout ce qui a été modifié</span>
          <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>{nc.state.log.length} modifications</span>
        </span>
      </summary>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {items.map((h) => (
          <div key={h.key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: 9, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', flexShrink: 0, marginTop: 6 }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 12, color: '#f8fafc' }}><strong>{h.who}</strong> a modifié {h.what}</span>
              <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 3, lineHeight: 1.5 }}>{h.value}</span>
              <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 3 }}>{h.when}</span>
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}

function AideSection({ nc }: { nc: Nc }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <details style={{ border: '1px solid #2e1f46', borderRadius: 14, padding: 16, background: 'rgba(26,17,40,.4)' }}>
      <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
        <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>Comment on s&apos;en sert</span>
      </summary>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <AideLine title="Qui écrit quoi">chaque champ appartient à celui dont il parle. Ton ressenti et la formulation de tes besoins : toi seul. Ce que tu crois envoyer : toi seul, sur les besoins de l&apos;autre. Tes engagements et ta signature : toi seul.</AideLine>
        <AideLine title="Ouvrir une page">touche un nœud sur la carte, ou une ligne de la liste. Le besoin a sa propre adresse : tu peux l&apos;envoyer ou la mettre en favori.</AideLine>
        <AideLine title="Une flèche">touche la flèche elle-même sur la carte : sa page dit ce que ce lien permet.</AideLine>
        <AideLine title="Revenir">le bouton « La carte » en haut, ou le bouton retour du téléphone.</AideLine>
        <AideLine title="Déplacer">attrape un nœud et fais-le glisser du doigt. La position est gardée.</AideLine>
        <AideLine title="Ajouter">« + Besoin », « + Étape », « + Don » créent un nœud au centre de la carte.</AideLine>
        <AideLine title="Relier">depuis la page d&apos;un nœud, « Tirer une flèche depuis ce nœud », puis touche le nœud d&apos;arrivée sur la carte.</AideLine>
      </div>
      {confirming ? (
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => { nc.resetToSeed(); setConfirming(false); }} style={{ flex: 1, background: 'rgba(236,72,153,.12)', border: '1px solid rgba(236,72,153,.4)', borderRadius: 10, color: '#f472b6', padding: 12, fontSize: 12, cursor: 'pointer' }}>
            Confirmer la réinitialisation
          </button>
          <button type="button" onClick={() => setConfirming(false)} style={{ flex: 1, background: 'none', border: '1px solid #2e1f46', borderRadius: 10, color: '#94a3b8', padding: 12, fontSize: 12, cursor: 'pointer' }}>
            Annuler
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="nc-hover-scale" style={{ marginTop: 14, background: 'none', border: '1px solid #2e1f46', borderRadius: 10, color: '#64748b', padding: 12, fontSize: 12, cursor: 'pointer', width: '100%' }}>
          Repartir de la carte d&apos;origine
        </button>
      )}
    </details>
  );
}

function AideLine({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>
      <strong style={{ color: '#f8fafc' }}>{title}</strong> — {children}
    </span>
  );
}

function RemovableRow({ value, onChange, onRemove }: { value: string; onChange: (v: string) => void; onRemove: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flex: 1 }}>
      <AutoGrowTextarea
        rows={2}
        value={value}
        onChange={onChange}
        style={{ flex: 1, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 8, padding: 8, color: '#94a3b8', fontSize: 16, lineHeight: 1.5 }}
      />
      <button type="button" onClick={onRemove} className="nc-hover-remove nc-icon-btn" title="Supprimer cette ligne" style={{ background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.25)', color: '#f472b6', cursor: 'pointer', fontSize: 13, borderRadius: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        ×
      </button>
    </div>
  );
}

const dashedBtnStyle: React.CSSProperties = {
  marginTop: 10,
  background: 'none',
  border: '1px dashed #2e1f46',
  borderRadius: 9,
  color: '#64748b',
  padding: '10px 14px',
  fontSize: 12,
  cursor: 'pointer',
};
