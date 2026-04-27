// Détection de l'environnement Capacitor à l'exécution.
// Ne jamais importer côté serveur — tous les appelants doivent être 'use client'.

type CapacitorWindow = Window & {
  Capacitor?: {
    getPlatform?: () => 'ios' | 'android' | 'web';
  };
};

export function isCapacitor(): boolean {
  return typeof window !== 'undefined' && !!(window as CapacitorWindow).Capacitor;
}

export function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';
  return (window as CapacitorWindow).Capacitor?.getPlatform?.() ?? 'web';
}
