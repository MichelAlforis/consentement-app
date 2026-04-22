import { useState, useCallback } from 'react';
import { DuoStep, PartnerProfile } from '../../../../types';
import { generatePartnerProfile, PARTNER_NAMES, PARTNER_SAFEWORDS } from '../utils';

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
  setConnectionMode: (mode: ConnectionMode) => void;
  setGeneratedCode: (code: string) => void;
  setInputCode: (code: string) => void;
  setIsScanning: (v: boolean) => void;
  setCopied: (v: boolean) => void;
  handleConnect: () => void;
  handleBumpSuccess: () => void;
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

  const [partnerName] = useState(
    () => PARTNER_NAMES[Math.floor(Math.random() * PARTNER_NAMES.length)]
  );
  const [partnerSafeword] = useState(
    () => PARTNER_SAFEWORDS[Math.floor(Math.random() * PARTNER_SAFEWORDS.length)]
  );

  const handleConnect = useCallback(() => {
    setPartnerProfile(generatePartnerProfile());
    setDuoStep('connected');
  }, []);

  const handleBumpSuccess = useCallback(() => {
    setPartnerProfile(generatePartnerProfile());
    setDuoStep('connected');
  }, []);

  const handleFallbackQR = useCallback(() => {
    setDuoStep('qr-fallback');
    setConnectionMode('choice');
  }, []);

  const handleReset = useCallback(() => {
    setDuoStep('choice');
    setConnectionMode('choice');
    setPartnerProfile(null);
    setInputCode('');
    setGeneratedCode('');
  }, []);

  const handleGoToStep = useCallback(
    (step: DuoStep) => {
      if (
        !partnerProfile &&
        ['connected', 'pact', 'filling', 'waiting', 'ready', 'reveal', 'summary'].includes(step)
      ) {
        setPartnerProfile(generatePartnerProfile());
      }
      setDuoStep(step);
    },
    [partnerProfile]
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
    handleRevealComplete: useCallback(() => setDuoStep('summary'), []),
    handleGoToStep,
    handleReset,
  };
}
