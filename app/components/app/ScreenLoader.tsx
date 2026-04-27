'use client';

import { useTheme } from '../../context/ThemeContext';

export function ScreenLoader() {
  const { colors } = useTheme();
  return (
    <div className="min-h-dvh p-5 pt-8 space-y-4" style={{ background: colors.bgPrimary }}>
      <div className="skeleton h-5 w-2/5 rounded-2xl" />
      <div className="skeleton h-4 w-3/5 rounded-xl" />
      <div className="skeleton h-28 rounded-3xl mt-4" />
      <div className="skeleton h-28 rounded-3xl" />
      <div className="skeleton h-28 rounded-3xl" />
    </div>
  );
}
