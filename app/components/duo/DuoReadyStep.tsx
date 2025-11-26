'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { Button } from '../ui';

interface DuoReadyStepProps {
  partnerName: string;
  onReveal: () => void;
}

export function DuoReadyStep({ partnerName, onReveal }: DuoReadyStepProps) {
  const [myReady, setMyReady] = useState(false);
  const [partnerReady, setPartnerReady] = useState(false);

  // Simuler le partenaire qui clique après 1-3 secondes
  useEffect(() => {
    if (myReady && !partnerReady) {
      const delay = 1000 + Math.random() * 2000;
      const timer = setTimeout(() => {
        setPartnerReady(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [myReady, partnerReady]);

  // Lancer la révélation quand les deux sont prêts
  useEffect(() => {
    if (myReady && partnerReady) {
      const timer = setTimeout(onReveal, 1500);
      return () => clearTimeout(timer);
    }
  }, [myReady, partnerReady, onReveal]);

  const bothReady = myReady && partnerReady;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-6"
    >
      {/* Icône centrale */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-8"
      >
        <motion.div
          animate={bothReady ? {
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"
        >
          <Sparkles size={40} className="text-purple-500" />
        </motion.div>
      </motion.div>

      {/* Texte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Prêts ?
        </h2>
        <p className="text-gray-500 leading-relaxed">
          Vous avez chacun exploré vos envies.
        </p>
        <p className="text-gray-600 font-medium mt-2">
          Prêts à découvrir ce que vous partagez ?
        </p>
      </motion.div>

      {/* Status des deux */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs mb-8"
      >
        <div className="bg-gray-50 rounded-2xl p-5">
          <div className="flex justify-around items-center">
            {/* Mon status */}
            <div className="text-center">
              <motion.div
                animate={myReady ? { scale: [1, 1.2, 1] } : {}}
                className={`w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${
                  myReady
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                    : 'bg-gray-200'
                }`}
              >
                {myReady ? (
                  <Check size={28} className="text-white" />
                ) : (
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-gray-400"
                  />
                )}
              </motion.div>
              <p className="text-sm font-medium text-gray-700">Toi</p>
              <p className="text-xs text-gray-400">
                {myReady ? 'Prêt·e' : 'En attente'}
              </p>
            </div>

            {/* Indicateur central */}
            <motion.div
              animate={bothReady ? {
                scale: [1, 1.3, 1],
                opacity: 1
              } : {
                opacity: 0.3
              }}
              className="text-3xl"
            >
              💜
            </motion.div>

            {/* Status partenaire */}
            <div className="text-center">
              <motion.div
                animate={partnerReady ? { scale: [1, 1.2, 1] } : {}}
                className={`w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${
                  partnerReady
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                    : 'bg-gray-200'
                }`}
              >
                {partnerReady ? (
                  <Check size={28} className="text-white" />
                ) : (
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-gray-400"
                  />
                )}
              </motion.div>
              <p className="text-sm font-medium text-gray-700">{partnerName}</p>
              <p className="text-xs text-gray-400">
                {partnerReady ? 'Prêt·e' : 'En attente'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bouton */}
      {!myReady ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-xs"
        >
          <Button
            onClick={() => setMyReady(true)}
            fullWidth
            variant="primary"
            className="!py-4 !text-lg !bg-gradient-to-r !from-purple-500 !to-pink-500"
          >
            <Sparkles size={20} />
            Révéler ensemble
          </Button>
        </motion.div>
      ) : !bothReady ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500"
        >
          En attente de {partnerName}...
        </motion.p>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.p
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-xl font-bold text-purple-600"
          >
            C'est parti ! ✨
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}
