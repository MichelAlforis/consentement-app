import { View, Text, StyleSheet } from 'react-native';
import { Zap, Leaf, Wind, Moon, Star, Dices, Waves, Sparkles } from 'lucide-react-native';
import type { ComponentType } from 'react';
import type { Zone } from '@ouiclair/core';
import { useTranslation } from '../../../../i18n';

const ICON_MAP: Record<string, ComponentType<{ size?: number; color?: string }>> = {
  Zap, Leaf, Wind, Moon, Star, Dices, Waves, Sparkles,
};

interface ZoneIndicatorProps {
  currentZone: Zone;
  zoneIndex: number;
}

export function ZoneIndicator({ currentZone, zoneIndex }: ZoneIndicatorProps) {
  const { t } = useTranslation();
  const zoneNames = [t('gooseGame.end.zone1'), t('gooseGame.end.zone2'), t('gooseGame.end.zone3')];
  const zoneName = zoneNames[zoneIndex] ?? zoneNames[0];
  const Icon = ICON_MAP[currentZone.iconName] as ComponentType<{ size?: number; color?: string }> | undefined;

  return (
    <View style={styles.container}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: i === zoneIndex ? 24 : 8,
              backgroundColor: i === zoneIndex ? currentZone.color : 'rgba(255,255,255,0.2)',
            },
          ]}
        />
      ))}
      <View style={styles.labelRow}>
        {Icon ? <Icon size={9} color={currentZone.color} /> : null}
        <Text style={[styles.label, { color: currentZone.color }]}>{zoneName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  dot: {
    height: 3,
    borderRadius: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
});
