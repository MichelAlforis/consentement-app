import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { Lock, Handshake, Sparkles } from 'lucide-react-native';
import { Zap, Leaf, Wind, Moon, Star, Dices } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { useNavigationStore, usePremiumStore } from '@ouiclair/core';
import { useUnlockStore } from '@ouiclair/core';
import { useGooseGame } from './hooks/useGooseGame';
import { GooseBoard } from './components/GooseBoard';
import { ConfettiParticles } from './components/ConfettiParticles';
import { ZoneIndicator } from './components/ZoneIndicator';
import { IntroScreen } from './phases/IntroScreen';
import { SetupPlayer } from './phases/SetupPlayer';
import { PacteScreen } from './phases/PacteScreen';
import { EndScreen } from './phases/EndScreen';
import { ActivityOverlay } from './overlays/ActivityOverlay';
import { ChanceOverlay } from './overlays/ChanceOverlay';
import { AccordFlow } from './overlays/AccordFlow';
import { useTranslation } from '../../../i18n';

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Leaf, Wind, Moon, Star, Dice5: Dices,
};

const ZONE_COLORS = ['#0f172a', '#0f172a', '#1a0838'];

export interface GooseGameScreenProps {
  isAdult: boolean;
}

export function GooseGameScreen({ isAdult }: GooseGameScreenProps) {
  const isPremium = usePremiumStore((s) => s.isPremium);
  const { t } = useTranslation();
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const insets = useSafeAreaInsets();

  if (!isPremium) {
    return (
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={[styles.gateContainer, { paddingTop: insets.top }]}>
        <Lock size={48} color="rgba(255,255,255,0.6)" />
        <View>
          <Text style={styles.gateTitle}>{t('gooseGame.premium')}</Text>
          <Text style={styles.gateSub}>{t('gooseGame.premiumSub')}</Text>
        </View>
        <Pressable onPress={() => navigateTo('premium')} style={styles.unlockBtn}>
          <Sparkles size={16} color="white" />
          <Text style={styles.unlockBtnText}>{t('gooseGame.unlockPremium')}</Text>
        </Pressable>
      </MotiView>
    );
  }

  return <GooseGameInner isAdult={isAdult} />;
}

// ─── Jeu ──────────────────────────────────────────────────────────────────────

function GooseGameInner({ isAdult }: { isAdult: boolean }) {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;
  const navigateTo = useNavigationStore((s) => s.navigateTo);

  const game = useGooseGame({ isAdult });

  const handleQuit = () => {
    const drawn = useUnlockStore.getState().drawFromPool();
    if (drawn) { navigateTo('hall-of-cards'); return; }
    navigateTo('jeux');
  };

  const {
    phase, setPhase,
    p1, player1, player2,
    activeName, activePawn,
    curPlayer, accordsCount,
    displayPos0, displayPos1, activeSquare,
    handleRoll,
    step, setStep, activity,
    accordVote0, accordVote1,
    animatingPos,
    showConfetti, confettiKey,
    savedGame, setSavedGame,
    currentZone, zoneIndex, currentSquare, squareBg,
    handleP1Confirm, handleP2Confirm,
    startNewGame, resumeGame, resetToIntro,
    handleChanceBounce, endTurn,
    handleAccordP1Vote, handleAccordP2Vote, handleAccordResult,
  } = game;

  // ── Phases hors plateau ──────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <IntroScreen
          savedGame={savedGame}
          onNew={() => { setSavedGame(null); setPhase('setup-p1'); }}
          onResume={resumeGame}
        />
      </View>
    );
  }

  if (phase === 'setup-p1') {
    return (
      <View style={[styles.phaseWrapper, { backgroundColor: '#7c3aed', paddingTop: insets.top }]}>
        <SetupPlayer playerIndex={0} otherPawn={undefined} onConfirm={handleP1Confirm} />
      </View>
    );
  }

  if (phase === 'setup-p2') {
    return (
      <View style={[styles.phaseWrapper, { backgroundColor: '#0369a1', paddingTop: insets.top }]}>
        <SetupPlayer playerIndex={1} otherPawn={p1?.pawn} onConfirm={handleP2Confirm} />
      </View>
    );
  }

  if (phase === 'pacte') {
    return (
      <View style={[styles.phaseWrapper, { backgroundColor: '#0f172a', paddingTop: insets.top }]}>
        <PacteScreen player1={player1} player2={player2} onStart={startNewGame} />
      </View>
    );
  }

  if (phase === 'end') {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <EndScreen
          player1={player1}
          player2={player2}
          accordsCount={accordsCount}
          onReplay={resetToIntro}
          onQuit={handleQuit}
        />
      </View>
    );
  }

  // ── Plateau ──────────────────────────────────────────────────────────────

  const isAccordStep = step === 'accord-intro' || step === 'accord-p1'
    || step === 'accord-hidden' || step === 'accord-p2' || step === 'accord-result';

  const PawnIcon = ICON_MAP[activePawn] as LucideIcon | undefined;
  return (
    <View style={[styles.playContainer, { backgroundColor: ZONE_COLORS[zoneIndex], paddingTop: insets.top }]}>
      {showConfetti && <ConfettiParticles id={confettiKey} />}

      <View style={[styles.inner, isLandscape ? styles.innerLandscape : styles.innerPortrait]}>

        {/* ── Plateau ── */}
        <View style={isLandscape ? styles.boardLandscape : styles.boardPortrait}>
          <GooseBoard
            displayPos0={displayPos0}
            displayPos1={displayPos1}
            player1={player1}
            player2={player2}
            activeSquare={activeSquare}
            animatingPos={animatingPos}
          />
        </View>

        {/* Portrait: divider + zone entre board et contrôles */}
        {!isLandscape && (
          <>
            <View style={styles.divider} />
            <ZoneIndicator currentZone={currentZone} zoneIndex={zoneIndex} />
          </>
        )}

        {/* ── Contrôles ── */}
        <View style={isLandscape ? styles.controlsLandscape : styles.controlsPortrait}>
          {isLandscape && (
            <ZoneIndicator currentZone={currentZone} zoneIndex={zoneIndex} />
          )}

          <MotiView
            key={`turn-${curPlayer}`}
            from={{ opacity: 0, translateY: -8 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.turnIndicator}
          >
            {PawnIcon ? <PawnIcon size={isLandscape ? 22 : 30} color="white" /> : null}
            <Text style={styles.turnText}>
              {t('gooseGame.yourTurn', { name: activeName })}
            </Text>
          </MotiView>

          <View style={styles.diceArea}>
            {step === 'roll' && (
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Pressable
                  onPress={handleRoll}
                  style={[styles.rollBtn, { paddingHorizontal: isLandscape ? 28 : 36, paddingVertical: isLandscape ? 10 : 12 }]}
                >
                  <Text style={[styles.rollBtnText, { fontSize: isLandscape ? 14 : 16 }]}>
                    {t('gooseGame.roll')}
                  </Text>
                </Pressable>
              </MotiView>
            )}

            {(step === 'rolling' || animatingPos !== null) && (
              <Text style={styles.statusText}>
                {animatingPos !== null ? t('gooseGame.moving') : t('gooseGame.rolling')}
              </Text>
            )}
          </View>

          {accordsCount > 0 && (
            <View style={styles.accordBadge}>
              <Handshake size={14} color="#93c5fd" />
              <Text style={styles.accordBadgeText}>
                {accordsCount} {accordsCount > 1 ? t('gooseGame.accordBadgePlural') : t('gooseGame.accordBadge')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Overlays ── */}
      <AnimatePresence>
        {(step === 'normal' || step === 'pause' || step === 'complicite') && (
          <ActivityOverlay
            step={step}
            activity={activity}
            activeName={activeName}
            currentSquare={currentSquare}
            squareBg={squareBg}
            currentZone={currentZone}
            onContinue={endTurn}
          />
        )}

        {step === 'chance' && (
          <ChanceOverlay activeName={activeName} onAdvance={handleChanceBounce} />
        )}

        {isAccordStep && (
          <AccordFlow
            key="accord"
            step={step as 'accord-intro' | 'accord-p1' | 'accord-hidden' | 'accord-p2' | 'accord-result'}
            activity={activity}
            player1={player1}
            player2={player2}
            accordVote0={accordVote0}
            accordVote1={accordVote1}
            accordsCount={accordsCount}
            onIntroNext={() => setStep('accord-p1')}
            onP1Vote={handleAccordP1Vote}
            onP2Ready={() => setStep('accord-p2')}
            onP2Vote={handleAccordP2Vote}
            onResult={handleAccordResult}
          />
        )}
      </AnimatePresence>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  gateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 20,
    backgroundColor: '#0f172a',
  },
  gateTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  gateSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 260,
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#7c3aed',
  },
  unlockBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  phaseWrapper: {
    flex: 1,
  },
  playContainer: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  innerPortrait: {
    flexDirection: 'column',
  },
  innerLandscape: {
    flexDirection: 'row',
  },
  boardPortrait: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  boardLandscape: {
    width: '55%',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 16,
  },
  controlsPortrait: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  controlsLandscape: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  turnIndicator: {
    alignItems: 'center',
    gap: 4,
  },
  turnText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  diceArea: {
    alignItems: 'center',
    gap: 12,
  },
  rollBtn: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
  },
  rollBtnText: {
    color: '#1e293b',
    fontWeight: '900',
  },
  statusText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  accordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(96,165,250,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)',
  },
  accordBadgeText: {
    color: '#93c5fd',
    fontSize: 14,
    fontWeight: '600',
  },
});
