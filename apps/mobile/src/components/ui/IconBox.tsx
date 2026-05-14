import { View, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

const SIZES: Record<string, number> = { sm: 36, md: 40, lg: 44, xl: 48 };
const RADII: Record<string, number> = { xl: 12, '2xl': 16, '3xl': 24 };

interface IconBoxProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'xl' | '2xl' | '3xl';
  style?: ViewStyle;
}

export function IconBox({ children, size = 'md', rounded = 'xl', style }: IconBoxProps) {
  const dim = SIZES[size];
  return (
    <View
      style={[
        {
          width: dim,
          height: dim,
          borderRadius: RADII[rounded],
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
