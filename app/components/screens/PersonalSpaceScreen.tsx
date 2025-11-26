'use client';

import { motion } from 'framer-motion';
import { User, ShieldAlert, Save } from 'lucide-react';
import { Button, Card, ComfortSlider } from '../ui';
import { comfortCategories } from '../../data';
import { PersonalProfile } from '../../types';

interface PersonalSpaceScreenProps {
  profile: PersonalProfile;
  onUpdateLevel: (category: 'tenderness' | 'intensity' | 'trust', itemId: string, value: number) => void;
  onUpdateSafeword: (safeword: string) => void;
  onSave: () => void;
}

export function PersonalSpaceScreen({
  profile,
  onUpdateLevel,
  onUpdateSafeword,
  onSave,
}: PersonalSpaceScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pb-24"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start gap-3"
      >
        <User size={28} className="text-pink-500 mt-1 shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Mon profil de confort
          </h2>
          <p className="text-sm text-gray-500">
            Prends le temps de réfléchir à tes zones de confort. C'est personnel.
          </p>
        </div>
      </motion.div>

      {/* Categories */}
      {(Object.entries(comfortCategories) as [keyof typeof comfortCategories, typeof comfortCategories.tenderness][]).map(
        ([key, category], catIndex) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.15 }}
            className="mb-6"
          >
            <Card variant="elevated" padding="none" className="overflow-hidden">
              {/* Category Header */}
              <div
                className="p-4 border-b border-gray-100"
                style={{
                  background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}08 100%)`
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-2xl"
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                  >
                    {category.icon}
                  </motion.span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{category.title}</h3>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIndex * 0.15 + itemIndex * 0.05 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <ComfortSlider
                      value={profile[key][item.id] ?? 0}
                      onChange={(value) => onUpdateLevel(key, item.id, value)}
                    />
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )
      )}

      {/* Safeword */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <Card variant="gradient-amber" padding="lg">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-600" />
            Mon mot d'alerte (safeword)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Un mot pour tout arrêter immédiatement, sans discussion.
          </p>
          <input
            type="text"
            placeholder="Ex: rouge, stop, ananas..."
            value={profile.safeword}
            onChange={(e) => onUpdateSafeword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-white/80 backdrop-blur text-base focus:outline-none focus:border-amber-400 transition-colors"
          />
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-rose-50 via-rose-50 to-transparent"
      >
        <Button onClick={onSave} fullWidth size="lg">
          <Save size={20} />
          Sauvegarder mon profil
        </Button>
        <p className="text-xs text-gray-400 text-center mt-3">
          Ces informations restent privées jusqu'à ce que tu choisisses de les partager.
        </p>
      </motion.div>
    </motion.div>
  );
}
