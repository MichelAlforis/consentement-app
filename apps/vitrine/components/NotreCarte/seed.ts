import { RING_POSITIONS } from './constants';
import type { CarteDoc, CarteNode, CarteEdge, Owner } from './types';

interface SeedNode {
  owner: Owner;
  title: string;
  note: string;
  sat: number;
  sent: number;
  possible: string;
  donne: string;
}

/**
 * Contenu d'exemple générique — à remplacer entièrement par vos propres
 * besoins dans l'app. Rien de personnel ne doit être codé en dur ici :
 * ce fichier est publié dans un repo public. `possible`/`donne` décrivent
 * le lien qui part de CE besoin vers le suivant de l'anneau.
 */
const SEED: SeedNode[] = [
  {
    owner: 'A',
    title: 'Sécurité',
    note: 'se sentir en confiance, sans avoir à vérifier',
    sat: 55,
    sent: 60,
    possible: "Quand je sais où j'en suis, mon attention se libère au lieu de tourner en boucle.",
    donne: "Je peux être pleinement présent·e pour toi, l'attention que je passais à vérifier, je peux la mettre sur nous.",
  },
  {
    owner: 'B',
    title: 'Reconnaissance',
    note: 'être vu·e pour ce que je fais, pas seulement pour ce qui coince',
    sat: 40,
    sent: 45,
    possible: "Si on me voit, je ne suis plus réduit·e à ce qui ne va pas entre nous.",
    donne: 'Je reviens vers toi plus facilement, le contact redevient naturel.',
  },
  {
    owner: 'A',
    title: 'Intimité',
    note: 'calins, proximité, tactilité',
    sat: 45,
    sent: 50,
    possible: "Quand le contact revient, je n'ai plus besoin de tester si je compte encore.",
    donne: 'Je deviens un allié, pas un adversaire — je suis de ton côté, même quand le sujet me met en tort.',
  },
  {
    owner: 'B',
    title: 'Complicité',
    note: "quelqu'un à qui parler sans calculer",
    sat: 35,
    sent: 40,
    possible: "Je baisse la garde, je n'anticipe pas la réaction avant de parler.",
    donne: "Je t'écoute sans me braquer, je peux entendre ce que tu dis sans y lire un reproche.",
  },
  {
    owner: 'A',
    title: 'Écoute',
    note: "essayer de comprendre, donner de l'importance à ce que je ressens",
    sat: 50,
    sent: 55,
    possible: "Si ce que je dis compte, je n'ai plus besoin de trier avant de parler.",
    donne: 'Je te dis tout, même ce qui fâche — le jour même, pas quand tu le découvres.',
  },
];

export function buildSeedDoc(): CarteDoc {
  const nodes: CarteNode[] = SEED.map((s, i) => ({
    id: 'n' + (i + 1),
    owner: s.owner,
    title: s.title,
    note: s.note,
    sat: s.sat,
    sent: s.sent,
    x: RING_POSITIONS[i][0],
    y: RING_POSITIONS[i][1],
  }));

  const edges: CarteEdge[] = SEED.map((s, i) => ({
    id: 'e' + (i + 1),
    from: nodes[i].id,
    to: nodes[(i + 1) % nodes.length].id,
    possible: s.possible,
    donne: s.donne,
  }));

  return {
    nodes,
    edges,
    swapped: false,
    preambule:
      "Ce texte n'est pas un règlement. C'est une carte : elle montre ce dont chacun a besoin pour être capable de donner à l'autre. Tant qu'un maillon manque, le suivant ne tient pas — ce n'est pas de la mauvaise volonté, c'est un circuit coupé. On la relit quand ça coince, et on la corrige quand elle a tort.",
    engA: ["Je te dis ce qui s'est passé le jour même, pas quand tu le découvres.", 'Je te demande ta journée.'],
    engB: [],
    signA: '',
    signB: '',
    profilA: 'Exemple : je pars, en pensée ou en mots, dès que ça fait mal.',
    profilB: "Exemple : le contact et la vérité sont vécus comme des risques, donc je m'en éloigne.",
    travailA: ['Exemple : le besoin de fuir dès que ça devient douloureux.'],
    travailB: ['Exemple : le retrait au moment où ça devient intime.'],
    alertes: ["On se répond par messages alors qu'on est dans la même pièce.", 'Plusieurs jours sans aucun contact physique.'],
    rouges: ['Pas de mensonge, même par omission.', "Ce qui est dit ici ne sort pas d'ici."],
    manques: {},
    log: [],
  };
}
