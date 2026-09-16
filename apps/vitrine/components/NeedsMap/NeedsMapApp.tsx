'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Download, Upload, RotateCcw, X, Trash2, ArrowLeft } from 'lucide-react';

import { NeedNode, PERSON_COLORS } from './NeedNode';
import { StrengthEdge } from './StrengthEdge';
import type { NeedNodeData, StrengthEdgeData, PersonNames, PersonKey } from './types';
import { SEED_NODES, SEED_EDGES, DEFAULT_PERSON_NAMES } from './seed';
import { loadSavedMap, saveMap, clearSavedMap, downloadMap, parseImportedMap } from './storage';

const nodeTypes = { need: NeedNode };
const edgeTypes = { strength: StrengthEdge };

export default function NeedsMapApp() {
  const [personNames, setPersonNames] = useState<PersonNames>(DEFAULT_PERSON_NAMES);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NeedNodeData>>(SEED_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<StrengthEdgeData>>(SEED_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadSavedMap();
    if (saved) {
      setPersonNames(saved.personNames);
      setNodes(saved.nodes.map((n) => ({ id: n.id, type: 'need', position: n.position, data: n.data })));
      setEdges(saved.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, type: 'strength', data: e.data })));
    }
    setLoaded(true);
  }, [setNodes, setEdges]);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => saveMap(personNames, nodes, edges), 400);
    return () => clearTimeout(timer);
  }, [loaded, personNames, nodes, edges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge({ ...connection, id: `e${Date.now()}`, type: 'strength', data: { strength: 2 } }, eds)
      );
    },
    [setEdges]
  );

  const addNode = useCallback(
    (person: PersonKey) => {
      const id = `n${Date.now()}`;
      const countForPerson = nodes.filter((n) => n.data.person === person).length;
      setNodes((nds) =>
        nds.concat({
          id,
          type: 'need',
          position: { x: person === 'A' ? 40 : 520, y: 60 + countForPerson * 170 },
          data: { label: 'Nouveau besoin', person, note: '', satisfaction: 50 },
        })
      );
      setSelectedNodeId(id);
      setSelectedEdgeId(null);
    },
    [nodes, setNodes]
  );

  const updateSelectedNode = useCallback(
    (patch: Partial<NeedNodeData>) => {
      if (!selectedNodeId) return;
      setNodes((nds) => nds.map((n) => (n.id === selectedNodeId ? { ...n, data: { ...n.data, ...patch } } : n)));
    },
    [selectedNodeId, setNodes]
  );

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  const updateSelectedEdge = useCallback(
    (patch: Partial<StrengthEdgeData>) => {
      if (!selectedEdgeId) return;
      setEdges((eds) =>
        eds.map((e) => (e.id === selectedEdgeId ? { ...e, data: { ...(e.data as StrengthEdgeData), ...patch } } : e))
      );
    },
    [selectedEdgeId, setEdges]
  );

  const deleteSelectedEdge = useCallback(() => {
    if (!selectedEdgeId) return;
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
    setSelectedEdgeId(null);
  }, [selectedEdgeId, setEdges]);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const renderNodes = useMemo(
    () =>
      nodes.map((n) => {
        const incoming = edges.filter((e) => e.target === n.id);
        const incomingSupport = incoming.length
          ? incoming.reduce((sum, e) => {
              const src = nodeById.get(e.source);
              const strength = (e.data as StrengthEdgeData | undefined)?.strength ?? 2;
              const satisfaction = src?.data.satisfaction ?? 50;
              return sum + satisfaction * (strength / 3);
            }, 0) / incoming.length
          : null;
        return { ...n, data: { ...n.data, personName: personNames[n.data.person], incomingSupport } };
      }),
    [nodes, edges, nodeById, personNames]
  );

  const renderEdges = useMemo(
    () =>
      edges.map((e) => {
        const src = nodeById.get(e.source);
        const tgt = nodeById.get(e.target);
        const strength = (e.data as StrengthEdgeData | undefined)?.strength ?? 2;
        const color = PERSON_COLORS[tgt?.data.person ?? 'A'];
        return {
          ...e,
          style: { stroke: color },
          markerEnd: { type: MarkerType.ArrowClosed, color, width: 18, height: 18, markerUnits: 'userSpaceOnUse' },
          data: { ...(e.data as StrengthEdgeData), strength, sourceSatisfaction: src?.data.satisfaction ?? 50 },
          selected: e.id === selectedEdgeId,
        };
      }),
    [edges, nodeById, selectedEdgeId]
  );

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) ?? null : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) ?? null : null;

  const handleExport = useCallback(() => downloadMap(personNames, nodes, edges), [personNames, nodes, edges]);

  const handleImportFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const parsed = parseImportedMap(String(reader.result));
        if (!parsed) {
          alert("Ce fichier n'est pas une carte valide.");
          return;
        }
        setPersonNames(parsed.personNames);
        setNodes(parsed.nodes.map((n) => ({ id: n.id, type: 'need', position: n.position, data: n.data })));
        setEdges(parsed.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, type: 'strength', data: e.data })));
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges]
  );

  const handleReset = useCallback(() => {
    if (!window.confirm('Réinitialiser la carte avec l’exemple de départ ? Cette action efface vos modifications locales.')) {
      return;
    }
    clearSavedMap();
    setPersonNames(DEFAULT_PERSON_NAMES);
    setNodes(SEED_NODES);
    setEdges(SEED_EDGES);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [setNodes, setEdges]);

  return (
    <div className="h-screen w-screen flex flex-col bg-oui-bg text-oui-text overflow-hidden">
      <header className="flex items-center justify-between gap-4 px-4 sm:px-6 h-14 border-b border-oui-border shrink-0">
        <Link href="/" className="flex items-center gap-2 text-oui-muted hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Retour</span>
        </Link>
        <h1 className="text-sm font-semibold text-white truncate">Notre carte des besoins</h1>
        <div className="flex items-center gap-2">
          <ToolbarButton onClick={handleExport} title="Exporter (fichier JSON)">
            <Download size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Importer un fichier">
            <Upload size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleReset} title="Réinitialiser">
            <RotateCcw size={16} />
          </ToolbarButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = '';
            }}
          />
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 relative min-w-0">
          <ReactFlow
            nodes={renderNodes}
            edges={renderEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => {
              setSelectedNodeId(node.id);
              setSelectedEdgeId(null);
            }}
            onEdgeClick={(_, edge) => {
              setSelectedEdgeId(edge.id);
              setSelectedNodeId(null);
            }}
            onPaneClick={() => {
              setSelectedNodeId(null);
              setSelectedEdgeId(null);
            }}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
            colorMode="dark"
          >
            <Background color="#2e1f46" gap={28} size={1.5} />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              maskColor="rgba(13,7,20,0.75)"
              style={{ background: '#1a1128', border: '1px solid #2e1f46' }}
            />
            <Panel position="top-left">
              <div className="bg-oui-card/95 backdrop-blur-md border border-oui-border rounded-xl p-3 flex flex-col gap-2 shadow-card">
                <PersonNameInput
                  color={PERSON_COLORS.A}
                  value={personNames.A}
                  onChange={(v) => setPersonNames((p) => ({ ...p, A: v }))}
                />
                <PersonNameInput
                  color={PERSON_COLORS.B}
                  value={personNames.B}
                  onChange={(v) => setPersonNames((p) => ({ ...p, B: v }))}
                />
              </div>
            </Panel>
            <Panel position="top-right">
              <div className="flex flex-col gap-2">
                <AddNodeButton color={PERSON_COLORS.A} label={personNames.A} onClick={() => addNode('A')} />
                <AddNodeButton color={PERSON_COLORS.B} label={personNames.B} onClick={() => addNode('B')} />
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {(selectedNode || selectedEdge) && (
          <aside className="w-full max-w-xs shrink-0 border-l border-oui-border bg-oui-card p-5 overflow-y-auto">
            {selectedNode && (
              <NodePanel
                node={selectedNode}
                personNames={personNames}
                onChange={updateSelectedNode}
                onDelete={deleteSelectedNode}
                onClose={() => setSelectedNodeId(null)}
              />
            )}
            {selectedEdge && (
              <EdgePanel
                edge={selectedEdge}
                onChange={updateSelectedEdge}
                onDelete={deleteSelectedEdge}
                onClose={() => setSelectedEdgeId(null)}
              />
            )}
          </aside>
        )}
      </div>

      <p className="shrink-0 text-center text-[11px] text-oui-subtle border-t border-oui-border py-2 px-4">
        Enregistré uniquement dans ce navigateur. Utilisez « Exporter » pour sauvegarder ou partager votre carte.
      </p>
    </div>
  );
}

function ToolbarButton({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="w-9 h-9 flex items-center justify-center rounded-full text-oui-muted hover:text-white hover:bg-oui-card-hover transition-colors"
    >
      {children}
    </button>
  );
}

function AddNodeButton({ color, label, onClick }: { color: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-white shadow-card transition-opacity hover:opacity-90"
      style={{ background: `${color}` }}
    >
      <Plus size={14} />
      Besoin pour {label}
    </button>
  );
}

function PersonNameInput({ color, value, onChange }: { color: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs text-white border-b border-transparent focus:border-oui-border outline-none w-32"
        placeholder="Prénom"
      />
    </div>
  );
}

function NodePanel({
  node,
  personNames,
  onChange,
  onDelete,
  onClose,
}: {
  node: Node<NeedNodeData>;
  personNames: PersonNames;
  onChange: (patch: Partial<NeedNodeData>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <PanelHeader onClose={onClose} />

      <div>
        <FieldLabel>Personne</FieldLabel>
        <div className="flex gap-2">
          {(['A', 'B'] as PersonKey[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ person: p })}
              className={`flex-1 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
                node.data.person === p ? 'border-white/40 text-white' : 'border-oui-border text-oui-muted'
              }`}
              style={{ background: node.data.person === p ? `${PERSON_COLORS[p]}33` : 'transparent' }}
            >
              {personNames[p]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Besoin</FieldLabel>
        <input
          value={node.data.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="w-full bg-oui-bg border border-oui-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-oui-violet"
        />
      </div>

      <div>
        <FieldLabel>Précisions</FieldLabel>
        <textarea
          value={node.data.note}
          onChange={(e) => onChange({ note: e.target.value })}
          rows={5}
          placeholder="Ce que ce besoin veut dire concrètement, des exemples, ce qui aide…"
          className="w-full bg-oui-bg border border-oui-border rounded-lg px-3 py-2 text-sm text-oui-text outline-none focus:border-oui-violet resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <FieldLabel>Comblé en ce moment</FieldLabel>
          <span className="text-xs text-oui-muted">{node.data.satisfaction}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={node.data.satisfaction}
          onChange={(e) => onChange({ satisfaction: Number(e.target.value) })}
          className="w-full accent-oui-violet"
        />
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-red-300 border border-red-400/30 rounded-lg py-2 hover:bg-red-400/10 transition-colors"
      >
        <Trash2 size={14} />
        Supprimer ce besoin
      </button>
    </div>
  );
}

function EdgePanel({
  edge,
  onChange,
  onDelete,
  onClose,
}: {
  edge: Edge<StrengthEdgeData>;
  onChange: (patch: Partial<StrengthEdgeData>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const strength = edge.data?.strength ?? 2;
  const strengthLabels: Record<1 | 2 | 3, string> = { 1: 'Faible', 2: 'Moyen', 3: 'Fort' };

  return (
    <div className="flex flex-col gap-4">
      <PanelHeader onClose={onClose} title="Lien entre deux besoins" />

      <div>
        <FieldLabel>Force du lien</FieldLabel>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ strength: s })}
              className={`flex-1 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
                strength === s ? 'border-white/40 text-white bg-white/10' : 'border-oui-border text-oui-muted'
              }`}
            >
              {strengthLabels[s]}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-oui-subtle mt-2 leading-relaxed">
          Plus le lien est fort, plus la réponse à ce besoin aide concrètement à répondre à l&apos;autre.
        </p>
      </div>

      <div>
        <FieldLabel>Note sur ce lien (optionnel)</FieldLabel>
        <input
          value={edge.data?.label ?? ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="ex: quand c'est comblé, ça apaise…"
          className="w-full bg-oui-bg border border-oui-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-oui-violet"
        />
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-red-300 border border-red-400/30 rounded-lg py-2 hover:bg-red-400/10 transition-colors"
      >
        <Trash2 size={14} />
        Supprimer ce lien
      </button>
    </div>
  );
}

function PanelHeader({ onClose, title = 'Ce besoin' }: { onClose: () => void; title?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="w-7 h-7 flex items-center justify-center rounded-full text-oui-muted hover:text-white hover:bg-oui-card-hover transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-semibold uppercase tracking-wide text-oui-subtle mb-1.5">{children}</label>;
}
