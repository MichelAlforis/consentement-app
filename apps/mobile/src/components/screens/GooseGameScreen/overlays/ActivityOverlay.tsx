import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Pause, Heart } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { ZONES, getSquareIconName } from '@ouiclair/core';
import type { Zone, BoardSquare } from '@ouiclair/core';
import { Overlay } from '../components/Overlay';
import type { TurnStep } from '../types';
import { useTranslation } from '../../../../i18n';

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

const ICON_MAP: Record<string, LucideIcon> = {
  Pause, Heart,
};

interface ActivityOverlayProps {
  step: Extract<TurnStep, 'normal' | 'pause' | 'complicite'>;
  activity: string;
  activeName: string;
  currentSquare: BoardSquare;
  squareBg: string;
  currentZone: Zone;
  onContinue: () => void;
}

export function ActivityOverlay({
  step, activity, activeName, currentSquare, squareBg, currentZone, onContinue,
}: ActivityOverlayProps) {
  const { t } = useTranslation();
  const isPause      = step === 'pause';
  const isComplicite = step === 'complicite';
  const zoneNames = [t('gooseGame.end.zone1'), t('gooseGame.end.zone2'), t('gooseGame.end.zone3')];
  const zoneIdx = ZONES.indexOf(currentZone);

  const iconName = isPause ? 'Pause' : isComplicite ? 'Heart' : String(getSquareIconName(currentSquare));
  const Icon = ICON_MAP[iconName];
  const label = isPause
    ? t('gooseGame.activity.pause')
    : isComplicite
    ? t('gooseGame.activity.complicite')
    : currentSquare.face ? t(`diceCategories.${currentSquare.face}`) : '';

  return (
    <Overlay color={squareBg || '#1e293b'}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {Icon ? <Icon size={26} color="rgba(255,255,255,0.85)" /> : null}
          <View>
            <Text style={styles.labelText}>{label.toUpperCase()}</Text>
            <Text style={styles.playerName}>{activeName}</Text>
          </View>
        </View>
        <View style={[styles.zoneBadge, { borderColor: currentZone.color + '44' }]}>
          <Text style={[styles.zoneBadgeText, { color: currentZone.color }]}>
            {zoneNames[zoneIdx] ?? zoneNames[0]}
          </Text>
        </View>
      </View>

      <Text style={styles.activityText}>{activity}</Text>

      <Pressable
        onPress={onContinue}
        style={styles.continueBtn}
      >
        <Text style={styles.continueBtnText}>{t('gooseGame.activity.continueBtn')}</Text>
      </Pressable>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labelText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
  },
  playerName: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  zoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
  },
  zoneBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activityText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 28,
    lineHeight: 28,
  },
  continueBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
  },
  continueBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
