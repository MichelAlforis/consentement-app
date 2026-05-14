import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

const INPUT  = join(__dir, '../../../public/lordenargent_minimal_dark_UI_product_banner_glowing_collector_f1953eb7-ce76-4f30-8ed8-11597ad17564_2.png');
const OUTPUT = join(ROOT, 'public/og-image.png');

const W = 1200, H = 630;

// Logo SVG — fill black → white
let logo = readFileSync(join(ROOT, 'public/symbol.svg'), 'utf8');
logo = logo.replace(/fill="#000"/g, 'fill="#ffffff"');
// Taille : 336×1044 → 52×162 px
const LW = 52, LH = Math.round(1044 * LW / 336);
logo = logo.replace(
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 336 1044">',
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 336 1044" width="${LW}" height="${LH}">`
);

// Gradient overlay gauche pour lisibilité
const overlay = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%"   stop-color="#0d0714" stop-opacity="0.92"/>
      <stop offset="50%"  stop-color="#0d0714" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0d0714" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`;

// Texte — SVG séparé
const LOGO_X = 72;
const TEXT_X = LOGO_X + LW + 22;
const MID_Y  = H / 2;

const text = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Nom OuiClair -->
  <text x="${TEXT_X}" y="${MID_Y - 28}"
    font-family="Inter, Arial, sans-serif"
    font-size="54" font-weight="700"
    fill="#ffffff" letter-spacing="-1">OuiClair</text>

  <!-- Tagline -->
  <text x="${TEXT_X}" y="${MID_Y + 22}"
    font-family="Inter, Arial, sans-serif"
    font-size="21" font-weight="400"
    fill="#c4b5fd">Parle de sexe. Sans gêne. Sans honte.</text>

  <!-- App info pills -->
  <text x="${TEXT_X}" y="${MID_Y + 58}"
    font-family="Inter, Arial, sans-serif"
    font-size="14" font-weight="400"
    fill="#64748b">iOS &amp; Android  ·  Gratuit  ·  Dès 13 ans</text>
</svg>`;

// Recadrage : on prend les 1200px de gauche, centré verticalement
const cropTop = Math.round((800 - H) / 2);

const logoBuf    = Buffer.from(logo);
const overlayBuf = Buffer.from(overlay);
const textBuf    = Buffer.from(text);

const base = await sharp(INPUT)
  .extract({ left: 0, top: cropTop, width: W, height: H })
  .toBuffer();

await sharp(base)
  .composite([
    { input: overlayBuf, top: 0, left: 0 },
    { input: logoBuf,    top: Math.round(MID_Y - LH / 2), left: LOGO_X },
    { input: textBuf,    top: 0, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(OUTPUT);

console.log(`✓ og-image.png générée → ${OUTPUT}`);
