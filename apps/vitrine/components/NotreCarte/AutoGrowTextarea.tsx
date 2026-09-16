'use client';

import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useUncontrolledField } from './useBufferedField';

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
  const resize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  const { ref, onInput, onBlur } = useUncontrolledField<HTMLTextAreaElement>(value, onChange, () => resize(ref.current));
  useImperativeHandle(forwardedRef, () => ref.current as HTMLTextAreaElement, [ref]);

  useEffect(() => {
    resize(ref.current);
    // La police (Inter) charge de façon asynchrone : la toute première mesure peut
    // se faire avec une police de repli, sur moins de lignes que le texte final une
    // fois Inter en place. On recalcule une fois le chargement des polices terminé.
    if (typeof document === 'undefined' || !document.fonts) return;
    document.fonts.ready.then(() => resize(ref.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <textarea
      ref={ref}
      rows={rows}
      defaultValue={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onInput={onInput}
      onBlur={onBlur}
      className={className}
      style={{ overflow: 'hidden', resize: 'vertical', ...style }}
    />
  );
});

export default AutoGrowTextarea;
