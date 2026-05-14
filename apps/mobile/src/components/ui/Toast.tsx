import { View, Text } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../theme/ThemeContext';

const ICON_SIZE = 18;

export function Toast() {
  const { toasts } = useToast();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom + 80, 96);

  return (
    <View style={[styles.container, { bottom: bottomOffset }]} pointerEvents="box-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const barColor =
            toast.type === 'success' ? colors.success :
            toast.type === 'error'   ? colors.error   :
            colors.accent;

          return (
            <MotiView
              key={toast.id}
              from={{ opacity: 0, translateY: 12, scale: 0.95 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              exit={{ opacity: 0, translateY: 6, scale: 0.95 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              style={[
                styles.card,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: `${barColor}40`,
                },
              ]}
            >
              <View style={styles.row}>
                {toast.type === 'success' && <CheckCircle size={ICON_SIZE} color={colors.success} />}
                {toast.type === 'error'   && <XCircle     size={ICON_SIZE} color={colors.error}   />}
                {toast.type === 'default' && <Info        size={ICON_SIZE} color={colors.accent}  />}
                <Text style={[styles.message, { color: colors.textPrimary }]}>{toast.message}</Text>
              </View>
              <View style={[styles.timerTrack, { backgroundColor: `${barColor}20` }]}>
                <MotiView
                  from={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ type: 'timing', duration: 2800 }}
                  style={[styles.timerBar, { backgroundColor: barColor }]}
                />
              </View>
            </MotiView>
          );
        })}
      </AnimatePresence>
    </View>
  );
}

const styles = {
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    gap: 8,
    pointerEvents: 'box-none',
    zIndex: 200,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  timerTrack: {
    height: 2,
  },
  timerBar: {
    height: 2,
    transformOrigin: 'left',
  },
} as const;
