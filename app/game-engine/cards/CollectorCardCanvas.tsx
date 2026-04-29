'use client';

import {
  useRef, useMemo, useState, useEffect, useCallback,
  Suspense, Component, type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { DynamicIcon } from '../../utils/iconFromName';
import type { GainedCard } from '../../lib/computeGainedCards';
import { useHaptics } from '../shared/useHaptics';
import { drawIconNodes } from '../../utils/iconPaths';
import { DURATION, EASING } from '../../constants/motion';
import { RADIUS } from '../../constants/tokens';
import { initGrain, getGrainCanvas } from '../../utils/grainTexture';
import { useRenderMode } from '../../hooks/useRenderMode';

// ─── Eases ────────────────────────────────────────────────────────────────────

// easeOutBack c1=1.0 → ~3.7% overshoot, snap sec sans oscillation
function easeOutSnap(t: number): number {
  return 1 + 2 * Math.pow(t - 1, 3) + Math.pow(t - 1, 2);
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
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

function drawWrappedTextBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
  stroke = false,
) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const visible = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    let last = visible[visible.length - 1];
    while (last.length > 0 && ctx.measureText(`${last}...`).width > maxWidth) {
      last = last.slice(0, -1).trim();
    }
    visible[visible.length - 1] = `${last}...`;
  }

  const startY = y - ((visible.length - 1) * lineHeight) / 2;
  visible.forEach((l, idx) => {
    const ly = startY + idx * lineHeight;
    if (stroke) ctx.strokeText(l, x, ly);
    ctx.fillText(l, x, ly);
  });
}

// ─── Textures ─────────────────────────────────────────────────────────────────

// prettier-ignore
export const BACK_SYMBOL_PATH =
  'm133 0 2 2q3 0 3 3 0 2 1 1h1q2 3 4 2 3-1 2 2 0 2 1 1 3 0 1 1h-2l-2 1-3 1-4 7q1 2 3-2 0-3 2-3 3 0 2 2h-1v-1l-2 3-3 3q-2 0-1 4 1 2-4 2l-2 2q0 3 2 2l3-1-5 3q-5 1-5 3 1 3-2 2-1-3 4-6 3 0 1-1c-2-1-7 2-6 3v4l-2 5q-2 5 1 3 2 0 1-2l2-2q6-3 1 1l-2 4-3 1-2 1-1 1q-3 0-1 2c1 1-3 6-5 5-1-1-7 8-8 11l-1 3-1-1v-1l-2 1-3 1-1 1 1 1-1 1-4 1q-2 0 0 0 2 3-3 5-2 0-2 3l-2 2-2 1q1 2-2 4l-2 4q0 3-2 3l-1 2q1 2-1 3-3 2-3 6v4l-1 1v2q3-1 0 3v3l1 2-6 6-7 6-4 5q-5 4-10 13a90 90 0 0 0-13 26l-5 21-1 12-2 6v1q4 0 1 2v7l-2 1v1l1 1-2 1c-2 0-3-8-1-9q3-2-1-2-2 0-2-3l1-4q1-1-1-1l-1-1 1-5-1 1a174 174 0 0 0-1 40v2q2 3-1 5l-1 2h1l3 3v4l-2 1-1 1h2q5-1 1 3-3 2 0 2t0 2l-1 2h1l2 1-3 2q-3 1-4-3l-1-3v-5q1-2-1-2l-3-2v-4l-1-2q0-2-2-2l-1-1 1-4q2-3-2-2-4-1-3 4l1 3 1 1-1 1-1 1 2 6a221 221 0 0 0 13 54l1 2 2 5 2 5 1 2 3 6 2 7 1 2 2 2v3l1 2q2 2 1 3l1 1 1 2 1 2 1 3q0 2 2 2 2-1 2 2l2 2q2 0 1 2l1 2q2 0 1 3 0 3 2 3l2 1h1q3-1-1 2-2 3 1 1 4 1 2 4l2 1v2l2 2 1 1q3-2 2 4 0 2 3 2 2 1 1 2l1 2 2 1q0 2 1 1 2 0 1 1-1 2 2 2l2 3 2 3q4 1 1 2-3 3 3 2 2 0 1 1l1 2v1l1 2 1 1q0 3 1 0l2-1v1c0 1 2 6 3 5l1 1 2 2 3 1c1 3 6 9 8 9q2 0 1 1l2 2c2 1 6 5 4 5l1 2 3 2h1c-1 1 1 5 2 4h1l-2 1-3 1q-2 3 1 1 4-1 0 3-4 3-2 0 0-2-1-1l-2 4q0 8-3 8-4 0-5 7-1 3-4 3l-2 2h2l2 1q2 1 0 0l-2 1v3l-7 3h3l3 1-3 1q-4 0 0 2v1l-2 1-3 1h-2q1-1-1-1h-2q1 3 4 3l1 1q0 2-2 1l-1 1-3 2v-3l-3 2-1 3q-3-1-3 1l1 2v-1l1-2 1 2q1 2-1 2-4 3 1 2t1 3-3 0q1-1-1-1l-6 3 1 3 1 1 2-1c0-2 5-2 7-1l1 2q-5-1-6 2l-1 2-3 1h-2l-2 1q-1 2-3 1l-1 1 1 1 2 1-3 1q-3-1-3 2l-1 1-1 1q0 3 4-1l1-2h2q3-2 2-3l1-2q2 0 1 1-1 2 3-1 1-3 1 0-2 4-6 6l-1 1h2q3 0 0 3h-1q2-1-2-1-4 1-3 4 0 3-2 3v2l-1 2-2 1h2q3-2 3 1l-6 2v2l3 2q2 0 0 0l-1 1-3 2-3 2-1 1q0 3 1 1l3-1q3-1 0 2l-3 1-1 1q0 2-3 2l-3 1q0 2 2 1l3-1-1 1q-2 2 1 3l-2 1q-6 3 0 2 3 0 0 1-4 3-1 6 2 1-1 2t-1 2v1l-2 1h1l2 1-2 1-2 2-2 3-1 2v6q2 0-1 3-4 4-2 4h3l2 1-2 1-2 1-2 2-1 1-2 2-1 2q0 3 1 0l3-1v2l-2 3 3 1q6-2 8-8l1-2q3 0 1 2-5 8-10 10-9 3-7 5l4-2q4-5 3 0-2 3 1 2l3-1 2-1 3-1q2 2-6 5-6 1-7 6-1 4-5 4l-3 1h2l2 1v1l-1 1-1 1q-2 0-1 1 1 3 3 0l3-2q3 0 1 1v2q2 1 2-3l1 1q3 3 3 0-2-1 1-1 3 1-3 4-7 4-6 1 0-3-4 0t0 2q3-3 3-1l-3 3q-3 2-1 3l2-1 1-1 2-2h1l-1 3q-2 2 2 1 3-1 2-3l1-3 1 1 2 1v1q-2-1-2 2 0 2-1 1l-6 5q1 1 3-1l5-2h2l-2 2-2 4-3 5q-4 4-2 4l2 1 1 1q2 0 2 2 0 3-2 3l-1-2q1-1-1-1-4 0 1 4 3 2 1 2l-2 1q-1 1 1 1 3-2 0 1l-3 2-2 2q-3 3-1 3l2-2 2-1v3h-1l-1 1-2 1h-2q0 3 4 1 7-3 1 1l-3 2q1 2-2 2-5 3 1 1 5 0 2 2l-4 1-1 1 1 1q4-1 4 2h-1l-3-1-1 2h2l1 1-3 1-2 1 1 1h7v3q-3 4 0 4t1 1h-2l-1-1-1 1v2q-3 3 2 1h2l-1 1-3 2q-2 5 1 3 3-1 0 3-4 3-2 0 1-3 0 0l-2 2-2 3q-3 2 0 0c2 0 7 1 5 2h-1l-2 1v5l1 2v6l-2 2 2-1q7-3 3 1l-1 3-1 3q-4 8 0 2 5-4 3 0 0 3-2 3l-1 1 1 2q3 0 0 3v3h1q2-2 3 1 0 2-2 1l-1 1 2 2q2 0 0 0l-1 2q0 2 1 1 2 0 1 1l1 3 1 2c-1 2 1 16 2 16v6l1 5 2 5 1 6 1 4 1 3 1 3q2 2-1 3l-1 1h2l2 3 1 5 1 4q1 7 4 9l1 3 1 3 1 1 1 2v1l1 2v2q-2 1 1 1 3-1 2 2v2l3 5 2 4 1 2q-1 2 1 2l2 1-2 1-1 1h2q2-1 2 2l1 2q3 1-1 5h1q4-1 6 5l3 4 1 2 1 2q2 0 2 2l3 3 2 2 2 3 2 2 2 2 1 2q-1 1 1 3l2 3 3 4 2 3 1 2v2l1 3 4 8 2 2 2 3 1 2 2 2 2 4q2 2 1 4l2 1q2 0 1 3l1 2 3 4 4 5 1 2 2 3 6 7 5 6q3 1-3-6l-4-6-3-4-3-5-3-5-6-10-5-8-2-3q1-2-1-2l-1-1v-2l-3-6-2-5q-2-1 1-1 2 0-2-3l-3-4-2-5-1-2-7-17-1-5-1-3-2-6-2-6-2-5-2-6-4-11-2-8-2-8-7-38a1027 1027 0 0 1 3-125l2-6v-5l2-7 3-10 1-7 2-4v-3l1-3 1-1v-4l3-9 2-7 1-3 8-19 3-9 6-13 2-7 2-3 3-7 7-13 5-9 6-10 1-2 4-8 6-10 3-3q2 0 1-2l4-7 7-9 4-5 1-1 4-6 3-4 2 2 4 2 1 1 1 1 3 1 2 2 1 1q-2 2 1 1l3 1 2 1 2 1q0 3 1 1 1-3 1 0l1 2q2 0 1 1 0 2 1 1l1 1 1-1q3-3 2 1 0 3 1 1l1-1 1 1v1q4 1 4 3 0 3 2 1h3v2l-2 2 2-1q5-3 5 2 0 4 2 1 2-2 5 1l2 3h2l2 1 3 2 5 3 4 1 1 1 2 1 2 2 2 2q2 0 1 1h1l2 1h2l3 2q2 3 3 2 2 0 1 1 0 2 3 2l4 2 2 1 3 1 2 2 3 1q5 4 6 3l4 2 6 3 5 3 6 3 2 2 1 1 7 2q10 5 6 1l-5-1-1-2-2-1-1-1-2-1q-6-2-8-5v-1q-5 0-5-2h-4 1l1-2h-1l-2-1-1-1q-2 1-3-1l-3-1h-1l-4-3-3-2q1-3-1-5-3-1-2-3-2-2-5 1t-7 0l-2-2q-1 1-2-1 0-3 2-1t4 1v1l1 2q3 2 1-1 0-2 1 0l1 1q1-3-1-4h-1l-2-1-1-1-2-1h-2q2-3-4-4-3 1-2-1l-1-1-2-1-3-2-6-1q-4-1-2-4 1-3-2-2-3 2-1-1 2-1-1-2h-3l-2-1q1-1-1-1-1 2-1-1 1-1-1-1l-1-2-1-1-1 1-1 1v-2l-2-1-4-2-3-2h-1q2-2-1-2l-2-1q0-2-4-1l-1-2-1-2-4-1h1q2 0 1-1l-4-1q-2 0-1-1l-1-1-2-2-3-2q-3 0-3-2l-2-1-1-1-1-1-5-5-1-1 3-5 39-49 5-5 3-4 20-23c0-1 6-10 13-17l16-19 7-9 3-5 2-4c3-3 14-25 16-31l5-32c0-7-3-22-5-26l-1-2q1-1-1-1v-2l-1-1-5-2-5-1-3-3-8-17-2-2q-3 0-3-2l-1-2q-3 0-1-2 1-4-2-1l-1 1-3-4-2-4-3-1h-2l-2-1q-4 1-1-2 1-1-1-2l-2 1v-1l-3-1h-1l-1-1c-1 1-3-3-2-4l-8-1h-1l1-1 2-1q-1-3-4 0h-1q1-3-2 0h-1l1-2q1-1-2-1h-2l-11-3q-1 1-2-1l-1-2-2 2v-2q0-2-1-1h-2l6-3q2 1 1-2l2-2h1l-2-1h-1l2-2q2 0 1-2 0-3 3 0 1 2 1-1l-3-2q-4 2-2-7l1-1 1 2q0 2 1 1 2-3-1-5l-1-2h5q3-2-1-2-3 1-2-1l1-1 1-1 2-5v4l2-2 1-3 2-3-2 2-2 2v-2l-1-2h-1l-3 6v-2q2-3-1-1-4-1-1-3l1 1 1 1c1 0 5-4 4-5l-2 1q-4 3-3 1h-2q-7 2-2-1l7-2q6 0 4 1 0 3 2 0l3-2 1-1-1-1-7 1-7 1h-2l4-2 4-2q0-3-3 0l-4 1-4 1q-1 1-1-1l2-1 6-2 3-2-1-1 1-1 2-1q1-3-4 0l-1 2-1 1c-2 2-8 2-7 0l3-1q4-2 5-5 0-2-2 1l-4 2q-2 0 1-2l2-2h-2q-3-1-3 2l-1 2-1-3v-1h-2q0-2 4-2 1 0 0 0l-2-1-1-1q1-1-1-3l-3-3 3 1h2l-2-2q-5-1 0-3l4 1v-1l1-4v-1l-2 2q-1 4-2-2l-1-5q-1-3 3-3l2-1q2-4-1-1h-2v-2q4-2 0-3t-1-2l2-1 2-1-2-1q-2 1-3-1 0-2-2-2h-2q0-2 8-2 4 1-1-2-7-2-11 1h-3c-4 1-13 6-17 10q-9 10-10 22l1 10q2 2-1 7l-3 5q-4 3-3 8c0 2 6 5 8 5q3 0 1 5-1 7 2 8v2q-2 7 1 8t0 8q-5 10 7 10a147 147 0 0 1 36 9c1-1 11 6 14 8l2 2c1-1 12 11 13 15l4 4 1 4 1 2 1 2 1 2 1 3 1 2 1 1q-1 10 2 10v6l1 2h1l-2 11-1 10-1 3-2 2-3 1h3q3 0-2 5l-4 5v1l-1-2-1-1q-3 1-5 6l-3 3q-3 1-1 3 3 2 0 2l-4 2-1 1h2l2 1-3 1q-5 1-6 4l-1 1-1 1q1 1 0 0l-6 4v2l2-2 4-2q6 0 1 1-7 3-8 6 0 3-1 2-1-2-3 1v2q3 0 0 2l-3 2 1-1 1-2-2 1-1 2q1 1-2 3t-4 5q1 2 3-1 1-3 2 0c0 2-6 5-7 3h2c0-3-4-2-4 0l-2 1-2 3q0 4-3 6-2 3-2 1 1-3-2 1v3q-2 3 3 0l3-2c0 1-6 7-8 7l-2 1-3 1-1 3-2 2-1 1-3 2h-1l-2 6q-4 1-3 3l-1 2v1l2 1-1 1c-2 0-7 6-7 7l-1 2-3 1h-2l1 1v1h-3v1l3 1 2 1-3 1-1 2q0 3-4 3-2 0 0 2c2 1-2 4-4 3l-1 1-3 3-3 1 3 1q3 0 0 1-5 0-5 2l-4 5-3 4-1 2-1-2q-1-3-2 0h-2l-2-1h-2l3-1q4-1 1-1-3-1-1-2l1-1-1-1q-4 2-4-1v-3q-2-3-3-1-3 3-2 0l2-3 2-1 2-2 1-1q-2 0-2-3 2-3 0 0l-1 3-2 1q-6 0-1-4v-1q-4 1 0-2v-1l-4-1-4-2-1-1 1-1q3-2-1-3-2 0-2-5l1-3q3 1 3-1l-3-1h-2q1-3-2 0l-1-1 1-2q2 0 2-3-1-3-4-1h-2l2-2q3-4-1-4-2 0 1-2t0-2l-2 1h-2q-3-1-1-4v-1h-2l2-1q2 0 1-2l-2-1q-2 1-2-2-1-3 3-2h2l-4-1q-4 1-2-2 4-5 5-2l-2 1-1 1h4v-6l2-1q-1-3-5 1-1 3-4 2-2-1 1-2 3 0 3-2 1-4-2-1-1 1-1-2 0-2 2-2l2-1-2-1q-2 1 1-2 2-1-1-1l-2 1-2 2q-3-1 0-7 3-3 1-3v-1q3 0 0-1h-4l-2 2q-2-1 1-6 2-1-1-1h-3l5-2 3 1h1v-2l-2-1h-1q0-5-2-5-3 4-6 3l2-2q5-2 6-6l-2 1q-6 5-7 3l1-2 2-2 1-2h1q2-1-3-1h-3l2-1 2-2-2-1h-6q-4 1 0-2c1-1 7-1 10 1h1q1-2-3-2-3 0-3-2l4-1 4-1c2-2-7-1-9 1q-6 4-1-3 5-6 1-4h-3q-2-1 1-2l2-2h-2l-1-1q1-5-3 1l-1 3 1-3q0-3 3-7l2-3-2 2-4 1-1-1h-1l3-1 2-1-2-1-2-2-1-2-1 1v1l-1-2-2-1h-1l4-1q6 1 4-3v-3h-1l-2 1-2 2h-2v-3h1q2 1 2-1-1-1 2-3l2-2-2 1q-3 1-2-1l-1-1-1-1 1-1 2-2q1-3-4 1t-3 1v-2l1-2 1-1-3 1q-1 1-1-2l1-2 1-2-2-1q-1 1 0 0 3-4 2-6l-3 1-2 1q-3-1-1-1l1-3 1-3h1v2c0 1 6-2 6-4v-1h-1l-1 1v1q-1 1-1-1l-1-2q-3 3-3 0l1-1 1-3q-1-3-1-1l-3 3-2 1q1-1-2-2h-3 3q3 0 4-3l5-2 2-1-6-1q-6 0-5 2l-1 2-1-2q1-3-1-2l-2-2 4-1 3-1q2-2-1-1-3 0-2-2l1-5q0-2 2-2v-2q-3-1-1-2l1-2-2 1-1 3q0 3-3 3h-3l2-3q4-3 1-2-2-1 1-3 2 0-1-2l-1-1-1-2v-5l-3 2-2 3v-2q2-1 1-3h1q2-1-3-4l-2-1 2-2q-1-1 2-3 3-4 1-4l-2 2-2 2q-3 1 0-3 3-3 1-3-1-1 1-6l3-5q-1-3 10-18c5-7 15-14 18-14l2-1 2-2h3l1 1 2 1 1 1v-2q0-2 3-3l3-3 1 1q3 2 2-1 1-3 17-4h5l9-1 19-2c15-2 15-2 11-10l-2-8-1-1c-2 0 0-6 2-8v-1q-4-1 0-3l1-1 3-4 4-6 2-3 2-3 1-3 1-3 1-7c1-6 2-14 1-15l-1-3-1-2-1-3-1-3v-2l-1-1v-2l-1-1q-2 0-2-3-1-4-12-13c-6-5-17-10-17-8';


// Source de vérité partagée entre R3F (canvas px) et CSS (position absolue %)
export const CARD_LAYOUT = {
  iconCenterY:    0.43,  // centre vertical icône — R3F canvas px
  iconCenterYDOM: 0.45,  // +2% correction optique DOM (rendu plus lourd visuellement)
  panelTop:       0.65,  // début panneau texte — R3F
  panelTopDOM:    0.66,  // +1% correction optique DOM
  panelHeight:    0.30,
} as const;

function makeBackTexture(size = 512, refImage?: HTMLImageElement): THREE.CanvasTexture {
  const h = Math.round(size * 1.5);
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  if (refImage) {
    // Base PNG Midjourney
    ctx.drawImage(refImage, 0, 0, size, h);
    // Vignette légère sur les bords
    const vig = ctx.createRadialGradient(size / 2, h / 2, h * 0.28, size / 2, h / 2, h * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, size, h);
  } else {
    // Fallback gradient — quasi-noir → indigo → violet saturé
    const bg = ctx.createLinearGradient(0, 0, size, h);
    bg.addColorStop(0,    '#010007');
    bg.addColorStop(0.45, '#0c0920');
    bg.addColorStop(1,    '#3b1f85');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, h);

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
    const halo = ctx.createRadialGradient(size / 2, h / 2, 0, size / 2, h / 2, size * 0.44);
    halo.addColorStop(0,    'rgba(124,58,237,0.48)');
    halo.addColorStop(0.55, 'rgba(76,29,149,0.18)');
    halo.addColorStop(1,    'rgba(76,29,149,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, size, h);

    const vig = ctx.createRadialGradient(size / 2, h / 2, h * 0.25, size / 2, h / 2, h * 0.70);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.72)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, size, h);

    const spec = ctx.createRadialGradient(size * 0.24, h * 0.14, 0, size * 0.24, h * 0.14, size * 0.38);
    spec.addColorStop(0, 'rgba(255,255,255,0.14)');
    spec.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = spec; ctx.fillRect(0, 0, size, h);

    const shim = ctx.createLinearGradient(0, 0, size, h);
    shim.addColorStop(0,    'rgba(255,255,255,0)');
    shim.addColorStop(0.48, 'rgba(255,255,255,0.055)');
    shim.addColorStop(0.52, 'rgba(255,255,255,0.09)');
    shim.addColorStop(1,    'rgba(255,255,255,0)');
    ctx.fillStyle = shim; ctx.fillRect(0, 0, size, h);
  }

  // Symbole — gradient violet (même opacité sur PNG et fallback)
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

  // Border
  roundedRectPath(ctx, 4, 4, size - 8, h - 8, 22);
  const brd = ctx.createLinearGradient(0, 0, size, h);
  brd.addColorStop(0,   'rgba(255,255,255,0.55)');
  brd.addColorStop(0.5, 'rgba(255,255,255,0.18)');
  brd.addColorStop(1,   'rgba(255,255,255,0.55)');
  ctx.strokeStyle = brd;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// Prewarm grain — feTurbulence rasterisé en background dès le premier import côté client
if (typeof window !== 'undefined') initGrain();

function makeFaceTexture(card: GainedCard, size = 512, refImage?: HTMLImageElement): THREE.CanvasTexture {
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

  // PNG référence — texture Midjourney à 50% sur le gradient
  if (refImage) {
    ctx.globalAlpha = 0.50;
    ctx.drawImage(refImage, 0, 0, size, h);
    ctx.globalAlpha = 1;
  }

  // Logo symbole — watermark centré, très subtil
  const symS = Math.min(size / 336, h / 1044) * 0.75;
  const symOX = (size - 336 * symS) / 2;
  const symOY = (h - 1044 * symS) / 2;
  ctx.save();
  ctx.translate(symOX, symOY);
  ctx.scale(symS, symS);
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.globalAlpha = 0.07;
  ctx.fill(new Path2D(BACK_SYMBOL_PATH), 'evenodd');
  ctx.globalAlpha = 1;
  ctx.restore();

  const grain = getGrainCanvas();
  if (grain) {
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.06;
    for (let dy = 0; dy < h; dy += 256) {
      for (let dx = 0; dx < size; dx += 256) ctx.drawImage(grain, dx, dy);
    }
    ctx.restore();
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
  const inkColor = '#f1f3f5';
  const themeLabel = card.themeName ?? card.theme ?? '';

  // Badge thème
  if (themeLabel) {
    const pillX = size * 0.075;
    const pillY = h * 0.058;
    const pillW = size * 0.38;
    const pillH = h * 0.057;
    roundedRectPath(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    drawIconNodes(ctx, card.iconName, pillX + pillH * 0.55, pillY + pillH / 2, pillH * 0.45, 'rgba(255,255,255,0.58)');
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = `800 ${Math.round(size * 0.042)}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(themeLabel.toUpperCase(), pillX + pillH * 0.93, pillY + pillH / 2);
  }

  // Icône centrale
  const iconCy = h * CARD_LAYOUT.iconCenterY;
  const iconR  = size * 0.145;
  const iconBg = ctx.createRadialGradient(size / 2, iconCy, 0, size / 2, iconCy, iconR * 1.35);
  iconBg.addColorStop(0, 'rgba(0,0,0,0.18)');
  iconBg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = iconBg;
  ctx.beginPath();
  ctx.arc(size / 2, iconCy, iconR * 1.35, 0, Math.PI * 2);
  ctx.fill();
  drawIconNodes(ctx, card.iconName, size / 2, iconCy, iconR * 1.65, inkColor);

  // Panneau texte
  const panelX = size * 0.075;
  const panelW = size * 0.85;
  const panelH = h * CARD_LAYOUT.panelHeight;
  const panelY = h * CARD_LAYOUT.panelTop;
  roundedRectPath(ctx, panelX, panelY, panelW, panelH, size * 0.045);
  const panelGrad = ctx.createLinearGradient(0, panelY, 0, panelY + panelH);
  panelGrad.addColorStop(0, 'rgba(5,5,12,0.36)');
  panelGrad.addColorStop(1, 'rgba(5,5,12,0.58)');
  ctx.fillStyle = panelGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Texte dans le panneau
  const textSize = card.text.length > 100 ? size * 0.065 : card.text.length > 72 ? size * 0.074 : size * 0.084;
  ctx.font = `800 ${Math.round(textSize)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(0,0,0,0.24)';
  ctx.lineWidth   = Math.round(size * 0.0024);
  ctx.fillStyle   = inkColor;
  ctx.shadowColor = 'rgba(0,0,0,0.82)';
  ctx.shadowBlur  = size * 0.022;
  drawWrappedTextBlock(
    ctx,
    card.text,
    size / 2,
    panelY + panelH / 2,
    panelW - size * 0.12,
    textSize * 1.18,
    5,
    true,
  );
  ctx.shadowBlur = 0;

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
  tex.colorSpace = THREE.SRGBColorSpace;
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

// ─── CardMesh — export public, utilisable dans toute scène R3F ───────────────
//   GooseGame, DiceGame, futurs jeux : <CardMesh card={...} isFlipped={...} />

export interface CardMeshProps {
  card: GainedCard;
  isFlipped: boolean;
  autoFlip?: boolean;
  onFlipComplete?: () => void;
}

export function CardMesh({
  card, isFlipped, autoFlip, onFlipComplete,
}: CardMeshProps) {
  const outerRef  = useRef<THREE.Group>(null); // world-space arc + Z wobble
  const flipRef   = useRef<THREE.Group>(null); // rotation Y (le flip)
  const styleRef  = useRef<THREE.Group>(null); // squash-stretch atterrissage
  const idleT     = useRef(0);

  const geometry      = useMemo(() => makeRoundedCardGeometry(1, 1.5, 0.15), []);
  const glowGeometry  = useMemo(() => makeRoundedCardGeometry(1.06, 1.58, 0.16), []);
  const glowGeometry2 = useMemo(() => makeRoundedCardGeometry(1.14, 1.68, 0.17), []);
  const backPng = useLoader(THREE.TextureLoader, '/cards/card-back.png');
  const [refCommon, refRare, refUnique] = useLoader(THREE.TextureLoader, [
    '/cards/deck-a-face.png',
    '/cards/deck-b-face.png',
    '/cards/unique-foil.png',
  ]);
  const refTex = card.rarity === 'unique' ? refUnique : card.rarity === 'rare' ? refRare : refCommon;
  const backTex = useMemo(
    () => makeBackTexture(512, backPng.image as HTMLImageElement),
    [backPng],
  );
  const faceTex = useMemo(
    () => makeFaceTexture(card, 512, refTex.image as HTMLImageElement),
    [card, refTex],
  );

  const isUnique = card.rarity === 'unique';
  const isRare   = card.rarity === 'rare';

  const glowMat2Ref    = useRef<THREE.MeshBasicMaterial>(null);
  const uniqueGlowRef  = useRef<THREE.MeshBasicMaterial>(null);
  const revealAnim     = useRef({ active: true, elapsed: 0, duration: DURATION.medium });

  const { vibrate } = useHaptics();

  // MeshBasicMaterial — texture affichée exactement, aucune dépendance lumière, zéro hotspot
  const backMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: backTex }),
    [backTex],
  );

  const faceMat = useMemo((): THREE.Material =>
    new THREE.MeshBasicMaterial({ map: faceTex }),
  [faceTex]);

  const anim = useRef({
    active: false, startRot: 0, targetRot: 0,
    elapsed: 0, duration: DURATION.cardFlipRare as number, done: true,
    bouncing: false, bounceElapsed: 0,
    onComplete: undefined as (() => void) | undefined,
  });

  const flipDuration = card.rarity === 'unique' ? DURATION.cardFlipUnique : card.rarity === 'rare' ? DURATION.cardFlipRare : DURATION.cardFlipCommon;

  const triggerFlip = useCallback((toFace: boolean, cb?: () => void) => {
    const flip = flipRef.current;
    if (!flip) return;
    vibrate('light'); // start of flip — always light
    anim.current = {
      active: true, startRot: flip.rotation.y,
      targetRot: toFace ? Math.PI : 0,
      elapsed: 0, duration: flipDuration, done: false,
      bouncing: false, bounceElapsed: 0,
      onComplete: () => {
        // Haptic by rarity when card is revealed face-up
        if (toFace) {
          if (card.rarity === 'unique')     vibrate('heavy');
          else if (card.rarity === 'rare') vibrate('medium');
          else                             vibrate('light');
        } else {
          vibrate('light');
        }
        cb?.();
      },
    };
  }, [card.rarity, flipDuration, vibrate]);

  // null = premier mount pas encore traité (résolution Suspense peut retarder le mount
  // après que isFlipped a déjà changé côté parent — le pattern prev !== next raterait le flip)
  const prevFlipped = useRef<boolean | null>(null);
  useEffect(() => {
    if (prevFlipped.current === null) {
      prevFlipped.current = isFlipped;
      if (isFlipped) triggerFlip(true, onFlipComplete);
      return;
    }
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

    // Unique glow — shift HSL arc-en-ciel (rotation lente 25°/s → tour complet en ~14s)
    if (isUnique && uniqueGlowRef.current) {
      uniqueGlowRef.current.color.setHSL((clock.getElapsedTime() * 25 % 360) / 360, 1.0, 0.65);
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
      a.bounceElapsed = Math.min(a.bounceElapsed + delta, DURATION.normal);
      const b = a.bounceElapsed / DURATION.normal;
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
            {/* Glow ring rare */}
            {isRare && (
              <mesh geometry={glowGeometry} position={[0, 0, -0.003]}>
                <meshBasicMaterial color={card.border} toneMapped={false} transparent opacity={0.38} />
              </mesh>
            )}

            {/* Glow ring unique — iridescent HSL shift */}
            {isUnique && (
              <mesh geometry={glowGeometry} position={[0, 0, -0.003]}>
                <meshBasicMaterial ref={uniqueGlowRef} color={card.border} toneMapped={false} transparent opacity={0.55} />
              </mesh>
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

// ─── RarityLights — export public ────────────────────────────────────────────

export function RarityLights({ rarity }: { rarity: GainedCard['rarity'] }) {
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
    <>
      <ambientLight intensity={0.04} />
      <pointLight position={[ 3.5,  4, -1.0]} intensity={0.16} />
      <pointLight position={[-3.0,  1, -0.5]} intensity={0.06} />
      <RarityLights rarity={card.rarity} />

      <Suspense fallback={null}>
        <CardMesh
          card={card}
          isFlipped={isFlipped}
          autoFlip={autoFlip}
          onFlipComplete={onFlipComplete}
        />
        <ContactShadows position={[0, -0.80, 0]} opacity={0.55} blur={3.2} far={2.5} scale={4} />
      </Suspense>

      {/* Bloom — isolé dans PostFXBoundary → si ça crash (Safari/WebGL1), cartes restent visibles */}
      <PostFXBoundary>
        <EffectComposer>
          <Bloom intensity={0.60} luminanceThreshold={0.55} luminanceSmoothing={0.40} />
          <Vignette eskil={false} offset={0.40} darkness={0.50} />
        </EffectComposer>
      </PostFXBoundary>
    </>
  );
}

// ─── PostFXBoundary — isole EffectComposer, cartes visibles même sans post-processing ──

class PostFXBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

// ─── CanvasBoundary ───────────────────────────────────────────────────────────

class CanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidCatch(err: unknown) {
    if (process.env.NODE_ENV === 'development') console.warn('[CollectorCard] WebGL/R3F error →', err);
  }
  render() { return this.state.crashed ? this.props.fallback : this.props.children; }
}

// ─── Fallback CSS ─────────────────────────────────────────────────────────────

function CSSCardFallback({ card, isFlipped, size = 160 }: { card: GainedCard; isFlipped: boolean; size?: number }) {
  const gradientBg = (() => {
    const m = card.gradient.match(/#[0-9a-f]{6}/i);
    const c1 = m ? m[0] : '#3b1f85';
    return `linear-gradient(160deg, #0c0a16 0%, ${c1}18 100%)`;
  })();
  const themeLabel = (((card as unknown as Record<string, unknown>).themeName ?? (card as unknown as Record<string, unknown>).theme ?? '') as string);

  return (
    <div style={{ perspective: 600, width: '100%', height: '100%' }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
        transition: `transform ${DURATION.cardFlipCSS}s cubic-bezier(${EASING.cardFlip.join(', ')})`,
      }}>
        {/* Dos */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: RADIUS.card,
          background: 'linear-gradient(135deg, #1e1b2e 0%, #2d2640 100%)',
          border: '2px solid rgba(255,255,255,0.16)',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 40, fontWeight: 900, color: 'rgba(255,255,255,0.09)' }}>C</span>
        </div>

        {/* Face — positions absolues calquées sur CARD_LAYOUT (= ratios R3F) */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: RADIUS.card,
          background: gradientBg,
          border: '1.5px solid rgba(255,255,255,0.10)',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          overflow: 'hidden',
        }}>
          {/* Bande haut */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: card.gradient }} />

          {/* Header : pill catégorie + badge rareté */}
          <div style={{
            position: 'absolute', top: 5, left: 0, right: 0,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: `${Math.round(size * 0.045)}px ${Math.round(size * 0.06)}px 0`,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: `${Math.round(size * 0.022)}px ${Math.round(size * 0.05)}px ${Math.round(size * 0.022)}px ${Math.round(size * 0.037)}px`,
              borderRadius: size, background: card.gradient,
            }}>
              <DynamicIcon name={card.iconName} size={Math.round(size * 0.075)} color="white" />
              {themeLabel && (
                <span style={{ fontSize: Math.round(size * 0.044), fontWeight: 800, color: 'white', letterSpacing: 0.5, lineHeight: 1 }}>
                  {themeLabel.toUpperCase()}
                </span>
              )}
            </div>
            {card.rarity !== 'common' && (
              <div style={{
                marginLeft: 'auto',
                padding: `${Math.round(size * 0.018)}px ${Math.round(size * 0.037)}px`,
                borderRadius: 6,
                background: card.rarity === 'unique'
                  ? 'linear-gradient(135deg, #b45309, #f59e0b)'
                  : 'linear-gradient(135deg, #7c3aed, #a855f7)',
              }}>
                <span style={{ fontSize: Math.round(size * 0.044), fontWeight: 800, color: 'white', letterSpacing: 0.3 }}>
                  {card.rarity === 'unique' ? 'UNIQUE' : 'RARE'}
                </span>
              </div>
            )}
          </div>

          {/* Icône — correction optique définie dans CARD_LAYOUT.iconCenterYDOM */}
          <div style={{
            position: 'absolute',
            top: `${CARD_LAYOUT.iconCenterYDOM * 100}%`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: `drop-shadow(0 0 ${Math.round(size * 0.10)}px ${card.border}) drop-shadow(0 0 ${Math.round(size * 0.05)}px ${card.border})`,
          }}>
            <DynamicIcon name={card.iconName} size={Math.round(size * 0.26)} color="rgba(255,255,255,0.88)" />
          </div>

          {/* Panneau texte — correction optique définie dans CARD_LAYOUT.panelTopDOM */}
          <div style={{
            position: 'absolute',
            top: `${CARD_LAYOUT.panelTopDOM * 100}%`,
            left: Math.round(size * 0.075),
            right: Math.round(size * 0.075),
            height: `${CARD_LAYOUT.panelHeight * 100}%`,
            boxSizing: 'border-box',
            padding: `${Math.round(size * 0.045)}px ${Math.round(size * 0.05)}px`,
            borderRadius: Math.round(size * 0.05),
            background: 'rgba(5,5,12,0.52)',
            border: '1px solid rgba(255,255,255,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <p style={{
              margin: 0,
              fontSize: Math.round(size * 0.082),
              fontWeight: 700,
              color: 'rgba(255,255,255,0.90)',
              lineHeight: 1.30,
              textAlign: 'center',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}>
              {card.text}
            </p>
          </div>

          {/* Bande bas */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: card.gradient }} />
        </div>
      </div>
    </div>
  );
}

// ─── LightOverlay — shimmer sweep + gyroscope radial highlight ───────────────

function LightOverlay({ rarity, isFlipped, size = 160 }: { rarity: string; isFlipped: boolean; size?: number }) {
  const gyroRef = useRef<HTMLDivElement>(null);

  // Respect prefers-reduced-motion (a11y + mal des transports)
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!isFlipped) return;
    // Gyroscope inutile (invisible) et coûteux sous 140px
    if (size < 140 || prefersReduced) return;

    const getGyroGradient = (x: number, y: number) => {
      if (rarity === 'unique') {
        const hue = (x * 2.4 + y * 1.2) % 360;
        return `radial-gradient(ellipse 55% 65% at ${x}% ${y}%, hsla(${hue},100%,82%,0.32) 0%, hsla(${(hue + 80) % 360},100%,78%,0.14) 40%, transparent 70%)`;
      }
      if (rarity === 'rare') {
        return `radial-gradient(ellipse 50% 60% at ${x}% ${y}%, rgba(192,132,252,0.40) 0%, rgba(167,139,250,0.15) 40%, transparent 70%)`;
      }
      return `radial-gradient(ellipse 45% 55% at ${x}% ${y}%, rgba(255,255,255,0.28) 0%, transparent 60%)`;
    };

    let rafId = 0;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      // gamma = left/right tilt (-90..90), beta = front/back tilt (-180..180)
      // Map to card position % — typical portrait hold: beta ≈ 60°, gamma ≈ 0°
      const x = Math.round(Math.min(100, Math.max(0, 50 + (e.gamma / 30) * 35)));
      const y = Math.round(Math.min(100, Math.max(0, 50 - ((e.beta - 60) / 30) * 30)));
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (gyroRef.current) {
          gyroRef.current.style.background = getGyroGradient(x, y);
          gyroRef.current.style.opacity = '1';
        }
      });
    };

    const register = () => {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    };

    // iOS 13+ requires requestPermission() inside a user gesture
    type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };
    if (typeof (DeviceOrientationEvent as DOE).requestPermission === 'function') {
      const onGesture = () => {
        (DeviceOrientationEvent as DOE).requestPermission!()
          .then(state => { if (state === 'granted') register(); })
          .catch(() => { /* denied or unavailable */ });
      };
      document.addEventListener('click',      onGesture, { capture: true, once: true });
      document.addEventListener('touchstart', onGesture, { capture: true, once: true, passive: true });
      return () => {
        document.removeEventListener('click',      onGesture, true);
        document.removeEventListener('touchstart', onGesture, true);
        window.removeEventListener('deviceorientation', handleOrientation);
        cancelAnimationFrame(rafId);
      };
    }

    // Android / desktop — no permission needed
    register();
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped, size]);

  const shimmerGradient =
    rarity === 'unique'
      ? 'linear-gradient(108deg, transparent 18%, rgba(255,200,80,0.22) 36%, rgba(200,80,255,0.24) 50%, rgba(80,210,255,0.22) 64%, transparent 82%)'
      : rarity === 'rare'
      ? 'linear-gradient(108deg, transparent 30%, rgba(192,132,252,0.30) 50%, transparent 70%)'
      : 'linear-gradient(108deg, transparent 30%, rgba(255,255,255,0.20) 50%, transparent 70%)';
  const shimmerDuration    = rarity === 'unique' ? 1.0 : 1.3;
  const shimmerRepeatDelay = rarity === 'unique' ? 1.6 : rarity === 'rare' ? 2.2 : 3.5;

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      borderRadius: RADIUS.card, pointerEvents: 'none', zIndex: 2,
    }}>
      {/* Gyro radial — updated directly via DOM ref at rAF rate, no React re-renders */}
      <div
        ref={gyroRef}
        style={{
          position: 'absolute', inset: 0,
          background: 'transparent', opacity: 0,
          transition: 'opacity 0.4s',
          mixBlendMode: 'screen',
        }}
      />
      {/* Shimmer sweep — 2 passages après la révélation, puis s'arrête */}
      {!prefersReduced && (
        <motion.div
          style={{ position: 'absolute', top: 0, bottom: 0, width: '100%', background: shimmerGradient }}
          initial={{ x: '-110%' }}
          animate={isFlipped ? { x: ['-110%', '110%'] } : { x: '-110%' }}
          transition={isFlipped ? {
            duration: shimmerDuration,
            delay: 0.55,
            repeat: 2,
            repeatDelay: shimmerRepeatDelay,
            ease: [0.4, 0, 0.2, 1],
            repeatType: 'loop',
          } : { duration: 0 }}
        />
      )}
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
  const renderMode = useRenderMode();
  const [mounted, setMounted]     = useState(false);
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>('always');

  // Tous les hooks doivent être appelés inconditionnellement (rules of hooks)
  useEffect(() => {
    if (renderMode !== 'r3f') return;
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [renderMode]);

  useEffect(() => { setFrameloop('always'); }, [isFlipped, autoFlip]);

  const handleFlipComplete = useCallback(() => {
    if (card.rarity !== 'unique') setFrameloop('demand');
    onFlipComplete?.();
  }, [card.rarity, onFlipComplete]);

  const w = size;
  const h = Math.round(size * 1.5);

  // Système CSS : carte complète + shimmer/gyro — zéro WebGL
  if (renderMode === 'css') {
    return (
      <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden' }}>
        <CSSCardFallback card={card} isFlipped={isFlipped} size={size} />
        <LightOverlay rarity={card.rarity} isFlipped={isFlipped} size={size} />
      </div>
    );
  }

  // Système R3F : Canvas + shimmer/gyro en overlay CSS
  const fallback = <CSSCardFallback card={card} isFlipped={isFlipped} size={size} />;

  return (
    <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden' }}>
      {mounted ? (
        <CanvasBoundary fallback={fallback}>
          <Canvas
            style={{ width: w, height: h, display: 'block' }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false }}
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
      <LightOverlay rarity={card.rarity} isFlipped={isFlipped} size={size} />
    </div>
  );
}
