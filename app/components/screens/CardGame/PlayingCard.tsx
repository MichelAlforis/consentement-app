'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useNormalizedPointer } from './hooks/useNormalizedPointer';
import type { CardData } from '../../../data';

// Depth per deck: decks 5 & 6 are the most intimate (depth 3)
const DECK_DEPTH: Record<number, 1 | 2 | 3> = { 1: 1, 4: 1, 2: 2, 3: 2, 5: 3, 6: 3 };

type Cat = { name: string; emoji: string; gradient: string; border: string };

// ─── Ghost stack behind the active card ──────────────────────────────────────

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
        const depth = i + 1; // 1 = closest, 2 = farthest
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
              opacity: 1 - depth * 0.2,
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
  const { x: tiltX, y: tiltY } = useNormalizedPointer(cardRef);
  const controls = useAnimation();
  const dragX = useMotionValue(0);
  const [isExiting, setIsExiting] = useState(false);

  // Reset & snap in when a new card is drawn
  useEffect(() => {
    setIsExiting(false);
    dragX.set(0);
    controls.set({ rotate: 0, opacity: 1 });
  }, [card.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const canDrag = !isAnimating && !isExiting;
  const dragRotate = useTransform(dragX, [-200, 200], [-12, 12]);
  const dragOpacity = useTransform(dragX, [-120, 0, 120], [0.4, 1, 0.4]);

  // Tilt from pointer position
  const tiltRotateX = useTransform(tiltY, [-1, 1], [12, -12]);
  const tiltRotateY = useTransform(tiltX, [-1, 1], [-12, 12]);

  // Foil holographic gradient follows the pointer
  const hue = useTransform(tiltX, [-1, 1], [0, 360]);
  const foilBg = useTransform(
    [tiltX, tiltY, hue] as MotionValue<number>[],
    ([xv, yv, h]: number[]) =>
      `radial-gradient(ellipse at ${(xv + 1) * 50}% ${(yv + 1) * 50}%, hsl(${h}, 100%, 70%) 0%, hsl(${h + 60}, 100%, 60%) 25%, hsl(${h + 120}, 100%, 65%) 50%, transparent 70%)`,
  );

  const depth = DECK_DEPTH[card.deck] ?? 1;
  // Youth theme: foil disabled (too adult). Depth 1 decks: no foil.
  const foilTargetOpacity = themeId === 'youth' ? 0 : depth === 3 ? 0.45 : depth === 2 ? 0.28 : 0;

  const handleDragEnd = async (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const shouldSwipe = Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 350;
    if (!shouldSwipe || !canDrag) {
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: 'spring', stiffness: 300, damping: 25 },
      });
      return;
    }
    setIsExiting(true);
    const dir = info.offset.x > 0 ? 1 : -1;
    await controls.start({
      x: dir * 500,
      rotate: dir * 18,
      opacity: 0,
      transition: { duration: 0.28, ease: 'easeIn' },
    });
    onDraw();
  };

  return (
    // Sizing container — DeckStack is positioned relative to this
    <div
      style={{
        maxWidth: 290,
        width: '100%',
        aspectRatio: '2 / 3',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <DeckStack remaining={deckRemaining} gradient={cat.gradient} isAnimating={isAnimating} />

      {/* Drag wrapper — handles swipe + visual feedback */}
      <motion.div
        ref={cardRef}
        drag={canDrag ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          x: dragX,
          rotate: dragRotate,
          opacity: dragOpacity,
          position: 'absolute',
          inset: 0,
          willChange: 'transform',
        }}
      >
        {/* Perspective context — isolated so drag translate stays flat 2D */}
        <div style={{ perspective: '1200px', width: '100%', height: '100%' }}>
          {/* Tilt wrapper — rotates with pointer position */}
          <motion.div
            style={{
              rotateX: tiltRotateX,
              rotateY: tiltRotateY,
              transformStyle: 'preserve-3d',
              width: '100%',
              height: '100%',
              willChange: 'transform',
            }}
          >
            {/* Flip container — rotates 0→180 on reveal */}
            <motion.div
              animate={{ rotateY: isRevealed ? 180 : 0 }}
              transition={{ duration: 0.52, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                transformStyle: 'preserve-3d',
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              {/* ── DOS ─────────────────────────────────────── */}
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
                  gap: 12,
                  overflow: 'hidden',
                  boxShadow: `0 24px 64px ${cat.border}55, 0 6px 20px rgba(0,0,0,0.15)`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.22) 2px, transparent 2px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    fontSize: 20,
                    color: 'rgba(255,255,255,0.35)',
                    fontWeight: 900,
                  }}
                >
                  {cat.emoji}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    fontSize: 20,
                    color: 'rgba(255,255,255,0.35)',
                    fontWeight: 900,
                    transform: 'rotate(180deg)',
                  }}
                >
                  {cat.emoji}
                </span>
                <span style={{ fontSize: 72, position: 'relative', zIndex: 1 }}>{cat.emoji}</span>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  ← Glisser →
                </p>
              </div>

              {/* ── FACE ────────────────────────────────────── */}
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
                  boxShadow:
                    '0 24px 64px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.08)',
                  border: `1.5px solid ${colors.border}`,
                }}
              >
                {/* Top gradient stripe */}
                <div style={{ height: 10, background: cat.gradient, flexShrink: 0 }} />

                {/* Content */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 28px',
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      background: cat.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{cat.emoji}</span>
                  </div>
                  <p
                    style={{
                      color: colors.textPrimary,
                      fontSize: 15,
                      fontWeight: 600,
                      textAlign: 'center',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {card.text}
                  </p>
                  {depth > 1 && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3].map((d) => (
                        <div
                          key={d}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            background: d <= depth ? cat.border : 'rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom gradient stripe */}
                <div style={{ height: 6, background: cat.gradient, flexShrink: 0 }} />

                {card.ageGate === 'adult' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      right: 16,
                      fontSize: 10,
                      fontWeight: 900,
                      color: '#d1d5db',
                      userSelect: 'none',
                    }}
                  >
                    ✦
                  </span>
                )}

                {/* Foil holographic overlay */}
                <motion.div
                  animate={{ opacity: isRevealed ? foilTargetOpacity : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: foilBg,
                    mixBlendMode: 'color-dodge',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
