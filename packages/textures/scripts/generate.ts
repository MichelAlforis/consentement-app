import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createCanvas, loadImage, type CanvasRenderingContext2D } from 'canvas';

type DiceFaceNumber = 1 | 2 | 3 | 4 | 5 | 6;
type Dot = readonly [number, number];

const DICE_FACE_SIZE = 256;
const GRAIN_SIZES = [128, 256] as const;

const DOT_LAYOUTS: Record<DiceFaceNumber, readonly Dot[]> = {
  1: [[0.5, 0.5]],
  2: [[0.72, 0.28], [0.28, 0.72]],
  3: [[0.72, 0.28], [0.5, 0.5], [0.28, 0.72]],
  4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
  6: [[0.28, 0.25], [0.72, 0.25], [0.28, 0.5], [0.72, 0.5], [0.28, 0.75], [0.72, 0.75]],
};

const GRAIN_SVG_256 =
  `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">` +
  `<filter id="n">` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>` +
  `<feColorMatrix type="saturate" values="0"/>` +
  `</filter>` +
  `<rect width="100%" height="100%" filter="url(#n)"/>` +
  `</svg>`;

const packageRoot = path.resolve(__dirname, '..');
const assetsRoot = path.join(packageRoot, 'assets');

function drawNumericFace(ctx: CanvasRenderingContext2D, n: DiceFaceNumber, size: number): void {
  ctx.fillStyle = '#f0ebe0';
  ctx.fillRect(0, 0, size, size);

  const vig = ctx.createRadialGradient(size / 2, size / 2, size * 0.32, size / 2, size / 2, size * 0.76);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.10)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, size, size);

  const spec = ctx.createRadialGradient(size * 0.28, size * 0.22, 0, size * 0.28, size * 0.22, size * 0.42);
  spec.addColorStop(0, 'rgba(255,255,255,0.45)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec;
  ctx.fillRect(0, 0, size, size);

  const dotR = size * 0.088;
  for (const [nx, ny] of DOT_LAYOUTS[n]) {
    ctx.fillStyle = n === 1 ? '#c0392b' : '#1a1208';
    ctx.beginPath();
    ctx.arc(nx * size, ny * size, dotR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.arc(nx * size - dotR * 0.28, ny * size - dotR * 0.28, dotR * 0.44, 0, Math.PI * 2);
    ctx.fill();
  }
}

async function writePng(filePath: string, buffer: Buffer): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
}

async function generateDiceFaces(): Promise<string[]> {
  const outputPaths: string[] = [];

  for (const face of [1, 2, 3, 4, 5, 6] as const) {
    const canvas = createCanvas(DICE_FACE_SIZE, DICE_FACE_SIZE);
    drawNumericFace(canvas.getContext('2d'), face, DICE_FACE_SIZE);

    const outputPath = path.join(assetsRoot, 'dice', `face-${face}.png`);
    await writePng(outputPath, canvas.toBuffer('image/png'));
    outputPaths.push(outputPath);
  }

  return outputPaths;
}

async function generateGrainTextures(): Promise<string[]> {
  const outputPaths: string[] = [];
  const grainImage = await loadImage(Buffer.from(GRAIN_SVG_256));

  for (const size of GRAIN_SIZES) {
    const canvas = createCanvas(size, size);
    canvas.getContext('2d').drawImage(grainImage, 0, 0, size, size);

    const outputPath = path.join(assetsRoot, 'grain', `grain-${size}.png`);
    await writePng(outputPath, canvas.toBuffer('image/png'));
    outputPaths.push(outputPath);
  }

  return outputPaths;
}

async function main(): Promise<void> {
  const generated = [
    ...(await generateDiceFaces()),
    ...(await generateGrainTextures()),
  ];

  for (const filePath of generated) {
    console.log(path.relative(packageRoot, filePath));
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
