import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
      <Pressable style={styles.overlay} onPress={onClose}>
        <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />
        <MotiView
          from={{ translateY: 80, opacity: 0, scale: 0.96 }}
          animate={{ translateY: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          style={[styles.sheet, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
        >
          <Pressable>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t('welcome.legalSheet.title')}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('welcome.legalSheet.close')}
                onPress={onClose}
                style={[styles.closeButton, { backgroundColor: theme.colors.bgSecondary }]}
              >
                <Text style={[styles.closeText, { color: theme.colors.textMuted }]}>X</Text>
              </Pressable>
            </View>

            <View style={[styles.profile, { backgroundColor: theme.colors.bgSecondary }]}>
              <View style={[styles.badge, { backgroundColor: theme.colors.premium }]}>
                <Text style={styles.badgeText}>§</Text>
              </View>
              <View style={styles.profileText}>
                <Text style={[styles.profileTitle, { color: theme.colors.textPrimary }]}>
                  {t('welcome.legalSheet.title')}
                </Text>
                <Text style={[styles.role, { color: theme.colors.textMuted }]}>{t('welcome.legalSheet.role')}</Text>
              </View>
            </View>

            <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>{t('welcome.legalSheet.bio')}</Text>

            <Pressable onPress={onClose} style={[styles.cta, { backgroundColor: theme.colors.premium }]}>
              <Text style={styles.ctaText}>{t('welcome.legalSheet.close')}</Text>
            </Pressable>
          </Pressable>
        </MotiView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    paddingBottom: 40,
  },
  sheet: {
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  closeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  profile: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    padding: 16,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  badgeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  profileText: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  role: {
    fontSize: 12,
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  cta: {
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
  },
  ctaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
