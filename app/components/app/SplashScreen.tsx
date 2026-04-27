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
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        zIndex: 9999,
      }}
    >
      <AppLogo height={120} variant="dark" animated />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ textAlign: 'center' }}
      >
        <p style={{ color: '#fff', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
          Consentement
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>
          Apprendre · Comprendre · Décider
        </p>
      </motion.div>
    </motion.div>
  );
}
