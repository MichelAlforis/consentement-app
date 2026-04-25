'use client';

import {
  useRef, useMemo, useState, useEffect, useCallback,
  Suspense, Component, type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, SelectiveBloom, Vignette, Selection, Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { DynamicIcon } from '../../utils/iconFromName';
import type { GainedCard } from '../../lib/computeGainedCards';

// ─── Eases ────────────────────────────────────────────────────────────────────

// easeOutBack c1=1.0 → ~3.7% overshoot, snap sec sans oscillation
function easeOutSnap(t: number): number {
  return 1 + 2 * Math.pow(t - 1, 3) + Math.pow(t - 1, 2);
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

// ─── ICON_NODES — Path2D Lucide (même pipeline que Board.tsx) ────────────────

type SvgNode = ['path' | 'circle' | 'rect' | 'polygon' | 'line', Record<string, string>];

const ICON_NODES: Record<string, SvgNode[]> = {
  MessageCircle:  [['path', { d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' }]],
  Heart:          [['path', { d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' }]],
  Star:           [['polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }]],
  Crown:          [['path', { d: 'M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z' }]],
  Sparkles: [
    ['path', { d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' }],
    ['path', { d: 'M20 3v4' }], ['path', { d: 'M22 5h-4' }],
    ['path', { d: 'M4 17v2' }], ['path', { d: 'M5 18H3' }],
  ],
  Flame:    [['path', { d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' }]],
  Zap:      [['path', { d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z' }]],
  Eye: [
    ['path', { d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' }],
    ['circle', { cx: '12', cy: '12', r: '3' }],
  ],
  Lock: [
    ['rect', { x: '3', y: '11', width: '18', height: '11', rx: '2' }],
    ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' }],
  ],
  Gift: [
    ['rect', { x: '3', y: '8', width: '18', height: '4', rx: '1' }],
    ['path', { d: 'M12 8v13' }],
    ['path', { d: 'M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7' }],
    ['path', { d: 'M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5' }],
  ],
  Music: [
    ['path', { d: 'M9 18V5l12-2v13' }],
    ['circle', { cx: '6', cy: '18', r: '3' }],
    ['circle', { cx: '18', cy: '16', r: '3' }],
  ],
  Wind: [
    ['path', { d: 'M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2' }],
    ['path', { d: 'M9.6 4.6A2 2 0 1 1 11 8H2' }],
    ['path', { d: 'M12.6 19.4A2 2 0 1 0 14 16H2' }],
  ],
  Handshake: [
    ['path', { d: 'm11 17 2 2a1 1 0 1 0 3-3' }],
    ['path', { d: 'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4' }],
    ['path', { d: 'm21 3 1 11h-2' }],
    ['path', { d: 'M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3' }],
    ['path', { d: 'M3 4h8' }],
  ],
};

function drawIconNodes(
  ctx: CanvasRenderingContext2D,
  iconName: string,
  cx: number, cy: number,
  sizePx: number,
  color: string,
) {
  const nodes = ICON_NODES[iconName];
  if (!nodes) return;
  const scale = sizePx / 24;
  ctx.save();
  ctx.translate(cx - sizePx / 2, cy - sizePx / 2);
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = 4.2 / scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const [tag, a] of nodes) {
    ctx.beginPath();
    if (tag === 'path') {
      const p = new Path2D(a.d);
      if (a.fill && a.fill !== 'none') ctx.fill(p); else ctx.stroke(p);
    } else if (tag === 'polygon') {
      const pts = a.points.trim().split(/[\s,]+/).map(Number);
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.closePath(); ctx.stroke();
    } else if (tag === 'circle') {
      ctx.arc(parseFloat(a.cx), parseFloat(a.cy), parseFloat(a.r), 0, Math.PI * 2);
      if (a.fill === 'true') ctx.fill(); else ctx.stroke();
    } else if (tag === 'rect') {
      const rx = parseFloat(a.rx ?? '0');
      const [x, y, w, h] = [a.x, a.y, a.width, a.height].map(parseFloat);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ctx as any).roundRect?.(x, y, w, h, rx) ?? ctx.rect(x, y, w, h);
      ctx.stroke();
    } else if (tag === 'line') {
      ctx.moveTo(parseFloat(a.x1), parseFloat(a.y1));
      ctx.lineTo(parseFloat(a.x2), parseFloat(a.y2));
      ctx.stroke();
    }
  }
  ctx.restore();
}

function buildIconTexture(iconName: string): THREE.CanvasTexture | null {
  if (!ICON_NODES[iconName]) return null;
  const S = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, S, S);
  drawIconNodes(ctx, iconName, S / 2, S / 2, S, 'rgba(255,255,255,0.96)');
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const iconCache = new Map<string, THREE.CanvasTexture | null>();
function getCachedIcon(name: string): THREE.CanvasTexture | null {
  if (!iconCache.has(name)) iconCache.set(name, buildIconTexture(name));
  return iconCache.get(name) ?? null;
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function parseGradient(gradient: string): [string, string] {
  const m = gradient.match(/#[0-9a-fA-F]{6}/g) ?? ['#7c3aed', '#a855f7'];
  return [m[0], m[1] ?? m[0]];
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function makeRoundedCardGeometry(w: number, h: number, r: number): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  const hw = w / 2, hh = h / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  shape.closePath();
  const geo = new THREE.ShapeGeometry(shape, 8);
  // Three.js ≥0.163 uses raw vertex.x/y as UVs (no normalization).
  // Remap from shape space [-hw..hw, -hh..hh] → [0..1, 0..1].
  const pos = geo.attributes.position;
  const uv  = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + hw) / w, (pos.getY(i) + hh) / h);
  }
  uv.needsUpdate = true;
  return geo;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number, maxWidth: number, lineHeight: number,
  stroke = false,
) {
  const words = text.split(' ');
  let line = '';
  const drawLine = (l: string, ly: number) => {
    if (stroke) ctx.strokeText(l, x, ly);
    ctx.fillText(l, x, ly);
  };
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      drawLine(line, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) drawLine(line, y);
}

// ─── Textures ─────────────────────────────────────────────────────────────────

// prettier-ignore
const BACK_SYMBOL_PATH =
  'm133 0 2 2q3 0 3 3 0 2 1 1h1q2 3 4 2 3-1 2 2 0 2 1 1 3 0 1 1h-2l-2 1-3 1-4 7q1 2 3-2 0-3 2-3 3 0 2 2h-1v-1l-2 3-3 3q-2 0-1 4 1 2-4 2l-2 2q0 3 2 2l3-1-5 3q-5 1-5 3 1 3-2 2-1-3 4-6 3 0 1-1c-2-1-7 2-6 3v4l-2 5q-2 5 1 3 2 0 1-2l2-2q6-3 1 1l-2 4-3 1-2 1-1 1q-3 0-1 2c1 1-3 6-5 5-1-1-7 8-8 11l-1 3-1-1v-1l-2 1-3 1-1 1 1 1-1 1-4 1q-2 0 0 0 2 3-3 5-2 0-2 3l-2 2-2 1q1 2-2 4l-2 4q0 3-2 3l-1 2q1 2-1 3-3 2-3 6v4l-1 1v2q3-1 0 3v3l1 2-6 6-7 6-4 5q-5 4-10 13a90 90 0 0 0-13 26l-5 21-1 12-2 6v1q4 0 1 2v7l-2 1v1l1 1-2 1c-2 0-3-8-1-9q3-2-1-2-2 0-2-3l1-4q1-1-1-1l-1-1 1-5-1 1a174 174 0 0 0-1 40v2q2 3-1 5l-1 2h1l3 3v4l-2 1-1 1h2q5-1 1 3-3 2 0 2t0 2l-1 2h1l2 1-3 2q-3 1-4-3l-1-3v-5q1-2-1-2l-3-2v-4l-1-2q0-2-2-2l-1-1 1-4q2-3-2-2-4-1-3 4l1 3 1 1-1 1-1 1 2 6a221 221 0 0 0 13 54l1 2 2 5 2 5 1 2 3 6 2 7 1 2 2 2v3l1 2q2 2 1 3l1 1 1 2 1 2 1 3q0 2 2 2 2-1 2 2l2 2q2 0 1 2l1 2q2 0 1 3 0 3 2 3l2 1h1q3-1-1 2-2 3 1 1 4 1 2 4l2 1v2l2 2 1 1q3-2 2 4 0 2 3 2 2 1 1 2l1 2 2 1q0 2 1 1 2 0 1 1-1 2 2 2l2 3 2 3q4 1 1 2-3 3 3 2 2 0 1 1l1 2v1l1 2 1 1q0 3 1 0l2-1v1c0 1 2 6 3 5l1 1 2 2 3 1c1 3 6 9 8 9q2 0 1 1l2 2c2 1 6 5 4 5l1 2 3 2h1c-1 1 1 5 2 4h1l-2 1-3 1q-2 3 1 1 4-1 0 3-4 3-2 0 0-2-1-1l-2 4q0 8-3 8-4 0-5 7-1 3-4 3l-2 2h2l2 1q2 1 0 0l-2 1v3l-7 3h3l3 1-3 1q-4 0 0 2v1l-2 1-3 1h-2q1-1-1-1h-2q1 3 4 3l1 1q0 2-2 1l-1 1-3 2v-3l-3 2-1 3q-3-1-3 1l1 2v-1l1-2 1 2q1 2-1 2-4 3 1 2t1 3-3 0q1-1-1-1l-6 3 1 3 1 1 2-1c0-2 5-2 7-1l1 2q-5-1-6 2l-1 2-3 1h-2l-2 1q-1 2-3 1l-1 1 1 1 2 1-3 1q-3-1-3 2l-1 1-1 1q0 3 4-1l1-2h2q3-2 2-3l1-2q2 0 1 1-1 2 3-1 1-3 1 0-2 4-6 6l-1 1h2q3 0 0 3h-1q2-1-2-1-4 1-3 4 0 3-2 3v2l-1 2-2 1h2q3-2 3 1l-6 2v2l3 2q2 0 0 0l-1 1-3 2-3 2-1 1q0 3 1 1l3-1q3-1 0 2l-3 1-1 1q0 2-3 2l-3 1q0 2 2 1l3-1-1 1q-2 2 1 3l-2 1q-6 3 0 2 3 0 0 1-4 3-1 6 2 1-1 2t-1 2v1l-2 1h1l2 1-2 1-2 2-2 3-1 2v6q2 0-1 3-4 4-2 4h3l2 1-2 1-2 1-2 2-1 1-2 2-1 2q0 3 1 0l3-1v2l-2 3 3 1q6-2 8-8l1-2q3 0 1 2-5 8-10 10-9 3-7 5l4-2q4-5 3 0-2 3 1 2l3-1 2-1 3-1q2 2-6 5-6 1-7 6-1 4-5 4l-3 1h2l2 1v1l-1 1-1 1q-2 0-1 1 1 3 3 0l3-2q3 0 1 1v2q2 1 2-3l1 1q3 3 3 0-2-1 1-1 3 1-3 4-7 4-6 1 0-3-4 0t0 2q3-3 3-1l-3 3q-3 2-1 3l2-1 1-1 2-2h1l-1 3q-2 2 2 1 3-1 2-3l1-3 1 1 2 1v1q-2-1-2 2 0 2-1 1l-6 5q1 1 3-1l5-2h2l-2 2-2 4-3 5q-4 4-2 4l2 1 1 1q2 0 2 2 0 3-2 3l-1-2q1-1-1-1-4 0 1 4 3 2 1 2l-2 1q-1 1 1 1 3-2 0 1l-3 2-2 2q-3 3-1 3l2-2 2-1v3h-1l-1 1-2 1h-2q0 3 4 1 7-3 1 1l-3 2q1 2-2 2-5 3 1 1 5 0 2 2l-4 1-1 1 1 1q4-1 4 2h-1l-3-1-1 2h2l1 1-3 1-2 1 1 1h7v3q-3 4 0 4t1 1h-2l-1-1-1 1v2q-3 3 2 1h2l-1 1-3 2q-2 5 1 3 3-1 0 3-4 3-2 0 1-3 0 0l-2 2-2 3q-3 2 0 0c2 0 7 1 5 2h-1l-2 1v5l1 2v6l-2 2 2-1q7-3 3 1l-1 3-1 3q-4 8 0 2 5-4 3 0 0 3-2 3l-1 1 1 2q3 0 0 3v3h1q2-2 3 1 0 2-2 1l-1 1 2 2q2 0 0 0l-1 2q0 2 1 1 2 0 1 1l1 3 1 2c-1 2 1 16 2 16v6l1 5 2 5 1 6 1 4 1 3 1 3q2 2-1 3l-1 1h2l2 3 1 5 1 4q1 7 4 9l1 3 1 3 1 1 1 2v1l1 2v2q-2 1 1 1 3-1 2 2v2l3 5 2 4 1 2q-1 2 1 2l2 1-2 1-1 1h2q2-1 2 2l1 2q3 1-1 5h1q4-1 6 5l3 4 1 2 1 2q2 0 2 2l3 3 2 2 2 3 2 2 2 2 1 2q-1 1 1 3l2 3 3 4 2 3 1 2v2l1 3 4 8 2 2 2 3 1 2 2 2 2 4q2 2 1 4l2 1q2 0 1 3l1 2 3 4 4 5 1 2 2 3 6 7 5 6q3 1-3-6l-4-6-3-4-3-5-3-5-6-10-5-8-2-3q1-2-1-2l-1-1v-2l-3-6-2-5q-2-1 1-1 2 0-2-3l-3-4-2-5-1-2-7-17-1-5-1-3-2-6-2-6-2-5-2-6-4-11-2-8-2-8-7-38a1027 1027 0 0 1 3-125l2-6v-5l2-7 3-10 1-7 2-4v-3l1-3 1-1v-4l3-9 2-7 1-3 8-19 3-9 6-13 2-7 2-3 3-7 7-13 5-9 6-10 1-2 4-8 6-10 3-3q2 0 1-2l4-7 7-9 4-5 1-1 4-6 3-4 2 2 4 2 1 1 1 1 3 1 2 2 1 1q-2 2 1 1l3 1 2 1 2 1q0 3 1 1 1-3 1 0l1 2q2 0 1 1 0 2 1 1l1 1 1-1q3-3 2 1 0 3 1 1l1-1 1 1v1q4 1 4 3 0 3 2 1h3v2l-2 2 2-1q5-3 5 2 0 4 2 1 2-2 5 1l2 3h2l2 1 3 2 5 3 4 1 1 1 2 1 2 2 2 2q2 0 1 1h1l2 1h2l3 2q2 3 3 2 2 0 1 1 0 2 3 2l4 2 2 1 3 1 2 2 3 1q5 4 6 3l4 2 6 3 5 3 6 3 2 2 1 1 7 2q10 5 6 1l-5-1-1-2-2-1-1-1-2-1q-6-2-8-5v-1q-5 0-5-2h-4 1l1-2h-1l-2-1-1-1q-2 1-3-1l-3-1h-1l-4-3-3-2q1-3-1-5-3-1-2-3-2-2-5 1t-7 0l-2-2q-1 1-2-1 0-3 2-1t4 1v1l1 2q3 2 1-1 0-2 1 0l1 1q1-3-1-4h-1l-2-1-1-1-2-1h-2q2-3-4-4-3 1-2-1l-1-1-2-1-3-2-6-1q-4-1-2-4 1-3-2-2-3 2-1-1 2-1-1-2h-3l-2-1q1-1-1-1-1 2-1-1 1-1-1-1l-1-2-1-1-1 1-1 1v-2l-2-1-4-2-3-2h-1q2-2-1-2l-2-1q0-2-4-1l-1-2-1-2-4-1h1q2 0 1-1l-4-1q-2 0-1-1l-1-1-2-2-3-2q-3 0-3-2l-2-1-1-1-1-1-5-5-1-1 3-5 39-49 5-5 3-4 20-23c0-1 6-10 13-17l16-19 7-9 3-5 2-4c3-3 14-25 16-31l5-32c0-7-3-22-5-26l-1-2q1-1-1-1v-2l-1-1-5-2-5-1-3-3-8-17-2-2q-3 0-3-2l-1-2q-3 0-1-2 1-4-2-1l-1 1-3-4-2-4-3-1h-2l-2-1q-4 1-1-2 1-1-1-2l-2 1v-1l-3-1h-1l-1-1c-1 1-3-3-2-4l-8-1h-1l1-1 2-1q-1-3-4 0h-1q1-3-2 0h-1l1-2q1-1-2-1h-2l-11-3q-1 1-2-1l-1-2-2 2v-2q0-2-1-1h-2l6-3q2 1 1-2l2-2h1l-2-1h-1l2-2q2 0 1-2 0-3 3 0 1 2 1-1l-3-2q-4 2-2-7l1-1 1 2q0 2 1 1 2-3-1-5l-1-2h5q3-2-1-2-3 1-2-1l1-1 1-1 2-5v4l2-2 1-3 2-3-2 2-2 2v-2l-1-2h-1l-3 6v-2q2-3-1-1-4-1-1-3l1 1 1 1c1 0 5-4 4-5l-2 1q-4 3-3 1h-2q-7 2-2-1l7-2q6 0 4 1 0 3 2 0l3-2 1-1-1-1-7 1-7 1h-2l4-2 4-2q0-3-3 0l-4 1-4 1q-1 1-1-1l2-1 6-2 3-2-1-1 1-1 2-1q1-3-4 0l-1 2-1 1c-2 2-8 2-7 0l3-1q4-2 5-5 0-2-2 1l-4 2q-2 0 1-2l2-2h-2q-3-1-3 2l-1 2-1-3v-1h-2q0-2 4-2 1 0 0 0l-2-1-1-1q1-1-1-3l-3-3 3 1h2l-2-2q-5-1 0-3l4 1v-1l1-4v-1l-2 2q-1 4-2-2l-1-5q-1-3 3-3l2-1q2-4-1-1h-2v-2q4-2 0-3t-1-2l2-1 2-1-2-1q-2 1-3-1 0-2-2-2h-2q0-2 8-2 4 1-1-2-7-2-11 1h-3c-4 1-13 6-17 10q-9 10-10 22l1 10q2 2-1 7l-3 5q-4 3-3 8c0 2 6 5 8 5q3 0 1 5-1 7 2 8v2q-2 7 1 8t0 8q-5 10 7 10a147 147 0 0 1 36 9c1-1 11 6 14 8l2 2c1-1 12 11 13 15l4 4 1 4 1 2 1 2 1 2 1 3 1 2 1 1q-1 10 2 10v6l1 2h1l-2 11-1 10-1 3-2 2-3 1h3q3 0-2 5l-4 5v1l-1-2-1-1q-3 1-5 6l-3 3q-3 1-1 3 3 2 0 2l-4 2-1 1h2l2 1-3 1q-5 1-6 4l-1 1-1 1q1 1 0 0l-6 4v2l2-2 4-2q6 0 1 1-7 3-8 6 0 3-1 2-1-2-3 1v2q3 0 0 2l-3 2 1-1 1-2-2 1-1 2q1 1-2 3t-4 5q1 2 3-1 1-3 2 0c0 2-6 5-7 3h2c0-3-4-2-4 0l-2 1-2 3q0 4-3 6-2 3-2 1 1-3-2 1v3q-2 3 3 0l3-2c0 1-6 7-8 7l-2 1-3 1-1 3-2 2-1 1-3 2h-1l-2 6q-4 1-3 3l-1 2v1l2 1-1 1c-2 0-7 6-7 7l-1 2-3 1h-2l1 1v1h-3v1l3 1 2 1-3 1-1 2q0 3-4 3-2 0 0 2c2 1-2 4-4 3l-1 1-3 3-3 1 3 1q3 0 0 1-5 0-5 2l-4 5-3 4-1 2-1-2q-1-3-2 0h-2l-2-1h-2l3-1q4-1 1-1-3-1-1-2l1-1-1-1q-4 2-4-1v-3q-2-3-3-1-3 3-2 0l2-3 2-1 2-2 1-1q-2 0-2-3 2-3 0 0l-1 3-2 1q-6 0-1-4v-1q-4 1 0-2v-1l-4-1-4-2-1-1 1-1q3-2-1-3-2 0-2-5l1-3q3 1 3-1l-3-1h-2q1-3-2 0l-1-1 1-2q2 0 2-3-1-3-4-1h-2l2-2q3-4-1-4-2 0 1-2t0-2l-2 1h-2q-3-1-1-4v-1h-2l2-1q2 0 1-2l-2-1q-2 1-2-2-1-3 3-2h2l-4-1q-4 1-2-2 4-5 5-2l-2 1-1 1h4v-6l2-1q-1-3-5 1-1 3-4 2-2-1 1-2 3 0 3-2 1-4-2-1-1 1-1-2 0-2 2-2l2-1-2-1q-2 1 1-2 2-1-1-1l-2 1-2 2q-3-1 0-7 3-3 1-3v-1q3 0 0-1h-4l-2 2q-2-1 1-6 2-1-1-1h-3l5-2 3 1h1v-2l-2-1h-1q0-5-2-5-3 4-6 3l2-2q5-2 6-6l-2 1q-6 5-7 3l1-2 2-2 1-2h1q2-1-3-1h-3l2-1 2-2-2-1h-6q-4 1 0-2c1-1 7-1 10 1h1q1-2-3-2-3 0-3-2l4-1 4-1c2-2-7-1-9 1q-6 4-1-3 5-6 1-4h-3q-2-1 1-2l2-2h-2l-1-1q1-5-3 1l-1 3 1-3q0-3 3-7l2-3-2 2-4 1-1-1h-1l3-1 2-1-2-1-2-2-1-2-1 1v1l-1-2-2-1h-1l4-1q6 1 4-3v-3h-1l-2 1-2 2h-2v-3h1q2 1 2-1-1-1 2-3l2-2-2 1q-3 1-2-1l-1-1-1-1 1-1 2-2q1-3-4 1t-3 1v-2l1-2 1-1-3 1q-1 1-1-2l1-2 1-2-2-1q-1 1 0 0 3-4 2-6l-3 1-2 1q-3-1-1-1l1-3 1-3h1v2c0 1 6-2 6-4v-1h-1l-1 1v1q-1 1-1-1l-1-2q-3 3-3 0l1-1 1-3q-1-3-1-1l-3 3-2 1q1-1-2-2h-3 3q3 0 4-3l5-2 2-1-6-1q-6 0-5 2l-1 2-1-2q1-3-1-2l-2-2 4-1 3-1q2-2-1-1-3 0-2-2l1-5q0-2 2-2v-2q-3-1-1-2l1-2-2 1-1 3q0 3-3 3h-3l2-3q4-3 1-2-2-1 1-3 2 0-1-2l-1-1-1-2v-5l-3 2-2 3v-2q2-1 1-3h1q2-1-3-4l-2-1 2-2q-1-1 2-3 3-4 1-4l-2 2-2 2q-3 1 0-3 3-3 1-3-1-1 1-6l3-5q-1-3 10-18c5-7 15-14 18-14l2-1 2-2h3l1 1 2 1 1 1v-2q0-2 3-3l3-3 1 1q3 2 2-1 1-3 17-4h5l9-1 19-2c15-2 15-2 11-10l-2-8-1-1c-2 0 0-6 2-8v-1q-4-1 0-3l1-1 3-4 4-6 2-3 2-3 1-3 1-3 1-7c1-6 2-14 1-15l-1-3-1-2-1-3-1-3v-2l-1-1v-2l-1-1q-2 0-2-3-1-4-12-13c-6-5-17-10-17-8';


function makeBackTexture(size = 512): THREE.CanvasTexture {
  const h = Math.round(size * 1.5);
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Background — quasi-noir → indigo → violet saturé
  const bg = ctx.createLinearGradient(0, 0, size, h);
  bg.addColorStop(0,    '#010007');
  bg.addColorStop(0.45, '#0c0920');
  bg.addColorStop(1,    '#3b1f85');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, h);

  // Diamond grid
  const step = Math.round(size * 0.10);
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 0.8;
  for (let ix = -step; ix < size + step; ix += step) {
    for (let iy = -step; iy < h + step; iy += step) {
      ctx.beginPath();
      ctx.moveTo(ix + step / 2, iy);
      ctx.lineTo(ix + step,     iy + step / 2);
      ctx.lineTo(ix + step / 2, iy + step);
      ctx.lineTo(ix,            iy + step / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // Halo central violet
  const halo = ctx.createRadialGradient(size / 2, h / 2, 0, size / 2, h / 2, size * 0.44);
  halo.addColorStop(0,    'rgba(124,58,237,0.48)');
  halo.addColorStop(0.55, 'rgba(76,29,149,0.18)');
  halo.addColorStop(1,    'rgba(76,29,149,0)');
  ctx.fillStyle = halo; ctx.fillRect(0, 0, size, h);

  // Vignette
  const vig = ctx.createRadialGradient(size / 2, h / 2, h * 0.25, size / 2, h / 2, h * 0.70);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.72)');
  ctx.fillStyle = vig; ctx.fillRect(0, 0, size, h);

  // Specular top-left
  const spec = ctx.createRadialGradient(size * 0.24, h * 0.14, 0, size * 0.24, h * 0.14, size * 0.38);
  spec.addColorStop(0, 'rgba(255,255,255,0.14)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec; ctx.fillRect(0, 0, size, h);

  // Shimmer diagonal
  const shim = ctx.createLinearGradient(0, 0, size, h);
  shim.addColorStop(0,    'rgba(255,255,255,0)');
  shim.addColorStop(0.48, 'rgba(255,255,255,0.055)');
  shim.addColorStop(0.52, 'rgba(255,255,255,0.09)');
  shim.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = shim; ctx.fillRect(0, 0, size, h);

  // Symbole — gradient top→bottom #ddd6fe → #a78bfa → #6d28d9
  const symS = Math.min(size / 336, h / 1044) * 0.85;
  const symOX = (size - 336 * symS) / 2;
  const symOY = (h - 1044 * symS) / 2;
  const symH = 1044 * symS;
  const symGrad = ctx.createLinearGradient(0, symOY, 0, symOY + symH);
  symGrad.addColorStop(0,    '#ddd6fe');
  symGrad.addColorStop(0.45, '#a78bfa');
  symGrad.addColorStop(1,    '#6d28d9');
  ctx.save();
  ctx.translate(symOX, symOY);
  ctx.scale(symS, symS);
  ctx.fillStyle = symGrad;
  ctx.globalAlpha = 0.72;
  ctx.fill(new Path2D(BACK_SYMBOL_PATH), 'evenodd');
  ctx.globalAlpha = 1;
  ctx.restore();

  // Border blanc — contraste net contre le fond violet
  roundedRectPath(ctx, 4, 4, size - 8, h - 8, 22);
  const brd = ctx.createLinearGradient(0, 0, size, h);
  brd.addColorStop(0,   'rgba(255,255,255,0.55)');
  brd.addColorStop(0.5, 'rgba(255,255,255,0.18)');
  brd.addColorStop(1,   'rgba(255,255,255,0.55)');
  ctx.strokeStyle = brd;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function makeFaceTexture(card: GainedCard, size = 512): THREE.CanvasTexture {
  const h = Math.round(size * 1.5);
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const [c1, c2] = parseGradient(card.gradient);
  const bg = ctx.createLinearGradient(0, 0, size, h);
  bg.addColorStop(0, c1);
  bg.addColorStop(1, c2);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, h);

  // Grain (identique Pawn3D Board)
  for (let y = 0; y < h; y++) {
    const a = 0.02 + 0.04 * Math.sin(y * 0.8 + Math.random() * 0.6);
    ctx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`;
    ctx.fillRect(0, y, size, 1);
  }
  for (let i = 0; i < 650; i++) {
    ctx.fillStyle = `rgba(255,255,255,${(0.02 + Math.random() * 0.05).toFixed(3)})`;
    ctx.fillRect(Math.random() * size, Math.random() * h, 1, 1);
  }

  // Highlight spéculaire top-left (réduit — évite le blow-out PBR)
  const spec = ctx.createRadialGradient(size * 0.25, h * 0.13, 0, size * 0.25, h * 0.13, size * 0.65);
  spec.addColorStop(0, 'rgba(255,255,255,0.08)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec; ctx.fillRect(0, 0, size, h);

  // Vignette bords
  const vig = ctx.createRadialGradient(size / 2, h / 2, h * 0.22, size / 2, h / 2, h * 0.78);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.42)');
  ctx.fillStyle = vig; ctx.fillRect(0, 0, size, h);

  // Common — arcs concentriques géométriques (très basse opacity)
  if (card.rarity === 'common') {
    const arcCx = size * 0.5;
    const arcCy = h * 1.05;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 1.2;
    for (let i = 2; i < 14; i++) {
      ctx.globalAlpha = Math.max(0, 0.040 - i * 0.0018);
      ctx.beginPath();
      ctx.arc(arcCx, arcCy, size * i * 0.11, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // Rare — nébuleuse radiale indigo/violet (3 blobs superposés)
  if (card.rarity === 'rare') {
    const n1 = ctx.createRadialGradient(size * 0.50, h * 0.40, 0, size * 0.50, h * 0.40, size * 0.58);
    n1.addColorStop(0,    'rgba(109,40,217,0.42)');
    n1.addColorStop(0.55, 'rgba(76,29,149,0.16)');
    n1.addColorStop(1,    'rgba(76,29,149,0)');
    ctx.fillStyle = n1; ctx.fillRect(0, 0, size, h);

    const n2 = ctx.createRadialGradient(size * 0.28, h * 0.58, 0, size * 0.28, h * 0.58, size * 0.42);
    n2.addColorStop(0, 'rgba(124,58,237,0.26)');
    n2.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.fillStyle = n2; ctx.fillRect(0, 0, size, h);

    const n3 = ctx.createRadialGradient(size * 0.74, h * 0.32, 0, size * 0.74, h * 0.32, size * 0.34);
    n3.addColorStop(0, 'rgba(167,139,250,0.20)');
    n3.addColorStop(1, 'rgba(167,139,250,0)');
    ctx.fillStyle = n3; ctx.fillRect(0, 0, size, h);
  }

  // Unique — compression luminance + highlight directionnel + flamme chaude bas
  if (card.rarity === 'unique') {
    const lum = ctx.createRadialGradient(size / 2, h * 0.48, 0, size / 2, h * 0.48, h * 0.52);
    lum.addColorStop(0,   'rgba(0,0,0,0.28)');
    lum.addColorStop(0.6, 'rgba(0,0,0,0)');
    lum.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = lum; ctx.fillRect(0, 0, size, h);

    const hlt = ctx.createLinearGradient(0, 0, size, h);
    hlt.addColorStop(0,    'rgba(255,255,255,0.11)');
    hlt.addColorStop(0.45, 'rgba(255,255,255,0.025)');
    hlt.addColorStop(1,    'rgba(0,0,0,0.055)');
    ctx.fillStyle = hlt; ctx.fillRect(0, 0, size, h);

    // Flamme — gradient chaud depuis le bas
    const flame = ctx.createLinearGradient(0, h * 0.45, 0, h);
    flame.addColorStop(0,    'rgba(245,158,11,0)');
    flame.addColorStop(0.45, 'rgba(245,158,11,0.07)');
    flame.addColorStop(0.75, 'rgba(239,68,68,0.10)');
    flame.addColorStop(1,    'rgba(120,40,10,0.18)');
    ctx.fillStyle = flame; ctx.fillRect(0, 0, size, h);

    // Tendrilles sinusoïdaux
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      const startX = size * (0.12 + i * 0.19);
      ctx.strokeStyle = `rgba(245,158,11,${(0.05 + (i % 2) * 0.02).toFixed(2)})`;
      ctx.beginPath();
      let first = true;
      for (let y = h; y > h * 0.35; y -= 3) {
        const x = startX + Math.sin(y * 0.06 + i * 1.1) * (size * 0.06);
        if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }


  // Couleur adaptée à la luminance du fond — partagée par icône ET texte
  const lm = (rgb: number[]) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  const toRgb01 = (hex: string) => [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
  const avgLum   = (lm(toRgb01(c1)) + lm(toRgb01(c2))) / 2;
  const inkColor = '#f1f3f5';
  const textShad = avgLum > 0.38 ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.85)';

  const iconCy = h * 0.30;
  const iconR  = size * 0.165;

  // Icône
  drawIconNodes(ctx, card.iconName, size / 2, iconCy, iconR * 1.6, inkColor);

  // Séparateur
  const sepY   = iconCy + iconR * 1.72;
  const sepPad = size * 0.14;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sepPad, sepY);
  ctx.lineTo(size - sepPad, sepY);
  ctx.stroke();

  // Texte
  ctx.font = `500 ${Math.round(size * 0.094)}px system-ui, sans-serif`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ctx as any).letterSpacing = `${Math.round(size * 0.008)}px`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(0,0,0,0.30)';
  ctx.lineWidth   = Math.round(size * 0.0028);
  ctx.fillStyle   = inkColor;
  ctx.shadowColor = textShad;
  ctx.shadowBlur  = size * 0.018;
  wrapText(ctx, card.text, size / 2, h * 0.58, size - size * 0.18, size * 0.134, true);
  ctx.shadowBlur = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ctx as any).letterSpacing = '0px';

  // Bordure — rare/unique épais (Bloom), common discret
  ctx.strokeStyle = card.border;
  ctx.lineWidth = card.rarity === 'common' ? 2.5 : 5;
  roundedRectPath(ctx, 4, 4, size - 8, h - 8, 22);
  ctx.stroke();

  // Badge rareté
  if (card.rarity !== 'common') {
    const bw = size * 0.39, bh = h * 0.075;
    const bx = size * 0.575, by = h * 0.046;
    roundedRectPath(ctx, bx, by, bw, bh, 12);
    if (card.rarity === 'unique') {
      ctx.fillStyle = '#2b1e0f';
      ctx.fill();
      // Filet doré sur le pourtour du badge
      ctx.strokeStyle = 'rgba(246,211,106,0.55)';
      ctx.lineWidth = 1.5;
      roundedRectPath(ctx, bx, by, bw, bh, 12);
      ctx.stroke();
    } else {
      const badgeGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
      badgeGrad.addColorStop(0, '#7c3aed'); badgeGrad.addColorStop(1, '#a855f7');
      ctx.fillStyle = badgeGrad;
      ctx.fill();
    }
    ctx.fillStyle = card.rarity === 'unique' ? '#f6d36a' : 'white';
    ctx.font = `600 ${Math.round(size * 0.069)}px system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(card.rarity === 'unique' ? 'UNIQUE' : 'RARE', bx + bw / 2, by + bh / 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Particles unique ─────────────────────────────────────────────────────────

function UniqueParticles() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 12;

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2;
      pos[i * 3]     = Math.cos(angle) * 0.72;
      pos[i * 3 + 1] = Math.sin(angle) * 1.08;
      pos[i * 3 + 2] = 0.01;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * 0.22;
    (ref.current.material as THREE.PointsMaterial).opacity = 0.55 + Math.sin(t * 1.8) * 0.18;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#f6d36a" size={0.042} transparent opacity={0.65} sizeAttenuation toneMapped={false} />
    </points>
  );
}

// ─── CardMesh ─────────────────────────────────────────────────────────────────

function CardMesh({
  card, isFlipped, autoFlip, onFlipComplete,
}: {
  card: GainedCard;
  isFlipped: boolean;
  autoFlip?: boolean;
  onFlipComplete?: () => void;
}) {
  const outerRef  = useRef<THREE.Group>(null); // world-space arc + Z wobble
  const flipRef   = useRef<THREE.Group>(null); // rotation Y (le flip)
  const styleRef  = useRef<THREE.Group>(null); // squash-stretch atterrissage
  const iridAngle = useRef(0);
  const idleT     = useRef(0);

  const geometry      = useMemo(() => makeRoundedCardGeometry(1, 1.5, 0.086), []);
  const glowGeometry  = useMemo(() => makeRoundedCardGeometry(1.06, 1.58, 0.092), []);
  const glowGeometry2 = useMemo(() => makeRoundedCardGeometry(1.14, 1.68, 0.098), []);
  const backTex  = useMemo(() => makeBackTexture(), []);
  const faceTex  = useMemo(() => makeFaceTexture(card), [card]);

  const isUnique = card.rarity === 'unique';
  const isRare   = card.rarity === 'rare';

  const glowMat2Ref = useRef<THREE.MeshBasicMaterial>(null);
  const revealAnim  = useRef({ active: true, elapsed: 0, duration: 0.4 });

  // MeshBasicMaterial — texture affichée exactement, aucune dépendance lumière, zéro hotspot
  const backMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: backTex }),
    [backTex],
  );

  const faceMat = useMemo((): THREE.Material =>
    new THREE.MeshBasicMaterial({ map: faceTex }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [faceTex]);

  const anim = useRef({
    active: false, startRot: 0, targetRot: 0,
    elapsed: 0, duration: 0.62, done: true,
    bouncing: false, bounceElapsed: 0,
    onComplete: undefined as (() => void) | undefined,
  });

  const flipDuration = card.rarity === 'unique' ? 0.70 : card.rarity === 'rare' ? 0.62 : 0.52;

  const triggerFlip = useCallback((toFace: boolean, cb?: () => void) => {
    const flip = flipRef.current;
    if (!flip) return;
    anim.current = {
      active: true, startRot: flip.rotation.y,
      targetRot: toFace ? Math.PI : 0,
      elapsed: 0, duration: flipDuration, done: false,
      bouncing: false, bounceElapsed: 0,
      onComplete: cb,
    };
  }, [flipDuration]);

  const prevFlipped = useRef(isFlipped);
  useEffect(() => {
    if (prevFlipped.current !== isFlipped) {
      prevFlipped.current = isFlipped;
      triggerFlip(isFlipped, onFlipComplete);
    }
  }, [isFlipped, triggerFlip, onFlipComplete]);

  useEffect(() => {
    if (!autoFlip) return;
    const t = setTimeout(() => triggerFlip(true, onFlipComplete), 800);
    return () => clearTimeout(t);
  }, [autoFlip, triggerFlip, onFlipComplete]);

  useFrame(({ clock }, delta) => {
    const outer = outerRef.current;
    const flip  = flipRef.current;
    const style = styleRef.current;
    const a = anim.current;
    const rv = revealAnim.current;
    if (!outer || !flip || !style) return;

    // Reveal — entrée scène depuis le bas (priorité absolue, bloque flip + idle)
    if (rv.active) {
      rv.elapsed = Math.min(rv.elapsed + delta, rv.duration);
      outer.position.y = -3 + 3 * easeOutCubic(rv.elapsed / rv.duration);
      if (rv.elapsed >= rv.duration) { rv.active = false; outer.position.y = 0; }
      return;
    }

    // Second glow ring rare — respiration continue indépendante du flip
    if (isRare && glowMat2Ref.current) {
      glowMat2Ref.current.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 1.4) * 0.06;
    }

    // Phase flip — Y sur flipRef, wobble Z + arc Y sur outerRef (axes séparés)
    if (a.active && !a.done) {
      a.elapsed = Math.min(a.elapsed + delta, a.duration);
      const t = a.elapsed / a.duration;
      flip.rotation.y  = a.startRot + (a.targetRot - a.startRot) * easeOutSnap(t);
      // Wobble Z léger — inclinaison dans le sens du flip (~3.4°), propre premium
      outer.rotation.z = Math.sin(Math.PI * t) * 0.04;
      outer.position.y = -Math.sin(Math.PI * t) * 0.18;

      if (t >= 1) {
        a.done = true; a.active = false;
        outer.rotation.z = 0;
        outer.position.y = 0;
        a.bouncing = true; a.bounceElapsed = 0;
        a.onComplete?.();
      }
    }

    // Phase squash-stretch atterrissage — amplitude réduite, rigidité carte premium
    if (a.bouncing) {
      a.bounceElapsed = Math.min(a.bounceElapsed + delta, 0.28);
      const b = a.bounceElapsed / 0.28;
      const sy = b < 0.40
        ? 1 - 0.04 * (b / 0.40)          // légère compression
        : b < 0.75
        ? 0.96 + 0.06 * ((b - 0.40) / 0.35)  // rebond contenu
        : 1.02 - 0.02 * ((b - 0.75) / 0.25); // retour 1
      const sx = 1 + (1 - sy) * 0.5; // conservation de volume (inverse demi-amplitude)
      style.scale.set(sx, sy, 1);
      if (b >= 1) { a.bouncing = false; style.scale.set(1, 1, 1); }
    }

    // Idle animations — chaque rareté a son rythme, seulement quand rien d'autre n'anime
    if (!a.active && !a.bouncing) {
      idleT.current += delta;
      if (isUnique) {
        outer.scale.setScalar(1 + Math.sin(idleT.current * 1.2) * 0.006);
      } else if (isRare) {
        outer.position.y = Math.sin(idleT.current * 0.8) * 0.015;
      } else {
        outer.scale.setScalar(1);
        outer.position.y = 0;
      }
    }

  });

  return (
    // outerRef — world-space : wobble Z + arc Y position
    <group ref={outerRef}>
      {isUnique && <UniqueParticles />}
      {/* flipRef — rotation Y (le flip lui-même) */}
      <group ref={flipRef}>
        {/* styleRef — squash/stretch à l'atterrissage */}
        <group ref={styleRef}>
          {/* Dos — face +Z visible à flipRef.rotation.y = 0 */}
          <mesh geometry={geometry} material={backMat} position={[0, 0, 0.001]} />

          {/* Face group — pré-roté PI → local +Z pointe caméra quand flipRef = PI */}
          <group rotation={[0, Math.PI, 0]}>
            {/* Glow ring dans <Select> → SelectiveBloom ne bloome QUE ce mesh */}
            {(isRare || isUnique) && (
              <Select enabled>
                <mesh geometry={glowGeometry} position={[0, 0, -0.003]}>
                  <meshBasicMaterial
                    color={card.border}
                    toneMapped={false}
                    transparent
                    opacity={isUnique ? 0.55 : 0.38}
                  />
                </mesh>
              </Select>
            )}

            {/* Second glow ring rare — respiration lente, hors Bloom */}
            {isRare && (
              <mesh geometry={glowGeometry2} position={[0, 0, -0.006]}>
                <meshBasicMaterial ref={glowMat2Ref} color={card.border} toneMapped={false} transparent opacity={0.12} />
              </mesh>
            )}

            <mesh geometry={geometry} material={faceMat} position={[0, 0, 0.001]} />

          </group>
        </group>
      </group>
    </group>
  );
}

// ─── Lumières rareté ──────────────────────────────────────────────────────────

function RarityLights({ rarity }: { rarity: GainedCard['rarity'] }) {
  const rareRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (rareRef.current) {
      rareRef.current.intensity = 0.26 + Math.sin(Date.now() * 0.0014) * 0.08;
    }
  });

  if (rarity === 'rare') {
    return <pointLight ref={rareRef} position={[0, 0.5, -1.5]} intensity={0.32} color="#7c3aed" />;
  }
  if (rarity === 'unique') {
    return (
      <>
        <pointLight position={[-1.5,  1.0, -1.0]} intensity={0.40} color="#f59e0b" />
        <pointLight position={[ 1.5, -1.0, -1.0]} intensity={0.28} color="#ec4899" />
      </>
    );
  }
  return null;
}

// ─── Scène ────────────────────────────────────────────────────────────────────

function CardScene({
  card, isFlipped, autoFlip, onFlipComplete,
}: {
  card: GainedCard;
  isFlipped: boolean;
  autoFlip?: boolean;
  onFlipComplete?: () => void;
}) {
  return (
    // Selection — contexte pour SelectiveBloom (seul le glow ring est sélectionné)
    <Selection>
      <ambientLight intensity={0.04} />
      <pointLight position={[ 3.5,  4, -1.0]} intensity={0.16} />
      <pointLight position={[-3.0,  1, -0.5]} intensity={0.06} />
      <RarityLights rarity={card.rarity} />

      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.12} />
        <CardMesh
          card={card}
          isFlipped={isFlipped}
          autoFlip={autoFlip}
          onFlipComplete={onFlipComplete}
        />
        <ContactShadows position={[0, -0.80, 0]} opacity={0.45} blur={2.2} far={2.5} scale={4} />
      </Suspense>

      {/* SelectiveBloom — ne bloome QUE les meshes dans <Select enabled> (glow ring) */}
      <EffectComposer>
        <SelectiveBloom intensity={1.20} luminanceThreshold={0.30} luminanceSmoothing={0.60} />
        <Vignette eskil={false} offset={0.40} darkness={0.50} />
      </EffectComposer>
    </Selection>
  );
}

// ─── CanvasBoundary ───────────────────────────────────────────────────────────

class CanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() { return this.state.crashed ? this.props.fallback : this.props.children; }
}

// ─── Fallback CSS ─────────────────────────────────────────────────────────────

function CSSCardFallback({ card, isFlipped }: { card: GainedCard; isFlipped: boolean }) {
  return (
    <div style={{ perspective: 600, width: '100%', height: '100%' }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
        transition: 'transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14,
          background: 'linear-gradient(135deg, #1e1b2e 0%, #2d2640 100%)',
          border: '2px solid rgba(255,255,255,0.16)',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 40, fontWeight: 900, color: 'rgba(255,255,255,0.09)' }}>C</span>
        </div>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14,
          background: card.gradient, border: `2px solid ${card.border}`,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: '10px 8px', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 13,
            background: 'radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.28) 0%, transparent 55%)',
            pointerEvents: 'none',
          }} />
          <DynamicIcon name={card.iconName} size={28} color="rgba(255,255,255,0.92)" />
          <p style={{
            fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
            textAlign: 'center', lineHeight: 1.35, position: 'relative', margin: 0,
          }}>
            {card.text.length > 50 ? `${card.text.slice(0, 50)}…` : card.text}
          </p>
          {card.rarity !== 'common' && (
            <div style={{
              position: 'absolute', top: 5, right: 5, borderRadius: 6, padding: '2px 5px',
              background: card.rarity === 'unique'
                ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                : 'linear-gradient(135deg, #7c3aed, #a855f7)',
            }}>
              <span style={{ fontSize: 7, fontWeight: 800, color: 'white' }}>
                {card.rarity === 'unique' ? 'UNIQUE' : 'RARE'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Export public ────────────────────────────────────────────────────────────

export interface CollectorCardCanvasProps {
  card: GainedCard;
  isFlipped: boolean;
  size?: number;
  autoFlip?: boolean;
  onFlipComplete?: () => void;
}

export function CollectorCardCanvas({
  card, isFlipped, size = 160, autoFlip, onFlipComplete,
}: CollectorCardCanvasProps) {
  const [mounted, setMounted]     = useState(false);
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>('always');

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { setFrameloop('always'); }, [isFlipped, autoFlip]);

  const handleFlipComplete = useCallback(() => {
    if (card.rarity !== 'unique') setFrameloop('demand');
    onFlipComplete?.();
  }, [card.rarity, onFlipComplete]);

  const w = size;
  const h = Math.round(size * 1.5);
  const fallback = <CSSCardFallback card={card} isFlipped={isFlipped} />;

  return (
    <div style={{ width: w, height: h }}>
      {mounted ? (
        <CanvasBoundary fallback={fallback}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: 'low-power' }}
            frameloop={frameloop}
            camera={{ position: [0, 0, 2.2], fov: 45 }}
          >
            {/* Fond fixe — EffectComposer ne supporte pas alpha:true */}
            <color attach="background" args={['#0a0810']} />
            <CardScene
              card={card}
              isFlipped={isFlipped}
              autoFlip={autoFlip}
              onFlipComplete={handleFlipComplete}
            />
          </Canvas>
        </CanvasBoundary>
      ) : fallback}
    </div>
  );
}
