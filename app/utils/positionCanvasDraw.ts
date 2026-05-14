// Canvas 2D equivalents of the PositionSVG pictograms.
// Coordinate system: SVG viewBox 0,0→100,80 — drawPositionOnCanvas handles scaling.
import type { PositionKey } from '../components/ui/PositionSVG';

type Ctx = CanvasRenderingContext2D;

const A = 'rgba(255,255,255,0.92)';
const B = 'rgba(255,255,255,0.58)';

function fe(c: Ctx, cx: number, cy: number, rx: number, ry: number) {
  c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); c.fill();
}
function fc(c: Ctx, cx: number, cy: number, r: number) {
  c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fill();
}
function fp(c: Ctx, d: string) { c.fill(new Path2D(d)); }
function sp(c: Ctx, d: string) { c.stroke(new Path2D(d)); }
function sl(c: Ctx, x1: number, y1: number, x2: number, y2: number) {
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
}
function se(c: Ctx, cx: number, cy: number, r: number) {
  c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
}
function rot(c: Ctx, angle: number, cx: number, cy: number, fn: () => void) {
  c.save();
  c.translate(cx, cy); c.rotate(angle * Math.PI / 180); c.translate(-cx, -cy);
  fn();
  c.restore();
}

type DrawFn = (c: Ctx) => void;

const DRAW: Record<PositionKey, DrawFn> = {
  missionnaire: (c) => {
    c.fillStyle = A; fe(c, 38, 56, 22, 7); fc(c, 14, 52, 6);
    c.fillStyle = B;
    rot(c, -12, 50, 43, () => { fe(c, 50, 43, 22, 7); fc(c, 74, 39, 6); });
  },
  levrette: (c) => {
    c.fillStyle = A;
    rot(c, 18, 33, 50, () => { fe(c, 33, 50, 20, 7); fc(c, 11, 46, 6); });
    c.fillStyle = B; fe(c, 68, 38, 7, 20); fc(c, 68, 16, 6);
  },
  cuillere: (c) => {
    c.fillStyle = A; fe(c, 44, 54, 24, 7); fc(c, 70, 51, 6);
    c.fillStyle = B; fe(c, 40, 41, 24, 7); fc(c, 66, 38, 6);
  },
  cowgirl: (c) => {
    c.fillStyle = A; fe(c, 40, 60, 24, 7); fc(c, 14, 57, 6);
    c.fillStyle = B; fe(c, 60, 37, 7, 20); fc(c, 60, 15, 6);
  },
  andromaque: (c) => {
    c.fillStyle = A; fe(c, 44, 60, 24, 7); fc(c, 70, 57, 6);
    c.fillStyle = B; fe(c, 52, 36, 7, 20); fc(c, 52, 58, 6);
  },
  papillon: (c) => {
    c.fillStyle = A; fe(c, 28, 56, 16, 7); fc(c, 10, 53, 6);
    c.fillStyle = 'rgba(255,255,255,0.69)'; fe(c, 48, 40, 5, 16);
    c.fillStyle = B; fe(c, 74, 40, 7, 22); fc(c, 74, 16, 6);
  },
  equerre: (c) => {
    c.fillStyle = A; fe(c, 34, 57, 22, 7); fc(c, 10, 54, 6);
    c.fillStyle = 'rgba(255,255,255,0.69)';
    rot(c, -45, 56, 50, () => { fe(c, 56, 40, 5, 16); });
    c.fillStyle = B;
    rot(c, -15, 72, 42, () => { fe(c, 72, 42, 7, 18); fc(c, 72, 22, 6); });
  },
  '69': (c) => {
    c.fillStyle = A; fe(c, 38, 27, 24, 7); fc(c, 12, 24, 6);
    c.fillStyle = B; fe(c, 58, 57, 24, 7); fc(c, 84, 60, 6);
  },
  debout: (c) => {
    c.fillStyle = A; fe(c, 34, 42, 7, 24); fc(c, 34, 16, 6);
    c.fillStyle = B; fe(c, 62, 42, 7, 24); fc(c, 62, 16, 6);
  },
  'cowgirl-inv': (c) => {
    c.fillStyle = A; fe(c, 40, 60, 24, 7); fc(c, 14, 57, 6);
    c.fillStyle = B; fe(c, 56, 36, 7, 22); fc(c, 56, 58, 6);
  },
  lotus: (c) => {
    c.fillStyle = A; fe(c, 32, 50, 14, 12); fc(c, 32, 34, 6);
    c.fillStyle = B; fe(c, 64, 50, 14, 12); fc(c, 64, 34, 6);
    c.fillStyle = 'rgba(255,255,255,0.30)'; fe(c, 48, 60, 18, 5);
  },
  amazone: (c) => {
    c.fillStyle = A; fe(c, 40, 60, 24, 7); fc(c, 14, 57, 6);
    c.fillStyle = B;
    rot(c, -15, 60, 37, () => { fe(c, 60, 37, 7, 20); fc(c, 60, 15, 6); });
  },
  balancier: (c) => {
    c.fillStyle = A;
    rot(c, -12, 34, 44, () => { fe(c, 34, 44, 7, 22); fc(c, 34, 20, 6); });
    c.fillStyle = B;
    rot(c, 12, 64, 44, () => { fe(c, 64, 44, 7, 22); fc(c, 64, 20, 6); });
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2;
    sp(c, 'M 26 65 Q 48 72 70 65');
  },
  mur: (c) => {
    c.strokeStyle = 'rgba(255,255,255,0.28)'; c.lineWidth = 3;
    sl(c, 88, 8, 88, 76);
    c.fillStyle = A; fe(c, 72, 40, 7, 24); fc(c, 72, 14, 6);
    c.fillStyle = B; fe(c, 50, 42, 7, 22); fc(c, 50, 18, 6);
  },
  'jambes-epaules': (c) => {
    c.fillStyle = A; fe(c, 28, 58, 16, 7); fc(c, 10, 55, 6);
    c.fillStyle = 'rgba(255,255,255,0.72)'; fe(c, 48, 38, 5, 16); fe(c, 58, 36, 5, 16);
    c.fillStyle = B; fe(c, 74, 44, 7, 20); fc(c, 74, 22, 6);
  },
  'cuillere-jambe': (c) => {
    c.fillStyle = A; fe(c, 44, 54, 22, 7); fc(c, 68, 51, 6);
    c.fillStyle = 'rgba(255,255,255,0.69)';
    rot(c, -50, 56, 48, () => { fe(c, 56, 38, 5, 15); });
    c.fillStyle = B; fe(c, 40, 41, 22, 7); fc(c, 64, 38, 6);
  },
  'assis-face': (c) => {
    c.fillStyle = A;
    rot(c, -8, 34, 46, () => { fe(c, 34, 46, 7, 18); fc(c, 34, 26, 6); });
    c.fillStyle = B;
    rot(c, 8, 64, 46, () => { fe(c, 64, 46, 7, 18); fc(c, 64, 26, 6); });
    c.fillStyle = 'rgba(255,255,255,0.28)'; fe(c, 49, 62, 20, 5);
  },
  vague: (c) => {
    c.fillStyle = A; fe(c, 44, 54, 24, 7); fc(c, 70, 51, 6);
    c.fillStyle = B; fe(c, 40, 41, 24, 7); fc(c, 66, 38, 6);
    c.strokeStyle = 'rgba(255,255,255,0.38)'; c.lineWidth = 2;
    sp(c, 'M 18 34 Q 28 26 38 34 Q 48 42 58 34');
  },
  'chaise-longue': (c) => {
    c.fillStyle = A;
    rot(c, -30, 36, 50, () => { fe(c, 36, 50, 22, 7); fc(c, 12, 46, 6); });
    c.fillStyle = B; fe(c, 76, 42, 7, 20); fc(c, 76, 20, 6);
  },
  arc: (c) => {
    c.strokeStyle = A; c.lineWidth = 10; c.lineCap = 'round';
    sp(c, 'M 12 58 Q 34 36 58 52');
    c.fillStyle = A; fc(c, 10, 56, 6);
    c.fillStyle = B;
    rot(c, -15, 72, 42, () => { fe(c, 72, 42, 7, 18); fc(c, 72, 22, 6); });
  },
  oral: (c) => {
    c.fillStyle = A; fe(c, 36, 54, 22, 7); fc(c, 12, 51, 6);
    c.fillStyle = B;
    rot(c, -35, 66, 42, () => { fe(c, 66, 42, 20, 7); fc(c, 44, 38, 6); });
  },
  anal: (c) => {
    c.fillStyle = A;
    rot(c, 18, 33, 50, () => { fe(c, 33, 50, 20, 7); fc(c, 11, 46, 6); });
    c.fillStyle = B; fe(c, 68, 38, 7, 20); fc(c, 68, 16, 6);
  },
  sextoy: (c) => {
    c.fillStyle = A; fe(c, 28, 52, 18, 7); fc(c, 8, 49, 6);
    c.fillStyle = B; fe(c, 70, 52, 18, 7); fc(c, 92, 49, 6);
    c.fillStyle = 'rgba(255,255,255,0.42)'; fe(c, 50, 52, 5, 13);
  },
  'bondage-leger': (c) => {
    c.fillStyle = A; fe(c, 40, 54, 24, 7); fc(c, 14, 51, 6);
    c.strokeStyle = 'rgba(255,255,255,0.65)'; c.lineWidth = 2;
    se(c, 66, 54, 4);
    c.fillStyle = B; fe(c, 74, 40, 7, 20); fc(c, 74, 18, 6);
  },
  creation: (c) => {
    c.fillStyle = 'rgba(255,255,255,0.72)';
    fp(c, 'M50 12 L55 34 L74 26 L62 44 L78 60 L56 52 L50 72 L44 52 L22 60 L38 44 L26 26 L45 34 Z');
  },
  premiers: (c) => {
    c.fillStyle = A; fe(c, 22, 50, 16, 7); fc(c, 6, 47, 6);
    c.fillStyle = B; fe(c, 76, 50, 16, 7); fc(c, 94, 47, 6);
    c.strokeStyle = 'rgba(255,255,255,0.52)'; c.lineWidth = 2.5; c.lineCap = 'round';
    sp(c, 'M 40 46 L 48 50 L 40 54');
    sp(c, 'M 60 46 L 52 50 L 60 54');
  },
  miroir: (c) => {
    c.fillStyle = A; fc(c, 30, 40, 17);
    c.fillStyle = 'rgba(0,0,0,0.28)'; fc(c, 25, 38, 3); fc(c, 35, 38, 3);
    c.fillStyle = B; fc(c, 68, 40, 17);
    c.fillStyle = 'rgba(0,0,0,0.28)'; fc(c, 63, 38, 3); fc(c, 73, 38, 3);
    c.strokeStyle = 'rgba(255,255,255,0.38)'; c.lineWidth = 1.5;
    sl(c, 48, 40, 50, 40);
  },
  marathon: (c) => {
    c.fillStyle = A; fe(c, 28, 44, 7, 22); fc(c, 28, 20, 6);
    c.fillStyle = B; fe(c, 68, 44, 7, 22); fc(c, 68, 20, 6);
    c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 2;
    sp(c, 'M 36 22 Q 48 12 60 22');
    c.fillStyle = 'rgba(255,255,255,0.38)'; fc(c, 48, 13, 3);
  },
  intention: (c) => {
    c.fillStyle = A; fe(c, 18, 44, 7, 22); fc(c, 18, 20, 6);
    c.fillStyle = B; fe(c, 80, 44, 7, 22); fc(c, 80, 20, 6);
    c.fillStyle = 'rgba(255,255,255,0.58)';
    fp(c, 'M49 55 C43 49,34 45,38 37 C42 29,49 35,49 35 C49 35,56 29,60 37 C64 45,55 49,49 55Z');
  },
};

/**
 * Dessine le pictogramme de position sur un contexte canvas 2D.
 * Mappe le viewBox SVG 100×80 vers la zone icône définie par (canvasCx, canvasCy, iconR).
 */
export function drawPositionOnCanvas(
  ctx: CanvasRenderingContext2D,
  key: PositionKey,
  canvasCx: number,
  canvasCy: number,
  iconR: number,
): void {
  const fn = DRAW[key];
  if (!fn) return;

  const targetW = iconR * 3.3;
  const targetH = targetW * 0.8;

  ctx.save();
  ctx.translate(canvasCx - targetW / 2, canvasCy - targetH / 2);
  ctx.scale(targetW / 100, targetH / 80);
  fn(ctx);
  ctx.restore();
}
