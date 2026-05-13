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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/94 backdrop-blur-[14px]"
    >
      {/* Bouton fermer */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onDone}
        className="absolute top-[52px] right-5 w-9 h-9 rounded-[18px] bg-white/[0.08] border border-white/[0.14] flex items-center justify-center z-10 cursor-pointer"
        whileTap={{ scale: 0.9 }}
      >
        <X size={16} color="rgba(255,255,255,0.7)" />
      </motion.button>

      {/* Header */}
      <motion.div
        key={`header-${index}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-1"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-white/40">
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
              className="w-[118px] h-[177px] relative"
            >
              <button
                type="button"
                aria-label={item.text}
                onClick={() => setFocusedCard(item)}
                className="absolute inset-0 border-0 p-0 bg-transparent"
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
            className="w-[200px] h-[300px] relative [transform-style:preserve-3d]"
          >
            {/* Back face */}
            <div className="absolute inset-0 rounded-[20px] [backface-visibility:hidden] bg-[linear-gradient(135deg,#0f0a1e_0%,#1a1035_100%)] border-[1.5px] border-white/[0.08] flex items-center justify-center">
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
            className="text-xs font-semibold text-white/35"
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
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-[linear-gradient(135deg,#7c3aed,#a855f7)] text-white shadow-[0_4px_20px_rgba(124,58,237,0.45)]"
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
            className="fixed inset-0 z-10 grid place-items-center px-6 bg-black/[0.62] backdrop-blur-[8px]"
            onClick={() => setFocusedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.78, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.82, y: 18 }}
              transition={{ duration: DURATION.fast }}
              className="w-[220px] h-[330px] relative"
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
                className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-white/94 text-[#111827]"
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
