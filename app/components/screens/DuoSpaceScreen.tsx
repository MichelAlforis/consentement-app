'use client';

import { useState, useCallback } from 'react';
import { isCapacitor } from '../../lib/platform';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, QrCode, Link2, Lightbulb, CheckCircle2,
  Camera, Copy, Loader2, Check, ArrowLeft, Wifi
} from 'lucide-react';
import { Button, Card, QRCode } from '../ui';
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
} from '../duo';
import { comfortCategories } from '../../data';
import { PersonalProfile, CommonGround, DuoStep, PartnerProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface DuoSpaceScreenProps {
  personalProfile: PersonalProfile;
  onUpdateComfort: (category: 'tenderness' | 'intensity' | 'trust', itemId: string, value: number) => void;
  onUpdateSafeword: (safeword: string) => void;
  onBack: () => void;
}

type ConnectionMode = 'choice' | 'generate' | 'scan' | 'manual';

function generatePartnerProfile(): PartnerProfile {
  const profile: PartnerProfile = { tenderness: {}, intensity: {}, trust: {} };
  const baseComfort = Math.random() > 0.5 ? 3 : 2;
  const variance = () => Math.floor(Math.random() * 2) - 1;

  (Object.keys(comfortCategories) as Array<keyof typeof comfortCategories>).forEach(cat => {
    const categoryMod = cat === 'tenderness' ? 1 : cat === 'intensity' ? 0 : -1;
    comfortCategories[cat].items.forEach(item => {
      let itemMod = 0;
      if (['kisses', 'cuddles', 'holding', 'words'].includes(item.id)) itemMod = 1;
      if (['filming', 'power', 'restraint'].includes(item.id)) itemMod = -1;
      const value = Math.max(0, Math.min(4, baseComfort + categoryMod + itemMod + variance()));
      profile[cat][item.id] = value;
    });
  });
  return profile;
}

function calculateCommonGround(personal: PersonalProfile, partner: PartnerProfile): CommonGround {
  const common: CommonGround = { tenderness: {}, intensity: {}, trust: {} };

  (Object.keys(comfortCategories) as Array<keyof typeof comfortCategories>).forEach(cat => {
    comfortCategories[cat].items.forEach(item => {
      const myLevel = personal[cat][item.id] || 0;
      const partnerLevel = partner[cat][item.id] || 0;
      common[cat][item.id] = {
        level: Math.min(myLevel, partnerLevel),
        compatible: myLevel >= 2 && partnerLevel >= 2
      };
    });
  });

  return common;
}

const partnerNames = ['Alex', 'Charlie', 'Sam', 'Jordan', 'Morgan', 'Taylor'];

export function DuoSpaceScreen({
  personalProfile,
  onUpdateComfort,
  onUpdateSafeword,
  onBack,
}: DuoSpaceScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('choice');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  const [duoStep, setDuoStep] = useState<DuoStep>('choice');
  const [partnerName] = useState(() => partnerNames[Math.floor(Math.random() * partnerNames.length)]);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [partnerSafeword] = useState(() => ['Rouge', 'Stop', 'Pause', 'Ananas'][Math.floor(Math.random() * 4)]);

  const isCodeValid = inputCode.length === 6;

  const handleBumpSuccess = useCallback(() => {
    setPartnerProfile(generatePartnerProfile());
    setDuoStep('connected');
  }, []);

  const handleFallbackQR = useCallback(() => {
    setDuoStep('qr-fallback');
    setConnectionMode('choice');
  }, []);

  const handleGenerateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setConnectionMode('generate');
  };

  const handleCopyCode = async () => {
    try {
      if (isCapacitor()) {
        const { Clipboard } = await import('@capacitor/clipboard');
        await Clipboard.write({ string: generatedCode });
      } else {
        await navigator.clipboard.writeText(generatedCode);
      }
    } catch { /* code visible à l'écran */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartScan = () => {
    setConnectionMode('scan');
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setTimeout(() => {
        handleConnect();
      }, 500);
    }, 2500);
  };

  const handleConnect = useCallback(() => {
    setPartnerProfile(generatePartnerProfile());
    setDuoStep('connected');
  }, []);

  const handleConnectionComplete = useCallback(() => setDuoStep('pact'), []);
  const handlePactAccepted = useCallback(() => setDuoStep('filling'), []);
  const handleFillingComplete = useCallback(() => setDuoStep('waiting'), []);
  const handlePartnerReady = useCallback(() => setDuoStep('ready'), []);
  const handleRevealStart = useCallback(() => setDuoStep('reveal'), []);
  const handleRevealComplete = useCallback(() => setDuoStep('summary'), []);

  const commonGround = partnerProfile
    ? calculateCommonGround(personalProfile, partnerProfile)
    : null;

  const handleReset = () => {
    setDuoStep('choice');
    setConnectionMode('choice');
    setPartnerProfile(null);
    setInputCode('');
    setGeneratedCode('');
  };

  const handleGoToStep = useCallback((step: DuoStep) => {
    if (!partnerProfile && ['connected', 'pact', 'filling', 'waiting', 'ready', 'reveal', 'summary'].includes(step)) {
      setPartnerProfile(generatePartnerProfile());
    }
    setDuoStep(step);
  }, [partnerProfile]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full flex flex-col"
    >
      <DuoNavBar
        currentStep={duoStep}
        onBack={onBack}
        onReset={handleReset}
        onGoToStep={handleGoToStep}
      />

      <AnimatePresence mode="wait">
        {duoStep === 'choice' && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3"
            >
              <Users size={28} className="text-purple-500 mt-1 shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                  {t('duo.title')}
                </h2>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  {t('duo.subtitle')}
                </p>
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card
                  variant="elevated"
                  padding="lg"
                  onClick={() => setDuoStep('bump')}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Wifi size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>{t('duo.bump.title')}</h3>
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                          {t('duo.bump.tag')}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: colors.textMuted }}>
                        {t('duo.bump.desc')}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 py-2"
              >
                <div className="flex-1 h-px" style={{ background: colors.divider }} />
                <span className="text-sm" style={{ color: colors.textMuted }}>{t('duo.or')}</span>
                <div className="flex-1 h-px" style={{ background: colors.divider }} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card
                  variant="elevated"
                  padding="md"
                  onClick={() => setDuoStep('qr-fallback')}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: colors.bgSecondary }}>
                      <QrCode size={24} style={{ color: colors.textSecondary }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{t('duo.qr.title')}</h3>
                      <p className="text-xs" style={{ color: colors.textMuted }}>{t('duo.qr.desc')}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <Card variant="default" padding="lg">
                  <p className="font-medium mb-3 flex items-center gap-2" style={{ color: colors.textSecondary }}>
                    <Lightbulb size={18} className="text-amber-500" />
                    {t('duo.how.title')}
                  </p>
                  <ol className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
                    {(['step1', 'step2', 'step3', 'step4'] as const).map((step, i) => (
                      <li key={step} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        {t(`duo.how.${step}`)}
                      </li>
                    ))}
                  </ol>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {duoStep === 'bump' && (
          <DuoBumpStep
            key="bump"
            onBumpSuccess={handleBumpSuccess}
            onFallbackQR={handleFallbackQR}
          />
        )}

        {duoStep === 'qr-fallback' && (
          <motion.div
            key="qr-fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <button
                onClick={() => setDuoStep('choice')}
                className="flex items-center gap-2 mb-4"
                style={{ color: colors.textMuted }}
              >
                <ArrowLeft size={18} />
                <span className="text-sm">{t('duo.back')}</span>
              </button>
              <h2 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {t('duo.qrFallback.title')}
              </h2>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                {t('duo.qrFallback.subtitle')}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {connectionMode === 'choice' && (
                <motion.div
                  key="qr-choice"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  <Card
                    variant="elevated"
                    padding="md"
                    onClick={handleGenerateCode}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: colors.bgSecondary }}>
                        <QrCode size={24} style={{ color: colors.accent }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{t('duo.generate.title')}</h3>
                        <p className="text-xs" style={{ color: colors.textMuted }}>{t('duo.generate.desc')}</p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    variant="elevated"
                    padding="md"
                    onClick={handleStartScan}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: colors.bgSecondary }}>
                        <Camera size={24} style={{ color: colors.accent }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{t('duo.scan.title')}</h3>
                        <p className="text-xs" style={{ color: colors.textMuted }}>{t('duo.scan.desc')}</p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    variant="elevated"
                    padding="md"
                    onClick={() => setConnectionMode('manual')}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: colors.bgSecondary }}>
                        <Link2 size={24} style={{ color: colors.textSecondary }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{t('duo.manual.title')}</h3>
                        <p className="text-xs" style={{ color: colors.textMuted }}>{t('duo.manual.desc')}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {connectionMode === 'generate' && (
                <motion.div
                  key="generate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card variant="elevated" className="text-center mb-4">
                    <div className="flex justify-center mb-4">
                      <QRCode size={140} />
                    </div>
                    <div className="rounded-xl p-3 mb-3" style={{ background: colors.bgSecondary }}>
                      <p className="text-xs mb-1" style={{ color: colors.accent }}>{t('duo.generate.codeLabel')}</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-mono font-bold tracking-[0.3em]" style={{ color: colors.accent }}>
                          {generatedCode}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="p-2 rounded-lg transition-colors"
                          style={{ background: colors.bgSecondary, color: colors.accent }}
                        >
                          {copied ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <Copy size={18} style={{ color: colors.accent }} />
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>

                  <Card variant="warning" padding="sm" className="mb-4">
                    <div className="flex items-center gap-3">
                      <Loader2 size={18} className="text-amber-600 animate-spin" />
                      <p className="text-sm" style={{ color: colors.textSecondary }}>{t('duo.generate.waiting')}</p>
                    </div>
                  </Card>

                  <Button onClick={handleConnect} fullWidth variant="secondary" className="mb-2">
                    <CheckCircle2 size={18} />
                    {t('duo.generate.simulate')}
                  </Button>
                  <Button onClick={() => setConnectionMode('choice')} fullWidth variant="ghost">
                    {t('duo.back')}
                  </Button>
                </motion.div>
              )}

              {connectionMode === 'scan' && (
                <motion.div
                  key="scan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card variant="elevated" className="text-center mb-4 overflow-hidden">
                    <div className="relative bg-gray-900 rounded-xl aspect-square max-w-[240px] mx-auto flex items-center justify-center">
                      <div className="absolute top-3 left-3 w-10 h-10 border-l-4 border-t-4 rounded-tl-lg" style={{ borderColor: colors.accent }} />
                      <div className="absolute top-3 right-3 w-10 h-10 border-r-4 border-t-4 rounded-tr-lg" style={{ borderColor: colors.accent }} />
                      <div className="absolute bottom-3 left-3 w-10 h-10 border-l-4 border-b-4 rounded-bl-lg" style={{ borderColor: colors.accent }} />
                      <div className="absolute bottom-3 right-3 w-10 h-10 border-r-4 border-b-4 rounded-br-lg" style={{ borderColor: colors.accent }} />

                      {isScanning && (
                        <motion.div
                          className="absolute left-6 right-6 h-0.5 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                          style={{ background: colors.accent }}
                          animate={{ y: [-80, 80] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}

                      <div className="text-center">
                        {isScanning ? (
                          <Camera size={40} className="text-purple-400" />
                        ) : (
                          <CheckCircle2 size={40} className="text-green-400" />
                        )}
                      </div>
                    </div>
                  </Card>

                  {isScanning && (
                    <Button onClick={() => setConnectionMode('choice')} fullWidth variant="ghost">
                      {t('duo.scan.cancel')}
                    </Button>
                  )}
                </motion.div>
              )}

              {connectionMode === 'manual' && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card variant="elevated" padding="lg" className="mb-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
                      <Link2 size={18} style={{ color: colors.accent }} />
                      {t('duo.generate.codeLabel')}
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="000000"
                        maxLength={6}
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                        className={`w-full px-4 py-4 rounded-xl border-2 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none transition-colors ${
                          isCodeValid ? 'border-green-400 bg-green-50' : ''
                        }`}
                        style={!isCodeValid ? {
                          borderColor: inputCode.length > 0 ? colors.accent : colors.border,
                          background: inputCode.length > 0 ? `${colors.bgSecondary}80` : undefined,
                        } : {}}
                      />
                      {inputCode.length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          {isCodeValid ? (
                            <CheckCircle2 size={24} className="text-green-500" />
                          ) : (
                            <span className="text-sm font-medium" style={{ color: colors.accent }}>
                              {inputCode.length}/6
                            </span>
                          )}
                        </motion.div>
                      )}
                    </div>
                    <Button
                      onClick={handleConnect}
                      fullWidth
                      variant="secondary"
                      disabled={!isCodeValid}
                      className="mt-4"
                    >
                      {t('duo.manual.connect')}
                    </Button>
                  </Card>

                  <Button
                    onClick={() => {
                      setConnectionMode('choice');
                      setInputCode('');
                    }}
                    fullWidth
                    variant="ghost"
                  >
                    {t('duo.back')}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {duoStep === 'connected' && (
          <DuoConnectedStep
            key="connected"
            partnerName={partnerName}
            onComplete={handleConnectionComplete}
          />
        )}

        {duoStep === 'pact' && (
          <DuoPactStep
            key="pact"
            partnerName={partnerName}
            onAccept={handlePactAccepted}
          />
        )}

        {duoStep === 'filling' && (
          <DuoFillingStep
            key="filling"
            partnerName={partnerName}
            personalProfile={personalProfile}
            onUpdateComfort={onUpdateComfort}
            onUpdateSafeword={onUpdateSafeword}
            onComplete={handleFillingComplete}
          />
        )}

        {duoStep === 'waiting' && (
          <DuoWaitingStep
            key="waiting"
            partnerName={partnerName}
            onPartnerReady={handlePartnerReady}
          />
        )}

        {duoStep === 'ready' && (
          <DuoReadyStep
            key="ready"
            partnerName={partnerName}
            onReveal={handleRevealStart}
          />
        )}

        {duoStep === 'reveal' && commonGround && (
          <DuoRevealStep
            key="reveal"
            commonGround={commonGround}
            onComplete={handleRevealComplete}
          />
        )}

        {duoStep === 'summary' && commonGround && (
          <motion.div key="summary">
            <DuoSummaryStep
              commonGround={commonGround}
              personalProfile={personalProfile}
              partnerName={partnerName}
              partnerSafeword={partnerSafeword}
            />
            <div className="px-5 pb-6">
              <Button onClick={handleReset} fullWidth variant="ghost">
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
