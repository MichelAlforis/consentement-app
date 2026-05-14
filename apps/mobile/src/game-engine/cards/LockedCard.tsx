import { View, Text, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';

export interface LockedCardProps {
  deck: 'a' | 'b';
  condition: string;
  width?: number;
  height?: number;
}

const BG: Record<'a' | 'b', [string, string]> = {
  a: ['#070b18', '#130e3c'],
  b: ['#0c0009', '#250817'],
};

const GLOW_COLOR: Record<'a' | 'b', string> = {
  a: 'rgba(99,102,241,0.28)',
  b: 'rgba(190,18,60,0.28)',
};

const GHOST_ICON_BG: Record<'a' | 'b', string> = {
  a: '#1e1b4b',
  b: '#4a0522',
};

const LOCK_BORDER_COLOR: Record<'a' | 'b', string> = {
  a: 'rgba(99,102,241,0.35)',
  b: 'rgba(190,18,60,0.35)',
};

export function LockedCard({ deck, condition, width = 160, height = 240 }: LockedCardProps) {
  const iconSize = width * 0.3;
  const lineH = Math.max(6, height * 0.028);
  const lockSize = width * 0.22;

  return (
    <View
      style={[
        styles.root,
        {
          width,
          height,
          borderRadius: 14,
          backgroundColor: BG[deck][0],
          borderColor: GLOW_COLOR[deck],
          borderWidth: 1,
        },
      ]}
    >
      {/* Contenu fantôme flou simulé via faible opacité */}
      <View style={[styles.ghost, { gap: height * 0.055, padding: height * 0.08 }]}>
        <View
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
            backgroundColor: GHOST_ICON_BG[deck],
          }}
        />
        <View style={{ width: '78%', height: lineH, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.18)' }} />
        <View style={{ width: '55%', height: lineH, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.12)' }} />
      </View>

      {/* Icône cadenas centré */}
      <View style={styles.lockCenter} pointerEvents="none">
        <View
          style={[
            styles.lockCircle,
            {
              width: lockSize,
              height: lockSize,
              borderRadius: lockSize / 2,
              borderColor: LOCK_BORDER_COLOR[deck],
            },
          ]}
        >
          <Lock size={Math.round(width * 0.11)} color="rgba(255,255,255,0.85)" />
        </View>
      </View>

      {/* Badge condition */}
      <View style={[styles.badge, { bottom: height * 0.05 }]}>
        <Text
          style={[
            styles.badgeText,
            { fontSize: Math.max(8, width * 0.065) },
          ]}
          numberOfLines={1}
        >
          {condition}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  },
  ghost: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  lockCenter: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockCircle: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  badgeText: {
    fontWeight: '800',
    color: 'rgba(255,255,255,0.78)',
    letterSpacing: 0.06 * 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
});
