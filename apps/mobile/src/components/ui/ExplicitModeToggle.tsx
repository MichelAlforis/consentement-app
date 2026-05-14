import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import { Flame, X } from 'lucide-react-native';
import {
  useSettingsStore,
  useAuthStore,
  canAccessFeature,
} from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { useHeat } from '../../context/HeatContext';

const EXPLICIT_RED = '#ef4444';

function TogglePill({
  active,
  disabled,
  onPress,
}: {
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        styles.pill,
        {
          backgroundColor: active ? EXPLICIT_RED : '#6b728040',
          opacity: disabled ? 0.55 : 1,
        },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
    >
      <MotiView
        animate={{ translateX: active ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={styles.thumb}
      />
    </TouchableOpacity>
  );
}

interface ExplicitModeToggleProps {
  /** true = just the pill (for SettingsRow right slot); false = full card (for Home) */
  pillOnly?: boolean;
  delay?: number;
}

export function ExplicitModeToggle({ pillOnly = false, delay = 0 }: ExplicitModeToggleProps) {
  const { explicitMode, toggleExplicitMode } = useSettingsStore();
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const isAdult = useAuthStore((s) => s.isAdult);
  const { level } = useHeat();
  const locked = !canAccessFeature('explicit', { isAdult, heatLevel: level });

  const handleToggle = () => {
    if (locked && !explicitMode) return;
    if (!explicitMode) {
      setShowModal(true);
    } else {
      toggleExplicitMode();
    }
  };

  const confirm = () => {
    toggleExplicitMode();
    setShowModal(false);
  };

  return (
    <>
      {pillOnly ? (
        <TogglePill active={explicitMode} disabled={locked && !explicitMode} onPress={handleToggle} />
      ) : (
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: delay * 1000, type: 'timing', duration: 300 }}
          style={[
            styles.card,
            {
              backgroundColor: explicitMode ? `${EXPLICIT_RED}10` : colors.bgCard,
              borderColor: explicitMode ? EXPLICIT_RED : colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconBox,
              { backgroundColor: explicitMode ? `${EXPLICIT_RED}20` : `${EXPLICIT_RED}12` },
            ]}
          >
            <Flame size={20} color={EXPLICIT_RED} />
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t('settings.explicit.title')}
            </Text>
            <Text style={[styles.desc, { color: colors.textMuted }]}>
              {explicitMode
                ? t('settings.explicit.activeDesc')
                : t('settings.explicit.desc')}
            </Text>
          </View>
          <TogglePill active={explicitMode} disabled={locked && !explicitMode} onPress={handleToggle} />
        </MotiView>
      )}

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowModal(false)} />
          <MotiView
            from={{ translateY: 60, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={[styles.modalCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}>
                <Flame size={24} color={EXPLICIT_RED} />
              </View>
              <View style={styles.modalTitleBlock}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  {t('settings.explicit.modal.title')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                activeOpacity={0.7}
                style={styles.closeBtn}
              >
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalBody, { color: colors.textSecondary }]}>
              {t('settings.explicit.modal.body')}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={confirm}
                activeOpacity={0.85}
                style={styles.confirmBtn}
              >
                <Text style={styles.confirmBtnText}>{t('settings.explicit.modal.confirm')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                activeOpacity={0.85}
                style={[styles.cancelBtn, { backgroundColor: colors.bgSecondary }]}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>
                  {t('settings.explicit.modal.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </Modal>
    </>
  );
}

const styles = {
  pill: {
    width: 48,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
  },
  desc: {
    fontSize: 12,
    marginTop: 2,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  modalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef444418',
    flexShrink: 0,
  },
  modalTitleBlock: {
    flex: 1,
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  closeBtn: {
    padding: 4,
    flexShrink: 0,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    gap: 12,
  },
  confirmBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
} as const;
