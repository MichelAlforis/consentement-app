// V4 divergence: tilt via expo-sensors DeviceMotion (framer-motion useSpring/useTransform supprimé)
// V4 divergence: carousel FlatList snapToInterval (pas de framer-motion drag)
// V4 divergence: CollectorCardFace = stub Phase 7 — CardBack affiche gradient + icône seulement
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { DeviceMotion } from 'expo-sensors';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Lock,
  Layers,
  MessageCircle,
  HelpCircle,
  Target,
  Sparkles,
  Heart,
  Flame,
} from 'lucide-react-native';
import {
  useUnlockStore,
  useRevealStore,
  useNavigationStore,
  type GainedCard,
} from '@ouiclair/core';
import { FlipRevealOverlay } from '../../ui/FlipRevealOverlay';
import { CardFullscreenOverlay } from '../../ui/CardFullscreenOverlay';
import { collectorCards } from '../../../data/cards-collector';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.floor(SCREEN_WIDTH * 0.72);
const CARD_HEIGHT = Math.floor(CARD_WIDTH * 1.5);
const SIDE_PADDING = Math.floor((SCREEN_WIDTH - CARD_WIDTH) / 2);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseGradientColors(gradient: string): [string, string] {
  const matches = gradient.match(/#[0-9a-fA-F]{6}/g);
  if (matches && matches.length >= 2) return [matches[0], matches[1]];
  return ['#7c3aed', '#4c1d95'];
}

function ownedToGained(ownedId: string): GainedCard | null {
  const cc = collectorCards.find((c) => c.id === ownedId);
  if (!cc) return null;
  return {
    id: cc.id,
    text: cc.text,
    theme: cc.theme,
    rarity: cc.rarity,
    gradient: cc.visual.gradient,
    iconName: cc.visual.iconName,
    border: cc.visual.border,
  };
}

// ─── CardIcon ─────────────────────────────────────────────────────────────────

function CardIcon({ iconName, size, color }: { iconName: string; size: number; color: string }) {
  switch (iconName) {
    case 'Layers': return <Layers size={size} color={color} />;
    case 'MessageCircle': return <MessageCircle size={size} color={color} />;
    case 'HelpCircle': return <HelpCircle size={size} color={color} />;
    case 'Target': return <Target size={size} color={color} />;
    case 'Heart': return <Heart size={size} color={color} />;
    case 'Flame': return <Flame size={size} color={color} />;
    default: return <Sparkles size={size} color={color} />;
  }
}

// ─── CardBack ─────────────────────────────────────────────────────────────────

function CardBack({
  card,
  onPress,
  tiltX,
  tiltY,
}: {
  card: GainedCard;
  onPress: () => void;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
}) {
  const tiltStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 500 },
      { rotateX: `${tiltX.value}deg` },
      { rotateY: `${tiltY.value}deg` },
    ],
  }));

  const [c1, c2] = parseGradientColors(card.gradient);
  const borderColor =
    card.rarity === 'unique' ? '#fbbf24'
    : card.rarity === 'rare' ? '#a78bfa'
    : 'rgba(255,255,255,0.15)';
  const borderWidth = card.rarity !== 'common' ? 2 : 1;

  return (
    <Pressable onPress={onPress} style={{ width: CARD_WIDTH }}>
      <Animated.View
        style={[
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth,
            borderColor,
          },
          tiltStyle,
        ]}
      >
        <LinearGradient
          colors={[c1, c2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.12,
            }}
          />
          <CardIcon iconName={card.iconName} size={72} color="rgba(255,255,255,0.12)" />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 16,
            }}
          >
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 13,
                lineHeight: 20,
                fontWeight: '500',
              }}
              numberOfLines={4}
            >
              {card.text}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

// ─── HallOfCardsScreen ────────────────────────────────────────────────────────

export function HallOfCardsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const ownedCards = useUnlockStore((s) => s.ownedCards);
  const pendingIds = useRevealStore((s) => s.pendingIds);
  const clearPending = useRevealStore((s) => s.clearPending);
  const navigateTo = useNavigationStore((s) => s.navigateTo);

  const [selectedCard, setSelectedCard] = useState<GainedCard | null>(null);

  // Shared tilt values — single DeviceMotion listener pour tous les CardBack
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  useEffect(() => {
    let sub: ReturnType<typeof DeviceMotion.addListener> | null = null;

    DeviceMotion.requestPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') return;
      DeviceMotion.setUpdateInterval(16);
      sub = DeviceMotion.addListener(({ rotation }) => {
        if (!rotation) return;
        tiltX.value = withSpring((rotation.gamma ?? 0) * 15, { stiffness: 55, damping: 14 });
        tiltY.value = withSpring((rotation.beta ?? 0) * 15, { stiffness: 55, damping: 14 });
      });
    });

    return () => {
      sub?.remove();
    };
  }, [tiltX, tiltY]);

  const gainedCards = useMemo<GainedCard[]>(() => {
    return ownedCards.flatMap((owned) => {
      const card = ownedToGained(owned.id);
      return card ? [card] : [];
    });
  }, [ownedCards]);

  const pendingCards = useMemo<GainedCard[]>(() => {
    return pendingIds.flatMap((id) => {
      const card = ownedToGained(id);
      return card ? [card] : [];
    });
  }, [pendingIds]);

  const deckATotal = useMemo(
    () => collectorCards.filter((c) => c.deck === 'A').length,
    [],
  );

  const handleCardPress = useCallback((card: GainedCard) => {
    setSelectedCard(card);
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GainedCard>) => (
      <CardBack
        card={item}
        onPress={() => handleCardPress(item)}
        tiltX={tiltX}
        tiltY={tiltY}
      />
    ),
    [handleCardPress, tiltX, tiltY],
  );

  if (gainedCards.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bgPrimary,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top + 32,
          paddingHorizontal: 32,
          paddingBottom: insets.bottom + 32,
          gap: 16,
        }}
      >
        <Lock size={48} color={colors.textMuted} />
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          {t('hallOfCards.emptyTitle')}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {t('hallOfCards.emptyDesc')}
        </Text>
        <Pressable
          onPress={() => navigateTo('apprendre')}
          style={{
            marginTop: 8,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 99,
            backgroundColor: colors.accent,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>
            {t('hallOfCards.emptyCta')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 16,
          paddingBottom: 12,
          gap: 4,
        }}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 22,
            fontWeight: '900',
          }}
        >
          {t('hallOfCards.title')}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 13 }}>
          {t('hallOfCards.count', {
            owned: gainedCards.length,
            total: deckATotal,
          })}
        </Text>
      </View>

      {/* Carousel */}
      <FlatList
        data={gainedCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING, paddingVertical: 16 }}
        style={{ flex: 1 }}
      />

      {/* CardFullscreenOverlay */}
      {selectedCard !== null && (
        <CardFullscreenOverlay
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* FlipRevealOverlay */}
      {pendingCards.length > 0 && (
        <FlipRevealOverlay cards={pendingCards} onDone={clearPending} />
      )}
    </View>
  );
}
