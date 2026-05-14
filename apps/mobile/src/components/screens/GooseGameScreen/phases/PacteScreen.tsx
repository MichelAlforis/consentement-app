import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Handshake, Lock, Pause } from 'lucide-react-native';
import type { ComponentType } from 'react';
import type { Player } from '../types';
import { useTranslation } from '../../../../i18n';

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

const PACTE_ICONS: LucideIcon[] = [Handshake, Lock, Pause];

interface PacteScreenProps {
  player1: Player;
  player2: Player;
  onStart: () => void;
}

export function PacteScreen({ player1, player2, onStart }: PacteScreenProps) {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);

  const pacteLines = [
    t('gooseGame.pacte.line1'),
    t('gooseGame.pacte.line2'),
    t('gooseGame.pacte.line3'),
  ];

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500 + pacteLines.length * 500 + 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
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
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300 }}
        style={styles.titleSection}
      >
        <Text style={styles.title}>{t('gooseGame.pacte.title')}</Text>
        <Text style={styles.sub}>{t('gooseGame.pacte.sub')}</Text>
      </MotiView>

      <View style={styles.lines}>
        {pacteLines.map((line, i) => {
          const Icon = PACTE_ICONS[i];
          return (
            <MotiView
              key={i}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 600 + i * 500, type: 'spring', stiffness: 200 }}
              style={styles.lineRow}
            >
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 800 + i * 500, type: 'spring', stiffness: 350 }}
              >
                <Icon size={18} color="white" />
              </MotiView>
              <Text style={styles.lineText}>{line}</Text>
            </MotiView>
          );
        })}
      </View>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        style={{ width: '100%', maxWidth: 300, marginTop: 'auto' }}
      >
        <Pressable
          onPress={ready ? onStart : undefined}
          style={[styles.acceptBtn, ready ? styles.acceptBtnReady : styles.acceptBtnWaiting]}
        >
          <Text style={styles.acceptBtnText}>{t('gooseGame.pacte.acceptBtn')}</Text>
        </Pressable>
      </MotiView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
    gap: 24,
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
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 24,
  },
  titleSection: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },
  sub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  lines: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  lineText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  acceptBtn: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  acceptBtnReady: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  acceptBtnWaiting: {
    backgroundColor: 'transparent',
  },
  acceptBtnText: {
    fontWeight: '900',
    fontSize: 16,
    color: '#1e293b',
  },
});
