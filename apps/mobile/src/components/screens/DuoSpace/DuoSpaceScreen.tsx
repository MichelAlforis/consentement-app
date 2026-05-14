// V4 divergence: realtime stub — useDuoStore (Zustand) pour état persisté, PB realtime TODO Phase 7
// V4 divergence: QR via react-native-qrcode-svg (pas de canvas 2D browser)
// V4 divergence: AccordFlow overlay → TODO Phase 7 (dépend CollectorCardCanvas)
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronLeft, Link2, LogOut, QrCode, UserCheck } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigationStore, useDuoStore } from '@ouiclair/core';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';

// TODO Phase 7: AccordFlow overlay — affichage CommonGround + carte accord + CollectorCardCanvas

type DuoView = 'choice' | 'create' | 'join';

function makeSessionCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function DuoSpaceScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const goBack = useNavigationStore((s) => s.goBack);
  const duoConnected = useDuoStore((s) => s.duoConnected);
  const connectDuo = useDuoStore((s) => s.connectDuo);
  const resetDuo = useDuoStore((s) => s.reset);

  // Local UI state — non persisté, réinitialisé à chaque montage
  const [view, setView] = useState<DuoView>('choice');
  const [sessionCode, setSessionCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [qrError, setQrError] = useState(false);

  const handleCreate = () => {
    setQrError(false);
    setSessionCode(makeSessionCode());
    setView('create');
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) return;
    connectDuo(code); // useDuoStore → duoConnected = true
  };

  const handleDisconnect = () => {
    resetDuo();
    setSessionCode('');
    setJoinCode('');
    setView('choice');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: insets.top }}>
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 12,
        }}
      >
        <Pressable onPress={goBack} hitSlop={8}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>
          {t('duo.title')}
        </Text>
      </MotiView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {duoConnected ? (
          /* ── État connecté ── */
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              backgroundColor: colors.bgCard,
              borderRadius: 20,
              padding: 28,
              borderWidth: 1.5,
              borderColor: colors.accent,
              alignItems: 'center',
              gap: 16,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: `${colors.accent}20`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserCheck size={32} color={colors.accent} />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.textPrimary,
                textAlign: 'center',
              }}
            >
              {t('duo.connected')}
            </Text>
            {/* TODO Phase 7: AccordFlow overlay — CommonGround + carte accord */}
            <Pressable
              onPress={handleDisconnect}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.bgSecondary,
              }}
            >
              <LogOut size={16} color={colors.textMuted} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textMuted }}>
                {t('duo.disconnect')}
              </Text>
            </Pressable>
          </MotiView>
        ) : view === 'choice' ? (
          /* ── Choix créer / rejoindre ── */
          <View style={{ gap: 16 }}>
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 80 }}
            >
              <Pressable
                onPress={handleCreate}
                style={{
                  backgroundColor: colors.bgCard,
                  borderRadius: 16,
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  borderWidth: 1.5,
                  borderColor: colors.accent,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: `${colors.accent}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <QrCode size={24} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}
                  >
                    {t('duo.createSession')}
                  </Text>
                </View>
              </Pressable>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 150 }}
            >
              <Pressable
                onPress={() => setView('join')}
                style={{
                  backgroundColor: colors.bgCard,
                  borderRadius: 16,
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  borderWidth: 1,
                  borderColor: colors.divider,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: colors.bgSecondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Link2 size={24} color={colors.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}
                  >
                    {t('duo.joinSession')}
                  </Text>
                </View>
              </Pressable>
            </MotiView>
          </View>
        ) : view === 'create' ? (
          /* ── QR code de session ── */
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={{
              backgroundColor: colors.bgCard,
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: colors.divider,
              alignItems: 'center',
              gap: 20,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>
              {t('duo.scanQR')}
            </Text>

            {!qrError ? (
              <View style={{ padding: 16, backgroundColor: '#ffffff', borderRadius: 16 }}>
                <QRCode
                  value={sessionCode}
                  size={200}
                  onError={() => setQrError(true)}
                />
              </View>
            ) : null}

            <Text style={{ fontSize: 12, color: colors.textMuted }}>
              {t('duo.shareCode')}
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '800',
                letterSpacing: 8,
                color: colors.accent,
              }}
            >
              {sessionCode}
            </Text>

            {__DEV__ && (
              <Pressable
                onPress={() => {
                  // TODO Phase 6C: remplacer par useDuoSession realtime via
                  // IRealtimeAdapter + react-native-sse. Mock pour test du flow connected.
                  setTimeout(() => connectDuo(sessionCode), 1500);
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.textMuted,
                  borderStyle: 'dashed',
                }}
              >
                <Text
                  style={{ fontSize: 11, fontWeight: '600', color: colors.textMuted, textAlign: 'center' }}
                >
                  [DEV] Simuler connexion partenaire
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => setView('choice')}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: colors.bgSecondary,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textMuted }}>
                {t('duo.cancel')}
              </Text>
            </Pressable>
          </MotiView>
        ) : (
          /* ── Saisie du code partenaire ── */
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={{
              backgroundColor: colors.bgCard,
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: colors.divider,
              gap: 16,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>
              {t('duo.enterCode')}
            </Text>
            <TextInput
              value={joinCode}
              onChangeText={(v) => setJoinCode(v.toUpperCase())}
              placeholder="ABC123"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              maxLength={6}
              style={{
                borderWidth: 1.5,
                borderColor: colors.accent,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 24,
                fontWeight: '700',
                letterSpacing: 6,
                color: colors.textPrimary,
                textAlign: 'center',
              }}
            />
            <Pressable
              onPress={handleJoin}
              style={{
                backgroundColor: colors.accent,
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: 'center',
                opacity: joinCode.trim().length === 6 ? 1 : 0.5,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
                {t('duo.joinSession')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setView('choice')}
              style={{ alignItems: 'center', paddingVertical: 8 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textMuted }}>
                {t('duo.cancel')}
              </Text>
            </Pressable>
          </MotiView>
        )}
      </ScrollView>
    </View>
  );
}
