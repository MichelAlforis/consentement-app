import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { ChevronRight, Sparkles, X } from 'lucide-react-native';
import { DURATION, STAGGER, CARD_POINTS } from '@ouiclair/core';
import type { GainedCard } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { CollectorCardFace } from './CollectorCardFace';

interface FlipRevealOverlayProps {
  cards: GainedCard[];
  onDone: () => void;
}

const CARDS_PER_PAGE = 8;

// TODO Phase 7: ajouter getRarityLabel dans le composant fullscreen focusedCard

function FlipCard({ card: _card, index, flipped, onFocus }: {
  card: GainedCard;
  index: number;
  flipped: boolean;
  onFocus: () => void;
}) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(flipped ? 180 : 0, {
      duration: DURATION.cardReveal * 1000,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [flipped, rotation]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { rotateY: `${rotation.value}deg` },
      { scale: interpolate(rotation.value, [0, 180], [0.85, 1]) },
    ],
  }));

  const backOpacity = useAnimatedStyle(() => ({
    opacity: rotation.value < 90 ? 1 : 0,
  }));

  const frontOpacity = useAnimatedStyle(() => ({
    opacity: rotation.value >= 90 ? 1 : 0,
  }));

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12, scale: 0.94 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ delay: index * STAGGER.item * 1000, type: 'timing', duration: DURATION.staggerItem * 1000 }}
    >
      <TouchableOpacity onPress={onFocus} activeOpacity={0.85}>
        <Animated.View style={[styles.batchCard, cardStyle]}>
          <Animated.View style={[StyleSheet.absoluteFill, backOpacity, styles.cardBack]}>
            <Sparkles size={28} color="rgba(255,255,255,0.12)" />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, frontOpacity]}>
            <CollectorCardFace />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </MotiView>
  );
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

  const singleRotation = useSharedValue(0);

  useEffect(() => {
    if (batchMode) return;
    singleRotation.value = 0;
    const id = setTimeout(() => {
      singleRotation.value = withTiming(180, {
        duration: DURATION.cardReveal * 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }, 900);
    return () => clearTimeout(id);
  }, [batchMode, index, singleRotation]);

  const singleCardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { rotateY: `${singleRotation.value}deg` },
      { scale: interpolate(singleRotation.value, [0, 180], [0.85, 1]) },
    ],
  }));

  const backVisible = useAnimatedStyle(() => ({
    opacity: singleRotation.value < 90 ? 1 : 0,
  }));
  const frontVisible = useAnimatedStyle(() => ({
    opacity: singleRotation.value >= 90 ? 1 : 0,
  }));

  const pageHeatPts = pageCards.reduce((sum, c) => sum + (CARD_POINTS[c.rarity] ?? 0), 0);
  const currentCardPts = CARD_POINTS[card?.rarity] ?? 0;

  const title = total === 1
    ? t('flipReveal.titleOne')
    : t('flipReveal.titlePlural', { count: String(total) });

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDone}>
      <View style={styles.overlay}>
        {/* Bouton fermer */}
        <TouchableOpacity onPress={onDone} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* Header */}
        <MotiView
          key={`header-${index}`}
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.headerBlock}
        >
          <Text style={styles.progressText}>
            {batchMode
              ? `${pageStart + 1}-${pageEnd} / ${total}`
              : t('flipReveal.progress', { current: String(index + 1), total: String(total) })}
          </Text>
          <Text style={styles.titleText}>{title}</Text>
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 300 }}
            style={styles.heatBadge}
          >
            <Text style={styles.heatBadgeText}>
              {t('flipReveal.heatPts', { n: String(batchMode ? pageHeatPts : currentCardPts) })}
            </Text>
          </MotiView>
        </MotiView>

        {batchMode ? (
          <MotiView
            key={`page-${page}`}
            from={{ opacity: 0, translateY: 14 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: DURATION.normal * 1000 }}
            style={styles.grid}
          >
            {pageCards.map((item, itemIndex) => (
              <FlipCard
                key={item.id}
                card={item}
                index={itemIndex}
                flipped
                onFocus={() => setFocusedCard(item)}
              />
            ))}
          </MotiView>
        ) : (
          <Animated.View style={[styles.singleCard, singleCardStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, backVisible, styles.cardBack]}>
              <Sparkles size={52} color="rgba(255,255,255,0.12)" />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, frontVisible]}>
              <CollectorCardFace />
            </Animated.View>
          </Animated.View>
        )}

        {/* Hint before flip */}
        <AnimatePresence>
          {!batchMode && !flipped && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Text style={styles.hintText}>{t('flipReveal.tapToFlip')}</Text>
            </MotiView>
          )}
        </AnimatePresence>

        {/* CTA after flip */}
        <AnimatePresence>
          {(batchMode || flipped) && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 300 }}
            >
              <TouchableOpacity onPress={handleNext} activeOpacity={0.85} style={styles.ctaBtn}>
                <Text style={styles.ctaBtnText}>
                  {batchMode ? (isLastPage ? t('flipReveal.done') : 'Cartes suivantes') : t('flipReveal.done')}
                </Text>
                <ChevronRight size={16} color="white" />
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>

        {/* Focus zoom */}
        <AnimatePresence>
          {focusedCard && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.focusBackdrop}
            >
              <Pressable style={StyleSheet.absoluteFill} onPress={() => setFocusedCard(null)} />
              <MotiView
                from={{ scale: 0.78, translateY: 24 }}
                animate={{ scale: 1, translateY: 0 }}
                exit={{ scale: 0.82, translateY: 18 }}
                transition={{ type: 'timing', duration: DURATION.fast * 1000 }}
                style={styles.focusCard}
              >
                <CollectorCardFace />
                <TouchableOpacity
                  onPress={() => setFocusedCard(null)}
                  style={styles.focusClose}
                  activeOpacity={0.85}
                >
                  <X size={18} color="#111827" />
                </TouchableOpacity>
              </MotiView>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
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
  headerBlock: {
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
  },
  heatBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: 'rgba(249,115,22,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.35)',
  },
  heatBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fb923c',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  batchCard: {
    width: 118,
    height: 177,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0f0a1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleCard: {
    width: 200,
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0f0a1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    backgroundColor: '#1a1035',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 99,
    backgroundColor: '#7c3aed',
  },
  ctaBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  focusBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  focusCard: {
    width: 220,
    height: 330,
    borderRadius: 20,
    overflow: 'visible',
    backgroundColor: '#0f0a1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusClose: {
    position: 'absolute',
    right: -12,
    top: -12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
} as const;
