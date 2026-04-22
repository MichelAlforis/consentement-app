'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Dice3D } from '../../ui/Dice3D';
import { useGooseGame } from './hooks/useGooseGame';
import { ZONE_BG } from './utils';

import { BoardGrid, Legend } from './components/Board';
import { ConfettiParticles } from './components/ConfettiParticles';
import { ZoneIndicator } from './components/ZoneIndicator';

import { useTranslation } from '../../../i18n';
import { IntroScreen } from './phases/IntroScreen';
import { SetupPlayer } from './phases/SetupPlayer';
import { PacteScreen } from './phases/PacteScreen';
import { EndScreen } from './phases/EndScreen';

import { ActivityOverlay } from './overlays/ActivityOverlay';
import { ChanceOverlay } from './overlays/ChanceOverlay';
import { AccordFlow } from './overlays/AccordFlow';

// ─── Guard premium ────────────────────────────────────────────────────────────

interface GooseGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
}

export function GooseGameScreen({ isPremium, isAdult }: GooseGameScreenProps) {
  const { t } = useTranslation();
  if (!isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 gap-5 min-h-[60vh] text-center"
        style={{ color: 'white' }}
      >
        <div className="text-5xl">🔒</div>
        <div>
          <h2 className="text-xl font-black mb-2">{t('gooseGame.premium')}</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-[260px] mx-auto">
            {t('gooseGame.premiumSub')}
          </p>
        </div>
      </motion.div>
    );
  }
  return <GooseGameInner isAdult={isAdult} />;
}

// ─── Jeu ──────────────────────────────────────────────────────────────────────

function GooseGameInner({ isAdult }: { isAdult: boolean }) {
  const { t } = useTranslation();
  const game = useGooseGame({ isAdult });

  const {
    phase, setPhase,
    p1, player1, player2,
    activeName, activePawn,
    curPlayer, accordsCount,
    displayPos0, displayPos1, activeSquare,
    diceResult, isRolling, handleRoll, handleRollComplete,
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
      <IntroScreen
        savedGame={savedGame}
        onNew={() => { setSavedGame(null); setPhase('setup-p1'); }}
        onResume={resumeGame}
      />
    );
  }

  if (phase === 'setup-p1') {
    return (
      <div style={{ minHeight: '100%', background: 'linear-gradient(160deg, #7c3aed, #4f46e5)' }}>
        <SetupPlayer playerIndex={0} otherEmoji={undefined} onConfirm={handleP1Confirm} />
      </div>
    );
  }

  if (phase === 'setup-p2') {
    return (
      <div style={{ minHeight: '100%', background: 'linear-gradient(160deg, #0369a1, #0891b2)' }}>
        <SetupPlayer playerIndex={1} otherEmoji={p1?.emoji} onConfirm={handleP2Confirm} />
      </div>
    );
  }

  if (phase === 'pacte') {
    return (
      <div style={{ minHeight: '100%', background: 'linear-gradient(160deg, #0f172a, #1e1040)' }}>
        <PacteScreen player1={player1} player2={player2} onStart={startNewGame} />
      </div>
    );
  }

  if (phase === 'end') {
    return (
      <EndScreen
        player1={player1}
        player2={player2}
        accordsCount={accordsCount}
        onReplay={resetToIntro}
      />
    );
  }

  // ── Plateau ──────────────────────────────────────────────────────────────

  const isAccordStep = step === 'accord-intro' || step === 'accord-p1'
    || step === 'accord-hidden' || step === 'accord-p2' || step === 'accord-result';

  return (
    <div
      className="flex flex-col"
      style={{
        color: 'white',
        minHeight: '100%',
        background: ZONE_BG[zoneIndex],
        transition: 'background 2s ease',
      }}
    >
      {/* Confetti */}
      {showConfetti && <ConfettiParticles id={confettiKey} />}

      {/* Plateau */}
      <div className="pt-3 pb-2">
        <BoardGrid
          displayPos0={displayPos0}
          displayPos1={displayPos1}
          p0Emoji={player1.emoji}
          p1Emoji={player2.emoji}
          activeSquare={activeSquare}
          isAnimating={animatingPos !== null}
        />
        <Legend />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 16px' }} />

      {/* Zone indicator */}
      <ZoneIndicator currentZone={currentZone} zoneIndex={zoneIndex} />

      {/* Zone de tour */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 pb-4">
        <motion.div
          key={`turn-${curPlayer}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span style={{ fontSize: 30 }}>{activePawn}</span>
          <p className="text-white/55 text-sm mt-1">
            {t('gooseGame.yourTurn', { name: activeName })}
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-3">
          <Dice3D
            targetFace={diceResult}
            isRolling={isRolling}
            onRollComplete={handleRollComplete}
          />

          {step === 'roll' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.93 }}
              onClick={handleRoll}
              style={{
                background: 'rgba(255,255,255,0.95)', color: '#1e293b',
                borderRadius: 16, padding: '12px 36px', fontWeight: 800, fontSize: 16,
              }}
            >
              {t('gooseGame.roll')}
            </motion.button>
          )}

          {(step === 'rolling' || animatingPos !== null) && (
            <p className="text-white/40 text-sm animate-pulse">
              {animatingPos !== null ? t('gooseGame.moving') : t('gooseGame.rolling')}
            </p>
          )}
        </div>

        {accordsCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl px-3 py-1.5"
            style={{ background: 'rgba(96,165,250,0.18)', border: '1px solid rgba(96,165,250,0.3)' }}>
            <span style={{ fontSize: 14 }}>🤝</span>
            <span className="text-blue-300 text-sm font-semibold">
              {accordsCount} {accordsCount > 1 ? t('gooseGame.accordBadgePlural') : t('gooseGame.accordBadge')}
            </span>
          </div>
        )}
      </div>

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
    </div>
  );
}
