import { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
  PanResponder, Animated as RNAnimated,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import type { CollectorCard } from '@ouiclair/core';
import type { ThemeCategory } from '@ouiclair/core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.floor(SCREEN_WIDTH * 0.80);
const CARD_HEIGHT = Math.floor(CARD_WIDTH * 1.5);

// ─── Ghost deck stack ─────────────────────────────────────────────────────────

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
        const ty = isAnimating ? depth * 2.5 : depth * 5;
        const sc = isAnimating ? 1 - depth * 0.015 : 1 - depth * 0.03;
        return (
          <View
            key={i}
            style={[
              styles.stackLayer,
              {
                transform: [{ translateY: ty }, { scaleX: sc }, { scaleY: sc }],
                backgroundColor: gradient,
                zIndex: -depth,
                opacity: 1 - depth * 0.22,
              },
            ]}
          />
        );
      })}
    </>
  );
}

// ─── PlayingCard ──────────────────────────────────────────────────────────────

export interface PlayingCardProps {
  card: CollectorCard;
  cat: ThemeCategory;
  isRevealed: boolean;
  isAnimating: boolean;
  deckRemaining: number;
  onDraw: () => void;
}

export function PlayingCard({
  card,
  cat,
  isRevealed,
  isAnimating,
  deckRemaining,
  onDraw,
}: PlayingCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [hideAll, setHideAll] = useState(false);

  const dragXAnim = useRef(new RNAnimated.Value(0)).current;
  const flipRotation = useSharedValue(0);

  // Nudge animation on first card — teaches the swipe gesture
  const hasNudged = useRef(false);
  useEffect(() => {
    if (hasNudged.current) return;
    hasNudged.current = true;
    const t = setTimeout(() => {
      RNAnimated.sequence([
        RNAnimated.timing(dragXAnim, { toValue: -20, duration: 200, useNativeDriver: true }),
        RNAnimated.timing(dragXAnim, { toValue: 15, duration: 200, useNativeDriver: true }),
        RNAnimated.timing(dragXAnim, { toValue: -8, duration: 150, useNativeDriver: true }),
        RNAnimated.timing(dragXAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }, 950);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset on card change
  useEffect(() => {
    setIsExiting(false);
    setHideAll(false);
    dragXAnim.setValue(0);
    flipRotation.value = 0;
  }, [card.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Flip animation when card is revealed
  useEffect(() => {
    if (isRevealed) {
      flipRotation.value = withTiming(1, {
        duration: 520,
        easing: Easing.bezier(0.22, 0.61, 0.36, 1),
      });
    } else {
      flipRotation.value = withTiming(0, { duration: 300 });
    }
  }, [isRevealed]); // eslint-disable-line react-hooks/exhaustive-deps

  const canDrag = !isAnimating && !isExiting;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => canDrag,
      onMoveShouldSetPanResponder: (_, gs) => canDrag && Math.abs(gs.dx) > 5,
      onPanResponderMove: (_, gs) => {
        if (!canDrag) return;
        dragXAnim.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (!canDrag) return;
        const shouldSwipe = Math.abs(gs.dx) > 90 || Math.abs(gs.vx) > 0.35;
        if (!shouldSwipe) {
          RNAnimated.spring(dragXAnim, {
            toValue: 0,
            useNativeDriver: true,
            stiffness: 300,
            damping: 25,
          }).start();
          return;
        }
        const dir = gs.dx > 0 ? 1 : -1;
        setIsExiting(true);
        RNAnimated.timing(dragXAnim, {
          toValue: dir * 500,
          duration: 280,
          useNativeDriver: true,
        }).start(() => {
          setHideAll(true);
          onDraw();
        });
      },
    }),
  ).current;

  const backFaceStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flipRotation.value, [0, 1], [0, 180])}deg` },
    ],
    backfaceVisibility: 'hidden' as const,
    opacity: flipRotation.value < 0.5 ? 1 : 0,
  }));

  const frontFaceStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flipRotation.value, [0, 1], [180, 360])}deg` },
    ],
    backfaceVisibility: 'hidden' as const,
    opacity: flipRotation.value >= 0.5 ? 1 : 0,
  }));

  const depth = card.depth;

  if (hideAll) return null;

  return (
    <View style={[styles.root, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      <DeckStack remaining={deckRemaining} gradient={cat.gradient} isAnimating={isAnimating} />

      <RNAnimated.View
        {...panResponder.panHandlers}
        style={[
          styles.dragWrapper,
          { width: CARD_WIDTH, height: CARD_HEIGHT },
          { transform: [{ translateX: dragXAnim }] },
        ]}
      >
        <View style={{ width: '100%', height: '100%', position: 'relative' }}>
          {/* ── DOS ──────────────────────────────────────────── */}
          <Animated.View
            style={[
              styles.cardSide,
              { backgroundColor: '#0c0920', borderColor: cat.border + '44' },
              backFaceStyle,
            ]}
          >
            <View style={[StyleSheet.absoluteFillObject, styles.dotTexture]} />
            <Text style={styles.backLabel}>{cat.name}</Text>
          </Animated.View>

          {/* ── FACE ─────────────────────────────────────────── */}
          <Animated.View
            style={[
              styles.cardSide,
              styles.cardFront,
              { backgroundColor: '#0c0a16', borderColor: cat.border + '55' },
              frontFaceStyle,
            ]}
          >
            <View style={[styles.stripeTop, { backgroundColor: cat.gradient }]} />
            <View style={styles.cardContent}>
              <View style={[styles.categoryBadge, { backgroundColor: cat.gradient }]}>
                <Text style={styles.categoryBadgeLabel}>{cat.name}</Text>
              </View>
              <Text style={styles.cardText} numberOfLines={6}>{card.text}</Text>
              {depth > 1 && (
                <View style={styles.depthDots}>
                  {[1, 2, 3].map((d) => (
                    <View
                      key={d}
                      style={[
                        styles.depthDot,
                        { backgroundColor: d <= depth ? cat.border : 'rgba(255,255,255,0.15)' },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
            <View style={[styles.stripeBottom, { backgroundColor: cat.gradient }]} />
            {card.deck !== 'A' && (
              <Text style={styles.deckBadge}>✦</Text>
            )}
          </Animated.View>
        </View>
      </RNAnimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    alignSelf: 'center',
  },
  stackLayer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 14,
  },
  dragWrapper: {
    position: 'absolute',
    top: 0, left: 0,
  },
  cardSide: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFront: {
    // shown when flipped
  },
  dotTexture: {
    opacity: 0.18,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  backLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  stripeTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 4,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  stripeBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 4,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  categoryBadgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },
  depthDots: {
    flexDirection: 'row',
    gap: 5,
  },
  depthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  deckBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
});
