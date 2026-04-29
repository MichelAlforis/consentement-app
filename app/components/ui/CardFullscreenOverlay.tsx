'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, type MotionValue } from 'framer-motion';
import { X } from 'lucide-react';
import { CollectorCardCanvas } from '../../game-engine/cards/CollectorCardCanvas';
import type { GainedCard } from '../../lib/computeGainedCards';
import { DynamicIcon } from '../../utils/iconFromName';
import { useNormalizedPointer } from '../screens/CardGame/hooks/useNormalizedPointer';

// ─── useDeviceOrientation ─────────────────────────────────────────────────────

type DevOriWithPerm = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

function useDeviceOrientation() {
  const gyroX = useMotionValue(0); // gamma → left-right
  const gyroY = useMotionValue(0); // beta  → front-back
  const [listening,       setListening]       = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  // Listener managed by `listening` state so cleanup is guaranteed
  useEffect(() => {
    if (!listening) return;
    const handler = (e: DeviceOrientationEvent) => {
      if (e.gamma === null && e.beta === null) return;
      gyroX.set(Math.max(-1, Math.min(1, (e.gamma ?? 0) / 25)));
      gyroY.set(Math.max(-1, Math.min(1, ((e.beta ?? 60) - 60) / 25)));
    };
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [listening, gyroX, gyroY]);

  // Detect iOS permission requirement once on mount
  useEffect(() => {
    const DevOri = DeviceOrientationEvent as DevOriWithPerm;
    if (typeof DevOri.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      setListening(true); // Android / desktop — no permission needed
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const DevOri = DeviceOrientationEvent as DevOriWithPerm;
    if (typeof DevOri.requestPermission !== 'function') return;
    try {
      const result = await DevOri.requestPermission();
      if (result === 'granted') {
        setListening(true);
        setNeedsPermission(false);
      }
    } catch { /* user denied */ }
  }, []);

  return { gyroX, gyroY, needsPermission, requestPermission };
}

// ─── CardFullscreenOverlay ────────────────────────────────────────────────────

export interface CardFullscreenOverlayProps {
  card: GainedCard;
  onClose: () => void;
}

const CARD_SIZE = 260;

export function CardFullscreenOverlay({ card, onClose }: CardFullscreenOverlayProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { x: ptrX, y: ptrY } = useNormalizedPointer(contentRef);
  const { gyroX, gyroY, needsPermission, requestPermission } = useDeviceOrientation();

  // Delayed flip: shows back on open, then flips to front — "sensation de tenir la carte"
  const [isFlipped, setIsFlipped] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsFlipped(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Tilt: gyro (mobile) + pointer (desktop) — both normalized −1..1 → degrees
  const rawRotX = useTransform(
    [gyroY, ptrY] as MotionValue<number>[],
    ([g, p]: number[]) => g * 9 + p * 6,
  );
  const rawRotY = useTransform(
    [gyroX, ptrX] as MotionValue<number>[],
    ([g, p]: number[]) => g * 9 + p * 6,
  );
  const tiltX = useSpring(rawRotX as MotionValue<number>, { stiffness: 55, damping: 14 });
  const tiltY = useSpring(rawRotY as MotionValue<number>, { stiffness: 55, damping: 14 });

  // Swipe-down to dismiss
  const dragY     = useMotionValue(0);
  const dragOpacity = useTransform(dragY, [0, 160], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y > 80) onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[rgba(4,2,12,0.97)] overflow-hidden"
    >
      {/* Close button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-[52px] right-5 w-9 h-9 rounded-[18px] bg-white/[0.08] border border-white/[0.14] flex items-center justify-center z-10 cursor-pointer"
      >
        <X size={16} color="rgba(255,255,255,0.7)" />
      </motion.button>

      {/* Draggable column — fades as dragged down */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 220 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
        className="absolute inset-0"
        style={{ y: dragY, opacity: dragOpacity }}
      >
        {/* Pointer tracking area + layout */}
        <div
          ref={contentRef}
          className="h-full flex flex-col items-center justify-center gap-7 pt-[60px] pb-8 cursor-grab"
        >
          {/* Drag handle hint */}
          <div className="w-9 h-1 rounded-[2px] bg-white/20" />

          {/* 3D perspective + CSS tilt wrapper */}
          <div style={{ perspective: '1400px' }}>
            <motion.div style={{ rotateX: tiltX, rotateY: tiltY }}>
              <CollectorCardCanvas
                card={card}
                isFlipped={isFlipped}
                size={CARD_SIZE}
              />
            </motion.div>
          </div>

          {/* Texte + badge thème */}
          <div className="max-w-[310px] px-5 text-center">
            <div
              className="inline-flex items-center gap-[6px] px-3 py-1 rounded-[20px] mb-[14px]"
              style={{ background: card.gradient }}
            >
              <DynamicIcon name={card.iconName} size={11} color="white" />
              <span className="text-[10px] font-bold text-white tracking-[0.06em]">
                {card.themeName ?? card.theme}
              </span>
            </div>

            <p className="text-[15px] leading-[1.65] text-white/85 m-0">
              {card.text}
            </p>

            {card.rarity !== 'common' && (
              <p className="mt-[10px] text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: card.border }}>
                ✦ {card.rarity === 'unique' ? 'Unique' : 'Rare'}
              </p>
            )}
          </div>

          {/* iOS gyroscope permission */}
          {needsPermission && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={requestPermission}
              className="px-[22px] py-[10px] rounded-xl bg-white/[0.07] border border-white/[0.13] text-white/55 text-xs font-semibold cursor-pointer"
            >
              Activer le gyroscope
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
