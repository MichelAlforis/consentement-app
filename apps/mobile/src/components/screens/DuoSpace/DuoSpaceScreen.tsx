import { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { AlertCircle, Camera, ChevronLeft, LogOut, QrCode, UserCheck, X } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  useNavigationStore,
  useDuoStore,
  useAuthStore,
  useProfileStore,
  usePreferencesStore,
  createDuoSession,
  joinDuoSession,
  subscribeToSession,
} from '@ouiclair/core';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';

type DuoView = 'choice' | 'waiting' | 'join' | 'scanning';

export function DuoSpaceScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const goBack = useNavigationStore((s) => s.goBack);
  const duoConnected = useDuoStore((s) => s.duoConnected);
  const setPartnerProfile = useDuoStore((s) => s.setPartnerProfile);
  const resetDuo = useDuoStore((s) => s.reset);

  const pbUserId = useAuthStore((s) => s.pbUserId);
  const authenticateWithPocketBase = useAuthStore((s) => s.authenticateWithPocketBase);
  const personalProfile = useProfileStore((s) => s.personalProfile);
  const answers = usePreferencesStore((s) => s.answers);

  const [view, setView] = useState<DuoView>('choice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [qrError, setQrError] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, []);

  async function ensureAuth(): Promise<string> {
    if (pbUserId) return pbUserId;
    await authenticateWithPocketBase();
    const freshId = useAuthStore.getState().pbUserId;
    if (!freshId) throw new Error('auth');
    return freshId;
  }

  function mapError(err: unknown): string {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('404') || msg.includes('not found')) return t('duo.errorInvalidCode');
    if (msg.includes('expired') || msg.includes('expiré')) return t('duo.errorExpired');
    return t('duo.errorNetwork');
  }

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = await ensureAuth();
      const preferenceRecord = Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, String(v)]),
      );
      const { code, sessionId: sid } = await createDuoSession(
        personalProfile,
        uid,
        Object.keys(preferenceRecord).length > 0 ? preferenceRecord : undefined,
      );
      setSessionCode(code);
      setQrError(false);
      setView('waiting');

      unsubRef.current = subscribeToSession(sid, code, (record) => {
        if (record.partner_profile) {
          setPartnerProfile(record.partner_profile, sid);
          unsubRef.current?.();
          unsubRef.current = null;
        }
      });
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const uid = await ensureAuth();
      const preferenceRecord = Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, String(v)]),
      );
      const { sessionId: sid, initiatorProfile } = await joinDuoSession(
        code,
        personalProfile,
        uid,
        Object.keys(preferenceRecord).length > 0 ? preferenceRecord : undefined,
      );
      setPartnerProfile(initiatorProfile, sid);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = async () => {
    setError(null);
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        setError(t('duo.permissionDenied'));
        setView('join');
        return;
      }
    }
    setScanned(false);
    setView('scanning');
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    const code = data.trim().toUpperCase().substring(0, 6);
    setJoinCode(code);
    setView('join');
  };

  const handleDisconnect = () => {
    unsubRef.current?.();
    unsubRef.current = null;
    resetDuo();
    setSessionCode('');
    setJoinCode('');
    setError(null);
    setView('choice');
  };

  const handleCancel = () => {
    unsubRef.current?.();
    unsubRef.current = null;
    setSessionCode('');
    setError(null);
    setView('choice');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: insets.top }}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={styles.header}
      >
        <Pressable onPress={goBack} hitSlop={8}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('duo.title')}
        </Text>
      </MotiView>

      {/* Camera view (full screen overlay) */}
      {view === 'scanning' && (
        <View style={StyleSheet.absoluteFillObject}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleBarcodeScanned}
          />
          <View style={[styles.scanOverlay, { paddingTop: insets.top + 56 }]}>
            <Text style={styles.scanHint}>{t('duo.scanQRHint')}</Text>
            <View style={styles.scanFrame} />
          </View>
          <Pressable
            onPress={() => setView('choice')}
            style={[styles.scanClose, { top: insets.top + 12 }]}
          >
            <X size={24} color="#fff" />
          </Pressable>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Error banner */}
        {error ? (
          <MotiView
            from={{ opacity: 0, translateY: -8 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={[styles.errorBanner, { backgroundColor: `${colors.error ?? '#ef4444'}18`, borderColor: colors.error ?? '#ef4444' }]}
          >
            <AlertCircle size={16} color={colors.error ?? '#ef4444'} />
            <Text style={[styles.errorText, { color: colors.error ?? '#ef4444' }]}>{error}</Text>
          </MotiView>
        ) : null}

        {duoConnected ? (
          /* ── Connecté ── */
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.accent }]}
          >
            <View style={[styles.iconCircle, { backgroundColor: `${colors.accent}20` }]}>
              <UserCheck size={32} color={colors.accent} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              {t('duo.connected')}
            </Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
              {t('duo.connectedSub')}
            </Text>
            <Pressable onPress={handleDisconnect} style={[styles.ghostBtn, { backgroundColor: colors.bgSecondary }]}>
              <LogOut size={16} color={colors.textMuted} />
              <Text style={[styles.ghostBtnText, { color: colors.textMuted }]}>
                {t('duo.disconnect')}
              </Text>
            </Pressable>
          </MotiView>

        ) : view === 'choice' ? (
          /* ── Choix ── */
          <View style={{ gap: 16 }}>
            <ChoiceCard
              delay={80}
              icon={<QrCode size={24} color={colors.accent} />}
              iconBg={`${colors.accent}20`}
              title={t('duo.createSession')}
              desc={t('duo.createSessionDesc')}
              borderColor={colors.accent}
              bgColor={colors.bgCard}
              onPress={handleCreate}
              loading={loading}
              colors={colors}
            />
            <ChoiceCard
              delay={160}
              icon={<Camera size={24} color={colors.textSecondary} />}
              iconBg={colors.bgSecondary}
              title={t('duo.join')}
              desc={t('duo.joinDesc')}
              borderColor={colors.divider}
              bgColor={colors.bgCard}
              onPress={handleScanQR}
              loading={false}
              colors={colors}
            />
          </View>

        ) : view === 'waiting' ? (
          /* ── QR + attente ── */
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.divider, borderWidth: 1 }]}
          >
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              {t('duo.waiting')}
            </Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
              {t('duo.waitingSub')}
            </Text>

            {!qrError && sessionCode ? (
              <View style={styles.qrWrapper}>
                <QRCode
                  value={sessionCode}
                  size={200}
                  onError={() => setQrError(true)}
                />
              </View>
            ) : null}

            <Text style={[styles.codeLabel, { color: colors.textMuted }]}>
              {t('duo.shareCode')}
            </Text>
            <Text style={[styles.code, { color: colors.accent }]}>{sessionCode}</Text>

            <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 4 }} />

            <Pressable onPress={handleCancel} style={[styles.ghostBtn, { backgroundColor: colors.bgSecondary }]}>
              <Text style={[styles.ghostBtnText, { color: colors.textMuted }]}>
                {t('duo.cancel')}
              </Text>
            </Pressable>
          </MotiView>

        ) : view === 'join' ? (
          /* ── Saisie manuelle ── */
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.divider, borderWidth: 1 }]}
          >
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              {t('duo.enterCode')}
            </Text>

            <Pressable
              onPress={handleScanQR}
              style={[styles.scanBtn, { borderColor: colors.accent, backgroundColor: `${colors.accent}10` }]}
            >
              <Camera size={18} color={colors.accent} />
              <Text style={[styles.scanBtnText, { color: colors.accent }]}>
                {t('duo.scanQRBtn')}
              </Text>
            </Pressable>

            <Text style={[styles.orDivider, { color: colors.textMuted }]}>—</Text>

            <TextInput
              value={joinCode}
              onChangeText={(v) => setJoinCode(v.toUpperCase())}
              placeholder="ABC123"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              maxLength={6}
              style={[styles.codeInput, { borderColor: colors.accent, color: colors.textPrimary }]}
            />

            <Pressable
              onPress={handleJoin}
              disabled={loading || joinCode.trim().length !== 6}
              style={[
                styles.primaryBtn,
                { backgroundColor: colors.accent, opacity: joinCode.trim().length === 6 && !loading ? 1 : 0.4 },
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>{t('duo.join')}</Text>
              )}
            </Pressable>

            <Pressable onPress={() => { setJoinCode(''); setView('choice'); }} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={[styles.ghostBtnText, { color: colors.textMuted }]}>
                {t('duo.cancel')}
              </Text>
            </Pressable>
          </MotiView>
        ) : null}
      </ScrollView>
    </View>
  );
}

interface ChoiceCardProps {
  delay: number;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  borderColor: string;
  bgColor: string;
  onPress: () => void;
  loading: boolean;
  colors: ReturnType<typeof import('../../../theme/ThemeContext').useTheme>['colors'];
}

function ChoiceCard({ delay, icon, iconBg, title, desc, borderColor, bgColor, onPress, loading, colors }: ChoiceCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay }}
    >
      <Pressable
        onPress={onPress}
        disabled={loading}
        style={[styles.choiceCard, { backgroundColor: bgColor, borderColor }]}
      >
        <View style={[styles.choiceIcon, { backgroundColor: iconBg }]}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.choiceTitle, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.choiceDesc, { color: colors.textSecondary }]}>{desc}</Text>
        </View>
        {loading && <ActivityIndicator size="small" color={colors.accent} />}
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  cardSub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  ghostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ghostBtnText: { fontSize: 14, fontWeight: '600' },
  qrWrapper: { padding: 16, backgroundColor: '#ffffff', borderRadius: 16 },
  codeLabel: { fontSize: 12, marginTop: 4 },
  code: { fontSize: 32, fontWeight: '800', letterSpacing: 8 },
  choiceCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1.5,
  },
  choiceIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceTitle: { fontSize: 15, fontWeight: '700' },
  choiceDesc: { fontSize: 13, marginTop: 2 },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    width: '100%',
    justifyContent: 'center',
  },
  scanBtnText: { fontSize: 15, fontWeight: '700' },
  orDivider: { fontSize: 18, textAlign: 'center' },
  codeInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 6,
    textAlign: 'center',
    width: '100%',
  },
  primaryBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, fontWeight: '600', flex: 1 },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    paddingTop: 80,
    gap: 24,
  },
  scanHint: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 32,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scanFrame: {
    width: 220,
    height: 220,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 20,
    opacity: 0.9,
  },
  scanClose: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
