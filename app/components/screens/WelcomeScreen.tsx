'use client';

import { motion } from 'framer-motion';
import { Heart, Lock, MessageCircle, Handshake, ArrowRight } from 'lucide-react';
import { Button } from '../ui';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const badges = [
    { icon: <Lock size={14} />, label: 'Privé' },
    { icon: <MessageCircle size={14} />, label: 'Dialogue' },
    { icon: <Handshake size={14} />, label: 'Respect' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col justify-between p-6 pb-10"
    >
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 40px rgba(236, 72, 153, 0.3)',
                '0 0 60px rgba(236, 72, 153, 0.5)',
                '0 0 40px rgba(236, 72, 153, 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 flex items-center justify-center"
          >
            <Heart size={56} className="text-white" fill="white" />
          </motion.div>

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-20, -60],
                x: [-20 + i * 10, -30 + i * 15],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-pink-300"
            />
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-800 mb-3 tracking-tight"
        >
          Bienvenue
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base text-gray-500 leading-relaxed max-w-xs"
        >
          Un espace pour apprendre à communiquer sur le consentement, les limites et le respect mutuel.
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-8"
        >
          {badges.map((badge, i) => (
            <motion.span
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="px-3 py-1.5 bg-white/80 backdrop-blur rounded-full text-sm text-gray-600 border border-gray-100 shadow-sm flex items-center gap-1.5"
            >
              {badge.icon}
              {badge.label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <Button
          onClick={onStart}
          fullWidth
          size="lg"
          className="shadow-xl shadow-pink-300/30"
        >
          Commencer
          <ArrowRight size={20} />
        </Button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-xs text-gray-400"
        >
          Outil éducatif — Le consentement est toujours révocable
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
