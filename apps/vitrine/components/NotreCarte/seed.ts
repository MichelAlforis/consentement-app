import type { CarteDoc, CarteNode, NodeKind, Owner } from './types';

const ROWS = [10, 143, 276, 409, 542];
const XS = [10, 252, 494];

interface SeedChainNode {
  kind: NodeKind;
  title: string;
  note: string;
  sat?: number;
  sent?: number;
}

interface SeedChain {
  owner: Owner;
  row: number;
  dir: 1 | -1;
  nodes: SeedChainNode[];
}

/**
 * Contenu d'exemple générique — à remplacer entièrement par vos propres
 * besoins dans l'app. Rien de personnel ne doit être codé en dur ici :
 * ce fichier est publié dans un repo public.
 */
const CHAINS: SeedChain[] = [
  {
    owner: 'A',
    row: 0,
    dir: 1,
    nodes: [
      { kind: 'besoin', title: 'Sécurité', note: 'se sentir en confiance, sans avoir à vérifier', sat: 55, sent: 60 },
      { kind: 'capacite', title: "Je n'ai plus besoin de contrôler", note: "Quand je sais où j'en suis, mon attention se libère au lieu de tourner en boucle." },
      { kind: 'reponse', title: 'Je peux être pleinement présent·e pour toi', note: "L'attention que je passais à vérifier, je peux la mettre sur nous." },
    ],
  },
  {
    owner: 'B',
    row: 1,
    dir: -1,
    nodes: [
      { kind: 'besoin', title: 'Reconnaissance', note: 'être vu·e pour ce que je fais, pas seulement pour ce qui coince', sat: 40, sent: 45 },
      { kind: 'capacite', title: "J'existe autrement que dans le problème", note: 'Si on me voit, je ne suis plus réduit·e à ce qui ne va pas entre nous.' },
      { kind: 'reponse', title: 'Je reviens vers toi plus facilement', note: 'Quand je me sens vu·e, le contact redevient naturel.' },
    ],
  },
  {
    owner: 'A',
    row: 2,
    dir: 1,
    nodes: [
      { kind: 'besoin', title: 'Intimité', note: 'calins, proximité, tactilité', sat: 45, sent: 50 },
      { kind: 'capacite', title: 'Je me sens voulu·e, pas toléré·e', note: "Quand le contact revient, je n'ai plus besoin de tester si je compte encore." },
      { kind: 'reponse', title: 'Je deviens un allié, pas un adversaire', note: 'Je suis de ton côté, même quand le sujet me met en tort.' },
    ],
  },
  {
    owner: 'B',
    row: 3,
    dir: -1,
    nodes: [
      { kind: 'besoin', title: 'Complicité', note: "quelqu'un à qui parler sans calculer", sat: 35, sent: 40 },
      { kind: 'capacite', title: 'Je baisse la garde', note: "Je n'anticipe pas la réaction avant de parler." },
      { kind: 'reponse', title: "Je t'écoute sans me braquer", note: "Je peux entendre ce que tu dis sans y lire un reproche." },
    ],
  },
  {
    owner: 'A',
    row: 4,
    dir: 1,
    nodes: [
      { kind: 'besoin', title: 'Écoute', note: "essayer de comprendre, donner de l'importance à ce que je ressens", sat: 50, sent: 55 },
      { kind: 'capacite', title: 'Je me sens en sécurité avec toi', note: "Si ce que je dis compte, je n'ai plus besoin de trier avant de parler." },
      { kind: 'reponse', title: 'Je te dis tout, même ce qui fâche', note: 'Le jour même, pas quand tu le découvres.' },
    ],
  },
];

function buildSeedNodes(): CarteNode[] {
  const nodes: CarteNode[] = [];
  CHAINS.forEach((chain) => {
    chain.nodes.forEach((n, i) => {
      const col = chain.dir === 1 ? i : 2 - i;
      nodes.push({
        id: 'n' + (nodes.length + 1),
        owner: chain.owner,
        kind: n.kind,
        title: n.title,
        note: n.note,
        sat: n.sat ?? 60,
        sent: n.sent ?? 60,
        x: XS[col],
        y: ROWS[chain.row],
      });
    });
  });
  return nodes;
}

export function buildSeedDoc(): CarteDoc {
  const nodes = buildSeedNodes();
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) edges.push({ from: nodes[i].id, to: nodes[i + 1].id });
  edges.push({ from: nodes[14].id, to: nodes[9].id });
  edges.push({ from: nodes[11].id, to: nodes[0].id });

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
    alertes: ["On se répond par messages alors qu'on est dans la même pièce.", "Plusieurs jours sans aucun contact physique."],
    rouges: ['Pas de mensonge, même par omission.', "Ce qui est dit ici ne sort pas d'ici."],
    manques: {},
    log: [],
  };
}
