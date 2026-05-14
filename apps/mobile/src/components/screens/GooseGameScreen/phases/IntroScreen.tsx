import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { RotateCcw, Dices, Pause, Star, Handshake, Heart } from 'lucide-react-native';
import type { ComponentType } from 'react';
import type { SavedGooseGame } from '../types';
import { useTranslation } from '../../../../i18n';

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

interface IntroScreenProps {
  savedGame: SavedGooseGame | null;
  onNew: () => void;
  onResume: () => void;
}

export function IntroScreen({ savedGame, onNew, onResume }: IntroScreenProps) {
  const { t } = useTranslation();

  const cells: { Icon: LucideIcon; bg: string; label: string; desc: string }[] = [
    { Icon: Pause,     bg: '#f87171', label: t('gooseGame.intro.cellPause'),      desc: t('gooseGame.intro.cellPauseDesc') },
    { Icon: Star,      bg: '#fbbf24', label: t('gooseGame.intro.cellChance'),     desc: t('gooseGame.intro.cellChanceDesc') },
    { Icon: Handshake, bg: '#60a5fa', label: t('gooseGame.intro.cellAccord'),     desc: t('gooseGame.intro.cellAccordDesc') },
    { Icon: Heart,     bg: '#c084fc', label: t('gooseGame.intro.cellComplicite'), desc: t('gooseGame.intro.cellCompliciteDesc') },
  ];

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Dices size={60} color="white" />
          <Text style={styles.title}>{t('gooseGame.intro.title')}</Text>
          <Text style={styles.sub1}>{t('gooseGame.intro.sub1')}</Text>
          <Text style={styles.goal}>{t('gooseGame.intro.goal')}</Text>
        </View>

        <View style={styles.cellsBox}>
          {cells.map(item => (
            <View key={item.label} style={styles.cellRow}>
              <View style={[styles.cellIcon, { backgroundColor: item.bg + '28' }]}>
                <item.Icon size={16} color={item.bg} />
              </View>
              <Text style={styles.cellLabel}>{item.label}</Text>
              <Text style={styles.cellDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {savedGame && (
          <Pressable onPress={onResume} style={styles.resumeBtn}>
            <RotateCcw size={15} color="white" />
            <Text style={styles.resumeBtnText}>{t('gooseGame.intro.resume')}</Text>
          </Pressable>
        )}

        <Pressable onPress={onNew} style={styles.newBtn}>
          <Text style={styles.newBtnText}>{savedGame ? t('gooseGame.intro.new') : t('gooseGame.intro.start')}</Text>
        </Pressable>
      </ScrollView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scroll: {
    alignItems: 'center',
    padding: 24,
    gap: 24,
  },
  topSection: {
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
  },
  sub1: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  goal: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 280,
  },
  cellsBox: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cellRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cellIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },
  cellDesc: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 300,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  resumeBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  newBtn: {
    width: '100%',
    maxWidth: 300,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
  },
  newBtnText: {
    color: '#1e293b',
    fontWeight: '700',
    fontSize: 16,
  },
});
