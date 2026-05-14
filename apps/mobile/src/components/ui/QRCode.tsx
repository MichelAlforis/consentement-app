import { StyleSheet, View } from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';
import { MotiView } from 'moti';
import { useTheme } from '../../theme/ThemeContext';

interface QRCodeProps {
  value?: string;
  size?: number;
}

export function QRCode({ value = 'ouiclair', size = 120 }: QRCodeProps) {
  const theme = useTheme();

  return (
    <MotiView
      from={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 14, stiffness: 180 }}
      style={[
        styles.frame,
        {
          width: size,
          height: size,
          backgroundColor: theme.colors.bgSecondary,
          shadowColor: theme.colors.textPrimary,
        },
      ]}
    >
      <View style={[styles.inner, { backgroundColor: theme.colors.bgCard }]}>
        <QRCodeSVG
          value={value}
          size={Math.max(24, size - 28)}
          color={theme.colors.textPrimary}
          backgroundColor="transparent"
        />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 16,
    padding: 12,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  inner: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
});
