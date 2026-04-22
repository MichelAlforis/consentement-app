'use client';
import { motion } from 'framer-motion';

interface OverlayProps {
  children: React.ReactNode;
  color?: string;
}

export function Overlay({ children, color = '#1e293b' }: OverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 50,
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        style={{
          background: color,
          borderRadius: '24px 24px 0 0',
          paddingTop: 24,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 'max(calc(env(safe-area-inset-bottom, 0px) + 24px), 44px)',
          width: '100%',
          maxHeight: '75vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
