'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Wifi, WifiOff, QrCode } from 'lucide-react';
import { Button, Card } from '../ui';

interface DuoBumpStepProps {
  onBumpSuccess: () => void;
  onFallbackQR: () => void;
}

type BumpState = 'waiting' | 'detecting' | 'connecting' | 'failed';

export function DuoBumpStep({ onBumpSuccess, onFallbackQR }: DuoBumpStepProps) {
  const [bumpState, setBumpState] = useState<BumpState>('waiting');
  const [pulseCount, setPulseCount] = useState(0);

  // Animation de pulse pour simuler la recherche
  useEffect(() => {
    if (bumpState === 'waiting') {
      const interval = setInterval(() => {
        setPulseCount(prev => prev + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [bumpState]);

  // Simuler une détection après quelques secondes (pour la démo)
  const handleSimulateBump = () => {
    setBumpState('detecting');

    setTimeout(() => {
      setBumpState('connecting');
      setTimeout(() => {
        onBumpSuccess();
      }, 1500);
    }, 1000);
  };

  // Simuler un échec puis fallback QR
  const handleSimulateFail = () => {
    setBumpState('detecting');
    setTimeout(() => {
      setBumpState('failed');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-6"
    >
      <AnimatePresence mode="wait">
        {/* État: En attente du bump */}
        {bumpState === 'waiting' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            {/* Animation des deux téléphones */}
            <div className="relative w-64 h-48 mb-8">
              {/* Ondes de recherche */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-300"
                  initial={{ width: 60, height: 60, opacity: 0.6 }}
                  animate={{
                    width: [60, 200],
                    height: [60, 200],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* Téléphone gauche (moi) */}
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              >
                <div className="w-16 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-700">
                  <Smartphone size={24} className="text-purple-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Toi</p>
              </motion.div>

              {/* Téléphone droit (partenaire) */}
              <motion.div
                animate={{ x: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <div className="w-16 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-700">
                  <Smartphone size={24} className="text-pink-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Partenaire</p>
              </motion.div>

              {/* Icône Bluetooth/NFC au centre */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Wifi size={32} className="text-purple-500" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Rapprochez vos téléphones
            </h2>
            <p className="text-gray-500 mb-2">
              Faites un "bump" pour vous connecter
            </p>
            <motion.p
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm text-purple-500"
            >
              Recherche en cours...
            </motion.p>

            {/* Boutons démo */}
            <div className="mt-8 space-y-3 w-full max-w-xs">
              <Button onClick={handleSimulateBump} fullWidth variant="primary">
                <Wifi size={18} />
                Simuler le bump (démo)
              </Button>
              <Button onClick={handleSimulateFail} fullWidth variant="ghost" className="!text-gray-400">
                Simuler un échec
              </Button>
            </div>
          </motion.div>
        )}

        {/* État: Détection en cours */}
        {bumpState === 'detecting' && (
          <motion.div
            key="detecting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-purple-200 border-t-purple-500"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Appareil détecté !
            </h2>
            <p className="text-gray-500">
              Connexion en cours...
            </p>
          </motion.div>
        )}

        {/* État: Connexion réussie */}
        {bumpState === 'connecting' && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl"
              >
                ✓
              </motion.span>
            </motion.div>
            <h2 className="text-xl font-bold text-green-600">
              Bump réussi !
            </h2>
          </motion.div>
        )}

        {/* État: Échec - Fallback QR */}
        {bumpState === 'failed' && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center"
            >
              <WifiOff size={36} className="text-amber-500" />
            </motion.div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Connexion difficile
            </h2>
            <p className="text-gray-500 mb-6">
              Pas de souci ! Utilisons le QR code à la place.
            </p>

            <Card variant="default" padding="md" className="mb-6 text-left">
              <p className="text-sm text-gray-600">
                <strong>Pourquoi ça n'a pas marché ?</strong>
                <br />
                La connexion directe peut échouer si :
              </p>
              <ul className="text-sm text-gray-500 mt-2 space-y-1">
                <li>• iPhone ↔ Android (limitations Apple)</li>
                <li>• Bluetooth désactivé</li>
                <li>• Téléphones trop éloignés</li>
              </ul>
            </Card>

            <div className="space-y-3 w-full max-w-xs mx-auto">
              <Button onClick={onFallbackQR} fullWidth variant="primary">
                <QrCode size={18} />
                Utiliser le QR code
              </Button>
              <Button
                onClick={() => setBumpState('waiting')}
                fullWidth
                variant="ghost"
              >
                Réessayer le bump
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
