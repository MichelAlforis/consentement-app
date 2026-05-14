import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Check, X, EyeOff, Sparkles, Smile, Handshake } from 'lucide-react-native';
import { Zap, Leaf, Wind, Moon, Star, Dices } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Overlay } from '../components/Overlay';
import type { Player, TurnStep } from '../types';
import { useTranslation } from '../../../../i18n';

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Leaf, Wind, Moon, Star, Dices, Handshake, Sparkles, Smile, Check, X, EyeOff,
};

function PawnIcon({ name, size, color }: { name: string; size: number; color: string }) {
  const Icon = ICON_MAP[name] as LucideIcon | undefined;
  if (!Icon) return <Text style={{ fontSize: size * 0.7, color }}>{name[0]}</Text>;
  return <Icon size={size} color={color} />;
}

type AccordStep = Extract<TurnStep, 'accord-intro' | 'accord-p1' | 'accord-hidden' | 'accord-p2' | 'accord-result'>;

interface AccordFlowProps {
  step: AccordStep;
  activity: string;
  player1: Player;
  player2: Player;
  accordVote0: boolean | null;
  accordVote1: boolean | null;
  accordsCount: number;
  onIntroNext: () => void;
  onP1Vote: (v: boolean) => void;
  onP2Ready: () => void;
  onP2Vote: (v: boolean) => void;
  onResult: (bothYes: boolean) => void;
}

export function AccordFlow({
  step, activity, player1, player2,
  accordVote0, accordVote1, accordsCount,
  onIntroNext, onP1Vote, onP2Ready, onP2Vote, onResult,
}: AccordFlowProps) {
  const { t } = useTranslation();
  const bothYes = accordVote0 === true && accordVote1 === true;

  return (
    <AnimatePresence>

      {step === 'accord-intro' && (
        <MotiView key="acc-intro" from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Overlay color="#1d4ed8">
            <View style={styles.center}>
              <Handshake size={40} color="white" />
              <Text style={styles.title}>{t('gooseGame.accord.title')}</Text>
              <Text style={styles.sub}>{t('gooseGame.accord.sub')}</Text>
            </View>
            <View style={styles.activityBox}>
              <Text style={styles.activityText}>{activity}</Text>
            </View>
            <Pressable onPress={onIntroNext} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>{t('gooseGame.accord.voteSecret')}</Text>
            </Pressable>
          </Overlay>
        </MotiView>
      )}

      {step === 'accord-p1' && (
        <MotiView key="acc-p1" from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Overlay color="#0f172a">
            <View style={[styles.center, { marginBottom: 16 }]}>
              <PawnIcon name={player1.pawn} size={32} color="white" />
              <Text style={styles.votePlayerName}>{t('gooseGame.accord.yourVote', { name: player1.name })}</Text>
              <Text style={styles.voteSub}>{t('gooseGame.accord.noSee')}</Text>
            </View>
            <Text style={styles.voteActivity}>{activity}</Text>
            <VoteButtons onVote={onP1Vote} />
          </Overlay>
        </MotiView>
      )}

      {step === 'accord-hidden' && (
        <MotiView key="acc-hidden" from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Overlay color="#060912">
            <View style={[styles.center, { paddingVertical: 24 }]}>
              <EyeOff size={48} color="rgba(255,255,255,0.6)" />
              <Text style={styles.passTitle}>{t('gooseGame.accord.passPhone', { name: player2.name })}</Text>
              <Text style={styles.passSubText}>{t('gooseGame.accord.voted', { name: player1.name })}</Text>
              <Pressable onPress={onP2Ready} style={styles.ghostBtn}>
                <Text style={styles.ghostBtnText}>{t('gooseGame.accord.ready', { name: player2.name })}</Text>
              </Pressable>
            </View>
          </Overlay>
        </MotiView>
      )}

      {step === 'accord-p2' && (
        <MotiView key="acc-p2" from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Overlay color="#0f172a">
            <View style={[styles.center, { marginBottom: 16 }]}>
              <PawnIcon name={player2.pawn} size={32} color="white" />
              <Text style={styles.votePlayerName}>{t('gooseGame.accord.yourVote', { name: player2.name })}</Text>
              <Text style={styles.voteSub}>{t('gooseGame.accord.voteWithout', { name: player1.name })}</Text>
            </View>
            <Text style={styles.voteActivity}>{activity}</Text>
            <VoteButtons onVote={onP2Vote} />
          </Overlay>
        </MotiView>
      )}

      {step === 'accord-result' && (
        <MotiView key="acc-result" from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Overlay color={bothYes ? '#14532d' : '#1e293b'}>
            <View style={[styles.center, { paddingVertical: 8 }]}>
              <MotiView
                from={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                {bothYes ? <Sparkles size={48} color="white" /> : <Smile size={48} color="white" />}
              </MotiView>
              <Text style={styles.resultTitle}>
                {bothYes ? t('gooseGame.accord.success') : t('gooseGame.accord.noWorry')}
              </Text>
              {bothYes ? (
                <>
                  <View style={styles.bothYesRow}>
                    <Check size={14} color="#4ade80" />
                    <Text style={styles.bothYesText}>
                      {t('gooseGame.accord.bothYesPlayers', { p1: player1.name, p2: player2.name })}
                    </Text>
                    <Check size={14} color="#4ade80" />
                  </View>
                  <Text style={styles.accordNum}>
                    {t('gooseGame.accord.accordNum', { count: accordsCount + 1 })}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.noSaid}>{t('gooseGame.accord.noSaid')}</Text>
                  <Text style={styles.noRecule}>{t('gooseGame.accord.noRecule')}</Text>
                </>
              )}
              <Pressable onPress={() => onResult(bothYes)} style={styles.primaryBtn}>
                <Text style={[styles.primaryBtnText, { color: '#1e293b' }]}>{t('gooseGame.accord.continueBtn')}</Text>
              </Pressable>
            </View>
          </Overlay>
        </MotiView>
      )}

    </AnimatePresence>
  );
}

function VoteButtons({ onVote }: { onVote: (v: boolean) => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.voteRow}>
      <Pressable onPress={() => onVote(false)} style={[styles.voteBtn, styles.voteBtnNo]}>
        <X size={18} color="#fca5a5" />
        <Text style={[styles.voteBtnText, { color: '#fca5a5' }]}>{t('gooseGame.accord.no')}</Text>
      </Pressable>
      <Pressable onPress={() => onVote(true)} style={[styles.voteBtn, styles.voteBtnYes]}>
        <Check size={18} color="#86efac" />
        <Text style={[styles.voteBtnText, { color: '#86efac' }]}>{t('gooseGame.accord.yes')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  sub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    textAlign: 'center',
  },
  activityBox: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 26,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1d4ed8',
  },
  votePlayerName: {
    color: 'white',
    fontWeight: '700',
    marginTop: 4,
  },
  voteSub: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
  },
  voteActivity: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  voteRow: {
    flexDirection: 'row',
    gap: 12,
  },
  voteBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
  },
  voteBtnNo: {
    backgroundColor: 'rgba(239,68,68,0.18)',
    borderColor: 'rgba(239,68,68,0.35)',
  },
  voteBtnYes: {
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderColor: 'rgba(34,197,94,0.35)',
  },
  voteBtnText: {
    fontWeight: '700',
    fontSize: 18,
  },
  passTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
  },
  passSubText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  ghostBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
  },
  ghostBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  resultTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
  },
  bothYesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  bothYesText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  accordNum: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    marginBottom: 16,
  },
  noSaid: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  noRecule: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 28,
  },
});
