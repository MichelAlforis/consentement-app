'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Handshake, RefreshCw, Lock, Check } from 'lucide-react';
import { Button } from '../ui';
import { useTheme } from '../../context/ThemeContext';

interface DuoPactStepProps {
  partnerName: string;
  onAccept: () => void;
}

const pactItems = [
  {
    icon: Handshake,
    text: 'Cet espace est pour dialoguer, pas pour prouver',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
  {
    icon: RefreshCw,
    text: 'Le consentement reste révocable à tout moment',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Lock,
    text: 'Seules vos zones communes seront révélées',
    color: 'text-violet-500',
    bgColor: 'bg-violet-50',
  },
];

export function DuoPactStep({ partnerName, onAccept }: DuoPactStepProps) {
  const { colors } = useTheme();
  const [myAccepted, setMyAccepted] = useState(false);
  const [partnerAccepted, setPartnerAccepted] = useState(false);

  // Simuler le partenaire qui accepte après 1-3 secondes
  useEffect(() => {
    if (myAccepted && !partnerAccepted) {
      const delay = 1000 + Math.random() * 2000;
      const timer = setTimeout(() => {
        setPartnerAccepted(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [myAccepted, partnerAccepted]);

  // Passer à l'étape suivante quand les deux ont accepté
  useEffect(() => {
    if (myAccepted && partnerAccepted) {
      const timer = setTimeout(onAccept, 1000);
      return () => clearTimeout(timer);
    }
  }, [myAccepted, partnerAccepted, onAccept]);

  const bothAccepted = myAccepted && partnerAccepted;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-5 py-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          Notre pacte
        </h2>
        <p style={{ color: colors.textMuted }}>
          Avant de commencer, un rappel important
        </p>
      </motion.div>

      {/* Les 3 rappels */}
      <div className="space-y-4 mb-8">
        {pactItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`${item.bgColor} rounded-2xl p-4 flex items-start gap-4`}
          >
            <div className={`${item.color} mt-0.5`}>
              <item.icon size={24} />
            </div>
            <p className="flex-1 leading-relaxed" style={{ color: colors.textSecondary }}>
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Status des deux */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl p-4 mb-6"
        style={{ background: colors.bgSecondary }}
      >
        <div className="flex justify-around">
          {/* Mon status */}
          <div className="text-center">
            <motion.div
              animate={myAccepted ? { scale: [1, 1.2, 1] } : {}}
              className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                myAccepted
                  ? 'bg-green-100'
                  : ''
              }`}
              style={!myAccepted ? { background: colors.border } : {}}
            >
              {myAccepted ? (
                <Check size={24} className="text-green-600" />
              ) : (
                <span style={{ color: colors.textMuted }}>...</span>
              )}
            </motion.div>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Toi</p>
          </div>

          {/* Séparateur */}
          <div className="flex items-center">
            <motion.div
              animate={bothAccepted ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.3 }}
              className="text-2xl"
            >
              🤝
            </motion.div>
          </div>

          {/* Status partenaire */}
          <div className="text-center">
            <motion.div
              animate={partnerAccepted ? { scale: [1, 1.2, 1] } : {}}
              className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                partnerAccepted
                  ? 'bg-green-100'
                  : ''
              }`}
              style={!partnerAccepted ? { background: colors.border } : {}}
            >
              {partnerAccepted ? (
                <Check size={24} className="text-green-600" />
              ) : (
                <motion.span
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ color: colors.textMuted }}
                >
                  ...
                </motion.span>
              )}
            </motion.div>
            <p className="text-sm" style={{ color: colors.textSecondary }}>{partnerName}</p>
          </div>
        </div>
      </motion.div>

      {/* Bouton */}
      {!myAccepted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => setMyAccepted(true)}
            fullWidth
            variant="primary"
            className="!py-4 !text-lg"
          >
            On a compris 💜
          </Button>
        </motion.div>
      ) : !partnerAccepted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: colors.textMuted }}
          >
            En attente de {partnerName}...
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-4"
        >
          <p className="text-green-600 font-medium flex items-center justify-center gap-2">
            <Check size={20} />
            Vous êtes d'accord tous les deux
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
