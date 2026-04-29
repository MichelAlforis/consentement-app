'use client';
import { motion } from 'framer-motion';
import s from './Overlay.module.css';

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
      className={s.backdrop}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className={s.sheet}
        style={{ background: color }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
