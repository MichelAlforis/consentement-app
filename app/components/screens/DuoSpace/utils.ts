import { PartnerProfile, PersonalProfile, CommonGround } from '../../../types';
import { comfortCategories } from '../../../data';

export function generatePartnerProfile(): PartnerProfile {
  const profile: PartnerProfile = { tenderness: {}, intensity: {}, trust: {} };
  const baseComfort = Math.random() > 0.5 ? 3 : 2;
  const variance = () => Math.floor(Math.random() * 2) - 1;

  (Object.keys(comfortCategories) as Array<keyof typeof comfortCategories>).forEach((cat) => {
    const categoryMod = cat === 'tenderness' ? 1 : cat === 'intensity' ? 0 : -1;
    comfortCategories[cat].items.forEach((item) => {
      let itemMod = 0;
      if (['kisses', 'cuddles', 'holding', 'words'].includes(item.id)) itemMod = 1;
      if (['filming', 'power', 'restraint'].includes(item.id)) itemMod = -1;
      profile[cat][item.id] = Math.max(0, Math.min(4, baseComfort + categoryMod + itemMod + variance()));
    });
  });
  return profile;
}

export function calculateCommonGround(personal: PersonalProfile, partner: PartnerProfile): CommonGround {
  const common: CommonGround = { tenderness: {}, intensity: {}, trust: {} };
  (Object.keys(comfortCategories) as Array<keyof typeof comfortCategories>).forEach((cat) => {
    comfortCategories[cat].items.forEach((item) => {
      const myLevel = personal[cat][item.id] ?? 0;
      const partnerLevel = partner[cat][item.id] ?? 0;
      common[cat][item.id] = {
        level: Math.min(myLevel, partnerLevel),
        compatible: myLevel >= 2 && partnerLevel >= 2,
      };
    });
  });
  return common;
}

export const PARTNER_NAMES = ['Alex', 'Charlie', 'Sam', 'Jordan', 'Morgan', 'Taylor'];
export const PARTNER_SAFEWORDS = ['Rouge', 'Stop', 'Pause', 'Ananas'];
