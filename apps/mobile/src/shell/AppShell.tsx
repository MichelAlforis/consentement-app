import type { ReactNode } from 'react';
import { View } from 'react-native';
import { TabBar, Toast } from '../components/ui';
import { useTheme } from '../theme/ThemeContext';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={{ flex: 1 }}>{children}</View>
      <TabBar />
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <Toast />
      </View>
    </View>
  );
}
