'use client';

import { Hand, Lock } from 'lucide-react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * 👋 Main qui fait signe — slide Bienvenue
 * Paths Lucide Hand + 3 arcs de mouvement (opacité dégressive)
 */
export function WaveIcon({ size = 64, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      {/* Main — Lucide Hand */}
      <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
      <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      {/* Arcs de mouvement — suggèrent l'oscillation de la main */}
      <path d="M1.5 11.5C2 10.5 3.2 10 4.5 10" strokeOpacity="0.55" />
      <path d="M1 15C1.8 14 3.2 13.5 4.8 13.5" strokeOpacity="0.38" />
      <path d="M1.5 18.5C2.5 17.8 4 17.5 5.5 17.5" strokeOpacity="0.22" />
    </svg>
  );
}

/** ✋ Paume ouverte — slide Consentement */
export function OpenPalmIcon({ size = 64, color = 'currentColor', className }: IconProps) {
  return <Hand size={size} color={color} className={className} />;
}

/**
 * 🃏 Deux cartes superposées — slide Concept
 * Carte arrière décalée + carte avant + vrai cœur en 4 cubiques bezier
 */
export function CollectorCardIcon({ size = 64, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      {/* Carte arrière — décalée droite+bas */}
      <rect x="7" y="4" width="14" height="18" rx="2" strokeOpacity="0.35" />
      {/* Carte avant */}
      <rect x="3" y="2" width="14" height="18" rx="2" />
      {/* Cœur — 4 segments cubiques, centré à (10, 11) */}
      <path
        d="M10 15
           C10 15 6 12.5 6 10
           C6 8 7.5 7 10 8
           C12.5 7 14 8 14 10
           C14 12.5 10 15 10 15Z"
        fill={color} fillOpacity="0.5" stroke="none"
      />
    </svg>
  );
}

/** 🔒 Cadenas — slide Vie privée */
export function PrivacyLockIcon({ size = 64, color = 'currentColor', className }: IconProps) {
  return <Lock size={size} color={color} className={className} />;
}

export const ONBOARDING_ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  WaveIcon,
  OpenPalmIcon,
  CollectorCardIcon,
  PrivacyLockIcon,
};
