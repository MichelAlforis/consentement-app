'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, QrCode, Link2, Lightbulb, CheckCircle2,
  Camera, Copy, Loader2, Check, ArrowLeft, Smartphone, Wifi
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

interface DuoSpaceScreenProps {
  personalProfile: PersonalProfile;
  onUpdateComfort: (category: 'tenderness' | 'intensity' | 'trust', itemId: string, value: number) => void;
  onUpdateSafeword: (safeword: string) => void;
  onBack: () => void;
}

type ConnectionMode = 'choice' | 'generate' | 'scan' | 'manual';

// Générateur de profil partenaire réaliste
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

// Calcul du common ground
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

// Noms de partenaires simulés
const partnerNames = ['Alex', 'Charlie', 'Sam', 'Jordan', 'Morgan', 'Taylor'];

export function DuoSpaceScreen({
  personalProfile,
  onUpdateComfort,
  onUpdateSafeword,
  onBack,
}: DuoSpaceScreenProps) {
  // État de connexion QR
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('choice');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  // État du flow duo
  const [duoStep, setDuoStep] = useState<DuoStep>('choice');
  const [partnerName] = useState(() => partnerNames[Math.floor(Math.random() * partnerNames.length)]);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [partnerSafeword] = useState(() => ['Rouge', 'Stop', 'Pause', 'Ananas'][Math.floor(Math.random() * 4)]);

  const isCodeValid = inputCode.length === 6;

  // Handler: Bump réussi
  const handleBumpSuccess = useCallback(() => {
    setPartnerProfile(generatePartnerProfile());
    setDuoStep('connected');
  }, []);

  // Handler: Fallback vers QR
  const handleFallbackQR = useCallback(() => {
    setDuoStep('qr-fallback');
    setConnectionMode('choice');
  }, []);

  // Handlers QR code
  const handleGenerateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setConnectionMode('generate');
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
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

  // Handlers du flow
  const handleConnectionComplete = useCallback(() => {
    setDuoStep('pact');
  }, []);

  const handlePactAccepted = useCallback(() => {
    setDuoStep('filling');
  }, []);

  const handleFillingComplete = useCallback(() => {
    setDuoStep('waiting');
  }, []);

  const handlePartnerReady = useCallback(() => {
    setDuoStep('ready');
  }, []);

  const handleRevealStart = useCallback(() => {
    setDuoStep('reveal');
  }, []);

  const handleRevealComplete = useCallback(() => {
    setDuoStep('summary');
  }, []);

  // Calcul du common ground si on a les deux profils
  const commonGround = partnerProfile
    ? calculateCommonGround(personalProfile, partnerProfile)
    : null;

  // Reset
  const handleReset = () => {
    setDuoStep('choice');
    setConnectionMode('choice');
    setPartnerProfile(null);
    setInputCode('');
    setGeneratedCode('');
  };

  // Navigation directe (démo)
  const handleGoToStep = useCallback((step: DuoStep) => {
    // S'assurer qu'on a un profil partenaire pour les étapes qui en ont besoin
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
      {/* Barre de navigation démo */}
      <DuoNavBar
        currentStep={duoStep}
        onBack={onBack}
        onReset={handleReset}
        onGoToStep={handleGoToStep}
      />

      <AnimatePresence mode="wait">
        {/* Étape: Choix initial - Bump ou QR */}
        {duoStep === 'choice' && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3"
            >
              <Users size={28} className="text-purple-500 mt-1 shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Notre Espace
                </h2>
                <p className="text-sm text-gray-500">
                  Connecte-toi avec ton/ta partenaire pour dialoguer ensemble.
                </p>
              </div>
            </motion.div>

            <div className="space-y-4">
              {/* Option principale: Bump */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card
                  variant="elevated"
                  padding="lg"
                  onClick={() => setDuoStep('bump')}
                  className="cursor-pointer hover:shadow-lg transition-shadow !bg-gradient-to-br !from-purple-50 !to-pink-50 !border-purple-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Wifi size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800 text-lg">Bump</h3>
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                          Recommandé
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Rapprochez vos téléphones pour vous connecter
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Séparateur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 py-2"
              >
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </motion.div>

              {/* Option QR Code */}
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <QrCode size={24} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">QR Code / Code manuel</h3>
                      <p className="text-xs text-gray-500">Alternative si le bump ne marche pas</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* How it works */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <Card variant="default" padding="lg">
                  <p className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Lightbulb size={18} className="text-amber-500" />
                    Comment ça marche ?
                  </p>
                  <ol className="space-y-2 text-sm text-gray-600">
                    {[
                      'Vous êtes ensemble, chacun sur votre téléphone',
                      'Rapprochez vos téléphones (ou scannez le QR code)',
                      'Vous remplissez vos profils séparément',
                      "L'app révèle vos zones communes"
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Étape: Bump */}
        {duoStep === 'bump' && (
          <DuoBumpStep
            key="bump"
            onBumpSuccess={handleBumpSuccess}
            onFallbackQR={handleFallbackQR}
          />
        )}

        {/* Étape: QR Fallback */}
        {duoStep === 'qr-fallback' && (
          <motion.div
            key="qr-fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <button
                onClick={() => setDuoStep('choice')}
                className="flex items-center gap-2 text-gray-500 mb-4 hover:text-gray-700"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">Retour</span>
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Connexion par QR Code
              </h2>
              <p className="text-sm text-gray-500">
                Choisissez votre méthode de connexion
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
                  {/* Générer */}
                  <Card
                    variant="elevated"
                    padding="md"
                    onClick={handleGenerateCode}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
                        <QrCode size={24} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">Générer mon code</h3>
                        <p className="text-xs text-gray-500">Mon/ma partenaire scannera</p>
                      </div>
                    </div>
                  </Card>

                  {/* Scanner */}
                  <Card
                    variant="elevated"
                    padding="md"
                    onClick={handleStartScan}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
                        <Camera size={24} className="text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">Scanner un code</h3>
                        <p className="text-xs text-gray-500">Je scanne le code partenaire</p>
                      </div>
                    </div>
                  </Card>

                  {/* Manuel */}
                  <Card
                    variant="elevated"
                    padding="md"
                    onClick={() => setConnectionMode('manual')}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Link2 size={24} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">Code manuel</h3>
                        <p className="text-xs text-gray-500">Saisir le code à 6 chiffres</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Mode: QR généré */}
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
                    <div className="bg-purple-50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-purple-600 mb-1">Code de connexion</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-mono font-bold tracking-[0.3em] text-purple-700">
                          {generatedCode}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
                        >
                          {copied ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <Copy size={18} className="text-purple-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>

                  <Card variant="gradient-amber" padding="sm" className="mb-4">
                    <div className="flex items-center gap-3">
                      <Loader2 size={18} className="text-amber-600 animate-spin" />
                      <p className="text-sm text-gray-700">En attente...</p>
                    </div>
                  </Card>

                  <Button onClick={handleConnect} fullWidth variant="secondary" className="mb-2">
                    <CheckCircle2 size={18} />
                    Simuler connexion (démo)
                  </Button>
                  <Button onClick={() => setConnectionMode('choice')} fullWidth variant="ghost">
                    Retour
                  </Button>
                </motion.div>
              )}

              {/* Mode: Scanner */}
              {connectionMode === 'scan' && (
                <motion.div
                  key="scan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card variant="elevated" className="text-center mb-4 overflow-hidden">
                    <div className="relative bg-gray-900 rounded-xl aspect-square max-w-[240px] mx-auto flex items-center justify-center">
                      <div className="absolute top-3 left-3 w-10 h-10 border-l-4 border-t-4 border-purple-400 rounded-tl-lg" />
                      <div className="absolute top-3 right-3 w-10 h-10 border-r-4 border-t-4 border-purple-400 rounded-tr-lg" />
                      <div className="absolute bottom-3 left-3 w-10 h-10 border-l-4 border-b-4 border-purple-400 rounded-bl-lg" />
                      <div className="absolute bottom-3 right-3 w-10 h-10 border-r-4 border-b-4 border-purple-400 rounded-br-lg" />

                      {isScanning && (
                        <motion.div
                          className="absolute left-6 right-6 h-0.5 bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
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
                      Annuler
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Mode: Manuel */}
              {connectionMode === 'manual' && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card variant="elevated" padding="lg" className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Link2 size={18} className="text-purple-500" />
                      Code de connexion
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
                          isCodeValid
                            ? 'border-green-400 bg-green-50'
                            : inputCode.length > 0
                              ? 'border-purple-300 bg-purple-50/50'
                              : 'border-gray-200 focus:border-purple-400'
                        }`}
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
                            <span className="text-sm text-purple-400 font-medium">
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
                      Se connecter
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
                    Retour
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Étape 1: Connectés - Animation cercles */}
        {duoStep === 'connected' && (
          <DuoConnectedStep
            key="connected"
            partnerName={partnerName}
            onComplete={handleConnectionComplete}
          />
        )}

        {/* Étape 2: Notre pacte */}
        {duoStep === 'pact' && (
          <DuoPactStep
            key="pact"
            partnerName={partnerName}
            onAccept={handlePactAccepted}
          />
        )}

        {/* Étape 3: Remplissage profil */}
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

        {/* Étape 4: En attente */}
        {duoStep === 'waiting' && (
          <DuoWaitingStep
            key="waiting"
            partnerName={partnerName}
            onPartnerReady={handlePartnerReady}
          />
        )}

        {/* Étape 5: Prêts ? */}
        {duoStep === 'ready' && (
          <DuoReadyStep
            key="ready"
            partnerName={partnerName}
            onReveal={handleRevealStart}
          />
        )}

        {/* Étape 6: Révélation */}
        {duoStep === 'reveal' && commonGround && (
          <DuoRevealStep
            key="reveal"
            commonGround={commonGround}
            onComplete={handleRevealComplete}
          />
        )}

        {/* Étape 7: Récapitulatif */}
        {duoStep === 'summary' && commonGround && (
          <motion.div key="summary">
            <DuoSummaryStep
              commonGround={commonGround}
              personalProfile={personalProfile}
              partnerName={partnerName}
              partnerSafeword={partnerSafeword}
            />
            {/* Bouton recommencer */}
            <div className="px-5 pb-6">
              <Button onClick={handleReset} fullWidth variant="ghost">
                <ArrowLeft size={18} />
                Nouvelle session
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
