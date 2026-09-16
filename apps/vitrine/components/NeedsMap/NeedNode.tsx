'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { NeedNodeData, PersonNames } from './types';

export const PERSON_COLORS: Record<'A' | 'B', string> = {
  A: '#8b5cf6', // oui-violet
  B: '#ec4899', // oui-pink
};

const handleStyle = (accent: string) => ({
  width: 10,
  height: 10,
  background: accent,
  border: '2px solid #0d0714',
});

function NeedNodeInner({ data, selected }: NodeProps & { data: NeedNodeData }) {
  const accent = PERSON_COLORS[data.person];
  const personLabel = data.personName ?? (data.person === 'A' ? 'Personne A' : 'Personne B');

  return (
    <div
      className="w-64 rounded-2xl border-2 p-4 cursor-pointer select-none transition-shadow"
      style={{
        borderColor: selected ? accent : `${accent}55`,
        background: 'rgba(26, 17, 40, 0.92)',
        boxShadow: selected
          ? `0 0 0 3px ${accent}40, 0 8px 30px ${accent}33`
          : '0 4px 20px rgba(0,0,0,0.35)',
      }}
    >
      <Handle id="t-top" type="target" position={Position.Top} style={handleStyle(accent)} />
      <Handle id="t-left" type="target" position={Position.Left} style={handleStyle(accent)} />

      <span
        className="block text-[11px] font-semibold uppercase tracking-wide mb-2"
        style={{ color: accent }}
      >
        {personLabel}
      </span>

      <p className="text-sm font-semibold text-white leading-snug mb-3 break-words">
        {data.label}
      </p>

      {data.note && (
        <p className="text-xs text-oui-muted leading-relaxed mb-3 line-clamp-3">{data.note}</p>
      )}

      <MiniBar label="Comblé" value={data.satisfaction} color={accent} />

      {typeof data.incomingSupport === 'number' && (
        <div className="mt-2">
          <MiniBar label="Soutien reçu" value={data.incomingSupport} color="#f8fafc" faint />
        </div>
      )}

      <Handle id="s-bottom" type="source" position={Position.Bottom} style={handleStyle(accent)} />
      <Handle id="s-right" type="source" position={Position.Right} style={handleStyle(accent)} />
    </div>
  );
}

function MiniBar({ label, value, color, faint }: { label: string; value: number; color: string; faint?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] text-oui-subtle mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className={`h-1.5 rounded-full overflow-hidden ${faint ? 'bg-white/5' : 'bg-white/10'}`}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: faint ? `${color}55` : color }}
        />
      </div>
    </div>
  );
}

export const NeedNode = memo(NeedNodeInner);

export function withPersonName<T extends { data: NeedNodeData }>(node: T, personNames: PersonNames): T {
  return { ...node, data: { ...node.data, personName: personNames[node.data.person] } };
}
