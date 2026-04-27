'use client';

import { Lock } from 'lucide-react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/** 👋 Main ouverte, geste de bienvenue */
export function WaveIcon({ size = 64, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
      <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

/** ✋ Paume ouverte, choix libre — consentement */
export function OpenPalmIcon({ size = 64, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      <path d="M9 3a2 2 0 0 1 2 2v5" />
      <path d="M11 5a2 2 0 0 1 4 0v4" />
      <path d="M15 7a2 2 0 0 1 4 0v4" />
      <path d="M7 9a2 2 0 0 1 2 2v1" />
      <path d="M5 15v-3a2 2 0 0 1 2-2" />
      <path d="M19 11v5a8 8 0 0 1-8 8H9a8 8 0 0 1-8-8v-3" />
    </svg>
  );
}

/** 🃏 Carte collector — l'éducation débloque le jeu */
export function CollectorCardIcon({ size = 64, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      {/* Carte du fond, décalée */}
      <rect x="7" y="4" width="14" height="18" rx="2" strokeOpacity="0.35" />
      {/* Carte du dessus */}
      <rect x="3" y="2" width="14" height="18" rx="2" />
      {/* Cœur centré */}
      <path
        d="M10 14.5C10 14.5 6.5 12 6.5 9.5a3 3 0 0 1 6 0C12.5 12 10 14.5 10 14.5z"
        fill={color} fillOpacity="0.45" stroke="none"
      />
    </svg>
  );
}

/** 🔒 Cadenas — vie privée */
export function PrivacyLockIcon({ size = 64, color = 'currentColor', className }: IconProps) {
  return <Lock size={size} color={color} className={className} />;
}

export const ONBOARDING_ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  WaveIcon,
  OpenPalmIcon,
  CollectorCardIcon,
  PrivacyLockIcon,
};
