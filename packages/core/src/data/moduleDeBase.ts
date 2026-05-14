// Contenu placeholder — à affiner par l'équipe.
// Chaque slide est affiché séquentiellement dans ModuleDeBaseScreen.

export interface ModuleSlide {
  id: string;
  iconName: string;
  title: string;
  body: string;
}

export const MODULE_DE_BASE_SLIDES: ModuleSlide[] = [
  {
    id: 'bienvenue',
    iconName: 'WaveIcon',
    title: 'Bienvenue dans Consentement',
    body: "Cette app t'aide à explorer et à mieux comprendre le consentement — pas comme un cours, mais à travers des conversations vraies, des cartes à tirer et des modules courts.\n\nTu avances à ton rythme. Tout ce que tu fais ici est 100% privé.",
  },
  {
    id: 'concept',
    iconName: 'CollectorCardIcon',
    title: "L'éducation débloque le jeu",
    body: "Chaque module que tu complètes te fait gagner des cartes collector. Ces cartes alimentent le jeu de cartes — seul·e ou à deux.\n\nPlus tu explores, plus ton deck s'enrichit. Plus ton deck est riche, plus les conversations vont en profondeur.",
  },
  {
    id: 'consentement',
    iconName: 'OpenPalmIcon',
    title: "Le consentement, c'est quoi ?",
    body: "C'est dire oui — librement, clairement, à tout moment.\nC'est aussi pouvoir dire non, changer d'avis, ou marquer une pause sans se justifier.\n\nLe consentement n'est pas une formalité. C'est la base d'une relation saine.",
  },
  {
    id: 'prive',
    iconName: 'PrivacyLockIcon',
    title: 'Ton espace est privé',
    body: "Tes données restent sur ton appareil. Aucun compte, aucun serveur, aucun tracking.\n\nTu peux tout supprimer à tout moment depuis les réglages.",
  },
];

export const MODULE_DE_BASE_SLIDES_MINEUR: ModuleSlide[] = [
  {
    id: 'bienvenue',
    iconName: 'WaveIcon',
    title: 'Bienvenue !',
    body: "Cette app te parle de consentement — pas comme un cours ennuyeux, mais avec des vraies questions, des cartes à débloquer et des infos utiles.\n\nTout ce que tu fais ici est 100% privé. Personne ne voit ce que tu lis ou ce que tu réponds.",
  },
  {
    id: 'concept',
    iconName: 'CollectorCardIcon',
    title: 'Des cartes à débloquer',
    body: "Chaque module que tu complètes te fait gagner des cartes. Ces cartes te servent pour jouer — seul·e ou avec quelqu'un en qui tu as confiance.\n\nPlus tu explores, plus tu débloques de cartes.",
  },
  {
    id: 'consentement',
    iconName: 'OpenPalmIcon',
    title: "Le consentement, c'est quoi ?",
    body: "C'est dire oui — pour de vrai, librement, sans pression.\nC'est aussi pouvoir dire non ou changer d'avis à n'importe quel moment — sans avoir à se justifier.\n\nC'est valable pour toi et pour les autres.",
  },
  {
    id: 'prive',
    iconName: 'PrivacyLockIcon',
    title: 'Cet espace est à toi',
    body: "Rien n'est envoyé, rien n'est stocké sur un serveur. Personne d'autre ne peut voir ce que tu fais ici.\n\nTu peux tout effacer quand tu veux.",
  },
];
