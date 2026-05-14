import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Home, BookOpen, Gamepad2, User } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n';
import { useNavigationStore, type TabId } from '@ouiclair/core';

type TabIconId = 'home' | 'learn' | 'play' | 'me';

const TAB_CONFIG: { id: TabId; icon: TabIconId; labelKey: string }[] = [
  { id: 'home',      icon: 'home',  labelKey: 'tab.home'     },
  { id: 'apprendre', icon: 'learn', labelKey: 'tab.apprendre'},
  { id: 'jeux',      icon: 'play',  labelKey: 'tab.jeux'     },
  { id: 'moi',       icon: 'me',    labelKey: 'tab.moi'      },
];

function TabIcon({ id, active, color }: { id: TabIconId; active: boolean; color: string }) {
  const w = active ? 2.5 : 1.8;
  switch (id) {
    case 'home':  return <Home      size={22} color={color} strokeWidth={w} />;
    case 'learn': return <BookOpen  size={22} color={color} strokeWidth={w} />;
    case 'play':  return <Gamepad2  size={22} color={color} strokeWidth={w} />;
    case 'me':    return <User      size={22} color={color} strokeWidth={w} />;
  }
}

export function TabBar() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { activeTab, switchTab } = useNavigationStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgCard, borderTopColor: colors.border, paddingBottom: insets.bottom }]}>
      {TAB_CONFIG.map((tab) => {
        const active = activeTab === tab.id;
        const color = active ? colors.accent : colors.textMuted;
        return (
          <Pressable key={tab.id} onPress={() => switchTab(tab.id)} style={styles.tab}>
            {({ pressed }) => (
              <MotiView
                animate={{ scale: pressed ? 0.85 : 1 }}
                transition={{ type: 'timing', duration: 80 }}
                style={styles.tabInner}
              >
                <TabIcon id={tab.icon} active={active} color={color} />
                <Text style={[styles.label, { color }]}>{t(tab.labelKey as Parameters<typeof t>[0])}</Text>
                {active && (
                  <View style={[styles.indicator, { backgroundColor: colors.accent }]} />
                )}
              </MotiView>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 32,
    height: 2,
    borderRadius: 1,
  },
});
