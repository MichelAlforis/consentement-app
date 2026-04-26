'use client';

import { Home, BookOpen, Gamepad2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

export const TAB_ROOTS: Screen[] = ['home', 'apprendre', 'jeux', 'moi'];
const TAB_ROOTS_SET = new Set<Screen>(TAB_ROOTS);

interface TabBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const TABS: { screen: Screen; icon: (active: boolean, color: string) => React.ReactNode; labelKey: string }[] = [
  {
    screen: 'home',
    icon: (active, color) => <Home size={22} style={{ color }} strokeWidth={active ? 2.5 : 1.8} />,
    labelKey: 'tabs.home',
  },
  {
    screen: 'apprendre',
    icon: (active, color) => <BookOpen size={22} style={{ color }} strokeWidth={active ? 2.5 : 1.8} />,
    labelKey: 'tabs.learn',
  },
  {
    screen: 'jeux',
    icon: (active, color) => <Gamepad2 size={22} style={{ color }} strokeWidth={active ? 2.5 : 1.8} />,
    labelKey: 'tabs.play',
  },
  {
    screen: 'moi',
    icon: (active, color) => <User size={22} style={{ color }} strokeWidth={active ? 2.5 : 1.8} />,
    labelKey: 'tabs.me',
  },
];

export function TabBar({ currentScreen, onNavigate }: TabBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (!TAB_ROOTS_SET.has(currentScreen)) return null;

  return (
    <div
      className="flex items-stretch safe-area-bottom"
      style={{ background: colors.bgCard, borderTop: `1px solid ${colors.border}` }}
    >
      {TABS.map((tab) => {
        const active = currentScreen === tab.screen;
        const color = active ? colors.accent : colors.textMuted;
        return (
          <motion.button
            key={tab.screen}
            whileTap={{ scale: 0.85 }}
            onClick={() => onNavigate(tab.screen)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
          >
            {tab.icon(active, color)}
            <span
              className="text-[10px] font-medium leading-none"
              style={{ color }}
            >
              {t(tab.labelKey)}
            </span>
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 w-8 h-0.5 rounded-full"
                style={{ background: colors.accent }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
