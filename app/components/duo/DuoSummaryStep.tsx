'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldAlert, MessageCircle, AlertTriangle, ChevronDown, ChevronUp, Check, PenLine } from 'lucide-react';
import { Card, Button } from '../ui';
import { comfortCategories } from '../../data';
import { CommonGround, PersonalProfile } from '../../types';

interface DuoSummaryStepProps {
  commonGround: CommonGround;
  personalProfile: PersonalProfile;
  partnerName: string;
  partnerSafeword: string;
}

type CategoryKey = 'tenderness' | 'intensity' | 'trust';
const categoryKeys: CategoryKey[] = ['tenderness', 'intensity', 'trust'];

export function DuoSummaryStep({
  commonGround,
  personalProfile,
  partnerName,
  partnerSafeword,
}: DuoSummaryStepProps) {
  const [expandedCategories, setExpandedCategories] = useState<CategoryKey[]>(['tenderness']);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const toggleCategory = (key: CategoryKey) => {
    setExpandedCategories(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  // Compter les zones communes totales
  const totalCommon = categoryKeys.reduce((acc, key) => {
    const count = comfortCategories[key].items.filter(
      item => commonGround[key][item.id]?.compatible
    ).length;
    return acc + count;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 py-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 mx-auto mb-4 flex items-center justify-center"
        >
          <Heart size={32} className="text-purple-500" fill="#a855f7" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Votre espace commun
        </h2>
        <p className="text-gray-500">
          {totalCommon} zone{totalCommon > 1 ? 's' : ''} de confort partagée{totalCommon > 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Catégories accordéon */}
      <div className="space-y-3 mb-6">
        {categoryKeys.map((key, catIndex) => {
          const category = comfortCategories[key];
          const isExpanded = expandedCategories.includes(key);
          const compatibleItems = category.items.filter(
            item => commonGround[key][item.id]?.compatible
          );

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <Card variant="elevated" padding="none" className="overflow-hidden">
                {/* Header clickable */}
                <button
                  onClick={() => toggleCategory(key)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}10 0%, transparent 100%)`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium text-gray-800">{category.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                      {compatibleItems.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Contenu */}
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 space-y-2">
                    {compatibleItems.length > 0 ? (
                      compatibleItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="flex-1 text-sm text-gray-700">{item.label}</span>
                          <Check size={18} className="text-green-500" />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic py-2">
                        Pas de zones communes dans cette catégorie
                      </p>
                    )}
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Safewords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="gradient-amber" padding="lg" className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-600" />
            Vos mots d'alerte
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 bg-white/80 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Toi</p>
              <p className="font-semibold text-red-500">
                {personalProfile.safeword || 'Non défini'}
              </p>
            </div>
            <div className="flex-1 bg-white/80 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">{partnerName}</p>
              <p className="font-semibold text-red-500">{partnerSafeword}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notes optionnelles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="default" padding="md" className="mb-4">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full flex items-center justify-between"
          >
            <span className="flex items-center gap-2 text-gray-700">
              <PenLine size={18} className="text-purple-500" />
              <span className="font-medium">Ajouter des notes</span>
              <span className="text-xs text-gray-400">(optionnel)</span>
            </span>
            {showNotes ? (
              <ChevronUp size={18} className="text-gray-400" />
            ) : (
              <ChevronDown size={18} className="text-gray-400" />
            )}
          </button>

          {showNotes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Des précisions, des envies à explorer, des limites à clarifier..."
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm resize-none"
                rows={3}
              />
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Message final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card
          variant="default"
          padding="lg"
          className="mb-3 !bg-gradient-to-br !from-purple-50 !to-pink-50 !border-purple-100"
        >
          <p className="text-center text-gray-700 flex items-center justify-center gap-2">
            <MessageCircle size={18} className="text-purple-500" />
            <em>Ceci est un début de conversation, pas une fin.</em>
          </p>
        </Card>

        <Card variant="default" padding="md">
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            Rappel : le consentement est révocable à tout moment.
            <br />
            Cette comparaison n'est pas un engagement.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
