'use client';

import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
import type { StrengthEdgeData } from './types';

export function strengthToWidth(strength: 1 | 2 | 3) {
  return 2 + strength * 2; // 4, 6, 8
}

export function strengthToDashDuration(strength: 1 | 2 | 3) {
  return 2.6 - strength * 0.5; // liens forts = flux plus rapide
}

export function StrengthEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
  selected,
}: EdgeProps & { data: StrengthEdgeData }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strength = data.strength ?? 2;
  const satisfaction = data.sourceSatisfaction ?? 50;
  const opacity = 0.35 + (satisfaction / 100) * 0.65;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: strengthToWidth(strength),
          opacity: selected ? 1 : opacity,
          strokeDasharray: 7,
          animation: `needs-edge-dash ${strengthToDashDuration(strength)}s linear infinite`,
        }}
      />
      {data.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute text-[10px] font-medium text-oui-text bg-oui-bg/90 border border-oui-border rounded-full px-2 py-0.5 pointer-events-none"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
