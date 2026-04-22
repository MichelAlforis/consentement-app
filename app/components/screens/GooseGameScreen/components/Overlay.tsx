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
        background: 'rgba(0,0,0,0.6)',
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
          padding: '24px 20px 44px',
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
