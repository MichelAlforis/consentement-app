'use client';

// Pictogrammes SVG minimalistes pour les cartes Deck B — Kamasutra
// viewBox 100×80 · deux silhouettes (ellipse corps + cercle tête)
// Fond transparent → s'affiche sur le dégradé rouge/bordeaux de la carte

export type PositionKey =
  | 'missionnaire' | 'levrette' | 'cuillere' | 'cowgirl' | 'andromaque'
  | 'papillon' | 'equerre' | '69' | 'debout' | 'cowgirl-inv'
  | 'lotus' | 'amazone' | 'balancier' | 'mur' | 'jambes-epaules'
  | 'cuillere-jambe' | 'assis-face' | 'vague' | 'chaise-longue' | 'arc'
  | 'oral' | 'anal' | 'sextoy' | 'bondage-leger'
  | 'creation' | 'premiers' | 'miroir' | 'marathon' | 'intention';

interface PositionSVGProps {
  position: PositionKey;
  size?: number;
  className?: string;
}

// Corps A : plein · Corps B : semi-transparent pour distinction
const A = 'rgba(255,255,255,0.92)';
const B = 'rgba(255,255,255,0.58)';

// ── heat-4 · common (cb-001 → cb-010) ────────────────────────────────────────

const missionnaire = (
  <>
    {/* A — allongé·e sur le dos, tête à gauche */}
    <ellipse cx="38" cy="56" rx="22" ry="7" fill={A} />
    <circle cx="14" cy="52" r="6" fill={A} />
    {/* B — au dessus, légèrement incliné·e, tête à droite */}
    <g transform="rotate(-12 50 43)">
      <ellipse cx="50" cy="43" rx="22" ry="7" fill={B} />
      <circle cx="74" cy="39" r="6" fill={B} />
    </g>
  </>
);

const levrette = (
  <>
    {/* A — penché·e en avant, tête à gauche-bas */}
    <g transform="rotate(18 33 50)">
      <ellipse cx="33" cy="50" rx="20" ry="7" fill={A} />
      <circle cx="11" cy="46" r="6" fill={A} />
    </g>
    {/* B — debout derrière, tête en haut */}
    <ellipse cx="68" cy="38" rx="7" ry="20" fill={B} />
    <circle cx="68" cy="16" r="6" fill={B} />
  </>
);

const cuillere = (
  <>
    {/* A — devant, horizontal, tête à droite */}
    <ellipse cx="44" cy="54" rx="24" ry="7" fill={A} />
    <circle cx="70" cy="51" r="6" fill={A} />
    {/* B — derrière, même direction, légèrement décalé en haut */}
    <ellipse cx="40" cy="41" rx="24" ry="7" fill={B} />
    <circle cx="66" cy="38" r="6" fill={B} />
  </>
);

const cowgirl = (
  <>
    {/* A — allongé·e, tête à gauche */}
    <ellipse cx="40" cy="60" rx="24" ry="7" fill={A} />
    <circle cx="14" cy="57" r="6" fill={A} />
    {/* B — assis·e en haut, vertical, tête en haut */}
    <ellipse cx="60" cy="37" rx="7" ry="20" fill={B} />
    <circle cx="60" cy="15" r="6" fill={B} />
  </>
);

const andromaque = (
  <>
    {/* A — allongé·e, tête à droite */}
    <ellipse cx="44" cy="60" rx="24" ry="7" fill={A} />
    <circle cx="70" cy="57" r="6" fill={A} />
    {/* B — assis·e dos à A, tête en bas (face côté pieds) */}
    <ellipse cx="52" cy="36" rx="7" ry="20" fill={B} />
    <circle cx="52" cy="58" r="6" fill={B} />
  </>
);

const papillon = (
  <>
    {/* A — allongé·e en bord de lit, jambes levées */}
    <ellipse cx="28" cy="56" rx="16" ry="7" fill={A} />
    <circle cx="10" cy="53" r="6" fill={A} />
    <ellipse cx="48" cy="40" rx="5" ry="16" fill={A} opacity="0.75" />
    {/* B — debout en face */}
    <ellipse cx="74" cy="40" rx="7" ry="22" fill={B} />
    <circle cx="74" cy="16" r="6" fill={B} />
  </>
);

const equerre = (
  <>
    {/* A — allongé·e, une jambe levée en angle */}
    <ellipse cx="34" cy="57" rx="22" ry="7" fill={A} />
    <circle cx="10" cy="54" r="6" fill={A} />
    <g transform="rotate(-45 56 50)">
      <ellipse cx="56" cy="40" rx="5" ry="16" fill={A} opacity="0.75" />
    </g>
    {/* B — agenouillé·e */}
    <g transform="rotate(-15 72 42)">
      <ellipse cx="72" cy="42" rx="7" ry="18" fill={B} />
      <circle cx="72" cy="22" r="6" fill={B} />
    </g>
  </>
);

const position69 = (
  <>
    {/* A — horizontal, tête à gauche, en haut */}
    <ellipse cx="38" cy="27" rx="24" ry="7" fill={A} />
    <circle cx="12" cy="24" r="6" fill={A} />
    {/* B — horizontal inversé, tête à droite, en bas */}
    <ellipse cx="58" cy="57" rx="24" ry="7" fill={B} />
    <circle cx="84" cy="60" r="6" fill={B} />
  </>
);

const debout = (
  <>
    {/* A — debout, tête en haut */}
    <ellipse cx="34" cy="42" rx="7" ry="24" fill={A} />
    <circle cx="34" cy="16" r="6" fill={A} />
    {/* B — en face, debout, tête en haut */}
    <ellipse cx="62" cy="42" rx="7" ry="24" fill={B} />
    <circle cx="62" cy="16" r="6" fill={B} />
  </>
);

const cowgirlInv = (
  <>
    {/* A — allongé·e, tête à gauche */}
    <ellipse cx="40" cy="60" rx="24" ry="7" fill={A} />
    <circle cx="14" cy="57" r="6" fill={A} />
    {/* B — assis·e dos tourné, tête vers pieds de A */}
    <ellipse cx="56" cy="36" rx="7" ry="22" fill={B} />
    <circle cx="56" cy="58" r="6" fill={B} />
  </>
);

// ── heat-4 · rare (cb-011 → cb-020) ──────────────────────────────────────────

const lotus = (
  <>
    {/* Deux corps assis face à face, jambes croisées */}
    <ellipse cx="32" cy="50" rx="14" ry="12" fill={A} />
    <circle cx="32" cy="34" r="6" fill={A} />
    <ellipse cx="64" cy="50" rx="14" ry="12" fill={B} />
    <circle cx="64" cy="34" r="6" fill={B} />
    {/* jambes entrelacées */}
    <ellipse cx="48" cy="60" rx="18" ry="5" fill="rgba(255,255,255,0.30)" />
  </>
);

const amazone = (
  <>
    {/* A — allongé·e */}
    <ellipse cx="40" cy="60" rx="24" ry="7" fill={A} />
    <circle cx="14" cy="57" r="6" fill={A} />
    {/* B — assis·e, légèrement penché·e en avant */}
    <g transform="rotate(-15 60 37)">
      <ellipse cx="60" cy="37" rx="7" ry="20" fill={B} />
      <circle cx="60" cy="15" r="6" fill={B} />
    </g>
  </>
);

const balancier = (
  <>
    {/* Deux corps assis face à face, légèrement inclinés (mouvement de balancier) */}
    <g transform="rotate(-12 34 44)">
      <ellipse cx="34" cy="44" rx="7" ry="22" fill={A} />
      <circle cx="34" cy="20" r="6" fill={A} />
    </g>
    <g transform="rotate(12 64 44)">
      <ellipse cx="64" cy="44" rx="7" ry="22" fill={B} />
      <circle cx="64" cy="20" r="6" fill={B} />
    </g>
    {/* arc de mouvement */}
    <path d="M 26 65 Q 48 72 70 65" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
  </>
);

const mur = (
  <>
    {/* mur à droite */}
    <line x1="88" y1="8" x2="88" y2="76" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
    {/* A — dos au mur */}
    <ellipse cx="72" cy="40" rx="7" ry="24" fill={A} />
    <circle cx="72" cy="14" r="6" fill={A} />
    {/* B — de face */}
    <ellipse cx="50" cy="42" rx="7" ry="22" fill={B} />
    <circle cx="50" cy="18" r="6" fill={B} />
  </>
);

const jambesEpaules = (
  <>
    {/* A — allongé·e, deux jambes levées */}
    <ellipse cx="28" cy="58" rx="16" ry="7" fill={A} />
    <circle cx="10" cy="55" r="6" fill={A} />
    <ellipse cx="48" cy="38" rx="5" ry="16" fill={A} opacity="0.78" />
    <ellipse cx="58" cy="36" rx="5" ry="16" fill={A} opacity="0.78" />
    {/* B — agenouillé·e, upright */}
    <ellipse cx="74" cy="44" rx="7" ry="20" fill={B} />
    <circle cx="74" cy="22" r="6" fill={B} />
  </>
);

const cuillereJambe = (
  <>
    {/* A — horizontal, tête à droite, une jambe levée */}
    <ellipse cx="44" cy="54" rx="22" ry="7" fill={A} />
    <circle cx="68" cy="51" r="6" fill={A} />
    <g transform="rotate(-50 56 48)">
      <ellipse cx="56" cy="38" rx="5" ry="15" fill={A} opacity="0.75" />
    </g>
    {/* B — derrière, même direction */}
    <ellipse cx="40" cy="41" rx="22" ry="7" fill={B} />
    <circle cx="64" cy="38" r="6" fill={B} />
  </>
);

const assisFace = (
  <>
    {/* Deux corps assis face à face, très proches */}
    <g transform="rotate(-8 34 46)">
      <ellipse cx="34" cy="46" rx="7" ry="18" fill={A} />
      <circle cx="34" cy="26" r="6" fill={A} />
    </g>
    <g transform="rotate(8 64 46)">
      <ellipse cx="64" cy="46" rx="7" ry="18" fill={B} />
      <circle cx="64" cy="26" r="6" fill={B} />
    </g>
    {/* jambes entrelacées */}
    <ellipse cx="49" cy="62" rx="20" ry="5" fill="rgba(255,255,255,0.28)" />
  </>
);

const vague = (
  <>
    {/* Comme cuillère + arc de mouvement ondulé */}
    <ellipse cx="44" cy="54" rx="24" ry="7" fill={A} />
    <circle cx="70" cy="51" r="6" fill={A} />
    <ellipse cx="40" cy="41" rx="24" ry="7" fill={B} />
    <circle cx="66" cy="38" r="6" fill={B} />
    <path d="M 18 34 Q 28 26 38 34 Q 48 42 58 34" stroke="rgba(255,255,255,0.38)" strokeWidth="2" fill="none" />
  </>
);

const chaiseLongue = (
  <>
    {/* A — incliné·e à ~30° */}
    <g transform="rotate(-30 36 50)">
      <ellipse cx="36" cy="50" rx="22" ry="7" fill={A} />
      <circle cx="12" cy="46" r="6" fill={A} />
    </g>
    {/* B — debout en face */}
    <ellipse cx="76" cy="42" rx="7" ry="20" fill={B} />
    <circle cx="76" cy="20" r="6" fill={B} />
  </>
);

const arc = (
  <>
    {/* A — dos cambré (arc) */}
    <path d="M 12 58 Q 34 36 58 52" stroke={A} strokeWidth="10" fill="none" strokeLinecap="round" />
    <circle cx="10" cy="56" r="6" fill={A} />
    {/* B — derrière */}
    <g transform="rotate(-15 72 42)">
      <ellipse cx="72" cy="42" rx="7" ry="18" fill={B} />
      <circle cx="72" cy="22" r="6" fill={B} />
    </g>
  </>
);

// ── heat-5 · rare (cb-021 → cb-025) ──────────────────────────────────────────

const oral = (
  <>
    {/* A — allongé·e */}
    <ellipse cx="36" cy="54" rx="22" ry="7" fill={A} />
    <circle cx="12" cy="51" r="6" fill={A} />
    {/* B — à hauteur du bassin de A, incliné·e */}
    <g transform="rotate(-35 66 42)">
      <ellipse cx="66" cy="42" rx="20" ry="7" fill={B} />
      <circle cx="44" cy="38" r="6" fill={B} />
    </g>
  </>
);

const anal = (
  <>
    {/* Levrette — même visuel, position similaire */}
    <g transform="rotate(18 33 50)">
      <ellipse cx="33" cy="50" rx="20" ry="7" fill={A} />
      <circle cx="11" cy="46" r="6" fill={A} />
    </g>
    <ellipse cx="68" cy="38" rx="7" ry="20" fill={B} />
    <circle cx="68" cy="16" r="6" fill={B} />
  </>
);

const sextoy = (
  <>
    {/* Deux corps, accessoire entre eux */}
    <ellipse cx="28" cy="52" rx="18" ry="7" fill={A} />
    <circle cx="8" cy="49" r="6" fill={A} />
    <ellipse cx="70" cy="52" rx="18" ry="7" fill={B} />
    <circle cx="92" cy="49" r="6" fill={B} />
    {/* accessoire */}
    <ellipse cx="50" cy="52" rx="5" ry="13" fill="rgba(255,255,255,0.42)" />
  </>
);

const bondageLeger = (
  <>
    {/* A allongé·e, poignets indiqués */}
    <ellipse cx="40" cy="54" rx="24" ry="7" fill={A} />
    <circle cx="14" cy="51" r="6" fill={A} />
    <circle cx="66" cy="54" r="4" stroke="rgba(255,255,255,0.65)" strokeWidth="2" fill="none" />
    {/* B debout */}
    <ellipse cx="74" cy="40" rx="7" ry="20" fill={B} />
    <circle cx="74" cy="18" r="6" fill={B} />
  </>
);

// ── heat-5 · unique (cb-026 → cb-030) — cartes conceptuelles ─────────────────

const creation = (
  /* Étoile à 6 branches — position inventée, unique */
  <path
    d="M50 12 L55 34 L74 26 L62 44 L78 60 L56 52 L50 72 L44 52 L22 60 L38 44 L26 26 L45 34 Z"
    fill="rgba(255,255,255,0.72)"
  />
);

const premiers = (
  <>
    {/* Deux corps qui s'approchent, flèche d'intention */}
    <ellipse cx="22" cy="50" rx="16" ry="7" fill={A} />
    <circle cx="6" cy="47" r="6" fill={A} />
    <ellipse cx="76" cy="50" rx="16" ry="7" fill={B} />
    <circle cx="94" cy="47" r="6" fill={B} />
    {/* flèches qui se rapprochent */}
    <path d="M 40 46 L 48 50 L 40 54" stroke="rgba(255,255,255,0.52)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M 60 46 L 52 50 L 60 54" stroke="rgba(255,255,255,0.52)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </>
);

const miroir = (
  <>
    {/* Deux visages proches, contact visuel */}
    <circle cx="30" cy="40" r="17" fill={A} />
    <circle cx="25" cy="38" r="3" fill="rgba(0,0,0,0.28)" />
    <circle cx="35" cy="38" r="3" fill="rgba(0,0,0,0.28)" />
    <circle cx="68" cy="40" r="17" fill={B} />
    <circle cx="63" cy="38" r="3" fill="rgba(0,0,0,0.28)" />
    <circle cx="73" cy="38" r="3" fill="rgba(0,0,0,0.28)" />
    {/* ligne de regard */}
    <line x1="48" y1="40" x2="50" y2="40" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" />
  </>
);

const marathon = (
  <>
    {/* Deux corps debout + bulle de parole */}
    <ellipse cx="28" cy="44" rx="7" ry="22" fill={A} />
    <circle cx="28" cy="20" r="6" fill={A} />
    <ellipse cx="68" cy="44" rx="7" ry="22" fill={B} />
    <circle cx="68" cy="20" r="6" fill={B} />
    {/* arc de communication */}
    <path d="M 36 22 Q 48 12 60 22" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" />
    <circle cx="48" cy="13" r="3" fill="rgba(255,255,255,0.38)" />
  </>
);

const intention = (
  <>
    {/* Deux corps + cœur entre eux */}
    <ellipse cx="18" cy="44" rx="7" ry="22" fill={A} />
    <circle cx="18" cy="20" r="6" fill={A} />
    <ellipse cx="80" cy="44" rx="7" ry="22" fill={B} />
    <circle cx="80" cy="20" r="6" fill={B} />
    {/* cœur */}
    <path
      d="M49 55 C43 49,34 45,38 37 C42 29,49 35,49 35 C49 35,56 29,60 37 C64 45,55 49,49 55Z"
      fill="rgba(255,255,255,0.58)"
    />
  </>
);

// ── Registre complet ──────────────────────────────────────────────────────────

const POSITIONS: Record<PositionKey, React.ReactElement> = {
  missionnaire,
  levrette,
  cuillere,
  cowgirl,
  andromaque,
  papillon,
  equerre,
  '69': position69,
  debout,
  'cowgirl-inv': cowgirlInv,
  lotus,
  amazone,
  balancier,
  mur,
  'jambes-epaules': jambesEpaules,
  'cuillere-jambe': cuillereJambe,
  'assis-face': assisFace,
  vague,
  'chaise-longue': chaiseLongue,
  arc,
  oral,
  anal,
  sextoy,
  'bondage-leger': bondageLeger,
  creation,
  premiers,
  miroir,
  marathon,
  intention,
};

export function PositionSVG({ position, size = 60, className }: PositionSVGProps) {
  const content = POSITIONS[position];
  if (!content) return null;
  return (
    <svg
      viewBox="0 0 100 80"
      width={size}
      height={Math.round(size * 0.8)}
      className={className}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
