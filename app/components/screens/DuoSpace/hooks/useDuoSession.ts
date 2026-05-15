import { useState, useCallback, useEffect, useRef } from 'react';
import type { DuoStep, PartnerProfile } from '../../../../types';
import { PARTNER_NAMES, PARTNER_SAFEWORDS } from '../utils';
import { useProfileStore } from '../../../../stores/profileStore';
import { useAuthStore } from '../../../../stores/authStore';
import { useDuoStore } from '../../../../stores/duoStore';
import { usePreferencesStore } from '../../../../stores/preferencesStore';

export type ConnectionMode = 'choice' | 'generate' | 'scan' | 'manual';

interface DuoSession {
  duoStep: DuoStep;
  connectionMode: ConnectionMode;
  partnerName: string;
  partnerProfile: PartnerProfile | null;
  partnerSafeword: string;
  generatedCode: string;
  inputCode: string;
  isScanning: boolean;
  copied: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  setConnectionMode: (mode: ConnectionMode) => void;
  setGeneratedCode: (code: string) => void;
  setInputCode: (code: string) => void;
  setIsScanning: (v: boolean) => void;
  setCopied: (v: boolean) => void;
  handleConnect: () => void;
  handleBumpSuccess: (partnerProfile: PartnerProfile, sessionId: string) => void;
  handleFallbackQR: () => void;
  handleConnectionComplete: () => void;
  handlePactAccepted: () => void;
  handleFillingComplete: () => void;
  handlePartnerReady: () => void;
  handleRevealStart: () => void;
  handleRevealComplete: () => void;
  handleGoToStep: (step: DuoStep) => void;
  handleReset: () => void;
}

export function useDuoSession(): DuoSession {
  const [duoStep, setDuoStep] = useState<DuoStep>('choice');
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('choice');
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const personalProfile = useProfileStore((s) => s.personalProfile);
  const pbUserId = useAuthStore((s) => s.pbUserId);
  const { setPartnerProfile: storeDuoPartner, saveCachedResult } = useDuoStore();
  const preferencesAnswers = usePreferencesStore((s) => s.answers);

  const [partnerName] = useState(
    () => PARTNER_NAMES[Math.floor(Math.random() * PARTNER_NAMES.length)]
  );
  const [partnerSafeword] = useState(
    () => PARTNER_SAFEWORDS[Math.floor(Math.random() * PARTNER_SAFEWORDS.length)]
  );

  // Génère la session PocketBase quand le mode passe à 'generate'
  useEffect(() => {
    if (connectionMode !== 'generate' || !pbUserId) return;

    let cancelled = false;
    import('../../../../lib/sync/duoSync').then(({ createDuoSession, subscribeToSession }) => {
      if (cancelled) return;
      createDuoSession(personalProfile, pbUserId, preferencesAnswers as Record<string, string>).then(({ code, sessionId }) => {
        if (cancelled) return;
        setGeneratedCode(code);
        // Écoute l'arrivée du partenaire
        const unsub = subscribeToSession(sessionId, code, (record) => {
          if (record.partner_profile) {
            setPartnerProfile(record.partner_profile);
            storeDuoPartner(record.partner_profile, sessionId);
            setDuoStep('connected');
          }
        });
        unsubscribeRef.current = unsub;
      }).catch(() => {
        if (!cancelled) setConnectionError('Impossible de créer la session. Vérifiez votre connexion.');
      });
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionMode, pbUserId]);

  // Nettoyage de la subscription à la fin de session
  useEffect(() => {
    return () => { unsubscribeRef.current?.(); };
  }, []);

  const handleConnect = useCallback(() => {
    if (!pbUserId) {
      // Mode offline / sans PocketBase — connexion impossible
      setConnectionError('Connexion au serveur requise pour Notre Espace.');
      return;
    }
    if (inputCode.length !== 6) return;
    setIsConnecting(true);
    setConnectionError(null);

    import('../../../../lib/sync/duoSync').then(({ joinDuoSession }) => {
      joinDuoSession(inputCode, personalProfile, pbUserId, preferencesAnswers as Record<string, string>)
        .then(({ sessionId, initiatorProfile }) => {
          setPartnerProfile(initiatorProfile);
          storeDuoPartner(initiatorProfile, sessionId);
          setDuoStep('connected');
        })
        .catch(() => setConnectionError('Code invalide ou expiré.'))
        .finally(() => setIsConnecting(false));
    });
  }, [inputCode, personalProfile, pbUserId, preferencesAnswers, storeDuoPartner]);

  const handleBumpSuccess = useCallback((partnerProfile: PartnerProfile, sessionId: string) => {
    setPartnerProfile(partnerProfile);
    storeDuoPartner(partnerProfile, sessionId);
    setDuoStep('connected');
  }, [storeDuoPartner]);

  const handleFallbackQR = useCallback(() => {
    setDuoStep('qr-fallback');
    setConnectionMode('choice');
  }, []);

  const handleReset = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    setDuoStep('choice');
    setConnectionMode('choice');
    setPartnerProfile(null);
    setInputCode('');
    setGeneratedCode('');
    setConnectionError(null);
  }, []);

  const handleRevealComplete = useCallback(() => {
    if (partnerProfile) {
      saveCachedResult(partnerProfile, personalProfile, preferencesAnswers);
    }
    setDuoStep('summary');
  }, [partnerProfile, personalProfile, preferencesAnswers, saveCachedResult]);

  const handleGoToStep = useCallback(
    (step: DuoStep) => {
      setDuoStep(step);
    },
    []
  );

  return {
    duoStep,
    connectionMode,
    partnerName,
    partnerProfile,
    partnerSafeword,
    generatedCode,
    inputCode,
    isScanning,
    copied,
    isConnecting,
    connectionError,
    setConnectionMode,
    setGeneratedCode,
    setInputCode,
    setIsScanning,
    setCopied,
    handleConnect,
    handleBumpSuccess,
    handleFallbackQR,
    handleConnectionComplete: useCallback(() => setDuoStep('pact'), []),
    handlePactAccepted: useCallback(() => setDuoStep('filling'), []),
    handleFillingComplete: useCallback(() => setDuoStep('waiting'), []),
    handlePartnerReady: useCallback(() => setDuoStep('ready'), []),
    handleRevealStart: useCallback(() => setDuoStep('reveal'), []),
    handleRevealComplete,
    handleGoToStep,
    handleReset,
  };
}
