'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ChevronRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUnlockStore } from '../../stores/unlockStore';
import { useRevealStore } from '../../stores/revealStore';
import { collectorCards } from '../../data/cards-collector';
import type { CollectorCard } from '../../data/cards-collector';
import { CollectorCardCanvas } from '../../game-engine/cards/CollectorCardCanvas';
import { DynamicIcon } from '../../utils/iconFromName';
import type { GainedCard } from '../../lib/computeGainedCards';
import type { Screen } from '../../types';
import { useTranslation } from '../../i18n';

function getUnlockScreen(card: CollectorCard): Screen {
  return card.depth === 3 ? 'jeu-oie' : 'jeu-cartes';
}

function toGainedCard(card: CollectorCard): GainedCard {
  return {
    id: card.id,
    text: card.text,
    rarity: card.rarity,
    gradient: card.visual.gradient,
    iconName: card.visual.iconName,
    border: card.visual.border,
  };
}

// ── Carte acquise ─────────────────────────────────────────────────────────────

function AcquiredCard({ card, index, onTap }: {
  card: GainedCard;
  index: number;
  onTap: (c: GainedCard) => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileTap={{ scale: 0.93 }}
      onClick={() => onTap(card)}
      className="relative overflow-hidden rounded-2xl flex flex-col items-center justify-end pb-3 shadow-sm"
      style={{
        aspectRatio: '2 / 3',
        background: card.gradient,
        boxShadow: `0 4px 16px ${card.border}55`,
      }}
    >
      {/* Texture */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1.5px, transparent 1.5px)',
        backgroundSize: '12px 12px',
      }} />
      {/* Watermarks */}
      <span className="absolute top-2 left-2">
        <DynamicIcon name={card.iconName} size={10} color="rgba(255,255,255,0.25)" />
      </span>
      <span className="absolute bottom-9 right-2" style={{ transform: 'rotate(180deg)' }}>
        <DynamicIcon name={card.iconName} size={10} color="rgba(255,255,255,0.25)" />
      </span>
      {/* Rareté badge */}
      {card.rarity !== 'common' && (
        <div className="absolute top-1.5 right-1.5 rounded px-1 py-0.5" style={{
          background: card.rarity === 'unique'
            ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
            : 'linear-gradient(135deg, #7c3aed, #a855f7)',
        }}>
          <span className="text-[6px] font-black text-white tracking-wider">
            {card.rarity === 'unique' ? 'UNIQUE' : 'RARE'}
          </span>
        </div>
      )}
      {/* Icône + texte */}
      <span className="relative z-10 mb-0.5">
        <DynamicIcon name={card.iconName} size={24} color="white" />
      </span>
      <p className="text-white font-black text-[7px] text-center leading-tight relative z-10 px-1.5"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
        {card.text.length > 30 ? card.text.slice(0, 30) + '…' : card.text}
      </p>
    </motion.button>
  );
}

// ── Carte verrouillée ─────────────────────────────────────────────────────────

function LockedCard({ card, index, deckB = false, onTap }: {
  card: CollectorCard;
  index: number;
  deckB?: boolean;
  onTap?: () => void;
}) {
  const { colors } = useTheme();
  const sharedStyle = {
    aspectRatio: '2 / 3',
    background: deckB ? 'linear-gradient(135deg, #0f0a1e 0%, #1e1230 100%)' : colors.bgSecondary,
    border: `1.5px solid ${colors.border}`,
  };
  const sharedProps = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.04 },
    className: 'relative overflow-hidden rounded-2xl flex flex-col items-center justify-center gap-1.5',
    style: sharedStyle,
  };
  const inner = (
    <>
      <Lock size={18} color={colors.textMuted} style={{ opacity: 0.35 }} />
      <p className="text-[7px] font-semibold text-center px-2 leading-tight"
        style={{ color: colors.textMuted, opacity: deckB ? 0.45 : 0.55 }}>
        {deckB ? 'App adulte' : card.unlockedBy.replace(/-/g, ' ')}
      </p>
      <div className="absolute bottom-2 flex gap-0.5">
        {([1, 2, 3] as const).map((d) => (
          <div key={d} className="w-1.5 h-1.5 rounded-full" style={{
            background: d <= card.depth ? colors.textMuted : colors.border,
            opacity: d <= card.depth ? 0.45 : 0.15,
          }} />
        ))}
      </div>
      {onTap && (
        <div className="absolute top-1.5 right-1.5">
          <ChevronRight size={9} color={colors.accent} style={{ opacity: 0.55 }} />
        </div>
      )}
    </>
  );

  if (onTap) {
    return (
      <motion.button {...sharedProps} whileTap={{ scale: 0.93 }} onClick={onTap}>
        {inner}
      </motion.button>
    );
  }
  return <motion.div {...sharedProps}>{inner}</motion.div>;
}

// ── Flip reveal overlay ───────────────────────────────────────────────────────

function FlipRevealOverlay({ cards, onDone }: { cards: GainedCard[]; onDone: () => void }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  const isLast = index === cards.length - 1;
  const total = cards.length;

  useEffect(() => {
    setFlipped(false);
    const id = setTimeout(() => setFlipped(true), 900);
    return () => clearTimeout(id);
  }, [index]);

  const handleNext = () => {
    if (isLast) {
      onDone();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const rarityLabel = card.rarity !== 'common'
    ? (card.rarity === 'unique' ? 'UNIQUE' : 'RARE')
    : null;

  const title = total === 1
    ? t('flipReveal.titleOne')
    : t('flipReveal.titlePlural', { count: String(total) });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(14px)' }}
    >
      {/* Header */}
      <motion.div
        key={`header-${index}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-1"
      >
        <p className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          {t('flipReveal.progress', { current: String(index + 1), total: String(total) })}
        </p>
        <h2 className="text-xl font-black text-white">{title}</h2>
      </motion.div>

      {/* Card with 3D flip */}
      <div style={{ perspective: '900px' }}>
        <motion.div
          key={`card-${index}`}
          initial={{ rotateY: 0, scale: 0.85 }}
          animate={{ rotateY: flipped ? 180 : 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: 200, height: 300, transformStyle: 'preserve-3d', position: 'relative' }}
        >
          {/* Back face */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 20,
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1035 100%)',
            border: '1.5px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={52} color="rgba(255,255,255,0.12)" />
          </div>

          {/* Front face */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 20,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: card.gradient,
            boxShadow: `0 8px 32px ${card.border}66`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            paddingBottom: 14, overflow: 'hidden',
          }}>
            {/* Dot texture */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1.5px, transparent 1.5px)',
              backgroundSize: '12px 12px',
            }} />
            {/* Watermarks */}
            <span style={{ position: 'absolute', top: 10, left: 10 }}>
              <DynamicIcon name={card.iconName} size={14} color="rgba(255,255,255,0.2)" />
            </span>
            <span style={{ position: 'absolute', bottom: 40, right: 10, transform: 'rotate(180deg)' }}>
              <DynamicIcon name={card.iconName} size={14} color="rgba(255,255,255,0.2)" />
            </span>
            {/* Rarity badge */}
            {rarityLabel && (
              <div style={{
                position: 'absolute', top: 10, right: 10,
                borderRadius: 6, padding: '3px 6px',
                background: card.rarity === 'unique'
                  ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                  : 'linear-gradient(135deg, #7c3aed, #a855f7)',
              }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: 'white', letterSpacing: 1 }}>
                  {rarityLabel}
                </span>
              </div>
            )}
            {/* Icon + text */}
            <span style={{ position: 'relative', zIndex: 1, marginBottom: 4 }}>
              <DynamicIcon name={card.iconName} size={32} color="white" />
            </span>
            <p style={{
              color: 'white', fontWeight: 800, fontSize: 9, textAlign: 'center',
              lineHeight: 1.35, padding: '0 12px', position: 'relative', zIndex: 1,
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}>
              {card.text.length > 40 ? card.text.slice(0, 40) + '…' : card.text}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Hint before flip */}
      <AnimatePresence>
        {!flipped && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-semibold"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            {t('flipReveal.tapToFlip')}
          </motion.p>
        )}
      </AnimatePresence>

      {/* CTA after flip */}
      <AnimatePresence>
        {flipped && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleNext}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
            }}
          >
            {isLast ? t('flipReveal.done') : t('flipReveal.next')}
            <ChevronRight size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Zoom R3F ──────────────────────────────────────────────────────────────────

function ZoomOverlay({ card, onClose }: { card: GainedCard; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.55, y: 48 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.55, y: 48 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: 200, height: 300 }}
      >
        <CollectorCardCanvas card={card} isFlipped size={200} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mt-7 text-sm font-semibold text-center px-8 leading-relaxed max-w-xs"
        style={{ color: 'rgba(255,255,255,0.78)' }}
      >
        {card.text}
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        onClick={onClose}
        className="mt-6 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
      >
        <X size={18} color="white" />
      </motion.button>
    </motion.div>
  );
}

// ── Écran principal ───────────────────────────────────────────────────────────

interface HallOfCardsScreenProps {
  isPremium: boolean;
  isAdult: boolean;
  onNavigate: (screen: Screen) => void;
}

export function HallOfCardsScreen({ isAdult, onNavigate }: HallOfCardsScreenProps) {
  const { colors } = useTheme();
  const { ownedCards } = useUnlockStore();
  const ownedIds = new Set(ownedCards.map((c) => c.id));
  const [zoomed, setZoomed] = useState<GainedCard | null>(null);

  const { pendingIds, clearPending } = useRevealStore();
  const revealCards = pendingIds
    .map((id) => collectorCards.find((c) => c.id === id))
    .filter((c): c is CollectorCard => c !== undefined)
    .map(toGainedCard);
  const [showReveal, setShowReveal] = useState(revealCards.length > 0);

  useEffect(() => {
    if (pendingIds.length > 0) setShowReveal(true);
  }, [pendingIds]);

  const deckA = collectorCards.filter((c) => c.deck === 'A');
  const deckB = collectorCards.filter((c) => c.deck === 'B');
  const totalOwned = deckA.filter((c) => ownedIds.has(c.id)).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col px-5 pt-5 pb-12"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tight leading-none"
            style={{ color: colors.textPrimary }}>
            Hall of Cards
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
            {totalOwned} / {deckA.length} cartes débloquées
          </p>
        </div>

        {/* Deck A */}
        <p className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: colors.textMuted }}>
          Deck A — Connexion
        </p>
        <div className="grid grid-cols-3 gap-2.5 mb-8">
          {deckA.map((card, i) =>
            ownedIds.has(card.id)
              ? <AcquiredCard key={card.id} card={toGainedCard(card)} index={i} onTap={setZoomed} />
              : <LockedCard key={card.id} card={card} index={i} onTap={() => onNavigate(getUnlockScreen(card))} />
          )}
        </div>

        {/* Deck B */}
        <p className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: colors.textMuted }}>
          Deck B — Explicite
          {!isAdult && (
            <span className="ml-2 normal-case font-normal" style={{ opacity: 0.55 }}>
              · app adulte uniquement
            </span>
          )}
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {deckB.map((card, i) => {
            const owned = isAdult && ownedIds.has(card.id);
            return owned
              ? <AcquiredCard key={card.id} card={toGainedCard(card)} index={i} onTap={setZoomed} />
              : <LockedCard
                  key={card.id}
                  card={card}
                  index={i}
                  deckB={!isAdult}
                  onTap={isAdult ? () => onNavigate(getUnlockScreen(card)) : undefined}
                />;
          })}
        </div>
      </motion.div>

      {/* Zoom R3F overlay */}
      <AnimatePresence>
        {zoomed && <ZoomOverlay card={zoomed} onClose={() => setZoomed(null)} />}
      </AnimatePresence>

      {/* Flip reveal overlay — nouvelles cartes débloquées */}
      <AnimatePresence>
        {showReveal && revealCards.length > 0 && (
          <FlipRevealOverlay
            cards={revealCards}
            onDone={() => {
              clearPending();
              setShowReveal(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
