'use client';

import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  rows?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function AutoGrowTextarea({ value, onChange, readOnly, placeholder, rows = 2, style, className }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

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
}
