// V4 divergence: framer-motion drag="y" remplacé par PanResponder
// natif RN. Migration vers react-native-gesture-handler envisagée
// si le drag-to-dismiss ne fonctionne pas correctement sur Android
// (Modal interception de touches).
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  PanResponder,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { DeviceMotion } from 'expo-sensors';
import { X } from 'lucide-react-native';
import type { GainedCard } from '@ouiclair/core';

// ─── DeviceMotion gyroscope hook ─────────────────────────────────────────────

function useDeviceOrientation() {
  const smoothX = useSharedValue(0); // rotateX (tilt front-back)
  const smoothY = useSharedValue(0); // rotateY (tilt left-right)
  const [listening, setListening] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  useEffect(() => {
    DeviceMotion.requestPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        setListening(true);
      } else {
        setNeedsPermission(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!listening) return;
    DeviceMotion.setUpdateInterval(16);
    const sub = DeviceMotion.addListener(({ rotation }) => {
      if (!rotation) return;
      const normX = Math.max(-1, Math.min(1, ((rotation.beta ?? 60) - 60) / 25));
      const normY = Math.max(-1, Math.min(1, (rotation.gamma ?? 0) / 25));
      smoothX.value = withSpring(normX * 9, { stiffness: 55, damping: 14 });
      smoothY.value = withSpring(normY * 9, { stiffness: 55, damping: 14 });
    });
    return () => sub.remove();
  }, [listening, smoothX, smoothY]);

  const requestPermission = useCallback(async () => {
    const { status } = await DeviceMotion.requestPermissionsAsync();
    if (status === 'granted') {
      setListening(true);
      setNeedsPermission(false);
    }
  }, []);

  return { smoothX, smoothY, needsPermission, requestPermission };
}

// ─── CardFullscreenOverlay ────────────────────────────────────────────────────

export interface CardFullscreenOverlayProps {
  card: GainedCard;
  onClose: () => void;
}

const CARD_SIZE = 260;

export function CardFullscreenOverlay({ card, onClose }: CardFullscreenOverlayProps) {
  const { smoothX, smoothY, needsPermission, requestPermission } = useDeviceOrientation();

  // Delayed flip: back → front
  const [isFlipped, setIsFlipped] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setIsFlipped(true), 300);
    return () => clearTimeout(id);
  }, []);

  const flipRotation = useSharedValue(0);
  useEffect(() => {
    flipRotation.value = withTiming(isFlipped ? 180 : 0, { duration: 600 });
  }, [flipRotation, isFlipped]);

  const tiltStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1400 },
      { rotateX: `${smoothX.value}deg` },
      { rotateY: `${smoothY.value}deg` },
    ],
  }));

  const flipStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${flipRotation.value}deg` }],
  }));

  const backFaceOpacity = useAnimatedStyle(() => ({
    opacity: flipRotation.value < 90 ? 1 : 0,
  }));
  const frontFaceOpacity = useAnimatedStyle(() => ({
    opacity: flipRotation.value >= 90 ? 1 : 0,
  }));

  // Swipe-down to dismiss
  const dragY = useSharedValue(0);
  const overlayOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(dragY.value, [0, 160], [1, 0]),
  }));

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 8 && Math.abs(gs.dy) > Math.abs(gs.dx),
      onPanResponderGrant: () => {
        dragY.value = 0;
      },
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) dragY.value = gs.dy;
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 80) {
          onClose();
        } else {
          dragY.value = withSpring(0);
        }
      },
    }),
  ).current;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, overlayOpacity]}>
        {/* Close button */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* Draggable content */}
        <View style={styles.content} {...panResponder.panHandlers}>
          {/* Drag handle */}
          <View style={styles.dragHandle} />

          {/* 3D tilt wrapper + flippable card */}
          <Animated.View style={tiltStyle}>
            <Animated.View style={[styles.cardWrapper, flipStyle]}>
              {/* Back face */}
              <Animated.View style={[StyleSheet.absoluteFill, styles.cardBack, backFaceOpacity]} />
              {/* Front face — TODO Phase 7: remplacer par CollectorCardCanvas R3F */}
              <Animated.View style={[StyleSheet.absoluteFill, styles.cardFront, frontFaceOpacity]}>
                <View style={[styles.cardFrontInner, { width: CARD_SIZE, height: CARD_SIZE * 1.5 }]} />
              </Animated.View>
            </Animated.View>
          </Animated.View>

          {/* Texte + badge thème */}
          <View style={styles.textBlock}>
            <View style={[styles.themeBadge, { backgroundColor: card.gradient }]}>
              <Text style={styles.themeText}>{card.themeName ?? card.theme}</Text>
            </View>

            <Text style={styles.cardText}>{card.text}</Text>

            {card.rarity !== 'common' && (
              <Text style={[styles.rarityText, { color: card.border }]}>
                {'✦ '}{card.rarity === 'unique' ? 'Unique' : 'Rare'}
              </Text>
            )}
          </View>

          {/* iOS gyroscope permission */}
          {needsPermission && (
            <TouchableOpacity
              onPress={requestPermission}
              activeOpacity={0.85}
              style={styles.gyroBtn}
            >
              <Text style={styles.gyroBtnText}>Activer le gyroscope</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4,2,12,0.97)',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingTop: 60,
    paddingBottom: 32,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardWrapper: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBack: {
    backgroundColor: '#1a1035',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardFront: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardFrontInner: {
    // TODO Phase 7: CollectorCardCanvas goes here
    borderRadius: 20,
    backgroundColor: '#1a1035',
  },
  textBlock: {
    maxWidth: 310,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 14,
  },
  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  themeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.6,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  rarityText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  gyroBtn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
  },
  gyroBtnText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '600',
  },
} as const;
