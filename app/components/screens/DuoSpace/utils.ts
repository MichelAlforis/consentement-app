import { PersonalProfile, PartnerProfile, CommonGround } from '../../../types';
import { comfortCategories } from '../../../data';

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
