'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, Link2, ArrowLeft, Loader2, Check, Copy, CheckCircle2 } from 'lucide-react';
import { Button, Card, QRCode } from '../../../ui';
import { useTheme } from '../../../../context/ThemeContext';
import { useToast } from '../../../../context/ToastContext';
import { useTranslation } from '../../../../i18n';
import { isCapacitor } from '../../../../lib/platform';
import { ConnectionMode } from '../hooks/useDuoSession';

interface QRFallbackProps {
  connectionMode: ConnectionMode;
  generatedCode: string;
  inputCode: string;
  isScanning: boolean;
  copied: boolean;
  onBack: () => void;
  onSetMode: (mode: ConnectionMode) => void;
  onSetInputCode: (code: string) => void;
  onSetGeneratedCode: (code: string) => void;
  onSetScanning: (v: boolean) => void;
  onSetCopied: (v: boolean) => void;
  onConnect: () => void;
}

export function QRFallback({
  connectionMode,
  generatedCode,
  inputCode,
  isScanning,
  copied,
  onBack,
  onSetMode,
  onSetInputCode,
  onSetGeneratedCode,
  onSetScanning,
  onSetCopied,
  onConnect,
}: QRFallbackProps) {
  const { colors } = useTheme();
  const { show: showToast } = useToast();
  const { t } = useTranslation();

  const isCodeValid = inputCode.length === 6;

  const handleGenerateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    onSetGeneratedCode(code);
    onSetMode('generate');
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
    onSetCopied(true);
    showToast('Code copié !', 'success');
    setTimeout(() => onSetCopied(false), 2000);
  };

  const handleStartScan = () => {
    onSetMode('scan');
    onSetScanning(true);
    setTimeout(() => {
      onSetScanning(false);
      setTimeout(() => onConnect(), 500);
    }, 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 mb-4" style={{ color: colors.textMuted }}>
          <ArrowLeft size={18} />
          <span className="text-sm">{t('duo.back')}</span>
        </button>
        <h2 className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>{t('duo.qrFallback.title')}</h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>{t('duo.qrFallback.subtitle')}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {connectionMode === 'choice' && (
          <motion.div
            key="qr-choice"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <Card variant="elevated" padding="md" onClick={handleGenerateCode} className="cursor-pointer hover:shadow-lg transition-shadow">
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

            <Card variant="elevated" padding="md" onClick={handleStartScan} className="cursor-pointer hover:shadow-lg transition-shadow">
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

            <Card variant="elevated" padding="md" onClick={() => onSetMode('manual')} className="cursor-pointer hover:shadow-lg transition-shadow">
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
          <motion.div key="generate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
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
                    {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} style={{ color: colors.accent }} />}
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

            <Button onClick={onConnect} fullWidth variant="secondary" className="mb-2">
              <CheckCircle2 size={18} />
              {t('duo.generate.simulate')}
            </Button>
            <Button onClick={() => onSetMode('choice')} fullWidth variant="ghost">{t('duo.back')}</Button>
          </motion.div>
        )}

        {connectionMode === 'scan' && (
          <motion.div key="scan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
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
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <div className="text-center">
                  {isScanning ? <Camera size={40} className="text-purple-400" /> : <CheckCircle2 size={40} className="text-green-400" />}
                </div>
              </div>
            </Card>
            {isScanning && (
              <Button onClick={() => onSetMode('choice')} fullWidth variant="ghost">{t('duo.scan.cancel')}</Button>
            )}
          </motion.div>
        )}

        {connectionMode === 'manual' && (
          <motion.div key="manual" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
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
                  onChange={(e) => onSetInputCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  className={`w-full px-4 py-4 rounded-xl border-2 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none transition-colors ${isCodeValid ? 'border-green-400 bg-green-50' : ''}`}
                  style={!isCodeValid ? {
                    borderColor: inputCode.length > 0 ? colors.accent : colors.border,
                    background: inputCode.length > 0 ? `${colors.bgSecondary}80` : undefined,
                  } : {}}
                />
                {inputCode.length > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isCodeValid
                      ? <CheckCircle2 size={24} className="text-green-500" />
                      : <span className="text-sm font-medium" style={{ color: colors.accent }}>{inputCode.length}/6</span>}
                  </motion.div>
                )}
              </div>
              <Button onClick={onConnect} fullWidth variant="secondary" disabled={!isCodeValid} className="mt-4">
                {t('duo.manual.connect')}
              </Button>
            </Card>
            <Button onClick={() => { onSetMode('choice'); onSetInputCode(''); }} fullWidth variant="ghost">
              {t('duo.back')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
