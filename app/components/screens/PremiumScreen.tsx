'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, ArrowLeft, CreditCard, Lock, Sparkles, Dices, Palette } from 'lucide-react';

interface PremiumScreenProps {
  onActivate: () => void;
  onBack: () => void;
}

const FEATURES = [
  { icon: <Dices size={16} />, label: 'Dé du consentement — niveau 3 (pratiques avancées)' },
  { icon: <Sparkles size={16} />, label: 'Cartes à tirer — jeu de séduction guidé' },
  { icon: <Sparkles size={16} />, label: 'Scénarios guidés — aventures narratives' },
  { icon: <Palette size={16} />, label: 'Thèmes exclusifs : Dark Luxury & Nude' },
  { icon: <Crown size={16} />, label: 'Accès prioritaire aux nouvelles fonctionnalités' },
];

type Step = 'offer' | 'processing' | 'success';

export function PremiumScreen({ onActivate, onBack }: PremiumScreenProps) {
  const [step, setStep] = useState<Step>('offer');

  function handlePayment() {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2200);
  }

  function handleSuccess() {
    onActivate();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full"
    >
      <AnimatePresence mode="wait">
        {step === 'offer' && (
          <motion.div
            key="offer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="p-5"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Passer à Premium</h1>
            </div>

            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-6 mb-6 text-center"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
              }}
            >
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Crown size={32} className="text-yellow-300" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Consentement Premium</h2>
              <p className="text-white/80 text-sm mb-4">Expérience complète, sans limite</p>
              <div className="inline-flex items-baseline gap-1 bg-white/20 rounded-2xl px-5 py-2">
                <span className="text-3xl font-bold text-white">4,99 €</span>
                <span className="text-white/70 text-sm">/ mois</span>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 mb-6 space-y-3"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Inclus dans Premium
              </p>
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} className="text-green-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-gray-700">{f.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePayment}
              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              <CreditCard size={18} />
              Simuler le paiement
            </motion.button>

            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <Lock size={11} />
              Mode démo — aucun paiement réel
            </p>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] p-8 gap-6"
          >
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-purple-200"
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard size={24} className="text-purple-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 mb-1">Traitement en cours…</p>
              <p className="text-sm text-gray-500">Simulation du paiement sécurisé</p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] p-8 gap-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              <Crown size={40} className="text-yellow-300" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue Premium !</h2>
              <p className="text-gray-500 text-sm max-w-xs">
                Ton accès Premium est activé. Profite de toutes les fonctionnalités exclusives.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="w-full space-y-2"
            >
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2.5"
                >
                  <Check size={14} className="text-green-500 shrink-0" strokeWidth={2.5} />
                  <span className="text-sm text-green-800">{f.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSuccess}
              className="w-full py-4 rounded-2xl font-semibold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              Accéder à Premium
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
