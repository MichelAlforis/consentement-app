// TODO Phase 5D: stubs (3 sexologues fictifs). Remplacer par
// contenu réel V3 (app/data/sexologues.ts si existant) ou
// données validées par l'éditeur lors du sprint contenu Phase 5D.

export interface Sexologue {
  id: string;
  nom: string;
  specialite: string;
  ville: string;
}

export const SEXOLOGUES: Sexologue[] = [
  { id: '1', nom: 'Dr. Exemple', specialite: 'Sexologie clinique', ville: 'Paris' },
  { id: '2', nom: 'Dr. Test', specialite: 'Thérapie de couple', ville: 'Lyon' },
  { id: '3', nom: 'Dr. Stub', specialite: 'Sexologie', ville: 'Bordeaux' },
];
