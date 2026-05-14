'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../../ui';
import { useModuleComplete } from '../../../lib/useModuleComplete';
import {
  DuoNavBar,
  DuoBumpStep,
  DuoConnectedStep,
  DuoPactStep,
  DuoFillingStep,
  DuoWaitingStep,
  DuoReadyStep,
  DuoRevealStep,
  DuoSummaryStep,
} from '../../duo';
import { useDuoStore } from '../../../stores/duoStore';
import { PersonalProfile } from '../../../types';
import { useTranslation } from '../../../i18n';
import { calculateCommonGround } from './utils';
import { useDuoSession } from './hooks/useDuoSession';
import { ConnectionChoice } from './components/ConnectionChoice';
import { QRFallback } from './components/QRFallback';

interface DuoSpaceScreenProps {
  personalProfile: PersonalProfile;
  onUpdateComfort: (category: 'tenderness' | 'intensity' | 'trust', itemId: string, value: number) => void;
  onUpdateSafeword: (safeword: string) => void;
  onBack: () => void;
  onComplete?: () => void;
}

export function DuoSpaceScreen({
  personalProfile,
  onUpdateComfort,
  onUpdateSafeword,
  onBack,
  onComplete,
}: DuoSpaceScreenProps) {
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const session = useDuoSession();
  const preferenceMatches = useDuoStore((s) => s.cachedResult?.preferenceMatches ?? []);

  const commonGround = session.partnerProfile
    ? calculateCommonGround(personalProfile, session.partnerProfile)
    : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
      <DuoNavBar
        currentStep={session.duoStep}
        onBack={onBack}
        onReset={session.handleReset}
        onGoToStep={session.handleGoToStep}
      />

      <AnimatePresence mode="wait">
        {session.duoStep === 'choice' && (
          <ConnectionChoice
            key="choice"
            onBump={() => session.handleGoToStep('bump')}
            onQR={() => session.handleGoToStep('qr-fallback')}
          />
        )}

        {session.duoStep === 'bump' && (
          <DuoBumpStep
            key="bump"
            onBumpSuccess={session.handleBumpSuccess}
            onFallbackQR={session.handleFallbackQR}
          />
        )}

        {session.duoStep === 'qr-fallback' && (
          <QRFallback
            key="qr-fallback"
            connectionMode={session.connectionMode}
            generatedCode={session.generatedCode}
            inputCode={session.inputCode}
            isScanning={session.isScanning}
            copied={session.copied}
            onBack={() => session.handleGoToStep('choice')}
            onSetMode={session.setConnectionMode}
            onSetInputCode={session.setInputCode}
            onSetGeneratedCode={session.setGeneratedCode}
            onSetScanning={session.setIsScanning}
            onSetCopied={session.setCopied}
            onConnect={session.handleConnect}
          />
        )}

        {session.duoStep === 'connected' && (
          <DuoConnectedStep key="connected" partnerName={session.partnerName} onComplete={session.handleConnectionComplete} />
        )}

        {session.duoStep === 'pact' && (
          <DuoPactStep key="pact" partnerName={session.partnerName} onAccept={session.handlePactAccepted} />
        )}

        {session.duoStep === 'filling' && (
          <DuoFillingStep
            key="filling"
            partnerName={session.partnerName}
            personalProfile={personalProfile}
            onUpdateComfort={onUpdateComfort}
            onUpdateSafeword={onUpdateSafeword}
            onComplete={session.handleFillingComplete}
          />
        )}

        {session.duoStep === 'waiting' && (
          <DuoWaitingStep key="waiting" partnerName={session.partnerName} onPartnerReady={session.handlePartnerReady} />
        )}

        {session.duoStep === 'ready' && (
          <DuoReadyStep key="ready" partnerName={session.partnerName} onReveal={session.handleRevealStart} />
        )}

        {session.duoStep === 'reveal' && commonGround && (
          <DuoRevealStep key="reveal" commonGround={commonGround} onComplete={session.handleRevealComplete} />
        )}

        {session.duoStep === 'summary' && commonGround && (
          <motion.div key="summary">
            <DuoSummaryStep
              commonGround={commonGround}
              personalProfile={personalProfile}
              partnerName={session.partnerName}
              partnerSafeword={session.partnerSafeword}
              preferenceMatches={preferenceMatches}
            />
            <div className="px-5 pb-6 space-y-3">
              {onComplete && (
                <Button onClick={() => { complete('duo-flow'); onComplete(); }} fullWidth>
                  <Sparkles size={16} />
                  {t('duo.seeCard')}
                </Button>
              )}
              <Button onClick={session.handleReset} fullWidth variant="ghost">
                <ArrowLeft size={18} />
                {t('duo.newSession')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
