import { ComfortCategories, ComfortLevel, ConsentPrinciple, HelpResource } from '../types';

export const comfortCategories: ComfortCategories = {
  tenderness: {
    icon: '🌸',
    title: 'Tendresse',
    description: 'Intimité émotionnelle et contact doux',
    color: '#f8a5c2',
    items: [
      { id: 'kisses', label: 'Baisers', icon: '💋' },
      { id: 'cuddles', label: 'Câlins', icon: '🤗' },
      { id: 'massage', label: 'Massages', icon: '✨' },
      { id: 'words', label: 'Mots doux', icon: '💬' },
      { id: 'holding', label: 'Se tenir la main', icon: '🤝' },
      { id: 'sleeping', label: 'Dormir ensemble', icon: '😴' }
    ]
  },
  intensity: {
    icon: '🔥',
    title: 'Intensité',
    description: "Rythme et niveau d'intimité",
    color: '#ff7675',
    items: [
      { id: 'slow', label: 'Prendre son temps', icon: '🐢' },
      { id: 'spontaneous', label: 'Spontanéité', icon: '⚡' },
      { id: 'lights', label: 'Lumières allumées', icon: '💡' },
      { id: 'talking', label: 'Parler pendant', icon: '🗣️' },
      { id: 'eye-contact', label: 'Contact visuel', icon: '👁️' },
      { id: 'guidance', label: "Guider l'autre", icon: '🧭' }
    ]
  },
  trust: {
    icon: '⛓️',
    title: 'Confiance',
    description: 'Pratiques nécessitant une communication renforcée',
    color: '#a29bfe',
    items: [
      { id: 'blindfold', label: 'Yeux bandés', icon: '🙈' },
      { id: 'restraint', label: 'Immobilisation douce', icon: '🎀' },
      { id: 'roleplay', label: 'Jeux de rôle', icon: '🎭' },
      { id: 'power', label: 'Dynamique de pouvoir', icon: '👑' },
      { id: 'toys', label: 'Accessoires', icon: '🎁' },
      { id: 'filming', label: 'Photos/Vidéos', icon: '📵' }
    ]
  }
};

export const comfortLevels: ComfortLevel[] = [
  { value: 0, label: 'Non', color: '#e74c3c', emoji: '🚫' },
  { value: 1, label: 'Pas maintenant', color: '#e67e22', emoji: '⏸️' },
  { value: 2, label: 'Curieux·se', color: '#f1c40f', emoji: '🤔' },
  { value: 3, label: "À l'aise", color: '#2ecc71', emoji: '✅' },
  { value: 4, label: "J'adore", color: '#9b59b6', emoji: '💜' }
];

export const consentPrinciples: ConsentPrinciple[] = [
  { emoji: '🔄', title: 'Continu', text: 'Il peut être retiré à tout moment. Un "oui" peut devenir un "non".' },
  { emoji: '🗣️', title: 'Explicite', text: 'Le silence ou l\'absence de "non" ne signifie pas "oui".' },
  { emoji: '🎯', title: 'Spécifique', text: 'Accepter une chose ne veut pas dire accepter tout.' },
  { emoji: '💚', title: 'Libre', text: 'Sans pression, sans chantage, sans manipulation.' },
  { emoji: '🧠', title: 'Éclairé', text: 'On doit comprendre ce à quoi on consent.' }
];

export const helpResources: HelpResource[] = [
  { name: 'Fil Santé Jeunes', phone: '0 800 235 236', desc: 'Anonyme et gratuit', color: '#4db6ac' },
  { name: 'Violences Femmes Info', phone: '3919', desc: '24h/24', color: '#f78fb3' },
  { name: 'Planning Familial', phone: '0 800 08 11 11', desc: 'Sexualité, contraception', color: '#81c784' }
];

export const initialPersonalProfile = {
  tenderness: {},
  intensity: {},
  trust: {},
  safeword: ''
};
