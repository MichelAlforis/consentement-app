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
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(4,2,12,0.97)',
        overflow: 'hidden',
      }}
    >
      {/* Close button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        style={{
          position: 'absolute', top: 52, right: 20,
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10, cursor: 'pointer',
        }}
      >
        <X size={16} color="rgba(255,255,255,0.7)" />
      </motion.button>

      {/* Draggable column — fades as dragged down */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 220 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
        style={{
          y: dragY,
          opacity: dragOpacity,
          position: 'absolute', inset: 0,
        }}
      >
        {/* Pointer tracking area + layout */}
        <div
          ref={contentRef}
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            paddingTop: 60,
            paddingBottom: 32,
            cursor: 'grab',
          }}
        >
          {/* Drag handle hint */}
          <div style={{
            width: 36, height: 4, borderRadius: 2,
            background: 'rgba(255,255,255,0.2)',
          }} />

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
          <div style={{ maxWidth: 310, padding: '0 20px', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 20,
              background: card.gradient, marginBottom: 14,
            }}>
              <DynamicIcon name={card.iconName} size={11} color="white" />
              <span style={{
                fontSize: 10, fontWeight: 700, color: 'white',
                letterSpacing: '0.06em',
              }}>
                {card.themeName ?? card.theme}
              </span>
            </div>

            <p style={{
              fontSize: 15, lineHeight: 1.65,
              color: 'rgba(255,255,255,0.85)',
              margin: 0,
            }}>
              {card.text}
            </p>

            {card.rarity !== 'common' && (
              <p style={{
                marginTop: 10, fontSize: 11, fontWeight: 700,
                color: card.border, letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
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
              style={{
                padding: '10px 22px', borderRadius: 12,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.13)',
                color: 'rgba(255,255,255,0.55)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Activer le gyroscope
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
