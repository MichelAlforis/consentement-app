import { useEffect } from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Grain cinématographique — overlay statique basse opacité
export function GrainOverlay() {
  return (
    <View style={styles.grain} pointerEvents="none">
      <Image
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('@ouiclair/textures/assets/grain/grain-128.png')}
        style={StyleSheet.absoluteFill}
        // V4 limitation: resizeMode="cover" au lieu de "repeat" car pas de
        // tiling cross-platform natif sans lib tierce. Régression visuelle
        // mineure assumée vs grain CSS V3.
        resizeMode="cover"
        fadeDuration={0}
      />
    </View>
  );
}

// Shimmer diagonal — thème Dark Luxury
export function ShimmerLayer({ color }: { color: string }) {
  const { width } = useWindowDimensions();
  const shimmerW = width * 0.4;
  const tx = useSharedValue(-shimmerW);

  useEffect(() => {
    tx.value = withRepeat(
      withSequence(
        withDelay(
          6000,
          withTiming(width * 1.5, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
        ),
        withTiming(-shimmerW, { duration: 0 }),
      ),
      -1,
    );
  }, [tx, width, shimmerW]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  return (
    <View style={styles.shimmerContainer} pointerEvents="none">
      <Animated.View style={[{ width: shimmerW, position: 'absolute', top: 0, bottom: 0 }, animStyle]}>
        <LinearGradient
          colors={['transparent', `${color}40`, `${color}18`, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.4 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

// Shimmer statique pour les previews dans ThemeSelectScreen (sans useTheme)
export function PreviewShimmer({ color }: { color: string }) {
  const { width } = useWindowDimensions();
  const shimmerW = width * 0.4;
  const tx = useSharedValue(-shimmerW);

  useEffect(() => {
    tx.value = withRepeat(
      withSequence(
        withDelay(
          3500,
          withTiming(width * 1.5, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
        ),
        withTiming(-shimmerW, { duration: 0 }),
      ),
      -1,
    );
  }, [tx, width, shimmerW]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  return (
    <View style={styles.previewContainer} pointerEvents="none">
      <Animated.View style={[{ width: shimmerW, position: 'absolute', top: 0, bottom: 0 }, animStyle]}>
        <LinearGradient
          colors={['transparent', `${color}50`, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = {
  grain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
    zIndex: 9999,
  },
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 1,
  },
  previewContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 24,
    zIndex: 2,
  },
} as const;
