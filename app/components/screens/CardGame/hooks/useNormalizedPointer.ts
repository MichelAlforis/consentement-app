import { useEffect, RefObject } from 'react';
import { useMotionValue, MotionValue } from 'framer-motion';

export function useNormalizedPointer(ref: RefObject<HTMLElement | null>): {
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId: number;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        x.set(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)));
        y.set(Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)));
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => { x.set(0); y.set(0); });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [ref, x, y]);

  return { x, y };
}
