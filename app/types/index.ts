// Types pour l'application Consentement V2

export type Screen =
  | 'welcome'
  | 'age-check'
  | 'auth'
  | 'home-minor'
  | 'home-adult'
  | 'personal-space'
  | 'duo-space'
  | 'learn'
  | 'help'
  | 'scenarios-minor'
  | 'feelings';

export interface ComfortItem {
  id: string;
  label: string;
  icon: string;
}

export interface ComfortCategory {
  icon: string;
  title: string;
  description: string;
  color: string;
  items: ComfortItem[];
}

export interface ComfortCategories {
  tenderness: ComfortCategory;
  intensity: ComfortCategory;
  trust: ComfortCategory;
}

export interface ComfortLevel {
  value: number;
  label: string;
  color: string;
  emoji: string;
}

export interface PersonalProfile {
  tenderness: Record<string, number>;
  intensity: Record<string, number>;
  trust: Record<string, number>;
  safeword: string;
}

export interface PartnerProfile {
  tenderness: Record<string, number>;
  intensity: Record<string, number>;
  trust: Record<string, number>;
}

export interface CommonGroundItem {
  level: number;
  compatible: boolean;
}

export interface CommonGround {
  tenderness: Record<string, CommonGroundItem>;
  intensity: Record<string, CommonGroundItem>;
  trust: Record<string, CommonGroundItem>;
}

export interface HelpResource {
  name: string;
  phone: string;
  desc: string;
  color: string;
}

export interface ConsentPrinciple {
  emoji: string;
  title: string;
  text: string;
}

export interface MenuItem {
  screen: Screen;
  icon: string;
  title: string;
  desc: string;
}

export interface AppState {
  isAuthenticated: boolean;
  isAdult: boolean | null;
  currentScreen: Screen;
  userName: string;
  personalProfile: PersonalProfile;
  duoConnected: boolean;
  duoCode: string;
  partnerProfile: PartnerProfile | null;
  showComparison: boolean;
}

// Flow Duo - Étapes du rituel
export type DuoStep =
  | 'choice'        // Choix de connexion (bump ou QR/code)
  | 'bump'          // Tentative de connexion Bump/BLE
  | 'qr-fallback'   // Fallback QR code si bump échoue
  | 'connecting'    // Animation de connexion en cours
  | 'connected'     // Étape 1: "Vous êtes connectés" (cercles fusionnant)
  | 'pact'          // Étape 2: "Notre pacte" (3 rappels)
  | 'filling'       // Étape 3: "Chacun son moment" (remplissage profil)
  | 'waiting'       // Étape 4: "En t'attendant" (attente partenaire)
  | 'ready'         // Étape 5: "Prêts ?" (double validation)
  | 'reveal'        // Étape 6: "Révélation" (progressive par catégorie)
  | 'summary';      // Étape 7: "Votre espace commun"

export interface DuoSession {
  step: DuoStep;
  partnerName: string;
  myPactAccepted: boolean;
  partnerPactAccepted: boolean;
  myProfileCompleted: boolean;
  partnerProfileCompleted: boolean;
  myReadyConfirmed: boolean;
  partnerReadyConfirmed: boolean;
  revealedCategories: ('tenderness' | 'intensity' | 'trust')[];
}
