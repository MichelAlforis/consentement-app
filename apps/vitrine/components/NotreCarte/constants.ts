import type { NodeKind, Owner } from './types';

export const STORAGE_KEY = 'ouiclair-notre-carte-v1';
export const ME_KEY = 'ouiclair-notre-carte-moi';

export const NODE_W = 196;
export const NODE_H = 126;
export const CANVAS_W = 700;
export const CANVAS_H = 680;

export const COLORS: Record<Owner, string> = { A: '#8b5cf6', B: '#ec4899' };

export const KINDS: Record<NodeKind, { num: string; label: string }> = {
  besoin: { num: '1', label: 'Besoin' },
  capacite: { num: '2', label: 'Ce que ça rend possible' },
  reponse: { num: '3', label: 'Ce que je peux donner' },
};

export const FIELD_LABELS: Record<string, string> = {
  titre: 'le titre',
  note: 'le texte',
  sat: 'ce qu’il perçoit',
  owner: 'la personne',
  sent: 'ce qu’il pense envoyer',
  casse: '« ce que ça casse »',
  plus: '« ce qu’il ne donne plus »',
  dit: 'son ressenti',
  ajout: 'un nœud ajouté',
  suppr: 'un nœud supprimé',
  lien: 'une flèche',
  preambule: 'le préambule',
  engA: 'ses engagements',
  engB: 'ses engagements',
  travailA: 'son travail perso',
  travailB: 'son travail perso',
  alertes: 'les signaux d’alerte',
  rouges: 'les non-négociables',
  profilA: 'sa lecture de lui-même',
  profilB: 'sa lecture de l’autre',
  signe: 'sa signature',
};
