'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { DynamicIcon } from '../../utils/iconFromName';
import { useTranslation } from '../../i18n';
import type { GainedCard } from '../../lib/computeGainedCards';

interface FlipRevealOverlayProps {
  cards: GainedCard[];
  onDone: () => void;
}

const CARDS_PER_PAGE = 8;

function getRarityLabel(card: GainedCard, t: (key: string) => string) {
  if (card.rarity === 'unique') return t('hallOfCards.rarityUnique');
  if (card.rarity === 'rare') return t('hallOfCards.rarityRare');
  return null;
}

function truncateCardText(text: string, max = 86) {
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function RevealedCardFace({
  card,
  rarityLabel,
  compact = false,
}: {
  card: GainedCard;
  rarityLabel: string | null;
  compact?: boolean;
}) {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: compact ? 14 : 20,
      backfaceVisibility: 'hidden',
      transform: compact ? undefined : 'rotateY(180deg)',
      background: card.gradient,
      boxShadow: `0 8px 32px ${card.border}66`,
      display: 'grid',
      gridTemplateRows: compact ? '28px 1fr 82px' : '40px 1fr 112px',
      justifyItems: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) ${compact ? 1 : 1.5}px, transparent ${compact ? 1 : 1.5}px)`,
        backgroundSize: compact ? '9px 9px' : '12px 12px',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.18) 100%)',
      }} />
      <span style={{
        position: 'absolute',
        top: compact ? 8 : 12,
        left: compact ? 8 : 12,
        width: compact ? 20 : 24,
        height: compact ? 20 : 24,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
      }}>
        <DynamicIcon name={card.iconName} size={compact ? 12 : 14} color="rgba(255,255,255,0.34)" />
      </span>
      {rarityLabel && (
        <div style={{
          position: 'absolute', top: compact ? 8 : 12, right: compact ? 8 : 12,
          borderRadius: 6, padding: compact ? '2px 5px' : '3px 6px',
          background: card.rarity === 'unique'
            ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
            : 'linear-gradient(135deg, #7c3aed, #a855f7)',
        }}>
          <span style={{ fontSize: compact ? 6 : 8, fontWeight: 900, color: 'white', letterSpacing: 1 }}>
            {rarityLabel}
          </span>
        </div>
      )}
      <span style={{
        position: 'relative',
        zIndex: 1,
        gridRow: '2',
        alignSelf: 'end',
        width: compact ? 38 : 54,
        height: compact ? 38 : 54,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0,0,0,0.13)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.18)',
      }}>
        <DynamicIcon name={card.iconName} size={compact ? 24 : 34} color="white" />
      </span>
      <p style={{
        gridRow: '3',
        alignSelf: 'start',
        color: 'white',
        fontWeight: 800,
        fontSize: compact ? 9 : 13,
        textAlign: 'center',
        lineHeight: compact ? 1.16 : 1.22,
        padding: compact ? '8px 10px 0' : '12px 18px 0',
        margin: 0,
        position: 'relative',
        zIndex: 1,
        textShadow: '0 2px 8px rgba(0,0,0,0.50)',
        overflow: 'hidden',
        overflowWrap: 'break-word',
        hyphens: 'auto',
      }}>
        {compact ? truncateCardText(card.text) : card.text}
      </p>
    </div>
  );
}

export function FlipRevealOverlay({ cards, onDone }: FlipRevealOverlayProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  const total = cards.length;
  const batchMode = total > 1;
  const totalPages = Math.ceil(total / CARDS_PER_PAGE);
  const pageStart = page * CARDS_PER_PAGE;
  const pageCards = cards.slice(pageStart, pageStart + CARDS_PER_PAGE);
  const pageEnd = pageStart + pageCards.length;
  const isLastPage = page === totalPages - 1;

  useEffect(() => {
    if (batchMode) return;
    setFlipped(false);
    const id = setTimeout(() => setFlipped(true), 900);
    return () => clearTimeout(id);
  }, [batchMode, index]);

  const handleNext = () => {
    if (batchMode) {
      if (isLastPage) {
        onDone();
      } else {
        setPage((current) => current + 1);
      }
      return;
    }

    if (index === cards.length - 1) {
      onDone();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const rarityLabel = getRarityLabel(card, t);

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
          {batchMode
            ? `${pageStart + 1}-${pageEnd} / ${total}`
            : t('flipReveal.progress', { current: String(index + 1), total: String(total) })}
        </p>
        <h2 className="text-xl font-black text-white">{title}</h2>
      </motion.div>

      {batchMode ? (
        <motion.div
          key={`page-${page}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5"
        >
          {pageCards.map((item, itemIndex) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: itemIndex * 0.035, duration: 0.25 }}
              style={{ width: 118, height: 177, position: 'relative' }}
            >
              <RevealedCardFace
                card={item}
                rarityLabel={getRarityLabel(item, t)}
                compact
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
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

            <RevealedCardFace card={card} rarityLabel={rarityLabel} />
          </motion.div>
        </div>
      )}

      {/* Hint before flip */}
      <AnimatePresence>
        {!batchMode && !flipped && (
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
        {(batchMode || flipped) && (
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
            {batchMode ? (isLastPage ? t('flipReveal.done') : 'Cartes suivantes') : t('flipReveal.done')}
            <ChevronRight size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
