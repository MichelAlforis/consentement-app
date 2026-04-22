'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice3D } from '../ui/Dice3D';
import { DICE_CATEGORIES } from '../../data';
import {
  BOARD, BOARD_LAYOUT, SQUARE_VISUAL, PAWN_EMOJIS,
  PAUSE_ACTIVITIES, ACCORD_ACTIVITIES,
  getBoardActivitiesForFace, pickNoRepeat,
  getSquareBg, getSquareEmoji, getZone,
  loadSavedGame, saveGame, clearSavedGame, SavedGooseGame,
} from '../../data/goose-game';

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'setup-p1' | 'setup-p2' | 'pacte' | 'playing' | 'end';

type TurnStep =
  | 'roll'
  | 'rolling'
  | 'normal'
  | 'pause'
  | 'chance'
  | 'accord-intro'
  | 'accord-p1'
  | 'accord-hidden'
  | 'accord-p2'
  | 'accord-result'
  | 'complicite';

interface Player {
  name: string;
  emoji: string;
}

// ─── Haptics ─────────────────────────────────────────────────────────────────

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// ─── Zone backgrounds ────────────────────────────────────────────────────────

const ZONE_BG = [
  'linear-gradient(180deg, #082920 0%, #080f1f 100%)',  // 🌱 Découverte — vert profond
  'linear-gradient(180deg, #0a1e3d 0%, #060e1f 100%)',  // 🌊 Intimité — bleu nuit
  'linear-gradient(180deg, #1a0836 0%, #070512 100%)',  // ✨ Connexion — violet nuit
];

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_EMOJIS = ['❤️', '✨', '🎉', '💜', '🌟', '🤝'];

function ConfettiParticles({ id }: { id: number }) {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
      x: (Math.random() - 0.5) * 400,
      y: -(Math.random() * 560 + 80),
      rotate: (Math.random() - 0.5) * 600,
      scale: 0.6 + Math.random() * 1.0,
      delay: Math.random() * 0.3,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [id]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 300, overflow: 'hidden' }}>
      {particles.map(p => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 'calc(50vw - 12px)', y: '60vh', rotate: 0, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: `calc(50vw + ${p.x}px - 12px)`,
            y: `calc(60vh + ${p.y}px)`,
            rotate: p.rotate,
            scale: p.scale,
          }}
          transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1], delay: p.delay }}
          style={{ position: 'absolute', fontSize: 24, lineHeight: 1 }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Board Cell ───────────────────────────────────────────────────────────────

interface BoardCellProps {
  squareIndex: number;
  displayPos0: number;
  displayPos1: number;
  p0Emoji: string;
  p1Emoji: string;
  isActive: boolean;
  isAnimating: boolean;
}

function BoardCell({ squareIndex, displayPos0, displayPos1, p0Emoji, p1Emoji, isActive, isAnimating }: BoardCellProps) {
  const square = BOARD[squareIndex];
  const bg = getSquareBg(square);
  const emoji = getSquareEmoji(square);
  const hasP0 = displayPos0 === squareIndex;
  const hasP1 = displayPos1 === squareIndex;

  return (
    <motion.div
      animate={
        isAnimating && isActive
          ? { scale: [1, 1.18, 1], boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 16px rgba(255,255,255,0.7)', '0 0 0px rgba(255,255,255,0)'] }
          : isActive
          ? { scale: [1, 1.06, 1] }
          : { scale: 1 }
      }
      transition={
        isActive
          ? { duration: isAnimating ? 0.3 : 0.7, repeat: isAnimating ? 0 : Infinity, repeatType: 'loop' }
          : {}
      }
      style={{
        background: bg,
        borderRadius: 8,
        height: 44,
        position: 'relative',
        border: isActive ? '2px solid rgba(255,255,255,0.9)' : '1.5px solid rgba(255,255,255,0.12)',
        overflow: 'hidden',
      }}
      className="flex items-center justify-center"
    >
      <span style={{ fontSize: 15, lineHeight: 1 }}>{emoji}</span>

      <span style={{
        position: 'absolute', bottom: 1, right: 3,
        fontSize: 7, color: 'rgba(255,255,255,0.55)', fontWeight: 700,
      }}>
        {squareIndex}
      </span>

      {hasP0 && (
        <motion.span
          layoutId={`pawn-0`}
          style={{ position: 'absolute', top: 1, left: 2, fontSize: 12 }}
        >
          {p0Emoji}
        </motion.span>
      )}
      {hasP1 && (
        <motion.span
          layoutId={`pawn-1`}
          style={{ position: 'absolute', top: 1, right: hasP0 ? 'auto' : 2, left: hasP0 ? 14 : undefined, fontSize: 12 }}
        >
          {p1Emoji}
        </motion.span>
      )}
    </motion.div>
  );
}

// ─── Board Grid ───────────────────────────────────────────────────────────────

function BoardGrid({ displayPos0, displayPos1, p0Emoji, p1Emoji, activeSquare, isAnimating }: {
  displayPos0: number;
  displayPos1: number;
  p0Emoji: string;
  p1Emoji: string;
  activeSquare: number;
  isAnimating: boolean;
}) {
  return (
    <div
      className="mx-auto"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, maxWidth: 300, padding: '0 4px' }}
    >
      {BOARD_LAYOUT.flatMap(row =>
        row.map(squareIndex => (
          <BoardCell
            key={squareIndex}
            squareIndex={squareIndex}
            displayPos0={displayPos0}
            displayPos1={displayPos1}
            p0Emoji={p0Emoji}
            p1Emoji={p1Emoji}
            isActive={squareIndex === activeSquare}
            isAnimating={isAnimating}
          />
        ))
      )}
    </div>
  );
}

// ─── Overlay ─────────────────────────────────────────────────────────────────

function Overlay({ children, color = '#1e293b' }: { children: React.ReactNode; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        style={{ background: color, borderRadius: '24px 24px 0 0', padding: '24px 20px 44px', width: '100%', maxHeight: '75vh', overflowY: 'auto' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap mt-3">
      {(['pause', 'chance', 'accord', 'complicite'] as const).map(type => (
        <div key={type} className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: SQUARE_VISUAL[type].bg }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{SQUARE_VISUAL[type].label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Pacte d'ouverture ────────────────────────────────────────────────────────

const PACTE_LINES = [
  "Un non est toujours respecté — sans question, sans pression.",
  "Ce que nous partageons ici reste entre nous.",
  "Nous pouvons faire une pause ou arrêter à tout moment.",
];

function PacteScreen({ player1, player2, onStart }: { player1: Player; player2: Player; onStart: () => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 500 + PACTE_LINES.length * 500 + 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 p-6 pt-8 min-h-[80vh]"
      style={{ color: 'white' }}
    >
      {/* Pions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex items-center gap-5"
      >
        <div className="text-center">
          <div className="text-4xl">{player1.emoji}</div>
          <div className="text-xs text-white/60 mt-1 font-semibold">{player1.name}</div>
        </div>
        <div className="text-white/25 text-2xl">×</div>
        <div className="text-center">
          <div className="text-4xl">{player2.emoji}</div>
          <div className="text-xs text-white/60 mt-1 font-semibold">{player2.name}</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-xl font-black mb-1">Notre pacte</h2>
        <p className="text-white/50 text-sm">Avant de commencer, nous nous engageons à :</p>
      </motion.div>

      {/* Engagements */}
      <div className="w-full max-w-[300px] flex flex-col gap-3">
        {PACTE_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.5, type: 'spring', stiffness: 200 }}
            className="flex items-start gap-3 rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.5, type: 'spring', stiffness: 350 }}
              style={{ fontSize: 18, flexShrink: 0 }}
            >
              {['🤝', '🔒', '⏸️'][i]}
            </motion.span>
            <p className="text-white/85 text-sm leading-relaxed">{line}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        style={{
          background: ready ? 'rgba(255,255,255,0.95)' : 'transparent',
          color: '#1e293b',
          borderRadius: 18,
          padding: '16px 0',
          fontWeight: 800,
          fontSize: 16,
          width: '100%',
          maxWidth: 300,
          cursor: ready ? 'pointer' : 'default',
          transition: 'all 0.4s ease',
        }}
      >
        Nous acceptons ✨
      </motion.button>
    </motion.div>
  );
}

// ─── Setup ───────────────────────────────────────────────────────────────────

function SetupPlayer({ playerIndex, otherEmoji, onConfirm }: {
  playerIndex: 0 | 1;
  otherEmoji: string | undefined;
  onConfirm: (name: string, emoji: string) => void;
}) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState<string | null>(null);
  const available = PAWN_EMOJIS.filter(e => e !== otherEmoji);

  return (
    <motion.div
      key={playerIndex}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="p-6 flex flex-col gap-6"
      style={{ minHeight: '100%' }}
    >
      <div className="text-center mt-4">
        <div className="text-4xl mb-2">{playerIndex === 0 ? '1️⃣' : '2️⃣'}</div>
        <h2 className="text-xl font-bold text-white">Joueur {playerIndex + 1}</h2>
        <p className="text-white/60 text-sm mt-1">Prénom et pion</p>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-semibold mb-2">Prénom</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={playerIndex === 0 ? 'Ex. Léa' : 'Ex. Marc'}
          maxLength={20}
          className="w-full px-4 py-3 rounded-2xl text-gray-900 font-medium text-base outline-none"
          style={{ background: 'rgba(255,255,255,0.95)' }}
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-semibold mb-3">Ton pion</label>
        <div className="flex justify-center gap-3 flex-wrap">
          {available.map(e => (
            <motion.button
              key={e}
              whileTap={{ scale: 0.88 }}
              onClick={() => setEmoji(e)}
              style={{
                width: 56, height: 56, borderRadius: 16, fontSize: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: emoji === e ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.07)',
                border: emoji === e ? '2.5px solid rgba(255,255,255,0.9)' : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              {e}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => { if (name.trim() && emoji) onConfirm(name.trim(), emoji); }}
        style={{
          background: name.trim() && emoji ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
          borderRadius: 18, padding: '14px', fontWeight: 700, fontSize: 16,
          color: name.trim() && emoji ? '#1e293b' : 'rgba(255,255,255,0.4)',
          marginTop: 'auto', transition: 'all 0.2s ease',
        }}
      >
        {playerIndex === 0 ? 'Suivant →' : '🎲 Commencer'}
      </motion.button>
    </motion.div>
  );
}

// ─── Guard ────────────────────────────────────────────────────────────────────

interface GooseGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
}

export function GooseGameScreen({ isPremium, isAdult }: GooseGameScreenProps) {
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
          <h2 className="text-xl font-black mb-2">Jeu de l'Oie — Premium</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-[260px] mx-auto">
            Ce jeu est réservé aux membres Premium.
          </p>
        </div>
      </motion.div>
    );
  }
  return <GooseGameInner isAdult={isAdult} />;
}

// ─── Jeu ─────────────────────────────────────────────────────────────────────

function GooseGameInner({ isAdult }: { isAdult: boolean }) {
  // Phase
  const [phase, setPhase] = useState<Phase>('intro');

  // Setup
  const [p1, setP1] = useState<Player | null>(null);
  const [p2, setP2] = useState<Player | null>(null);

  // Positions jeu
  const [pos0, setPos0] = useState(0);
  const [pos1, setPos1] = useState(0);
  const [curPlayer, setCurPlayer] = useState<0 | 1>(0);
  const [accordsCount, setAccordsCount] = useState(0);

  // Turn state
  const [step, setStep] = useState<TurnStep>('roll');
  const [diceResult, setDiceResult] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [activity, setActivity] = useState('');
  const [accordVote0, setAccordVote0] = useState<boolean | null>(null);
  const [accordVote1, setAccordVote1] = useState<boolean | null>(null);

  // Pion animation
  const [animatingPos, setAnimatingPos] = useState<number | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  // Anti-répétition
  const usedActivityIds = useRef<Set<string>>(new Set());
  const usedPauseIds    = useRef<Set<string>>(new Set());
  const usedAccordIds   = useRef<Set<string>>(new Set());

  // Ref pour éviter les stale closures dans les callbacks asynchrones
  const gameRef = useRef({ pos0, pos1, curPlayer, accordsCount, p1, p2 });
  useEffect(() => { gameRef.current = { pos0, pos1, curPlayer, accordsCount, p1, p2 }; });

  const diceRef = useRef(diceResult);

  // Partie sauvegardée
  const [savedGame, setSavedGame] = useState<SavedGooseGame | null>(null);
  useEffect(() => {
    const saved = loadSavedGame();
    if (saved) setSavedGame(saved);
  }, []);

  // Nettoyage timers
  useEffect(() => () => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const persistGame = useCallback((p0: number, p1c: number, cp: 0 | 1, ac: number) => {
    const { p1: pl1, p2: pl2 } = gameRef.current;
    if (!pl1 || !pl2) return;
    saveGame({ players: [pl1, pl2], positions: [p0, p1c], currentPlayer: cp, accordsCount: ac });
  }, []);

  const triggerConfetti = useCallback(() => {
    vibrate([80, 40, 80, 40, 120]);
    setConfettiKey(k => k + 1);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2200);
  }, []);

  // Animation pion case par case
  const animatePawn = useCallback((from: number, to: number, onDone: () => void) => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    const { curPlayer: cp } = gameRef.current;
    let current = from;

    const hop = () => {
      current = Math.min(current + 1, to);
      setAnimatingPos(current);
      vibrate(30);

      if (current < to) {
        animTimerRef.current = setTimeout(hop, 210);
      } else {
        // Pause sur la case d'arrivée avant de déclencher l'activité
        animTimerRef.current = setTimeout(() => {
          animTimerRef.current = null;
          setAnimatingPos(null);
          onDone();
        }, 380);
      }
    };

    setAnimatingPos(from);
    animTimerRef.current = setTimeout(hop, 160);
  }, []);

  // ── Setup ────────────────────────────────────────────────────────────────

  const handleP1Confirm = (name: string, emoji: string) => {
    setP1({ name, emoji });
    setPhase('setup-p2');
  };

  const handleP2Confirm = (name: string, emoji: string) => {
    const player: Player = { name, emoji };
    setP2(player);
    setPhase('pacte');
  };

  const startNewGame = useCallback(() => {
    const { p1: pl1, p2: pl2 } = gameRef.current;
    if (!pl1 || !pl2) return;
    setPos0(0);
    setPos1(0);
    setCurPlayer(0);
    setAccordsCount(0);
    setStep('roll');
    setAnimatingPos(null);
    usedActivityIds.current.clear();
    usedPauseIds.current.clear();
    usedAccordIds.current.clear();
    setPhase('playing');
    saveGame({ players: [pl1, pl2], positions: [0, 0], currentPlayer: 0, accordsCount: 0 });
  }, []);

  const resumeGame = () => {
    if (!savedGame) return;
    const [pl1, pl2] = savedGame.players;
    setP1(pl1);
    setP2(pl2);
    setPos0(savedGame.positions[0]);
    setPos1(savedGame.positions[1]);
    setCurPlayer(savedGame.currentPlayer);
    setAccordsCount(savedGame.accordsCount);
    setStep('roll');
    setPhase('playing');
  };

  // ── Logique de jeu ───────────────────────────────────────────────────────

  const processSquare = useCallback((squareIndex: number, p0: number, p1c: number, cp: 0 | 1, ac: number) => {
    const square = BOARD[squareIndex];

    switch (square.type) {
      case 'arrivee':
        clearSavedGame();
        setPhase('end');
        vibrate([100, 80, 200]);
        return;

      case 'normal':
      case 'depart': {
        const face = (square.face ?? 1) as 1 | 2 | 3 | 4 | 5 | 6;
        const acts = getBoardActivitiesForFace(face, isAdult);
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
        const douceurActs = getBoardActivitiesForFace(6, isAdult);
        setActivity(pickNoRepeat(douceurActs, usedActivityIds.current).text);
        setStep('complicite');
        vibrate([40, 20, 80]);
        return;
      }
    }
  }, [isAdult, usedActivityIds, usedPauseIds, usedAccordIds]);

  const handleRoll = () => {
    if (step !== 'roll') return;
    const face = (Math.ceil(Math.random() * 6)) as 1 | 2 | 3 | 4 | 5 | 6;
    diceRef.current = face;
    setDiceResult(face);
    setIsRolling(true);
    setStep('rolling');
    vibrate(100);
  };

  const handleRollComplete = useCallback(() => {
    setIsRolling(false);
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const roll = diceRef.current;
    const curPos = cp === 0 ? p0 : p1c;
    const newPos = Math.min(curPos + roll, 23);

    const newPos0 = cp === 0 ? newPos : p0;
    const newPos1 = cp === 1 ? newPos : p1c;

    animatePawn(curPos, newPos, () => {
      if (cp === 0) setPos0(newPos);
      else setPos1(newPos);
      persistGame(newPos0, newPos1, cp, ac);
      processSquare(newPos, newPos0, newPos1, cp, ac);
    });
  }, [animatePawn, persistGame, processSquare]);

  const handleChanceBounce = useCallback(() => {
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const curPos = cp === 0 ? p0 : p1c;
    const newPos = Math.min(curPos + 2, 23);

    const newPos0 = cp === 0 ? newPos : p0;
    const newPos1 = cp === 1 ? newPos : p1c;

    animatePawn(curPos, newPos, () => {
      if (cp === 0) setPos0(newPos);
      else setPos1(newPos);
      persistGame(newPos0, newPos1, cp, ac);
      processSquare(newPos, newPos0, newPos1, cp, ac);
    });
  }, [animatePawn, persistGame, processSquare]);

  const endTurn = useCallback(() => {
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const next: 0 | 1 = cp === 0 ? 1 : 0;
    setCurPlayer(next);
    persistGame(p0, p1c, next, ac);
    setStep('roll');
  }, [persistGame]);

  const handleAccordP1Vote = (vote: boolean) => {
    setAccordVote0(vote);
    setStep('accord-hidden');
    vibrate(40);
  };

  const handleAccordP2Vote = (vote: boolean) => {
    setAccordVote1(vote);
    setStep('accord-result');
    vibrate(40);
  };

  const handleAccordResult = useCallback(() => {
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const bothYes = accordVote0 === true && accordVote1 === true;
    const next: 0 | 1 = cp === 0 ? 1 : 0;
    const newAccords = bothYes ? ac + 1 : ac;
    setAccordsCount(newAccords);
    setCurPlayer(next);
    persistGame(p0, p1c, next, newAccords);
    setStep('roll');
  }, [accordVote0, accordVote1, persistGame]);

  // ── Valeurs dérivées ─────────────────────────────────────────────────────

  const player1 = p1 ?? { name: 'Joueur 1', emoji: '🦊' };
  const player2 = p2 ?? { name: 'Joueur 2', emoji: '🐼' };
  const activeName   = curPlayer === 0 ? player1.name : player2.name;
  const activePos    = curPlayer === 0 ? pos0 : pos1;
  const activePawn   = curPlayer === 0 ? player1.emoji : player2.emoji;

  // Positions visuelles (animation > réel)
  const displayPos0 = (curPlayer === 0 && animatingPos !== null) ? animatingPos : pos0;
  const displayPos1 = (curPlayer === 1 && animatingPos !== null) ? animatingPos : pos1;
  const activeSquare = animatingPos !== null ? animatingPos : activePos;

  const currentZone = getZone(activePos);
  const zoneIndex   = activePos <= 7 ? 0 : activePos <= 15 ? 1 : 2;

  const currentSquare = BOARD[activePos];
  const squareBg = getSquareBg(currentSquare);

  // ── Phases intro / setup / pacte ─────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center p-6 gap-6 min-h-[70vh]"
        style={{ color: 'white' }}
      >
        <div className="text-center mt-4">
          <div className="text-6xl mb-3">🎲</div>
          <h1 className="text-2xl font-black mb-2">Le Jeu de l'Oie</h1>
          <p className="text-white/65 text-sm leading-relaxed max-w-[280px] mx-auto">
            2 joueurs · 1 téléphone · 24 cases<br />
            Avancez ensemble, explorez ensemble.
          </p>
        </div>

        <div className="w-full max-w-[300px] rounded-2xl p-4 flex flex-col gap-2.5"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { emoji: '⏸️', bg: '#f87171', label: 'Pause', desc: 'Un moment obligatoire pour se parler' },
            { emoji: '⭐', bg: '#fbbf24', label: 'Chance', desc: '+2 cases bonus' },
            { emoji: '🤝', bg: '#60a5fa', label: 'Accord', desc: 'Les deux disent OUI — ou on passe' },
            { emoji: '💜', bg: '#c084fc', label: 'Complicité', desc: 'Activité Douceur imposée' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span style={{ fontSize: 17, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.bg + '28', borderRadius: 8 }}>
                {item.emoji}
              </span>
              <span className="text-white font-semibold text-sm">{item.label}</span>
              <span className="text-white/45 text-xs">{item.desc}</span>
            </div>
          ))}
        </div>

        {savedGame && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={resumeGame}
            className="w-full max-w-[300px] py-3 rounded-2xl font-bold text-sm"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)' }}
          >
            ↩️ Reprendre la partie en cours
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setSavedGame(null); clearSavedGame(); setPhase('setup-p1'); }}
          className="w-full max-w-[300px] py-4 rounded-2xl font-bold text-base"
          style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b' }}
        >
          {savedGame ? '✨ Nouvelle partie' : '✨ Commencer'}
        </motion.button>
      </motion.div>
    );
  }

  if (phase === 'setup-p1') {
    return (
      <div style={{ minHeight: '100%', background: 'linear-gradient(160deg, #7c3aed, #4f46e5)' }}>
        <AnimatePresence mode="wait">
          <SetupPlayer key="p1" playerIndex={0} otherEmoji={undefined} onConfirm={handleP1Confirm} />
        </AnimatePresence>
      </div>
    );
  }

  if (phase === 'setup-p2') {
    return (
      <div style={{ minHeight: '100%', background: 'linear-gradient(160deg, #0369a1, #0891b2)' }}>
        <AnimatePresence mode="wait">
          <SetupPlayer key="p2" playerIndex={1} otherEmoji={p1?.emoji} onConfirm={handleP2Confirm} />
        </AnimatePresence>
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

  // ── Écran de fin ─────────────────────────────────────────────────────────

  if (phase === 'end') {
    const endMsg =
      accordsCount === 0 ? { text: "Première partie ensemble. Le consentement s'explore.", icon: '🌱' } :
      accordsCount <= 2  ? { text: "Quelques accords — une belle soirée de découverte mutuelle.", icon: '🌊' } :
      accordsCount <= 4  ? { text: "Bonne complicité. Vous vous comprenez bien.", icon: '✨' } :
                           { text: "Excellente complicité — rare et précieux.", icon: '💜' };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 flex flex-col items-center gap-5 text-center"
        style={{ color: 'white', minHeight: '100%', background: 'linear-gradient(180deg, #1a0838 0%, #060512 100%)' }}
      >
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="pt-4">
          <div className="text-5xl mb-3">🏁</div>
          <h2 className="text-2xl font-black mb-1">Vous êtes arrivés !</h2>
          <p className="text-white/55 text-sm">Ensemble, jusqu'au bout.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
          className="flex items-center gap-5"
        >
          <div className="text-center">
            <div className="text-4xl">{player1.emoji}</div>
            <div className="text-sm font-bold text-white/75 mt-1">{player1.name}</div>
          </div>
          <div className="text-white/25 text-xl">×</div>
          <div className="text-center">
            <div className="text-4xl">{player2.emoji}</div>
            <div className="text-sm font-bold text-white/75 mt-1">{player2.name}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full max-w-[300px] flex flex-col gap-3"
        >
          <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
            <span className="text-3xl">🤝</span>
            <div className="text-left">
              <div className="text-2xl font-black text-blue-300">{accordsCount}</div>
              <div className="text-xs text-blue-200/75">
                {accordsCount === 0 ? "accord — aucun n'est exigé" :
                 accordsCount === 1 ? 'accord réussi' : 'accords réussis'}
              </div>
            </div>
          </div>

          <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-2xl mt-0.5">{endMsg.icon}</span>
            <p className="text-white/80 text-sm leading-relaxed text-left">{endMsg.text}</p>
          </div>

          <div className="rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>🌱 Découverte</span>
            <span className="text-white/20 text-xs">→</span>
            <span className="text-xs font-semibold" style={{ color: '#60a5fa' }}>🌊 Intimité</span>
            <span className="text-white/20 text-xs">→</span>
            <span className="text-xs font-semibold" style={{ color: '#c084fc' }}>✨ Connexion</span>
          </div>
        </motion.div>

        <p className="text-white/30 text-xs max-w-[260px] leading-relaxed">
          Dire non librement, c'est ce qui rend le oui réel.
        </p>

        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            clearSavedGame();
            setSavedGame(null);
            usedActivityIds.current.clear();
            usedPauseIds.current.clear();
            usedAccordIds.current.clear();
            setPhase('intro');
          }}
          className="w-full max-w-[280px] py-4 rounded-2xl font-bold text-base"
          style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b' }}
        >
          Rejouer
        </motion.button>
      </motion.div>
    );
  }

  // ── Plateau ───────────────────────────────────────────────────────────────

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
      <div className="flex items-center justify-center gap-1.5 py-2">
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            height: 3, width: i === zoneIndex ? 24 : 8,
            borderRadius: 4,
            background: i === zoneIndex ? currentZone.color : 'rgba(255,255,255,0.2)',
            transition: 'all 0.6s ease',
          }} />
        ))}
        <span style={{ fontSize: 10, color: currentZone.color, fontWeight: 700, marginLeft: 4, transition: 'color 0.6s ease' }}>
          {currentZone.emoji} {currentZone.name}
        </span>
      </div>

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
            C'est ton tour, <span className="text-white font-bold">{activeName}</span>
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
              Lancer 🎲
            </motion.button>
          )}

          {step === 'rolling' && (
            <p className="text-white/40 text-sm animate-pulse">
              {animatingPos !== null ? 'En route…' : 'En train de lancer…'}
            </p>
          )}
        </div>

        {accordsCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl px-3 py-1.5"
            style={{ background: 'rgba(96,165,250,0.18)', border: '1px solid rgba(96,165,250,0.3)' }}>
            <span style={{ fontSize: 14 }}>🤝</span>
            <span className="text-blue-300 text-sm font-semibold">
              {accordsCount} accord{accordsCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* ── Overlays ── */}
      <AnimatePresence>

        {/* Activité normale / pause / complicité */}
        {(step === 'normal' || step === 'pause' || step === 'complicite') && (
          <Overlay key="act" color={squareBg || '#1e293b'}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 26 }}>
                  {step === 'pause' ? '⏸️' : step === 'complicite' ? '💜' : getSquareEmoji(currentSquare)}
                </span>
                <div>
                  <p className="text-white/55 text-xs uppercase tracking-widest font-bold">
                    {step === 'pause' ? 'Pause' : step === 'complicite' ? 'Complicité — Douceur'
                      : (currentSquare.face ? DICE_CATEGORIES[currentSquare.face].name : '')}
                  </p>
                  <p className="text-white font-bold text-sm">{activeName}</p>
                </div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '3px 8px',
                background: 'rgba(255,255,255,0.12)',
                color: currentZone.color,
                border: `1px solid ${currentZone.color}44`,
              }}>
                {currentZone.emoji} {currentZone.name}
              </span>
            </div>

            <p className="text-white text-lg font-semibold mb-7" style={{ lineHeight: 1.55 }}>
              {activity}
            </p>

            <button
              onClick={endTurn}
              className="w-full py-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1.5px solid rgba(255,255,255,0.35)' }}
            >
              Continuer →
            </button>
          </Overlay>
        )}

        {/* Chance */}
        {step === 'chance' && (
          <Overlay key="chance" color="linear-gradient(160deg, #b45309, #d97706)">
            <div className="text-center py-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 320 }}
                className="text-6xl mb-3"
              >⭐</motion.div>
              <h3 className="text-white text-2xl font-black mb-2">Case Chance !</h3>
              <p className="text-white/80 text-base mb-7">
                {activeName} avance de <strong>2 cases</strong> supplémentaires !
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleChanceBounce}
                className="w-full py-4 rounded-2xl font-bold text-base"
                style={{ background: 'rgba(255,255,255,0.95)', color: '#78350f' }}
              >
                Avancer ✨
              </motion.button>
            </div>
          </Overlay>
        )}

        {/* Accord — présentation */}
        {step === 'accord-intro' && (
          <Overlay key="acc-intro" color="linear-gradient(160deg, #1d4ed8, #1e40af)">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="text-white text-xl font-black">Case Accord</h3>
              <p className="text-white/65 text-sm mt-1">Les deux doivent dire OUI pour que ça compte</p>
            </div>
            <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="text-white text-base font-semibold" style={{ lineHeight: 1.55 }}>{activity}</p>
            </div>
            <button
              onClick={() => setStep('accord-p1')}
              className="w-full py-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(255,255,255,0.95)', color: '#1d4ed8' }}
            >
              Voter en secret →
            </button>
          </Overlay>
        )}

        {/* Accord — vote P1 */}
        {step === 'accord-p1' && (
          <Overlay key="acc-p1" color="#0f172a">
            <div className="text-center mb-4">
              <span className="text-3xl">{player1.emoji}</span>
              <p className="text-white font-bold mt-1">{player1.name}, c'est ton vote</p>
              <p className="text-white/45 text-xs mt-0.5">L'autre ne voit pas ta réponse</p>
            </div>
            <p className="text-white/75 text-sm text-center mb-7 leading-relaxed">{activity}</p>
            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleAccordP1Vote(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg"
                style={{ background: 'rgba(239,68,68,0.18)', color: '#fca5a5', border: '1.5px solid rgba(239,68,68,0.35)' }}>
                Non 🚫
              </motion.button>
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleAccordP1Vote(true)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg"
                style={{ background: 'rgba(34,197,94,0.18)', color: '#86efac', border: '1.5px solid rgba(34,197,94,0.35)' }}>
                Oui ✅
              </motion.button>
            </div>
          </Overlay>
        )}

        {/* Accord — transition */}
        {step === 'accord-hidden' && (
          <Overlay key="acc-hidden" color="#060912">
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🙈</div>
              <h3 className="text-white text-xl font-bold mb-2">
                Passe le téléphone à {player2.name}
              </h3>
              <p className="text-white/40 text-sm mb-8">
                {player1.name} a voté. Ne montrez pas l'écran.
              </p>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep('accord-p2')}
                className="w-full py-4 rounded-2xl font-bold text-base"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.22)' }}>
                {player2.name} est prêt·e →
              </motion.button>
            </div>
          </Overlay>
        )}

        {/* Accord — vote P2 */}
        {step === 'accord-p2' && (
          <Overlay key="acc-p2" color="#0f172a">
            <div className="text-center mb-4">
              <span className="text-3xl">{player2.emoji}</span>
              <p className="text-white font-bold mt-1">{player2.name}, c'est ton vote</p>
              <p className="text-white/45 text-xs mt-0.5">Vote sans regarder ce qu'a répondu {player1.name}</p>
            </div>
            <p className="text-white/75 text-sm text-center mb-7 leading-relaxed">{activity}</p>
            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleAccordP2Vote(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg"
                style={{ background: 'rgba(239,68,68,0.18)', color: '#fca5a5', border: '1.5px solid rgba(239,68,68,0.35)' }}>
                Non 🚫
              </motion.button>
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleAccordP2Vote(true)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg"
                style={{ background: 'rgba(34,197,94,0.18)', color: '#86efac', border: '1.5px solid rgba(34,197,94,0.35)' }}>
                Oui ✅
              </motion.button>
            </div>
          </Overlay>
        )}

        {/* Accord — résultat */}
        {step === 'accord-result' && (() => {
          const bothYes = accordVote0 === true && accordVote1 === true;
          if (bothYes && !showConfetti) triggerConfetti();
          return (
            <Overlay
              key="acc-result"
              color={bothYes
                ? 'linear-gradient(160deg, #14532d, #15803d)'
                : 'linear-gradient(160deg, #1e293b, #334155)'}
            >
              <div className="text-center py-2">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="text-5xl mb-3"
                >
                  {bothYes ? '🎉' : '🤗'}
                </motion.div>
                <h3 className="text-white text-xl font-black mb-2">
                  {bothYes ? 'Accord réussi !' : 'Pas de souci'}
                </h3>
                {bothYes ? (
                  <>
                    <p className="text-white/70 text-sm mb-2">
                      {player1.name} ✅ · {player2.name} ✅
                    </p>
                    <p className="text-white/55 text-sm mb-7">
                      Accord #{accordsCount + 1} — vous avez dit oui ensemble.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-white/60 text-sm mb-2">
                      Un non a été dit — c'est le consentement qui fonctionne.
                    </p>
                    <p className="text-white/40 text-xs mb-7">Personne ne recule, on continue.</p>
                  </>
                )}
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleAccordResult}
                  className="w-full py-4 rounded-2xl font-bold text-base"
                  style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b' }}>
                  Continuer →
                </motion.button>
              </div>
            </Overlay>
          );
        })()}

      </AnimatePresence>
    </div>
  );
}
