'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { useNormalizedPointer } from './CardGame/hooks/useNormalizedPointer';
import { Lock, X, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUnlockStore } from '../../stores/unlockStore';
import { useRevealStore } from '../../stores/revealStore';
import { collectorCards, THEME_CATEGORIES } from '../../data/cards-collector';
import type { CollectorCard } from '../../data/cards-collector';
import { CollectorCardCanvas } from '../../game-engine/cards/CollectorCardCanvas';
import type { GainedCard } from '../../lib/computeGainedCards';
import type { Screen } from '../../types';
import { useTranslation } from '../../i18n';
import { FlipRevealOverlay } from '../ui/FlipRevealOverlay';
import { CollectorCardFace } from '../ui/CollectorCardFace';

function getUnlockScreen(card: CollectorCard): Screen {
  return card.depth === 3 ? 'jeu-oie' : 'jeu-cartes';
}

function toGainedCard(card: CollectorCard): GainedCard {
  return {
    id: card.id,
    text: card.text,
    theme: card.theme,
    themeName: THEME_CATEGORIES[card.theme].name,
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
  const { t } = useTranslation();
  const theme = useTheme();
  const ref = useRef<HTMLButtonElement>(null);
  const { x, y } = useNormalizedPointer(ref);

  const tiltX = useSpring(useTransform(y, [-1, 1], [5, -5]), { stiffness: 400, damping: 30 });
  const tiltY = useSpring(useTransform(x, [-1, 1], [-5, 5]), { stiffness: 400, damping: 30 });

  const foilGX = useTransform(x, [-1, 1], [15, 85]);
  const foilGY = useTransform(y, [-1, 1], [15, 85]);
  const foilHue = useTransform(x, [-1, 1], [200, 340]);
  const foilBg = useMotionTemplate`radial-gradient(circle at ${foilGX}% ${foilGY}%, hsl(${foilHue}, 55%, 78%), transparent 65%)`;

  const foilOpacity =
    theme.id === 'youth' ? 0 :
    card.rarity === 'unique' ? 0.16 :
    card.rarity === 'rare' ? 0.10 : 0;

  const rarityLabel = card.rarity === 'common'
    ? null
    : card.rarity === 'unique'
      ? t('hallOfCards.rarityUnique')
      : t('hallOfCards.rarityRare');

  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileTap={{ scale: 0.93 }}
      onClick={() => onTap(card)}
      className="relative rounded-2xl shadow-sm"
      style={{
        aspectRatio: '2 / 3',
        boxShadow: `0 4px 16px ${card.border}55`,
        perspective: '500px',
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          rotateX: tiltX,
          rotateY: tiltY,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <CollectorCardFace card={card} rarityLabel={rarityLabel} size="mini" />
        {foilOpacity > 0 && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              mixBlendMode: 'screen',
              opacity: foilOpacity,
              background: foilBg,
              pointerEvents: 'none',
            }}
          />
        )}
      </motion.div>
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
  const { t } = useTranslation();
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
        {deckB ? t('hallOfCards.appAdulte') : card.unlockedBy.replace(/-/g, ' ')}
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
  const { t } = useTranslation();
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
  const deckM = collectorCards.filter((c) => c.deck === 'M');

  const primaryDeck = isAdult ? deckA : deckM;
  const primaryLabel = isAdult ? t('hallOfCards.deckALabel') : t('hallOfCards.deckMLabel');
  const totalOwned = primaryDeck.filter((c) => ownedIds.has(c.id)).length;

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
            {t('hallOfCards.title')}
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
            {t('hallOfCards.subtitle', { owned: String(totalOwned), total: String(primaryDeck.length) })}
          </p>
        </div>

        {/* Deck principal (A pour adultes, M pour mineurs) */}
        <p className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: colors.textMuted }}>
          {primaryLabel}
        </p>
        <div className="grid grid-cols-3 gap-2.5 mb-8">
          {primaryDeck.map((card, i) =>
            ownedIds.has(card.id)
              ? <AcquiredCard key={card.id} card={toGainedCard(card)} index={i} onTap={setZoomed} />
              : <LockedCard key={card.id} card={card} index={i} onTap={() => onNavigate(getUnlockScreen(card))} />
          )}
        </div>

        {/* Deck B — adultes seulement */}
        {isAdult && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: colors.textMuted }}>
              {t('hallOfCards.deckBLabel')}
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {deckB.map((card, i) => {
                const owned = ownedIds.has(card.id);
                return owned
                  ? <AcquiredCard key={card.id} card={toGainedCard(card)} index={i} onTap={setZoomed} />
                  : <LockedCard
                      key={card.id}
                      card={card}
                      index={i}
                      onTap={() => onNavigate(getUnlockScreen(card))}
                    />;
              })}
            </div>
          </>
        )}
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
