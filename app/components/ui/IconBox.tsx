'use client';

import { ReactNode, CSSProperties } from 'react';

interface IconBoxProps {
  children: ReactNode;
  /** sm=36px  md=40px  lg=44px  xl=48px */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'xl' | '2xl' | '3xl';
  style?: CSSProperties;
  className?: string;
}

const sizes = {
  sm: 'w-9 h-9',
  md: 'w-10 h-10',
  lg: 'w-11 h-11',
  xl: 'w-12 h-12',
};

const radii = {
  xl:   'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

export function IconBox({
  children,
  size = 'md',
  rounded = 'xl',
  style,
  className = '',
}: IconBoxProps) {
  return (
    <div
      className={`${sizes[size]} ${radii[rounded]} flex items-center justify-center shrink-0 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
