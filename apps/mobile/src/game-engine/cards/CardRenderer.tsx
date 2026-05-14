import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import type { Card, CardConfig } from './types';
import { RADIUS } from '@ouiclair/core';

// ─── Pile de cartes fantômes ──────────────────────────────────────────────────

function DeckStack({ remaining, gradient: _gradient, border }: { remaining: number; gradient: string; border: string }) {
  const layers = Math.min(remaining, 3);
  if (layers === 0) return null;
  return (
    <>
      {Array.from({ length: layers }).map((_, i) => {
        const depth = layers - i;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: RADIUS.card,
              // React Native doesn't support CSS gradients natively — use solid border color
              backgroundColor: border + '44',
              borderWidth: 1.5,
              borderColor: border,
              transform: [
                { translateY: depth * 5 },
                { scaleX: 1 - depth * 0.03 },
                { scaleY: 1 - depth * 0.03 },
              ],
              zIndex: -depth,
              opacity: 1 - depth * 0.2,
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
  remaining?: number;
  onReveal?: () => void;
  onDraw?: () => void;
}

export function CardRenderer({ card, deckConfig, remaining = 0, onReveal, onDraw: _onDraw }: CardRendererProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Flip rotation value [0..1] — 0 = back, 1 = face
  const flipRotation = useSharedValue(0);
  const dragX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Reset on new card
  useEffect(() => {
    setIsRevealed(false);
    setIsExiting(false);
    flipRotation.value = 0;
    dragX.value = 0;
    opacity.value = 1;
  }, [card?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReveal = useCallback(() => {
    if (isRevealed || !card || isExiting) return;
    setIsRevealed(true);
    flipRotation.value = withTiming(1, { duration: 600 });
    onReveal?.();
  }, [isRevealed, card, isExiting, flipRotation, onReveal]);

  // Animated styles for back face (0..0.5)
  const backFaceStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flipRotation.value, [0, 1], [0, 180])}deg` },
    ],
    backfaceVisibility: 'hidden' as const,
    opacity: interpolate(flipRotation.value, [0, 0.4, 0.5], [1, 1, 0]),
  }));

  // Animated styles for front face (0.5..1)
  const frontFaceStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flipRotation.value, [0, 1], [180, 360])}deg` },
    ],
    backfaceVisibility: 'hidden' as const,
    opacity: interpolate(flipRotation.value, [0.5, 0.6, 1], [0, 1, 1]),
  }));

  return (
    <View style={styles.container}>
      <DeckStack
        remaining={remaining}
        gradient={deckConfig.backGradient}
        border={deckConfig.color + '44'}
      />

      <TouchableOpacity
        onPress={handleReveal}
        disabled={isRevealed || isExiting}
        style={styles.cardTouchable}
        activeOpacity={1}
      >
        <View style={styles.cardWrapper}>
          {/* Dos de la carte */}
          <Animated.View
            style={[
              styles.cardFace,
              {
                borderRadius: RADIUS.card,
                backgroundColor: '#0c0920',
              },
              backFaceStyle,
            ]}
          />

          {/* Face de la carte */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardFront,
              {
                borderRadius: RADIUS.card,
                backgroundColor: '#0c0920',
              },
              frontFaceStyle,
            ]}
          />
        </View>
      </TouchableOpacity>

      {/* Compteur cartes restantes */}
      {remaining > 0 && (
        <View style={[styles.badge, { backgroundColor: deckConfig.color, borderRadius: RADIUS.badge }]}>
          <Animated.Text style={styles.badgeText}>{remaining}</Animated.Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTouchable: {
    flex: 1,
    width: '100%',
  },
  cardWrapper: {
    flex: 1,
    position: 'relative',
  },
  cardFace: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  cardFront: {
    // Pre-rotated 180° — shows when flip is at 180°
  },
  badge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
});
