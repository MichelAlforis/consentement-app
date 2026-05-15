// Profils fictifs basés sur la structure réelle des annuaires français (SNSC, AIUS, Doctolib).
// À remplacer par de vrais profils avec accord des professionnels avant publication.

export interface Sexologue {
  id: string;
  nom: string;
  specialite: string;
  ville: string;
}

export const SEXOLOGUES: Sexologue[] = [
  { id: 'sophie-laurent',   nom: 'Dr Sophie Laurent',   specialite: 'Médecin sexologue',                    ville: 'Paris (9e)' },
  { id: 'thomas-renard',    nom: 'Dr Thomas Renard',    specialite: 'Psychologue sexologue',                ville: 'Lyon (3e)' },
  { id: 'claire-moreau',    nom: 'Claire Moreau',       specialite: 'Sexologue clinicienne (SNSC)',         ville: 'Paris (15e)' },
  { id: 'antoine-dubois',   nom: 'Dr Antoine Dubois',   specialite: 'Médecin sexologue — LGBTQIA+',        ville: 'Bordeaux' },
  { id: 'amina-bensalem',   nom: 'Amina Bensalem',      specialite: 'Psychosexologue — traumatismes',      ville: 'Marseille' },
  { id: 'marc-fontaine',    nom: 'Marc Fontaine',       specialite: 'Sexologue clinicien — BDSM / kink',   ville: 'Toulouse' },
  { id: 'nathalie-girard',  nom: 'Nathalie Girard',     specialite: 'Psychologue sexologue — féminin',     ville: 'Strasbourg' },
  { id: 'karim-mansouri',   nom: 'Dr Karim Mansouri',   specialite: 'Médecin sexologue — masculin',        ville: 'Paris (8e)' },
  { id: 'lucie-deschamps',  nom: 'Lucie Deschamps',     specialite: 'Sexologue clinicienne (SNSC)',         ville: 'Nantes' },
  { id: 'paul-mercier',     nom: 'Paul Mercier',        specialite: 'Sexologue & thérapeute de couple',    ville: 'Rennes' },
];
