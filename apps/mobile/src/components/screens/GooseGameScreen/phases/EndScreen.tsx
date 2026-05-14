import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Trophy, Handshake, Leaf, Waves, Sparkles, Heart } from 'lucide-react-native';
import type { ReactNode } from 'react';
import type { Player } from '../types';
import { useTranslation } from '../../../../i18n';
import { GameEndCinematic } from '../../../../game-engine/shared/GameEndCinematic';

interface EndScreenProps {
  player1: Player;
  player2: Player;
  accordsCount: number;
  onReplay: () => void;
  onQuit: () => void;
}

export function EndScreen({ player1, player2, accordsCount, onReplay, onQuit }: EndScreenProps) {
  const { t } = useTranslation();
  const cinematicIntensity: 'low' | 'medium' | 'high' =
    accordsCount >= 4 ? 'high' : accordsCount >= 2 ? 'medium' : 'low';

  const endMessages: { threshold: number; text: string; icon: ReactNode }[] = [
    { threshold: 0,        text: t('gooseGame.end.msg0'), icon: <Leaf size={20} color="white" /> },
    { threshold: 2,        text: t('gooseGame.end.msg1'), icon: <Waves size={20} color="white" /> },
    { threshold: 4,        text: t('gooseGame.end.msg2'), icon: <Sparkles size={20} color="white" /> },
    { threshold: Infinity, text: t('gooseGame.end.msg3'), icon: <Heart size={20} color="white" /> },
  ];

  // findLast non disponible avant iOS 15 — remplacé par reverse().find()
  const msg = [...endMessages].reverse().find(m => accordsCount > m.threshold) ?? endMessages[0];

  const accordLabel = accordsCount === 0
    ? t('gooseGame.end.accord0')
    : accordsCount === 1
    ? t('gooseGame.end.accord1')
    : t('gooseGame.end.accordMany');

  return (
    <View style={styles.container}>
      <GameEndCinematic primaryColor="#c084fc" secondaryColor="#60a5fa" intensity={cinematicIntensity} />
      <View style={styles.content}>
        <MotiView from={{ opacity: 0, translateY: -12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
          <View style={styles.trophySection}>
            <Trophy size={44} color="rgba(255,255,255,0.9)" />
            <Text style={styles.endTitle}>{t('gooseGame.end.title')}</Text>
            <Text style={styles.endSub}>{t('gooseGame.end.sub')}</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 200, type: 'spring', stiffness: 260 }}
          style={styles.avatarsRow}
        >
          <View style={styles.avatarItem}>
            <Text style={styles.avatarPawn}>{player1.pawn[0]}</Text>
            <Text style={styles.avatarName}>{player1.name}</Text>
          </View>
          <Text style={styles.separator}>×</Text>
          <View style={styles.avatarItem}>
            <Text style={styles.avatarPawn}>{player2.pawn[0]}</Text>
            <Text style={styles.avatarName}>{player2.name}</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 350 }}
          style={styles.cards}
        >
          <View style={styles.accordCard}>
            <Handshake size={28} color="#93c5fd" />
            <View>
              <Text style={styles.accordCount}>{accordsCount}</Text>
              <Text style={styles.accordLabel}>{accordLabel}</Text>
            </View>
          </View>

          <View style={styles.msgCard}>
            {msg.icon}
            <Text style={styles.msgText}>{msg.text}</Text>
          </View>

          <View style={styles.zonesRow}>
            <Text style={[styles.zoneText, { color: '#4ade80' }]}>{t('gooseGame.end.zone1')}</Text>
            <Text style={styles.zoneSep}>→</Text>
            <Text style={[styles.zoneText, { color: '#60a5fa' }]}>{t('gooseGame.end.zone2')}</Text>
            <Text style={styles.zoneSep}>→</Text>
            <Text style={[styles.zoneText, { color: '#c084fc' }]}>{t('gooseGame.end.zone3')}</Text>
          </View>
        </MotiView>

        <Text style={styles.quote}>{t('gooseGame.end.quote')}</Text>

        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 550 }}>
          <Pressable onPress={onReplay} style={styles.replayBtn}>
            <Text style={styles.replayBtnText}>{t('gooseGame.end.replay')}</Text>
          </Pressable>
        </MotiView>
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 700 }}>
          <Pressable onPress={onQuit} style={styles.quitBtn}>
            <Text style={styles.quitBtnText}>{t('gooseGame.end.quit')}</Text>
          </Pressable>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0838',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    gap: 20,
    zIndex: 10,
  },
  trophySection: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 16,
  },
  endTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
  },
  endSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarItem: {
    alignItems: 'center',
    gap: 4,
  },
  avatarPawn: {
    color: 'white',
    fontSize: 40,
  },
  avatarName: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '700',
  },
  separator: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 20,
  },
  cards: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  accordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(96,165,250,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)',
  },
  accordCount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#93c5fd',
  },
  accordLabel: {
    fontSize: 12,
    color: 'rgba(147,197,253,0.75)',
  },
  msgCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  msgText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  zonesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  zoneText: {
    fontSize: 12,
    fontWeight: '600',
  },
  zoneSep: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
  },
  quote: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  replayBtn: {
    width: 280,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
  },
  replayBtnText: {
    color: '#1e293b',
    fontWeight: '700',
    fontSize: 16,
  },
  quitBtn: {
    width: 280,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
  },
  quitBtnText: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    fontSize: 14,
  },
});
