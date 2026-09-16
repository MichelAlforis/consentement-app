'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={rows}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className={className}
      style={{ overflow: 'hidden', resize: 'vertical', ...style }}
    />
  );
});

export default AutoGrowTextarea;
