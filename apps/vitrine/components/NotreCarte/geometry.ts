import { NODE_W, NODE_H } from './constants';
import type { CarteNode } from './types';

export interface EdgeGeom {
  d: string;
  head: string;
}

export function edgeGeom(a: CarteNode, b: CarteNode): EdgeGeom {
  const ax = a.x + NODE_W / 2;
  const ay = a.y + NODE_H / 2;
  const bx = b.x + NODE_W / 2;
  const by = b.y + NODE_H / 2;

  const clip = (cx: number, cy: number, tx: number, ty: number): [number, number] => {
    const dx = tx - cx;
    const dy = ty - cy;
    if (!dx && !dy) return [cx, cy];
    const sx = dx ? (NODE_W / 2 + 6) / Math.abs(dx) : Infinity;
    const sy = dy ? (NODE_H / 2 + 6) / Math.abs(dy) : Infinity;
    const s = Math.min(sx, sy);
    return [cx + dx * s, cy + dy * s];
  };

  const p0 = clip(ax, ay, bx, by);
  const p1 = clip(bx, by, ax, ay);
  const mx = (p0[0] + p1[0]) / 2;
  const my = (p0[1] + p1[1]) / 2;
  const nx = -(p1[1] - p0[1]);
  const ny = p1[0] - p0[0];
  const len = Math.hypot(nx, ny) || 1;
  const bow = Math.min(46, len * 0.12);
  const cx = mx + (nx / len) * bow;
  const cy = my + (ny / len) * bow;
  const ang = Math.atan2(p1[1] - cy, p1[0] - cx);
  const hs = 9;
  const head = [
    [p1[0], p1[1]],
    [p1[0] - hs * Math.cos(ang - 0.4), p1[1] - hs * Math.sin(ang - 0.4)],
    [p1[0] - hs * Math.cos(ang + 0.4), p1[1] - hs * Math.sin(ang + 0.4)],
  ]
    .map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1))
    .join(' ');

  return {
    d: `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`,
    head,
  };
}
