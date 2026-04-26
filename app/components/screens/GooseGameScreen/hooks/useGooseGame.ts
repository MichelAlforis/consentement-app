'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BOARD, getBoardActivitiesForFace, pickNoRepeat,
  PAUSE_ACTIVITIES, ACCORD_ACTIVITIES,
  getSquareBg, getZone,
  loadSavedGame, saveGame, clearSavedGame,
  SavedGooseGame,
} from '../../../../data/goose-game';
import { useDice } from './useDice';
import { usePawnAnimation } from './usePawnAnimation';
import { useConfetti } from './useConfetti';
import { Player, Phase, TurnStep } from '../types';
import { useHaptics } from '../../../../game-engine/shared/useHaptics';
import { useSettingsStore } from '../../../../stores/settingsStore';

export function useGooseGame({ isAdult }: { isAdult: boolean }) {
  const explicitMode = useSettingsStore((s) => s.explicitMode);
  // ── Phase ──────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('intro');

  // ── Players ────────────────────────────────────────────────────────────────
  const [p1, setP1] = useState<Player | null>(null);
  const [p2, setP2] = useState<Player | null>(null);

  // ── Plateau ────────────────────────────────────────────────────────────────
  const [pos0, setPos0] = useState(0);
  const [pos1, setPos1] = useState(0);
  const [curPlayer, setCurPlayer] = useState<0 | 1>(0);
  const [accordsCount, setAccordsCount] = useState(0);

  // ── Tour ───────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<TurnStep>('roll');
  const [activity, setActivity] = useState('');
  const [accordVote0, setAccordVote0] = useState<boolean | null>(null);
  const [accordVote1, setAccordVote1] = useState<boolean | null>(null);

  // ── Partie sauvegardée ─────────────────────────────────────────────────────
  const [savedGame, setSavedGame] = useState<SavedGooseGame | null>(null);
  useEffect(() => {
    const saved = loadSavedGame();
    if (saved) setSavedGame(saved);
  }, []);

  // ── Anti-répétition ────────────────────────────────────────────────────────
  const usedActivityIds = useRef<Set<string>>(new Set());
  const usedPauseIds    = useRef<Set<string>>(new Set());
  const usedAccordIds   = useRef<Set<string>>(new Set());

  // ── Stale-closure guard — mis à jour après chaque render ──────────────────
  const gameRef = useRef({ pos0, pos1, curPlayer, accordsCount, p1, p2 });
  useEffect(() => { gameRef.current = { pos0, pos1, curPlayer, accordsCount, p1, p2 }; });

  // ── Sub-hooks ──────────────────────────────────────────────────────────────
  const { vibrate } = useHaptics();
  const { animatingPos, animate: animatePawn } = usePawnAnimation();
  const { show: showConfetti, key: confettiKey, trigger: triggerConfetti } = useConfetti();

  // ── Persistance ────────────────────────────────────────────────────────────
  const persistGame = useCallback((p0: number, p1c: number, cp: 0 | 1, ac: number) => {
    const { p1: pl1, p2: pl2 } = gameRef.current;
    if (!pl1 || !pl2) return;
    saveGame({ players: [pl1, pl2], positions: [p0, p1c], currentPlayer: cp, accordsCount: ac });
  }, []);

  // ── Logique de case ────────────────────────────────────────────────────────
  const processSquare = useCallback((squareIndex: number, p0: number, p1c: number, cp: 0 | 1, ac: number) => {
    const square = BOARD[squareIndex];
    switch (square.type) {
      case 'arrivee': {
        clearSavedGame();
        setPhase('end');
        vibrate([100, 80, 200]);
        return;
      }
      case 'normal':
      case 'depart': {
        const face = (square.face ?? 1) as 1 | 2 | 3 | 4 | 5 | 6;
        const acts = getBoardActivitiesForFace(face, isAdult, explicitMode);
        setActivity(pickNoRepeat(acts, usedActivityIds.current).text);
        setStep('normal');
        vibrate(60);
        return;
      }
      case 'pause':
        setActivity(pickNoRepeat(PAUSE_ACTIVITIES, usedPauseIds.current).text);
        setStep('pause');
        vibrate([50, 30, 50]);
        return;
      case 'chance':
        setStep('chance');
        vibrate([80, 40, 160]);
        return;
      case 'accord':
        setActivity(pickNoRepeat(ACCORD_ACTIVITIES, usedAccordIds.current).text);
        setAccordVote0(null);
        setAccordVote1(null);
        setStep('accord-intro');
        vibrate([60, 40, 60, 40, 60]);
        return;
      case 'complicite': {
        const douceurActs = getBoardActivitiesForFace(6, isAdult, explicitMode);
        setActivity(pickNoRepeat(douceurActs, usedActivityIds.current).text);
        setStep('complicite');
        triggerConfetti();
        return;
      }
    }
  }, [isAdult, triggerConfetti, vibrate]);

  // ── Dé ─────────────────────────────────────────────────────────────────────
  const onDiceLanded = useCallback((face: 1 | 2 | 3 | 4 | 5 | 6) => {
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const curPos  = cp === 0 ? p0 : p1c;
    const newPos  = Math.min(curPos + face, 23);
    const newPos0 = cp === 0 ? newPos : p0;
    const newPos1 = cp === 1 ? newPos : p1c;

    animatePawn(curPos, newPos, () => {
      if (cp === 0) setPos0(newPos);
      else          setPos1(newPos);
      persistGame(newPos0, newPos1, cp, ac);
      processSquare(newPos, newPos0, newPos1, cp, ac);
    });
  }, [animatePawn, persistGame, processSquare]);

  const { diceResult, isRolling, roll, handleRollComplete } = useDice(onDiceLanded);

  const handleRoll = useCallback(() => {
    roll();
    setStep('rolling');
  }, [roll]);

  // ── Chance ─────────────────────────────────────────────────────────────────
  const handleChanceBounce = useCallback(() => {
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const curPos  = cp === 0 ? p0 : p1c;
    const newPos  = Math.min(curPos + 2, 23);
    const newPos0 = cp === 0 ? newPos : p0;
    const newPos1 = cp === 1 ? newPos : p1c;

    animatePawn(curPos, newPos, () => {
      if (cp === 0) setPos0(newPos);
      else          setPos1(newPos);
      persistGame(newPos0, newPos1, cp, ac);
      processSquare(newPos, newPos0, newPos1, cp, ac);
    });
  }, [animatePawn, persistGame, processSquare]);

  // ── Fin de tour ────────────────────────────────────────────────────────────
  const endTurn = useCallback(() => {
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const next: 0 | 1 = cp === 0 ? 1 : 0;
    setCurPlayer(next);
    persistGame(p0, p1c, next, ac);
    setStep('roll');
  }, [persistGame]);

  // ── Accord ─────────────────────────────────────────────────────────────────
  const handleAccordP1Vote = useCallback((vote: boolean) => {
    setAccordVote0(vote);
    setStep('accord-hidden');
    vibrate(40);
  }, [vibrate]);

  const handleAccordP2Vote = useCallback((vote: boolean) => {
    setAccordVote1(vote);
    setStep('accord-result');
    vibrate(40);
  }, [vibrate]);

  const handleAccordResult = useCallback((bothYes: boolean) => {
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const next: 0 | 1 = cp === 0 ? 1 : 0;
    const newAccords = bothYes ? ac + 1 : ac;
    if (bothYes) triggerConfetti();
    setAccordsCount(newAccords);
    setCurPlayer(next);
    persistGame(p0, p1c, next, newAccords);
    setStep('roll');
  }, [persistGame, triggerConfetti]);

  // ── Setup ──────────────────────────────────────────────────────────────────
  const handleP1Confirm = useCallback((name: string, pawn: string) => {
    setP1({ name, pawn });
    setPhase('setup-p2');
  }, []);

  const handleP2Confirm = useCallback((name: string, pawn: string) => {
    setP2({ name, pawn });
    setPhase('pacte');
  }, []);

  const startNewGame = useCallback(() => {
    const { p1: pl1, p2: pl2 } = gameRef.current;
    if (!pl1 || !pl2) return;
    setPos0(0); setPos1(0); setCurPlayer(0); setAccordsCount(0);
    setStep('roll');
    usedActivityIds.current.clear();
    usedPauseIds.current.clear();
    usedAccordIds.current.clear();
    setPhase('playing');
    saveGame({ players: [pl1, pl2], positions: [0, 0], currentPlayer: 0, accordsCount: 0 });
  }, []);

  const resumeGame = useCallback(() => {
    if (!savedGame) return;
    const [pl1, pl2] = savedGame.players;
    setP1(pl1); setP2(pl2);
    setPos0(savedGame.positions[0]);
    setPos1(savedGame.positions[1]);
    setCurPlayer(savedGame.currentPlayer);
    setAccordsCount(savedGame.accordsCount);
    setStep('roll');
    setPhase('playing');
  }, [savedGame]);

  const resetToIntro = useCallback(() => {
    clearSavedGame();
    setSavedGame(null);
    usedActivityIds.current.clear();
    usedPauseIds.current.clear();
    usedAccordIds.current.clear();
    setPhase('intro');
  }, []);

  // ── Valeurs dérivées ───────────────────────────────────────────────────────
  const player1 = p1 ?? { name: 'Joueur 1', pawn: 'Zap' };
  const player2 = p2 ?? { name: 'Joueur 2', pawn: 'Leaf' };
  const activeName  = curPlayer === 0 ? player1.name : player2.name;
  const activePos   = curPlayer === 0 ? pos0         : pos1;
  const activePawn  = curPlayer === 0 ? player1.pawn : player2.pawn;

  const displayPos0  = (curPlayer === 0 && animatingPos !== null) ? animatingPos : pos0;
  const displayPos1  = (curPlayer === 1 && animatingPos !== null) ? animatingPos : pos1;
  const activeSquare = animatingPos !== null ? animatingPos : activePos;

  const currentZone  = getZone(activePos);
  const zoneIndex    = activePos <= 7 ? 0 : activePos <= 15 ? 1 : 2;
  const currentSquare = BOARD[activePos];
  const squareBg      = getSquareBg(currentSquare);

  return {
    phase, setPhase,
    p1, p2, player1, player2,
    activeName, activePos, activePawn,
    pos0, pos1, curPlayer, accordsCount,
    displayPos0, displayPos1, activeSquare,
    diceResult, isRolling, handleRoll, handleRollComplete,
    step, setStep, activity,
    accordVote0, accordVote1,
    animatingPos,
    showConfetti, confettiKey, triggerConfetti,
    savedGame, setSavedGame,
    currentZone, zoneIndex, currentSquare, squareBg,
    handleP1Confirm, handleP2Confirm,
    startNewGame, resumeGame, resetToIntro,
    handleChanceBounce, endTurn,
    handleAccordP1Vote, handleAccordP2Vote, handleAccordResult,
  };
}
