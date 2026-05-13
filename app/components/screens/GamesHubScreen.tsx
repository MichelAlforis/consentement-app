'use client';

import { motion } from 'framer-motion';
import { Dices, CreditCard, ScrollText, Layers, GalleryHorizontal } from 'lucide-react';
import { Screen } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useUnlockStore } from '../../stores';
import { collectorCards } from '../../data/cards-collector';
import { GameMenuCard } from '../ui';
import { useHeatLevel } from '../../lib/useHeatLevel';
import { isHeatUnlocked } from '../../lib/heatGate';
import { HEAT_THRESHOLDS } from '../../lib/heatLevel';
import {
  getGameDescriptionKey,
  getVisibleGameMenuItems,
  type GameIconId,
  type GameMenuItem,
} from '../../config/gamesMenu';

interface GamesHubScreenProps {
  onNavigate: (screen: Screen) => void;
  isPremium: boolean;
  isAdult: boolean;
  onGoPremium: () => void;
}

const GAME_ICONS: Record<GameIconId, (color: string) => React.ReactNode> = {
  dice: (color) => <Dices size={22} style={{ color }} />,
  goose: () => <Layers size={26} className="text-white" />,
  cards: () => <CreditCard size={26} className="text-white" />,
  scenarios: () => <ScrollText size={26} className="text-white" />,
  collection: (color) => <GalleryHorizontal size={22} style={{ color }} />,
};

export function GamesHubScreen({
  onNavigate,
  isPremium,
  isAdult,
  onGoPremium,
}: GamesHubScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { ownedCards } = useUnlockStore();
  const { points, level: heatLevel } = useHeatLevel();
  const totalCards = collectorCards.filter((c) => c.deck === 'A').length;
  const ownedCount = ownedCards.length;
  const freeItems = getVisibleGameMenuItems(isAdult, 'free');
  const premiumItems = getVisibleGameMenuItems(isAdult, 'premium');
  const collectionItems = getVisibleGameMenuItems(isAdult, 'collection');

  const itemDescription = (item: GameMenuItem) => {
    if (item.id === 'collection' && ownedCount > 0) {
      return t('hallOfCards.subtitle', { owned: ownedCount, total: totalCards });
    }
    return t(getGameDescriptionKey(item, isAdult));
  };

  const itemTag = (item: GameMenuItem) => {
    if (item.availability === 'coming-soon') return t('games.comingSoon');
    if (item.availability === 'premium') return t('games.premium');
    return t('games.free');
  };

  const handleItemClick = (item: GameMenuItem) => {
    if (item.availability === 'coming-soon') {
      return;
    }
    if (item.availability === 'premium' && !isPremium) {
      onGoPremium();
      return;
    }
    if (item.screen) onNavigate(item.screen);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold mb-0.5" style={{ color: colors.textPrimary }}>
              {t('games.title')}
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {t('games.subtitle')}
            </p>
          </div>
          {/* Badge palier actuel */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl shrink-0"
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
          >
            <span style={{ fontSize: 14 }}>🌡️</span>
            <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
              {t(`heat.${['', 'tiede', 'chaud', 'ardent', 'brulant', 'incandescent'][heatLevel]}`)}
            </span>
            <span className="text-[10px]" style={{ color: colors.textMuted }}>{points}pts</span>
          </div>
        </div>

        {/* FOMO — contenus verrouillés par chaleur */}
        {(
          [
            { feature: 'scenarios' as const, labelKey: 'heat.fomo_scenarios', palier: 3 },
            { feature: 'kamasutra' as const, labelKey: 'heat.fomo_kamasutra', palier: 4 },
            { feature: 'expert-cards' as const, labelKey: 'heat.fomo_expert', palier: 5 },
          ] as const
        )
          .filter(({ palier }) => heatLevel < palier)
          .map(({ feature: _f, labelKey, palier }) => (
            <div
              key={labelKey}
              className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl"
              style={{ background: '#f9731610', border: '1px solid #f9731630' }}
            >
              <span style={{ fontSize: 12 }}>🔒</span>
              <span className="text-xs font-medium flex-1" style={{ color: '#f97316' }}>
                {t(labelKey)}
              </span>
              <span className="text-[10px]" style={{ color: colors.textMuted }}>
                {t('heat.fomo_pts', { n: String(HEAT_THRESHOLDS[palier as 2 | 3 | 4 | 5] - points) })}
              </span>
            </div>
          ))}
      </motion.div>

      {/* Gratuit */}
      <p
        className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: colors.textMuted }}
      >
        {t('games.includedFree')}
      </p>
      <div className="mb-7">
        {freeItems.map((item, index) => (
          <GameMenuCard
            key={item.id}
            icon={GAME_ICONS[item.icon](colors.textSecondary)}
            title={t(item.titleKey)}
            description={itemDescription(item)}
            tag={itemTag(item)}
            delay={0.1 + index * 0.1}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>

      {/* Premium */}
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: colors.textMuted }}
        >
          {t('games.premium')}
        </p>
        {!isPremium && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onGoPremium}
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: colors.premiumGradient, color: '#fff' }}
          >
            {t('games.seeOffer')}
          </motion.button>
        )}
      </div>

      <div className="space-y-3">
        {premiumItems.map((item, index) => (
          <GameMenuCard
            key={item.id}
            icon={GAME_ICONS[item.icon](colors.textSecondary)}
            title={t(item.titleKey)}
            description={itemDescription(item)}
            tag={itemTag(item)}
            locked={!isPremium}
            lockedLabel={t('games.unlockCTA')}
            delay={0.2 + index * 0.1}
            variant="premium"
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>

      {/* Ma Collection */}
      <div className="mt-7">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: colors.textMuted }}
        >
          {t('games.myCollection')}
        </p>
        {collectionItems.map((item, index) => (
          <GameMenuCard
            key={item.id}
            icon={GAME_ICONS[item.icon](colors.textSecondary)}
            title={t(item.titleKey)}
            description={itemDescription(item)}
            tag={itemTag(item)}
            delay={0.5 + index * 0.1}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </motion.div>
  );
}
