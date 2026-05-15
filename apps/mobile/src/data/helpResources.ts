export interface HelpResource {
  id: string;
  phone: string;       // display format
  dialNumber: string;  // stripped for tel: link
  color: string;
}

export interface EmergencyNumber {
  number: string;
  dialNumber: string;
  labelKey: string; // i18n key: help.emergency.*
}

// FR — France
const FR_RESOURCES: HelpResource[] = [
  { id: 'violences-femmes', phone: '3919',           dialNumber: '3919',        color: '#f472b6' }, // Violences Femmes Info
  { id: 'victimes',         phone: '116 006',         dialNumber: '116006',      color: '#e879f9' }, // France Victimes — toutes victimes (hommes inclus)
  { id: 'suicide',          phone: '3114',            dialNumber: '3114',        color: '#8b5cf6' }, // Prévention Suicide
  { id: 'enfance',          phone: '119',             dialNumber: '119',         color: '#f59e0b' }, // Enfance en Danger
  { id: 'fil-sante',        phone: '0 800 235 236',   dialNumber: '0800235236',  color: '#2dd4bf' }, // Fil Santé Jeunes
  { id: 'net-ecoute',       phone: '0 800 200 000',   dialNumber: '0800200000',  color: '#6366f1' }, // Net Écoute — cyberharcèlement
  { id: 'planning',         phone: '0 800 08 11 11',  dialNumber: '0800081111',  color: '#4ade80' }, // Planning Familial
];
const FR_EMERGENCY: EmergencyNumber[] = [
  { number: '17',  dialNumber: '17',  labelKey: 'help.emergency.police' },
  { number: '15',  dialNumber: '15',  labelKey: 'help.emergency.samu'   },
  { number: '114', dialNumber: '114', labelKey: 'help.emergency.sms'    },
];

// EN — United Kingdom
const EN_RESOURCES: HelpResource[] = [
  { id: 'domestic',    phone: '0808 2000 247', dialNumber: '08082000247', color: '#f472b6' }, // National Domestic Abuse Helpline (women)
  { id: 'mens-advice', phone: '0808 801 0327', dialNumber: '08088010327', color: '#60a5fa' }, // Men's Advice Line (men victims)
  { id: 'samaritans',  phone: '116 123',       dialNumber: '116123',      color: '#8b5cf6' }, // Samaritans
  { id: 'rape-crisis', phone: '0808 802 9999', dialNumber: '08088029999', color: '#2dd4bf' }, // Rape Crisis
  { id: 'nspcc',       phone: '0808 800 5000', dialNumber: '08088005000', color: '#f59e0b' }, // NSPCC — children
  { id: 'childline',   phone: '0800 1111',     dialNumber: '08001111',    color: '#4ade80' }, // Childline — children & young people
];
const EN_EMERGENCY: EmergencyNumber[] = [
  { number: '999', dialNumber: '999', labelKey: 'help.emergency.police' },
  { number: '999', dialNumber: '999', labelKey: 'help.emergency.samu'   },
  { number: '116', dialNumber: '116', labelKey: 'help.emergency.sms'    },
];

// ES — Espagne
const ES_RESOURCES: HelpResource[] = [
  { id: 'genero',     phone: '016',           dialNumber: '016',        color: '#f472b6' }, // Violencia de Género
  { id: 'victimas',   phone: '900 150 500',   dialNumber: '900150500',  color: '#60a5fa' }, // Atención a víctimas — hombres y todos géneros
  { id: 'suicidio',   phone: '024',           dialNumber: '024',        color: '#8b5cf6' }, // Atención Conducta Suicida
  { id: 'anar',       phone: '900 20 11 50',  dialNumber: '900201150',  color: '#f59e0b' }, // ANAR — menores
  { id: 'sexual',     phone: '900 210 110',   dialNumber: '900210110',  color: '#2dd4bf' }, // Violencia Sexual
  { id: 'ciberacoso', phone: '017',           dialNumber: '017',        color: '#6366f1' }, // INCIBE — ciberacoso e internet segura
];
const ES_EMERGENCY: EmergencyNumber[] = [
  { number: '112', dialNumber: '112', labelKey: 'help.emergency.police' },
  { number: '016', dialNumber: '016', labelKey: 'help.emergency.samu'   },
  { number: '024', dialNumber: '024', labelKey: 'help.emergency.sms'    },
];

export const HELP_RESOURCES: Record<string, HelpResource[]> = {
  fr: FR_RESOURCES,
  en: EN_RESOURCES,
  es: ES_RESOURCES,
};

export const EMERGENCY_NUMBERS: Record<string, EmergencyNumber[]> = {
  fr: FR_EMERGENCY,
  en: EN_EMERGENCY,
  es: ES_EMERGENCY,
};
