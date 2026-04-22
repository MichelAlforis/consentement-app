'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice3D } from '../ui/Dice3D';
import { DICE_CATEGORIES } from '../../data';
import {
  BOARD, BOARD_LAYOUT, SQUARE_VISUAL, PAWN_EMOJIS,
  PAUSE_ACTIVITIES, ACCORD_ACTIVITIES,
  pickRandom, getActivitiesForFace, getSquareBg, getSquareEmoji,
  loadSavedGame, saveGame, clearSavedGame, SavedGooseGame,
} from '../../data/goose-game';

// ─── Types ──────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'setup-p1' | 'setup-p2' | 'playing' | 'end';

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

// ─── Board Cell ──────────────────────────────────────────────────────────────

interface BoardCellProps {
  squareIndex: number;
  pos0: number;
  pos1: number;
  p0Emoji: string;
  p1Emoji: string;
  isActive: boolean;
}

function BoardCell({ squareIndex, pos0, pos1, p0Emoji, p1Emoji, isActive }: BoardCellProps) {
  const square = BOARD[squareIndex];
  const bg = getSquareBg(square);
  const emoji = getSquareEmoji(square);
  const hasP0 = pos0 === squareIndex;
  const hasP1 = pos1 === squareIndex;

  return (
    <motion.div
      animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={isActive ? { duration: 0.6, repeat: Infinity, repeatType: 'loop' } : {}}
      style={{
        background: bg,
        borderRadius: 8,
        height: 44,
        position: 'relative',
        border: isActive ? '2px solid rgba(255,255,255,0.9)' : '1.5px solid rgba(255,255,255,0.15)',
        boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.4)' : undefined,
        overflow: 'hidden',
      }}
      className="flex items-center justify-center"
    >
      {/* Emoji centre */}
      <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>

      {/* Numéro */}
      <span style={{
        position: 'absolute', bottom: 1, right: 3,
        fontSize: 7, color: 'rgba(255,255,255,0.6)', fontWeight: 700,
      }}>
        {squareIndex}
      </span>

      {/* Pions */}
      {hasP0 && (
        <span style={{ position: 'absolute', top: 1, left: 2, fontSize: 11 }}>
          {p0Emoji}
        </span>
      )}
      {hasP1 && (
        <span style={{
          position: 'absolute',
          top: 1,
          right: hasP0 ? 'auto' : 2,
          left: hasP0 ? 'auto' : undefined,
          fontSize: 11,
        }}>
          {p1Emoji}
        </span>
      )}
    </motion.div>
  );
}

// ─── Board Grid ──────────────────────────────────────────────────────────────

function BoardGrid({ pos0, pos1, p0Emoji, p1Emoji, activeSquare }: {
  pos0: number;
  pos1: number;
  p0Emoji: string;
  p1Emoji: string;
  activeSquare: number;
}) {
  return (
    <div
      className="mx-auto"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 4,
        maxWidth: 300,
        padding: '0 4px',
      }}
    >
      {BOARD_LAYOUT.flatMap((row) =>
        row.map((squareIndex) => (
          <BoardCell
            key={squareIndex}
            squareIndex={squareIndex}
            pos0={pos0}
            pos1={pos1}
            p0Emoji={p0Emoji}
            p1Emoji={p1Emoji}
            isActive={squareIndex === activeSquare}
          />
        ))
      )}
    </div>
  );
}

// ─── Activity Overlay ────────────────────────────────────────────────────────

interface OverlayProps {
  children: React.ReactNode;
  color?: string;
}

function Overlay({ children, color = '#1e293b' }: OverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 50,
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        style={{
          background: color,
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 40px',
          width: '100%',
          maxHeight: '72vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Legend strip ────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    { type: 'pause',      label: 'Pause' },
    { type: 'chance',     label: 'Chance' },
    { type: 'accord',     label: 'Accord' },
    { type: 'complicite', label: 'Complicité' },
  ] as const;

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap mt-3">
      {items.map(({ type, label }) => (
        <div key={type} className="flex items-center gap-1">
          <span
            style={{
              display: 'inline-block', width: 10, height: 10, borderRadius: 3,
              background: SQUARE_VISUAL[type].bg,
            }}
          />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Setup Screen ────────────────────────────────────────────────────────────

interface SetupProps {
  playerIndex: 0 | 1;
  otherEmoji: string | undefined;
  onConfirm: (name: string, emoji: string) => void;
}

function SetupPlayer({ playerIndex, otherEmoji, onConfirm }: SetupProps) {
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
        <h2 className="text-xl font-bold text-white">
          Joueur {playerIndex + 1}
        </h2>
        <p className="text-white/60 text-sm mt-1">Choisis ton prénom et ton pion</p>
      </div>

      {/* Nom */}
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

      {/* Pion */}
      <div>
        <label className="block text-white/80 text-sm font-semibold mb-3">Ton pion</label>
        <div className="flex justify-center gap-3 flex-wrap">
          {available.map(e => (
            <motion.button
              key={e}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEmoji(e)}
              style={{
                width: 56, height: 56, borderRadius: 16,
                background: emoji === e ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                border: emoji === e ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent',
                fontSize: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {e}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          if (name.trim() && emoji) onConfirm(name.trim(), emoji);
        }}
        style={{
          background: name.trim() && emoji
            ? 'rgba(255,255,255,0.95)'
            : 'rgba(255,255,255,0.2)',
          borderRadius: 18,
          padding: '14px',
          fontWeight: 700,
          fontSize: 16,
          color: name.trim() && emoji ? '#1e293b' : 'rgba(255,255,255,0.5)',
          marginTop: 'auto',
        }}
      >
        {playerIndex === 0 ? 'Suivant →' : '🎲 Commencer'}
      </motion.button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
            Ce jeu est réservé aux membres Premium. Passe à Premium pour y accéder.
          </p>
        </div>
      </motion.div>
    );
  }
  return <GooseGameInner isAdult={isAdult} />;
}

function GooseGameInner({ isAdult }: { isAdult: boolean }) {
  const [phase, setPhase] = useState<Phase>('intro');

  // Setup
  const [p1, setP1] = useState<Player | null>(null);
  const [p2, setP2] = useState<Player | null>(null);

  // Game state
  const [pos0, setPos0] = useState(0);
  const [pos1, setPos1] = useState(0);
  const [curPlayer, setCurPlayer] = useState<0 | 1>(0);
  const [accordsCount, setAccordsCount] = useState(0);
  const [step, setStep] = useState<TurnStep>('roll');
  const [diceResult, setDiceResult] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [activity, setActivity] = useState('');
  const [accordVote0, setAccordVote0] = useState<boolean | null>(null);
  const [accordVote1, setAccordVote1] = useState<boolean | null>(null);
  const [savedGame, setSavedGame] = useState<SavedGooseGame | null>(null);

  // Use ref to avoid stale closure in onRollComplete
  const gameRef = useRef({ pos0, pos1, curPlayer, accordsCount, p1, p2 });
  useEffect(() => {
    gameRef.current = { pos0, pos1, curPlayer, accordsCount, p1, p2 };
  });

  const diceRef = useRef(diceResult);

  useEffect(() => {
    const saved = loadSavedGame();
    if (saved) setSavedGame(saved);
  }, []);

  // ── Setup handlers ─────────────────────────────────────────────────────────

  const handleP1Confirm = (name: string, emoji: string) => {
    const player: Player = { name, emoji };
    setP1(player);
    setPhase('setup-p2');
  };

  const handleP2Confirm = (name: string, emoji: string) => {
    const player: Player = { name, emoji };
    setP2(player);
    startNewGame(gameRef.current.p1!, player);
  };

  const startNewGame = (player1: Player, player2: Player) => {
    setPos0(0);
    setPos1(0);
    setCurPlayer(0);
    setAccordsCount(0);
    setStep('roll');
    setPhase('playing');
    saveGame({ players: [player1, player2], positions: [0, 0], currentPlayer: 0, accordsCount: 0 });
  };

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

  // ── Game logic ─────────────────────────────────────────────────────────────

  const persistGame = useCallback((
    newPos0: number, newPos1: number,
    newCurPlayer: 0 | 1, newAccords: number,
  ) => {
    if (!gameRef.current.p1 || !gameRef.current.p2) return;
    saveGame({
      players: [gameRef.current.p1, gameRef.current.p2],
      positions: [newPos0, newPos1],
      currentPlayer: newCurPlayer,
      accordsCount: newAccords,
    });
  }, []);

  const processSquare = useCallback((
    squareIndex: number,
    newPos0: number,
    newPos1: number,
    player: 0 | 1,
    accords: number,
  ) => {
    const square = BOARD[squareIndex];

    switch (square.type) {
      case 'arrivee': {
        clearSavedGame();
        setPhase('end');
        return;
      }
      case 'normal':
      case 'depart': {
        const face = (square.face ?? 1) as 1 | 2 | 3 | 4 | 5 | 6;
        const acts = getActivitiesForFace(face, isAdult, true);
        setActivity(pickRandom(acts).text);
        setStep('normal');
        return;
      }
      case 'pause': {
        setActivity(pickRandom(PAUSE_ACTIVITIES));
        setStep('pause');
        return;
      }
      case 'chance': {
        setStep('chance');
        return;
      }
      case 'accord': {
        setActivity(pickRandom(ACCORD_ACTIVITIES));
        setAccordVote0(null);
        setAccordVote1(null);
        setStep('accord-intro');
        return;
      }
      case 'complicite': {
        const douceurActs = getActivitiesForFace(6, isAdult, true);
        setActivity(pickRandom(douceurActs).text);
        setStep('complicite');
        return;
      }
    }
  }, [isAdult]);

  const handleRoll = () => {
    if (step !== 'roll') return;
    const face = (Math.ceil(Math.random() * 6)) as 1 | 2 | 3 | 4 | 5 | 6;
    diceRef.current = face;
    setDiceResult(face);
    setIsRolling(true);
    setStep('rolling');
  };

  const handleRollComplete = useCallback(() => {
    setIsRolling(false);
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const roll = diceRef.current;

    const curPos = cp === 0 ? p0 : p1c;
    const newPos = Math.min(curPos + roll, 23);

    const newPos0 = cp === 0 ? newPos : p0;
    const newPos1 = cp === 1 ? newPos : p1c;

    if (cp === 0) setPos0(newPos);
    else setPos1(newPos);

    persistGame(newPos0, newPos1, cp, ac);
    processSquare(newPos, newPos0, newPos1, cp, ac);
  }, [persistGame, processSquare]);

  const handleChanceBounce = useCallback(() => {
    const { pos0: p0, pos1: p1c, curPlayer: cp, accordsCount: ac } = gameRef.current;
    const curPos = cp === 0 ? p0 : p1c;
    const newPos = Math.min(curPos + 2, 23);

    const newPos0 = cp === 0 ? newPos : p0;
    const newPos1 = cp === 1 ? newPos : p1c;

    if (cp === 0) setPos0(newPos);
    else setPos1(newPos);

    persistGame(newPos0, newPos1, cp, ac);
    processSquare(newPos, newPos0, newPos1, cp, ac);
  }, [persistGame, processSquare]);

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
  };

  const handleAccordP2Vote = (vote: boolean) => {
    setAccordVote1(vote);
    setStep('accord-result');
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

  // ── Derived values ─────────────────────────────────────────────────────────

  const player1 = p1 ?? { name: 'Joueur 1', emoji: '🦊' };
  const player2 = p2 ?? { name: 'Joueur 2', emoji: '🐼' };
  const activeName = curPlayer === 0 ? player1.name : player2.name;
  const activePos = curPlayer === 0 ? pos0 : pos1;
  const activePawnEmoji = curPlayer === 0 ? player1.emoji : player2.emoji;

  // ── Render: intro ──────────────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-6 gap-6 min-h-[60vh]"
        style={{ color: 'white' }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🎲</div>
          <h1 className="text-2xl font-black mb-2">Le Jeu de l'Oie</h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-[280px] mx-auto">
            2 joueurs · 1 téléphone · 24 cases<br/>
            Avancez ensemble, explorez ensemble.
          </p>
        </div>

        {/* Légende rapide */}
        <div className="w-full max-w-[300px] rounded-2xl p-4 flex flex-col gap-2"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          {[
            { emoji: '⏸️', color: '#f87171', label: 'Pause', desc: 'Dites-vous quelque chose' },
            { emoji: '⭐', color: '#fbbf24', label: 'Chance', desc: '+2 cases bonus' },
            { emoji: '🤝', color: '#60a5fa', label: 'Accord', desc: 'Les deux disent OUI pour avancer' },
            { emoji: '💜', color: '#c084fc', label: 'Complicité', desc: 'Activité Douceur imposée' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span style={{
                fontSize: 18, width: 32, height: 32, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: item.color + '33', borderRadius: 8,
              }}>
                {item.emoji}
              </span>
              <div>
                <span className="text-white font-semibold text-sm">{item.label}</span>
                <span className="text-white/50 text-xs ml-2">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {savedGame && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={resumeGame}
            className="w-full max-w-[300px] py-3 rounded-2xl font-bold text-base"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}
          >
            ↩️ Reprendre la partie
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

  // ── Render: setup ──────────────────────────────────────────────────────────

  if (phase === 'setup-p1') {
    return (
      <div style={{ minHeight: '100%', background: 'linear-gradient(160deg, #7c3aed, #4f46e5)' }}>
        <AnimatePresence mode="wait">
          <SetupPlayer
            key="p1"
            playerIndex={0}
            otherEmoji={undefined}
            onConfirm={handleP1Confirm}
          />
        </AnimatePresence>
      </div>
    );
  }

  if (phase === 'setup-p2') {
    return (
      <div style={{ minHeight: '100%', background: 'linear-gradient(160deg, #0369a1, #0891b2)' }}>
        <AnimatePresence mode="wait">
          <SetupPlayer
            key="p2"
            playerIndex={1}
            otherEmoji={p1?.emoji}
            onConfirm={handleP2Confirm}
          />
        </AnimatePresence>
      </div>
    );
  }

  // ── Render: end ────────────────────────────────────────────────────────────

  if (phase === 'end') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-6 gap-6 min-h-[60vh] text-center"
        style={{ color: 'white' }}
      >
        <div className="text-6xl">🏆</div>
        <div>
          <h2 className="text-2xl font-black mb-2">Vous êtes arrivés !</h2>
          <p className="text-white/70 text-sm">
            Merci d'avoir joué ensemble.
          </p>
        </div>

        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-4xl">{player1.emoji}</div>
            <div className="text-sm font-semibold text-white/80 mt-1">{player1.name}</div>
          </div>
          <div className="text-2xl self-center text-white/40">+</div>
          <div className="text-center">
            <div className="text-4xl">{player2.emoji}</div>
            <div className="text-sm font-semibold text-white/80 mt-1">{player2.name}</div>
          </div>
        </div>

        {accordsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl px-6 py-4"
            style={{ background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)' }}
          >
            <div className="text-3xl font-black text-blue-300">{accordsCount}</div>
            <div className="text-sm text-blue-200 mt-0.5">
              {accordsCount === 1 ? 'accord réussi 🤝' : 'accords réussis 🤝'}
            </div>
          </motion.div>
        )}

        <p className="text-white/50 text-xs max-w-[260px]">
          Le consentement c'est savoir dire oui et non — vous l'avez pratiqué ce soir.
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { clearSavedGame(); setSavedGame(null); setPhase('intro'); }}
          className="w-full max-w-[280px] py-4 rounded-2xl font-bold text-base"
          style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b' }}
        >
          Rejouer
        </motion.button>
      </motion.div>
    );
  }

  // ── Render: playing ────────────────────────────────────────────────────────

  const currentSquare = BOARD[activePos];
  const squareBg = getSquareBg(currentSquare);

  return (
    <div className="flex flex-col" style={{ color: 'white', minHeight: '100%' }}>
      {/* Plateau */}
      <div className="pt-3 pb-2">
        <BoardGrid
          pos0={pos0}
          pos1={pos1}
          p0Emoji={player1.emoji}
          p1Emoji={player2.emoji}
          activeSquare={activePos}
        />
        <Legend />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '0 16px' }} />

      {/* Zone de tour */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 py-4">

        {/* Qui joue */}
        <motion.div
          key={`turn-${curPlayer}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span style={{ fontSize: 32 }}>{activePawnEmoji}</span>
          <p className="text-white/60 text-sm mt-1">
            C'est ton tour,{' '}
            <span className="text-white font-bold">{activeName}</span>
          </p>
        </motion.div>

        {/* Dé */}
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
              whileTap={{ scale: 0.95 }}
              onClick={handleRoll}
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: '#1e293b',
                borderRadius: 16,
                padding: '12px 32px',
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              Lancer 🎲
            </motion.button>
          )}

          {step === 'rolling' && (
            <p className="text-white/50 text-sm animate-pulse">En train de lancer…</p>
          )}
        </div>

        {/* Score accords */}
        {accordsCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl px-3 py-1.5"
            style={{ background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.3)' }}>
            <span style={{ fontSize: 14 }}>🤝</span>
            <span className="text-blue-300 text-sm font-semibold">
              {accordsCount} accord{accordsCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* ── Overlays ── */}
      <AnimatePresence>

        {/* Activité normale */}
        {(step === 'normal' || step === 'pause' || step === 'complicite') && (
          <Overlay key="normal-overlay" color={squareBg || '#1e293b'}>
            <div className="flex items-center gap-3 mb-4">
              <span style={{ fontSize: 28 }}>
                {step === 'pause' ? '⏸️' : step === 'complicite' ? '💜' : getSquareEmoji(currentSquare)}
              </span>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest font-bold">
                  {step === 'pause' ? 'Pause' : step === 'complicite' ? 'Complicité — Douceur' : (currentSquare.face ? DICE_CATEGORIES[currentSquare.face].name : '')}
                </p>
                <p className="text-white font-bold text-sm">{activeName} a lancé</p>
              </div>
            </div>

            <p className="text-white text-lg font-semibold leading-snug mb-6" style={{ lineHeight: 1.5 }}>
              {activity}
            </p>

            <button
              onClick={endTurn}
              className="w-full py-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)' }}
            >
              Continuer →
            </button>
          </Overlay>
        )}

        {/* Chance */}
        {step === 'chance' && (
          <Overlay key="chance-overlay" color="linear-gradient(160deg, #d97706, #f59e0b)">
            <div className="text-center py-2">
              <div className="text-5xl mb-3">⭐</div>
              <h3 className="text-white text-2xl font-black mb-1">Case Chance !</h3>
              <p className="text-white/80 text-base mb-6">
                {activeName} avance de <strong>2 cases</strong> supplémentaires !
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleChanceBounce}
                className="w-full py-4 rounded-2xl font-bold text-base"
                style={{ background: 'rgba(255,255,255,0.95)', color: '#92400e' }}
              >
                Avancer ✨
              </motion.button>
            </div>
          </Overlay>
        )}

        {/* Accord — présentation */}
        {step === 'accord-intro' && (
          <Overlay key="accord-intro-overlay" color="linear-gradient(160deg, #1d4ed8, #2563eb)">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="text-white text-xl font-black">Case Accord</h3>
              <p className="text-white/70 text-sm mt-1">Les deux doivent dire OUI pour que ça compte</p>
            </div>

            <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <p className="text-white text-base font-semibold leading-snug" style={{ lineHeight: 1.5 }}>
                {activity}
              </p>
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
          <Overlay key="accord-p1-overlay" color="#1e293b">
            <div className="text-center mb-4">
              <span className="text-3xl">{player1.emoji}</span>
              <p className="text-white font-bold mt-1">{player1.name}, c'est ton vote</p>
              <p className="text-white/50 text-xs mt-0.5">L'autre ne voit pas ta réponse</p>
            </div>

            <p className="text-white/80 text-sm text-center mb-6 leading-relaxed">
              {activity}
            </p>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAccordP1Vote(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1.5px solid rgba(239,68,68,0.4)' }}
              >
                Non 🚫
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAccordP1Vote(true)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg"
                style={{ background: 'rgba(34,197,94,0.2)', color: '#86efac', border: '1.5px solid rgba(34,197,94,0.4)' }}
              >
                Oui ✅
              </motion.button>
            </div>
          </Overlay>
        )}

        {/* Accord — écran de transition (masquage) */}
        {step === 'accord-hidden' && (
          <Overlay key="accord-hidden-overlay" color="#0f172a">
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🙈</div>
              <h3 className="text-white text-xl font-bold mb-2">
                Passe le téléphone à {player2.name}
              </h3>
              <p className="text-white/50 text-sm mb-8">
                {player1.name} a voté. Ne montrez pas l'écran.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep('accord-p2')}
                className="w-full py-4 rounded-2xl font-bold text-base"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}
              >
                {player2.name} est prêt·e →
              </motion.button>
            </div>
          </Overlay>
        )}

        {/* Accord — vote P2 */}
        {step === 'accord-p2' && (
          <Overlay key="accord-p2-overlay" color="#1e293b">
            <div className="text-center mb-4">
              <span className="text-3xl">{player2.emoji}</span>
              <p className="text-white font-bold mt-1">{player2.name}, c'est ton vote</p>
              <p className="text-white/50 text-xs mt-0.5">Vote sans regarder ce qu'a répondu {player1.name}</p>
            </div>

            <p className="text-white/80 text-sm text-center mb-6 leading-relaxed">
              {activity}
            </p>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAccordP2Vote(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1.5px solid rgba(239,68,68,0.4)' }}
              >
                Non 🚫
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAccordP2Vote(true)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg"
                style={{ background: 'rgba(34,197,94,0.2)', color: '#86efac', border: '1.5px solid rgba(34,197,94,0.4)' }}
              >
                Oui ✅
              </motion.button>
            </div>
          </Overlay>
        )}

        {/* Accord — résultat */}
        {step === 'accord-result' && (() => {
          const bothYes = accordVote0 === true && accordVote1 === true;
          return (
            <Overlay
              key="accord-result-overlay"
              color={bothYes
                ? 'linear-gradient(160deg, #15803d, #16a34a)'
                : 'linear-gradient(160deg, #334155, #475569)'}
            >
              <div className="text-center py-2">
                <div className="text-5xl mb-3">{bothYes ? '🎉' : '🤗'}</div>
                <h3 className="text-white text-xl font-black mb-2">
                  {bothYes ? 'Accord réussi !' : 'Pas de souci'}
                </h3>
                <p className="text-white/70 text-sm mb-2">
                  {player1.name} : {accordVote0 ? '✅ Oui' : '🚫 Non'}{'   ·   '}
                  {player2.name} : {accordVote1 ? '✅ Oui' : '🚫 Non'}
                </p>
                {bothYes ? (
                  <p className="text-white/60 text-sm mb-6">
                    Vous avez dit oui tous les deux. Accord #{accordsCount + 1} !
                  </p>
                ) : (
                  <p className="text-white/60 text-sm mb-6">
                    Personne ne recule — on passe simplement au joueur suivant.
                  </p>
                )}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAccordResult}
                  className="w-full py-4 rounded-2xl font-bold text-base"
                  style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b' }}
                >
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
