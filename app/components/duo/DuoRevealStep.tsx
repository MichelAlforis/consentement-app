'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart } from 'lucide-react';
import { comfortCategories } from '../../data';
import { CommonGround } from '../../types';

interface DuoRevealStepProps {
  commonGround: CommonGround;
  onComplete: () => void;
}

type CategoryKey = 'tenderness' | 'intensity' | 'trust';
const categoryKeys: CategoryKey[] = ['tenderness', 'intensity', 'trust'];

const categoryEmoji: Record<CategoryKey, string> = {
  tenderness: '🌸',
  intensity: '🔥',
  trust: '⛓️',
};

export function DuoRevealStep({ commonGround, onComplete }: DuoRevealStepProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(-1); // -1 = intro
  const [showItems, setShowItems] = useState(false);
  const [revealedItems, setRevealedItems] = useState<string[]>([]);

  const currentCategoryKey = categoryKeys[currentCategoryIndex];
  const currentCategory = currentCategoryKey ? comfortCategories[currentCategoryKey] : null;

  // Commencer la révélation après 1.5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentCategoryIndex(0);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Révéler les items un par un quand on change de catégorie
  useEffect(() => {
    if (currentCategoryIndex < 0 || !currentCategory) return;

    setShowItems(false);
    setRevealedItems([]);

    // Petit délai avant de montrer les items
    const showTimer = setTimeout(() => {
      setShowItems(true);
    }, 800);

    return () => clearTimeout(showTimer);
  }, [currentCategoryIndex, currentCategory]);

  // Révéler les items progressivement
  useEffect(() => {
    if (!showItems || !currentCategory) return;

    const compatibleItems = currentCategory.items.filter(
      item => commonGround[currentCategoryKey][item.id]?.compatible
    );

    // Si pas d'items compatibles, passer directement à la suite
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

    // Révéler les items un par un
    const itemIds = compatibleItems.map(item => item.id);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < itemIds.length) {
        const idToAdd = itemIds[currentIndex];
        setRevealedItems(prev => [...prev, idToAdd]);
        currentIndex++;
      } else {
        clearInterval(interval);
        // Passer à la catégorie suivante après une pause
        setTimeout(() => {
          if (currentCategoryIndex < categoryKeys.length - 1) {
            setCurrentCategoryIndex(prev => prev + 1);
          } else {
            // Fini ! Passer au summary après un délai
            setTimeout(onComplete, 2000);
          }
        }, 1500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [showItems, currentCategory, currentCategoryKey, commonGround, currentCategoryIndex, onComplete]);

  // Intro
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
          className="text-6xl mb-6"
        >
          ✨
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Découvrons vos zones communes...
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 py-6 min-h-[70vh]"
    >
      {/* Progress dots */}
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
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Catégorie actuelle */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategoryKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {/* Header catégorie */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-5xl block mb-3"
            >
              {categoryEmoji[currentCategoryKey]}
            </motion.span>
            <h3 className="text-xl font-bold text-gray-800">
              {currentCategory.title}
            </h3>
          </motion.div>

          {/* Items révélés */}
          {showItems && (
            <div className="space-y-3 max-w-sm mx-auto">
              {compatibleItems.length > 0 ? (
                compatibleItems.map((item) => {
                  const isRevealed = revealedItems.includes(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={isRevealed ? {
                        opacity: 1,
                        x: 0,
                        scale: 1
                      } : {
                        opacity: 0,
                        x: -20,
                        scale: 0.8
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="flex-1 font-medium text-gray-700">{item.label}</span>
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
                  <p className="text-gray-400 italic">
                    Pas de zones communes ici pour l'instant
                  </p>
                  <p className="text-sm text-gray-300 mt-2">
                    C'est OK — le dialogue reste ouvert
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* Message de fin de catégorie */}
          {allItemsRevealed && compatibleItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6"
            >
              <p className="text-purple-500 font-medium flex items-center justify-center gap-2">
                <Heart size={16} fill="#a855f7" />
                {compatibleItems.length} zone{compatibleItems.length > 1 ? 's' : ''} commune{compatibleItems.length > 1 ? 's' : ''}
              </p>
            </motion.div>
          )}

          {/* Transition vers suivant */}
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
                className="text-gray-400 text-sm"
              >
                Catégorie suivante...
              </motion.div>
            </motion.div>
          )}

          {/* Message final */}
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
                className="text-4xl mb-3"
              >
                💜
              </motion.div>
              <p className="text-lg font-medium text-gray-700">
                Voilà ce que vous partagez
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
