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

export function FlipRevealOverlay({ cards, onDone }: FlipRevealOverlayProps) {
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
    ? (card.rarity === 'unique' ? t('hallOfCards.rarityUnique') : t('hallOfCards.rarityRare'))
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
