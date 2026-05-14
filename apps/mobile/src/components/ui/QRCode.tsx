import { View } from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';
import { MotiView } from 'moti';
import { useTheme } from '../../theme/ThemeContext';

interface QRCodeProps {
  size?: number;
}

export function QRCode({ size = 120 }: QRCodeProps) {
  const theme = useTheme();

  return (
    <MotiView
      from={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 14, stiffness: 180 }}
      className="rounded-2xl p-3 shadow-lg"
      style={[
        {
          width: size,
          height: size,
          backgroundColor: theme.colors.bgSecondary,
          shadowColor: theme.colors.textPrimary,
        },
      ]}
    >
      <View className="flex-1 items-center justify-center rounded-xl p-0.5" style={{ backgroundColor: theme.colors.bgCard }}>
        <QRCodeSVG
          value="ouiclair"
          size={Math.max(24, size - 28)}
          color={theme.colors.textPrimary}
          backgroundColor="transparent"
        />
      </View>
    </MotiView>
  );
}
