'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { Button, Card, ComfortSlider } from '../ui';
import { comfortCategories } from '../../data';
import { PersonalProfile } from '../../types';

interface DuoFillingStepProps {
  partnerName: string;
  personalProfile: PersonalProfile;
  onUpdateComfort: (category: 'tenderness' | 'intensity' | 'trust', itemId: string, value: number) => void;
  onUpdateSafeword: (safeword: string) => void;
  onComplete: () => void;
}

type CategoryKey = 'tenderness' | 'intensity' | 'trust';
const categoryKeys: CategoryKey[] = ['tenderness', 'intensity', 'trust'];

export function DuoFillingStep({
  partnerName,
  personalProfile,
  onUpdateComfort,
  onUpdateSafeword,
  onComplete,
}: DuoFillingStepProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showSafeword, setShowSafeword] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<'exploring' | 'almost' | 'done'>('exploring');

  const currentCategoryKey = categoryKeys[currentCategoryIndex];
  const currentCategory = comfortCategories[currentCategoryKey];
  const isLastCategory = currentCategoryIndex === categoryKeys.length - 1;

  // Simuler la progression du partenaire
  useEffect(() => {
    const timer1 = setTimeout(() => setPartnerStatus('almost'), 8000 + Math.random() * 5000);
    return () => clearTimeout(timer1);
  }, []);

  const handleNextCategory = () => {
    if (isLastCategory) {
      setShowSafeword(true);
    } else {
      setCurrentCategoryIndex(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  // Messages de status partenaire
  const partnerMessages = {
    exploring: `${partnerName} explore ses zones de confort...`,
    almost: `${partnerName} a presque fini...`,
    done: `${partnerName} a terminé`,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-5 py-6"
    >
      {/* Header avec status partenaire */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Chacun son moment
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Remplis ton profil en privé, à ton rythme
        </p>

        {/* Status partenaire */}
        <motion.div
          className="bg-purple-50 rounded-xl p-3 flex items-center gap-3"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center"
          >
            {partnerStatus === 'done' ? (
              <Check size={16} className="text-purple-600" />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"
              />
            )}
          </motion.div>
          <p className="text-sm text-purple-700 italic">
            {partnerMessages[partnerStatus]}
          </p>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showSafeword ? (
          <motion.div
            key={currentCategoryKey}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Progress */}
            <div className="flex gap-2 mb-6">
              {categoryKeys.map((key, idx) => (
                <div
                  key={key}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    idx <= currentCategoryIndex ? 'bg-purple-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Catégorie actuelle */}
            <Card variant="elevated" padding="lg" className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{currentCategory.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {currentCategory.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {currentCategory.description}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {currentCategory.items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-gray-700 font-medium">{item.label}</span>
                    </div>
                    <ComfortSlider
                      value={personalProfile[currentCategoryKey][item.id] || 0}
                      onChange={(value) => onUpdateComfort(currentCategoryKey, item.id, value)}
                    />
                  </motion.div>
                ))}
              </div>
            </Card>

            <Button
              onClick={handleNextCategory}
              fullWidth
              variant="primary"
            >
              {isLastCategory ? 'Définir mon mot d\'alerte' : 'Continuer'}
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="safeword"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Progress complété */}
            <div className="flex gap-2 mb-6">
              {categoryKeys.map((_, idx) => (
                <div key={idx} className="flex-1 h-1.5 rounded-full bg-purple-500" />
              ))}
            </div>

            <Card variant="elevated" padding="lg" className="mb-4">
              <div className="text-center mb-6">
                <span className="text-4xl mb-3 block">🛡️</span>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Ton mot d'alerte
                </h3>
                <p className="text-sm text-gray-500">
                  Un mot pour dire "stop" à tout moment, sans avoir à expliquer
                </p>
              </div>

              <input
                type="text"
                value={personalProfile.safeword}
                onChange={(e) => onUpdateSafeword(e.target.value)}
                placeholder="Ex: Rouge, Ananas, Stop..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-center text-lg"
              />

              <p className="text-xs text-gray-400 mt-3 text-center">
                Ce mot sera partagé avec {partnerName}
              </p>
            </Card>

            <Button
              onClick={handleFinish}
              fullWidth
              variant="primary"
              disabled={!personalProfile.safeword.trim()}
            >
              J'ai terminé 💜
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
