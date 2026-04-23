'use client';
import { Zone } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';

interface ZoneIndicatorProps {
  currentZone: Zone;
  zoneIndex: number;
}

export function ZoneIndicator({ currentZone, zoneIndex }: ZoneIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            height: 3,
            width: i === zoneIndex ? 24 : 8,
            borderRadius: 4,
            background: i === zoneIndex ? currentZone.color : 'rgba(255,255,255,0.2)',
            transition: 'all 0.6s ease',
          }}
        />
      ))}
      <span style={{
        fontSize: 10,
        color: currentZone.color,
        fontWeight: 700,
        marginLeft: 4,
        transition: 'color 0.6s ease',
      }}>
        <DynamicIcon name={currentZone.iconName} size={9} color={currentZone.color} /> {currentZone.name}
      </span>
    </div>
  );
}
