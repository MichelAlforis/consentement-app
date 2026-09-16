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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [local]);

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
