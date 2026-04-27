'use client';

import { AnimatePresence } from 'framer-motion';
import { Header } from '../ui';
import { useTranslation } from '../../i18n';
import { getRoute, shouldShowHeader } from '../../routes';
import { selectCanGoBack, useNavigationStore } from '../../stores';
import type { Theme } from '../../types/theme';

type HeaderControllerProps = {
  isAdult: boolean | null;
  theme: Theme;
};

export function HeaderController({ isAdult, theme }: HeaderControllerProps) {
  const { t } = useTranslation();
  const currentScreen = useNavigationStore((s) => s.currentScreen);
  const history = useNavigationStore((s) => s.history);
  const goBack = useNavigationStore((s) => s.goBack);
  const route = getRoute(currentScreen);
  const title = route.titleKey ? t(route.titleKey) : (isAdult ? t('headers.defaultAdult') : t('headers.defaultMinor'));
  const subtitle = route.subtitleKey ? t(route.subtitleKey) : undefined;

  return (
    <AnimatePresence>
      {shouldShowHeader(currentScreen) && (
        <Header
          title={title}
          subtitle={subtitle}
          showBack={selectCanGoBack(currentScreen, history)}
          onBack={() => goBack()}
          theme={theme}
        />
      )}
    </AnimatePresence>
  );
}
