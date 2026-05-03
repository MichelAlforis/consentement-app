'use client';

import { useEffect } from 'react';
import { useRenderModeStore } from '../../stores/renderModeStore';

export function RenderModeInit() {
  const detectAndSet = useRenderModeStore((s) => s.detectAndSet);
  useEffect(() => { detectAndSet(); }, [detectAndSet]);
  return null;
}
