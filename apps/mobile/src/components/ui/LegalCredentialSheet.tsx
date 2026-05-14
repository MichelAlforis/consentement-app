import { Modal, Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';

interface LegalCredentialSheetProps {
  onClose: () => void;
}

export function LegalCredentialSheet({ onClose }: LegalCredentialSheetProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/70 p-4 pb-10" onPress={onClose}>
        <BlurView intensity={10} tint="dark" className="absolute inset-0" />
        <MotiView
          from={{ translateY: 80, opacity: 0, scale: 0.96 }}
          animate={{ translateY: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-full max-w-[390px] self-center rounded-3xl border p-5"
          style={{ backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }}
        >
          <Pressable>
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="flex-1 text-base font-bold" style={{ color: theme.colors.textPrimary }}>
                {t('welcome.legalSheet.title')}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('welcome.legalSheet.close')}
                onPress={onClose}
                className="h-7 w-7 items-center justify-center rounded-full"
                style={{ backgroundColor: theme.colors.bgSecondary }}
              >
                <Text className="text-[13px] font-bold" style={{ color: theme.colors.textMuted }}>
                  X
                </Text>
              </Pressable>
            </View>

            <View className="mb-4 flex-row items-center gap-4 rounded-2xl p-4" style={{ backgroundColor: theme.colors.bgSecondary }}>
              <View className="h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: theme.colors.premium }}>
                <Text className="text-[22px] font-extrabold text-white">§</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
                  {t('welcome.legalSheet.title')}
                </Text>
                <Text className="mt-0.5 text-xs" style={{ color: theme.colors.textMuted }}>
                  {t('welcome.legalSheet.role')}
                </Text>
              </View>
            </View>

            <Text className="mb-5 text-sm leading-[21px]" style={{ color: theme.colors.textSecondary }}>
              {t('welcome.legalSheet.bio')}
            </Text>

            <Pressable onPress={onClose} className="items-center rounded-2xl py-3.5" style={{ backgroundColor: theme.colors.premium }}>
              <Text className="text-sm font-bold text-white">{t('welcome.legalSheet.close')}</Text>
            </Pressable>
          </Pressable>
        </MotiView>
      </Pressable>
    </Modal>
  );
}
