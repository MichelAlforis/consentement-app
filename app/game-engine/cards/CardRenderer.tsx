'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import type { Card, CardConfig } from './types';
import { DynamicIcon } from '../../utils/iconFromName';
import { DURATION, EASING } from '../../constants/motion';
import { RADIUS } from '../../constants/tokens';
import styles from './CardRenderer.module.css';

// ─── Pile de cartes fantômes derrière la carte active ────────────────────────

function DeckStack({ remaining, gradient, border }: { remaining: number; gradient: string; border: string }) {
  const layers = Math.min(remaining, 3);
  return (
    <>
      {Array.from({ length: layers }).map((_, i) => {
        const depth = layers - i; // 3 = plus loin, 1 = juste derrière
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: RADIUS.card,
              background: gradient,
              border: `1.5px solid ${border}`,
              transform: `translateY(${depth * 5}px) scale(${1 - depth * 0.03})`,
              zIndex: -depth,
              opacity: 1 - depth * 0.2,
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            }}
          />
        );
      })}
    </>
  );
}

// ─── CardRenderer ─────────────────────────────────────────────────────────────

export interface CardRendererProps {
  card: Card | null;
  deckConfig: CardConfig;
  /** Nombre de cartes restantes dans le paquet — pour afficher la pile */
  remaining?: number;
  onReveal?: () => void;
  /** Appelé quand le joueur swipe pour piocher la prochaine carte */
  onDraw?: () => void;
}

export function CardRenderer({ card, deckConfig, remaining = 0, onReveal, onDraw }: CardRendererProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const dragOpacity = useTransform(x, [-120, 0, 120], [0.4, 1, 0.4]);
  const dragRotate = useTransform(x, [-200, 200], [-12, 12]);

  // Revenir au dos quand une nouvelle carte est tirée
  useEffect(() => {
    setIsRevealed(false);
    setIsExiting(false);
    controls.set({ x: 0, rotate: 0, opacity: 1 });
  }, [card?.id, controls]);

  const handleReveal = () => {
    if (isRevealed || !card || isExiting) return;
    setIsRevealed(true);
    onReveal?.();
  };

  const handleDragEnd = async (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const shouldSwipe = Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 350;
    if (!shouldSwipe || !onDraw || isExiting) {
      controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
      return;
    }
    setIsExiting(true);
    const direction = info.offset.x > 0 ? 1 : -1;
    await controls.start({
      x: direction * 500,
      rotate: direction * 18,
      opacity: 0,
      transition: { duration: DURATION.normal, ease: 'easeIn' },
    });
    onDraw();
  };

  const canSwipe = !!onDraw && !isExiting;

  return (
    <div className={styles.container}>
      {/* Pile fantôme */}
      <DeckStack
        remaining={remaining}
        gradient={deckConfig.backGradient}
        border={deckConfig.color + '44'}
      />

      {/* Carte active */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card?.id ?? 'empty'}
          drag={canSwipe ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{ x, rotate: dragRotate, opacity: dragOpacity }}
          whileTap={canSwipe ? { cursor: 'grabbing' } : {}}
          onClick={handleReveal}
          className="absolute inset-0"
          role="button"
          aria-label={isRevealed ? 'Carte révélée' : 'Appuyer pour révéler'}
        >
          {/* Perspective wrapper — le flip 3D est ici */}
          <div className={styles.perspective}>
            <motion.div
              animate={{ rotateY: isRevealed ? 180 : 0 }}
              transition={{ duration: DURATION.cardFlipCommon, ease: EASING.cardFlip }}
              className={styles.flipper}
              style={{ cursor: isRevealed ? 'default' : 'pointer' }}
            >
              {/* Dos de la carte */}
              <div
                className={styles.face}
                style={{
                  borderRadius: RADIUS.card,
                  background: deckConfig.backGradient,
                  gap: 8,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                }}
              >
                <DynamicIcon name={deckConfig.iconName} size={48} color="rgba(255,255,255,0.85)" />
                <span style={{
                  fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)',
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                }}>
                  {deckConfig.label}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: 4 }}>
                  {card && (
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                      Appuyer pour révéler
                    </span>
                  )}
                  {canSwipe && (
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                      ← Glisser pour passer →
                    </span>
                  )}
                </div>
              </div>

              {/* Face de la carte */}
              <div
                className={`${styles.face} ${styles.faceFront}`}
                style={{
                  borderRadius: RADIUS.card,
                  background: deckConfig.gradient,
                  gap: 12, padding: 24,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                }}
              >
                <DynamicIcon name={deckConfig.iconName} size={32} color="rgba(255,255,255,0.85)" />
                <p style={{
                  fontSize: 15, fontWeight: 600, color: '#fff',
                  textAlign: 'center', lineHeight: 1.55, margin: 0,
                }}>
                  {card?.text ?? ''}
                </p>
                {(card?.depth != null) && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    {[1, 2, 3].map(d => (
                      <div key={d} style={{
                        width: 6, height: 6, borderRadius: RADIUS.dot,
                        background: d <= (card.depth ?? 0)
                          ? deckConfig.color
                          : 'rgba(255,255,255,0.2)',
                      }} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Badge compteur cartes restantes */}
      {remaining > 0 && (
        <div
          className={styles.badge}
          style={{ background: deckConfig.color, borderRadius: RADIUS.badge }}
        >
          {remaining}
        </div>
      )}
    </div>
  );
}
