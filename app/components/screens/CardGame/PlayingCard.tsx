'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, animate, useAnimation, useMotionValue, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useNormalizedPointer } from './hooks/useNormalizedPointer';
import type { CollectorCard } from '../../../data/cards-collector';
import { DynamicIcon } from '../../../utils/iconFromName';
import type { IconName } from '../../../utils/iconFromName';
import { BACK_SYMBOL_PATH } from '../../../game-engine/cards/CollectorCardCanvas';
import s from './PlayingCard.module.css';

type Cat = { name: string; iconName: IconName; gradient: string; border: string };

function buildFaceBg(gradient: string): string {
  const match = gradient.match(/#[0-9a-f]{6}/i);
  const c1 = match ? match[0] : '#3b1f85';
  return `linear-gradient(160deg, #0c0a16 0%, ${c1}18 100%)`;
}

// ─── Ghost stack ──────────────────────────────────────────────────────────────

function DeckStack({
  remaining,
  gradient,
  isAnimating,
}: {
  remaining: number;
  gradient: string;
  isAnimating: boolean;
}) {
  const layers = Math.min(remaining, 2);
  if (layers === 0) return null;
  return (
    <>
      {Array.from({ length: layers }).map((_, i) => {
        const depth = i + 1;
        return (
          <motion.div
            key={i}
            className={s.stackLayer}
            animate={{
              y: isAnimating ? depth * 2.5 : depth * 5,
              scale: isAnimating ? 1 - depth * 0.015 : 1 - depth * 0.03,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{
              background: gradient,
              zIndex: -depth,
              opacity: 1 - depth * 0.22,
            }}
          />
        );
      })}
    </>
  );
}

// ─── PlayingCard ──────────────────────────────────────────────────────────────

export interface PlayingCardProps {
  card: CollectorCard;
  cat: Cat;
  isRevealed: boolean;
  isAnimating: boolean;
  deckRemaining: number;
  onDraw: () => void;
  themeId: string;
}

export function PlayingCard({
  card,
  cat,
  isRevealed,
  isAnimating,
  deckRemaining,
  onDraw,
  themeId,
}: PlayingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { x: tiltX, y: tiltY } = useNormalizedPointer(cardRef);
  const controls = useAnimation();
  const dragX = useMotionValue(0);
  const [isExiting, setIsExiting] = useState(false);
  const [hideAll, setHideAll] = useState(false);
  const hasNudged = useRef(false);

  const rawRotateX = useTransform(tiltY, [-1, 1], [6, -6]);
  const rawRotateY = useTransform(tiltX, [-1, 1], [-6, 6]);
  const tiltRotateX = useSpring(rawRotateX, { stiffness: 400, damping: 30 });
  const tiltRotateY = useSpring(rawRotateY, { stiffness: 400, damping: 30 });

  useEffect(() => {
    setIsExiting(false);
    setHideAll(false);
    dragX.set(0);
    controls.set({ rotate: 0, opacity: 1 });
  }, [card.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // One-time swipe nudge — teaches the gesture on the first card
  useEffect(() => {
    if (hasNudged.current) return;
    hasNudged.current = true;
    const t = setTimeout(() => {
      animate(dragX, [0, -20, 15, -8, 0], { duration: 0.9, ease: 'easeInOut' });
    }, 950);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const canDrag = !isAnimating && !isExiting;
  const dragRotate = useTransform(dragX, [-200, 200], [-10, 10]);
  const dragOpacity = useTransform(dragX, [-120, 0, 120], [0.5, 1, 0.5]);

  // Foil: soft pastel rainbow with screen blend
  const hue = useTransform(tiltX, [-1, 1], [0, 360]);
  const foilBg = useTransform(
    [tiltX, tiltY, hue] as MotionValue<number>[],
    ([xv, yv, h]: number[]) =>
      `radial-gradient(ellipse at ${(xv + 1) * 50}% ${(yv + 1) * 50}%,
        hsl(${h}, 55%, 78%) 0%,
        hsl(${h + 60}, 55%, 75%) 35%,
        hsl(${h + 120}, 55%, 78%) 65%,
        transparent 80%)`,
  );

  const depth = card.depth;
  // screen blend on a near-black background adds soft colour, not a void
  const foilTargetOpacity = themeId === 'youth' ? 0 : depth === 3 ? 0.28 : depth === 2 ? 0.18 : 0;

  const handleDragEnd = async (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const shouldSwipe = Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 350;
    if (!shouldSwipe || !canDrag) {
      controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
      return;
    }
    setIsExiting(true);
    const dir = info.offset.x > 0 ? 1 : -1;
    await controls.start({
      x: dir * 500,
      rotate: dir * 15,
      opacity: 0,
      transition: { duration: 0.28, ease: 'easeIn' },
    });
    setHideAll(true);
    onDraw();
  };

  return (
    <div
      className={`${s.root}${hideAll ? ' opacity-0 pointer-events-none' : ''}`}
    >
      <DeckStack remaining={deckRemaining} gradient={cat.gradient} isAnimating={isAnimating} />

      {/* Drag wrapper */}
      <motion.div
        ref={cardRef}
        className={`${s.dragWrapper} ${canDrag ? 'cursor-grab' : 'cursor-default'}`}
        drag={canDrag ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileDrag={{ cursor: 'grabbing' }}
        style={{ x: dragX, rotate: dragRotate, opacity: dragOpacity }}
      >
        {/* Perspective isolated from drag — keeps swipe exit flat 2D */}
        <div className={s.perspective}>
          {/* Tilt wrapper — backfaceVisibility retiré : corrompt le rendu Safari dans un contexte preserve-3d imbriqué */}
          <motion.div
            className={s.tiltWrapper}
            style={{ rotateX: tiltRotateX, rotateY: tiltRotateY }}
          >
            {/* Flip container */}
            <motion.div
              className={s.flipContainer}
              animate={{ rotateY: isRevealed ? 180 : 0 }}
              transition={{ duration: 0.52, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {/* ── DOS ──────────────────────────────────────── */}
              <div
                className={`${s.cardSide} ${s.cardBack}`}
                style={{
                  background: cat.gradient,
                  boxShadow: `0 20px 56px ${cat.border}44, 0 4px 16px rgba(0,0,0,0.12)`,
                }}
              >
                <div className={s.dotTexture} />
                <svg viewBox="0 0 336 1044" className={s.watermark}>
                  <path d={BACK_SYMBOL_PATH} fill="white" fillRule="evenodd" />
                </svg>
                <p className={s.backLabel}>{cat.name}</p>
              </div>

              {/* ── FACE ─────────────────────────────────────── */}
              <div
                className={`${s.cardSide} ${s.cardFront}`}
                style={{
                  background: buildFaceBg(cat.gradient),
                  boxShadow: `0 20px 56px ${cat.border}55, 0 4px 20px rgba(0,0,0,0.40)`,
                }}
              >
                <div className={`${s.stripe} ${s.stripeTop}`} style={{ background: cat.gradient }} />

                <div className={s.cardContent}>
                  <div className={s.categoryBadge} style={{ background: cat.gradient }}>
                    <DynamicIcon name={cat.iconName} size={12} color="white" />
                    <span className={s.categoryBadgeLabel}>{cat.name}</span>
                  </div>

                  <p className={s.cardText}>{card.text}</p>

                  {depth > 1 && (
                    <div className={s.depthDots}>
                      {[1, 2, 3].map((d) => (
                        <div
                          key={d}
                          className={s.depthDot}
                          style={{ background: d <= depth ? cat.border : 'rgba(255,255,255,0.15)' }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className={`${s.stripe} ${s.stripeBottom}`} style={{ background: cat.gradient }} />

                {card.deck !== 'A' && <span className={s.deckBadge}>✦</span>}

                {/* Foil — screen blend works on any bgCard colour */}
                <motion.div
                  className={s.foil}
                  animate={{ opacity: isRevealed ? foilTargetOpacity : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ background: foilBg }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
