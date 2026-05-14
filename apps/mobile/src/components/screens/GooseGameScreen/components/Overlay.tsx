import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import type { ReactNode } from 'react';

interface OverlayProps {
  children: ReactNode;
  color?: string;
}

export function Overlay({ children, color = '#1e293b' }: OverlayProps) {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.backdrop}
    >
      <MotiView
        from={{ translateY: 400 }}
        animate={{ translateY: 0 }}
        exit={{ translateY: 400 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        style={[styles.sheet, { backgroundColor: color }]}
      >
        {children}
      </MotiView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
});
