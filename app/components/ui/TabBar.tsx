'use client';

import { Home, BookOpen, Gamepad2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { tabScreens, type TabIconId } from '../../config/screenMeta';
import type { TabId } from '../../stores/navigationStore';

interface TabBarProps {
  activeTab: TabId;
  onSwitchTab: (tab: TabId) => void;
}

const TAB_ICONS: Record<TabIconId, (active: boolean, color: string) => React.ReactNode> = {
  home:  (active, color) => <Home      size={22} style={{ color }} strokeWidth={active ? 2.5 : 1.8} />,
  learn: (active, color) => <BookOpen  size={22} style={{ color }} strokeWidth={active ? 2.5 : 1.8} />,
  play:  (active, color) => <Gamepad2  size={22} style={{ color }} strokeWidth={active ? 2.5 : 1.8} />,
  me:    (active, color) => <User      size={22} style={{ color }} strokeWidth={active ? 2.5 : 1.8} />,
};

export function TabBar({ activeTab, onSwitchTab }: TabBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className="flex items-stretch safe-area-bottom"
      style={{ background: colors.bgCard, borderTop: `1px solid ${colors.border}` }}
    >
      {tabScreens.map((tab) => {
        const active = activeTab === tab.id;
        const color = active ? colors.accent : colors.textMuted;
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.85 }}
            onClick={() => onSwitchTab(tab.id)}
            className="relative flex-1 flex flex-col items-center justify-center gap-1 py-3"
          >
            {TAB_ICONS[tab.icon](active, color)}
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
