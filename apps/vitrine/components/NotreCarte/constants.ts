import type { Owner } from './types';

export const STORAGE_KEY = 'ouiclair-notre-carte-v2';
export const ME_KEY = 'ouiclair-notre-carte-moi';

export const NODE_W = 196;
export const NODE_H = 126;
export const CANVAS_W = 700;
export const CANVAS_H = 680;

export const COLORS: Record<Owner, string> = { A: '#8b5cf6', B: '#ec4899' };

/** Position en anneau pour 5 besoins — reprend la disposition du design. */
export const RING_POSITIONS: [number, number][] = [
  [252, 20],
  [486, 190],
  [394, 452],
  [110, 452],
  [18, 190],
];

export const FIELD_LABELS: Record<string, string> = {
  titre: 'le titre',
  note: 'le texte',
  sat: 'la perception',
  owner: 'la personne',
  sent: 'l’envoi déclaré',
  possible: '« ce que ça rend possible »',
  donne: '« ce que ça peut donner »',
  casse: '« ce que ça casse »',
  plus: '« ce que ça ne donne plus »',
  dit: 'le ressenti de l’autre',
  ajout: 'un nœud ajouté',
  suppr: 'un nœud supprimé',
  lien: 'une flèche',
  preambule: 'le préambule',
  engA: 'les engagements',
  engB: 'les engagements',
  travailA: 'le travail perso',
  travailB: 'le travail perso',
  alertes: 'les signaux d’alerte',
  rouges: 'les non-négociables',
  profilA: 'la lecture de soi',
  profilB: 'la lecture de l’autre',
  signe: 'la signature',
};
