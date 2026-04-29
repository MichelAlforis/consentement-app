'use client';

import { motion } from 'framer-motion';
import { AppLogo } from '../ui/AppLogo';

export function SplashScreen() {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center gap-5 z-[9999]"
    >
      <AppLogo className="w-[7.5rem] h-[7.5rem]" variant="dark" animated />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center"
      >
        <p className="text-white text-[20px] font-bold tracking-[-0.01em] m-0">
          Consentement
        </p>
        <p className="text-white/40 text-[13px] mt-1">
          Apprendre · Comprendre · Décider
        </p>
      </motion.div>
    </motion.div>
  );
}
