'use client';

import { motion } from 'framer-motion';
import { User, ShieldAlert, Save } from 'lucide-react';
import { Button, Card, ComfortSlider } from '../ui';
import { comfortCategories } from '../../data';
import { PersonalProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface PersonalSpaceScreenProps {
  profile: PersonalProfile;
  onUpdateLevel: (category: 'tenderness' | 'intensity' | 'trust', itemId: string, value: number) => void;
  onUpdateSafeword: (safeword: string) => void;
  onSave: () => void;
}

export function PersonalSpaceScreen({ profile, onUpdateLevel, onUpdateSafeword, onSave }: PersonalSpaceScreenProps) {
  const { colors } = useTheme();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start gap-3"
      >
        <User size={28} style={{ color: colors.accent }} className="mt-1 shrink-0" />
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Mon profil de confort
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
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
                className="p-4"
                style={{
                  background: `linear-gradient(135deg, ${category.color}18 0%, ${category.color}08 100%)`,
                  borderBottom: `1px solid ${colors.divider}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.span className="text-2xl" whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}>
                    {category.icon}
                  </motion.span>
                  <div>
                    <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{category.title}</h3>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{category.description}</p>
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
                      <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{item.label}</span>
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
        <Card variant="warning" padding="lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <ShieldAlert size={20} style={{ color: colors.warning }} />
            Mon mot d'alerte (safeword)
          </h3>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
            Un mot pour tout arrêter immédiatement, sans discussion.
          </p>
          <input
            type="text"
            placeholder="Ex: rouge, stop, ananas..."
            value={profile.safeword}
            onChange={(e) => onUpdateSafeword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 text-base focus:outline-none transition-colors"
            style={{
              background: colors.bgCard,
              borderColor: colors.warning,
              color: colors.textPrimary,
            }}
          />
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 p-5"
        style={{ background: `linear-gradient(to top, ${colors.bgPrimary} 60%, transparent)` }}
      >
        <Button onClick={onSave} fullWidth size="lg">
          <Save size={20} />
          Sauvegarder mon profil
        </Button>
        <p className="text-xs text-center mt-3" style={{ color: colors.textMuted }}>
          Ces informations restent privées jusqu'à ce que tu choisisses de les partager.
        </p>
      </motion.div>
    </motion.div>
  );
}
