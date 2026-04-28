'use client';

import { useState, useEffect } from 'react';
import { DURATION, EASING, STAGGER } from '../../constants/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, X } from 'lucide-react';
import { useTranslation } from '../../i18n';
import type { GainedCard } from '../../lib/computeGainedCards';
import { CollectorCardFace } from './CollectorCardFace';

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

export function FlipRevealOverlay({ cards, onDone }: FlipRevealOverlayProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [focusedCard, setFocusedCard] = useState<GainedCard | null>(null);

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
          transition={{ duration: DURATION.normal, ease: EASING.standard }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5"
        >
          {pageCards.map((item, itemIndex) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: itemIndex * STAGGER.item, duration: DURATION.staggerItem }}
              style={{ width: 118, height: 177, position: 'relative' }}
            >
              <button
                type="button"
                aria-label={item.text}
                onClick={() => setFocusedCard(item)}
                style={{ position: 'absolute', inset: 0, border: 0, padding: 0, background: 'transparent' }}
              >
                <CollectorCardFace card={item} rarityLabel={getRarityLabel(item, t)} size="compact" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div style={{ perspective: '900px' }}>
          <motion.div
            key={`card-${index}`}
            initial={{ rotateY: 0, scale: 0.85 }}
            animate={{ rotateY: flipped ? 180 : 0, scale: 1 }}
            transition={{ duration: DURATION.cardReveal, ease: EASING.standard }}
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

            <CollectorCardFace card={card} rarityLabel={rarityLabel} size="full" flippedFace />
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

      <AnimatePresence>
        {focusedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 grid place-items-center px-6"
            style={{ background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(8px)' }}
            onClick={() => setFocusedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.78, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.82, y: 18 }}
              transition={{ duration: DURATION.fast }}
              style={{ width: 220, height: 330, position: 'relative' }}
              onClick={(event) => event.stopPropagation()}
            >
              <CollectorCardFace
                card={focusedCard}
                rarityLabel={getRarityLabel(focusedCard, t)}
                size="full"
              />
              <button
                type="button"
                onClick={() => setFocusedCard(null)}
                className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.94)', color: '#111827' }}
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
