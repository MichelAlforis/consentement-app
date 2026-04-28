'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart } from 'lucide-react';
import { comfortCategories } from '../../data';
import { DynamicIcon } from '../../utils/iconFromName';
import type { IconName } from '../../utils/iconFromName';
import { CommonGround } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface DuoRevealStepProps {
  commonGround: CommonGround;
  onComplete: () => void;
}

type CategoryKey = 'tenderness' | 'intensity' | 'trust';
const categoryKeys: CategoryKey[] = ['tenderness', 'intensity', 'trust'];

const categoryIconName: Record<CategoryKey, IconName> = {
  tenderness: 'Heart',
  intensity: 'Flame',
  trust: 'ShieldCheck',
};

export function DuoRevealStep({ commonGround, onComplete }: DuoRevealStepProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(-1);
  const [showItems, setShowItems] = useState(false);
  const [revealedItems, setRevealedItems] = useState<string[]>([]);

  const currentCategoryKey = categoryKeys[currentCategoryIndex];
  const currentCategory = currentCategoryKey ? comfortCategories[currentCategoryKey] : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentCategoryIndex(0);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentCategoryIndex < 0 || !currentCategory) return;
    setShowItems(false);
    setRevealedItems([]);
    const showTimer = setTimeout(() => {
      setShowItems(true);
    }, 800);
    return () => clearTimeout(showTimer);
  }, [currentCategoryIndex, currentCategory]);

  useEffect(() => {
    if (!showItems || !currentCategory) return;

    const compatibleItems = currentCategory.items.filter(
      item => commonGround[currentCategoryKey][item.id]?.compatible
    );

    if (compatibleItems.length === 0) {
      const timer = setTimeout(() => {
        if (currentCategoryIndex < categoryKeys.length - 1) {
          setCurrentCategoryIndex(prev => prev + 1);
        } else {
          setTimeout(onComplete, 1500);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }

    const itemIds = compatibleItems.map(item => item.id);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < itemIds.length) {
        const idToAdd = itemIds[currentIndex];
        setRevealedItems(prev => [...prev, idToAdd]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (currentCategoryIndex < categoryKeys.length - 1) {
            setCurrentCategoryIndex(prev => prev + 1);
          } else {
            setTimeout(onComplete, 2000);
          }
        }, 1500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [showItems, currentCategory, currentCategoryKey, commonGround, currentCategoryIndex, onComplete]);

  if (currentCategoryIndex < 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] px-6"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mb-6"
        >
          <DynamicIcon name="Sparkles" size={60} />
        </motion.div>
        <h2 className="text-2xl font-bold text-center" style={{ color: colors.textPrimary }}>
          {t('duo.reveal.intro')}
        </h2>
      </motion.div>
    );
  }

  if (!currentCategory) return null;

  const compatibleItems = currentCategory.items.filter(
    item => commonGround[currentCategoryKey][item.id]?.compatible
  );

  const isLastCategory = currentCategoryIndex === categoryKeys.length - 1;
  const allItemsRevealed = revealedItems.length === compatibleItems.length;
  const zoneCount = compatibleItems.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 py-6 min-h-[70vh]"
    >
      <div className="flex justify-center gap-3 mb-8">
        {categoryKeys.map((key, idx) => (
          <motion.div
            key={key}
            animate={{
              scale: idx === currentCategoryIndex ? 1.2 : 1,
              opacity: idx <= currentCategoryIndex ? 1 : 0.3,
            }}
            className={`w-3 h-3 rounded-full ${
              idx < currentCategoryIndex
                ? 'bg-green-400'
                : idx === currentCategoryIndex
                ? 'bg-purple-500'
                : ''
            }`}
            style={idx >= currentCategoryIndex && idx !== currentCategoryIndex ? { background: colors.divider } : {}}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategoryKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-3"
            >
              <DynamicIcon name={categoryIconName[currentCategoryKey]} size={56} />
            </motion.div>
            <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              {t(`comfort.${currentCategoryKey}.title`)}
            </h3>
          </motion.div>

          {showItems && (
            <div className="space-y-3 max-w-sm mx-auto">
              {compatibleItems.length > 0 ? (
                compatibleItems.map((item) => {
                  const isRevealed = revealedItems.includes(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={isRevealed ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -20, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="rounded-xl p-4 shadow-sm border flex items-center gap-3"
                      style={{ background: colors.bgCard, borderColor: colors.border }}
                    >
                      <DynamicIcon name={item.iconName} size={22} />
                      <span className="flex-1 font-medium" style={{ color: colors.textSecondary }}>
                        {t(`comfort.${currentCategoryKey}.items.${item.id}`)}
                      </span>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={isRevealed ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                      >
                        <Check size={20} className="text-green-500" />
                      </motion.div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <p className="italic" style={{ color: colors.textMuted }}>
                    {t('duo.reveal.noCommon')}
                  </p>
                  <p className="text-sm mt-2" style={{ color: colors.divider }}>
                    {t('duo.reveal.noCommonSub')}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {allItemsRevealed && compatibleItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6"
            >
              <p className="text-purple-500 font-medium flex items-center justify-center gap-2">
                <Heart size={16} fill="#a855f7" />
                {zoneCount} {zoneCount > 1 ? t('duo.reveal.zones') : t('duo.reveal.zone')}
              </p>
            </motion.div>
          )}

          {allItemsRevealed && !isLastCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-8"
            >
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-sm"
                style={{ color: colors.textMuted }}
              >
                {t('duo.reveal.nextCat')}
              </motion.div>
            </motion.div>
          )}

          {allItemsRevealed && isLastCategory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: 2 }}
                className="mb-3 flex justify-center"
              >
                <Heart size={40} fill="#a855f7" className="text-purple-500" />
              </motion.div>
              <p className="text-lg font-medium" style={{ color: colors.textSecondary }}>
                {t('duo.reveal.share')}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
