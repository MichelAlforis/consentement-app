// Détection de l'environnement Capacitor à l'exécution.
// Ne jamais importer côté serveur — tous les appelants doivent être 'use client'.

export function isCapacitor(): boolean {
  return typeof window !== 'undefined' && !!(window as any).Capacitor;
}

export function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';
  return (window as any)?.Capacitor?.getPlatform?.() ?? 'web';
}
