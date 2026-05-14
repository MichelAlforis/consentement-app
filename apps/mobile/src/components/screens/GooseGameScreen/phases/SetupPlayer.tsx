import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { PAWN_ICONS } from '@ouiclair/core';
import { Zap, Leaf, Wind, Moon, Star, Dices } from 'lucide-react-native';
import type { ComponentType } from 'react';
import type { IconName } from '@ouiclair/core';
import { useTranslation } from '../../../../i18n';

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Leaf, Wind, Moon, Star, Dice5: Dices,
};

interface SetupPlayerProps {
  playerIndex: 0 | 1;
  otherPawn: IconName | undefined;
  onConfirm: (name: string, pawn: IconName) => void;
}

export function SetupPlayer({ playerIndex, otherPawn, onConfirm }: SetupPlayerProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [pawn, setPawn] = useState<IconName | null>(null);
  const available = PAWN_ICONS.filter(p => p !== otherPawn);
  const canConfirm = name.trim().length > 0 && pawn !== null;

  return (
    <MotiView
      key={playerIndex}
      from={{ opacity: 0, translateX: 40 }}
      animate={{ opacity: 1, translateX: 0 }}
      style={styles.container}
    >
      <View style={styles.topSection}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{playerIndex + 1}</Text>
        </View>
        <Text style={styles.title}>{t('gooseGame.setup.title', { n: playerIndex + 1 })}</Text>
        <Text style={styles.sub}>{t('gooseGame.setup.sub')}</Text>
      </View>

      <View>
        <Text style={styles.label}>{t('gooseGame.setup.nameLabel')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={playerIndex === 0 ? t('gooseGame.setup.placeholder1') : t('gooseGame.setup.placeholder2')}
            placeholderTextColor="rgba(0,0,0,0.4)"
            maxLength={20}
            style={styles.input}
          />
          {name.length > 0 && (
            <Text style={styles.counter}>{name.length}/20</Text>
          )}
        </View>
      </View>

      <View>
        <Text style={styles.label}>{t('gooseGame.setup.pawnLabel')}</Text>
        <View style={styles.pawnsRow}>
          {available.map(p => {
            const Icon = ICON_MAP[p] as LucideIcon | undefined;
            return (
              <Pressable
                key={p}
                onPress={() => setPawn(p)}
                style={[
                  styles.pawnBtn,
                  pawn === p ? styles.pawnBtnSelected : styles.pawnBtnDefault,
                ]}
              >
                {Icon ? <Icon size={26} color="white" /> : <Text style={{ color: 'white' }}>{p[0]}</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        onPress={() => { if (canConfirm && pawn) onConfirm(name.trim(), pawn); }}
        style={[styles.confirmBtn, canConfirm ? styles.confirmBtnActive : styles.confirmBtnInactive]}
      >
        <Text style={[styles.confirmBtnText, canConfirm ? styles.confirmBtnTextActive : styles.confirmBtnTextInactive]}>
          {playerIndex === 0 ? t('gooseGame.setup.next') : t('gooseGame.setup.start')}
        </Text>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  sub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  counter: {
    position: 'absolute',
    right: 12,
    top: '50%',
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '500',
  },
  pawnsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  pawnBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawnBtnDefault: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pawnBtnSelected: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  confirmBtn: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 'auto',
  },
  confirmBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  confirmBtnInactive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  confirmBtnText: {
    fontWeight: '700',
    fontSize: 16,
  },
  confirmBtnTextActive: {
    color: '#1e293b',
  },
  confirmBtnTextInactive: {
    color: 'rgba(255,255,255,0.4)',
  },
});
