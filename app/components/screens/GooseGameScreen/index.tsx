'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAWN_COLORS } from '../../../data/goose-game';
import { useGooseGame } from './hooks/useGooseGame';
import { ZONE_BG } from './utils';

import { BoardGrid, Legend } from './components/Board';
import { ConfettiParticles } from './components/ConfettiParticles';
import { ZoneIndicator } from './components/ZoneIndicator';

import { Lock, Handshake, Sparkles } from 'lucide-react';
import { Button } from '../../ui';
import { DynamicIcon } from '../../../utils/iconFromName';
import { useTranslation } from '../../../i18n';
import { IntroScreen } from './phases/IntroScreen';
import { SetupPlayer } from './phases/SetupPlayer';
import { PacteScreen } from './phases/PacteScreen';
import { EndScreen } from './phases/EndScreen';

import { ActivityOverlay } from './overlays/ActivityOverlay';
import { ChanceOverlay } from './overlays/ChanceOverlay';
import { AccordFlow } from './overlays/AccordFlow';

import { completeGameSession } from '../../../lib/completeGameSession';
import type { Screen } from '../../../types';

// ─── Orientation hook ─────────────────────────────────────────────────────────

function useIsLandscape(): boolean {
  const [ls, setLs] = useState(false);
  useEffect(() => {
    const check = () => setLs(window.innerWidth > window.innerHeight);
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);
  return ls;
}

// ─── Guard premium ────────────────────────────────────────────────────────────

interface GooseGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
  onNavigate: (screen: Screen) => void;
}

export function GooseGameScreen({ isPremium, isAdult, onNavigate }: GooseGameScreenProps) {
  const { t } = useTranslation();
  if (!isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-8 gap-5 text-center text-white"
      >
        <Lock size={48} className="text-white/60" />
        <div>
          <h2 className="text-xl font-black mb-2">{t('gooseGame.premium')}</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-[260px] mx-auto">
            {t('gooseGame.premiumSub')}
          </p>
        </div>
        <Button onClick={() => onNavigate('premium')} icon={<Sparkles size={16} />}>
          {t('gooseGame.unlockPremium')}
        </Button>
      </motion.div>
    );
  }
  return <GooseGameInner isAdult={isAdult} onNavigate={onNavigate} />;
}

// ─── Jeu ──────────────────────────────────────────────────────────────────────

function GooseGameInner({ isAdult, onNavigate }: { isAdult: boolean; onNavigate: (screen: Screen) => void }) {
  const { t } = useTranslation();
  const isLandscape = useIsLandscape();
  const game = useGooseGame({ isAdult });
  const handleQuit = () => {
    const drawn = completeGameSession('goose');
    if (drawn) { onNavigate('hall-of-cards'); return; }
    onNavigate('jeux');
  };

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
      <div className="flex-1" style={{ background: 'linear-gradient(160deg, #7c3aed, #4f46e5)' }}>
        <SetupPlayer playerIndex={0} otherPawn={undefined} onConfirm={handleP1Confirm} />
      </div>
    );
  }

  if (phase === 'setup-p2') {
    return (
      <div className="flex-1" style={{ background: 'linear-gradient(160deg, #0369a1, #0891b2)' }}>
        <SetupPlayer playerIndex={1} otherPawn={p1?.pawn} onConfirm={handleP2Confirm} />
      </div>
    );
  }

  if (phase === 'pacte') {
    return (
      <div className="flex-1" style={{ background: 'linear-gradient(160deg, #0f172a, #1e1040)' }}>
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
        onQuit={handleQuit}
      />
    );
  }

  // ── Plateau ──────────────────────────────────────────────────────────────

  const isAccordStep = step === 'accord-intro' || step === 'accord-p1'
    || step === 'accord-hidden' || step === 'accord-p2' || step === 'accord-result';

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden text-white"
      style={{
        background: ZONE_BG[zoneIndex],
        transition: 'background 2s ease',
      }}
    >
      {showConfetti && <ConfettiParticles id={confettiKey} />}

      {/* Portrait: flex-col  |  Landscape: flex-row (board left, controls right) */}
      <div className={`flex-1 flex ${isLandscape ? 'flex-row' : 'flex-col'} min-h-0`}>

        {/* ── Plateau ── */}
        <div
          className={isLandscape
            ? 'flex flex-col justify-center overflow-hidden shrink-0'
            : 'pt-3 pb-2 shrink-0'}
          style={isLandscape ? { width: '55%' } : {}}
        >
          <BoardGrid
            displayPos0={displayPos0}
            displayPos1={displayPos1}
            p0Pawn={player1.pawn}
            p1Pawn={player2.pawn}
            p0Color={PAWN_COLORS[0]}
            p1Color={PAWN_COLORS[1]}
            activeSquare={activeSquare}
            isAnimating={animatingPos !== null}
            animatingPos={animatingPos}
            diceResult={diceResult}
            isDiceRolling={isRolling}
            onDiceRollComplete={handleRollComplete}
            showDice={step === 'roll' || step === 'rolling'}
          />
          <Legend />
        </div>

        {/* Portrait only — divider + zone entre board et contrôles */}
        {!isLandscape && (
          <>
            <div className="h-px bg-white/[0.08] mx-4" />
            <ZoneIndicator currentZone={currentZone} zoneIndex={zoneIndex} />
          </>
        )}

        {/* ── Contrôles ── */}
        <div className={isLandscape
          ? 'flex-1 flex flex-col items-center justify-center gap-3 px-4 py-2 overflow-y-auto'
          : 'flex-1 flex flex-col items-center justify-center gap-4 px-5 pb-4'}
        >
          {isLandscape && (
            <ZoneIndicator currentZone={currentZone} zoneIndex={zoneIndex} />
          )}

          <motion.div
            key={`turn-${curPlayer}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <DynamicIcon name={activePawn} size={isLandscape ? 22 : 30} color="white" />
            <p className="text-white/55 text-sm mt-1">
              {t('gooseGame.yourTurn', { name: activeName })}
            </p>
          </motion.div>

          <div className="flex flex-col items-center gap-3">
            {step === 'roll' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.93 }}
                onClick={handleRoll}
                className="bg-white/95 text-[#1e293b] rounded-2xl font-extrabold"
                style={{
                  padding: isLandscape ? '10px 28px' : '12px 36px',
                  fontSize: isLandscape ? 14 : 16,
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
            <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 bg-blue-400/18 border border-blue-400/30">
              <Handshake size={14} className="text-blue-300" />
              <span className="text-blue-300 text-sm font-semibold">
                {accordsCount} {accordsCount > 1 ? t('gooseGame.accordBadgePlural') : t('gooseGame.accordBadge')}
              </span>
            </div>
          )}
        </div>
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
