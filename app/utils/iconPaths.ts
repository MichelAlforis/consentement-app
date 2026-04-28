// Source de vérité unique pour les paths d'icônes canvas (Path2D).
// Partagé entre CollectorCardCanvas (cards R3F) et Board (plateau R3F).
// Ne pas dupliquer ces paths dans d'autres fichiers.

export type SvgNode = ['path' | 'circle' | 'rect' | 'polygon' | 'line', Record<string, string>];

export const ICON_NODES: Record<string, SvgNode[]> = {
  MessageCircle: [['path', { d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' }]],
  Heart:         [['path', { d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' }]],
  Star:          [['polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }]],
  Crown:         [['path', { d: 'M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z' }]],
  Sparkles: [
    ['path', { d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' }],
    ['path', { d: 'M20 3v4' }], ['path', { d: 'M22 5h-4' }],
    ['path', { d: 'M4 17v2' }], ['path', { d: 'M5 18H3' }],
  ],
  Flame: [['path', { d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' }]],
  Zap:   [['path', { d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z' }]],
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
  Rocket: [
    ['path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z' }],
    ['path', { d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z' }],
    ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0' }],
    ['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' }],
  ],
  Pause: [
    ['rect', { x: '14', y: '4', width: '4', height: '16', rx: '1' }],
    ['rect', { x: '6',  y: '4', width: '4', height: '16', rx: '1' }],
  ],
  Flag: [
    ['path', { d: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' }],
    ['line', { x1: '4', x2: '4', y1: '22', y2: '15' }],
  ],
  Layers: [
    ['path', { d: 'm12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z' }],
    ['path', { d: 'm22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65' }],
    ['path', { d: 'm22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65' }],
  ],
  HelpCircle: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }],
    ['circle', { cx: '12', cy: '17', r: '1', fill: 'true' }],
  ],
  Target: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['circle', { cx: '12', cy: '12', r: '6' }],
    ['circle', { cx: '12', cy: '12', r: '2' }],
  ],
};

export function drawIconNodes(
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
