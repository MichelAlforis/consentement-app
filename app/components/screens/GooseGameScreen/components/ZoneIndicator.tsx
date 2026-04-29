'use client';
import { Zone } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';
import { useTranslation } from '../../../../i18n';

interface ZoneIndicatorProps {
  currentZone: Zone;
  zoneIndex: number;
}

export function ZoneIndicator({ currentZone, zoneIndex }: ZoneIndicatorProps) {
  const { t } = useTranslation();
  const zoneNames = [t('gooseGame.end.zone1'), t('gooseGame.end.zone2'), t('gooseGame.end.zone3')];
  const zoneName = zoneNames[zoneIndex] ?? zoneNames[0];
  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="h-[3px] rounded transition-all duration-[600ms]"
          style={{
            width: i === zoneIndex ? 24 : 8,
            background: i === zoneIndex ? currentZone.color : 'rgba(255,255,255,0.2)',
          }}
        />
      ))}
      <span
        className="text-[10px] font-bold ml-1 transition-colors duration-[600ms] flex items-center gap-1"
        style={{ color: currentZone.color }}
      >
        <DynamicIcon name={currentZone.iconName} size={9} color={currentZone.color} /> {zoneName}
      </span>
    </div>
  );
}
