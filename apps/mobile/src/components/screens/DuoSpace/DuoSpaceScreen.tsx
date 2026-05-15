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
import * as Haptics from 'expo-haptics';
import { AlertCircle, Camera, ChevronLeft, LogOut, QrCode, Smartphone, UserCheck, Wifi, WifiOff, X } from 'lucide-react-native';
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
  generateBumpCode,
  uploadBumpSignal,
  findBumpSession,
  getSessionCode,
} from '@ouiclair/core';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';

type DuoView = 'choice' | 'waiting' | 'join' | 'scanning' | 'bump';

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
  const [bumpStatus, setBumpStatus] = useState<'searching' | 'timeout'>('searching');
  const [bumpRetryKey, setBumpRetryKey] = useState(0);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const unsubRef = useRef<(() => void) | null>(null);

  // Nettoyage global
  useEffect(() => {
    return () => {
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, []);

  // Haptic + feedback à la connexion réussie
  useEffect(() => {
    if (!duoConnected) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [duoConnected]);

  // Polling bump
  useEffect(() => {
    if (view !== 'bump') return;

    let cancelled = false;
    let createdSession: { code: string; sessionId: string } | null = null;
    let activeUnsub: (() => void) | null = null;
    let attempts = 0;
    const MAX_POLLS = 3;

    setBumpStatus('searching');

    const stopBumpPolling = () => {
      cancelled = true;
      activeUnsub?.();
      activeUnsub = null;
    };

    const poll = async () => {
      if (cancelled || attempts >= MAX_POLLS) {
        if (!cancelled) setBumpStatus('timeout');
        return;
      }

      if (attempts > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      attempts++;

      let uid: string;
      try { uid = await ensureAuth(); } catch { return; }
      if (cancelled) return;

      const prefs = Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, String(v)]));
      const prefsArg = Object.keys(prefs).length > 0 ? prefs : undefined;

      if (!createdSession && !cancelled) {
        try {
          const session = await createDuoSession(personalProfile, uid, prefsArg);
          if (cancelled) return;
          createdSession = session;
          await uploadBumpSignal(session.sessionId, generateBumpCode());

          activeUnsub = subscribeToSession(session.sessionId, session.code, (record) => {
            if (record.partner_profile && !cancelled) {
              setPartnerProfile(record.partner_profile, session.sessionId);
              stopBumpPolling();
            }
          });
        } catch {
          createdSession = null;
          setError(t('duo.errorNetwork'));
        }
      }

      if (!cancelled) {
        try {
          const sessionId = await findBumpSession(createdSession?.sessionId);
          if (cancelled) return;
          if (sessionId) {
            const code = await getSessionCode(sessionId);
            if (cancelled) return;
            const { sessionId: sid, initiatorProfile } = await joinDuoSession(code, personalProfile, uid, prefsArg);
            if (cancelled) return;
            setPartnerProfile(initiatorProfile, sid);
            stopBumpPolling();
            return;
          }
        } catch {
          setError(t('duo.errorNetwork'));
        }
      }

      if (!cancelled) setTimeout(poll, 2000);
    };

    poll();

    return () => {
      cancelled = true;
      activeUnsub?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, bumpRetryKey]);

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

  const handleCancelBump = () => {
    setView('choice');
    setBumpStatus('searching');
  };

  const handleRetryBump = () => {
    setBumpStatus('searching');
    setBumpRetryKey((k) => k + 1);
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
        <Pressable onPress={view === 'bump' ? handleCancelBump : goBack} hitSlop={12}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('duo.title')}
        </Text>
      </MotiView>

      {/* Camera (overlay plein écran) */}
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
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bandeau erreur */}
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
            from={{ opacity: 0, scale: 0.92 }}
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
          <View style={{ gap: 14 }}>
            <ChoiceCard
              delay={0}
              icon={<Wifi size={24} color={colors.accent} />}
              iconBg={`${colors.accent}20`}
              title={t('duo.bump.title')}
              desc={t('duo.bump.desc')}
              borderColor={colors.accent}
              bgColor={colors.bgCard}
              badge={t('duo.bump.tag')}
              onPress={() => { setBumpStatus('searching'); setView('bump'); }}
              loading={false}
              colors={colors}
            />
            <ChoiceCard
              delay={80}
              icon={<QrCode size={22} color={colors.textSecondary} />}
              iconBg={colors.bgSecondary}
              title={t('duo.createSession')}
              desc={t('duo.createSessionDesc')}
              borderColor={colors.divider}
              bgColor={colors.bgCard}
              onPress={handleCreate}
              loading={loading}
              colors={colors}
            />
            <ChoiceCard
              delay={140}
              icon={<Camera size={22} color={colors.textSecondary} />}
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
                <QRCode value={sessionCode} size={200} onError={() => setQrError(true)} />
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
              {loading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.primaryBtnText}>{t('duo.join')}</Text>
              }
            </Pressable>

            <Pressable onPress={() => { setJoinCode(''); setView('choice'); }} style={styles.textLink}>
              <Text style={[styles.textLinkText, { color: colors.textMuted }]}>
                {t('duo.cancel')}
              </Text>
            </Pressable>
          </MotiView>

        ) : view === 'bump' ? (
          /* ── Magic Pair ── */
          <View style={styles.bumpFull}>
            {bumpStatus === 'searching' ? (
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 400 }}
                style={styles.bumpInner}
              >
                {/* Animation pulse rings */}
                <View style={styles.bumpRingsContainer}>
                  {[0, 1, 2].map((i) => (
                    <MotiView
                      key={i}
                      from={{ scale: 1, opacity: 0.55 }}
                      animate={{ scale: 2.8, opacity: 0 }}
                      transition={{
                        type: 'timing',
                        duration: 2200,
                        delay: i * 730,
                        loop: true,
                      }}
                      style={[styles.bumpRing, { borderColor: colors.accent }]}
                    />
                  ))}

                  {/* Icône centrale */}
                  <View style={[styles.bumpCenter, { backgroundColor: `${colors.accent}20` }]}>
                    <Wifi size={30} color={colors.accent} />
                  </View>

                  {/* Téléphones de chaque côté */}
                  <MotiView
                    from={{ translateX: -32 }}
                    animate={{ translateX: -18 }}
                    transition={{ type: 'spring', loop: true, repeatReverse: true, stiffness: 60, damping: 14 }}
                    style={[styles.bumpPhone, styles.bumpPhoneLeft]}
                  >
                    <Smartphone size={18} color={colors.accent} />
                  </MotiView>

                  <MotiView
                    from={{ translateX: 32 }}
                    animate={{ translateX: 18 }}
                    transition={{ type: 'spring', loop: true, repeatReverse: true, stiffness: 60, damping: 14 }}
                    style={[styles.bumpPhone, styles.bumpPhoneRight]}
                  >
                    <Smartphone size={18} color={colors.textSecondary} />
                  </MotiView>
                </View>

                <Text style={[styles.bumpTitle, { color: colors.textPrimary }]}>
                  {t('duo.bump.instruction')}
                </Text>
                <Text style={[styles.bumpSub, { color: colors.textSecondary }]}>
                  {t('duo.bump.sub')}
                </Text>

                {/* Dots pulsants */}
                <View style={styles.dotsRow}>
                  {[0, 1, 2].map((i) => (
                    <MotiView
                      key={i}
                      from={{ opacity: 0.2, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: 'timing',
                        duration: 650,
                        delay: i * 217,
                        loop: true,
                        repeatReverse: true,
                      }}
                      style={[styles.dot, { backgroundColor: colors.accent }]}
                    />
                  ))}
                </View>

                <Text style={[styles.bumpSearching, { color: colors.textMuted }]}>
                  {t('duo.bump.searching')}
                </Text>

                <View style={styles.bumpActions}>
                  <Pressable
                    onPress={() => setView('join')}
                    style={[styles.ghostBtn, { backgroundColor: colors.bgSecondary }]}
                  >
                    <QrCode size={16} color={colors.textMuted} />
                    <Text style={[styles.ghostBtnText, { color: colors.textMuted }]}>
                      {t('duo.bump.useQr')}
                    </Text>
                  </Pressable>

                  <Pressable onPress={handleCancelBump} style={styles.textLink}>
                    <Text style={[styles.textLinkText, { color: colors.textMuted }]}>
                      {t('duo.cancel')}
                    </Text>
                  </Pressable>
                </View>
              </MotiView>
            ) : (
              /* ── Timeout ── */
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                style={styles.bumpInner}
              >
                <View style={[styles.iconCircle, { backgroundColor: `${colors.error ?? '#ef4444'}15` }]}>
                  <WifiOff size={32} color={colors.error ?? '#ef4444'} />
                </View>

                <Text style={[styles.bumpTitle, { color: colors.textPrimary }]}>
                  {t('duo.bump.timeoutTitle')}
                </Text>
                <Text style={[styles.bumpSub, { color: colors.textSecondary }]}>
                  {t('duo.bump.timeoutSub')}
                </Text>

                <View style={styles.bumpActions}>
                  <Pressable
                    onPress={() => setView('join')}
                    style={[styles.primaryBtn, { backgroundColor: colors.accent, width: '100%' }]}
                  >
                    <Text style={styles.primaryBtnText}>{t('duo.bump.useQr')}</Text>
                  </Pressable>

                  <Pressable onPress={handleRetryBump} style={styles.textLink}>
                    <Text style={[styles.textLinkText, { color: colors.textMuted }]}>
                      {t('duo.bump.retry')}
                    </Text>
                  </Pressable>
                </View>
              </MotiView>
            )}
          </View>
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
  badge?: string;
  onPress: () => void;
  loading: boolean;
  colors: ReturnType<typeof import('../../../theme/ThemeContext').useTheme>['colors'];
}

function ChoiceCard({ delay, icon, iconBg, title, desc, borderColor, bgColor, badge, onPress, loading, colors }: ChoiceCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 320, delay }}
    >
      <Pressable
        onPress={onPress}
        disabled={loading}
        style={[styles.choiceCard, { backgroundColor: bgColor, borderColor }]}
      >
        {badge ? (
          <View style={[styles.choiceBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.choiceBadgeText}>{badge}</Text>
          </View>
        ) : null}
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

  textLink: { paddingVertical: 12, alignItems: 'center' },
  textLinkText: { fontSize: 14 },

  qrWrapper: { padding: 16, backgroundColor: '#ffffff', borderRadius: 16 },
  codeLabel: { fontSize: 12, marginTop: 4 },
  code: { fontSize: 32, fontWeight: '800', letterSpacing: 8 },

  choiceCard: {
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    overflow: 'visible',
  },
  choiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceTitle: { fontSize: 15, fontWeight: '700' },
  choiceDesc: { fontSize: 12, marginTop: 2, lineHeight: 17 },
  choiceBadge: {
    position: 'absolute',
    top: -11,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    zIndex: 1,
  },
  choiceBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },

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

  /* ── Bump full-screen ── */
  bumpFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bumpInner: {
    alignItems: 'center',
    gap: 18,
    width: '100%',
  },
  bumpRingsContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bumpRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
  },
  bumpCenter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bumpPhone: {
    position: 'absolute',
    top: '50%',
    marginTop: -12,
  },
  bumpPhoneLeft: { left: 0 },
  bumpPhoneRight: { right: 0 },
  bumpTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  bumpSub: { fontSize: 14, textAlign: 'center', lineHeight: 21, maxWidth: 260 },
  bumpSearching: { fontSize: 13 },
  bumpActions: { width: '100%', alignItems: 'center', gap: 4, marginTop: 8 },

  dotsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },

  /* ── Scan camera ── */
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
