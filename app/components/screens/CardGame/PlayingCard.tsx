'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, animate, useAnimation, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { useSpring, animated, to } from '@react-spring/web';
import { useTheme } from '../../../context/ThemeContext';
import { useNormalizedPointer } from './hooks/useNormalizedPointer';
import type { CardData } from '../../../data';

// Depth per deck — used for foil intensity
const DECK_DEPTH: Record<number, 1 | 2 | 3> = { 1: 1, 4: 1, 2: 2, 3: 2, 5: 3, 6: 3 };

type Cat = { name: string; emoji: string; gradient: string; border: string };

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
            animate={{
              y: isAnimating ? depth * 2.5 : depth * 5,
              scale: isAnimating ? 1 - depth * 0.015 : 1 - depth * 0.03,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 28,
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
  card: CardData;
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
  const { colors } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  // useNormalizedPointer still drives the foil gradient (Framer MotionValues)
  const { x: tiltX, y: tiltY } = useNormalizedPointer(cardRef);
  const controls = useAnimation();
  const dragX = useMotionValue(0);
  const [isExiting, setIsExiting] = useState(false);
  const [hideAll, setHideAll] = useState(false);
  const hasNudged = useRef(false);

  // React Spring physical spring for tilt — tension:400/friction:30 feels like a card held in hand
  const [tiltSpring, tiltApi] = useSpring(() => ({
    rotX: 0,
    rotY: 0,
    config: { tension: 400, friction: 30 },
  }));

  // Raw pointer handlers feed spring directly (no rAF layer — spring handles smoothing)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      tiltApi.start({ rotX: ny * -6, rotY: nx * 6 });
    };
    const onLeave = () => tiltApi.start({ rotX: 0, rotY: 0 });
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [tiltApi]);

  // Reset on new card
  useEffect(() => {
    setIsExiting(false);
    setHideAll(false);
    dragX.set(0);
    controls.set({ rotate: 0, opacity: 1 });
    tiltApi.set({ rotX: 0, rotY: 0 });
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

  // Foil: soft pastel rainbow with screen blend — works on light AND dark bgCard
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

  const depth = DECK_DEPTH[card.deck] ?? 1;
  // screen blend on a near-black background adds soft colour, not a void
  const foilTargetOpacity = themeId === 'youth' ? 0 : depth === 3 ? 0.18 : depth === 2 ? 0.12 : 0;

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
      style={{
        maxWidth: 290,
        width: '100%',
        aspectRatio: '2 / 3',
        margin: '0 auto',
        position: 'relative',
        userSelect: 'none',
        opacity: hideAll ? 0 : undefined,
        pointerEvents: hideAll ? 'none' : undefined,
      }}
    >
      <DeckStack remaining={deckRemaining} gradient={cat.gradient} isAnimating={isAnimating} />

      {/* Drag wrapper */}
      <motion.div
        ref={cardRef}
        drag={canDrag ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileDrag={{ cursor: 'grabbing' }}
        style={{
          x: dragX,
          rotate: dragRotate,
          opacity: dragOpacity,
          position: 'absolute',
          inset: 0,
          willChange: 'transform',
          cursor: canDrag ? 'grab' : 'default',
        }}
      >
        {/* Perspective isolated from drag — keeps swipe exit flat 2D */}
        <div style={{ perspective: '1200px', width: '100%', height: '100%' }}>
          {/* Tilt wrapper — React Spring physical spring for zero-latency response */}
          <animated.div
            style={{
              transform: to(
                [tiltSpring.rotX, tiltSpring.rotY],
                (rx, ry) => `rotateX(${rx}deg) rotateY(${ry}deg)`,
              ),
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d' as never,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden' as never,
              width: '100%',
              height: '100%',
              willChange: 'transform',
            }}
          >
            {/* Flip container */}
            <motion.div
              animate={{ rotateY: isRevealed ? 180 : 0 }}
              transition={{ duration: 0.52, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              {/* ── DOS ──────────────────────────────────────── */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 28,
                  background: cat.gradient,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  overflow: 'hidden',
                  boxShadow: `0 20px 56px ${cat.border}44, 0 4px 16px rgba(0,0,0,0.12)`,
                }}
              >
                {/* Dot texture */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.5px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                {/* Center content */}
                <span style={{ fontSize: 56, position: 'relative', zIndex: 1, lineHeight: 1 }}>
                  {cat.emoji}
                </span>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    position: 'relative',
                    zIndex: 1,
                    margin: 0,
                  }}
                >
                  {cat.name}
                </p>
              </div>

              {/* ── FACE ─────────────────────────────────────── */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 28,
                  background: colors.bgCard,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 20px 56px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.07)',
                  border: `1.5px solid ${colors.border}`,
                }}
              >
                {/* Top stripe */}
                <div style={{ height: 8, background: cat.gradient, flexShrink: 0 }} />

                {/* Card content */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '20px 22px',
                    gap: 14,
                  }}
                >
                  {/* Category label */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      alignSelf: 'flex-start',
                      padding: '4px 10px',
                      borderRadius: 20,
                      background: cat.gradient,
                    }}
                  >
                    <span style={{ fontSize: 12 }}>{cat.emoji}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '0.06em',
                        textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    >
                      {cat.name}
                    </span>
                  </div>

                  {/* Card text — left-aligned for readability */}
                  <p
                    style={{
                      color: colors.textPrimary,
                      fontSize: 15,
                      fontWeight: 500,
                      lineHeight: 1.65,
                      margin: 0,
                      textAlign: 'left',
                    }}
                  >
                    {card.text}
                  </p>

                  {/* Depth indicator */}
                  {depth > 1 && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3].map((d) => (
                        <div
                          key={d}
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: 3,
                            background: d <= depth ? cat.border : `${colors.border}`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom stripe */}
                <div style={{ height: 5, background: cat.gradient, flexShrink: 0 }} />

                {card.ageGate === 'adult' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      right: 14,
                      fontSize: 9,
                      fontWeight: 900,
                      color: colors.textMuted,
                      userSelect: 'none',
                      opacity: 0.4,
                    }}
                  >
                    ✦
                  </span>
                )}

                {/* Foil — screen blend works on any bgCard colour */}
                <motion.div
                  animate={{ opacity: isRevealed ? foilTargetOpacity : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: foilBg,
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </motion.div>
          </animated.div>
        </div>
      </motion.div>
    </div>
  );
}
