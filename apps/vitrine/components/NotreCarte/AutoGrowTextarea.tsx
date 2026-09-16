'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useBufferedField } from './useBufferedField';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  rows?: number;
  style?: React.CSSProperties;
  className?: string;
}

const AutoGrowTextarea = forwardRef<HTMLTextAreaElement, Props>(function AutoGrowTextarea(
  { value, onChange, readOnly, placeholder, rows = 2, style, className },
  forwardedRef
) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLTextAreaElement, []);
  const { local, onLocalChange, onBlur } = useBufferedField(value, onChange);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  useEffect(resize, [local]);

  useEffect(() => {
    // La police (Inter) charge de façon asynchrone : la toute première mesure peut
    // se faire avec une police de repli, sur moins de lignes que le texte final une
    // fois Inter en place. On recalcule une fois le chargement des polices terminé.
    if (typeof document === 'undefined' || !document.fonts) return;
    document.fonts.ready.then(resize);
  }, []);

  return (
    <textarea
      ref={ref}
      rows={rows}
      value={local}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onLocalChange(e.target.value)}
      onBlur={onBlur}
      className={className}
      style={{ overflow: 'hidden', resize: 'vertical', ...style }}
    />
  );
});

export default AutoGrowTextarea;
